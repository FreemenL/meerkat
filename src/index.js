import performance from "./performance/index";
import error from "./error/index";
import behavior from "./behavior/index";
import { setConfig } from "./utils/config";
import { lazyReportBatch } from './utils/report'

window.__webEyeSDK__ = {
    version: '1.0.0'
}

function install(Vue,options){
    if(window.__webEyeSDK__.vue){
        return
    }
    setConfig(options)
    window.__webEyeSDK__.vue=true;
    const handler = Vue.config.errorHandler;
    Vue.config.errorHandler = function(err,vm,info){

        const reportData = {
            info,
            error:err.stack,
            subType:'vue',
            type:'error',
            startTime:window.performance.now(),
            pageURL: window.location.href
        }

        lazyReportBatch(reportData);

        if(handler){
            handler.call(this,err,vm,info)
        }
    }
}

function errorBoundary(err,info,options={}){
    if(window.__webEyeSDK__.react){
        return
    }
    window.__webEyeSDK__.react = true;
    setConfig(options);
    const reportData = {
        info,
        error:err?.stack,
        subType:'react',
        type:'error',
        startTime:window.performance.now(),
        pageURL: window.location.href
    }

    lazyReportBatch(reportData);
}   


function init (options){
    setConfig(options);
    // error();
    // performance();
    behavior();
}

export default {
    errorBoundary,
    install,
    performance,
    behavior,
    error,
    init,
}