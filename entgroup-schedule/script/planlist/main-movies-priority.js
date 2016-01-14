/**
* 主打片设置
**/


var controlShowHide = 0, controlShowHide3 = 0;	// 循环显示、隐藏的控制变量
var objX;				// 用于隐藏当前对象的 "坐标比较变量"
var flag_filmListPannel = "";	// 为影片列表面板 区分"添加"、"编辑"的标签
var film_list_pannel =  "", film_list_pannel3 =  "";	// 影片列表
var template_status = null;	// 当前模板值
var editFlag = false;	// 编辑标签
var countBeforeEdit = 0;	// 修改前的场次数
var usedFilmArr = [];	// 已使用影片(存放影片ID)
$(function() {
	usedFilmArr = [];	// 初始化重置

	// 设置内容区高度
	setPageHeight("gzt_warp");

	// 获取当天所属排气模板类型(0: 工作日, 1: 节假日)
	var dateSelfObj = new commonDateCtrl();
	var todayTemplate = dateSelfObj.getWeekdaysOrHoliday();
	if(todayTemplate == 0){
		template_status = 0;
	}
	if(todayTemplate == 1){
		template_status = 1;
	}

	// 执行加载时间参数
	if(getCookie("cinemaId") != "") {
		loadTimeParam(getCookie("cinemaId"), template_status);
		getPlanId(2);
		getHallNum(getCookie("cinemaId"));
	}

	//	延迟获取影片列表
	setTimeout(function() {
		flag_filmListPannel = "flag_add";
		filmListPannel();
		_handlerFunc();
		_handlerFunc3();
		loadMainPriRateList(true);
	}, 500);

	// 第一步:下一步按钮
	$("#mainPriBtn1").click(function() {
		// 首先判断登录状态
		loginStatus();

		var mp_start_time = $("#main_pri_start_time").val();
		var mp_cartoon_end_time = $("#main_pri_cartn_ent_time").val();
		var mp_end_time = $("#main_pri_end_time").val();
		var mp_horror_start_time = $("#main_pri_horror_start_time").val();
		var saveStatus = $("#mp_step1_oper_save").attr("data");

		if(mp_start_time.trim()  == "") {
			tipMsg_Single('gzt_show', 0, "请设置主打片 开始时间", 0, '', '');
			return;
		}

		if(mp_cartoon_end_time.trim()  == "") {
			tipMsg_Single('gzt_show', 0, "请设置儿童片 结束时间", 0, '', '');
			return;
		}

		if(mp_end_time.trim()  == "") {
			tipMsg_Single('gzt_show', 0, "请设置主打片 结束时间", 0, '', '');
			return;
		}

		if(mp_horror_start_time.trim()  == "") {
			tipMsg_Single('gzt_show', 0, "请设置恐怖片 开始时间", 0, '', '');
			return;
		}

		if(saveStatus*1 == 0) {
			tipMsg_Single('gzt_show', 0, "请点击保存按钮，保存当前数据", 0, '', '');
			return;
		}

		$(".mp-step-1").slideUp().hide(100);
		// 动画效果
		$(".mp-step-2").slideUp().show(1000);
	});

	// 第一步:保存按钮
	$("#mp_step1_oper_save").click(function() {
		// 首先判断登录状态
		loginStatus();
		var mp_start_time = $("#main_pri_start_time").val();
		var mp_cartoon_end_time = $("#main_pri_cartn_ent_time").val();
		var mp_end_time = $("#main_pri_end_time").val();
		var mp_horror_start_time = $("#main_pri_horror_start_time").val();

		// 保存时间参数
		saveTimeParam(getCookie("cinemaId"), template_status);
	});

	// 第二步:上一步按钮
	$("#mainPriBtn2Pre").click(function() {
		// 首先判断登录状态
		loginStatus();
		$(".mp-step-2").slideDown().hide();
		$(".mp-step-1").slideDown().show();
	});

	// 第二步:下一步按钮
	$("#mainPriBtn2Next").click(function() {
		// 首先判断登录状态
		loginStatus();

		var mpFilmName = $("#main_pri_film_name").attr("data");
		var mpFilmTime = $("#main_pri_film_time").val();
		var mpFilmDur = $("#main_pri_dur_time").val();
		var mpFilmCount = $("#main_pri_film_count").val();
		var mpSaveStatus = $("#mp_step2_oper_save").attr("data");

		if(mpFilmName*1 == 0) {
			tipMsg_Single('gzt_show', 0, "请选择影片", 0, '', '');
			return;
		}

		if(mpFilmTime == "") {
			tipMsg_Single('gzt_show', 0, "请填写 影片时长", 0, '', '');
			return;
		}else if(mpFilmTime*1 == 0) {
			tipMsg_Single('gzt_show', 0, "影片时长无效", 0, '', '');
			$("#main_pri_film_time").focus();
			return;
		}

		if(mpFilmDur == "") {
			tipMsg_Single('gzt_show', 0, "请填写 影片场次间隔时间", 0, '', '');
			return;
		}

		if(mpFilmCount == "请点击试算按钮") {
			tipMsg_Single('gzt_show', 0, "请点击试算按钮，获取预排场次数", 0, '', '');
			return;
		}

		if(mpSaveStatus*1 == 0) {
			tipMsg_Single('gzt_show', 0, "请点击保存按钮，保存当前数据", 0, '', '');
			return;
		}

		$(".mp-step-2").slideUp().hide(100);
		$(".mp-step-3").slideUp().show(1000);
		$("#mp_step2_oper_save").attr("disabled", "disabled");
		$("#mp_step2_oper_save").attr("data", "0");

		$(".pri-film-initlist").empty();
		loadMainPriRateList(false);
	});

	// 第二步:试算按钮
	$("#mp_step2_oper_clclt").click(function() {
		// 首先判断登录状态
		loginStatus();
		var mpCinemaId = getCookie("cinemaId");
		var mpFilmName = $("#main_pri_film_name").attr("data");
		var mpFilmCode = $("#mp_film_code").val();
		var mpFilmTime = $("#main_pri_film_time").val();
		var mpFilmDur = $("#main_pri_dur_time").val();
		var mpTempStatus = template_status;

		if(mpFilmName*1 == 0) {
			tipMsg_Single('gzt_show', 0, "请选择影片", 0, '', '');
			return;
		}else if(mpFilmCode == "") {
			tipMsg_Single('gzt_show', 0, "该影片数据不全(无影片编码), 不能作为主打片", 0, '', '');
			return;
		}

		if(mpFilmTime == "") {
			tipMsg_Single('gzt_show', 0, "请填写 影片时长", 0, '', '');
			return;
		}else if(mpFilmTime*1 == 0) {
			tipMsg_Single('gzt_show', 0, "影片时长无效", 0, '', '');
			$("#main_pri_film_time").focus();
			return;
		}

		if(mpFilmDur == "") {
			tipMsg_Single('gzt_show', 0, "请填写 影片场次间隔时间", 0, '', '');
			return;
		}

		// 请求试算接口, 成功后, 移除"保存按钮"的disabled属性
		server.mainPriorityCount(mpCinemaId*1, mpFilmCode, mpFilmTime*1, mpTempStatus.toString(), mpFilmDur*1, function(callback){
			if(callback.ret) {
				tipMsg_Single('gzt_show', 0, "试算成功", 0, '', '');
				$("#main_pri_film_count").val(callback.count);
				$("#main_pri_film_count").css({"color":"#f8532a", "font-weight":"600"});
				$("#mp_step2_oper_save").removeAttr("disabled");
			}else {}
		});
	});

	// 第二步:保存按钮
	$("#mp_step2_oper_save").click(function() {
		// 首先判断登录状态
		loginStatus();
		var mpCinemaId = getCookie("cinemaId");
		var mpPlanId = $("#mp_planId").val();
		var mpFilmId = $("#main_pri_film_name").attr("data");
		var mpFilmName = $("#main_pri_film_name").val();
		var mpFilmCode = $("#mp_film_code").val();
		var mpFilmTime = $("#main_pri_film_time").val();
		var mpFilmDur = $("#main_pri_dur_time").val();
		var mpFilmCount = $("#main_pri_film_count").val();
		var mpTempStatus = template_status;
		var langId = 1, flag = null, mpIsMain = 1;

		server.addRowPieceRate(mpPlanId, mpFilmId, mpFilmName, mpFilmTime, mpFilmCount, mpFilmCode, langId, flag, mpIsMain, function(callback){
			if (callback.ret) {
				tipMsg_Single('gzt_show', 0, "保存成功", 0, '', '');
				// 请求保存接口, 成功后, 添加disabled属性, 更新保存按钮状态值
				$("#mp_step2_oper_save").attr("disabled", "disabled");
				$("#mp_step2_oper_save").attr("data", "1");
				usedFilmArr[usedFilmArr.length] = mpFilmId; // 保存已选影片
			}
		});
	});

	// 第三步:上一步按钮
	$("#mainPriBtn3Pre").click(function() {
		// 首先判断登录状态
		loginStatus();
		
		// 满足此条件, 说明已试算完并保存完毕
		if(parseInt($("#mp_step2_oper_save").attr("data")) == 0 && $("#main_pri_dur_time").val() != "请点击试算按钮") {
			// 将保存按钮置为可点击状态
			$("#mp_step2_oper_save").attr("data", "1");
		}
		$(".mp-step-3").slideDown().hide();
		$(".mp-step-2").slideDown().show();
	});

	// 第三步:保存按钮
	$("#mp_step3_oper_save").click(function() {
		// 首先判断登录状态
		loginStatus();
		var mpCinemaId = getCookie("cinemaId");
		var mpPlanId = $("#mp_planId").val();
		var mpFilmId = $("#main_pri_film_name3").attr("data");
		var mpFilmName = $("#main_pri_film_name3").val();
		var mpFilmCode = $("#mp_film_code3").val();
		var mpFilmTime = $("#main_pri_film_time3").val();
		var mpFilmDur = 0;
		var mpFilmCount = $("#main_pri_film_count3").val();
		var mpTempStatus = template_status;
		var langId = 1, flag = null, mpIsMain = null;

		if(mpFilmId*1 == 0) {
			tipMsg_Single('gzt_show', 0, "请选择影片", 0, '', '');
			return;
		}else if(mpFilmCode == "") {
			tipMsg_Single('gzt_show', 0, "该影片数据不全(无影片编码), 不能作为非主打片", 0, '', '');
			return;
		}

		if(mpFilmTime == "") {
			tipMsg_Single('gzt_show', 0, "请填写 影片时长", 0, '', '');
			return;
		}else if(mpFilmTime*1 == 0) {
			tipMsg_Single('gzt_show', 0, "影片时长无效", 0, '', '');
			$("#main_pri_film_time3").focus();
			return;
		}

		if(mpFilmCount == "") {
			tipMsg_Single('gzt_show', 0, "请填写 预排场次数", 0, '', '');
			$("#main_pri_film_count3").focus();
			return;
		}else {}

		server.addRowPieceRate(mpPlanId, mpFilmId, mpFilmName, mpFilmTime, mpFilmCount, mpFilmCode, langId, flag, mpIsMain, function(callback){
			if (callback.ret) {
				$("#mp_film_code3").val("");
				$("#main_pri_film_name3").css("color", "#999");
				$("#main_pri_film_name3").attr("data", "0");
				$("#main_pri_film_name3").val("选择非主打片");
				$("#main_pri_film_time3").val("");
				$("#main_pri_film_count3").val("");

				tipMsg_Single('gzt_show', 0, "保存成功", 0, '', '');
				usedFilmArr[usedFilmArr.length] = mpFilmId; // 保存已选影片
				loadMainPriRateList();
			}
		});
	});
	
	// 重新排片按钮
	$(".reSetBtn").click(function() {
		delRateList();
		$("#mpPlanTbl").find("#mpRateTr").nextAll("tr").empty();
		$(".mp-step-div").hide();
		$(".pri-film-initlist").empty();
		$(".mp-step-1").fadeIn();
	});
});


/**
* 获取planId
*
* @param tmplt 当前排期模板类型
**/
function getPlanId(tmplt) {
	server.getCinemaPlan(tmplt, function(callback) {
		if (callback.ret) {
			$("#mp_planId").val(callback.data[0].planId);
			var datas = callback.data;
			var planId = datas[0].planId;
			var planName = datas[0].planName;
			var planType = datas[0].planType;
			var planMark = 2;

			$("#cinemaPlanId").val(planId);
			$("#cinemaPlanName").val(planName);
			$("#cinemaPlanType").val(planType);
			$("#cinemaPlanMark").val(planMark);
		}
	});
}

/**
* 初始化时间
*
* @param cId 影院ID
* @param tmplt 当前排期模板类型
**/
function loadTimeParam(cId, tmplt) {
	server.cinemaTimeList(cId, tmplt, function(callback) {
		if(callback.ret) {
			if(callback.data.beginTime != null){	// 开始时间
				$("#main_pri_start_time").val(callback.data.beginTime);
			}else{
				$("#main_pri_start_time").val('');
			}

			if(callback.data.endTime != null){	// 结束时间
				$("#main_pri_end_time").val(callback.data.endTime);
			}else{
				$("#main_pri_end_time").val('');
			}

			if(callback.data.cf_end_time != null){	// 儿童片最晚时间
				$("#main_pri_cartn_ent_time").val(callback.data.cf_end_time);
			}else{
				$("#main_pri_cartn_ent_time").val('');
			}

			if(callback.data.dm_begin_time != null){	// 恐怖片最早时间
				$("#main_pri_horror_start_time").val(callback.data.dm_begin_time);
			}else{
				$("#main_pri_horror_start_time").val('');
			}

			// 其他几项参数
			if(callback.data.goldTime!=null){	// 黄金段开始时间
				$("#mp_hid_goldTime").val(callback.data.goldTime);
			}else{
				$("#mp_hid_goldTime").val('');
			}
			if(callback.data.mainDur!=null){	// 主打片场间间隔
				$("#mp_hid_mainDur").val(callback.data.mainDur);
			}else{
				$("#mp_hid_mainDur").val('');
			}
			if(callback.data.difDur!=null){		// 不同影片场间间隔
				$("#mp_hid_difDur").val(callback.data.difDur);
			}else{
				$("#mp_hid_difDur").val('');
			}

			if($("#main_pri_start_time").val() != "" && $("#main_pri_end_time").val() != "" && 
				$("#main_pri_cartn_ent_time").val() != "" && $("#main_pri_horror_start_time").val() != "") {
				$("#mp_step1_oper_save").attr("data", "1");
			}
		}
	});
}

/**
* 保存时间参数
*
* @param cId 影院ID
* @param tmplt 当前排期模板类型
**/
function saveTimeParam(cId, tmplt) {
	var beginTime = $("#main_pri_start_time").val();	// 开始时间
	var endTime = $("#main_pri_end_time").val();	// 结束时间
	var goldTime = $("#mp_hid_goldTime").val();
	var difDur = $("#mp_hid_difDur").val();
	var sdur = $("#mp_hid_sdur").val();
	var mainDur = $("#mp_hid_mainDur").val();
	var cf_end_time = $("#main_pri_cartn_ent_time").val();
	var dm_begin_time = $("#main_pri_horror_start_time").val();

	server.saveCinemaTime(cId, tmplt, beginTime, endTime, goldTime, difDur, sdur, mainDur, cf_end_time, dm_begin_time, function(callback) {
		if(callback.ret) {
			tipMsg_Single('gzt_show', 0, "保存成功", 0, '', '');
			// 请求保存接口, 成功后, 添加disabled属性, 更新保存按钮状态值
			$("#mp_step1_oper_save").attr("disabled", "disabled");
			$("#mp_step1_oper_save").attr("data", "1");
		}
	});
}

/**
* 加载主打片/非主打片列表
*
* @param flag Boolean参数
**/
function loadMainPriRateList(flag) {
	var filmMainArr = ["否", "是"];
	var planId = $("#mp_planId").val();
	var sonTrObj = $("#mpPlanTbl").find("#mpRateTr");
	server.rowPieceRateList(planId, function(callback) {
		if(callback.ret) {
			sonTrObj.nextAll("tr").empty();
			var datas = callback.data;
			dataLen = datas.length;
			
			if(dataLen > 0) {
				var list_html = "", filmDur = "", bgClr = "", allCount = 0, allMainCount = 0, flagData = "", flagShow = "";
				for ( var i = 0; i < dataLen; i++) {
					var langId = nullHandler(datas[i].langId);
					var filmName = nullHandler(datas[i].filmName);
					var filmTime = nullHandler(datas[i].length);
					filmTime = filmTime == null || filmTime == "" ? 0 : filmTime;
					var filmcount = nullHandler(datas[i].percentage);
					var filmLang = langId == "" ? "" : film_lang_arrs[langId];
					langId = langId == "" ? "0" : langId;
					var filmCode = nullHandler(datas[i].filmCode);
					var filmMain = datas[i].isMain;
					if(filmMain == 1) {
						// allMainCount += filmcount;
						$(".mpMainCount").val(filmcount);
						filmDur = $("#main_pri_dur_time").val();
						bgClr = " style='background-color:#FECA38;'";
					}else {
						filmDur = "无";
						bgClr = "";
					}
					var filmFlag = datas[i].flag;
					if(filmFlag != undefined) {
						if(filmFlag == 1) {
							flagData = 1;
							flagShow = "恐怖片";
						}
						if(filmFlag == 0) {
							flagData = 0;
							flagShow = "儿童片";
						}
					}else {
						flagData = "";
						flagShow = "";
					}

					var planId = datas[i].planId;
					var filmId = datas[i].filmId;
					var itemId = datas[i].itemId;
					var filmTpye = getFilmTypeByFilmCode(filmId, filmCode);
					allCount += filmcount;

					list_html += "<tr" + bgClr + ">" +
								"<td class='hideItemId'>"+ itemId + "</td>" +
								"<td class='hidePlanId'>"+ planId + "</td>" +
								"<td class='hideFilmId'>"+ filmId + "</td>" +
								"<td class='sel_filmname' data='" + filmCode + "'>"+filmName+"</td>" +
								"<td class='sel_filmtime'>" + filmTime + " 分钟</td>" +
								"<td class='sel_filmrate'></td>" +
								"<td class='sel_count'>" + filmcount + "</td>" +
								"<td class='sel_filmdur'>" + filmDur + "</td>" +
								"<td class='sel_filmtype'>" + filmTpye + "</td>" +
								"<td class='sel_filmmain' data='" + filmMain + "'>" + filmMainArr[filmMain] + "</td>" +
								"<td class='sel_spdeal' data='" + flagData + "'>" + flagShow + "</td>" +
								"<td class=''>" +
									"<a href='javascript:;' id='' title='保存' class='oper-a mp-oper-a-sv'></a>" +
									"<a href='javascript:;' id='' title='编辑' class='oper-a mp-oper-a-et' onclick='editSubPri(this);'></a>" +
									// "<a href='javascript:;' id='' title='删除' class='oper-a mp-oper-a-dt' onclick=''></a>" +
								"</td></tr>";
				}
				sonTrObj.after(list_html);
				$(".mpSeatSum").val(allCount);
				dealMainPriRate();
				$("#hrCtrlId").show();	// 显示分隔线
				$("#p0520_createSch").show();	// 显示生成排期

				var totalHtml = "<tr style='background-color: #eee;'>"
								+ "<td colspan='2'><b>总计</b></td>"
								+ "<td>" + $(".mpRateSum").val() + "</td>"
								+ "<td>" + $(".mpSeatSum").val() + "</td>"
								+ "<td colspan='5'>&nbsp;</td>";
				$("#mpPlanTbl").append(totalHtml);

				// 来自初始化加载列表
				if(flag) {
					$(".mp-step-1").hide();
					// 将列表副本复制到列表区(包括事件)
					$(".pri-film-initlist").empty().html($(".mp-data-list").clone(true));
				}
			}else {
				$("#hrCtrlId").hide();	// 隐藏分隔线
				$("#p0520_createSch").hide();	// 隐藏生成排期
			}
		}else {
			// 来自初始化加载
			if(flag) {
				// 此两步操作本该加在这里, 但因列表接口不规范, 故加在了main.js:defaultErrorHandler函数(status:1051)
				// $(".pri-film-initlist").hide();
				// $(".mp-step-1").show();
			}
		}
	});
}

/**
* 清空排片率列表
**/
function delRateList() {
	var planId = $("#mp_planId").val();
	server.resetRowPieceRateList(planId, function(callback) {
		if(callback.ret) {}
	});
}

/**
* 获取可用影厅总数
*
* @param cId 影院ID
**/
function getHallNum(cId) {
	var hallNums = 0;
	server.filmHallInfo(cId, function(callback) {
		if(callback.ret) {
			var datas = callback.data;
			var nums = datas.length;
			for(var i = 0; i < nums; i++) {
				// 可用厅
				if(datas[i].status == 2) {
					hallNums++;
				}
			}

			$(".mpHallSum").val(hallNums);
			$(".mpSetSeatSum").val(hallNums*7);
		}
	});
}

/**
* 计算排片率
**/
function dealMainPriRate() {
	var countObj = $("#mpPlanTbl").find("tr").find(".sel_count");
	var countObjL = countObj.length;
	var percentageObj = $("#mpPlanTbl").find("tr").find(".sel_filmrate");
	var mpListRate = $(".mpSeatSum").val();	// 列表场次总数
	var mpRateSum = 0;	// 排片率总和
	
	for(var i = 0; i < countObjL; i++) {
		var tempCount = $(countObj[i]).text();
		var percentage = (tempCount/mpListRate)*100;

		percentage = percentage.toFixed(2);
		/*if(countObjL == 1) {
			percentage = percentage.toFixed(2);
		}else {
			percentage = percentage.toFixed(4);
		}*/
		
		$(percentageObj[i]).text(percentage);

		mpRateSum += percentage*1;
	}

	$(".mpRateSum").val(mpRateSum.toFixed(2));
}

/**
* 各类时间提示按钮 显示
*
* @param obj 当前对象
**/
function showTimeTipBtn(obj) {
	$(obj).find("img").show();
}

/**
* 各类时间提示按钮 隐藏
*
* @param obj 当前对象
**/
function hideTimeTipBtn(obj) {
	$(obj).find("img").hide();
}

/**
* 显示信息框
*
* @param obj 当前对象
* @param e 事件句柄
* @param sn 需要设置提示信息的对象序号（横排）
**/
var tip_arr = [
"影片的开始时间。如：07:30",
"儿童片的结束时间。如：21:00",
"影片的结束时间。如:23:30",
"恐怖片的开始时间。如：19:30",
];
function showTimeTipDiv(obj, e, sn) {
	e = e || event;
	var xPos = e.clientX;
	var yPos = e.clientY;
	var scrollH = $(document).scrollTop();
	
	$(obj).show();
	$(".tip-msg-div").css({"left":xPos + 10 + "px", "top":yPos + scrollH + "px"});
	$("#tip_msg_div").text(tip_arr[sn]);
	$("#tip_msg_div").stop(true).fadeIn();
}

/**
* 隐藏信息框
**/
function hideTimeTipDiv() {
	$("#tip_msg_div").fadeOut();
}

/**
* 影片列表面板
*
**/
function filmListPannel() {
	server.getFilmListByTime(function(callback){
		if (callback.ret) {
			var str_start = "<div class='list-block btn-radius-all'><ul>";
			var str_end = "</ul></div>";
			var str_block = "";
			var str_temp = "";
			var str_last = "";
			var str = "", str3 = "";
			var empty_data_style = "";
			var datas = callback.data;
			var codeType = null;

			if(datas.length > 0){
				for ( var i = 0; i < datas.length; i++) {
					var filmId = datas[i].id;
					var filmName = datas[i].filmName;
					var filmTime = datas[i].filmRunningTime;

					if(datas[i].codeType != undefined) {
						codeType = datas[i].codeType;
					}else {
						codeType = null;
						code = "";
					}
					if(codeType != null) {	// 影片类型及编码
						var ctL = codeType.length;
						var code = "";	// code数据格式: 类型-编码-是否默认。在此定义, 防止数据累加

						for(var j = 0; j < ctL; j++) {
							code += codeType[j].type + "-" + codeType[j].code + "-" + codeType[j].defaultKey + ",";
						}
						code = code.substring(0, code.length - 1);
					}

					str += "<li class='list-block-li' value='" + filmId + "' data='" + filmTime + "' code='" + code + "'>"+filmName+"</li>";
					str3 += "<li class='list-block-li3' value='" + filmId + "' data='" + filmTime + "' code='" + code + "'>"+filmName+"</li>";
				}
			}else{
				empty_data_style = " style='display:block;'";
			}

			str += "<li id='no_data' class='no-film-data'" + empty_data_style + ">暂无记录</li>";
			str3 += "<li id='no_data3' class='no-film-data'" + empty_data_style + ">暂无记录</li>";
			// 开启"添加影片"功能
			// var search_block = "<p class='search_block'><span id='add_film_btn' class='add-film-btn'>添加影片</span><span class='sep-line'>|</span><span>尝试搜索:&nbsp;&nbsp;</span><input type='text' id='search_input' value='输入影片名字' /></p>";
			var search_block = "<p class='search_block'><span>尝试搜索:&nbsp;&nbsp;</span><input type='text' id='search_input' value='输入影片名字' /></p>";
			var clear_div = "<div style=\"clear: both; content:'';\"></div>";
			film_list_pannel = search_block + str_start + str + clear_div + str_end;
			film_list_pannel3 = search_block + str_start + str3 + clear_div + str_end;
			// $("div[id^='mp_film_list_']").empty().html(search_block + str_start + str + clear_div + str_end);
			$("#mp_film_list_add").empty().html(search_block + str_start + str + clear_div + str_end);
			$("#mp_film_list_add3").empty().html(search_block + str_start + str3 + clear_div + str_end);
		}
	});
}

/**
* 影片列表相关事件(第二步)
**/
function _handlerFunc() {
	/*** 影片列表相关事件 ***/
	// 显示影片列表 - 选择影片
	$("#main_pri_film_name").bind({
		click:function(e) {
			objX = e.clientX;
			
			if(controlShowHide % 2 == 0){
				$(".slt-film-list").css({"background-color": "#fff", "width": "478px"});
				$(".search_block").css({"border-top":"1px solid #f7f7f7"});
				$("#mp_film_list_add").slideUp().show(300);
			}else{
				$("#mp_film_list_add").slideDown().hide();
			}

			controlShowHide++;
		}
	});

	// 影片点击选中 - 添加
	$(".list-block-li").live("click", function() {
		if(nullHandler($(this).attr("data")) != "") {
			$("#main_pri_dur_time").focus();
		}
		
		// 非同一部影片(影片id不相同)
		if($("#main_pri_film_name").attr("data") != nullHandler($(this).attr("value"))) {
			$("#mp_step2_oper_save").attr("disabled", "disabled");
			$("#mp_step2_oper_save").attr("data", "0");	// 更新保存按钮状态为0(0:未保存, 1:已保存)
			if($("#main_pri_film_count").val() != "请点击试算按钮") {
				$("#main_pri_film_count").css("color", "#999");
				$("#main_pri_film_count").val("请点击试算按钮");
			}
		}

		$("#main_pri_film_name").css("color", "#333");
		$("#main_pri_film_name").attr("data", $(this).attr("value"));
		$("#main_pri_film_time").val(nullHandler($(this).attr("data")));
		$("#main_pri_film_name").val($(this).text());
		$("#mp_film_list_add").hide();
		$("#main_pri_film_time").css("background-color","#FFF");
		$("#main_pri_dur_time").css("background-color","#FFF");

		getFilmCode($(this).attr("code"), 2);
		controlShowHide = 0;
	});
	$(".list-block-li").live("mouseover", function() {
		$(this).addClass("bgc1");
	});
	$(".list-block-li").live("mouseout", function() {
		$(".list-block-li").removeClass("bgc1");
	});

	// 影片点击选中 - 编辑
	$(".list-block-li-edit").live("click", function() {
		$("#edit_film_name").css("color", "#333");
		$("#edit_film_id").val($(this).attr("value"));
		$("#film_time").val($(this).attr("data"));
		$("#edit_film_name").val($(this).text());
		$("#mp_film_list_edit").hide();
		// 设置影片类型列表
		var typecode = getFilmTypeListByFilmID($(this).attr("value"));
		var html_str = createTypeListHtmlForEditFilm(typecode);
		$(this).parent().parent().parent().parent("td").next().next().next("td").html(html_str);
		controlShowHide = 0;
	});
	$(".list-block-li-edit").live("mouseover", function() {
		$(this).addClass("bgc1");
	});
	$(".list-block-li-edit").live("mouseout", function() {
		$(".list-block-li-edit").removeClass("bgc1");
	});

	document.body.onclick = function(e) {
		var x = e.clientX;	// 点击位置在页面中的 X轴坐标

		if(x != objX && x != undefined && objX != undefined){
			$("div[id^='mp_film_list_']").hide();	// 隐藏对象
			$("#search_input").val("输入影片名字");

			controlShowHide = 0;			// 重置控制变量
		}
	}

	// 影片搜索框
	$("#search_input").live("click", function(e) {
		var liObj = $(".list-block-li");	// 列表对象
		if(liObj.length == 0){
			liObj = $(".list-block-li-edit"); //修改时的列表对象
		}
		
		$("div[id^='mp_film_list_']").show();
		$("#no_data").hide();
		liObj.show();
		$(this).val("");
		$(this).focus();
	});

	// 检索影片
	$("#search_input").live("keyup", function() {
		var liObj;
		if(flag_filmListPannel == "flag_add"){
			liObj = $(".list-block-li");	// 添加时的列表对象
		}
		if(flag_filmListPannel == "flag_edit"){
			liObj = $(".list-block-li-edit"); //修改时的列表对象
		}

		var cur_text = $(this).val().trim();
		if(cur_text != "" && cur_text.length > 0){
			var tag = true;
			for (var i = 0; i < liObj.length; i++) {
				var liFilmName = $(liObj[i]).text();
				if(liFilmName.indexOf(cur_text) == -1){
					$(liObj[i]).hide();
				}else{
					$("#no_data").hide();
					$(liObj[i]).show();
					tag = false;
				}
			}

			if(tag){
				$("#no_data").show();
			}
		}else{
			$("#no_data").hide();
			liObj.show();
		}
	});
	/*** 影片列表相关事件 ***/
}

/**
* 影片列表相关事件(第三步)
**/
function _handlerFunc3() {
	/*** 影片列表相关事件 ***/
	// 显示影片列表 - 选择影片
	$("#main_pri_film_name3").bind({
		click:function(e) {
			objX = e.clientX;
			
			if(controlShowHide3 % 2 == 0){
				$(".slt-film-list").css({"background-color": "#fff", "width": "478px"});
				$(".search_block").css({"border-top":"1px solid #f7f7f7"});
				$("#mp_film_list_add3").slideUp().show(300);
			}else{
				$("#mp_film_list_add3").slideDown().hide();
			}

			controlShowHide3++;
		}
	});

	// 影片点击选中 - 添加
	$(".list-block-li3").live("click", function() {
		// 检查影片是否可用
		var result = checkUsedFilm($(this).attr("value"));

		if(result) {
			tipMsg_Single('gzt_show', 0, "该影片已使用，请选择其他影片", 0, '', '');
		}else {
			if(nullHandler($(this).attr("data")) != "") {
				$("#main_pri_film_count3").focus();
			}
			
			// 非同一部影片(影片id不相同)
			if($("#main_pri_film_name3").attr("data") != nullHandler($(this).attr("value"))) {
				$("#mp_step3_oper_save").attr("data", "0");	// 更新保存按钮状态为0(0:未保存, 1:已保存)
			}

			$("#main_pri_film_name3").css("color", "#333");
			$("#main_pri_film_name3").attr("data", $(this).attr("value"));
			$("#main_pri_film_time3").val(nullHandler($(this).attr("data")));
			$("#main_pri_film_name3").val($(this).text());
			$("#mp_film_list_add3").hide();
			$("#main_pri_film_time3").css("background-color","#FFF");

			getFilmCode($(this).attr("code"), 3);
			controlShowHide3 = 0;
		}
	});
	$(".list-block-li3").live("mouseover", function() {
		$(this).addClass("bgc1");
	});
	$(".list-block-li3").live("mouseout", function() {
		$(".list-block-li3").removeClass("bgc1");
	});

	// 影片点击选中 - 编辑
	$(".list-block-li-edit").live("click", function() {
		$("#edit_film_name").css("color", "#333");
		$("#edit_film_id").val($(this).attr("value"));
		$("#film_time").val($(this).attr("data"));
		$("#edit_film_name").val($(this).text());
		$("#mp_film_list_edit").hide();
		// 设置影片类型列表
		var typecode = getFilmTypeListByFilmID($(this).attr("value"));
		var html_str = createTypeListHtmlForEditFilm(typecode);
		$(this).parent().parent().parent().parent("td").next().next().next("td").html(html_str);
		controlShowHide3 = 0;
	});
	$(".list-block-li-edit").live("mouseover", function() {
		$(this).addClass("bgc1");
	});
	$(".list-block-li-edit").live("mouseout", function() {
		$(".list-block-li-edit").removeClass("bgc1");
	});

	document.body.onclick = function(e) {
		var x = e.clientX;	// 点击位置在页面中的 X轴坐标

		if(x != objX && x != undefined && objX != undefined){
			$("div[id^='mp_film_list_']").hide();	// 隐藏对象
			$("#search_input").val("输入影片名字");

			controlShowHide3 = 0;			// 重置控制变量
		}
	}

	// 影片搜索框
	$("#search_input").live("click", function(e) {
		var liObj = $(".list-block-li3");	// 列表对象
		if(liObj.length == 0){
			liObj = $(".list-block-li-edit"); //修改时的列表对象
		}
		
		$("#mp_film_list_add3").show();
		$("#no_data3").hide();
		liObj.show();
		$(this).val("");
		$(this).focus();
	});

	// 检索影片
	$("#search_input").live("keyup", function() {
		var liObj;
		if(flag_filmListPannel == "flag_add"){
			liObj = $(".list-block-li3");	// 添加时的列表对象
		}
		if(flag_filmListPannel == "flag_edit"){
			liObj = $(".list-block-li-edit"); //修改时的列表对象
		}

		var cur_text = $(this).val().trim();
		if(cur_text != "" && cur_text.length > 0){
			var tag = true;
			for (var i = 0; i < liObj.length; i++) {
				var liFilmName = $(liObj[i]).text();
				if(liFilmName.indexOf(cur_text) == -1){
					$(liObj[i]).hide();
				}else{
					$("#no_data3").hide();
					$(liObj[i]).show();
					tag = false;
				}
			}

			if(tag){
				$("#no_data3").show();
			}
		}else{
			$("#no_data3").hide();
			liObj.show();
		}
	});
	/*** 影片列表相关事件 ***/
}

/**
* 重置并初始化相关事件
*
* @param step 当前第几步
**/
function reset_init(step) {
	$(".list-block-li").unbind("click");
	if(step == 2) {
		$("#mp_film_list_add").empty();
		$("#mp_film_list_add3").html(film_list_pannel);
		_handlerFunc3();
	}
	if(step == 3) {
		$("#mp_film_list_add3").empty();
		$("#mp_film_list_add").html(film_list_pannel);
		_handlerFunc();
	}
}

/**
* 校验场次数
**/
function validMpSeat(val) {
	// 主打片场次数
	var mpMainCount = $(".mpMainCount").val();
	// 列表总场次数
	var mpListCount = $(".mpSeatSum").val();
	// 可用厅数的总场次
	var hallCount = $(".mpSetSeatSum").val();

	if(val*1 > mpMainCount*1) {
		tipMsg_Single('gzt_show', 0, "不能大于主打片场次数", 0, '', '');
		$("#main_pri_film_count3").val("");
		$("#main_pri_film_count3").focus();
	}else {
		if(mpListCount*1 == hallCount*1) {
			tipMsg_Single('gzt_show', 0, "场次已排满，请尝试修改", 0, '', '');
			$("#mp_step3_oper_save").attr("disabled", "disabled");

			$("#mp_film_code3").val("");
			$("#main_pri_film_name3").css("color", "#999");
			$("#main_pri_film_name3").attr("data", "0");
			$("#main_pri_film_name3").val("选择非主打片");
			$("#main_pri_film_time3").val("");
			$("#main_pri_film_count3").val("");
		}else if((val*1 + mpListCount*1) > hallCount*1) {
			tipMsg_Single('gzt_show', 0, "可用场次数不足，建议【" + (hallCount-mpListCount) + "】", 0, '', '');
			$("#main_pri_film_count3").val("").focus();
		}
	}
}

// 空数据处理
function nullHandler(val) {
	if(val == null || val == "" || val == undefined || val == "undefined"){
		return "";
	} else {
		return val;
	}
}

/**
* 第一步:及时检查"保存"按钮状态
*
* @description 检查已设置时间的input控件个数。num为0时, 表示全部设完
**/
function _handleSaveStatus() {
	var iptSize = $(".name-date").length;
	var num = iptSize;
	var sltValue = $dp.cal.getDateStr();
	
	for(var i = 0; i < iptSize; i++) {
		if($(".name-date:eq(" + i + ")").val().trim() != "") {
			num--;
		}
	}

	if(num == 0) {
		$("#mp_step1_oper_save").removeAttr("disabled");
		$("#mp_step1_oper_save").attr("data", "0");
	}
}

/**
* 检查影片是否已使用
**/
function checkUsedFilm(filmId) {
	var flag = false;
	var usedFilmArrL = usedFilmArr.length;
	
	if(usedFilmArrL > 0) {
		for(var i = 0; i < usedFilmArrL; i++) {
			if(filmId == usedFilmArr[i]) {
				flag = true;
				break;
			}else {
				flag = false;
			}
		}
	}

	return flag;
}

/**
* 获取所选影片编码
*
* @param data 该影片的类型、编码集合。数据格式: 类型-编码-是否默认
* @param step 当前第几步
**/
function getFilmCode(data, step) {
	var code_arr = null, caL = 0;
	var temp_arr = null;

	if(data != "") {
		if(data.indexOf(",") != -1) {
			code_arr = data.split(",");
			caL = code_arr.length;
			for(var i = 0; i < caL; i++) {
				temp_arr = code_arr[i].split("-");
				if(temp_arr[2]*1 == 1) {
					if(step == 2) {
						$("#mp_film_code").val(temp_arr[1]);
					}
					if(step == 3) {
						$("#mp_film_code3").val(temp_arr[1]);
					}
				}
			}
		}else {
			// 只有一个类型
			temp_arr = data.split("-");
			
			if(step == 2) {
				$("#mp_film_code").val(temp_arr[1]);
			}
			if(step == 3) {
				$("#mp_film_code3").val(temp_arr[1]);
			}
		}
	}else {
		if(step == 2) {
			$("#mp_film_code").val("");
		}
		if(step == 3) {
			$("#mp_film_code3").val("");
		}
	}
}

/**
* 修改
*
* @param obj 当前对象
**/
function editSubPri(obj) {
	if (editFlag == true) {
		tipMsg_Single('gzt_show', 0, "请完成当前操作!", 0, '', '');
		return ;
	}else {
		var trObj = $(obj).parent("td").parent("tr");
		trObj.find(".mp-oper-a-sv").attr("id","saveMpPri");	// 为保存按钮设置ID
		trObj.find(".mp-oper-a-sv").attr("onclick","saveSubPri(this)");	// 为保存按钮添加click事件
		var tempFilmName = trObj.find(".sel_filmname").text();	// 当前影片名字
		var tempFilmId = trObj.find(".hideFilmId").text();	// 当前影片ID

		// 相关项的宽度
		var filmName_width = trObj.find(".sel_filmname").width() - 20;
		var filmTime_width = trObj.find(".sel_filmtime").width() - 10;
		var filmCount_width = trObj.find(".sel_count").width() - 10;
		var filmIsMain_width = trObj.find(".sel_filmmain").width() - 10;
		var filmSpDeal_width = trObj.find(".sel_spdeal").width() - 10;

		// 影片名
		// var filmNameHtml = "<input type='hidden' id='edit_film_id' value='"+tempFilmId+"' />"
		// 		+"<input type='text' id='edit_film_name' value='"+tempFilmName+"' readonly='readonly' class='' onclick='showFilmList_edit(event);' />";
		// trObj.find(".sel_filmname").html(filmNameHtml);
		// trObj.find("#edit_film_name").css({"width":filmName_width+"px"});

		// 当前影片时长
		var filmTime = trObj.find(".sel_filmtime").text();
		var tilmTime_arr = filmTime.split(" ");	// 将数字分割出来
		var filmTime_html = "<input id='mp_film_time' class='' type='text' value='" + tilmTime_arr[0] + "' onkeyup='checkNum(this.id, this.value, this);' />";
		trObj.find(".sel_filmtime").html(filmTime_html);
		trObj.find("#mp_film_time").css({"width":filmTime_width+"px", "border":"1px solid #999"});

		// 场次数
		var filmCount = trObj.find(".sel_count").text();	// 当前场次数
		countBeforeEdit = filmCount;	// 保留修改前的值，用于比较
		trObj.find(".sel_count").empty().html("<input type='text' id='mp_film_count' class='row_percentage' value='"+filmCount+"' onkeyup='checkNum(this.id, this.value, this);' />");	// 百分比的修改的html
		trObj.find("#mp_film_count").css({"width":filmCount_width+"px", "border":"1px solid #999"});

		// 是否主打
		var filmIsMain = trObj.find(".sel_filmmain").attr("data");
		var sltFlag0 = "", sltFlag1 = "", isMainListHtml = "";
		if(filmIsMain*1 == 1) {
			sltFlag1 = " selected='selected'";
		}
		if(filmIsMain*1 == 0) {
			sltFlag0 = " selected='selected'";
		}
		isMainListHtml = "<select id='mp_ismain_slt'><option value='0'" + sltFlag0 + ">否</option><option value='1'" + sltFlag1 + ">是</option></select>";
		trObj.find(".sel_filmmain").empty().html(isMainListHtml);
		trObj.find("#mp_ismain_slt").css("width", filmIsMain_width + "px");

		// 特殊处理
		var filmSpDeal = trObj.find(".sel_spdeal").attr("data");
		var sltFilmSpDeal = "", sltFilmSpDeal0 = "", sltFilmSpDeal1 = "";
		if(filmSpDeal == "") {
			sltFilmSpDeal = " selected='selected'";
		}
		if(filmSpDeal*1 == 1 && filmSpDeal != "") {
			sltFilmSpDeal1 = " selected='selected'";
		}
		if(filmSpDeal*1 == 0 && filmSpDeal != "") {
			sltFilmSpDeal0 = " selected='selected'";
		}
		var filmSpDealListHtml = "<select id='mp_spdeal_slt'><option value=''" + sltFilmSpDeal + "></option>"
								+ "<option value='0'" + sltFilmSpDeal0 + ">儿童片</option>"
								+ "<option value='1'" + sltFilmSpDeal1 + ">恐怖片</option></select>";;
		trObj.find(".sel_spdeal").empty().html(filmSpDealListHtml);
		trObj.find("#mp_spdeal_slt").css("width", filmSpDeal_width + "px");

		editFlag = true;
	}
}

/**
* 保存
*
* @param obj 当前对象
**/
function saveSubPri(obj) {
	if(editFlag == true) {
		var obj = $(obj).parent("td").parent("tr");
		var mpSetSeatSum = $(".mpSetSeatSum").val();	// 可用总场次数
		var mpSeatSum = $(".mpSeatSum").val();	// 列表总场次数
		
		var itemId = obj.find(".hideItemId").text();
		var planId = obj.find(".hidePlanId").text();
		var filmId = obj.find(".hideFilmId").text();
		var filmName = obj.find(".sel_filmname").text();
		var filmTime = obj.find("#mp_film_time").val();
		var filmCount = obj.find("#mp_film_count").val();
		var filmCode = obj.find(".sel_filmname").attr("data");
		var langId = 1;
		var filmIsMain = obj.find("#mp_ismain_slt").find("option:selected").val();
		var filmFlag = obj.find("#mp_spdeal_slt").find("option:selected").val();	// 特殊处理标记
		filmFlag = filmFlag == "" ? null : filmFlag;

		if(mpSeatSum*1 == mpSetSeatSum*1) {
			// 场次已排满
			if(filmCount*1 > countBeforeEdit*1) {	// 输入的值大于原来的值
				tipMsg_Single('gzt_show', 0, "已超出总场次数", 0, '', '');
				$("#mp_film_count").focus();
			}else {
				server.updateRowPieceRate(itemId, planId, filmId, filmName, filmTime, filmCount, filmCode, langId, filmFlag, filmIsMain, function(callback){
					if (callback.ret) {
						loadMainPriRateList();
						tipMsg_Single('gzt_show', 0, "修改成功", 0, '', '');
						editFlag = false;
						if(filmIsMain*1 == 1) {
							$(".mpMainCount").val(filmCount);
						}else {
							$(".mpMainCount").val(0);
						}
					}
				});
			}
		}else {
			// 场次未排满
			var countChanged = 0;	// 场次数改变前后的差值
			if(filmCount*1 > countBeforeEdit*1) {	// 改变的值比原值大
				countChanged = filmCount*1 - countBeforeEdit*1;
			}else {
				countChanged = 0;
			}

			if((mpSeatSum*1 + countChanged) > mpSetSeatSum*1) {
				var tempVal = (mpSeatSum*1 + countChanged) - mpSetSeatSum*1;
				var guessVal = filmCount*1 - tempVal;
				tipMsg_Single('gzt_show', 0, "已超出总场次数，建议【" + guessVal + "】", 0, '', '');
				$("#mp_film_count").focus();
			}else {
				server.updateRowPieceRate(itemId, planId, filmId, filmName, filmTime, filmCount, filmCode, langId, filmFlag, filmIsMain, function(callback){
					if (callback.ret) {
						loadMainPriRateList();
						tipMsg_Single('gzt_show', 0, "修改成功", 0, '', '');
						editFlag = false;
						if(filmIsMain*1 == 1) {
							$(".mpMainCount").val(filmCount);
						}else {
							$(".mpMainCount").val(0);
						}
					}
				});
			}
		}
	}
}