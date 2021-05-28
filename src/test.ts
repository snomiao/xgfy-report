
export function 相等断言(a, b, msg = '', ...msgs) {
    if (JSON.stringify(a) === JSON.stringify(b)) {
        return true
    } else {
        console.warn('相等断言错误', a, b, msg, ...msgs)
        return false
    }
}