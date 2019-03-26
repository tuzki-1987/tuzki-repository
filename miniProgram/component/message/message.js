Component({
    properties: {
        "scrollDirection": {
            "type": Boolean
        }
    },
    data: {
        animationMsgBox: {},    // 消息图标动画
        animationMsgNum: {},    // 消息数字动画
        animationMsgDialog: {}, // 消息弹框动画
        maskShow: false,
        msgNum: 0
    },
    ready() {},
    pageLifetimes: {
        // 保证组件始终执行
        show() {
            console.log('page show')
            this.serverSentMessage()
        }
    },
    methods: {
        serverSentMessage() {
            let _this = this
            // 模拟服务器消息推送
            setTimeout(function() {
                let num = 9
                this.setData({
                    msgNum: num
                })
                // 显示消息数字
                this.handleAnimationMsgNum(true)
                // 模拟服务器消息推送
                setTimeout(function () {
                    let num0 = 0    // 消息数为0
                    // 隐藏消息数字
                    this.handleAnimationMsgNum(false)
                    setTimeout(function() {
                        _this.setData({
                            msgNum: num0
                        })
                    }, 500)
                }.bind(this), 3000)
            }.bind(this), 1500)
        },
        // 打开消息框
        openMessageDialog() {
            let _this = this
            // 显示遮罩
            this.setData({
                maskShow: true
            })
            // 隐藏消息图标
            this.handleAnimationMsgBox(false)
            // 显示消息弹框(必须延迟等待遮罩)
            setTimeout(function () {
                this.handleaAimationMsgDialog(true)
            }.bind(this), 10)
        },
        // 忽略
        handleIgnore() {
            // 隐藏消息弹框
            this.handleaAimationMsgDialog(false)
            // 显示消息图标
            this.handleAnimationMsgBox(true)
            // 隐藏遮罩
            setTimeout(function() {
                this.setData({
                    maskShow: false
                })
                // 模拟效果: 数字显示
                this.setData({
                    msgNum: 9
                })
                this.handleAnimationMsgNum(true)
            }.bind(this), 300)
        },
        // 查看详情
        handleViewDetail() {
            wx.navigateTo({
                url: '/pages/messages/messages',
            })
            // 隐藏消息弹框
            this.handleaAimationMsgDialog(false)
            // 显示消息图标
            this.handleAnimationMsgBox(true)
            // 隐藏遮罩
            setTimeout(function () {
                this.setData({
                    maskShow: false
                })
            }.bind(this), 300)
        },
        // 消息数字动画 显示/隐藏(true/false)
        handleAnimationMsgNum(isShow) {
            let animationMsgNum = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
            })
            if(isShow) {
                animationMsgNum.top('-8rpx').height('40rpx').right('-8rpx').width('40rpx').scale3d(2, 2, 2).step({duration: 500})
                animationMsgNum.top('-8rpx').height('40rpx').right('-8rpx').width('40rpx').scale3d(1, 1, 1).step()
            }else animationMsgNum.top('0').height('0').right('0').width('0').step()
            this.setData({
                animationMsgNum: animationMsgNum.export()
            })
        },
        // 消息图标动画 显示/隐藏(true/false)
        handleAnimationMsgBox(isShow) {
            let animationMsgBox = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease'
            })
            if(isShow)animationMsgBox.scale3d(1, 1, 1).step()
            else animationMsgBox.scale3d(0, 0, 0).step()
            this.setData({
                animationMsgBox: animationMsgBox.export()
            })
        },
        // 消息弹框动画 显示/隐藏(true/false)
        handleaAimationMsgDialog(isShow) {
            let animationMsgDialog = wx.createAnimation({
                duration: 500,
                timingFunction: 'ease'
            })
            if(isShow)animationMsgDialog.width('85%').height('280rpx').step()
            else animationMsgDialog.width(0).height(0).step()
            this.setData({
                animationMsgDialog: animationMsgDialog.export()
            })
        }
    }
})