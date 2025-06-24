import { lazyReportBatch } from '../utils/report';

export default function observerLCP(){
    const entryHandler = (list)=>{
    if(observer){
            observer.disconnect()
    }
    for(const entry of list.getEntries()) {
                const json = entry.toJSON();
                console.log(json);
                const reportData = {
                    ...json,
                    type: 'performance',
                    subType: entry.name,
                    pageUrl: window.location.href
                }
                lazyReportBatch(reportData);
    }
    }

    // 统计计算LCP 最大内容绘制时间
    const observer = new PerformanceObserver(entryHandler);

    observer.observe({type:'largest-contentful-paint',buffered:true})

}
