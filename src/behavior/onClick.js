
import { lazyReportBatch } from '../utils/report'
import { generateUniqueID } from '../utils/index'

export default function onClick() {
    ['mousedown', 'touchstart'].forEach(eventType => {
        window.addEventListener(eventType, event => {
            const target = event.target
            const { top, left } = target.getBoundingClientRect()
            lazyReportBatch({
                top,
                left,
                eventType,
                pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
                scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                type: 'behavior',
                subType: 'click',
                target: target.tagName,
                paths: event.path?.map(item => item.tagName).filter(Boolean),
                startTime: event.timeStamp,
                pageURL: getPageURL(),
                outerHTML: target.outerHTML,
                innerHTML: target.innerHTML,
                width: target.offsetWidth,
                height: target.offsetHeight,
                uuid: generateUniqueID(),
            })
        })
    })
}