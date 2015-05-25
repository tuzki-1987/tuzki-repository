/**
 * 本月累计
 **/

 $(function(){
 	resultA = {};	// 全局对象，存放接口返回数据
 	contnerObj = "#chartContainer";	// 图表容器对象(全局)

 	// 初始化右侧的标题的日期
 	$("#mtOneDayDate").text("("+getCurDate()+")");
 	// 初始化左侧的日期控件的值
 	$("#mtOneDaySltDate").val(getCurDate());

 	// 图表初始化
 	var pieCharDateInit = $("#mtOneDayDate").text();
 	pieCharDateInit = pieCharDateInit.substring(1, pieCharDateInit.length - 1);
	var dataR = monthTotalInterface("mtTicketTotal", getCurDate(), "");	// 初始数据集
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();	// 初始Y轴标题
 	showCharFunc(contnerObj, dataR, "pieChar", "", "", yAxisTitle, pieCharDateInit);	// 初始图表

 	// 单日排片
 	$("#mtOneDay").find("a").bind("click", mtSubMenuClickStyle);

 	// 分时排片
 	$("#mtTimeCycle").find("a").bind("click", mtSubMenuClickStyle);

 	// 数据展示
 	$("#mtShowDataKinds").find("a").bind("click", mtSubMenuClickStyle);

 	// 单日、趋势 点击事件
 	$(".mt_title_cnt").find("a").click(function(){
 		var curIndex = $(this).index();		// 当前点击对象的索引
 		var curObjId = $(this).attr("id");	// 当前点击对象的ID

 		// 展示图表函数所需参数
 		var charType = "";
 		var title = "";
 		var subTitle = "";
 		var yAxisTitle = "";
 		var pieCharDateCurr = $("#mtOneDayDate").text();
 		pieCharDateCurr = pieCharDateCurr.substring(1, pieCharDateCurr.length - 1);
 		

 		$(".mt_title_cnt").find("a").removeClass("active normal");
 		$(this).addClass("active");
 		if(curIndex == 0){	// 单日
 			$(".mt_title_cnt").find("a:eq(1)").addClass("normal");
 			charType = "pieChar";
 			title = "";
 			subTitle = "";
 		}
 		if(curIndex == 1){	// 趋势
 			$(".mt_title_cnt").find("a:eq(0)").addClass("normal");
 			charType = "lineChar";
 			title = "";
 			subTitle = "";
 			yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();
 		}
 			
 		showCharFunc(contnerObj, resultA, charType, title, subTitle, yAxisTitle, pieCharDateCurr);
 	});
 });

/**
* （本月累计）二级菜单点击事件 —— 样式及日期值重置，准备请求接口
*
**/
function mtSubMenuClickStyle(){
	var clickParentObj = $(this).parent().attr("id");
	var clickObjIndex = $(this).index();
 	var clickObjName = $(this).attr("name");
 	// alert(clickParentObj+" - "+clickObjIndex+" - "+clickObjName);

 	// 重置展示区选项卡样式
 	$(".mt_title_cnt").find("a").removeClass("active normal");
 	$(".mt_title_cnt").find("a:eq(0)").addClass("active");
 	$(".mt_title_cnt").find("a:eq(1)").addClass("normal");

 	$("#" + clickParentObj).find("a").unbind("click");	// 移除所有点击绑定
	$("#" + clickParentObj).find("a").removeClass("active");	// 移除所有激活样式
	$("#" + clickParentObj).find("a:eq(" + (clickObjIndex-1) + ")").addClass("active");	// 为当前点击添加激活样式
	var curAobjNums = $("#" + clickParentObj).find("a");
	for (var i = 0; i < curAobjNums.length; i++) {	// 为当前子模块重新绑定点击事件。除了当前激活的，为了避免重复点击请求接口
		if(i != clickObjIndex-1)
			$("#" + clickParentObj).find("a:eq(" + i + ")").bind("click", mtSubMenuClickStyle);
	}

	if(clickParentObj == "mtOneDay"){
		$("#" + clickParentObj).find("span").text("");
		if(clickObjIndex == 1){
			$("#" + clickParentObj).find("a:eq(" + (clickObjIndex-1) + ")").find("span").text("（"+SetDateStr(-1, "")+"）");
			$("#mtOneDayDate").text("(" + SetDateStr(-1, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(-1, ""));
		}
			
		if(clickObjIndex == 2){
			$("#" + clickParentObj).find("a:eq(" + (clickObjIndex-1) + ")").find("span").text("（"+SetDateStr(0, "")+"）");
			$("#mtOneDayDate").text("(" + SetDateStr(0, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(0, ""));
		}
			
		if(clickObjIndex == 3){
			$("#" + clickParentObj).find("a:eq(" + (clickObjIndex-1) + ")").find("span").text("（"+SetDateStr(1, "")+"）");
			$("#mtOneDayDate").text("(" + SetDateStr(1, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(1, ""));
		}
	}

	// 组织调用接口参数
	var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
	var singleDate = $("#mtOneDay").find("a.active").find("span").text();		// 当前点击的单日排片日期
	var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单
	// 获取日期参数
	if(singleDate == ""){
		singleDate = $("#mtOneDay").find("#mtOneDaySltDate").val();
	}else{
		singleDate = singleDate.substring(1, singleDate.length - 1);
	}
	// alert(interfaceKind+" - "+singleDate+" - "+timeCycle);

	var dataR = monthTotalInterface(interfaceKind, singleDate, timeCycle);
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

	showCharFunc(contnerObj, dataR, "pieChar", "", "", yAxisTitle, singleDate);
}

/**
* 日期框选择事件
**/
function WdatePickedFunc(){
	var sltDate = $dp.cal.getDateStr();

	var yestD = SetDateStr(-1, "");	// 昨天
	var todyD = SetDateStr(0, "");	// 今天
	var tmrwD = SetDateStr(1, "");	// 明天

	$("#mtOneDay").find("a").removeClass("active");	// 清空样式
	$("#mtOneDay").find("span").text("");	// 清空日期值
	if(sltDate > tmrwD){}
	if(sltDate == tmrwD){
		$("#mtOneDay").find("a:eq(2)").addClass("active");
		$("#mtOneDay").find("a:eq(2)").find("span").text("（"+sltDate+"）");
	}
	if(sltDate == todyD){
		$("#mtOneDay").find("a:eq(1)").addClass("active");
		$("#mtOneDay").find("a:eq(1)").find("span").text("（"+sltDate+"）");
	}
	if(sltDate == yestD){
		$("#mtOneDay").find("a:eq(0)").addClass("active");
		$("#mtOneDay").find("a:eq(0)").find("span").text("（"+sltDate+"）");
	}

	// 重置展示区选项卡样式和日期值
 	$(".mt_title_cnt").find("a").removeClass("active normal");
	$(".mt_title_cnt").find("a:eq(0)").find("#mtOneDayDate").text("(" + sltDate + ")");
 	$(".mt_title_cnt").find("a:eq(0)").addClass("active");
 	$(".mt_title_cnt").find("a:eq(1)").addClass("normal");

	// 组织调用接口参数
	var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
	var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单

	var dataR = monthTotalInterface(interfaceKind, sltDate, timeCycle);
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

	showCharFunc(contnerObj, dataR, "pieChar", "", "", yAxisTitle, sltDate);
}

/**
* 调用指定接口（同步调用）
*
* @param interfaceKind 接口类别（调用哪类接口）
* @param singleDate 日期
* @param timeCycle 时间段
**/
function monthTotalInterface(interfaceKind, singleDate, timeCycle){
	// alert(interfaceKind+" - "+singleDate+" - "+timeCycle);
	var cinemaId = "123";
	
	if(cinemaId.trim() != ""){
		// 排片率
		if(interfaceKind == "mtSetFilmRate"){
			resultA = {};
		}

		// 场次数
		if(interfaceKind == "mtTicketTotal"){
			var tempData = { "ver" : "1.0" , "ret" : true , "errcode" : 0 , "errmsg" : "" , "cinemaId" : 486,  
							"data" : [ 
								{ "filmId" : 1, "filmName" : "复仇者联盟2：奥创纪元", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 40 , "sessionCountRate" : 1.8}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 70 , "sessionCountRate" : 1.7}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 60 , "sessionCountRate" : 1.6}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 50 , "sessionCountRate" : 1.5 },
											{"showDate" : "2015-05-09" , "sessionCount" : 60 , "sessionCountRate" : 1.4},
											{"showDate" : "2015-05-08" , "sessionCount" : 85 , "sessionCountRate" : 1.35}, 
											{"showDate" : "2015-05-07" , "sessionCount" : 100 , "sessionCountRate" : 1.3}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 120 , "sessionCountRate" : 1.2},
											{"showDate" : "2015-05-05" , "sessionCount" : 110 , "sessionCountRate" : 1.1},
											{"showDate" : "2015-05-04" , "sessionCount" : 135 , "sessionCountRate" : 1.0},
											{"showDate" : "2015-05-03" , "sessionCount" : 150 , "sessionCountRate" : 1.05}, 
											{"showDate" : "2015-05-02" , "sessionCount" : 165 , "sessionCountRate" : 0.95},
											{"showDate" : "2015-05-01" , "sessionCount" : 180 , "sessionCountRate" : 0.9}] 
								}, 
								{ "filmId" : 2, "filmName" : "何以笙箫默", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 90 , "sessionCountRate" : 1.2}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 110 , "sessionCountRate" : 1.1}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 100 , "sessionCountRate" : 1.0}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 120 , "sessionCountRate" : 0.9},
											{"showDate" : "2015-05-06" , "sessionCount" : 170 , "sessionCountRate" : 1.0}] 
								} , 
								{ "filmId" : 3, "filmName" : "战狼", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 100 , "sessionCountRate" : 3.0}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 130 , "sessionCountRate" : 2.0}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 150 , "sessionCountRate" : 2.8}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 170 , "sessionCountRate" : 2.7},
											{"showDate" : "2015-05-09" , "sessionCount" : 180 , "sessionCountRate" : 2.6},
											{"showDate" : "2015-05-08" , "sessionCount" : 200 , "sessionCountRate" : 2.5},
											{"showDate" : "2015-05-07" , "sessionCount" : 190 , "sessionCountRate" : 2.4}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 210 , "sessionCountRate" : 2.3},
											{"showDate" : "2015-05-05" , "sessionCount" : 220 , "sessionCountRate" : 2.2},
											{"showDate" : "2015-05-04" , "sessionCount" : 245 , "sessionCountRate" : 2.05},
											{"showDate" : "2015-05-03" , "sessionCount" : 260 , "sessionCountRate" : 2.0}, 
											{"showDate" : "2015-05-02" , "sessionCount" : 275 , "sessionCountRate" : 1.95},
											{"showDate" : "2015-05-01" , "sessionCount" : 295 , "sessionCountRate" : 1.9},
											{"showDate" : "2015-04-30" , "sessionCount" : 285 , "sessionCountRate" : 1.85},
											{"showDate" : "2015-04-29" , "sessionCount" : 300 , "sessionCountRate" : 1.6}] 
								} , 
								{ "filmId" : 4, "filmName" : "左耳", 
									"data" : [{"showDate" : "2015-05-07" , "sessionCount" : 100 , "sessionCountRate" : 1.5}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 130 , "sessionCountRate" : 1.3 },
											{"showDate" : "2015-05-05" , "sessionCount" : 125 , "sessionCountRate" : 1.2},
											{"showDate" : "2015-05-04" , "sessionCount" : 105 , "sessionCountRate" : 1.05},
											{"showDate" : "2015-05-03" , "sessionCount" : 120 , "sessionCountRate" : 0.9}, 
											{"showDate" : "2015-05-02" , "sessionCount" : 135 , "sessionCountRate" : 0.85},
											{"showDate" : "2015-05-01" , "sessionCount" : 150 , "sessionCountRate" : 0.7}] 
								} , 
								{ "filmId" : 5, "filmName" : "速度与激情7", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 110 , "sessionCountRate" : 2.8}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 140 , "sessionCountRate" : 2.7}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 160 , "sessionCountRate" : 2.6}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 170 , "sessionCountRate" : 2.5},
											{"showDate" : "2015-05-09" , "sessionCount" : 200 , "sessionCountRate" : 2.4},
											{"showDate" : "2015-05-08" , "sessionCount" : 215 , "sessionCountRate" : 2.3},
											{"showDate" : "2015-05-07" , "sessionCount" : 210 , "sessionCountRate" : 2.2}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 230 , "sessionCountRate" : 2.1},
											{"showDate" : "2015-05-05" , "sessionCount" : 240 , "sessionCountRate" : 2.0},
											{"showDate" : "2015-05-04" , "sessionCount" : 265 , "sessionCountRate" : 1.95},
											{"showDate" : "2015-05-03" , "sessionCount" : 270 , "sessionCountRate" : 1.8}, 
											{"showDate" : "2015-05-02" , "sessionCount" : 285 , "sessionCountRate" : 1.65}] 
								} , 
								{ "filmId" : 6, "filmName" : "万物生长", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 60 , "sessionCountRate" : 1.7}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 80 , "sessionCountRate" : 1.6}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 100 , "sessionCountRate" : 1.5}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 110 , "sessionCountRate" : 1.4},
											{"showDate" : "2015-05-09" , "sessionCount" : 130 , "sessionCountRate" : 1.3},
											{"showDate" : "2015-05-08" , "sessionCount" : 150 , "sessionCountRate" : 1.2},
											{"showDate" : "2015-05-07" , "sessionCount" : 170 , "sessionCountRate" : 1.0},
											{"showDate" : "2015-05-06" , "sessionCount" : 170 , "sessionCountRate" : 1.0}] 
								}, 
								{ "filmId" : 7, "filmName" : "测试影片1", 
									"data" : [{"showDate" : "2015-05-12" , "sessionCount" : 90 , "sessionCountRate" : 1.9}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 80 , "sessionCountRate" : 1.8}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 100 , "sessionCountRate" : 1.7},
											{"showDate" : "2015-05-09" , "sessionCount" : 105 , "sessionCountRate" : 1.6},
											{"showDate" : "2015-05-08" , "sessionCount" : 120 , "sessionCountRate" : 1.5},
											{"showDate" : "2015-05-07" , "sessionCount" : 145 , "sessionCountRate" : 1.3}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 160 , "sessionCountRate" : 1.2},
											{"showDate" : "2015-05-05" , "sessionCount" : 180 , "sessionCountRate" : 1.1},
											{"showDate" : "2015-05-04" , "sessionCount" : 190 , "sessionCountRate" : 1.0}] 
								} , 
								{ "filmId" : 8, "filmName" : "测试影片2", 
									"data" : [{"showDate" : "2015-05-13" , "sessionCount" : 100 , "sessionCountRate" : 2.3}, 
											{"showDate" : "2015-05-12" , "sessionCount" : 120 , "sessionCountRate" : 2.2}, 
											{"showDate" : "2015-05-11" , "sessionCount" : 130 , "sessionCountRate" : 2.1}, 
											{"showDate" : "2015-05-10" , "sessionCount" : 140 , "sessionCountRate" : 2.0},
											{"showDate" : "2015-05-09" , "sessionCount" : 160 , "sessionCountRate" : 1.9},
											{"showDate" : "2015-05-08" , "sessionCount" : 180 , "sessionCountRate" : 1.8},
											{"showDate" : "2015-05-07" , "sessionCount" : 200 , "sessionCountRate" : 1.7}, 
											{"showDate" : "2015-05-06" , "sessionCount" : 220 , "sessionCountRate" : 1.6},
											{"showDate" : "2015-05-05" , "sessionCount" : 240 , "sessionCountRate" : 1.7},
											{"showDate" : "2015-05-04" , "sessionCount" : 230 , "sessionCountRate" : 1.3}] 
								}  ]
							}
			resultA = tempData;
			/*server.filmTicketTotal(cinemaId, singleDate, function(callback){
				if(callback.ret){
					resultA = callback.data;
				}else{	// 接口异常

				}
			});*/
		}

		// 票房占比
		if(interfaceKind == "mtTicketRate"){
			resultA = {};
			/*server.ticketRateTotal(cinemaId, singleDate, function(callback){
				if(callback.ret){
					resultA = callback.data;
				}else{	// 接口异常

				}
			});*/
		}

		return resultA;
	}else{
		tipMsg_Single("mtShowDataKinds", 0, "登录状态已过期，请重新登录", 0, '', '');
		resultA = {};
		return resultA;
	}
}

/**
* 单日、趋势 点击函数
* */
function slickSglDayAndTrend(){}

