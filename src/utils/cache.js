import { deepCopy } from './index'

const cache = []

export function getCache() {
    return deepCopy(cache)
}

export function addCache(data) {
    cache.push(data)
}

export function clearCache() {
    cache.length = 0
}
