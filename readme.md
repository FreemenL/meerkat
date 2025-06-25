### 前端监控系统

###### 监控的目的: 

1. 事前预警
2. 事后分析 
3. 性能分析 错误分析 
4. 提供决策


###### 监控的流程:

    数据采集，数据上报 数据看板 错误还原 监控报警;

###### 监控的内容（数据采集）:

    性能监控 错误监控 用户行为监控

    性能监控:

        performance 性能监控

            - FP  从用户输入url到页面上有内容展示出来的时间  白屏时间
            - FCP 首次内容绘制时间  <=1s
            - LCP 最大内容绘制时间  <=2s
            - FID 首次输入延迟     <=100ms
            - CLS 累计布局偏移     <=0.1s
            - TTFB 页面发出请求到接收到第一个字节的时间（首字节时间） <=100毫秒
            
        xhr 接口性能:

            修改 XMLHttpRequest.prototype 的send和open 方法;

    错误监控:

        1. js 代码运行错误 语法错误
        2. 异步错误等
        3. 静态资源加载错误
        4. 接口请求报错

        错误类型:

  
            RangeError 范围错误 数组范围错误。
            EvalError  eval 函数错误。
            ReferenceError 引用错误, 使用未定义的变量。
            SyntaxError 语法错误
            typeError 类型错误
            urlError  给encode或者decode 传参无效
            promise错误 

        错误捕获方式:

            1.try catch 捕获语法错误和运行时错误                                     - 不能捕获异步错误
            2.window.onerror 捕获全局异常错误，包括同步和异步的错误                    - 不能捕获资源加载的错误
            3.window.addEventListener 捕获资源加载错误包括图片 script style 加载错误  - 不能捕获new image错误和fetch错误
        
        框架react/vue

        react
            封装 ErrorBoundary 组件 在componentDidCatch 中进行数据上报
        vue
            Vue.config.errorHandler 中上报错误

      用户行为监控

        pv uv(服务端来做)
        页面停留时间
        按钮点击监控

###### 数据上报：
     
    上报方法:

        1. sendBeacon
        2. xhr
        3. image gif

    上报时机:

        requestidleCallback
        setTimeout


###### 性能指标

- FP  从用户输入url到页面上有内容展示出来的时间  白屏时间
- FCP 首次内容绘制时间  <=1s
- LCP 最大内容绘制时间  <=2s
- FID 首次输入延迟     <=100ms
- CLS 累计布局偏移     <=0.1s
- TTFB 页面发出请求到接收到第一个字节的时间（首字节时间） <=100毫秒



