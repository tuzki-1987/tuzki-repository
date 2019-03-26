import expertInfos from '../resources/expert-detail.js'
const app = getApp()

Page({
    data: {
        infos: {},
        articles: [],
        size: 0,
        hasMore: true,
        nextUrl: '',
        scrollTop: 0,
        scrollDirection: "",    // 页面滚动方向
        detailOps: {
            url: ""
        }
    },
    onLoad() {
        this.getDetails()
        this.getArticles()
    },
    // 个人信息
    getDetails() {
        // 请求接口
        this.setData({
            infos: expertInfos.infos
        })
    },
    // 文章列表
    getArticles() {
        let articles = this.data.articles,
            size = 0,
            nextUrl = '';
        // 请求接口
        articles = articles.concat(expertInfos.articles);
        size = articles.length;
        nextUrl = 'next url';
        setTimeout(function () {
            this.setData({
                articles: articles,
                size: size,
                nextUrl: nextUrl
            })
        }.bind(this), 300)
    },
    // 文章列表分页
    onReachBottom() {
        let nextUrl = this.data.nextUrl;
        if(!nextUrl) {
            this.setData({
                hasMore: false
            })
        }
        this.getArticles()
    }
})