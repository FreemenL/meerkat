
import { lazyReportBatch } from '../utils/report'

export default function observerFCP(){
    const entryHandler = (list)=>{
    for(const entry of list.getEntries()) {
            if(entry.name==='first-content-paint'){
                observer.disconnect();
                const json = entry.toJSON();
                const reportData = {
                    ...json,
                    type: 'performance',
                    subType: entry.name,
                    pageUrl: window.location.href
                }
                lazyReportBatch(reportData);
            }
    }
    }
    
    // 统计计算fp 页面白屏时间
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({type:'paint',buffered:true});
}