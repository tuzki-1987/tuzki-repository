const webpack = require('webpack')

module.exports = {
    // publicPath: '/html5/hcht/',
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'public',
    indexPath: 'index.html',
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '华创科技',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    lintOnSave: true,
    productionSourceMap: false,
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {},
        modules: false
    },
    //反向代理
    devServer: {
        // 环境配置
        // host: 'test.e-paipian.com',
        host: 'localhost',
        port: 8080,
        https: false,
        hot: true,
        hotOnly: true,
        open: false,
        //配置自动启动浏览器
        // proxy: {
            // 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
            // '/api': {
            //   target: 'http://192.168.1.248:9888',
            //   // target: 'http://192.168.1.4:8999',
            //   pathRewrite: {
            //     '^/api': '/api'
            //   }
            // }
        // }
    },
    pluginOptions: {
        // 第三方插件配置
        // ...
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        ]
    }
}