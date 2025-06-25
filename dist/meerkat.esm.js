var config = {
  url: 'http://127.0.0.1:8080/api',
  projectName: 'eyesdk',
  appId: '123456',
  userId: '123123123',
  batchSize: 20
};
function setConfig(options) {
  for (var key in options) {
    if (config[key]) {
      config[key] = options[key];
    }
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

function deepCopy(target) {
  if (_typeof(target) === 'object') {
    var result = Array.isArray(target) ? [] : {};
    for (var key in target) {
      if (_typeof(target[key]) == 'object') {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }
  return target;
}
function generateUniqueID() {
  return "meerkat-".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
}

var cache = [];
function getCache() {
  return deepCopy(cache);
}
function addCache(data) {
  cache.push(data);
}
function clearCache() {
  cache.length = 0;
}

var originalProto = XMLHttpRequest.prototype;
var originalSend = originalProto.send;
var originalOpen = originalProto.open;
function lazyReportBatch(data) {
  console.log("data", data);
  addCache(data);
  var reqData = getCache();
  if (reqData.length && reqData.length > config.batchSize) {
    console.log('data----', reqData);
    report(reqData);
    clearCache();
  }
}
function report(data) {
  if (!config.url) {
    console.log('请设置上传的url地址');
  }
  var reportData = JSON.stringify({
    id: generateUniqueID(),
    data: data
  });
  if (isSupportSendBeacon()) {
    sendBeaconRequest(config, reportData);
  } else {
    if (config.useImageUpload) {
      imgRequest(config, reportData);
    } else {
      console.log('config.url', config.url);
      xhrRequest(config.url, reportData);
    }
  }
}

// 发送图片数据
function imgRequest(config, data) {
  var img = new Image();
  img.src = "".concat(config.url, "?data=").concat(encodeURIComponent(JSON.stringify(data)));
}

// xhr
function xhrRequest(url, data) {
  var xhr = new XMLHttpRequest();
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      originalOpen.call(xhr, 'post', url);
      originalSend.call(xhr, JSON.stringify(data));
      console.log('data', data);
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      console.log('request2');
      originalOpen.call(xhr, 'post', url);
      originalSend.call(xhr, JSON.stringify(data));
    });
  }
}
// sendBeacon
function isSupportSendBeacon() {
  var _window$navigator;
  return !!((_window$navigator = window.navigator) !== null && _window$navigator !== void 0 && _window$navigator.sendBeacon);
}
// const sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : xhrRequest
var sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : function (url, data) {
  return xhrRequest(url, data);
};
function sendBeaconRequest(config, data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      sendBeacon(config.url, data);
    }, {
      timeout: 3000
    });
  } else {
    setTimeout(function () {
      sendBeacon(config.url, data);
    });
  }
}

var originalFetch = window.fetch;
function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    var startTime = Date.now();
    var reportData = {
      startTime: startTime,
      url: url,
      method: ((config === null || config === void 0 ? void 0 : config.method) || 'GET').toUpperCase(),
      subType: 'fetch',
      type: 'performance'
    };
    return originalFetch(url, config).then(function (res) {
      reportData.endTime = Date.now();
      reportData.duration = reportData.endTime - reportData.startTime;
      var data = res.clone();
      reportData.status = data.status;
      reportData.success = data.ok;
      //上报数据
      lazyReportBatch(reportData);
      return res;
    }).catch(function (err) {
      reportData.endTime = Date.now();
      reportData.duration = reportData.endTime - reportData.startTime;
      reportData.status = 0;
      reportData.success = false;
      //上报数据
      lazyReportBatch(reportData);
    });
  };
}
function fetch() {
  overwriteFetch();
}

// 统计静态资源加载性能
function observeEntries() {
  if (document.readyState === 'complete') {
    observeEvent();
  } else {
    var _onLoad = function onLoad() {
      observeEvent();
      window.removeEventListener('load', _onLoad, true);
    };
    window.addEventListener('load', _onLoad, true);
  }
}
function observeEvent() {
  var entryHandler = function entryHandler(list) {
    var data = list.getEntries();
    var _iterator = _createForOfIteratorHelper(data),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (observer) {
          observer.disconnect();
        }
        var reportData = {
          name: entry.name,
          // 资源名字
          type: 'performance',
          // 统计类型
          subType: entry.entryType,
          // entry 类型
          sourceType: entry.initiatorType,
          // 资源类型
          duration: entry.duration,
          // 资源加载时间
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          // dns 解析时间
          tcp: entry.connectEnd - entry.connectStart,
          // tcp 建连时间
          redirect: entry.redirectEnd - entry.redirectStart,
          // 重定向时间
          ttdb: entry.respinseStart,
          // 首字节时间
          protocol: entry.nextHopProtocol,
          // 请求协议
          responseBodySize: entry.encodeBodySize,
          // 响应内容大小
          responseHandlerSize: entry.transferSize - entry.encodeBodySize,
          // 响应头部大小
          transferSize: entry.transferSize,
          // 请求内容大小，
          resourceSize: entry.decodeBodySize,
          //资源解压后的大小,
          startTime: performance.now() // 
        };
        // 上报数据
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: ['resource'],
    buffered: true
  });
}

// 统计页面load时间
function observeLoad() {
  window.addEventListener('pageShow', function (event) {
    requestAnimationFrame(function () {
      ['load'].forEach(function (type) {
        var reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          startTime: performance.now() - event.timeStamp
        };
        lazyReportBatch(reportData);
      });
    }, true);
  });
}

function observerFCP() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === 'first-content-paint') {
          observer.disconnect();
          var json = entry.toJSON();
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: 'performance',
            subType: entry.name,
            pageUrl: window.location.href
          });
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  // 统计计算fp 页面白屏时间
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: 'paint',
    buffered: true
  });
}

function observerLCP() {
  var entryHandler = function entryHandler(list) {
    if (observer) {
      observer.disconnect();
    }
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _entry$element;
        var entry = _step.value;
        var json = entry.toJSON();
        console.log('json', json);
        var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
          target: (_entry$element = entry.element) === null || _entry$element === void 0 ? void 0 : _entry$element.tagName,
          name: entry.entryType,
          subType: entry.entryType,
          type: 'performance',
          pageURL: window.location.href
        });
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: 'largest-contentful-paint',
    buffered: true
  });
}

function observerPaint() {
  var entryHandler = function entryHandler(list) {
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.name === 'first-paint') {
          observer.disconnect();
          var json = entry.toJSON();
          console.log(json);
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: 'performance',
            subType: entry.name,
            pageUrl: window.location.href
          });
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  // 统计计算fp 页面白屏时间
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: 'paint',
    buffered: true
  });
}

function performance$1() {
  fetch();
  observeEntries();
  observeLoad();
  observerFCP();
  observerLCP();
  observerPaint();
}

function error() {
  // 捕获资源加载错误
  window.addEventListener('error', function (event) {
    var target = event.target;
    if (!target) {
      return;
    }
    if (target.src || target.href) {
      var url = target.src || target.href;
      var reportData = {
        type: 'error',
        subType: 'resource',
        url: url,
        html: target.outerHTML,
        pageUrl: window.location.href,
        paths: event.path,
        resourceType: target.tagName
      };
      lazyReportBatch(reportData);
    }
  }, true);
  // 捕获js错误
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    var reportData = {
      type: 'error',
      subType: 'js',
      msg: msg,
      url: url,
      lineNo: lineNo,
      columnNo: columnNo,
      stack: error.stack,
      pageUrl: window.location.href
    };
    lazyReportBatch(reportData);
  };
  // 捕获 promise 错误
  window.addEventListener('unhandledrejection', function (event) {
    var _event$reason;
    var reportData = {
      type: 'error',
      subType: 'promise',
      reason: (_event$reason = event.reason) === null || _event$reason === void 0 ? void 0 : _event$reason.stack,
      pageUrl: window.location.href,
      startTIme: event.timeStamp
    };
    lazyReportBatch(reportData);
  }, true);
}

function onClick() {
  ['mousedown', 'touchstart'].forEach(function (eventType) {
    window.addEventListener(eventType, function (event) {
      var _event$composedPath;
      var target = event.target;
      var _target$getBoundingCl = target.getBoundingClientRect(),
        top = _target$getBoundingCl.top,
        left = _target$getBoundingCl.left;
      lazyReportBatch({
        top: top,
        left: left,
        eventType: eventType,
        pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        type: 'behavior',
        subType: 'click',
        target: target.tagName,
        paths: event.path || (event === null || event === void 0 || (_event$composedPath = event.composedPath()) === null || _event$composedPath === void 0 ? void 0 : _event$composedPath.map(function (item) {
          return item.tagName;
        })),
        startTime: event.timeStamp,
        pageURL: window.location.href,
        outerHTML: target.outerHTML,
        innerHTML: target.innerHTML,
        width: target.offsetWidth,
        height: target.offsetHeight,
        uuid: generateUniqueID()
      });
    });
  });
}

// 上报页面改变事件
function pageChange() {
  var oldURL = '';
  window.addEventListener('hashchange', function (event) {
    var newURL = event.newURL;
    lazyReportBatch({
      from: oldURL,
      to: newURL,
      type: 'behavior',
      subType: 'hashchange',
      startTime: performance.now(),
      uuid: generateUniqueID()
    });
    oldURL = newURL;
  }, true);
  var from = '';
  window.addEventListener('popstate', function () {
    var to = window.location.href;
    lazyReportBatch({
      from: from,
      to: to,
      type: 'behavior',
      subType: 'popstate',
      startTime: performance.now(),
      uuid: generateUniqueID()
    });
    from = to;
  }, true);
}

// 上报pv数据;

function pv() {
  lazyReportBatch({
    type: 'behavior',
    subType: 'pv',
    startTime: performance.now(),
    pageURL: window.location.href,
    referrer: document.referrer,
    uuid: generateUniqueID()
  });
}

function behavior() {
  pv();
  pageChange();
  onClick();
}

window.__webEyeSDK__ = {
  version: '1.0.0'
};
function install(Vue, options) {
  if (window.__webEyeSDK__.vue) {
    return;
  }
  setConfig(options);
  window.__webEyeSDK__.vue = true;
  var handler = Vue.config.errorHandler;
  Vue.config.errorHandler = function (err, vm, info) {
    var reportData = {
      info: info,
      error: err.stack,
      subType: 'vue',
      type: 'error',
      startTime: window.performance.now(),
      pageURL: window.location.href
    };
    lazyReportBatch(reportData);
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}
function errorBoundary(err, info) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (window.__webEyeSDK__.react) {
    return;
  }
  window.__webEyeSDK__.react = true;
  setConfig(options);
  var reportData = {
    info: info,
    error: err === null || err === void 0 ? void 0 : err.stack,
    subType: 'react',
    type: 'error',
    startTime: window.performance.now(),
    pageURL: window.location.href
  };
  lazyReportBatch(reportData);
}
function init(options) {
  setConfig(options);
  // error();
  // performance();
  behavior();
}
var index = {
  errorBoundary: errorBoundary,
  install: install,
  performance: performance$1,
  behavior: behavior,
  error: error,
  init: init
};

export { index as default };
//# sourceMappingURL=meerkat.esm.js.map
