/**
* 当日票房成绩单
**/

/**
 * 加载当日票房成绩单
 * 
 * @param 
 * 		cinemaId  影院ID
 * 		queryDate 日期参数
 * @return
 * */
function loadBoxOfficeTotals(cinemaId, queryDate){
	var trObj = $("#reportCntTbl").find("#reportCntTblTr");
	trObj.nextAll("tr").remove();
	
	/**
	 * 汇总内容总html(=标题html + 数据html)
	 * */
	var boxOfficeHTML = "";
	/**
	 * 汇总数据html
	 * */
	var boxOfficeCntHTML = "";
	/**
	* 来自排期时展现数据
	**/
	var schDataHtml = "";
	/**
	 * 合并单元格个数
	 * */
	var colspanNums = 6;
	/**
	 * 总计HTML
	 * */
	var totalHTML = "";
	/**
	 * 是否可编辑
	 * */
	var isEdit = false;
	/**
	 * 数据对象和长度
	 * */
	var dataObj = null, dataObjL = 0;
	
	server.boxOfficeList(cinemaId, queryDate, function(callback){
		if(callback.ret){
			isEdit = callback.isEdit;
			dataObj = callback.data, dataObjL = dataObj.length;
			
			if(isEdit){	// 来自排期
				boxOfficeCntHTML = "<tr>"
					            	+ "<td colspan='" + colspanNums + "'>"
					            		+ "<div class='w988 mtauto no-data-div'>"
						            		+ "<img class='tip-light' src='images/tip.png'>"
											+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
										+ "</div>"
					            	+ "</td>"
					            + "</tr>";
			}else{	// 来自票房明细
				if(dataObjL < 1){
					boxOfficeCntHTML = "<tr>"
						            	+ "<td colspan='" + colspanNums + "'>"
						            		+ "<div class='w988 mtauto no-data-div'>"
							            		+ "<img class='tip-light' src='images/tip.png'>"
												+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
											+ "</div>"
						            	+ "</td>"
						            + "</tr>";
					totalHTML = "";
				}else{
					var sessionCount = 0;	// 场次数
					var sessionRate = 0;	// 场次比率
					var totalSessionRate = 0;	// 场次总比率
					var ticketCount = 0;	// 观影人次数
					var ticketRate = 0;		// 观影人次比率
					var totalTicketRate = 0;	// 观影人次总比率
					var avgSessionCount = 0;	// 场均人次数
					var totalAvgSessionCount = 0;	// 场均人次总数
					var trClassName = "";
					
					for(var i = 0; i < dataObjL; i++){
						if(i % 2 == 0) {
							trClassName = " show-list-tbl-data-odd";
						}else {
							trClassName = " show-list-tbl-data-even";
						}

						sessionCount += dataObj[i].sessionCount;
						sessionRate = (dataObj[i].sessionRate) * 100;
						
						if(dataObj[i].ticketCount == undefined)
							ticketCount = "";
						else
							ticketCount = dataObj[i].ticketCount;
						
						if(dataObj[i].ticketRate == undefined){
							ticketRate = "";
							totalTicketRate = "";
						}else{
							ticketRate = (dataObj[i].ticketRate)*100;
							totalTicketRate += ticketRate;
						}
						
						if(dataObj[i].avgSessionCount == undefined){
							avgSessionCount = "";
							totalAvgSessionCount = "";
						}else{
							avgSessionCount = dataObj[i].avgSessionCount;
							totalAvgSessionCount += avgSessionCount;
						}
						
						sessionRate = sessionRate.toString();
						if(sessionRate.indexOf(".") != -1)
							sessionRate = sessionRate.substring(0, sessionRate.indexOf("."));
						totalSessionRate += sessionRate*1;
						
	//					ticketRate = ticketRate == 0 || ticketRate == "" ? "" : (ticketRate + "%");
						if(ticketRate == 0 || ticketRate == "")
							ticketRate = "";
						else{
							ticketRate = ticketRate.toString();
							if(ticketRate.indexOf(".") != -1)
								ticketRate = ticketRate.substring(0, ticketRate.indexOf(".")) + "%";
							else
								ticketRate = ticketRate + "%";
						}
						
						boxOfficeCntHTML += "<tr class='show-list-tbl-data" + trClassName + "'>"
												+"<td class='th-idt'><input type='hidden' value='" + dataObj[i].filmId + "' /><span>" + dataObj[i].filmName + "</span></td>"
												+"<td>" + dataObj[i].sessionCount + "</td>"
												+"<td>" + sessionRate + "%</td>"
												+"<td>"
													+"<span id='ticketCount" + i + "' style='height: 27px;'>" + ticketCount + "</span>"
													+"<input type='text' name='persons' id='persons" + i + "' value='' "
													+"onblur='checkNum(this.id, this.value, this);compareWithSessionCount(this.id, this.value, this);' style='display: none; width: 80px; height: 24px; "
													+"border: 1px solid #CCC; background-color: transparent; color: #07637d;' />"
												+ "</td>"
												+"<td><span id='ticketRate" + i + "'>" + ticketRate + "</span></td>"
												+"<td><span id='avgSessionCount" + i + "'>" + avgSessionCount + "</span></td>"
											+"</tr>";
					}
					
					if(dataObjL % 2 == 0) {
						trClassName = " show-list-tbl-data-odd";
					}else {
						trClassName = " show-list-tbl-data-even";
					}
					totalHTML = "<tr class='show-list-tbl-data" + trClassName + "'>"
									+"<td class='th-idt'><B>总计</B></td>"
									+"<td><span id='totalSessionCount'><B>" + callback.totalSessionCount + "</B></span></td>"
									+"<td><span id='totalSessionRate'></span></td>"
									+"<td><span id='totalTicketCount'><B>" + callback.totalTicketCount + "</B></span></td>"
									+"<td><span id='totalTicketRate'></span></td>"
									+"<td><span id='totalAvgSessionCount'><B>" + totalAvgSessionCount + "</B></span></td>"
								+"</tr>";
				}
			}
			
			boxOfficeHTML = boxOfficeCntHTML + totalHTML;	// 数据区html组装(列表标题+数据列表+总计)
			
			trObj.after(boxOfficeHTML);	// 装载数据区
			// 保留日期的查询条件
			if(saveQueryDate == "") {
				$("#cutOffDate").val(getCurDate());
			}else {
				$("#cutOffDate").val(saveQueryDate);
			}

			// // 表格数据排序等相关功能
			// $("#reportCntTbl").dataTable({
			// 	"bDestroy":true,
			// 	"aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 ] }],	// 指定第一列不参与排序
			// 	"asStripClasses":["odd", "even"],
			// 	"aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			// 	"order": [[ 1, "asc" ]],
			// 	"bStateSave": false,
			// 	"bPaginate":true, //翻页功能
			// 	"bSortClasses":true,
			// 	"bLengthChange" : true,//改变每页显示数据数量
			// 	"bFilter": true, //过滤功能
			// 	"bInfo": true,//页脚信息
			// 	"iDisplayLength" : 10,// 每页显示行数
			// 	"language": {
			// 	    "url": "http://cdn.datatables.net/plug-ins/e9421181788/i18n/Chinese.json"
			// 	    // "sEmptyTable": "暂无汇总数据"
			// 	}
			// });
			// // 修改相关项的默认样式
			// $(".dataTable").css({"border-collapse":"collapse", "width":"99.9%"});
			// $(".dataTable thead th").css({"padding":"0 8px", "border-bottom":"1px solid #7098a3"});
			// $(".dataTable thead td").css({"padding":"0 8px"});
			// $(".dataTable thead .sorting").css("background-position", "50% 0%");
			// $(".dataTable thead .sorting_asc").css("background-position", "50% 0%");
			// $(".dataTable thead .sorting_desc").css("background-position", "50% 0%");
		}else{
			boxOfficeCntHTML = "<tr>"
					            + "<td colspan='" + colspanNums + "'>"
					            	+ "<div class='w988 mtauto no-data-div'>"
						            	+ "<img class='tip-light' src='images/tip.png'>"
										+ "<span class='tip-text-nodata fs20 clr8'>暂无数据，您可在上传票房后查看</span>"
									+ "</div>"
					            + "</td>"
					        + "</tr>";
			
			trObj.after(boxOfficeCntHTML);	// 装载数据区
		}
		$("#loadImg2").hide();	// 隐藏加载动画
	});
}

/**
 * 查询票房成绩单
 * */
 var saveQueryDate = "";
function queryBoxOfficeTotal(){
	loginStatus();

	var cinemaId = getCookie("cinemaId");
	var queryDate = $dp.cal.getDateStr();
	saveQueryDate = queryDate;
	
	if(queryDate == "")
		tipMsg_Single('boxOfficeModel', 0, "请选择查询日期", 0, '', '');
	else{
		loadBoxOfficeTotals(cinemaId, queryDate);
	}
}