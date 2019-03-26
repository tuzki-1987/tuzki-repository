// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(vuescroll, {
    // 在这里设置全局默认配置
    ops: {
        // 滚动区域
        scrollPanel: {
            easing: 'easeInQuad'
        },
        // 滚动条轨道
        rail: {
            background: '#000',
            size: '2px',
            opacity: 0.4
        },
        // 滚动条
        bar: {
            onlyShowBarOnScroll: false,
            background: '#3F4877',
            keepShow: true,
            size: '4px'
        }
    },
    // 在这里自定义组件名字，默认是vueScroll
    name: 'tms-scroll'
})

const store = new Vuex.Store({
    state: {
        curRoute: ''
    },
    mutations: {
        // 更新当前路由名字
        upateRoute(state, newRoute) {
            state.curRoute = newRoute
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    components: { App },
    template: '<App/>',
    created() {
        // 在 config/index.js : dev.proxyTable 中定义(本地)
        let localDomainPath = '/domainPath/'
        // build 时使用
        // let localDomainPath = process.env.API_SERVER
        console.log('localDomainPath : ', localDomainPath)
        // 配置请求域名/参数
        axios.interceptors.request.use(function(config) {
            config.url = localDomainPath + config.url
            if (config.method === 'post') {
                config.data = qs.stringify(config.data)
            }
            if (config.method === 'get') {
                config.param = qs.stringify(config.param)
            }
            // console.log('config >>>>>>>>>> : ', config)
            return config
        }, function(error) {
            console.log('request error : ', error)
            return Promise.reject(error)
        })
        axios.interceptors.response.use(function(res) {
            return res
        }, function(error) {
            console.log('response error : ', error)
            return Promise.reject(error)
        })
    }
})
