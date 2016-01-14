/*
 * 公用文件
 *
 * @author ccq
 */


/**
* 菜单URL配置
*
* url_index: 首页
* url0: 影院导航, url1: 票房对比, url20: 影院票房上传, url21: 系统排期生成, url22: 票房明细比较
* url30: 排期展示, url31: 按影厅显示, url32: 按影厅名称显示, url33: 分时段统计(排期结果), url40: 大盘票房
* url_ps_1: 流程1(票房上传、提交、场次分析)
* url_ps_2: 流程2(准备生成排期)
* url_ps_3: 流程3(展示排期结果, 生成比较结果)
* url5: 上传票房独立页面
* url6: 影院信息页面
* url7: 影院票房批量汇总统计页面
* url_gp1: 影院管理 - 汇总统计 - 实际排片 - 点击查看 加载页
* url_gp2: 影院管理 - 汇总统计 - 参考排片 - 点击查看 加载页
* url_gp3: 影院管理 - 汇总统计 - 查看报告 - 点击 加载页
* url_gp4: 影院管理 - 汇总统计 - 生成&查看 - 点击跳转加载页
* url_gp7: 影院管理 - 汇总统计 - 生成&查看 - 生成排期 - 点击跳转加载页
* url_gp5: 上传票房 - 开始上传 - 点击加载页
* url_gp6: 上传票房 - 查看历史票房 - 点击加载页
**/
var muObj = {
	// "url0": "page/region-nav.html",
	"url_index": "index.html",
	"url0": "page/cinema-group.html",
	"url1": "page/build.html",
	"url20": "page/upload-boxoffice.html",
	"url21": "page/market-schedule.html",
	"url22": "page/compare-detail.html",
	"url30": "page/show-sch/show_schedule.html",
	"url31": "page/show-sch/show_hall.html",
	"url32": "page/show-sch/show_movie_name.html",
	"url33": "page/sch-total.html",
	"url40": "page/market-box-office.html",
	"url5": "page/upload-boxoffice-independence.html",
	"url6": "page/cinema-info.html",
	"url7": "page/cinema-group-total.html",

	// 流程页面
	"url_ps_1": "page/upload-boxoffice-process.html",
	"url_ps_2": "page/market-schedule-process.html",
	"url_ps_3": "page/compare-detail-process.html",

	// 分组页面
	"url_gp1": "page/real-schdule-group.html",
	"url_gp2": "page/sys-schdule-group.html",
	"url_gp3": "page/show-report-modal.html",
	"url_gp4": "page/market-schedule-group.html",
	"url_gp5": "page/upload-boxoffice-modal.html",
	"url_gp6": "page/show-boxoffice-modal.html",
	"url_gp7": "page/show-sch-from-cinema-group.html",

	// 排期明细页面
	"url30_1": "page/show-sch/show_schedule_1.html",
	"url31_1": "page/show-sch/show_hall_1.html",
	"url32_1": "page/show-sch/show_movie_name_1.html",

	"url_build": "page/build.html",
	"loadImg": "<center><img src='images/loading.gif' /></center>",
	"disp": false
};

/**
* 影院对象
*
* id: 影院ID, name: 影院名字, platFormId: 平台(院线)ID, totalSchData: 排期汇总数据
**/
var cinemaObj = {
	"id": "0",
	"name": "",
	"platFormId": 0,
	"totalSchData": null
};

/**
* 日期对象
**/
var dateObj = {
	utcString2date: function( sdate){
		if( !sdate )
			return null;
		var timestamp = Date.parse( sdate);
		if( timestamp ){
			var d=new Date();
			d.setTime( timestamp);
			return d;
		}
		var items = sdate.split(/-|:|T|\+/);

		if( items.length!=8 && items.length!=6){
			return new Date();
		}
		var date_tz= sdate.split("T"); 
		var dates=date_tz[0].split("-");  // 日期部分
		var t_tz = date_tz[1].split(/\+|-/);
		var times = t_tz[0].split(":");   // 时间部分

		var time =Date.UTC(dates[0], dates[1] - 1, dates[2],
			times[0], times[1], times[2]);

		if( t_tz.length==1 ){
			return new Date( time );
		}

		// 是 -02:00 还是 +02:00
		var isEast = date_tz[1].indexOf("+")>0;
		var tzs = t_tz[1].split(":"); // 时区部分， 没有正负号

		if( isEast ){
			return new Date( time - (tzs[0]*3600+tzs[1]*60) * 1000);
		}

		return new Date( time + (tzs[0]*3600+tzs[1]*60) * 1000);
	},
	dateNowymd:function(){
		//当前时间转为yyyy年mm月dd日
		var date = new Date();
		var year = date.getFullYear();
		var month = this._tochar2(date.getMonth()+1);
		var day = this._tochar2(date.getDate());
		return year + "年" + month + "月" + day + "日";
	},
	dateNowymd2:function(){
		var date = new Date();
		var s;
		if( !date) 
			return "";
		s=date.getFullYear()+"-"
			+(this._tochar2(date.getMonth()+1)) +"-" 
			+this._tochar2(date.getDate());
		return s;
	},
	dateYesDayymd:function(){
		//昨天日期转为yyyy年mm月dd日
		var date = new Date();
		date.setDate(date.getDate()-1);
		var s;
		if( !date) 
			return "";
		s=date.getFullYear()+"-"
			+(this._tochar2(date.getMonth()+1)) +"-" 
			+this._tochar2(date.getDate());
		return s;
	},
	dateTomorrowymd:function(){
		//名天日期转为yyyy年mm月dd日
		var date = new Date();
		date.setDate(date.getDate()+1);
		var s;
		if( !date) 
			return "";
		s=date.getFullYear()+"-"
			+(this._tochar2(date.getMonth()+1)) +"-" 
			+this._tochar2(date.getDate());
		return s;
	},
	dateAfterTomorrowymd:function(){
		// 后天日期
		var date = new Date();
		date.setDate(date.getDate()+2);
		var s;
		if( !date) 
			return "";
		s=date.getFullYear()+"-"
			+(this._tochar2(date.getMonth()+1)) +"-" 
			+this._tochar2(date.getDate());
		return s;
	},
	_tochar2:function( num){
		var n = "" + num;
		return ( n.length ==1) ? "0"+n : n;
	}
};

/**
* 加载页面
*
* @param firstLevel 一级菜单索引值
* @param subLevel 二级菜单索引值
**/
function loadPage(firstLevel, subLevel) {
	initHiddenFiledVal();
	$(".main").html(muObj.loadImg);

	// 影院导航
	if(firstLevel == 0) {
		// 影院菜单控制
		$(".nav-menus").find("li:eq(1)").addClass("cinema-menu");
		$(".nav-menus").find("li:eq(2)").addClass("cinema-menu");
		$(".nav-menus").find("li:eq(3)").addClass("cinema-menu");
		$(".nav-menus").find("li:eq(4)").addClass("cinema-menu");
		$(".nav-menus").find("li:eq(9)").addClass("cinema-menu");

		$(".main").load(muObj.url0);
	}

	// 票房对比
	if(firstLevel == 1)
		$(".main").load(muObj.url_ps_1);

	// 功能查询
	if(firstLevel == 2) {
		// 影院票房上传
		if(subLevel == 0)
			$(".main").load(muObj.url20);
		// 系统排期生成
		if(subLevel == 1)
			$(".main").load(muObj.url21);
		// 票房明细比较
		if(subLevel == 2)
			$(".main").load(muObj.url22);
	}

	// 影院信息
	if(firstLevel == 3)
		$(".main").load(muObj.url6);

	// 排期结果展示
	if(firstLevel == 4) {
		// 排期展示
		if(subLevel == 0)
			$(".main").load(muObj.url30);
		// 按影厅显示
		if(subLevel == 1)
			$(".main").load(muObj.url31);
		// 按影厅名称显示
		if(subLevel == 2)
			$(".main").load(muObj.url32);
		// 排期结果展示
		if(subLevel == 3)
			$(".main").load(muObj.url33);
	}
	
	// 统计分析
	if(firstLevel == 5) {
		// 大盘票房
		if(subLevel == 0)
			$(".main").load(muObj.url40);
	}

	// 上传票房
	if(firstLevel == 6)
		$(".main").load(muObj.url5);

	// 批量统计
	if(firstLevel == 7)
		$(".main").load(muObj.url7);

	// 使用指南
	// if(firstLevel == 8)
	// 	$(".main").load(muObj.url5);

	// 返回
	if(firstLevel == 9) {
		initSetMenu(true);
	}

	// 测试(排期明细)
	if(firstLevel == 10) {
		$(".main").load(muObj.url_gp7);
	}
}

//加载return top
function returnTop(){
	$("#addmyplan").hide();

	$(window).scroll(function(){
		var scrlTop = $(document).scrollTop();
		if(scrlTop > 120)
			$("#addmyplan").show();
		else
			$("#addmyplan").hide();
	});
	
	$("#addmyplan .toTop").bind({
		click:function(){
			$("#addmyplan").hide();
			$(document).scrollTop(0);
		}
	});
}

/**
* 影院菜单点击
*
* @param obj 当前对象
**/
function handleClickCinemaMenu(obj) {
	initHiddenFiledVal();
	var curMenuIndex = $(obj).parent("li").index();

	// 影院票房上传
	if(curMenuIndex == 0)
		$(".main").load(muObj.url_s0);

	// 系统排期生成
	if(curMenuIndex == 1) {
		$(".main").load(muObj.url_s1);
		$(".create-sch-box").hide();
	}

	// 票房明细比较
	if(curMenuIndex == 2)
		$(".main").load(muObj.url_s2);

	// 排期展示
	// if(curMenuIndex == 3)
	// 	$(".main").load(muObj.url10);
}

/**
* 排期展示菜单点击
**/
function handleClickSchSubNav(obj) {
	initHiddenFiledVal();
	var curIndex = $(obj).parent("li").index();
	
	// 排期展示
	if(curIndex == 0)
		$(".main").load(muObj.url_s30);

	// 按影厅显示
	if(curIndex == 1)
		$(".main").load(muObj.url_s31);

	// 按影厅名称显示
	if(curIndex == 2)
		$(".main").load(muObj.url_s32);
}