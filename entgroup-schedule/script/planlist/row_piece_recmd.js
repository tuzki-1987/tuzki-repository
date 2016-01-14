var controlShowHide = 0, searchBlock = true;	// 循环显示、隐藏的控制变量
var objX;				// 用于隐藏当前对象的 "坐标比较变量"
var flag_filmListPannel = "";	// 为影片列表面板 区分"添加"、"编辑"的标签

$(function(){
	initPlanTemplateRecmd(0);

	// 设置自动获取
	var autoRecmd = getCookie("autoRecmd");
	autoRecmdSet(".auto-load-set", autoRecmd);
});

var planArrays = [];
var upPlanFlag = false;
var showPlanId = "";
var autoGetNum = 0;	// 重新获取次数控制
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
		/*** 影片列表相关事件 ***/
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
			var liObj = $(".list-block-li-edit"); //修改时的列表对象
			
			$("div[id^='rowFilmName_']").show();
			$("#no_data").hide();
			liObj.show();
			$(this).val("");
			$(this).focus();
		});

		// 检索影片
		$("#search_input").live("keyup", function() {
			var liObj;
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
	},
	_rowPieceSonList:function(planTemplate, planIdParam){
		this._getRowPieces(planTemplate, planIdParam);
	},
	_getRowPieces:function(planTemplate, planIdParam){
		var loadHtml = "<tr class='show-list-tbl-data show-list-tbl-data-odd'>"
                			+ "<td align='center' colspan='7'><img src='../images/o_31.gif' /></td>"
            			+ "</tr>";
		// 获取排片率列表
		var sonTrObj = $("#planSonTable_recmd").find("#rateSonTr");
		sonTrObj.after(loadHtml);

		if (planIdParam != "") {
			server.rowPieceRateList(planIdParam, function(callback){
				if (callback.ret) {
					sonTrObj.nextAll("tr").remove();

					if(callback.data != undefined) {
						var datas = callback.data;
						dataLen = datas.length;
						var total = 0;

						if(dataLen > 0){
							var list_html = "", trClassName = "";
							for ( var i = 0; i < dataLen; i++) {
								if(i % 2 == 0) {
									trClassName = " show-list-tbl-data-odd";
								}else {
									trClassName = " show-list-tbl-data-even";
								}

								var langId = rowPieceMg._nullHandler(datas[i].langId);
								var filmName = rowPieceMg._nullHandler(datas[i].filmName);
								var filmTime = rowPieceMg._nullHandler(datas[i].length);
								filmTime = filmTime == null || filmTime == "" ? 90 : filmTime;	// 如果时长为空，赋予默认值:90
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

							var table =  $("#planSonTable_recmd");
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
							$(".create-sch-box").show();	// 显示生成排期
						}
					}else {	// 用户自操作排片率为空
						$(".total-span").text("0");	// 影片统计
						if(planTemplate*1 == 0){	// 只限 “推荐排片”
							if(planTemplate*1 == 0 && $("#rememberDeleteOper").val() != 1 && getCookie("autoRecmd") == 1) {	// 非删除操作，列表为空，且已设置"自动获取"
								if(autoGetNum < 5) {
									tipMsg_Single("planlist_model", 0, "未获取到数据，5秒后将自动重新获取", 0, '', '');

									setTimeout(function() {
										server.rowPieceRateListForRecommandPlanNoSelfData(planIdParam, function(callback){
											if(callback.ret){
												rowPcSon._getRowPieces($("#cinemaPlanMark").val(), $("#cinemaPlanId").val());
												autoGetNum++;
											}
										});
									}, 5000);
								}else {
									// 自动获取5次后停止获取
									tipMsg_Single("planlist_model", 0, "暂时获取不到数据，请稍后重试", 0, '', '');
									autoGetNum = 0;
								}
							}else{	// 删除操作导致数据为空
								setTimeout(function() {
									tipMsg_Single("planlist_model", 0, "排片率为空，请尝试重新获取", 0, '', '');
								}, 1000);

								var noTrClassName = " show-list-tbl-data-odd";
								var deleteAfterReget = "<tr class='show-list-tbl-data" + noTrClassName + "'><td colspan='7' align='center'><B>暂无数据</B></td></tr>"
								$("#rateSonTr").after(deleteAfterReget);
							}
						}
						
						$(".create-sch-box").hide();	// 隐藏生成排期
					}
				}
			});
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
	}
};


/**
* 初始化排片模板
*
* @param planMark 模板标识(0: 推荐排片, 1: 自定义排片)
**/
function initPlanTemplateRecmd(planMark) {
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

	// 推荐排片
	loadRowPieceList(tabIndex-1, tabPlanId);
	setPlanType($("#cinemaPlanType").val());
	initAutoRecmd();
	// setTimeout("loadRowPieceList(" + (tabIndex-1) + ", " + tabPlanId + ")", 1000);	// 延迟初始化排片率列表，以便绑定相关行为事件
	// setTimeout("setPlanType("+ $("#cinemaPlanType").val() + ")", 1000);
	// setTimeout("initAutoRecmd()", 1000);
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

		var autoRecmd = getCookie("autoRecmd");
		if(autoRecmd == 1){	// 自动获取
			reloadRecommandPlanList();
		}else{	// 不自动获取
			rowPcSon._rowPieceSonList(planType, tabPlanId);
		}
	}else{
		tipMsg_Single('planlist_model', 0, "暂无排片率（ID）", 0, '', '');
	}
	rowPcSon._initialiseHdl();	// 初始化相关行为事件
}

/**
* 推荐排片 - 重新获取
* @description 只用于"重新获取" 按钮
**/
function reloadRecommandPlanList() {
	var planId = $("#cinemaPlanId").val();
	server.rowPieceRateListForRecommandPlanNoSelfData(planId, function(callback){
		if(callback.ret){
			rowPcSon._getRowPieces($("#cinemaPlanMark").val(), planId);
		}
	});
	/*server.resetRowPieceRateList(planId, function(callback){
		if(callback.ret){
			server.rowPieceRateListForRecommandPlanNoSelfData(planId, function(callback){
				if(callback.ret){
					rowPcSon._getRowPieces($("#cinemaPlanMark").val(), planId);
				}
			});
		}
	});*/
}

/**
* 初始化自动重新获取
**/
function initAutoRecmd() {
	if(getCookie("autoRecmd") == 1){
		$("#getAgainBtn").attr("disabled", "disabled");
		$(".a02").addClass("a02-bg");
		$("#checkboxFourInput").attr("checked", true);
		$(".checkboxFour").find("label").css("background", "#26ca28");
	}else{
		$("#getAgainBtn").removeAttr("disabled");
		$(".a02").removeClass("a02-bg");
		$("#checkboxFourInput").attr("checked", false);
		$(".checkboxFour").find("label").css("background", "#999");
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
* 自动获取设置
*
* @param obj 当前点击对象
* @param cookieValue 当前cookie中的值(自动获取参数, 0:非自动获取, 1:自动获取)
**/
function autoRecmdSet(obj, cookieValue) {
	if(cookieValue == 0) {
		$(obj).find("img").attr("src", "images/chk1.png");
		$(obj).find("img").attr("data", "0");
	}

	if(cookieValue == 1) {
		$(obj).find("img").attr("src", "images/chk2.png");
		$(obj).find("img").attr("data", "1");
	}
}