/**
* 上传票房独立JS
*
* @author ccq
**/


/**
* 获取影院列表
*
* @param queryDate 上传/查询日期
* @param uploadIndex 上传选项卡索引
**/
function queryUploadCinemaLists(tabIndex) {
	var queryDate = $("#queryDate").val();
	var uploadIndex = tabIndex == "" ? $("#manageTabs").find("li.active").index() : tabIndex;

	server.queryUploadCinemas(queryDate, function(callback) {
		if(callback.ret) {
			var allCinemas = callback.totalCinemaList, 
			unUploadCinemas = callback.noUploadCinemaList, 
			uploadCinemas = callback.uploadedCinemaList;

			// 统计数字
			$(".upload-all-cinema").text(allCinemas.length);
			$(".upload-done-cinema").text(uploadCinemas.length);
			$(".upload-wait-cinema").text(unUploadCinemas.length);

			// 全部影院
			if(uploadIndex == 0)
				dealDataShowFunc(allCinemas);

			// 未上传
			if(uploadIndex == 1)
				dealDataShowFunc(unUploadCinemas);

			// 已上传
			if(uploadIndex == 2)
				dealDataShowFunc(uploadCinemas);
		}
	});
}

/**
* 遍历数据并展示
*
* @param datas 当前选项卡数据集
**/
function dealDataShowFunc(datas) {
	if(datas != "" && datas != null && datas != undefined) {
		var datasL = datas.length, listHtml = "", uploadDate = "", noHtml = "";

		for (var i = 0; i < datas.length; i++) {
			if(datas[i].uploadDate == undefined)
				noHtml = " style='color: #f30;'";
			else
				noHtml = " style='color: #666;'";
			uploadDate = datas[i].uploadDate == undefined ? "无" : datas[i].uploadDate;

			listHtml += "<div class='cinema-upload-block row' onmouseenter='handleEnterDiv(this);' onmouseleave='handleLeaveDiv(this);'>"
							+ "<div class='col-md-3 cn-box cn-color' id='" + datas[i].cinemaId + "' data='" + datas[i].platformId + "'>" + datas[i].cinemaName + "</div>"
							+ "<div class='col-md-3'>"
								+ "<a href='javascript:;' class='btn btn-success' onclick='loadModalForStartUpload(this, event, \"" + datas[i].cinemaName + "\", " + datas[i].cinemaId + ", " + datas[i].platformId + ");'>上传票房</a>"
							+ "</div>"
							+ "<div class='col-md-3'>"
								+ "<a href='javascript:;' class='btn btn-info' onclick='loadModalForBoxOffice(this, event, \"" + datas[i].cinemaName + "\", " + datas[i].cinemaId + ", " + datas[i].platformId + ");'>查看历史票房</a>"
							+ "</div>"
							+ "<div class='col-md-3 cn-box'><span>最近上传日期：</span><span " + noHtml + ">" + uploadDate + "</span></div>"
						+ "</div>";
		}
	}else {
		listHtml = "<div class='empty-data-div'>"
					+ "<img src='images/tip.png' width='80' />"
					+ "<span class='pdlt10 tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
				+ "</div>";
	}

	$(".cinema-lists-box").html(listHtml);
}

/**
* 开始上传 - 点击加载页面
*
* @param obj 当前对象
* @param e 事件对象
* @param cinemaName 当前影院名字
* @param cinemaId 当前影院ID
* @param platformId 当前影院所属平台ID
**/
function loadModalForStartUpload(obj, e, cinemaName, cinemaId, platformId) {
	cinemaObj.id = cinemaId;
	cinemaObj.name = cinemaName;
	cinemaObj.platFormId = platformId;

	$("#upCinemaTitle").html("<center><span class='layer-t'>" + cinemaName + "&nbsp;&nbsp;影院</span></center>");
	$(".upload-body").find("p").html("<center><img src='images/loading.gif' /></center>");

	setTimeout(function() {
		$(".upload-body").find("p").load(muObj.url_gp5);
		$("body").css("overflow", "auto");
	}, 200);

	$('#startUploadModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});

	$(".up-boff-box").css("padding-right", "0");
}

/**
* 查看历史票房
*
* @param obj 当前对象
* @param e 事件对象
* @param cinemaName 当前影院名字
* @param cinemaId 当前影院ID
* @param platformId 当前影院所属平台ID
**/
function loadModalForBoxOffice(obj, e, cinemaName, cinemaId, platformId) {
	cinemaObj.id = cinemaId;
	cinemaObj.name = cinemaName;
	cinemaObj.platFormId = platformId;

	$("#boffTitle").html("<center><span id='schDate' class='sch-date'></span><span class='layer-t'>" + cinemaName + "&nbsp;&nbsp;影院</span></center>");
	$(".boff-body").find("p").html("<center><img src='images/loading.gif' /></center>");

	setTimeout(function() {
		$(".boff-body").find("p").load(muObj.url_gp6);
		$("body").css("overflow", "auto");
	}, 200);

	$('#boxOfficeModal').modal({
		backdrop:true,
		keyboard:true,
		show:true
	});

	$(".boff-box").css("padding-right", "0");
}

/**
* 一键生成票房对比
**/
function becomeCompareResultByDirect(cinemaId, platformId, showDate) {
	//alert("here : "+cinemaObj.id+" - "+cinemaObj.platFormId)
	server.compareBoxOfficeJH(cinemaId, platformId, showDate, function(callback) {
		if(callback.ret) {
			tipMsg_Single("reportTitle", 0, "提交成功", 0, '', '');
			setTimeout(function() {
				$('#startUploadModal').modal("hide");
			}, 300);

			// localStorage.detailSubmitFlag = 1;	// 提交后，更新标示位(0:未提交, 1:已提交)
			queryUploadCinemaLists("");
		}
	});
}

/**
* 日期查询
**/
function queryUploadCinema() {
	queryUploadCinemaLists("");
}

/**
* 鼠标进入Div
* 
* @param obj 当前对象
**/
function handleEnterDiv(obj) {
	$(obj).addClass("active-div");
}

/**
* 鼠标离开Div
* 
* @param obj 当前对象
**/
function handleLeaveDiv(obj) {
	$(obj).removeClass("active-div");
}


$(function() {
	// 选项卡点击事件
	$('#manageTabs a').click(function (e) {
		// 当前选项卡索引
		var curTabIndex = $(this).parent().index();

		e.preventDefault();
		$(this).tab('show');

		// 加载对应列表
		queryUploadCinemaLists("");
	});
});