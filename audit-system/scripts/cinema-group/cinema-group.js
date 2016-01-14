/*
 * 影院管理
 *
 * @author ccq
 */


// 页面初始化
function initCinemaMng() {
	// 空参数表示默认全部影院
	loadCinemaListOfTheatres(0, "");

	// 分组列表
	getGroupLists(0);
}

/*************************************************** 分组功能操作 相关事件 ************************************************/
/**
* 分组列表
*
* @param tabIndex 选项卡索引(0:影院分组, 1:管理分组)
**/
function getGroupLists(tabIndex) {
	if(tabIndex == 0) {
		$(".cinema-group-list").find(".default-group").nextAll().remove();

		server.getGroupLists(function(callback) {
			if(callback.ret) {
				var datas = callback.data, datasL = 0;
				var listHtml = "";

				if(datas != "") {
					datasL = datas.length;

					for (var i = 0; i < datasL; i++) {
						listHtml += "<button type='button' class='btn btn-lg btn-default cinema-group-btn'"
								+ " onclick='loadCinemaListOfTheatres(" + (i+1) + ", " + datas[i].id + ");' data='" + datas[i].id + "'>"
								+ "<input type='hidden' value='" + datas[i].id + "' />"
								+ datas[i].name 
								+ "</button>";
					}

					$(".cinema-group-list").find(".default-group").after(listHtml);
				}else {}
			}
		});
	}
	
	if(tabIndex == 1) {
		// $(".manage-groups-cnt").find(".default-group").nextAll().remove();
		$(".manage-groups-cnt").html("");

		server.getGroupLists(function(callback) {
			if(callback.ret) {
				var datas = callback.data, datasL = 0;
				var listHtml = "";

				if(datas != "") {
					datasL = datas.length;

					for (var i = 0; i < datasL; i++) {
						listHtml += "<a href='javascript:;'>"
										+ "<input type='radio' name='radioGroup' value='" + datas[i].id + "' class='radio-ipt' id='chkbox_" + i + "' onchange='handleClickBox(this.id);' />"
										+ "<label for='chkbox_" + i + "'>" + datas[i].name + "</label>"
								+ "</a>";
					}
				}else {
					listHtml = "<p style='font-size: 16px; color: #f30; margin-bottom: 0; text-align: center;'>请添加分组</p>";
				}

				$(".manage-groups-cnt").html(listHtml);
			}
		});
	}
}

/**
* 默认分组下属影院列表
*
* @param groupIndex 分组的索引
* @param groupId 分组的ID
**/
function loadCinemaListOfTheatres(groupIndex, groupId) {
	$(".cinema-group-list").find("button").removeClass("active");
	$(".cinema-group-list").find("button:eq(" + groupIndex + ")").addClass("active");

	var cinemaHtml = "";

	// 默认分组
	if(groupIndex == 0) {
		server.queryAuditAccounts(function(callback) {
			if(callback != "" && callback != undefined) {
				var datasL = callback.length;
				// 顶部影院数量
				$("#childCinemaNumsJH").text(datasL);

				for (var i = 0; i < datasL; i++) {
					cinemaHtml += "<a href='javascript:;' data='" + callback[i].platformId + "' id='" + callback[i].cinemaId
							 + "' onclick='handleClickCinema2(this, event);'>" + callback[i].cinameName + "</a>";
				}

				$(".cinemas-cnt").html(cinemaHtml);
			}
		});
	}else {
		server.getCinemaListOfGroup(groupId, function(callback) {
			if(callback != "" && callback != undefined) {
				var datasL = callback.length;

				for (var i = 0; i < datasL; i++) {
					cinemaHtml += "<a href='javascript:;' data='" + callback[i].platformId + "' id='" + callback[i].cinemaId
							 + "' onclick='handleClickCinema2(this, event);'>" + callback[i].cinameName + "</a>";
				}
			}else {
				cinemaHtml = "<div class='clr10'>暂无影院</div>";
			}

			$(".cinemas-cnt").html(cinemaHtml);
		});
	}

	// 汇总统计(默认"默认分组")
	getCinemaTotalList(groupId, $("#queryDate").val(), 1, "");
}

/**
* 分组下属影院列表
*
* @param groupIndex 影院分组、分配影院的影院列表 区分参数
* @param groupId 分组的ID
**/
function getCinemaListsOfGroup(groupIndex, groupId) {
	$(".cinemalist-body").find("p").html("<center><img src='images/loading.gif' /></center>");
	var cinemaHtml = "";

	server.getCinemaListOfGroup(groupId, function(callback) {
		if(callback != "" && callback != undefined) {
			var datasL = callback.length;

			// 影院分组
			if(groupIndex == 0) {
				for (var i = 0; i < datasL; i++) {
					cinemaHtml += "<a href='javascript:;' data='" + callback[i].platformId + "' id='" + callback[i].cinemaId
							 + "' onclick='handleClickCinema2(this, event);'>" + callback[i].cinameName + "</a>";
				}
			}else {
				// 分配影院
				for (var i = 0; i < datasL; i++) {
					cinemaHtml += "<a href='javascript:;'>"
									+ "<input type='checkbox' data='" + callback[i].platformId + "' value='" + callback[i].cinemaId + "' class='chkbox-cinema' id='cinemabox_" + i + "' />"
									+ "<label for='cinemabox_" + i + "'>" + callback[i].cinameName + "</label>"
								+ "</a>";
				}
			}
		}else {
			cinemaHtml = "<div class='clr10'>暂无影院</div>";
		}

		$(".cinemalist-body").find("p").html(cinemaHtml);
	});
}

/**
* 汇总统计列表
*
* @param groupId 分组ID
* @param queryDate 查询日期
* @param current 起始页
* @param offset 每页数量
**/
function getCinemaTotalList(groupId, queryDate, current, offset) {
	var trHtml = "";
	$("#cinemaTatalTbl").find("thead").nextAll().remove();
	$("#cinemaTatalTbl").find("thead").after("<tr><td colspan='7' style='border-bottom-width: 0;'><center><img src='images/loading.gif' /></center></td></tr>");

	server.getCinemaTotalListOfGroup(groupId, queryDate, current, offset, function(callback) {
		if(callback.ret) {
			var datas = callback.data, datasL = datas.length,
			totalP = 0, sysTotalP = 0, scoreP = 0, boxofficeDifValue = 0, bfdvColor = "", bfdvImg = "",
			checkHtml = "", checkHtml2 = "", clickHtml = "", clickHtml2 = "";

			if(datas != "") {
				for (var i = 0; i < datasL; i++) {
					if(datas[i].totalPrice == undefined) {
						totalP = "<a href='javascript:;' title='" + datas[i].cinemaName + "' id='" + datas[i].cinemaId + "' onclick='handleClickUnUpload(this, event);'>未上传</a>";
						sysTotalP = "---";
						boxofficeDifValue = "---";
						bfdvColor = "";
						bfdvImg = "";
						scoreP = "---";
						checkHtml = "---";
						checkHtml2 = "---";
						clickHtml = "";
						clickHtml2 = "";
					}else {
						totalP = datas[i].totalPrice;
						sysTotalP = datas[i].sysTotalPrice;
						boxofficeDifValue = totalP*1 - sysTotalP*1;
						scoreP = datas[i].score;
						checkHtml = "<a href='javascript:;' onclick='checkReport(this, " + datas[i].cinemaId + ", \"" + datas[i].cinemaName + "\");'>查看</a>";
						checkHtml2 = "<a href='javascript:;' onclick='createSchAndCheck(this, " + datas[i].cinemaId + ", " + datas[i].platformId + ");'>生成&查看</a>";
						clickHtml = "<div class='click-check' data='0' onclick='handleClickLayerLoadData(0, this, \"" + datas[i].cinemaName + "\", " + datas[i].cinemaId + ");' onmouseleave='hideClickLayerSelf(this);'>点击查看</div>";
						clickHtml2 = "<div class='click-check' data='0' onclick='handleClickLayerLoadData(1, this, \"" + datas[i].cinemaName + "\", " + datas[i].cinemaId + ");' onmouseleave='hideClickLayerSelf(this);'>点击查看</div>";

						if(boxofficeDifValue*1 > 0) {
							bfdvColor = " style='color: #f30;'";
							bfdvImg = "<img src='images/up.png' class='img-arrow' />";
						}else {
							bfdvColor = " style='color: #05a93e;'";
							bfdvImg = "<img src='images/down.png' class='img-arrow' />";
						}
					}

					trHtml += "<tr>"
								+ "<td><a href='javascript:;' data='" + datas[i].platformId + "' id='" + datas[i].cinemaId + "' onclick='handleClickCinema2(this, event);'>" + datas[i].cinemaName + "</a></td>"
								+ "<td onmouseenter='showClickLayer(this);'>"
									+ "<span class='td-num'>" + totalP + "</span>"
									+ clickHtml
								+ "</td>"
								+ "<td onmouseenter='showClickLayer(this);'>"
									+ "<span class='td-num'>" + sysTotalP + "</span>"
									+ clickHtml2
								+ "</td>"
								+ "<td" + bfdvColor + ">" + boxofficeDifValue + bfdvImg + "</td>"
								+ "<td>" + scoreP + "</td>"
								+ "<td>" + checkHtml + "</td>"
								+ "<td>" + checkHtml2 + "</td>"
							+ "</tr>";
				}
			}else {
				trHtml = "<tr>"
					    + "<td colspan='7'>"
					        + "<div class='empty-data-div'>"
						        + "<img src='images/tip.png' width='80' />"
								+ "<span class='pdlt10 fs20 clr8'>暂无数据，您可在分配影院或选择分组后查看</span>"
							+ "</div>"
					    + "</td>"
					+ "</tr>";
			}

			$("#cinemaTatalTbl").find("thead").nextAll().remove();
			$("#cinemaTatalTbl").find("thead").after(trHtml);
		}
	});
}

/**
* 新建分组 - 提交
*
* @param obj 当前对象
* @param e 事件对象
**/
function submitCreateGroup(obj, e) {
	var userId = getCookie("jh_sdleUserId"), platformId = 0;
	var groupName = $("#groupName").val();

	if(groupName.trim() == "") {
		tipMsg_Single("cinemaTatalTbl", 0, "请输入分组名称", 0, '', '');
		$("#groupName").focus();
		return;
	}

	server.addGroup(userId, platformId, groupName, function(callback) {
		if(callback.ret) {
			tipMsg_Single("cinemaTatalTbl", 0, "保存成功", 0, '', '');
			closeCreateLayer(obj, e);
			$("#myModal").hide();
			$(".modal-backdrop").remove();

			$(".manage-groups-cnt").find(".default-group").hide();
			// 加载分组列表(管理分组)
			getGroupLists(1);
		}
	});
}

/**
* 删除分组
*
* @param obj 当前对象
**/
function delGroup(obj) {
	var groupIndex = $(".manage-groups-cnt").find("a.active").index();
	var groupId = $(".manage-groups-cnt").find("a").find("input:checked").val();
	
	// if(groupIndex == 0) {
	// 	tipMsg_Single("cinemaTatalTbl", 0, "不能删除默认分组，请选择其他分组", 0, '', '');
	// 	return;
	// }

	if(groupId == undefined) {
		tipMsg_Single("cinemaTatalTbl", 0, "请先选择分组", 0, '', '');
		return;
	}
	
	server.delGroup(groupId, function(callback) {
		if(callback.ret) {
			tipMsg_Single("cinemaTatalTbl", 0, "删除成功", 0, '', '');
			getGroupLists(1);
			loadCinemaListOfTheatres(0, -1);
		}
	});
}

/**
* 分配影院 - 打开影院列表层
**/
function openCinemaListLayer() {
	var groupNums = $(".manage-groups-cnt").find("a").length;
	var groupId = $(".manage-groups-cnt").find("a").find("input:checked").val();
	
	// 只有"默认分组"
	if(groupNums == 0)
		tipMsg_Single("cinemaTatalTbl", 0, "请先添加分组", 0, '', '');
	else if(groupId == "" || groupId == undefined)
		tipMsg_Single("cinemaTatalTbl", 0, "请先选择分组", 0, '', '');
	else {
		// groupId = $(".manage-groups-cnt").find("a").find("input:checked").val();
		
		$('#myModal2').modal({
			backdrop:true,
			keyboard:true,
			show:true
		});
		$('#myModal2').show();
		getCinemaListsOfGroup(-1, 0);
	}
}

/**
* 分配影院 - 提交
**/
function submitAddCinemaForGroup(obj, e) {
	var chkObj = $(".cinemalist-body").find("p").find("a"), chkObjL = chkObj.length;
	var userId = getCookie("jh_sdleUserId");
	var groupId = $(".manage-groups-cnt").find("a").find("input:checked").val();
	var paramArr = [], cinemaId = "";

	for(var i = 0; i < chkObjL; i++) {
		cinemaId = $(chkObj[i]).find("input:checked").val();
		
		if(cinemaId != undefined && cinemaId != "")
			paramArr[paramArr.length] = cinemaId;
	}

	server.addCinemaForGroup(userId, groupId, paramArr, function(callback) {
		if(callback.ret) {
			tipMsg_Single("cinemaTatalTbl", 0, "分配并保存成功", 0, '', '');
			
			$("#myModal2").hide();
			$(".modal-backdrop").remove();

			// 加载对应汇总统计列表
			getCinemaTotalList(groupId, $("#queryDate").val(), 1, "");
		}
	});
}

// 日期查询
function queryBoxOfficeTotalForGroup() {
	// 当前选项卡索引(0:影院分组, 1:管理分组)
	var groupTabIndex = $("#manageTabs").find("li.active").index();
	var groupId = null, queryDate = "", groupNums = 0;
	var queryDate = $("#queryDate").val();

	if(groupTabIndex == 0) {
		// 选项卡下的分组数量
		groupNums = $(".cinema-group-list").find("button").length;

		if(groupNums == 1)
			groupId = 0;
		else
			groupId = $(".cinema-group-list").find("button.active").attr("data");
	}

	if(groupTabIndex == 1) {
		groupNums = $(".manage-groups-cnt").find("a").length;

		if(groupNums == 1)
			groupId = 0;
		else {
			groupId = $(".manage-groups-cnt").find("a").find("input:checked").val();
			groupId = groupId == "" || groupId == undefined ? 0 : groupId;
		}
	}

	getCinemaTotalList(groupId, queryDate, 1, "");
}


/*************************************************** 标签/按钮/弹出层 相关事件 ************************************************/
/**
* 新建分组 - 打开新建层
*
* @param obj 当前对象
* @param e 事件对象
**/
function openCreateLayer(obj, e) {
	$('#myModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
	$('#myModal').show();
	$(".ra-create-box").css("padding-right", "0");
	$("#groupName").focus();
}

/**
* 新建分组 - 关闭层
*
* @param obj 当前对象
* @param e 事件对象
**/
function closeCreateLayer(obj, e) {
	$('#groupName').val("");
	$("#curCinemaID").val("");
}

/**
* 影院点击事件(版本1：走流程)
*
* @param obj 当前对象
* @param e 事件对象
**/
function handleClickCinema(obj, e) {
	$(".nav-menus").find("li").removeClass("active cinema-menu");
	// 隐藏独立菜单
	$(".nav-menus").find("li.alone-menu").hide();

	cinemaObj.id = $(obj).attr("id");
	cinemaObj.name = $(obj).text();
	cinemaObj.platFormId = $(obj).attr("data");

	// $(".main").html("<center><img src='images/loading.gif' /></center>");
	$(".main").html(muObj.loadImg);
	$(".main").load(muObj.url_ps_1);
}

/**
* 影院点击事件(版本2：转到排期展示)
*
* @param obj 当前对象
* @param e 事件对象
**/
function handleClickCinema2(obj, e) {
	$(".nav-menus").find("li").removeClass("active cinema-menu");
	// 隐藏独立菜单
	$(".nav-menus").find("li.alone-menu").hide();
	// 当前影院指示块
	$(".cur-locat-cinema-name").text($(obj).text());
	$(".location-box").show();

	cinemaObj.id = $(obj).attr("id");
	cinemaObj.name = $(obj).text();
	cinemaObj.platFormId = $(obj).attr("data");

	// $(".main").html("<center><img src='images/loading.gif' /></center>");
	$(".main").html(muObj.loadImg);
	// 执行点击"排期展示"事件
	clickSubMenu($(".nav-menus").find("li:eq(4)").find(".sub-nav").find("a:eq(0)"), 4, 0);
}

/**
* 未上传点击事件
*
* @param obj 当前对象
* @param e 事件对象
**/
function handleClickUnUpload(obj, e) {
	// 设置索引值, 以供它用
	$("#uploadTabIndex").val(1);
	
	$(".nav-menus").find("li").removeClass("active");
	$(".nav-menus").find("li:eq(5)").addClass("active");

	cinemaObj.id = $(obj).attr("id");
	// cinemaObj.name = $(obj).attr("title");
	cinemaObj.planFormId = $(obj).attr("data");

	// $(".main").html("<center><img src='images/loading.gif' /></center>");
	$(".main").html(muObj.loadImg);
	// $(".main").load(muObj.url_ps_1);
	$(".main").load(muObj.url5);
}

// 单选按钮点击
function handleClickBox(obj) {
	var status = document.getElementById(obj).checked;
	var groupId = document.getElementById(obj).value;
	
	if(status) {
		$(".manage-groups-cnt").find("a").removeClass("active");
		$("#" + obj).parent("a").addClass("active")

		// 汇总统计(默认"默认分组")
		getCinemaTotalList(groupId, $("#queryDate").val(), 1, "");
	}
}

// 管理分组 - 默认分组 点击事件
function handleClickDefaultGroupOfMng(obj) {
	$(".manage-groups-cnt").find("a").find("input").attr("checked", false);
	$(".manage-groups-cnt").find("a").removeClass("active");
	$(obj).addClass("active")
	// 汇总统计(默认"默认分组")
	getCinemaTotalList(0, $("#queryDate").val(), 1, "");
}

/**
* "点击查看"层 - 显示
**/
function showClickLayer(obj) {
	var status = $(obj).find(".click-check").attr("data");

	if(status*1 == 0) {
		// $(obj).find(".click-check").css({"margin-top":"-40px"});
		$(obj).find(".click-check").slideDown();
		setTimeout(function() {
			$(obj).find(".click-check").attr("data", 1);
		}, 200);
	}
	
	if(status*1 == 1) {
		$(obj).find(".click-check").slideUp();
		setTimeout(function() {
			$(obj).find(".click-check").attr("data", 0);
		}, 200);
	}
}

/**
* "点击查看"层 - 隐藏
**/
function hideClickLayer(obj) {
	$(obj).find(".click-check").slideUp();
}

/**
* "点击查看"层本身 - 隐藏
**/
function hideClickLayerSelf(obj) {
	var status = $(obj).attr("data");

	if(status*1 == 0) {
		$(obj).slideDown();
		setTimeout(function() {
			$(obj).attr("data", 1);
		}, 200);
	}
	
	if(status*1 == 1) {
		$(obj).slideUp();
		setTimeout(function() {
			$(obj).attr("data", 0);
		}, 200);
	}
}

/**
* "点击查看"层 - 点击加载内容
*
* @param label 加载数据来源(0:实际排片, 1:参考排片)
* @param obj 当前对象
* @param cinemaName 影院名字
* @param cinemaId 影院ID
**/
function handleClickLayerLoadData(label, obj, cinemaName, cinemaId) {
	$("#curCinemaID").val(cinemaId);

	// 实际排片
	if(label == 0) {
		$("#schTitle").html("<center><span class='layer-cinemaname'>[" + cinemaName + "]</span><span class='layer-t'>实际票房</span></center>");
		$(".sch-body").find("p").html("<center><img src='images/loading.gif' /></center>");

		setTimeout(function() {
			$(".sch-body").find("p").load(muObj.url_gp1);
			$("body").css("overflow", "auto");
		}, 200);
	}

	// 参考排片
	if(label == 1) {
		$("#schTitle").html("<center><span class='layer-t'>系统预测可达票房</span></center>");
		$(".sch-body").find("p").html("<center><img src='images/loading.gif' /></center>");

		setTimeout(function() {
			$(".sch-body").find("p").load(muObj.url_gp2);
			$("body").css("overflow", "auto");
		}, 200);
	}

	$('#schModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
}

/**
* 查看报告
* 
* @param obj 当前对象
* @param cinemaId 当前影院ID
* @param cinemaName 当前影院名字
**/
function checkReport(obj, cinemaId, cinemaName) {
	$("#curCinemaID").val(cinemaId);
	
	$("#reportTitle").html("<center><span class='layer-date'>" + $("#queryDate").val() + "</span><span class='layer-cinemaname2'>" + cinemaName + "</span><span class='layer-t'>评估报告</span></center>");
	$(".report-body").find("p").html("<center><img src='images/loading.gif' /></center>");

	setTimeout(function() {
		$(".report-body").find("p").load(muObj.url_gp3);
		$("body").css("overflow", "auto");
	}, 200);

	$('#reportModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});
}

/**
* 明日排期 - 生成&查看
* 
* @param obj 当前对象
* @param cinemaId 当前影院ID
**/
function createSchAndCheck(obj, cinemaId, platformId) {
	// 保存查询日期, 供跳转后使用
	$("#groupSchDate").val($("#queryDate").val());
	// 保存当前影院ID, 供跳转后使用
	$("#cinemaId").val(cinemaId);
	cinemaObj.id = cinemaId;
	cinemaObj.platFormId = platformId;
	$(".main").load(muObj.url_gp4);
}

$(function() {
	// 选项卡点击事件
	$('#manageTabs a').click(function (e) {
		// 当前选项卡索引
		var curTabIndex = $(this).parent().index();

		e.preventDefault();
		$(this).tab('show');
		
		// 加载分组列表
		getGroupLists(curTabIndex);

		// 影院分组 选项卡
		if(curTabIndex == 0) {
			// 加载"默认分组"的影院列表
			loadCinemaListOfTheatres(0, "");
			// 加载汇总统计(默认"默认分组")
			// getCinemaTotalList(0, getCurDate(), 1, "");
		}

		// 管理分组 选项卡
		if(curTabIndex == 1) {
			// 加载汇总统计(默认"默认分组")
			getCinemaTotalList(-1, getCurDate(), 1, "");
		}
	});
});