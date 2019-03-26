/**
* require config of index
**/
require.config({
	// enforceDefine: true,
	baseUrl: "javascript",	// 设置(paths中)js文件加载的相对基础路径
	paths: {
		"domReady": "./lib/domReady",
		"vue": "./lib/vue",
		"jquery": "./lib/jquery.min",
		"jqueryUI": "./lib/jquery-ui-1.10.4.min",
		"laydate": "./lib/laydate/laydate",
		"layer": "./lib/layer/layer",
		"layui": "./lib/layui/layui",
		"mCustomScrollbar": "./tools/jquery.mCustomScrollbar.concat.min",
		"tmsRequest": "./tools/tmsRequest",
		"global": "./tools/global",
		"blockUI": "./tools/jquery.blockUI",
		"singalHallEvent": "./tools/singalHallEvent",
		"divselect": "./tools/divselect",
		// 组件配置
		"head": "./Components/head/head",
		"userModel": "./Components/user-model/user-model",
		// 内容模块配置(key值与菜单url值一致)
		"monitorAll": "./Components/modules/monitor-all",
		"monitorSingle": "./Components/modules/monitor-single",
		"contentFilm": "./Components/modules/content-film",
		"contentSecretKey": "./Components/modules/content-secret-key",
		"contentSPL": "./Components/modules/content-spl",
		"contentPlayList": "./Components/modules/content-play-list",
		"contentAdverPlan": "./Components/modules/content-adver-plan",
		"scheduleLogs": "./Components/modules/schedule-logs",
		"scheduleAdverPlan": "./Components/modules/schedule-adver-plan",
		"quality": "./Components/modules/quality",
		"alarmSchedule": "./Components/modules/alarm-schedule",
		"alarmAdverPlan": "./Components/modules/alarm-adver-plan",
		"systemHall": "./Components/modules/system-hall",
		"systemHallCreate": "./Components/modules/system-hall-create",
		"systemUser": "./Components/modules/system-user",
		"systemTemplate": "./Components/modules/system-template",
		"systemCinema": "./Components/modules/system-cinema",
		// 模块接口数据处理
		"contentSecretAjax": "./ajax-process/content-secret-key_ajax",
		"contentSplAjax": "./ajax-process/content-spl_ajax",
		"scheduleLogsAjax": "./ajax-process/schedule-logs_ajax",
		"scheduleAdverPlanAjax": "./ajax-process/schedule-adver-plan_ajax",
		"alarmScheduleAjax": "./ajax-process/alarm-schedule_ajax",
		"systemHallAjax": "./ajax-process/system-hall_ajax",
		"systemUserAjax": "./ajax-process/system-user_ajax",
		"systemTemplateAjax": "./ajax-process/system-template_ajax",
		"systemCinemaAjax": "./ajax-process/system-cinema_ajax",


		// 模拟接口数据
		"scheduleJSON": "./ajax-process/json/scheduleJSON",
		"halllistJSON": "./ajax-process/json/halllistJSON",
		"spllistJSON": "./ajax-process/json/spllistJSON",
		"spllistJSON2": "./ajax-process/json/spllistJSON2",
		"playlistJSON": "./ajax-process/json/playlistJSON",
		"playlist2JSON": "./ajax-process/json/playlist2JSON",
		"playlist2JSON1": "./ajax-process/json/playlist2JSON1",
		"adverlistJSON": "./ajax-process/json/adverlistJSON",
		"adverlistJSON1": "./ajax-process/json/adverlistJSON1",
		"adverCplJSON": "./ajax-process/json/adverCplJSON",
		"adverMatJSON": "./ajax-process/json/adverMatJSON",
		"contentPreplayJSON": "./ajax-process/json/contentPreplayJSON",
		"contentCueJSON": "./ajax-process/json/contentCueJSON",
	},
	shim: {
		jqueryUI: {
			deps: ["jquery"]
		},
		layer: {
			deps: ["jquery"]
		},
		mCustomScrollbar: {
			deps: ["jquery"]
		},
		global: {
			exports: "global"
		},
		divselect: {
			deps: ["jquery"]
		},
		head: {
			deps: ["vue", "global"]
		},
		userModel: {
			deps: ["vue"]
		}
	}
});

/* require 全局 error 配置
requirejs.onError = function(err) {
	console.log("----------------- global require error ------------------");
	if(err.requireType === "timeout")console.log("模块加载超时或未定义: "+err.requireModules.toString())
	if(err.requireType === "nodefine")console.log("模块未定义");
	if(err.requireType === "scripterror")console.log("模块加载错误: 请检查是否有该模块 - "+err.requireModules.toString());
	throw err;
}*/