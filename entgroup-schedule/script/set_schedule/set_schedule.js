var crtLgnCinemaId;
var cinemaTimes = [];
var templateTypeObj = {"data":""};	// 模板类型对象
var timeArrays = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", 
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59"];

function setScheduleInit(templateType){
	// loginStatus();
	// setScheHandler._colligateHandler(templateType);

	// 2个模板全部加载
	setScheHandler._colligateHandler(0);
	setScheHandler._colligateHandler(1);
}

var setScheHandler = {
	_colligateHandler:function(templateType){
		crtLgnCinemaId = getCookie("cinemaId");
		setScheHandler._cinemaTimeList(templateType);
		this._saveCinemaTime();
		this._cancleSet();
	},
	_cinemaTimeList:function(templateType) {
		if (crtLgnCinemaId != "") {
			server.cinemaTimeList(
				crtLgnCinemaId, 
				templateType, 
				function(callbackData){
					if (callbackData.ret == true) {
						if(callbackData.data.beginTime != null){	// 最早开场时间
							var tempStart = callbackData.data.beginTime;

							setTimeListSltOption(tempStart, "start_hour_", "start_minute_", templateType);
						}else{
							setTimeListSltOption("10:30", "start_hour_", "start_minute_", templateType);
						}

						if(callbackData.data.endTime != null){	// 最晚开场时间
							var tempEnd = callbackData.data.endTime;

							if(tempEnd == "24:00") {
								tempEnd = "00:00";
							}

							setTimeListSltOption(tempEnd, "end_hour_", "end_minute_", templateType);
						}else{
							setTimeListSltOption("23:00", "end_hour_", "end_minute_", templateType);
						}

						if(callbackData.data.goldTime!=null){	// 黄金段开始时间
							var tempGoldTime = callbackData.data.goldTime;
							setTimeListSltOption(tempGoldTime, "gold_hour_", "gold_minute_", templateType);
						}else{
							setTimeListSltOption("19:30", "gold_hour_", "gold_minute_", templateType);
						}

						if(callbackData.data.mainDur!=null){	// 主打片场间间隔
							$("#goldInter_" + templateType).val(callbackData.data.mainDur);
						}else{
							$("#goldInter_" + templateType).val('00');
						}

						if(callbackData.data.difDur!=null){		// 不同影片场间间隔
							$("#dur_" + templateType).val(callbackData.data.difDur);
						}else{
							$("#dur_" + templateType).val('00');
						}
						// if(callbackData.data.difDur!=null){
						// 	$("#goldInter").val(callbackData.data.mainDur);
						// }else{
						// 	$("#goldInter").val('');
						// }
					}
				}
			);
		}
	},
	_saveCinemaTime:function() {
		// 工作日
		$("#savebutton_0").unbind("click").click(function(){
			saveCinemaTime(0);
		});
		// 节假日
		$("#savebutton_1").unbind("click").click(function(){
			saveCinemaTime(1);
		});
	},
	_cancleSet:function() {
		$("#canclebtn_0").unbind("click").click(function(){
			resetTimeParam(0);
		});
		$("#canclebtn_1").unbind("click").click(function(){
			resetTimeParam(1);
		});
	}
};

/**
* 保存对应模板时间参数
*
* @param templateV 当前模板
**/
function saveCinemaTime(templateV) {
	var beginTimeHour = $("#start_hour_" + templateV).find("option:selected").val();	// 最早开场时间:时
	var beginTimeMinute = $("#start_minute_" + templateV).find("option:selected").val();	// 最早开场时间:分
	var beginTime = beginTimeHour + ":" + beginTimeMinute;	// 最早开场时间

	var endTimeHour = $("#end_hour_" + templateV).find("option:selected").val();	// 最晚开场时间:时
	var endTimeMinute = $("#end_minute_" + templateV).find("option:selected").val();	// 最晚开场时间:分
	var endTime = endTimeHour + ":" + endTimeMinute;	// 最晚开场时间

	var goldTimeHour = $("#gold_hour_" + templateV).find("option:selected").val();		// 黄金段开始时间:时
	var goldTimeMinute = $("#gold_minute_" + templateV).find("option:selected").val();		// 黄金段开始时间:分
	var goldTime = goldTimeHour + ":" + goldTimeMinute;		// 黄金段开始时间

	var difDur = $("#dur_" + templateV).val();				// 不同影片场间间隔
	var sdur = "";
	var mainDur = $("#goldInter_" + templateV).val();		// 主打片场间间隔
	sdur = sdur == undefined ? 0 : sdur;	// HTML隐藏了 "场间最小间隔(相同影片)" 2015-05-13

	// var curTodayTemplate = templateTypeObj.data;	// 模板类型
	var curTodayTemplate = templateV;	// 模板类型

	var cf_end_time_hour = $("#cartoon_hour_" + templateV).find("option:selected").val();	// 儿童片:时
	var cf_end_time_minute = $("#cartoon_minute_" + templateV).find("option:selected").val();	// 儿童片:分
	var cf_end_time = cf_end_time_hour + ":" + cf_end_time_minute;	// 儿童片

	var dm_begin_time = $("#main_pri_horror_start_time").val();	// 恐怖片

	if(beginTime.trim() == ""){
		tipMsg_Single('setTimeTemplate', 0, "请设置 最早开始时间", 0, '', '');
		return;
	}else {
		var tempBegin = beginTime.split(":");

		if(tempBegin[0] == "00"){
			tipMsg_Single('setTimeTemplate', 0, "最早开始时间建议在 12:00 之前", 0, '', '');
			return;
		}else if(parseInt(tempBegin[0]) > 12) {
			tipMsg_Single('setTimeTemplate', 0, "最早开始时间建议在 12:00 之前", 0, '', '');
			return;
		}
	}

	if(endTime.trim() == ""){
		tipMsg_Single('setTimeTemplate', 0, "请设置 最晚开始时间", 0, '', '');
		return;
	}else if(endTime.trim() == "00:00") {
		endTime = "24:00";
	}

	if(goldTime.trim() == "00:00"){
		tipMsg_Single('setTimeTemplate', 0, "请设置 晚场黄金时段开始时间", 0, '', '');
		return;
	}

	if(mainDur.trim() == ""){
		tipMsg_Single('setTimeTemplate', 0, "请设置 主打片场次间隔", 0, '', '');
		$("#goldInter_" + templateV).focus();
		return;
	}

	if(difDur.trim() == ""){
		tipMsg_Single('setTimeTemplate', 0, "请设置 不同影片场次间隔", 0, '', '');
		$("#dur_" + templateV).focus();
		return;
	}

	if(crtLgnCinemaId != "") {
		server.saveCinemaTime(
			crtLgnCinemaId, 
			curTodayTemplate,
			beginTime, 
			endTime,
			goldTime,
			difDur,
			sdur,
			mainDur,
			cf_end_time,
			dm_begin_time, 
			function(callback){
				if(callback.ret) {
					if(curTodayTemplate == 0) {
						tipMsg_Single('setTimeTemplate', 0, "工作日排期模板设置成功!", 0, '', '');
					}
					if(curTodayTemplate == 1) {
						tipMsg_Single('setTimeTemplate', 0, "节日排期模板设置成功!", 0, '', '');
					}
					setTimeout("goPlanlist()", 500);	// 500毫秒后转至 排片计划
				}
			}
		);
	}
}

/**
* 取消参数设置
**/
function resetTimeParam(templateV) {
	$("#start_hour_" + templateV).find("option:eq(0)").attr("selected", "selected");
	$("#start_minute_" + templateV).find("option:eq(0)").attr("selected", "selected");

	$("#end_hour_" + templateV).find("option:eq(0)").attr("selected", "selected");
	$("#end_minute_" + templateV).find("option:eq(0)").attr("selected", "selected");

	$("#gold_hour_" + templateV).find("option:eq(0)").attr("selected", "selected");
	$("#gold_minute_" + templateV).find("option:eq(0)").attr("selected", "selected");

	$("#cartoon_hour_" + templateV).find("option:eq(0)").attr("selected", "selected");
	$("#cartoon_minute_" + templateV).find("option:eq(0)").attr("selected", "selected");

	$("#goldInter_" + templateV).val("");
	$("#dur_" + templateV).val("");
}

// 2015-05-14 页面结构更改
$(function() {
	// 初始选择模板
	getTemplate();

	showUserCenter();
});

/**
* 初始化模板选择（根据返回值，决定默认进入哪个模板）
*
* @param todayTemplate 当日模板参数(0: 工作日模板, 1: 节假日模板)
* */
function initScheduleTemplate(todayTemplate) {
	if(todayTemplate == 0){
		setScheduleInit(todayTemplate);
		templateTypeObj.data = todayTemplate;	// 更新模板类型对象值
		// 初始化时间列表
		// initTimeList(todayTemplate);
	}

	if(todayTemplate == 1){
		setScheduleInit(todayTemplate);
		templateTypeObj.data = todayTemplate;	// 更新模板类型对象值
		// 初始化时间列表
		// initTimeList(todayTemplate);
	}
	// 加载两个模板数据
	initTimeList(0);
	initTimeList(1);
}

/**
* 获取当天是工作日 or 节假日
**/
function getTemplate(){
	var templateTypeObjData = templateTypeObj.data;

	if(templateTypeObjData == ""){
		var dateSelfObj = new commonDateCtrl();
		var todayTemplate = dateSelfObj.getWeekdaysOrHoliday();
		if(todayTemplate == 0){
			
		}
		if(todayTemplate == 1){
			
		}
		initScheduleTemplate(todayTemplate);
		templateTypeObj.data = todayTemplate;
	}else{
		initScheduleTemplate(templateTypeObjData);
	}
}

/**
* 保存排期设置后，跳转到排片计划模块
**/
function goPlanlist() {
	clickSubMenu($(".ul-nav").find(".li-nav:eq(2)").find(".sub-nav").find("a:eq(0)"), 2, 0);
	clickSubNav($(".ul-nav").find(".li-nav:eq(2)").find(".li-nav-a"));
}

/**
* 输入分钟数校验
**/
function checkTimeFromEnter(thisID, thisValue, thisObj) {
	if(thisValue.trim() != ""){
		if(isNaN(thisValue)){
			tipMsg_Single(thisID, 0, "请输入数字", 0, null, '');
			$(thisObj).addClass("ss-param-ipt-error");
			$(thisObj).val("");
			$(thisObj).focus();
		}else if(thisValue*1 == 0){
			tipMsg_Single(thisID, 0, "请输入大于0的数字", 0, null, '');
			$(thisObj).addClass("ss-param-ipt-error");
			$(thisObj).val("");
			$(thisObj).focus();
		}else
			$(thisObj).removeClass("ss-param-ipt-error");
	}
}

/**
* 处理时间列表选中项
*
* @param interTimeData 接口返回的时间值
* @param hourObjID 时位目标对象ID
* @param minuteObjID 分位目标对象ID
* @param templateV 当前模板值
**/
function setTimeListSltOption(interTimeData, hourObjID, minuteObjID, templateV) {
	var tempArr = interTimeData.split(":");
	var hourListObj = $("#" + hourObjID + templateV).find("option"), hourListObjL = hourListObj.length;
	var minuteListObj = $("#" + minuteObjID + templateV).find("option"), minuteListObjL = minuteListObj.length;

	// 时
	for (var i = 0; i < hourListObjL; i++) {
		if($(hourListObj[i]).val() == tempArr[0]) {
			$(hourListObj[i]).attr("selected", "selected");
			break;
		}
	}

	// 分
	for (var j = 0; j < minuteListObjL; j++) {
		if($(minuteListObj[j]).val() == tempArr[1]) {
			$(minuteListObj[j]).attr("selected", "selected");
			break;
		}
	}
}

/**
* 创建时间列表
*
* @param objID 目标对象ID
* @param level 当前时间级别(0:时, 1:分, 2:秒)
* @param templateValue  当前模板值(0:工作日模板, 1:节假日模板)
**/
function createTimeList(objID, level, templateValue) {
	var len = timeArrays.length, optionHtml = "", timeObj = null;

	// 取对应模板的时间对象
	if(templateValue == 0){
		timeObj = $("#workday_template").find("#" + objID);
		// 清空当前时间列表
		$(timeObj).empty();
	}
	if(templateValue == 1){
		timeObj = $("#holiday_template").find("#" + objID);
		// 清空当前时间列表
		$(timeObj).empty();
	}

	if(level == 0) {
		for (var i = 0; i < 24; i++) {
			optionHtml = "<option value='" + timeArrays[i] + "' label='" + timeArrays[i] + "'>" + timeArrays[i] + "</option>";
			$(timeObj).append(optionHtml);
			// $("#" + objID).append(optionHtml);
		}
	}

	if(level == 1 || level == 2) {
		for (var i = 0; i < len; i++) {
			optionHtml = "<option value='" + timeArrays[i] + "' label='" + timeArrays[i] + "'>" + timeArrays[i] + "</option>";
			$(timeObj).append(optionHtml);
			// $("#" + objID).append(optionHtml);
		}
	}
}

/**
* 初始化时间列表
*
* @param templateValue 当前模板值(0:工作日模板, 1:节假日模板)
**/
function initTimeList(templateValue) {
	// 最早开始时间
	createTimeList("start_hour_" + templateValue, 0, templateValue);
	createTimeList("start_minute_" + templateValue, 1, templateValue);
	createTimeList("start_second_" + templateValue, 2, templateValue);

	// 最晚开始时间
	createTimeList("end_hour_" + templateValue, 0, templateValue);
	createTimeList("end_minute_" + templateValue, 1, templateValue);
	createTimeList("end_second_" + templateValue, 2, templateValue);

	// 晚场黄金时间
	createTimeList("gold_hour_" + templateValue, 0, templateValue);
	createTimeList("gold_minute_" + templateValue, 1, templateValue);
	createTimeList("gold_second_" + templateValue, 2, templateValue);

	// 动画片最晚放映时间
	createTimeList("cartoon_hour_" + templateValue, 0, templateValue);
	createTimeList("cartoon_minute_" + templateValue, 1, templateValue);
	createTimeList("cartoon_second_" + templateValue, 2, templateValue);
}