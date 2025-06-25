import config  from "./config";
import { generateUniqueID } from './index'
import { addCache, clearCache, getCache } from "./cache";
export const originalProto = XMLHttpRequest.prototype;
export const originalSend = originalProto.send;
export const originalOpen = originalProto.open;

export function lazyReportBatch(data){
    console.log(`data`,data);
    addCache(data);
    const reqData = getCache();
    if(reqData.length&&reqData.length>config.batchSize){
        console.log('data----',reqData)
        report(reqData);
        clearCache();
    }
}

export function report(data){
    if(!config.url){
        console.log('请设置上传的url地址');
    }

    const reportData = JSON.stringify({
        id: generateUniqueID(),
        data
    })

    if(isSupportSendBeacon()){
        sendBeaconRequest(config,reportData);
    }else{
        if(config.useImageUpload){
            imgRequest(config,reportData);
        }else{
            console.log('config.url',config.url);
            xhrRequest(config.url, reportData)
        }
    }
} 

// 发送图片数据
export function imgRequest(config,data){
    const img = new Image();
    img.src=`${config.url}?data=${encodeURIComponent(JSON.stringify(data))}`
}

// xhr
export function xhrRequest(url, data) {
    const xhr = new XMLHttpRequest()
    if (window.requestIdleCallback) {
         window.requestIdleCallback(() => {
            originalOpen.call(xhr, 'post', url)
            originalSend.call(xhr, JSON.stringify(data))
            console.log('data', data)
        }, { timeout: 3000 })
    } else {
        setTimeout(() => {
            console.log('request2')
            originalOpen.call(xhr, 'post', url)
            originalSend.call(xhr, JSON.stringify(data))
        })
    }
}
// sendBeacon
export function isSupportSendBeacon() {
    return !!window.navigator?.sendBeacon
}
// const sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : xhrRequest
const sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : (url, data) => xhrRequest(url, data)
export function sendBeaconRequest(config,data) {
     if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            sendBeacon(config.url, data)
        }, { timeout: 3000 })
    } else {
        setTimeout(() => {
            sendBeacon(config.url, data)
        })
    }
}

