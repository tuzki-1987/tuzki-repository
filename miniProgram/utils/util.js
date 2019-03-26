const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 封装request请求(各回调函数由具体请求页面实现)
 * success:handleSuccess(成功)
 * fail:handleFail(失败)
 * complete:handleComplete(结束)
 * 
 * @return requestTask
 */
const handleRequest = (options, handleSuccess, handleFail, handleComplete) => {
    // var urlDomain = "https://www.cosharing.cn/micron",
    let urlDomain = "",
        suffix = '.htm',
        url = options.url.indexOf("vm.v-mob.com") == -1 ? urlDomain + options.url : options.url,
        header = {
            sid: wx.getStorageSync("sid")
        } || {},
        method = options.method || "POST",
        dataType = options.dataType || "json",
        requestTask;
    if (url.indexOf('?pages') === -1) {
        url = url + suffix;
    }else {
        if (url.indexOf('.htm') === -1) url = url.substring(0, url.indexOf('?')) + '.htm' + url.substring(url.indexOf('?'), url.length);
    }
    requestTask = wx.request({
        // url: options.url.indexOf("www.cosharing.cn/micron") == -1 ? urlDomain + options.url : options.url,
        url: url,
        data: options.data,
        header: header,
        method: method,
        dataType: dataType,
        success: function(res) {
            if (handleSuccess) {
                if (typeof handleSuccess !== "function") throw new Error("不是可执行的函数---success");
                handleSuccess(res);
            }
        },
        fail: function(res) {
            if (handleFail) {
                if (typeof handleFail !== "function") throw new Error("不是可执行的函数---fail");
                handleFail(res);
            }
        },
        complete: function(res) {
            if (handleComplete) {
                if (typeof handleComplete !== "function") throw new Error("不是可执行的函数---complete");
                handleComplete(res);
            }
        }
    });
    return requestTask;
};

// 去空格
const trim = function(str) {
    if (typeof str !== "string") {
        throw Error("数据类型错误：：只接受字符串");
    }
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

// 请求超时提示(app.json配置15秒后)
const handleRequestTimeout = function(res) {
    let txt = res.errMsg == "request:fail timeout" ? "请求超时，请稍后重试" : "请求失败，请稍后重试";
    wx.hideLoading();
    wx.showModal({
        content: txt,
        showCancel: false
    });
};

/**
 * 模拟请求超时(默认9秒后)
 * @param requestTask 微信request接口返回值
 * @param task 服务器返回值
 * @param tipVal 提示信息
*/
const simulateRequestTimeout = function(requestTask, task, tipVal) {
    var tip = tipVal || "请求超时，请稍后重试...";
    if(!task) {
        wx.hideLoading();
        wx.showModal({
            content: tip,
            showCancel: false,
            success: function(res) {
                if(res.confirm) {
                    requestTask.abort();    // 中断请求
                }
            }
        });
    }
};

module.exports = {
    formatTime: formatTime,
    handleRequest: handleRequest,
    trim: trim,
    handleRequestTimeout: handleRequestTimeout,
    simulateRequestTimeout: simulateRequestTimeout
}