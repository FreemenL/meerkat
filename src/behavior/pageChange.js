import { lazyReportBatch } from '../utils/report'
import { generateUniqueID } from '../utils/index'

// 上报页面改变事件
export default function pageChange() {
    let oldURL = '';
    window.addEventListener('hashchange', event => {
        const newURL = event.newURL
        lazyReportBatch({
            from: oldURL,
            to: newURL,
            type: 'behavior',
            subType: 'hashchange',
            startTime: performance.now(),
            uuid: generateUniqueID(),
        })
        oldURL = newURL
    }, true)

    let from = ''
    window.addEventListener('popstate', () => {
        const to = window.location.href;
        lazyReportBatch({
            from,
            to,
            type: 'behavior',
            subType: 'popstate',
            startTime: performance.now(),
            uuid: generateUniqueID(),
        })
        from = to
    }, true)
}