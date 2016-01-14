var film_types_arrs = ["", "2D", "3D", "巨幕", "IMAX", "胶片(进口)", "其他特种电影", "其他", "动画片", "纪录片", "科教片"];
var film_lang_arrs = ["", "国语", "粤语", "英语", "日语", "韩语", "法语", "俄语", "德语", "意大利语", "西班牙语", "其他"];

$(function(){
	$("#rememberDeleteOper").val(0);	// 初始化删除限制

	$("#planSonTable_custom").find("#rateSonTr").nextAll("tr").empty();
});


// 显示影片列表 - 编辑排片率
function showFilmList_edit(e) {
	objX = e.clientX;
				
	if(controlShowHide % 2 == 0){
		$(".slt-film-list").css({"background-color":"#f9f9f9", "border-color":"#ccc", "margin":"0 0 0 5px", "width":"33.5%"});
		$(".slt-film-list").find("li").css("font-size", "13px");
		$(".search_block").css({"border-top":"1px solid #eee"});
		$("#rowFilmName_edit").show();
	}else{
		$("#rowFilmName_edit").hide();
	}

	controlShowHide++;
}

// 生成排期
function createSchFunc() {
	var planId = $("#cinemaPlanId").val();
	var paramDate = $("#scheByPlanDate").val();

	if (planId) {
		if (upPlanFlag == false) {
			if (planId) {
				server.createScheForUser(planId,paramDate, function(callback){
					if (callback.ret) {
						if (callback.data != "") {
							tipMsg_Single('planlist_model', 0, "排期生成成功", 0, '', '');
							setTimeout("goShowSchedule('" + paramDate + "')", 500);	// 500毫秒后转至 智能排片（按选择日期显示）
						} else {
							tipMsg_Single('planlist_model', 0, "此计划排片率为空，请添加排片率", 0, '', '');
							return ;
						}
					}
				});
				
			}
		} else {
			tipMsg_Single('planlist_model', 0, "请完成当前操作!", 0, '', '');
			return ;
		}
	}
}

// 修改保存排片率
function saveFilmSonFunc(thisObj) {
	if (rowSonFlag == true) {
		if (dataLen > 0) {
			var obj = $(thisObj).parent("td").parent("tr");
			
			var itemId = obj.find(".hideItemId").text();
			var planId = obj.find(".hidePlanId").text();
			var filmId = obj.find("#edit_film_id").val();
			var filmName = obj.find("#edit_film_name").val();
			var filmTime = obj.find("#film_time").val();
			var perceVal = obj.find(".row_percentage").val();
			var filmCode = obj.find(".slt-tc").find("option:selected").val();
			var totalPercentage = $("#totalPercentage").text();
			var langId = obj.find(".slt-lg").find("option:selected").val();
			var flag = null, isMain = null;

			var filmTime_arr = filmTime.split(" ");	// 分割取时长

			if(parseInt(totalPercentage) == 100){
				if(perceVal*1 > percentageBeforeEdit){	// 输入的值大于原来的值(包括浮点数)
					tipMsg_Single('planlist_model', 0, "总排片率已超过100，请核对重填", 0, '', '');
					$(".row_percentage").focus();
				}else{
					server.updateRowPieceRate(itemId, planId, filmId, filmName, filmTime_arr[0], perceVal, filmCode, langId, flag, isMain, function(callback){
						if (callback.ret) {
							rowPcSon._getRowPieces($("#cinemaPlanMark").val(), planId);
							tipMsg_Single('planlist_model', 0, "修改成功", 0, '', '');
							rowSonFlag = false;
						}
					});
				}
			}else{	// 小于100
				var perceValChanged = 0;	// 百分比改变前后的差值
				if(perceVal*1 > percentageBeforeEdit){	// 改变的值比原值大(包括浮点数)
					perceValChanged = perceVal*1 - percentageBeforeEdit;
				}else{
					perceValChanged = 0;
				}

				if((perceValChanged + totalPercentage*1) > 100){
					tipMsg_Single('planlist_model', 0, "总排片率已超过100，请核对重填", 0, '', '');
					$(".row_percentage").focus();
				}else{
					server.updateRowPieceRate(itemId, planId, filmId, filmName, filmTime_arr[0], perceVal, filmCode, langId, flag, isMain, function(callback){
						if (callback.ret) {
							rowPcSon._getRowPieces($("#cinemaPlanMark").val(), planId);
							tipMsg_Single('planlist_model', 0, "修改成功", 0, '', '');
							rowSonFlag = false;
						}
					});
				}
			}
		}
	}
}

/**
* 生成排期后，跳转到智能排片模块（按生成日期显示）
**/
function goShowSchedule(showDate) {
	setCookie("createSchDate", showDate, 5);
	window.location.href = "show_schedule.html";
}

/**
* 模板为空时，转到排期设置
**/
function goSetSchedule() {
	window.location.href = "show_schedule.html";
}

/**
* 类型选择事件(多类型时):动态显示影片编码
**/
function changeFilmCodeShow(thisValue) {
	$("#plan_film_code").val(thisValue);	// 动态显示影片编码
}

/**
* 语言选择框事件 — 显示、隐藏语言面板
**/
function showLanguagePannel(obj) {
	$(".lang-kind-list").slideDown();
}
function hideLanguagePannel(obj) {
	$(".lang-kind-list").slideUp();
}
