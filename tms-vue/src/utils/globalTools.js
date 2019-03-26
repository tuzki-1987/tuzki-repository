export default class globalTools {
    // 请求错误码信息
    static httpCode(code) {
        let msg = ''
        switch (code) {
            case 404:
                msg = '接口不存在'
                break
        }
        return msg
    }
    // 处理接口返回信息(成功)
    static handleSuccessStatusError(res) {
        let msgTxt = ''
        if (res.data.status === 'error' || res.data.state === 'error') {
            msgTxt = res.data.data || res.data.ret || '空~:)'
        }
        return msgTxt
    }
    // 处理接口返回信息(失败)
    static handleFailStatusError(error) {
        let errorMsg = ''
        if (error.response) {
            console.log('response data >>>>>>>>>>>>>>>> : ', error.response.data)
            console.log('response status >>>>>>>>>>>>>>>> : ', error.response.status)
            console.log('response headers >>>>>>>>>>>>>>>> : ', error.response.headers)
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            errorMsg = this.httpCode(error.response.status)
        } else {
            console.log('response config >>>>>>>>>>>>>>>> : ', error.config)
            errorMsg = error.message
        }
        return errorMsg
    }
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
    // 获取当前日期时间
    static getNowDatetime() {
        let d = new Date()
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let date = d.getDate()
        let hour = d.getHours()
        let minute = d.getMinutes()
        let second = d.getSeconds()
        let result = ''
        month = month < 10 ? '0' + month : month
        date = date < 10 ? '0' + date : date
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
        return result
    }
    // 获取当前是周几
    static getNowDay() {
        let d = new Date()
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return weeks[d.getDay()]
    }
    /**
    * 返回日期和周（相对于某一天的前后dayP天）
    *
    * @param dateP (某一个日期值)日期值
    * @param dayP 日期差值
    *
    * @return Array
    * */
    static getDateWeekArr(dateP, dayP) {
        let dateArr = dateP ? dateP.split('-') : null
        let d = dateP ? new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]) : new Date()
        let year
        let month
        let date
        let week
        let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        let dstr = ''
        let dval = ''
        let dArr = []
        for (let i = 0; i < dayP; i++) {
            let dItem = {}
            // 获取 i 天后的日期
            d.setDate(d.getDate() + i)
            year = d.getFullYear()
            month = d.getMonth() + 1
            date = d.getDate()
            week = d.getDay()
            if (month > 0 && month < 10)month = '0' + month
            if (date > 0 && date < 10)date = '0' + date
            dstr = month + '月' + date + '日'
            dval = year + '-' + month + '-' + date
            dItem = {
                idx: i,
                date: dstr,
                value: dval,
                week: weeks[week]
            }
            dArr.push(dItem)
            d = dateP ? new Date(dateArr[0], parseInt(dateArr[1]) - 1, dateArr[2]) : new Date()
        }
        return dArr
    }
    /**
    * 校验数据类型
    *
    * @param data 期望校验的数据
    * @param type 期望校验的数据所属的类型
    **/
    static valideDataType(data, type) {
        let args = arguments
        let types = ['string', 'object', 'number', 'boolean', 'null', 'undefined']
        let msgTxt = ''
        if (args.length !== 2) {
            msgTxt = `期望参数个数 是2个；而调用时只传了 ${args.length} 个参数。`
        }
        if (type === 'null' || type === 'undefined') {
            msgTxt = '无意义的数据类型 [' + type + ']'
        }
        if (types.indexOf(type) === -1) {
            msgTxt = '期望校验的数据所属的类型 不存在, 请检查[type]参数是否正确'
        }
        // 校验数据类型
        if (types.indexOf(typeof data) === -1) {
            msgTxt = '数据不是期望的类型！期望：[' + type + ']'
        }
        return msgTxt
    }
}
