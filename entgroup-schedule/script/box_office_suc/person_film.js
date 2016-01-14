/**
 * 首周人次分析
 **/

/*
* 数据源 影片列表
*/
function loadPersonFilmList() {
	var pfCId = getCookie("cinemaId");
	
	server.scanPersonOfFilm(pfCId, function(callback) {
		if(callback.ret) {
			var data = callback.data, dataL = data.length;
			var listHtml = "";

			if(data.length > 0) {
				for(var i = 0; i< dataL; i++) {
					listHtml += "<a href='javascript:;' title='" + data[i].filmName + "' onclick='checkBoxImg(this);'>";
					listHtml += "<img src='images/chk1.png' class='chk-img' data='0' /><span data='" + data[i].id + "'>" + data[i].filmName + "</span>";
					listHtml += "</a>";
				}

				$("#pfb_cnt").html(listHtml);
			}
		}
	});
}

/**
* 分析统计结果及明细
*
* @param cinemaId 影院ID
* @param filmIds 需分析的影片id数组
* @param showDate 日期
**/
var saveData = [], data_index_arr = [];	// 存放接口返回数据
function analyzeFilm(cinemaId, filmIds, showDate) {
	server.analyzeBySltFilm(cinemaId, filmIds, showDate, function(callback) {
		if(callback.ret) {
			var data = callback.data;
			var dataL = data.length;
			var trHtml = "", trClassName = "";
			var filmType = "";

			if(dataL > 0) {
				saveData = data;

				for(var i = 0; i < dataL; i++) {
					if(i % 2 == 0) {
						trClassName = " show-list-tbl-data-odd";
					}else {
						trClassName = " show-list-tbl-data-even";
					}

					data_index_arr[i] = data[i].details;
					filmType = data[i].code == undefined ? "" : data[i].code;

					trHtml += "<tr id='' class='show-list-tbl-data" + trClassName + "'>";
					trHtml += "<td class='th-idt'>" + data[i].filmName + "</td>";
					trHtml += "<td>" + filmType + "</td>";
					trHtml += "<td>" + data[i].totalticketCount + "</td>";
					trHtml += "<td>" + data[i].firstWeekticketCount + "</td>";
					// trHtml += "<td>" + data[i].firstWeekPrice + "</td>";
					// trHtml += "<td>" + data[i].totalPrice + "</td>";
					trHtml += "<td>" + data[i].showDays + "</td>";
					trHtml += "<td><a href='javascript:;' onclick=showDetailData(" + i + ")>查看</a></td>";
					trHtml += "</tr>";
				}
			}else {
				trHtml = "<tr class='show-list-tbl-data show-list-tbl-data-odd'>"
			            + "<td colspan='6'>"
			            	+ "<div class='w988 mtauto no-data-div'>"
				            	+ "<img class='tip-light' src='images/tip.png'>"
								+ "<span class='tip-text-nodata fs20 clr8'>您所选的影片，暂无分析结果</span>"
							+ "</div>"
			            + "</td>"
			        + "</tr>";
			}

			$("#analyze_title").nextAll().remove();
			$("#analyze_title").after(trHtml);
		}
	});
}

/**
* 显示详细数据
*
* @param indx 当前索引
**/
function showDetailData(indx) {
	var ttTicketCount = 0, ttPrice = 0;	// 累计人数, 累计票房
	var curData = data_index_arr[indx];
	var curDataL = curData.length;
	var trHtml = "", trClassName = "";

	if(curData != "") {
		for(var i = 0; i < curDataL; i++) {
			if(i % 2 == 0) {
				trClassName = " show-list-tbl-data-odd";
			}else {
				trClassName = " show-list-tbl-data-even";
			}

			ttTicketCount += curData[i].ticketCount;
			ttPrice += curData[i].price;

			trHtml += "<tr id='' class='show-list-tbl-data" + trClassName + "'>";
			trHtml += "<td class='th-idt'>" + (i+1) + "</td>";
			trHtml += "<td>" + curData[i].showWeek + "</td>";
			trHtml += "<td>" + curData[i].showDate + "</td>";
			trHtml += "<td>" + curData[i].ticketCount + "</td>";
			trHtml += "<td>" + ttTicketCount + "</td>";
			// trHtml += "<td>" + curData[i].price + "</td>";
			// trHtml += "<td>" + ttPrice + "</td>";
			trHtml += "</tr>";
		}
	}else {
		trHtml = "<tr class='show-list-tbl-data show-list-tbl-data-odd'><td colspan='5' align='center'>该影片暂无详细数据</td></tr>";
	}

	$("#analyze_title_detail").nextAll().remove();
	$("#analyze_title_detail").after(trHtml);

	$(".zhezhao2").css({ display : "block", height : $(document).height(), "z-index": "100"});
	$(".pab-cnt-detail").slideDown();
}

$(function() {
	// 重新选择
	$(".rechk").click(function() {
		$("#pfb_cnt").find("a").find("img").attr("data", "0");
		$("#pfb_cnt").find("a").find("img").attr("src", "images/chk1.png");
		$("#personDate").val("");
	});

	// 开始分析 按钮
	$("#analyze_btn").click(function() {
		loginStatus();

		var num = 0;	// 已选影片数量
		var analyze_film_arr = [];	// 已选影片id数组
		var chkObj = $(".pfb-cnt").find("a").find("img");
		var chkObjL = $(chkObj).length;

		for(var i = 0; i < chkObjL; i++) {
			if(parseInt($(chkObj[i]).attr("data")) == 1) {
				analyze_film_arr[analyze_film_arr.length] = $(chkObj[i]).next().attr("data");
				num ++;
			}
		}

		if(num < 1) {
			tipMsg_Single("analyze_btn", 0, "请先选择影片", 0, '', '');
		}else {
			var filmId_str = analyze_film_arr.toString();
			var sltDate = $("#personDate").val();	// 用户选择日期
			var showDate = "";
			if(sltDate == "") {
				showDate = getCurDate();
			}else {
				showDate = sltDate;
			}
			var pfCid = getCookie("cinemaId");
			
			analyzeFilm(pfCid, filmId_str, showDate);
		}
	});

	// 关闭详细层, 清空数据
	$(".pab-cnt-close").click(function() {
		$(".pab-cnt-detail").slideUp();
		$(".zhezhao2").css("display","none");
		$("#analyze_title_detail").nextAll().remove();		
	});
});