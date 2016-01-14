var sysAdminCount = "";
var controlShowHide = 0, searchBlock = true;	// 循环显示、隐藏的控制变量
var objX;				// 用于隐藏当前对象的 "坐标比较变量"
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

			if(filmName.trim() == "") {
				tipMsg_Single('planlist_model', 0, "影片名称不能为空", 0, '', '');
				return;
			}
			if(filmTime.trim() == "") {
				tipMsg_Single('planlist_model', 0, "请填写影片时长", 0, '', '');
				obj.find("#film_time").focus();
				return;
			}
			if(perceVal.trim() == "") {
				tipMsg_Single('planlist_model', 0, "请输入百分比", 0, '', '');
				obj.find(".row_percentage").focus();
				return;
			}

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
* 设置计划类型
**/
function setPlanType(planType) {
	var planTypeArr = ["场次比率", "场次数", "座次比率", "场次比率（推荐）"];
	$("#id_PlanType").attr("value", planType);
	$("#id_PlanType").text(planTypeArr[planType]);
}

/**
* 修改计划类型
**/
function editPlanType() {
	$("#id_PlanType").hide();
	$("#id_EditPlanType").hide();

	$("#id_PlanTypeList").show();
	$("#id_SavePlanType").show();

	var curPlanType = $("#id_PlanType").attr("value");
	var options = $("#id_PlanTypeList").find("select").find("option");
	for (var i = 0; i < options.length; i++) {
		if(curPlanType == $(options[i]).val()){
			$(options[i]).attr("selected", "selected");
			break;
		}
	}
}

/**
* 保存计划类型
**/
function savePlanType() {
	$("#id_PlanTypeList").hide();
	$("#id_SavePlanType").hide();

	$("#id_EditPlanType").show();

	var curPlanType = $("#id_PlanType").attr("value");
	var $selectOption = $("#id_PlanTypeList").find("select option:selected");
	var sltOptionValue = $selectOption.val();	// 选中项的value值
	var sltOptionText = $selectOption.text();	// 选中项的文本值

	var planMark = $("#cinemaPlanMark").val();
	var planType = $("#id_PlanTypeList").find("select option:selected").val();
	// 请求接口
	server.updatePlanType(planMark, planType, function(callback){
		if(callback.ret){
			// 若接口返回true，执行以下 4 句
			$("#id_PlanType").attr("value", sltOptionValue);
			$("#id_PlanType").text(sltOptionText);
			$("#id_PlanType").show();
			tipMsg_Single("planlist_model", 0, "修改成功", 0, '', '');
		}else{
			tipMsg_Single("planlist_model", 0, "修改失败", 0, '', '');
		}
	})
}

/**
* 生成排期后，跳转到智能排片模块（按生成日期显示）
**/
function goShowSchedule(showDate) {
	setCookie("createSchDate", showDate, 5);
	clickSubMenu($(".ul-nav").find(".li-nav:eq(3)").find(".sub-nav").find("a:eq(0)"), 3, 0);
	clickSubNav($(".ul-nav").find(".li-nav:eq(3)").find(".li-nav-a"));
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
