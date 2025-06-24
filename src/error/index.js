
import { lazyReportBatch } from '../utils/report'

export default function error(){
    // 捕获资源加载错误
    window.addEventListener('error',(event)=>{
        const target = event.target;
        if(!target){
            return;
        }
        if(target.src||target.href){
            const url = target.src||target.href;
            const reportData = {
                type:'error',
                subType:'resource',
                url,
                html:target.outerHTML,
                pageUrl: window.location.href,
                paths: event.path.map(item => item.tagName).filter(Boolean),
                resourceType: target.tagName
            }
            lazyReportBatch(reportData)
        }
    },true)
    // 捕获js错误
    window.onerror = function(msg,url,lineNo,columnNo,error){
        const reportData={
            type:'error',
            subType:'js',
            msg,
            url,
            lineNo,
            columnNo,
            stack:error.stack,
            pageUrl:window.location.href
        }
        lazyReportBatch(reportData)
    }
    // 捕获 promise 错误
    window.addEventListener('unhandledrejection',(event)=>{
        const reportData = {
            type:'error',
            subType:'promise',
            reason: event.reason?.stack,
            pageUrl:window.location.href,
            startTIme: event.timeStamp
        }
        lazyReportBatch(reportData)
    },true)

}