
import { lazyReportBatch } from '../utils/report'

const originalFetch = window.fetch

function overwriteFetch() {
    window.fetch = function newFetch(url, config) {
        const startTime = Date.now()
        const reportData = {
            startTime,
            url,
            method: (config?.method || 'GET').toUpperCase(),
            subType: 'fetch',
            type: 'performance',
        }
        return originalFetch(url, config)
        .then(res => {
            reportData.endTime = Date.now()
            reportData.duration = reportData.endTime - reportData.startTime

            const data = res.clone()
            reportData.status = data.status
            reportData.success = data.ok
             //上报数据
            lazyReportBatch(reportData);
            return res
        })
        .catch(err => {
            reportData.endTime = Date.now();
            reportData.duration = reportData.endTime - reportData.startTime;
            reportData.status = 0;
            reportData.success = false;
             //上报数据
            lazyReportBatch(reportData);
        })
    }
}

export default function fetch() {
    overwriteFetch()
}