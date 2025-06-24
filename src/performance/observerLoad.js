// 统计页面load时间
import { lazyReportBatch } from '../utils/report';

export default function observeLoad(){  
    window.addEventListener('pageShow',function(event){
        requestAnimationFrame(()=>{
            ['load'].forEach((type)=>{
                const reportData = {
                    type:'performance',
                    subType:type,
                    pageUrl:window.location.href,
                    startTime: performance.now()- event.timeStamp
                }
                lazyReportBatch(reportData)
            })
        },true)
    })
}
