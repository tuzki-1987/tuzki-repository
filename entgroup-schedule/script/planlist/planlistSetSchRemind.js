/**
 * 明日排片提醒，与自己票房作对比
 */


/**
 * 加载排期的数据
 * 
 * @param fromWhere 请求出处(0: 时光网)
 * @param showDate 日期计算参数(基于当日, 0: 当日, -1: 昨天, 1: 明天)
 * @param platFormId 数据源流(2: 万达, 3: 时光网)
 * @param objLevel 触发事件的对象的级别(扩展参数)
 **/
function loadTomorrowFromWhere(fromWhere, showDate, platFormId){
	var tmrwDate = SetDateStr(showDate, '');
	var dataHTML = "";
	var totalHTML = "";
	var totalSeat = 0;
	var totalRate = 0;
	
	/*if(fromWhere == 0){	// 万达
		fromWanDaOrShgw(tmrwDate, platFormId, dataTitle, dataHTML, totalHTML, totalSeat, totalRate);

		$("#wandaDateShow").text("（日期："+tmrwDate+"）").show();
		$("#shigwDateShow").hide();
		$(".trCntFromOut").find("ul").find("li:eq(0)").find("a:eq(0)").removeAttr("onclick");
		$(".trCntFromOut").find("ul").find("li:eq(1)").find("a:eq(0)").attr("onclick", "loadTomorrowFromWhere(1, 1, 3);");
	}*/
	if(fromWhere == 0){	// 时光网
		fromWanDaOrShgw(tmrwDate, platFormId, dataHTML, totalHTML, totalSeat, totalRate);

		// 延迟500毫秒执行
		setTimeout("setTmrwFilmRate()", 500);
	}
}

/**
 * 万达、时光网排期
 * */
 var temp_data = null, temp_rate = null;
function fromWanDaOrShgw(tmrwDate, platFormId, dataHTML, totalHTML, totalSeat, totalRate){
	server.loadDataFromWdShgw(tmrwDate, platFormId, function(callback){
		if(callback.ret){
			var data = callback.data, dataL = data.length;
			var rate = callback.rate;
			temp_data = data, temp_rate = rate;
			var trTitleObj = $("#trCntTblWdShg").find("#tmNewFilmTr");

			if(dataL > 0){
				trTitleObj.nextAll("tr").empty();
				var trBgClr = "";
				var highLight = "";

				for(var i = 0; i < dataL; i++){
					if (rate[i]*100 >= 1){	// 保留占比1%以上的数据
						totalSeat += data[i].totalTimesCount;

						if (rate[i]*100 > 30)	// 占比超过30，高亮显示
							highLight = "style='font-weight: bold; color: #FFFFFF; background: url(/schedule/images/icon-1.png) no-repeat 0 50%; padding-left: 14px;'";
						else
							highLight = "";
						
						var rateV = (rate[i]*100).toFixed(2);
						totalRate += rateV*1;
						// if(rateV.indexOf(".") != -1){
						// 	var tempR = rateV.split(".");
						// 	if(tempR[1].length > 2)
						// 		rateV = tempR[0] +"." + tempR[1].substring(0, 2);
						// }
						
						if (i % 2 == 0)
							trBgClr = " show-list-tbl-data-odd";
						else
							trBgClr = " show-list-tbl-data-even";
						dataHTML += "<tr class='show-list-tbl-data" + trBgClr + "'>"
										+"<td>&nbsp;</td>"
										+"<td height='30'" + highLight + ">" + (i+1) + "</td>"
										+"<td>" + data[i].filmName + "</td>"
		        						+"<td>" + rateV + "%</td>"
		        						// +"<td width='55%'>" + data[i].filmName + "</td>"
		        						// +"<td width='16%'>" + data[i].totalTimesCount + "</td>"
		        						// +"<td width='18%'>" + rateV + "%</td>"
	        						+"</tr>";
					}
				}

				trTitleObj.after(dataHTML);

				// 占比总计
				var table = $("#trCntTblWdShg");
				totalRate += "";
				if(totalRate.indexOf(".") != -1){
					var tempTotalR = totalRate.split(".");
					if(tempTotalR[0]*1 == 100)
						totalRate = tempTotalR[0];
					if(tempTotalR[0]*1 < 100){
						if(tempTotalR[1].length > 2)
							totalRate = tempTotalR[0] + "." + tempTotalR[1].substring(0, 2);
					}
				}

				if(dataL % 2 == 0) {
					trBgClr = " show-list-tbl-data-odd";
				}else {
					trBgClr = " show-list-tbl-data-even";
				}

				totalRate += "%";
				totalHTML = "<tr class='show-list-tbl-data" + trBgClr + "'><td>&nbsp;</td><td colspan='2'><B>总计</B></td><td>" + totalRate + "</td></tr>";
				table.append(totalHTML);
			}else {
				var noTrBgClr = " show-list-tbl-data-odd";
				dataHTML = "<tr class='show-list-tbl-data" + noTrBgClr + "'><td colspan='4' align='center'><B>暂无数据</B></td></tr>";
				trTitleObj.after(dataHTML);
			}
		}else{
			
		}
	});
}

/**
 * 加载票房的数据
 *
 * @param fromWhere 数据源流(0: 当日, 1: 本周)
 * 
 * @return
 * */
function loadBoxOfficeForPlanList(fromWhere){
	var cinemaId = getCookie("cinemaId");
	var curDate = getCurDate();
	var dataHTML = "";
	var totalHTML = "";
	var totalSeat = 0;
	var totalRate = 0;
	var totalTicketCount = 0;
	var totalTicketRate = 0;
	var totalAvg = 0;
	
	if(cinemaId.trim() != ""){
		$(".trCntFromSelf").find("li").find("a").attr("class", "");

		if(fromWhere == 0){
			$(".trCntFromSelf").find("li:eq(0)").find("a").addClass("today-menu-act");
			loadTodayBoxOffice(cinemaId, curDate, dataHTML, totalHTML, totalSeat, totalRate, totalTicketCount, totalTicketRate, totalAvg);

			$(".trCntFromSelf").find("li:eq(0)").find("a:eq(0)").removeAttr("onclick");
			$(".trCntFromSelf").find("li:eq(1)").find("a:eq(0)").attr("onclick", "loadBoxOfficeForPlanList(1);");
		}
			
		if(fromWhere == 1){
			$(".trCntFromSelf").find("li:eq(1)").find("a").addClass("week-menu-act");
			$(".trCntFromSelf").find("li:eq(0)").find("a").addClass("today-menu-normal");

			loadWeekBoxOffice(cinemaId, curDate, dataHTML, totalHTML, totalSeat, totalRate, totalTicketCount, totalTicketRate, totalAvg);

			$(".trCntFromSelf").find("li:eq(1)").find("a:eq(0)").removeAttr("onclick");
			$(".trCntFromSelf").find("li:eq(0)").find("a:eq(0)").attr("onclick", "loadBoxOfficeForPlanList(0);");
		}
	}else{
		var noTrBgClr = " show-list-tbl-data-odd";
		totalHTML = "<tr><td colspan='2' class='th-idt td-line'><B>总计</B></td><td>" + totalSeat + "</td><td>" + totalRate + "</td></tr>";
		dataHTML = "<tr class='show-list-tbl-data" + noTrBgClr + "'><td colspan='6' class='th-idt td-line' align='center'><B>暂无数据</B></td></tr>";
		$("#trCntTblSelf").find("#trCntTblSelfTr").nextAll("tr").remove();
		$("#trCntTblSelf").find("#trCntTblSelfTr").after(dataHTML);
		
		tipMsg_Single('planlist_model', 0, "登录状态已过期，请重新登录", 0, '', '');
		// setTimeout(function() {
		// 	window.location.href = "/schedule/login.html";
		// }, 500);
	}
}

/**
 * 加载当日票房
 * */
function loadTodayBoxOffice(cinemaId, curDate, dataTitle, dataHTML, totalHTML, totalSeat, totalRate, totalTicketCount, totalTicketRate, totalAvg){
	server.boxOfficeList(cinemaId, curDate, function(callback){
			if(callback.ret){
				var isEdit = callback.isEdit;
				var data = callback.data, dataL = data.length;
				$("#trCntTblSelf").find("#trCntTblSelfTr").nextAll("tr").remove();

				if(dataL > 0){
					var trBgClr = "";
					
					if(isEdit){	// 来自排期
						for(var i = 0; i < data.length; i++){
							totalSeat += data[i].sessionCount;
						}
					}else	// 来自明细
						totalSeat = callback.totalSessionCount;
					
					for(var i = 0; i < dataL; i++){
						totalRate += (data[i].sessionRate)*100;
						
						var rateV = (data[i].sessionRate)*100+"";
						if(rateV.indexOf(".") != -1){
							var tempR = rateV.split(".");
							if(tempR[1].length > 2)
								rateV = tempR[0] +"." + tempR[1].substring(0, 2);
						}
						
						var ticketCount = data[i].ticketCount == undefined ? "" : data[i].ticketCount;
						var ticketRate = data[i].ticketRate == undefined ? "" : data[i].ticketRate*100+"";
						var avgSessionCount = data[i].avgSessionCount == undefined ? "" : data[i].avgSessionCount;

						if(ticketRate.indexOf(".") != -1){
							var tempR2 = ticketRate.split(".");
							if(tempR2[1].length > 2)
								ticketRate = tempR2[0] +"." + tempR2[1].substring(0, 2);
						}
						ticketRate = ticketRate == "" ? "" : ticketRate + "%";
						totalTicketCount += ticketCount*1;
						totalTicketRate += (ticketRate.replace(/%/g, ""))*1;
						totalAvg += avgSessionCount*1;
						totalTicketCount = totalTicketCount == 0 || totalTicketCount == "" ? "" : totalTicketCount;
						totalTicketRate = totalTicketRate == 0 || totalTicketRate == "" ? "" : totalTicketRate;
						totalAvg = totalAvg == 0 || totalAvg == "" ? "" : totalAvg;
						
						if (i % 2 == 0)
							trBgClr = " show-list-tbl-data-odd";
						else
							trBgClr = " show-list-tbl-data-even";
						dataHTML += "<tr class='show-list-tbl-data" + trBgClr + "'>"
										+"<td title='" + data[i].filmName + "' class='th-idt td-line'>" + data[i].filmName + "</td>"
										+"<td>" + data[i].sessionCount + "</td>"
										+"<td>" + rateV + "%</td>"
										+"<td>" + ticketCount + "</td>"
										+"<td>" + ticketRate + "</td>"
										+"<td>" + avgSessionCount + "</td>"
									+"</tr>";
					}

					$("#trCntTblSelf").find("#trCntTblSelfTr").after(dataHTML);
					
					if(totalRate*1 > 100){
						totalRate = "";
					}else{
						totalRate += "%";
					}

					if(totalTicketRate*1 > 100){
						totalTicketRate = "";
					}else{
						if(totalTicketRate != "")
							totalTicketRate += "%";
					}
					
					if(isNaN(totalAvg)) {
						totalAvg = "";
					}
					
					if(dataL % 2 == 0) {
						trBgClr = " show-list-tbl-data-odd";
					}else {
						trBgClr = " show-list-tbl-data-even";
					}

					totalHTML = "<tr class='show-list-tbl-data" + trBgClr + "'><td class='th-idt td-line'><B>总计</B></td>"
									+"<td>" + totalSeat + "</td>"
									+"<td>" + totalRate + "</td>"
									+"<td>" + totalTicketCount + "</td>"
									+"<td>" + totalTicketRate + "</td>"
									+"<td>" + totalAvg + "</td>"
								+"</tr>";

					$("#trCntTblSelf").append(totalHTML);
				}else{
					var noTrBgClr = " show-list-tbl-data-odd";
					dataHTML = "<tr><td class='show-list-tbl-data" + noTrBgClr + "' colspan='6' align='center'><B>暂无数据</B></td></tr>";
					$("#trCntTblSelf").find("#trCntTblSelfTr").after(dataHTML);
				}				
			}else{
				tipMsg_Single('planlist_model', 0, "无效的请求，请联系管理员", 0, '', '');
			}
		});
}

/**
 * 加载本周票房
 * */
function loadWeekBoxOffice(cinemaId, curDate, dataTitle, dataHTML, totalHTML, totalSeat, totalRate, totalTicketCount, totalTicketRate, totalAvg){
	tipMsg_Single('planlist_model', 0, "暂无数据......等待接口", 0, '', '');
}

/**
 * 明日新片提醒列表
 * */
var filmListFtData = [];	// 影片列表接口数据
function loadTmrwNewFilmList(){
	var tmrwDate = SetDateStr(1, '');
	var filmList = "";
	var noFilm = "<li class='new-film-list-li'>"
					+ "<div class='new-film-top'></div>"
					+ "<div class='new-film-data-null fs13 clr7'>暂无记录</div>"
					+ "<div class='new-film-btm'></div>"
				+ "</li>"
				+ "<div class='clean'></div>";
	
	server.getFilmListByTime(function(callback){
		if(callback.ret){
			var data = callback.data;
			filmListFtData = data;
			var tmrwFilmNum = 0;	// 明日新片数量

			if(data.length > 0){
				for(var i = 0; i < data.length; i++){
					var theDate = data[i].releaseDate;
					var fType = data[i].type == "undefined" || data[i].type == undefined ? " " : data[i].type;
					if(theDate == tmrwDate){
						filmList += "<li class='new-film-list-li' value='" + data[i].id + "' title='" + data[i].filmName + " " + fType + " " + data[i].filmRunningTime + "分钟'>"
									+ "<div class='new-film-top'></div>"
									+ "<div class='new-film-data fs13 clr7'>"
										+ "<div class='new-film-data-no'>" + (i+1) + ".</div>"
										+ "<div class='new-film-data-option'>"
											+ "<p class='new-film-data-p new-film-data-name'>" + data[i].filmName + "</p>"
											+ "<p class='new-film-data-p'>影片时长：<span class='new-film-data-time'>" + rowPieceMg._nullHandler(data[i].filmRunningTime) + "</span>分钟</p>"
										+ "</div>"
										+ "<div class='new-film-data-per'></div>"
										+ "<div class='clean'></div>"
									+ "</div>"
									+ "<div class='new-film-btm'></div>"
								+ "</li>";
						tmrwFilmNum++;
					}
				}
				filmList += "<div class='clean'></div>";
			}else
				filmList = "";

			filmList = tmrwFilmNum == 0 ? noFilm : filmList;

			// setTimeout("addScriptForScroll(\"" + filmList + "\")", 1000);	// 延迟加载避免报错
			addScriptForScroll(filmList);
		}else{
			
		}
	});
}

/**
* 保证数据成功加载
*
* @param filmList 影片列表
* */
function addScriptForScroll(filmList){
	$("#tmrwFilmBox").find("ul").html(filmList);
}

/**
* 根据影片编码确定影片类型
*
* @param filmId 影片ID
* @param filmCode 影片编码(保证参数不为空)
*
* @return 影片类型名称(String)
**/
function getFilmTypeByFilmCode(filmId, filmCode) {
	var dataL = filmListFtData.length, filmCodeType = null, filmCodeTypeL;
	var film_type = "";

	if(dataL > 0) {
		for(var i = 0; i < dataL; i++) {
			if(filmListFtData[i].id == filmId) {
				if(filmListFtData[i].codeType != undefined) {
					filmCodeType = filmListFtData[i].codeType;
					filmCodeTypeL = filmCodeType.length;
				}
				
				if(filmCodeType != null && filmCodeTypeL > 0) {
					// 多个类型
					for(var j = 0; j < filmCodeTypeL; j++) {
						if(filmCode == filmCodeType[j].code) {
							film_type = film_types_arrs[filmCodeType[j].type];
							break;
						}
					}
				}
				if(filmCodeType != null && filmCodeTypeL == 0) {
					// 一个类型
					film_type = film_types_arrs[filmCodeType[0].type];
				}
			}

			// 类型确定后，立即退出遍历
			if(film_type != "")break;
		}
	}

	return film_type;
}

/**
* 根据影片ID, 返回影片类型集合
* 数据格式:类型名称-类型编码
*
* @param filmId 影片ID
*
* @return 影片类型列表(Array)
**/
function getFilmTypeListByFilmID(filmId) {
	var dataL = filmListFtData.length, filmCodeType = null, filmCodeTypeL;
	var film_type_arr = null, type_option = "";

	if(dataL > 0) {
		for(var i = 0; i < dataL; i++) {
			if(filmListFtData[i].id == filmId) {
				film_type_arr = [];	// 初始化
				
				if(filmListFtData[i].codeType != undefined) {
					filmCodeType = filmListFtData[i].codeType;
					filmCodeTypeL = filmCodeType.length;
					for(var j = 0; j < filmCodeTypeL; j++) {
						type_option = film_types_arrs[filmCodeType[j].type] + "-" + filmCodeType[j].code;
						film_type_arr[j] = type_option;
					}
				}else {
					film_type_arr = null;
				}
			}else {
				// 影片不存在
				film_type_arr = null;
			}

			if(film_type_arr != null)break;
		}
	}

	return film_type_arr;
}

/**
* 设置影片类型下拉列表
*
* @param typeCode 类型编码集合
*
* @return 列表HTML
**/
function createTypeListHtmlForEditFilm(typeCode) {
	var filmType = $("#temp_film_type").val();
	var slt_html_start = "<select class='slt-tc'>", slt_html_end = "</select>", slt_html = "", slt_html_list = "", slt_status = "";

	if(typeCode != null) {
		var temp_arr = [], tcL = typeCode.length;
		
		for (var j = 0; j < tcL; j++) {
			temp_arr = typeCode[j].split("-");

			if(filmType != "") {
				// 影片列表有类型
				if(filmType == temp_arr[0]) {
					slt_status = " selected='selected'";
				}else {
					slt_status = "";
				}
			}else {
				// 影片列表无类型
				if(j == 0) {
					slt_status = " selected='selected'";
				}else {
					slt_status = "";
				}
			}
			
			slt_html += "<option value='" + temp_arr[1] + "'" + slt_status + ">" + temp_arr[0] + "</option>";
		}
	}else {
		slt_html += "<option value='' selected='selected'>暂无类型</option>";
	}
	slt_html_list = slt_html_start + slt_html + slt_html_end;

	return slt_html_list;
}

/**
* 设置影片语种下拉列表
*
* @param langId 语种Id
* @param langValue 语言值
*
* @return 列表HTML
**/
function createFilmLangList(langId, langValue) {
	var langL = film_lang_arrs.length;
	var slt_html_start = "<select class='slt-lg' style='width: 60px;'>", slt_html_end = "</select>", slt_html = "", slt_html_list = "", slt_status = "";
	
	// 根据语言ID设置
	if(langId != "") {
		for(var i = 1; i < langL; i++) {
			if(langId == i) {
				slt_status = " selected='selected'";
			}else {
				slt_status = "";
			}

			slt_html += "<option value='" + i + "'" + slt_status + ">" + film_lang_arrs[i] + "</option>";
		}
	}

	// 根据语言值设置
	if(langValue != "") {
		for(var i = 1; i < langL; i++) {
			if(langValue == film_lang_arrs[i]) {
				slt_status = " selected='selected'";
			}else {
				slt_status = "";
			}

			slt_html += "<option value='" + i + "'" + slt_status + ">" + film_lang_arrs[i] + "</option>";
		}
	}
	
	slt_html_list = slt_html_start + slt_html + slt_html_end;

	return slt_html_list;
}

/**
* 设置明日新片百分比
*
* @param dataObj 影片数据
* @param rateObj 影片百分比
**/
function setTmrwFilmRate(dataObj, rateObj) {
	var temp_data_l = temp_data.length, temp_rate_l = temp_rate.length;
	var tmrwFilmObj = $("#tmrwFilmBox").find("ul li");
	var tmrwFilmObjL = tmrwFilmObj.length, temp_film_name = null, temp_film_title = null, _flag = false;
	
	for(var i = 0; i < tmrwFilmObjL; i++) {
		temp_film_name = $(tmrwFilmObj[i]).find("b").text();
		temp_film_title = $(tmrwFilmObj[i]).attr("title");

		for(var j = 0; j < temp_data_l; j++) {
			if(temp_data[j].filmName == temp_film_name) {
				var temp_film_rate = (temp_rate[j]*100).toFixed(2) + "%";
				$(tmrwFilmObj[i]).find(".tmrw-film-rate").text(temp_film_rate);
				temp_film_title += " " + temp_film_rate;
				$(tmrwFilmObj[i]).attr("title", temp_film_title);
				_flag = true;
			}else {
				_flag = false;
			}

			if(_flag)break;
		}
	}
}

/**
* 为排片率(添加/编辑)影片列表面板设置百分比
**/
function setFilmPannelRate() {
	var temp_data_l = temp_data.length, temp_rate_l = temp_rate.length;
	var pannelFilmObj = $(".list-block-li");
	var pannelFilmObjL = pannelFilmObj.length, temp_film_name = null, _flag = false;

	// 为影片添加百分比值
	for(var i = 0; i < pannelFilmObjL; i++) {
		temp_film_name = $(pannelFilmObj[i]).find("label").text();

		for(var j = 0; j < temp_data_l; j++) {
			if(temp_data[j].filmName == temp_film_name) {
				$(pannelFilmObj[i]).addClass("rate-li");
				var temp_film_rate = (temp_rate[j]*100).toFixed(2) + "%";
				$(pannelFilmObj[i]).find("span").text(temp_film_rate);
				$(pannelFilmObj[i]).find("span").css({"color":"#ff3300", "padding-left":"5px"});
				_flag = true;
			}else {
				_flag = false;
			}

			if(_flag)break;
		}
	}

	// 将有百分比的影片置于列表前面
	var spLineHtml = "<hr style='border:1px dashed #ccc; clear: both; margin: 10px auto;' />";
	var rateFilmObj = $(".rate-li");	// 所有有百分比值的对象
	var rateFilmObjL = rateFilmObj.length, temp_rateli_html = "";
	for(var r = 0; r < rateFilmObjL; r++) {
		$(".list-block").find("ul").prepend($(rateFilmObj[r]));
	}

	$(".rate-li:last").after(spLineHtml);
}