import { lazyReportBatch } from '../utils/report';

export default function observerLCP(){
  const entryHandler = (list) => {
        if (observer) {
            observer.disconnect()
        }
        for (const entry of list.getEntries()) {
            const json = entry.toJSON()
            console.log('json',json);
            const reportData = {
                ...json,
                target: entry.element?.tagName,
                name: entry.entryType,
                subType: entry.entryType,
                type: 'performance',
                pageURL: window.location.href,
            }
            lazyReportBatch(reportData)
        }
    }

    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'largest-contentful-paint', buffered: true })

}
