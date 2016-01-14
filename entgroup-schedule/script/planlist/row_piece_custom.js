var sysAdminCount = "";
var controlShowHide = 0, searchBlock = true;	// 循环显示、隐藏的控制变量
var objX;				// 用于隐藏当前对象的 "坐标比较变量"
var flag_filmListPannel = "";	// 为影片列表面板 区分"添加"、"编辑"的标签

$(function(){
	initPlanTemplateCustom(1);

	var langKind = $("#plan_film_lang").val();
	// 初始化语言选择框提示信息
	if(langKind != "请选择所属语种"){
		$("#plan_film_lang").val("请选择所属语种");
		$("#plan_film_lang").attr("data", "-1");
	}

	// 语言点击事件
	$(".lang-kind-list a").click(function() {
		$("#plan_film_lang").val($(this).text());
		$("#plan_film_lang").attr("data", $(this).attr("value"));
	});
});

var planArrays = [];
var upPlanFlag = false;
var showPlanId = "";
var rowPieceMg = {
	_clearInput:function() {
		$("#planNumberIp").val("");
		$("#planNameIp").val("");
		$("#planOwerIp").val("");
		$("#planRemarkIp").val("");
		$("#planTypeIp").val("请选择");
	},
	_nullHandler:function(data) {
		if (!data) {
			return "";
		} else {
			return data;
		}
	}
};


/* 排期率列表 */
var rowSonFlag = false;
var percentageBeforeEdit = 0;	// 修改前的百分比
var dataLen = 0;
var rowPcSon = {
	_initialiseHdl:function(){
		var blankDiv1 = $("#rowBlabkDiv");
		var blankDiv2 = $("#rowBlabkDivst");

		// 添加排片率
		$("#addPlanSonBtn").bind({
			click:function(){
				if (rowSonFlag == true) {
					tipMsg_Single('planlist_model', 0, "请完成当前操作!", 0, '', '');
					return ;
				} else {
					$("#add_film_pannel").hide();	// 隐藏添加影片面板

					flag_filmListPannel = "flag_add";
					server.getFilmListByTime(function(callback){
						if (callback.ret) {
							var str_start = "<div class='list-block btn-radius-all'><ul>";
							var str_end = "</ul></div>";
							var str_block = "";
							var str_temp = "";
							var str_last = "";
							var str = "";
							var empty_data_style = "";
							var datas = callback.data;
							var codeType = null;

							if(datas.length > 0){
								for (var i = 0; i < datas.length; i++) {
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

									str += "<li class='list-block-li' value='" + filmId + "' data='" + filmTime + "' code='" + code + "'><label>"+filmName+"</label><span></span></li>";
								}
							}else{
								empty_data_style = " style='display:block;'";
							}

							str += "<li id='no_data' class='no-film-data'" + empty_data_style + ">暂无记录</li>";
							// 开启"添加影片"功能
							var search_block = "<p class='search_block'><span id='add_film_btn' class='add-film-btn'>添加影片</span><span class='sep-line'>|</span><span>尝试搜索:&nbsp;&nbsp;</span><input type='text' id='search_input' value='输入影片名字' /></p>";
							// var search_block = "<p class='search_block'><span>尝试搜索:&nbsp;&nbsp;</span><input type='text' id='search_input' value='输入影片名字' /></p>";
							var clear_div = "<div style=\"clear: both; content:'';\"></div>";
							$("div[id^='rowFilmName_']").empty().html(search_block + str_start + str + clear_div + str_end);
							// setFilmPannelRate();

							/*	每 3个 一块
							if((datas.length) > 3){
								//$(".slt-film-list").css("height", "190px");
							}

							for ( var i = 0; i < datas.length; i++) {
								var filmId = datas[i].id;
								var filmName = datas[i].filmName;
								str_temp += "<li value='"+filmId+"'>"+filmName+"</li>";

								if((i+1) % 3 == 0){
									str_block += str_start + str_temp + str_end;
									str_temp = "";
								}
								if((i+1) >= (datas.length - 1)){
									str_last += "<li value='"+filmId+"'>"+filmName+"</li>";
								}
								if((i+1) == datas.length){
									str_last = str_start + str_last + str_end;
								}
								
							}
							$("#addRowFilmName").append(str_block + str_last);
							*/
						}
					});
					blankDiv1.height($(document).height());
					blankDiv1.show();
					blankDiv2.fadeIn(300);
					$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
				}
			}
		});

		/*** 影片列表相关事件 ***/
		// 显示影片列表 - 添加排片率
		$("#slt_film_name").bind({
			click:function(e) {
				e = e || event;
				objX = e.clientX;
				
				$("#add_film_pannel").hide();
				if(controlShowHide % 2 == 0){
					$(".slt-film-list").css({"background-color": "#fff", "left": "10px", "width": "93.5%"});
					$(".search_block").css({"border-top":"1px solid #f7f7f7"});
					$("#rowFilmName_add").show();
				}else{
					$("#rowFilmName_add").hide();
				}

				controlShowHide++;
			}
		});
		

		// 影片点击选中 - 添加
		$(".list-block-li").live("click", function() {
			$("#slt_film_name").css("color", "#333");
			$("#slt_film_name_id").val($(this).attr("value"));
			$("#slt_film_time").val($(this).attr("data"));
			$("#slt_film_name").val($(this).find("label").text());
			if($(this).find("span").text().trim() != "") {
				// 设置百分比
				$("#addRowPercent").val($(this).find("span").text());
			}
			$("#rowFilmName_add").hide();
			setTypeAndCode($(this).attr("code"));
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
			$("#rowFilmName_edit").hide();
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
			e = e || event;
			var x = e.clientX;	// 点击位置在页面中的 X轴坐标

			if(x != objX && x != undefined && objX != undefined){
				$("div[id^='rowFilmName_']").hide();	// 隐藏对象
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
			
			$("div[id^='rowFilmName_']").show();
			$("#no_data").hide();
			liObj.show();
			$(this).val("");
			$(this).focus();
		});

		// 添加影片 按钮
		$("#add_film_btn").live("click", function(e) {
			$("#rowFilmName_add").slideUp();
			$(".add-film-pannel").css({"background-color": "#fff", "left": "10px", "width": "93.5%"});
			$("#add_film_pannel").slideDown();

			// var liObj = $(".list-block-li");	// 列表对象
			// if(liObj.length == 0){
			// 	liObj = $(".list-block-li-edit"); //修改时的列表对象
			// }
			
			// $("div[id^='rowFilmName_']").show();
			// $("#no_data").hide();
			// liObj.show();
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
		
		// 关闭添加排片率弹出层
		$("#closeRowDivs").bind({
			click:function(){
				blankDiv1.hide();
				blankDiv2.fadeOut(300);
				$("#slt_film_name").val("点击选择影片");
				setTimeout(rowPcSon._clearInput, 400);
			}
		});

		// 取消添加排片率
		$("#cancelRowInfo").bind({
			click:function(){
				blankDiv1.hide();
				blankDiv2.fadeOut(300);
				setTimeout(rowPcSon._clearInput, 400);
			}
		});

		// 取消添加影片
		$("#add_film_cancel").click(function(e) {
			e = e || event;
			objX = e.clientX;	// 确保影片列表容器显示

			$("#add_film_pannel").slideUp();
			$("#rowFilmName_add").slideDown();
			// 清空数据项
			setTimeout(rowPcSon._clearAddFilmInput, 400);
		});

		// 确定添加影片
		$("#add_film_save").click(function(e) {
			e = e || event;
			objX = e.clientX;	// 确保影片列表容器显示

			var v_film_code = "", v_film_direct = "", v_film_area = "", v_film_type = "";
			var v_film_name = $("#movie_name").val(), v_film_time = $("#movie_time").val(), v_film_sd = $("#movie_showdate").val();
			var v_film_type_obj = $(".add-film-pannel").find("input[type='radio']"), v_film_type_sub = "", code = "";
			var v_film_serialNum = $("#movie_code").val(), v_film_ds = setDateStrByDate(v_film_sd, 30);
			var v_film_status = 2;	// 前台用户添加影片,状态为2:自定义(0:未审核, 1:已审核)
			// 获取所选影片类型
			for(var i = 0; i < v_film_type_obj.length; i++){
				if(v_film_type_obj[i].checked == true){
					// v_film_type_sub += v_film_type_obj[i].value + ",";	// 复选框
					// 单选按钮
					v_film_type_sub = v_film_type_obj[i].value;
					break;
				}
			}

			if(v_film_name.trim() == ""){
				tipMsg_Single('planlist_model', 0, "请填写 影片名称", 0, '', '');
				$("#movie_name").focus();
				return false;
			}else if(v_film_time.trim() == ""){
				tipMsg_Single('planlist_model', 0, "请填写 影片时长", 0, '', '');
				$("#movie_time").focus();
				return false;
			}else if(v_film_sd.trim() == ""){
				tipMsg_Single('planlist_model', 0, "请填写 上映日期", 0, '', '');
				return false;
			}else if(v_film_type_sub == "") {
				tipMsg_Single('planlist_model', 0, "请选择 影片类型", 0, '', '');
				return false;
			}else if(v_film_serialNum.trim() == ""){
				tipMsg_Single('planlist_model', 0, "请填写 影片编码", 0, '', '');
				$("#movie_code").focus();
				return false;
			}else{
				server.addFilmInfo(
					v_film_code,
					v_film_name,
					v_film_time,
					v_film_sd,
					v_film_ds,
					v_film_direct,
					v_film_area,
					v_film_type,
					v_film_status, 
					function(callback) {
						if(callback.ret) {
							tipMsg_Single('planlist_model', 0, "添加成功", 0, '', '');

							/*if(v_film_type.lastIndexOf(",") != -1){
								// 处理影片类型
								v_film_type = v_film_type.substring(0, v_film_type.length - 1);
							}*/
							code = v_film_type_sub + "-" + v_film_serialNum + "-" + "0";

							var add_film_html = "<li class='list-block-li' value='" + callback.filmId + "' data='" + v_film_time + "' code='" + code + "'>"+v_film_name+"</li>";
							var liObj = $(".list-block-li");
							if(liObj.length == 0){
								$(".slt-film-list").find("div ul").prepend(add_film_html);
							}else{
								$(".list-block-li:last").after(add_film_html);	// 将添加的影片追加到影片列表
							}

							$(".no-film-data").css("display", "none");
							$("#add_film_pannel").slideUp();
							$("#rowFilmName_add").slideDown();

							// 清空数据项
							setTimeout(rowPcSon._clearAddFilmInput, 400);

							// 添加影片类型
							server.addFilmType(callback.filmId, v_film_type_sub, v_film_serialNum, "0", function(callback) {});
						}
					}
				);
			}
		});
		
		// 添加保存
		$("#saveRowInfo").bind({
			click:function(){
				$("#saveRowInfo").attr("disabled", "disabled");	// 禁止（限制）重复点击
				showPlanId = showPlanId == "" || showPlanId == undefined ? $("#cinemaPlanId").val() : showPlanId;
				if (showPlanId != "" && showPlanId != undefined) {
					var planId = showPlanId;
					var filmId = $("#slt_film_name_id").val();	// 影片ID
					var filmName = $("#slt_film_name").val();	// 影片名字
					var filmTime = $("#slt_film_time").val();	// 影片时长
					var percentage = $("#addRowPercent");
					var totalPercentage = $("#totalPercentage").text();
					var langId = $("#plan_film_lang").attr("data");
					var flag = null, mpIsMain = null;
					// 影片类型
					var pft_radio = $("#plan_film_type").find("input[type='radio']"), pft_type = "";
					var pftrL = pft_radio.length;
					if(pftrL > 0) {
						// 有类型
						for(var i = 0; i < pftrL; i++){
							if(pft_radio[i].checked == true){
								pft_type = pft_radio[i].value;
								break;
							}
						}
					}else {
						// 没有类型
						pft_type = "0";
					}

					// 影片编码
					var film_code = $("#plan_film_code").val();

					/*else if(film_code.trim() == "") {
						tipMsg_Single('planlist_model', 0, "请选择或输入影片编码", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}*/
					if(filmName == "点击选择影片") {
						tipMsg_Single('planlist_model', 0, "请选择影片", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else if(percentage.val().trim() == ""){
						tipMsg_Single('planlist_model', 0, "请输入百分比值", 0, '', '');
						percentage.focus();
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else if(isNaN(percentage.val())){
						tipMsg_Single('planlist_model', 0, "请输入数字", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else if (percentage.val() >= 100 || percentage.val() <= 0) {
						tipMsg_Single('planlist_model', 0, "排片率请保证在1到100之间", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
						return ;
					}else if(((percentage.val())*1 + totalPercentage*1) > 100) {	// 包括浮点数
						tipMsg_Single('planlist_model', 0, "总排片率已超过100，请核对重填", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else if(pft_type == "") {
						tipMsg_Single('planlist_model', 0, "请选择影片类型", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else if(langId*1 == -1) {
						tipMsg_Single('planlist_model', 0, "请选择影片语种", 0, '', '');
						$("#saveRowInfo").removeAttr("disabled");	// 恢复点击
					}else {
						server.addRowPieceRate(planId, filmId, filmName, filmTime, percentage.val(), film_code, langId, flag, mpIsMain, function(callback){
							if (callback.ret) {
								tipMsg_Single('planlist_model', 0, "添加成功", 0, '', '');
								blankDiv2.fadeOut();
								blankDiv1.hide();
								setTimeout(rowPcSon._clearInput, 400);
								rowPcSon._getRowPieces($("#cinemaPlanMark").val(), showPlanId);
							}
						});
					}
				}else{
					
				}
			}
		});

	},
	_rowPieceSonList:function(planTemplate, planIdParam){
		this._getRowPieces(planTemplate, planIdParam);
	},
	_getRowPieces:function(planTemplate, planIdParam){
		// 获取排片率列表
		var sonTrObj = $("#planSonTable_custom").find("#rateSonTr");
		if (planIdParam != "") {
			server.rowPieceRateList(planIdParam, function(callback){
				if (callback.ret) {
					sonTrObj.nextAll("tr").remove();

					if(callback.data != undefined) {
						var datas = callback.data;
						dataLen = datas.length;
						var total = 0;
						if(dataLen > 0){
							var list_html = "";
							for ( var i = 0; i < dataLen; i++) {
								if(i % 2 == 0) {
									trClassName = " show-list-tbl-data-odd";
								}else {
									trClassName = " show-list-tbl-data-even";
								}

								var langId = rowPieceMg._nullHandler(datas[i].langId);
								var filmName = rowPieceMg._nullHandler(datas[i].filmName);
								var filmTime = rowPieceMg._nullHandler(datas[i].length);
								filmTime = filmTime == null || filmTime == "" ? 0 : filmTime;
								var percentage = rowPieceMg._nullHandler(datas[i].percentage);
								var filmLang = langId == "" ? "" : film_lang_arrs[langId];
								langId = langId == "" ? "0" : langId;
								var filmCode = rowPieceMg._nullHandler(datas[i].filmCode);
								// if((percentage.toString()).indexOf(".") != -1){
								// 	percentage = (percentage*100).toFixed(0);
								// }

								var planId = datas[i].planId;
								var filmId = datas[i].filmId;
								var itemId = datas[i].itemId;
								var filmTpye = getFilmTypeByFilmCode(filmId, filmCode);
								
								total += percentage*1;
								
								list_html += "<tr class='show-list-tbl-data" + trClassName + "'>" +
									"<td class='hideItemId'>"+itemId+"</td>" +
									"<td class='hidePlanId'>"+planId+"</td>" +
									"<td class='hideFilmId'>"+filmId+"</td>" +
									"<td class='sel_filmname th-idt'>"+filmName+"</td>" +
									"<td class='sel_filmtime'>"+filmTime+" 分钟</td>" +
									"<td class='sel_perce'>"+percentage+"</td>" +
									"<td class='sel_filmtype'>" + filmTpye + "</td>" +
									"<td class='sel_filmlang' data='" + langId + "'>" + filmLang + "</td>" +
									"<td>"+$("#cinemaPlanName").val()+"</td>" +
									"<td class=''>" +
										"<a href='javascript:;' id='' title='保存' class='oper-a oper-a-sv'>保存</a>" +
										"<a href='javascript:;' id='' title='编辑' class='oper-a oper-a-et oper-btn oper-edit-btn' onclick='editPlanSon(this);'>编辑</a>" +
										"<a href='javascript:;' id='' title='删除' class='oper-a oper-a-dt' onclick='delPlanSon(this);'>删除</a>" +
									"</td></tr>";
							}

							sonTrObj.after(list_html);

							var table =  $("#planSonTable_custom");
							// total = Math.ceil(total);
							total = total.toFixed(2);
							if(dataLen % 2 == 0) {
								trClassName = " show-list-tbl-data-odd";
							}else {
								trClassName = " show-list-tbl-data-even";
							}
							var last = "<tr class='show-list-tbl-data" + trClassName + "'>" +
									"<td class='hideItemId'></td>" +
									"<td class='hidePlanId'></td>" +
									"<td class='hideFilmId'></td>" +
									"<td class='sel_filmname th-idt'><B>统计</B></td>" +
									"<td></td>" +
									"<td class='sel_perce' id='totalPercentage'><B>"+total+"</B></td>" +
									"<td></td>" +
									"<td></td>" +
									"<td></td>" +
									"<td class='rowPads'> </td></tr>";

							table.append(last);
							
							$(".total-span").text(dataLen);	// 影片统计
						}
					}else {
						$(".total-span").text("0");	// 影片统计
						var noTrClassName = " show-list-tbl-data-odd";
						var nuCustomRateHtml = "<tr class='show-list-tbl-data" + noTrClassName + "'><td colspan='7' align='center'><B>暂无数据</B></td></tr>"
						sonTrObj.after(nuCustomRateHtml);
					}
				}else {
					
				}
			});
		}
	},
	_getPlanNameByid:function(planId){
		for ( var i = 0; i < planArrays.length; i++) {
			if (planId == planArrays[i].planId) {
				return planArrays[i].planName;
			}
		}
	},
	_deletePlanItem:function(itemId, planMark){
		server.deleteRowPieceRate(itemId, function(callback){
			if (callback.ret) {
				tipMsg_Single('planlist_model', 0, "删除成功", 0, '', '');
				$("#rememberDeleteOper").val(1);	// 记录删除操作
				rowPcSon._getRowPieces($("#cinemaPlanMark").val(), $("#cinemaPlanId").val());
			}
		});
	},
	_clearInput:function(){
		$("#slt_film_name").val("点击选择影片");
		$("#addRowPercent").val("");
		$("#plan_film_type").html("");
		$("#plan_film_code").val("");
		$("#plan_film_lang").val("请选择所属语种");
		$("#plan_film_lang").attr("data", "-1");
	},
	// 清空数据项 - 添加影片
	_clearAddFilmInput:function() {
		// $("#movie_id").val("例: film20150412");
		$("#movie_name").val("");
		$("#movie_time").val("");
		$("#movie_showdate").val("");
		$(".add-film-pannel").find("input[type='radio']").attr("checked", false);
		$("#movie_code").val("");
	}
};


/**
* 初始化排片模板
*
* @param planMark 模板标识(0: 推荐排片, 1: 自定义排片)
**/
function initPlanTemplateCustom(planMark) {
	// 初始为推荐排片
	planMark = planMark == "" || planMark == undefined ? 0 : planMark;
	
	server.getCinemaPlan(planMark, function(callback){
		if(callback.ret){
			var datas = callback.data;
			var planId = datas[0].planId;
			var planName = datas[0].planName;
			var planType = datas[0].planType;

			$("#cinemaPlanId").val(planId);
			$("#cinemaPlanName").val(planName);
			$("#cinemaPlanType").val(planType);
			$("#cinemaPlanMark").val(planMark);

			initLoadDataArea(planMark*1 + 1, planId);
		}else{
			tipMsg_Single('planlist_model', 0, "初始化失败", 0, '', '');
		}
	});
}

/**
* 加载对应选项卡数据区
*
* @param tabIndex 选项卡索引
* @param tabPlanId 排片模板的排片率ID
**/
function initLoadDataArea(tabIndex, tabPlanId) {
	loadTmrwNewFilmList();	// 初始为明日新片列表

	// 自定义排片
	// setTimeout("loadRowPieceList(" + (tabIndex-1) + ", " + tabPlanId + ")", 1000);	// 初始化排片率列表，以便绑定相关行为事件
	// setTimeout("setPlanType("+ $("#cinemaPlanType").val() + ")", 1000);
	// setTimeout("loadTomorrowFromWhere(0, 1, 3)", 1000);	// 初始数据
	// setTimeout("loadBoxOfficeForPlanList(0)", 1000);	// 初始为当日票房

	loadRowPieceList(tabIndex-1, tabPlanId);
	setPlanType($("#cinemaPlanType").val());
	loadTomorrowFromWhere(0, 1, 3);
	loadBoxOfficeForPlanList(0);
}

/**
* 加载对应排片模板的排片率列表
*
* @param planType 排片模板参数
* @param tabPlanId 排片模板的排片率ID
**/
function loadRowPieceList(planType, tabPlanId) {
	var planIdStr = tabPlanId;
	if (planIdStr != "") {
		showPlanId = planIdStr;

		rowPcSon._rowPieceSonList(planType, tabPlanId);
	}else{
		tipMsg_Single('planlist_model', 0, "暂无排片率（ID）", 0, '', '');
	}
	rowPcSon._initialiseHdl();	// 初始化相关行为事件
}

/**
* 添加影片 影片名称 校验
*
* @description 获取焦点、失去焦点
**/
function checkFilmNameFocus(obj) {
	if(obj.value == "" || obj.value == "例: film20150412"){
		obj.value = "";
	}else{
		obj.value=obj.value;
	}
}
function checkFilmNameBlur(obj) {
	if(obj.value == ""){
		obj.value = "例: film20150412";
	}else{
		obj.value=obj.value;
	}
}

// 准备修改排片率
function editPlanSon(obj){
	if (rowSonFlag == true) {
		tipMsg_Single('planlist_model', 0, "请完成当前操作!", 0, '', '');
		return ;
	} else {
		flag_filmListPannel = "flag_edit";
		
		var trObj = $(obj).parent("td").parent("tr");
		trObj.find(".oper-a-sv").attr("id","saveFilmSon");	// 为保存按钮设置ID
		trObj.find(".oper-a-sv").attr("onclick","saveFilmSonFunc(this)");	// 为保存按钮添加click事件
		server.getFilmListByTime(function(callback){
			if (callback.ret) {
				var eq1Val = trObj.find(".sel_filmname").text();	// 当前影片名字
				var eq1ValId = trObj.find(".hideFilmId").text();	// 当前影片ID

				// 相关项的宽度
				var filmName_width = trObj.find(".sel_filmname").width() - 46;
				var filmTime_width = trObj.find(".sel_filmtime").width() - 20;
				var filmPerce_width = trObj.find(".sel_perce").width() - 25;
				var filmType_width = trObj.find(".sel_filmtype").width() - 10;

				// 影片列表面板
				var datas = callback.data;
				var str_start = "<div id='rowFilmName_edit' class='slt-film-list'>", str_start_sub = "<div class='list-block'><ul>";
				var str_end = "</ul></div>";
				var str_block = "";
				var selectStr = "";
				var str = "";
				var empty_data_style = "";
				var equalFlag = false;
				for ( var i = 0; i < datas.length; i++) {
					var filmId = datas[i].id;
					var filmName = datas[i].filmName;
					if (eq1Val == filmName) {
						selectStr = "<input type='hidden' id='edit_film_id' value='"+filmId+"' />"
									+"<input type='text' id='edit_film_name' value='"+filmName+"' readonly='readonly' class='' onclick='showFilmList_edit(event);' />";
						equalFlag = true;
						break;
					}else{
						equalFlag = false;
					}
				}

				if(datas.length > 0){
					for ( var i = 0; i < datas.length; i++) {
						str += "<li class='list-block-li-edit' value='" + datas[i].id + "' data='" + datas[i].filmRunningTime + "'>"+datas[i].filmName+"</li>";
					}
				}else{
					empty_data_style = " style='display:block;'";
				}

				if(!equalFlag){
					selectStr = "<input type='hidden' id='edit_film_id' value='"+eq1ValId+"' />"
								+"<input type='text' id='edit_film_name' value='"+eq1Val+"' readonly='readonly' class='' onclick='showFilmList_edit(event);' />";
				}
				
				str += "<li id='no_data' class='no-film-data'" + empty_data_style + ">暂无记录</li>";
				var search_block = "<p class='search_block'><span class='sp-3'>尝试搜索:&nbsp;&nbsp;</span><input type='text' id='search_input' class='ipt-1' value='输入影片名字' /></p>";
				var clear_div = "<div style=\"clear: both; content:'';\"></div>";
				trObj.find(".sel_filmname").html(selectStr + str_start + search_block + str_start_sub + str + clear_div + str_end + "</div>");	// 影片名的修改的html
				trObj.find("#edit_film_name").css({"width":filmName_width+"px"});

				// 当前影片时长
				var filmTime = trObj.find(".sel_filmtime").text();
				var tilmTime_arr = filmTime.split(" ");	// 将数字分割出来
				var filmTime_html = "<input id='film_time' class='' type='text' value='" + tilmTime_arr[0] + "' onkeyup='checkNum(this.id, this.value, this);' />";
				trObj.find(".sel_filmtime").html(filmTime_html);
				trObj.find("#film_time").css({"width":filmTime_width+"px", "border":"1px solid #ccc"});
				
				var eq2Val = trObj.find(".sel_perce").text();	// 当前百分比值
				percentageBeforeEdit = eq2Val;	// 保留修改前的值，用于比较
				trObj.find(".sel_perce").empty().html("<input type='text' id='film_perce' class='row_percentage' value='"+eq2Val+"' onkeyup='checkNum(this.id, this.value, this);' />");	// 百分比的修改的html
				trObj.find("#film_perce").css({"width":filmPerce_width+"px", "border":"1px solid #ccc"});

				// 影片类型
				var filmType = trObj.find(".sel_filmtype").text();
				// 默认类型
				var hide_ipt = "<input type='hidden' id='temp_film_type' value='" + filmType + "' />";
				trObj.find(".sel_filmtype").html(hide_ipt);
				var typecode = getFilmTypeListByFilmID(eq1ValId);
				var html_str_type = createTypeListHtmlForEditFilm(typecode);
				trObj.find(".sel_filmtype").html(html_str_type);
				trObj.find(".sel_filmtype").find(".slt-tc").css({"width":filmType_width+"px"});

				// 影片语种
				var filmLang = trObj.find(".sel_filmlang").attr("data");
				var html_str_lang = createFilmLangList(filmLang, "");
				trObj.find(".sel_filmlang").html(html_str_lang);

				rowSonFlag = true;
			}
		});
	}
}

// 准备删除排片率
function delPlanSon(obj) {
	var itemIdStr = $(obj).parent("td").parent("tr").find(".hideItemId").text();
	
	var cfrmPro = confirm("您确定删除此条影院信息吗 ?");
	if (cfrmPro == true) {
		rowPcSon._deletePlanItem(itemIdStr, $("#cinemaPlanMark").val());
	}
}

/**
* 添加排片率，点击影片，设置影片类型和编码
*
* @param data 该影片的类型、编码集合。数据格式: 类型-编码-是否默认
**/
function setTypeAndCode(data) {
	var type_arrs = ["", "2D", "3D", "巨幕", "IMAX", "胶片(进口)", "其他特种电影", "其他", "动画片", "纪录片", "科教片"];
	var code_arr = null, caL = 0;
	var listHtml = "", temp_arr = null, chkedHtml = "";
	$("#plan_film_type").html("");

	if(data != "") {
		$("#plan_film_code").attr("readonly", "readonly");

		if(data.indexOf(",") != -1) {
			code_arr = data.split(",");
			caL = code_arr.length;
			for(var i = 0; i < caL; i++) {
				temp_arr = code_arr[i].split("-");
				if(temp_arr[2]*1 == 1) {
					chkedHtml = " checked='checked'";
					$("#plan_film_code").val(temp_arr[1]);
				}else {
					chkedHtml = "";
				}

				listHtml += "<span class='pft-sp1'>"
					+"<input type='radio' name='filmType' id='" + type_arrs[temp_arr[0]]+"_"+i + "' class='input-chk2' value='" + temp_arr[1] + "'" + chkedHtml + " onclick='changeFilmCodeShow(this.value);' />"
					+"<label for='" + type_arrs[temp_arr[0]]+"_"+i + "' class='label-2'>" + type_arrs[temp_arr[0]] + "</label></span>";
			}
		}else {
			// 只有一个类型
			temp_arr = data.split("-");
			chkedHtml = " checked='checked'";
			$("#plan_film_code").val(temp_arr[1]);

			listHtml = "<span class='pft-sp1'>"
					+"<input type='radio' name='filmType' id='" + type_arrs[temp_arr[0]]+"_"+i + "' class='input-chk2' value='" + temp_arr[0] + "'" + chkedHtml + " />"
					+"<label for='" + type_arrs[temp_arr[0]]+"_"+i + "' class='label-2'>" + type_arrs[temp_arr[0]] + "</label></span>";
		}

		$("#plan_film_type").html(listHtml);
	}else {
		// var emptyTypeHtml = "<span class='pft-sp1'><input type='radio' name='filmType' id='empty_2D' class='input-chk2' value='1' /><label for='empty_2D' class='label-2'>2D</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_3D' class='input-chk2' value='2' /><label for='empty_3D' class='label-2'>3D</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_jm' class='input-chk2' value='3' /><label for='empty_jm' class='label-2'>巨幕</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_IMAX' class='input-chk2' value='4' /><label for='empty_IMAX' class='label-2'>IMAX</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_jp' class='input-chk2' value='5' /><label for='empty_jp' class='label-2'>胶片(进口)</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_other_film' class='input-chk2' value='6' /><label for='empty_other_film' class='label-2'>其他特种电影</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_other' class='input-chk2' value='7' /><label for='empty_other' class='label-2'>其他</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_cartoon' class='input-chk2' value='8' /><label for='empty_cartoon' class='label-2'>动画片</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_documentary' class='input-chk2' value='9' /><label for='empty_documentary' class='label-2'>纪录片</label></span>"
		// 					+"<span class='pft-sp1'><input type='radio' name='filmType' id='empty_science' class='input-chk2' value='10' /><label for='empty_science' class='label-2'>科教片</label></span>";
		
		var emptyTypeHtml = "<span class='pft-sp2'>暂无对应类型</span>";
		// $("#plan_film_code").removeAttr("readonly");
		$("#plan_film_type").html(emptyTypeHtml);
		$("#plan_film_code").val("");
	}
}