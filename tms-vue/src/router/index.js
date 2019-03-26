import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
        // {
        //     path: '/',
        //     redirect: '/Home'
        // },
        {
            path: '/',
            component: resolve => require(['../page/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: resolve => require(['../page/MonitorAll.vue'], resolve)
                },
                {
                    path: '/monitorAll',
                    name: 'monitorAll',
                    component: resolve => require(['../page/MonitorAll.vue'], resolve)
                },
                {
                    path: '/monitorSingle',
                    name: 'monitorSingle',
                    component: resolve => require(['../page/MonitorSingle.vue'], resolve)
                },
                {
                    path: '/contentFilm',
                    name: 'contentFilm',
                    component: resolve => require(['../page/ContentFilm.vue'], resolve)
                },
                {
                    path: '/contentSecretKey',
                    name: 'contentSecretKey',
                    component: resolve => require(['../page/ContentSecretKey.vue'], resolve)
                },
                {
                    path: '/contentSPL',
                    name: 'contentSPL',
                    component: resolve => require(['../page/ContentSPL.vue'], resolve)
                },
                {
                    path: '/contentPlayList',
                    name: 'contentPlayList',
                    component: resolve => require(['../page/ContentPlayList.vue'], resolve)
                },
                {
                    path: '/scheduleLogs',
                    name: 'scheduleLogs',
                    component: resolve => require(['../page/ScheduleLogs.vue'], resolve)
                },
                {
                    path: '/scheduleAdverPlan',
                    name: 'scheduleAdverPlan',
                    component: resolve => require(['../page/ScheduleAdverPlan.vue'], resolve)
                },
                {
                    path: '/quality',
                    name: 'quality',
                    component: resolve => require(['../page/Quality.vue'], resolve)
                },
                {
                    path: '/alarmSchedule',
                    name: 'alarmSchedule',
                    component: resolve => require(['../page/AlarmSchedule.vue'], resolve)
                },
                {
                    path: '/systemHall',
                    name: 'systemHall',
                    component: resolve => require(['../page/SystemHall.vue'], resolve)
                },
                {
                    path: '/systemUser',
                    name: 'systemUser',
                    component: resolve => require(['../page/SystemUser.vue'], resolve)
                },
                {
                    path: '/systemTemplate',
                    name: 'systemTemplate',
                    component: resolve => require(['../page/SystemTemplate.vue'], resolve)
                },
                {
                    path: '/systemCinema',
                    name: 'systemCinema',
                    component: resolve => require(['../page/SystemCinema.vue'], resolve)
                }
            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        console.log('to : ', to)
        console.log('form : ', from)
        console.log('savedPosition : ', savedPosition)
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})
