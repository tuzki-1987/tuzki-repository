import experts1 from '../resources/experts.js'
const app = getApp()

Page({
    data: {
        scrollTop: 0,
        scrollDirection: "",    // 页面滚动方向
        experts: [],
        size: 0,
        hasMore: true,
        nextUrl: '',
        listOps: {
            url: ""
        }
    },
    onLoad() {
        this.getExperts()
    },
    // 列表
    getExperts() {
        let experts = this.data.experts,
            size = 0,
            nextUrl = '';
        // 请求接口
        experts = experts.concat(experts1);
        size = experts.length;
        nextUrl = 'next url';
        setTimeout(function() {
            this.setData({
                experts: experts,
                size: size,
                nextUrl: nextUrl
            })
        }.bind(this), 300)
    },
    // 下一页
    onReachBottom() {
        let nextUrl = this.data.nextUrl;
        if(!nextUrl) {
            this.setData({
                hasMore: false
            })
        }
        this.getExperts()
    }
})