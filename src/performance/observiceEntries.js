import { lazyReportBatch } from '../utils/report';

// 统计静态资源加载性能
export default function observeEntries(){
    if(document.readyState==='complete'){
       observeEvent()
    }else{
        const onLoad = ()=>{
           observeEvent();
           window.removeEventListener('load',onLoad,true)
        }
        window.addEventListener('load',onLoad,true)
    }
}

export function observeEvent(){
    const entryHandler = (list)=>{
        const data = list.getEntries();
        for(let entry of data){
            if(observer){
                observer.disconnect();
            }
            const reportData = {
                name: entry.name, // 资源名字
                type: 'performance', // 统计类型
                subType: entry.entryType,// entry 类型
                sourceType: entry.initiatorType, // 资源类型
                duration: entry.duration,// 资源加载时间
                dns: entry.domainLookupEnd - entry.domainLookupStart,// dns 解析时间
                tcp: entry.connectEnd-entry.connectStart,// tcp 建连时间
                redirect: entry.redirectEnd - entry.redirectStart,// 重定向时间
                ttdb: entry.respinseStart,// 首字节时间
                protocol: entry.nextHopProtocol, // 请求协议
                responseBodySize: entry.encodeBodySize,// 响应内容大小
                responseHandlerSize: entry.transferSize-entry.encodeBodySize, // 响应头部大小
                transferSize: entry.transferSize,// 请求内容大小，
                resourceSize: entry.decodeBodySize,//资源解压后的大小,
                startTime: performance.now(),// 
            }
            // 上报数据
            lazyReportBatch(reportData)
        }
        
    }
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({type:['resource'],buffered:true});
}

