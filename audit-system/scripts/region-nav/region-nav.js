/*
 * 影院导航
 *
 * @author ccq
 */


/**
* 院线下属影院列表
**/
function loadCinemaListOfTheatres() {
	var cinemaHtml = "";

	server.queryAuditAccounts(function(callback) {
		if(callback != "" && callback != undefined) {
			var datasL = callback.length;
			$("#childCinemaNumsJH").text(datasL);

			for (var i = 0; i < datasL; i++) {
				cinemaHtml += "<a href='javascript:;' data='" + callback[i].platformId + "' id='" + callback[i].cinemaId
						 + "' onclick='handleClickCinema(this, event);'>" + callback[i].cinameName + "</a>";
			}

			$(".cinemas-cnt").html(cinemaHtml);
		}
	});
}

/**
* 新建大区 - 打开新建层
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
}

/**
* 新建大区 - 提交
*
* @param obj 当前对象
* @param e 事件对象
**/
function createRegion(obj, e) {}

/**
* 新建大区 - 关闭层
*
* @param obj 当前对象
* @param e 事件对象
**/
function closeCreateLayer(obj, e) {
	$('#regionName').val("");
}

/**
* 影院点击事件
*
* @param obj 当前对象
* @param e 事件对象
**/
function handleClickCinema(obj, e) {
	$(".nav").find("li").removeClass("active cinema-menu");
	cinemaObj.id = $(obj).attr("id");
	cinemaObj.name = $(obj).text();
	cinemaObj.platFormId = $(obj).attr("data");

	// $(".main").html("<center><img src='images/loading.gif' /></center>");
	$(".main").html(muObj.loadImg);
	$(".main").load(muObj.url_ps_1);
}