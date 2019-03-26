/**
* Component:header
* @description: 头部组件
**/

var headVM;	// 对外暴露Vue实例
define(["require", "vue"], function(require, Vue) {
	// 注册头部组件
	Vue.component("tms-head", {
		props: ["time", "date", "day", "page", "pageSub", "menus"],
		template: `<div>
						<div class="logo lf">
							<a href="index.html"><img src="images/logo.png" alt="" /></a>
						</div>
			            <div class="time lf">
			                <p class="p01">{{time}}</p>
			                <p>{{date}}</p>
			                <p>{{day}}</p>
			            </div>
			            <ul class="topNav rt">
			                <li v-for="menu in menus" v-bind:key="menus.name" v-bind:class="{current: page == menu.page}">
			                	<a v-bind:href="menu.url"><img v-bind:src="menu.icon" /><p>{{menu.name}}</p></a>
			                	<ul class="nav" v-bind:style="menu.style" v-if="page == menu.page && menu.subnavs">
			                        <li v-for="subnav in menu.subnavs" v-bind:key="subnav.nav" v-bind:class="{current01: pageSub == subnav.page}">
			                        	<a v-bind:href="subnav.url">{{subnav.name}}</a>
			                        </li>
			                    </ul>
			                </li>
			            </ul>
		            </div>`
	});
	
	// 创建实例
	headVM = new Vue({
		el: ".head",
		data: {
			title: "欢迎回来~ " + new Date().toLocaleString(),
			currentComponent: "",	// 当前组件
			time: global.dateTool.getNowTime(),
			date: global.dateTool.getNowDate(),
			day: global.dateTool.getNowDay(),
			// 控制一级菜单样式和二级菜单激活时的样式, 以及二级菜单是否显示(统一命名规则: menu_一级菜单名_二级菜单名)
			page: "menu_monitor",	// 当前模块一级菜单名字索引(在各模块中定义: 与menus中page的值一致)
			pageSub: "menu_monitor_tab1",	// 当前模块二级菜单名字索引(在各模块中定义: 与subnavs中page的值一致)
			menus: [{
				id: 0,
				page: "menu_monitor",
				name: "监控",
				url: "#monitorAll",	// 模块ID名字(与默认子菜单相同)
				icon: "images/topNav01.png",
				style: "width:184px; left:-50%;",
				subnavs: [{
					name: "全局",
					url: "#monitorAll",	// 模块ID名字
					page: "menu_monitor_tab1"
				}, {
					name: "单厅",
					url: "#monitorSingle",
					page: "menu_monitor_tab2"
				}]
			}, {
				id: 1,
				page: "menu_content",
				name: "内容",
				url: "#contentFilm",
				icon: "images/topNav02.png",
				style: "width:368px; left:-160%;",
				subnavs: [{
					name: "影片",
					url: "#contentFilm",
					page: "menu_content_tab1"
				}, {
					name: "密钥",
					url: "#contentSecretKey",
					page: "menu_content_tab2"
				}, {
					name: "SPL",
					url: "#contentSPL",
					page: "menu_content_tab3"
				}, {
					name: "映前列表",
					url: "#contentPlayList",
					page: "menu_content_tab4"
				}]
			}, {
				id: 2,
				page: "menu_schedule",
				name: "排期",
				url: "#scheduleLogs",
				icon: "images/topNav03.png",
				style: "width:184px; left:-50%;",
				subnavs: [{
					name: "日程",
					url: "#scheduleLogs",
					page: "menu_schedule_tab1"
				}, {
					name: "广告策略",
					url: "#scheduleAdverPlan",
					page: "menu_schedule_tab2"
				}]
			}, {
				id: 3,
				page: "menu_quality",
				name: "品质",
				url: "#quality",
				icon: "images/topNav04.png"
			}, {
				id: 4,
				page: "menu_alarm",
				name: "报警",
				url: "#alarmSchedule",
				icon: "images/topNav05.png",
				style: "width:184px; right: 0;",
				subnavs: [{
					name: "日程",
					url: "#alarmSchedule",
					page: "menu_alarm_tab1"
				}]
			}, {
				id: 5,
				page: "menu_system",
				name: "系统",
				url: "#systemHall",
				icon: "images/topNav06.png",
				style: "width:368px; left:-395%;",
				subnavs: [{
					name: "影厅管理",
					url: "#systemHall",
					page: "menu_system_tab1"
				}, {
					name: "用户管理",
					url: "#systemUser",
					page: "menu_system_tab2"
				}, {
					name: "模板管理",
					url: "#systemTemplate",
					page: "menu_system_tab3"
				}, {
					name: "影院管理",
					url: "#systemCinema",
					page: "menu_system_tab4"
				}]
			}]
		},
		computed: {
			// 实时刷新当前时间
			getTime: function() {
				var _this = this;
				setInterval(function() {
					_this.time = global.dateTool.getNowTime();
					// 每天0点刷新日期和周
					if(_this.time.split(":")[0] == "00") {
						_this.date = global.dateTool.getNowDate();
						_this.day = global.dateTool.getNowDay();
					}
				}, 1000);
			}
		}
	})

	headVM.getTime;	// 执行时间刷新
});