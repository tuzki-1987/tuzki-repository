/**
* index mainJS
* 
* @author ccq
**/

require(["javascript/config/require.config.index.js"], function() {
	require(["vue", "jquery", "mCustomScrollbar", "layer", "global", "tmsRequest", "head", "userModel"], function(Vue, $, mCustomScrollbar, layer) {
		global.msgTip.load();
		global.dateTool.getNowTime();
		var nowDate = global.dateTool.getNowDate();
		var nowTime = global.dateTool.getNowTime();
		var day = global.dateTool.getNowDay();
		var dateWeek = global.dateTool.getDateWeekArr(null, 3);
		console.log("now date : "+nowDate);
		console.log("now time : "+nowTime);
		console.log("day : "+day);
		console.log("head page : "+headVM.page)
		console.log(dateWeek);
		// require(["domReady"], function(domReady) {
		// 	domReady(function() {
		// 		// 模块加载器
		// 		global.moduleAdapter.render();
		// 	});
		// });


		//加载layer.css - layer.js所在的目录，可以是绝对目录，也可以是相对目录
		layer.config({
			path: 'javascript/lib/layer/'
		});
		// 模块加载器
		global.moduleAdapter.render();
		// 监听hash变化
		window.addEventListener("hashchange", function() {
			var hash = window.location.hash.slice(1);
			console.log("hash : "+hash);
			// 模块加载器
			global.moduleAdapter.render(hash);
		});
	});
});