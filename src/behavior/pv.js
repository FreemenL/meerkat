
import { lazyReportBatch } from '../utils/report'
import { generateUniqueID } from '../utils/index'

// 上报pv数据;

export default function pv() {
    lazyReportBatch({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: window.location.href,
        referrer: document.referrer,
        uuid: generateUniqueID(),
    })
}