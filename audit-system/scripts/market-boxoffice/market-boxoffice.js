/**
* 系统排期生成
*
* @author ccq by 2015-11-10
**/


/**
* 加载大盘票房列表
*
* @param queryDate 查询日期
**/
function loadMarketBoxOfficeList(queryDate) {
	$("#marketBoxOfficeTbl").find("thead").nextAll().remove();
	$("#marketBoxOfficeTbl").append("<tr><td colspan='6' align='center'><img src='images/loading.gif' /></td></tr>");

	server.loadMarketBoxOffice(queryDate, function(callback) {
		if(callback.ret) {
			$("#marketBoxOfficeTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = 0;
			var dataHtml = "";

			if(datas != undefined && datas != "") {
				datasL = datas.length;

				if(datasL > 0) {
					for(var i = 0; i < datasL; i++) {
						dataHtml += "<tr>"
									+ "<td>" + datas[i].filmName + "</td>"
									+ "<td>" + datas[i].totalPrice + "</td>"
									+ "<td>" + datas[i].sumTotalPrice + "</td>"
									+ "<td>" + datas[i].avgPrice + "</td>"
									+ "<td>" + datas[i].avgTotalPrice + "</td>"
									+ "<td>" + datas[i].avgTicketCount + "</td>"
									+ "<td>" + datas[i].releaseDays + "</td>"
								+ "</tr>";
					}
				}
			}else {
				dataHtml = "<tr>"
							+ "<td colspan='7'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无数据，请稍后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
			}

			$("#marketBoxOfficeTbl").append(dataHtml);

			// 统计数据
			$(".total-office-date").text(queryDate);
			// $(".total-office-nums").text(queryDate);
			// $(".total-office-counts").text(queryDate);
			// $(".total-office-persons").text(queryDate);
		}
	});
}

/**
* 日期查询
**/
function queryMarketBoxOfficeByDate() {
	var queryDate = $dp.cal.getDateStr();
	
	if(queryDate == "")
		tipMsg_Single('marketBoxOfficeTbl', 0, "请选择查询日期", 0, '', '');
	else{
		loadMarketBoxOfficeList(queryDate);
		$dp.hide();
	}
}