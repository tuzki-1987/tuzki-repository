<template>
    <div>
        <!-- <div style="color: #fff; text-align: center;">route & index : {{currentRoute}}+++{{currentRouteIndex}}</div> -->
        <div class="head">
            <div class="logo lf">
                <router-link :to="{path: '/'}"><img src="static/images/logo.png"></router-link>
            </div>
            <div class="time lf">
                <p class="p01">{{time}}</p>
                <p>{{date}}</p>
                <p>{{day}}</p>
            </div>
            <ul class="topNav rt">
                <li :class="{'current' : currentRouteIndex < 3}">
                    <router-link :to="{path: '/monitorAll'}">
                        <img src="static/images/topNav01.png" /><p>监控</p>
                    </router-link>
                    <ul class="nav" style="width:184px; left:-50%;" :class="{'nav-show' : currentRouteIndex < 3}">
                        <li :class="{'current01' : currentRoute === 'home' || currentRoute === 'monitorAll'}">
                            <router-link :to="{path: '/monitorAll'}">全局</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'monitorSingle'}">
                            <router-link :to="{path: '/monitorSingle'}">单厅</router-link>
                        </li>
                    </ul>
                </li>
                <li :class="{'current' : currentRouteIndex >= 3 && currentRouteIndex <= 6}">
                    <router-link :to="{path: '/contentFilm'}">
                        <img src="static/images/topNav02.png" /><p>内容</p>
                    </router-link>
                    <ul class="nav" style="width:368px; left:-160%;" :class="{'nav-show' : currentRouteIndex >= 3 && currentRouteIndex <= 6}">
                        <li :class="{'current01' : currentRoute === 'contentFilm'}">
                            <router-link :to="{path: '/contentFilm'}">影片</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'contentSecretKey'}">
                            <router-link :to="{path: '/contentSecretKey'}">密钥</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'contentSPL'}">
                            <router-link :to="{path: '/contentSPL'}">SPL</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'contentPlayList'}">
                            <router-link :to="{path: '/contentPlayList'}">映前列表</router-link>
                        </li>
                    </ul>
                </li>
                <li :class="{'current' : currentRouteIndex >= 7 && currentRouteIndex <= 8}">
                    <router-link :to="{path: '/scheduleLogs'}">
                        <img src="static/images/topNav03.png" /><p>排期</p>
                    </router-link>
                    <ul class="nav" style="width:184px; left:-50%;" :class="{'nav-show' : currentRouteIndex >= 7 && currentRouteIndex <= 8}">
                        <li :class="{'current01' : currentRoute === 'scheduleLogs'}">
                            <router-link :to="{path: '/scheduleLogs'}">日程</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'scheduleAdverPlan'}">
                            <router-link :to="{path: '/scheduleAdverPlan'}">广告策略</router-link>
                        </li>
                    </ul>
                </li>
                <li :class="{'current' : currentRoute === 'quality'}">
                    <router-link :to="{path: '/quality'}">
                        <img src="static/images/topNav04.png" /><p>品质</p>
                    </router-link>
                </li>
                <li :class="{'current' : currentRoute === 'alarmSchedule'}">
                    <router-link :to="{path: '/alarmSchedule'}">
                        <img src="static/images/topNav05.png" /><p>报警</p>
                    </router-link>
                    <ul class="nav" style="width:184px; right:0px;" :class="{'nav-show' : currentRouteIndex === 10}">
                        <li :class="{'current01' : currentRoute === 'alarmSchedule'}">
                            <router-link :to="{path: '/alarmSchedule'}">日程</router-link>
                        </li>
                    </ul>
                </li>
                <li :class="{'current' : currentRouteIndex >= 11 && currentRouteIndex <= 14}">
                    <router-link :to="{path: '/systemHall'}">
                        <img src="static/images/topNav06.png" /><p>系统</p>
                    </router-link>
                    <ul class="nav" style="width:368px; left:-395%;" :class="{'nav-show' : currentRouteIndex >= 11 && currentRouteIndex <= 14}">
                        <li :class="{'current01' : currentRoute === 'systemHall'}">
                            <router-link :to="{path: '/systemHall'}">影厅管理</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'systemUser'}">
                            <router-link :to="{path: '/systemUser'}">用户管理</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'systemTemplate'}">
                            <router-link :to="{path: '/systemTemplate'}">模板管理</router-link>
                        </li>
                        <li :class="{'current01' : currentRoute === 'systemCinema'}">
                            <router-link :to="{path: '/systemCinema'}">影院管理</router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import tools from '../utils/globalTools.js'
export default {
    name: 'TmsHead',
    data() {
        return {
            routes: ['home', 'monitorAll', 'monitorSingle', 'contentFilm', 'contentSecretKey', 'contentSPL', 'contentPlayList', 'scheduleLogs', 'scheduleAdverPlan', 'quality', 'alarmSchedule', 'systemHall', 'systemUser', 'systemTemplate', 'systemCinema'],
            curRoute: '',
            time: tools.getNowTime(),
            date: tools.getNowDate(),
            day: tools.getNowDay()
        }
    },
    computed: {
        // 获取当前最新路由名字, 用于控制激活样式
        currentRoute() {
            return this.$store.state.curRoute.name
        },
        // 获取当前路由的索引位, 用于控制二级菜单view
        currentRouteIndex() {
            let name = this.$store.state.curRoute.name
            return this.routes.indexOf(name)
        }
    },
    created() {
        this.getTime()
    },
    methods: {
        // 实时刷新当前时间
        getTime() {
            let _this = this
            setInterval(function() {
                _this.time = tools.getNowTime()
                // 每天0点刷新日期和周
                if (_this.time.split(':')[0] === '00') {
                    _this.date = tools.getNowDate()
                    _this.day = tools.getNowDay()
                }
            }, 1000)
        }
    }
}
</script>
<style scoped></style>
