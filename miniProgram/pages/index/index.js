//index.js
import dataObj from '../resources/index.js'
const app = getApp()

Page({
    data: {
        imgDomain: app.globalData.imgDomain,
        swipers: dataObj.swipers,
        proInfos: dataObj.proInfos,
        experts: dataObj.experts,
        comments: dataObj.comments,
        scrollTop: 0,
        scrollDirection: ""    // 页面滚动方向
    },
    onLoad: function () {},
    // 写评论
    handleWriteComment() {
        console.log('ready write comment')
    },
    // 回复
    handleWriteBack() {
        console.log('ready write comment-back')
    },
    handleWordsView(e) {
        let id = e.currentTarget.id
        if(id) {
            wx.navigateTo({
                url: '评论详情',
            })
        }
    }
})
