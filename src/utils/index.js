export function deepCopy(target) {
    if (typeof target === 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }
        return result
    }

    return target
}

export function generateUniqueID() {
    return `meerkat-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
}