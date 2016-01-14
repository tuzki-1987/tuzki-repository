/*
 * 公用文件
 */


/**
* 菜单URL配置
*
* url0:我的影院, url1:排期设置, url20: 推荐排片, url21: 自定义排片, url30: 排期展示, url31: 按影厅展示, 
* url32: 按影片名称展示, url40: 观影成绩单, url41: 首周人次分析, url42: 当日前五, url43: 统计分析
**/
var muObj = {
	"url0": "page/my_cinema.html",
	"url1": "page/set_schedule.html",
	"url20": "page/planlist/recommand-planlist.html",
	"url21": "page/planlist/custom-planlist.html",
	"url30": "page/intelligent-sch/show_schedule.html",
	"url31": "page/intelligent-sch/show_hall.html",
	"url32": "page/intelligent-sch/show_movie_name.html",
	"url40": "page/boxoffice/box_office_report.html",
	"url41": "page/boxoffice/person_of_film.html",
	"url42": "page/boxoffice/top5.html",
	"url43": "page/boxoffice/month_total.html",
	"loadImg": "<center><img src='images/load.gif' /></center>"
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
* 屏幕对象
**/
var screenObj = {
	// 工作区宽度、高度
	screenW: window.screen.width,
	screenH: window.screen.height,
	// 可用工作区宽度、高度
	workW: window.screen.availWidth,
	workH: window.screen.availHeight,
	// 浏览器可用宽度、高度
	clientW: document.documentElement.clientWidth,
	clientH: document.documentElement.clientHeight
};

/**
* 设置左侧内容框高度
**/
var leftAreaObj = {
	setLeftAreaH: function() {
		var curH = screenObj.clientH;	// 浏览器可用高度
		var leftH = $(".btm-left-box").height();	// 左侧内容框高度
		var rightH = $(".btm-right-box").height() + 50;	// 右侧内容框高度
		var dtH = $(document).height();	// 文档高度
		var sclTop = $(window).scrollTop();	// 滚动条距离顶端高度

		if(dtH > 0 && dtH > curH && (rightH*1+64) < curH*1) {
			$(".btm-left-box").css("height", dtH + "px");
		}else {
			if((rightH*1+64) < curH*1) {
				$(".btm-left-box").css("height", (curH - 64 + 10) + "px");
			}
			if((rightH*1+64) > curH*1) {
				$(".btm-left-box").css("height", (rightH+64) + "px");
			}
			if((rightH*1+64) == curH*1) {
				$(".btm-left-box").css("height", (rightH+64) + "px");
			}
		}
	}
};

/**
* 加载页面
*
* @param firstLevel 一级菜单索引值
* @param subLevel 二级菜单索引值
**/
function loadPage(firstLevel, subLevel) {
	$(".inner-box").html(muObj.loadImg);

	// 我的影院
	if(firstLevel == 0) {
		$(".inner-box").load(muObj.url0);
	}
	// 排期设置
	if(firstLevel == 1) {
		$(".inner-box").load(muObj.url1);
	}
	// 排片计划
	if(firstLevel == 2) {
		// 推荐排片
		if(subLevel == 0) {
			$(".inner-box").load(muObj.url20);
		}
		// 自定义排片
		if(subLevel == 1) {
			$(".inner-box").load(muObj.url21);
		}
	}
	// 智能排片
	if(firstLevel == 3) {
		// 排期展示
		if(subLevel == 0) {
			$(".inner-box").load(muObj.url30);
		}
		// 按影厅显示
		if(subLevel == 1) {
			$(".inner-box").load(muObj.url31);
		}
		// 按影片名称显示
		if(subLevel == 2) {
			$(".inner-box").load(muObj.url32);
		}
	}
	// 观影成绩单
	if(firstLevel == 4) {
		// 观影成绩单
		if(subLevel == 0) {
			$(".inner-box").load(muObj.url40);
		}
		// 首周人次分析
		if(subLevel == 1) {
			$(".inner-box").load(muObj.url41);
		}
		// 当日前五
		if(subLevel == 2) {
			$(".inner-box").load(muObj.url42);
		}
		// 统计分析
		if(subLevel == 3) {
			$(".inner-box").load(muObj.url43);
		}
	}
}

/**
* 图片复选框模拟点击事件
*
* @param obj 当前点击对象
**/
function checkBoxImg(obj) {
	// 当前图片复选框的状态值(0:未选中, 1:已选中)
	var data = $(obj).find("img").attr("data");

	if(data*1 == 0) {
		$(obj).find("img").attr("src", "images/chk2.png");
		$(obj).find("img").attr("data", "1");
		setCookie("autoRecmd", 1, 40);
	}

	if(data*1 == 1) {
		$(obj).find("img").attr("src", "images/chk1.png");
		$(obj).find("img").attr("data", "0");
		setCookie("autoRecmd", 0, 40);
	}
}