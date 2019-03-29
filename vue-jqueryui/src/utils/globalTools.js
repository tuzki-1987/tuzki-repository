export default class globalTools {
    // 获取当前日期
    static getNowDate() {
        let d = new Date()
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let date = d.getDate()
        let result = ''
        month = month < 10 ? '0' + month : month
        date = date < 10 ? '0' + date : date
        result = year + '-' + month + '-' + date
        return result
    }
    // 获取当前时间
    static getNowTime() {
        let d = new Date()
        let hour = d.getHours()
        let minute = d.getMinutes()
        let second = d.getSeconds()
        let result = ''
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        result = hour + ':' + minute + ':' + second
        return result
    }
    // 获取当前是周几
    static getNowDay() {
        let d = new Date()
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return weeks[d.getDay()]
    }
}
