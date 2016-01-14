/**
* 上传历史查询
**/
function queryDetailHistory() {
	loginStatus();

	var historyDate = $dp.cal.getDateStr();;
	if(historyDate == ""){
		tipMsg_Single('boxOfficeModel', 0, "请选择查询日期", 0, '', '');
	}else{
		var cinemaId = getCookie("cinemaId");
		showHistoryDetail(cinemaId, historyDate);
	}
}

/**
* 展现历史明细
**/
function showHistoryDetail(cinemaId, history_date) {
	var current = 0, offset = "";

	// 调用接口
	server.detailList(cinemaId, current, offset, history_date, function(callback) {
		if(callback.ret){
			var history_data = callback.data;
			var history_data_html = "";

			if(history_data.length > 0){
				for(var i = 0; i < history_data.length; i++) {
					history_data_html += "<tr class='show-list-tbl-data'>"
											+"<td title='" + history_data[i].filmName + "' class='th-idt'>" + history_data[i].filmName + "</td>"
											+"<td title='" + history_data[i].showDate + "'>" + history_data[i].showDate + "</td>"
											+"<td title='" + history_data[i].sessionCount + "'>" + history_data[i].sessionCount + "</td>"
											+"<td title='" + history_data[i].ticketCount + "'>" + history_data[i].ticketCount + "</td>"
											+"<td title='" + history_data[i].totalTicketCount + "'>" + history_data[i].totalTicketCount + "</td>"
											+"<td title='" + history_data[i].totalPrice + "'>" + history_data[i].totalPrice + "</td>"
											+"<td title='" + history_data[i].avgPrice + "'>" + history_data[i].avgPrice + "</td>"
										+"</tr>";
				}

				$("#historyDetailCntTbl").find("thead").nextAll().remove();
				$("#historyDetailCntTbl").append(history_data_html);
			}else{
				// history_data_html = "<tr>"
				// 						+"<td colspan='12' class='titleWhite'>当日没有上传票房</td>"
				// 					+"</tr>";
				history_data_html = "<tr>"
						            + "<td colspan='7'>"
						            	+ "<div class='w988 mtauto no-data-div'>"
							            	+ "<img class='tip-light' src='images/tip.png'>"
											+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
										+ "</div>"
						            + "</td>"
						        + "</tr>";

				$("#historyDetailCntTbl").find("thead").nextAll().remove();
				$("#historyDetailCntTbl").append(history_data_html);
			}

			// 表格数据排序等相关功能
			$("#historyDetailCntTbl").dataTable({
				"bDestroy":true,
				"asStripClasses":["odd", "even"],
				"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				"order": [[ 0, "asc" ]],
				"bStateSave": false,
				"bPaginate":true, //翻页功能
				"bSortClasses":true,
				"bLengthChange" : true,//改变每页显示数据数量
				"bFilter": true, //过滤功能
				"bInfo": true,//页脚信息
				"iDisplayLength" : 10,// 每页显示行数
				"language": {
					"sEmptyTable" : "当日没有上传人次明细",
					"sZeroRecords": "没有匹配结果",
				    "sLengthMenu": "显示 _MENU_ 项结果",
				    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
				    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
				    "sSearch": "搜索:",
				    "oPaginate": {
				        "sFirst": "首页",
				        "sPrevious": "上页",
				        "sNext": "下页",
				        "sLast": "末页"
				    }
				}
			});
			// 修改相关项的默认样式
			$(".dataTable").css({"border-collapse":"collapse", "width":"99.9%"});
			$(".dataTable thead th").css({"padding":"0 8px"});
			$(".dataTable thead td").css({"padding":"0 8px"});
			$(".dataTable thead .sorting").css("background-position", "50% 50%");
			$(".dataTable thead .sorting_asc").css("background-position", "45% 50%");
			$(".dataTable thead .sorting_desc").css("background-position", "45% 50%");
		}
	});
}
