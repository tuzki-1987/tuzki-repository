const app = getApp()
Component({
    properties: {
        "scrollDirection": {
            "type": Boolean
        }
    },
    data: {
        maskShow: false,
        callShow: false,
        infoShow: false,
        isLogin: false
    },
    ready() {
        console.log('user login : ' + app.globalData.userLogin)
    },
    methods: {
        // 遮罩层
        handleLayerMask() {
            this.setData({
                maskShow: false,
                callShow: false,
                infoShow: false
            })
        },
        // 咨询热线
        showHotLine() {
            this.setData({
                maskShow: true,
                callShow: true
            })
        },
        // 取消呼叫
        handleCancelCall() {
            this.setData({
                maskShow: false,
                callShow: false
            })
        },
        // 呼叫
        handleMakeCall() {
            wx.makePhoneCall({
                phoneNumber: '010-3966-9898'
            })
        },
        // 咨询了解
        handleLittleKnow() {
            this.setData({
                maskShow: true,
                infoShow: true
            })
        },
        // 登录
        handleLogin() {
            console.log('forward login')
            /* 根据体验友好度开启
            this.setData({
                maskShow: false,
                infoShow: false
            })
            */
            wx.showLoading({
                title: '登录中...'
            })
            setTimeout(function() {
                wx.hideLoading()
                wx.showToast({
                    title: '登录成功'
                })
                setTimeout(function() {wx.hideToast()}, 500)
                this.setData({
                    isLogin: true
                })
                app.globalData.userLogin = true
            }.bind(this), 1000)
        },
        // 填写信息
        handleFillInfo() {
            console.log('forward fill-in')
            let userLogin = app.globalData.userLogin
            if(!userLogin) {
                wx.showToast({
                    title: '请先登录',
                    icon: 'none'
                })
                setTimeout(function () {
                    wx.hideToast()
                }, 1000)
                return;
            }
            this.setData({
                maskShow: false,
                infoShow: false
            })
            wx.navigateTo({
                url: '/pages/collect-userinfo/collect-userinfo'
            })
        }
    }
})