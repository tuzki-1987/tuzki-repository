/**
 * 当日前五
 */

var editDelHTML = "";
var addHTML = "";
var noDataHTML = "<tr class='show-list-tbl-data'><td colspan='7'>暂无记录</td></tr>";
var noDataHTMLForDetail = "<tr class='show-list-tbl-data show-list-tbl-data-odd'><td colspan='5'>暂无记录</td></tr>";
var addByUserFlag = false;

/**
 * tab切换
 * 
 * @param tabIndex 当前tab索引
 * @param thisObj  当前tab对象
 * 
 * @return
 **/
function tabShow(tabIndex, thisObj){
	// loginStatus();
	$(".custom-menu").find("li").find("a").attr("class", "");
	
	if(tabIndex == 0){
		$(".top5-detail").hide();
		$(".person-set").show();
		$(thisObj).addClass("today-menu-act");

		dataSourceOfUserOper();
		
		$(".custom-menu").find("li:eq(" + tabIndex + ")").find("a").removeAttr("onclick");	// 当前模块移除点击事件
		$(".custom-menu").find("li:eq(1)").find("a").attr("onclick", "tabShow(1, this);");	// 其他模块恢复点击事件
	}
	if(tabIndex == 1){	// 前五明细
		$(".person-set").hide();
		$(".top5-detail").show();
		$(".custom-menu").find("li:eq(1)").find("a").addClass("week-menu-act");
		$(".custom-menu").find("li:eq(0)").find("a").addClass("today-menu-normal");
		
		loadTopFiveByDetail();
		
		$(".custom-menu").find("li:eq(" + tabIndex + ")").find("a").removeAttr("onclick");	// 当前模块移除点击事件
		$(".custom-menu").find("li:eq(0)").find("a").attr("onclick", "tabShow(0, this);");	// 其他模块恢复点击事件
	}
	// $("#topFiveArea").find("div.topFiveDiv:eq(" + tabIndex + ")").show();
}

/**
 * 手动设置选项卡的内容来源（用户添加、来自排期）
 * */
function dataSourceOfUserOper(){
	var cinemaId = getCookie("cinemaId");
	var curDate = getCurDate();

	server.viewByFilmName(cinemaId, curDate, function(callback) {
		if(callback){
			if(callback.ret){
				var data = callback.data;
				if(data.length > 0){	// 来自排期
					editDelHTML = "<input type='button' value='修 改' onclick=\"editTopFive('topFiveTblForSch');\" disabled='disabled' class='btn-edit' /><input type='button' value='删 除' onclick=\"startDel('fromSch');\" class='btn-delete' />";
					addHTML = "<a href='javascript:;' id='schCanDo' class='appendSelf' onclick=\"createByUserSelf('fromSch');\">手动添加</a><a href='javascript:;' id='schCantDo' class='unAppendSelf' onclick='unCreateOper(this.id);'>手动添加</a>";

					$("#userOperBtn").empty().html(addHTML + editDelHTML);
					loadTopFiveBySch();
				}else{	// 手动添加
					editDelHTML = "<input type='button' value='修 改' onclick=\"editTopFive('topFiveTbl');\" disabled='disabled' class='btn-edit' /><input type='button' value='删 除' onclick=\"startDel('fromUser');\" class='btn-delete' />";
					addHTML = "<a href='javascript:;' id='userCanDo' class='appendSelf' onclick=\"createByUserSelf('fromUser');\">手动添加</a><a href='javascript:;' id='userCantDo' class='unAppendSelf' onclick='unCreateOper(this.id);'>手动添加</a>";

					$("#userOperBtn").empty().html(addHTML + editDelHTML);
				}
			}else
				tipMsg_Single("cinemaID", 0, "请求出现了异常......:(", 0, '', '');
		}else
			tipMsg_Single("cinemaID", 0, "请求失败，请稍后重试", 0, '', '');
	});
	
	setTimeout(function() {
		loadHallList(cinemaId);
		loadFilmList();
	}, 500);
}

/**
 * 手动添加
 * 
 * @param eventModel 事件对象
 * @return 
 * */
function createByUserSelf(eventModel){
	// loginStatus();
	$(".person-set").find("table").hide();

	var tblObj = "";
	var lineNums = "";
	var lineIndex = 0;
	var lineTr = "";
	var topFiveRank = "";
	var topFiveHallName = "";
	var topFiveFilmName = "";
	var topFiveFilmTime = "";
	var topFiveTicketTotal = "";
	var totalInput = "";
	var saveBtn = "";
	var canDo = "";
	var trHtmlStart = "", trHtmlEnd = "</tr>", trClassName = "";
	
	if(eventModel == "fromUser"){
		tblObj = "topFiveTbl";
		lineTr = "lineTr_";
		topFiveRank = "topFiveRank_";
		topFiveHallName = "topFiveHallName_";
		topFiveFilmName = "topFiveFilmName_";
		topFiveFilmTime = "topFiveFilmTime_";
		topFiveTicketTotal = "topFiveTicketTotal_";
		totalInput = "topFiveTotalInput_";
		saveBtn = "topFiveSaveBtn_";
		canDo = "userCanDo";
		addByUserFlag = true;
	}
	if(eventModel == "fromSch"){
		tblObj = "topFiveTblForSch";
		lineTr = "lineSchTr_";
		topFiveRank = "topFiveSchRank_";
		topFiveHallName = "topFiveSchHallName_";
		topFiveFilmName = "topFiveSchFilmName_";
		topFiveFilmTime = "topFiveSchFilmTime_";
		topFiveTicketTotal = "topFiveSchTicketTotal_";
		totalInput = "topFiveSchTotalInput_";
		saveBtn = "topFiveSchSaveBtn_";
		canDo = "schCanDo";
	}
	
	$("#" + tblObj).show();
	lineNums = $("#" + tblObj).find("tr").length;
	lineIndex = lineNums - 1;

	if(lineIndex % 2 == 0) {
		trClassName = " show-list-tbl-data-odd";
	}else {
		trClassName = " show-list-tbl-data-even";
	}
	trHtmlStart = "<tr class='show-list-tbl-data" + trClassName + "'>";

	$("#" + tblObj).append(trHtmlStart + $("#insertTrHtml").find("tr:first").html() + trHtmlEnd);	// 添加行
	$("#" + tblObj).find("tr:last").attr("id", lineTr + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(0)").find("input:eq(1)").val(0);
	$("#" + tblObj).find("tr:last").find("td:eq(0)").find("input:eq(1)").attr("name", "curSaveFlag");
	$("#" + tblObj).find("tr:last").find("td:eq(1)").find("span").attr("id", topFiveRank + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(1)").find("span").text(lineIndex + 1);
	$("#" + tblObj).find("tr:last").find("td:eq(2)").find("select").attr("id", topFiveHallName + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(3)").find("select").attr("id", topFiveFilmName + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(4)").find("span").attr("id", topFiveFilmTime + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(5)").find("span").attr("id", topFiveTicketTotal + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(5)").find("input").attr("id", totalInput + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(6)").find("input").attr("id", saveBtn + lineIndex);
	$("#" + tblObj).find("tr:last").find("td:eq(6)").find("input").attr("onclick", "saveTopFiveFunc(this.id, '" + eventModel + "');");
	
	/*if(lineNums == 5)
		$(".appendSelf").hide();*/
	
	$("#" + canDo).hide();
	$(".unAppendSelf").css("display", "inline-block");
}

/**
 * 手动添加的列表（保存后加载已保存列表）
 * 
 * @param curIndex 当前操作的记录索引（第几条记录）
 * @return
 * */
function reloadByUserSelf(curIndex, eventModel){
	var cinemaId = getCookie("cinemaId");
	var reloadHTML = "";
	var colorValue = "";	// 前5的名次的颜色值
	var hallLists = $("#topFiveHallListCon").html();
	var hallSlted = "";
	var filmLists = $("#topFiveFilmListCon").html();
	var filmSlted = "";
	
	var tblObj = "";
	var lineTr = "";
	var topFiveRank = "";
	var topFiveHallName = "";
	var topFiveFilmName = "";
	var topFiveFilmTime = "";
	var topFiveTicketTotal = "";
	var topFiveSaveBtn = "";
	
	if(eventModel == "fromUser"){
		tblObj = "topFiveTbl";
		lineTr = "lineTr_";
		topFiveRank = "topFiveRank_";
		topFiveHallName = "topFiveHallName_";
		topFiveFilmName = "topFiveFilmName_";
		topFiveFilmTime = "topFiveFilmTime_";
		topFiveTicketTotal = "topFiveTicketTotal_";
		topFiveSaveBtn = "topFiveSaveBtn_";
	}
	if(eventModel == "fromSch"){
		tblObj = "topFiveTblForSch";
		lineTr = "lineSchTr_";
		topFiveRank = "topFiveSchRank_";
		topFiveHallName = "topFiveSchHallName_";
		topFiveFilmName = "topFiveSchFilmName_";
		topFiveFilmTime = "topFiveSchFilmTime_";
		topFiveTicketTotal = "topFiveSchTicketTotal_";
		topFiveSaveBtn = "topFiveSchSaveBtn_";
	}
	
	server.loadTopFive(cinemaId, function(callback){
		if(callback != null && callback != "" && callback != "null"){
			if(callback.ret){
				var data = callback.data, dataL = data.length, trLen = $("#" + tblObj).find("tr").length;
				var trClassName = "";

				if(data.length > 0){
					for(var i = 0; i < dataL; i++){
						if(i % 2 == 0 && (trLen - 1) % 2 == 0) {
							if(eventModel == "fromSch")
								trClassName = " show-list-tbl-data-odd";
							else
								trClassName = " show-list-tbl-data-even";
						}else {
							if(eventModel == "fromSch")
								trClassName = " show-list-tbl-data-even";
							else
								trClassName = " show-list-tbl-data-odd";
						}

						reloadHTML += "<tr id='" + lineTr + i +"' class='show-list-tbl-data" + trClassName + "'>"
										+"<td><input type='checkbox' name='ckBox' value='" + data[i].id + "' onclick=\"handleUserOper('" + eventModel + "', this.checked, this);\" /><input type='hidden' name='curSaveFlag' value='1' /></td>"
										+"<td>"
											+"<span id='" + topFiveRank + i + "' style='" + colorValue + "'>" + (i+1) + "</span>"
										+"</td>"
										+"<td>"
											+"<span value='" + data[i].hallId + "'>" + data[i].hallName + "</span>"
											+"<div class='slt-hall-option' style='display: none;'>" + hallLists + "</div>"
										+"</td>"
										+"<td>"
											+"<span value='" + data[i].filmId + "'>" + data[i].filmName + "</span>"
											+"<div class='slt-film-option' style='display: none;'>" + filmLists + "</div>"
										+"</td>"
										+"<td>"
											+"<span id='" + topFiveFilmTime + i + "'>" + data[i].showTime + "</span>"
											+"<div class='time_search user-set-date ml5' style='display: none;'>"
											+"<input type='text' size='20' value='" + data[i].showTime + "' id='createDate' class='Wdate topFiveFilmTime' onclick=\"WdatePicker({dateFmt:'HH:mm'});\" readonly='readonly' />"
											+"<input type='button' class='sh' />"
											+"</div>"
										+"</td>"
										+"<td>"
											+"<span id='" + topFiveTicketTotal + i + "'>" + data[i].totalTicketCount + "</span>"
											+"<input type='text' size='10' value='" + data[i].totalTicketCount + "' id='topFiveTotalInput_" + i + "' class='topFiveTicketTotal' onkeyup='checkNum(this.id, this.value, this);' style='display: none;' />"
										+"</td>"
										+"<td>"
											+"<input id='" + topFiveSaveBtn + i + "' type='button' value='保存' onclick=\"updateTopFiveFunc(this.id, '" + eventModel + "');\" disabled='disabled' class='btn-save' />"
										+"</td>"
									+"</tr>";
					}
					
					if(eventModel == "fromUser"){
						$("#" + tblObj).find("#topFiveTblTr").nextAll().remove();
						$("#" + tblObj).find("#topFiveTblTr").after(reloadHTML);
					}else{
						var titleSch = "<tr class='show-list-tbl-head titleTr'>"
											+"<td width='8%'><input type='checkbox' name='ckBoxAll' id='ckBoxAll' onclick=\"sltAllCkBox(this.checked, 'topFiveTblForSch');\" /></td>"
											+"<td width='8%'>名次</td>"
											+"<td width='18%'>厅名</td>"
											+"<td width='18%'>影片名称</td>"
											+"<td width='18%'>场次时间</td>"
											+"<td width='12%'>人次数</td>"
											+"<td width='18%'>操作</td>"
										+"</tr>";
						
						// 将排期列表中未保存的数据，与查询接口返回的列表重新拼接
						var unSaveTr = $("input[name='curSaveFlag']");
						var unSaveTrHTML = "";
						for(var n = 0; n < unSaveTr.length; n++){
							if(n % 2 == 0) {
								trClassName = " show-list-tbl-data-odd";
							}else {
								trClassName = " show-list-tbl-data-even";
							}

							var tempValue = $(unSaveTr[n]).val();
							if(tempValue*1 == 0){
								var theTrId = $(unSaveTr[n]).parent("td").parent("tr").attr("id");
								unSaveTrHTML += "<tr id='" + theTrId + "' class='show-list-tbl-data" + trClassName + "'>" + $("#" + theTrId).html() + "</tr>";
							}
						}
						
						$("#" + tblObj).empty().append(titleSch + unSaveTrHTML + reloadHTML);
						// $(".topFiveOper").show();
						checkLine(eventModel);
					}		
				}else
					$("#topFiveTbl").append(noDataHTMLForDetail);
			}
		}
	});
}

/**
 * 加载排期前五
 * */
function loadTopFiveBySch(){
	var cinemaId = getCookie("cinemaId");
	var curDate = getCurDate();
//	var curDate = "2015-04-18";
	var hallId = "";
	var hallName = "";
	var sltHallOptionHTML = "";		// 影厅列表HTML
	var sltHallOptionSelectedFlag = "";	// 影厅列表选项与影厅名对应的选中标识
	var sltFilmOptionHTML = "";		// 影片列表HTML
	var sltFilmOptionSelectedFlag = "";	// 影片列表选项与影片名对应的选中标识
	var showTimeList = "";		// 影片场次时间列表
	var topFiveBySchHTML = "";	// 每行记录HTML
	
	server.viewByFilmName(cinemaId, curDate, function(callback){
		if(callback.ret){
			var data = callback.data, dataL = data.length;
			var trClassName = "";
			$("#topFiveTblForSchTr").nextAll().remove();

			if(dataL > 0){
				for(var i = 0; i < dataL; i++){

					if(i % 2 == 0) {
						trClassName = " show-list-tbl-data-odd";
					}else {
						trClassName = " show-list-tbl-data-even";
					}
					
					/*var viewSch = data[i].viewSchedule;
					hallId = viewSch[0].id;
					hallName = viewSch[0].hallName;*/

					sltHallOptionHTML = $("#topFiveHallListCon").html();
					sltFilmOptionHTML = $("#topFiveFilmListCon").html();
					
					var getTimeArr = dealShowTimeList(data[i].viewSchedule);
					var quickSelTimeList = "['" + getTimeArr.join("','") + "']";
					
					topFiveBySchHTML += "<tr id='lineSchTr_" + i +"' class='show-list-tbl-data" + trClassName + "'>"
											+"<td>"
												+"<input type='checkbox' name='ckBox' onclick=\"handleUserOper('eventSch', this.checked, this);\" />"
												+"<input type='hidden' name='curSaveFlag' value='0' />"
											+"</td>"
											+"<td><span id='topFiveSchRank_" + i +"'>" + (i+1) + "</span></td>"
											+"<td>"
												+"<span value='" +hallId + "'>" + hallName + "</span>"
												+"<div class='slt-hall-option' style='display: none;'>" + sltHallOptionHTML + "</div>"
											+"</td>"
											+"<td>"
												+"<span value='" + data[i].filmId + "'>" + data[i].filmName + "</span>"
												+"<div class='slt-film-option' style='display: none;'>" + sltFilmOptionHTML + "</div>"
											+"</td>"
											+"<td>"
												+"<span id='topFiveSchFilmTime_" + i + "'>" + getTimeArr[0] + "</span>"
												+"<div class='time_search user-set-date ml5' style='display: none;'>"
												+"<input type='text' value='" + getTimeArr[0] +"' id='createDate' class='Wdate topFiveFilmTime' onclick=\"WdatePicker({dateFmt:'HH:mm', quickSel:" +quickSelTimeList + "});\" readonly='readonly' />"
												+"<input type='button' class='sh' />"
												+"</div>"
											+"</td>"
											+"<td>"
												+"<span id='topFiveSchTicketTotal_" + i + "'></span>"
												+"<input type='text' size='10' value='' id='totalSchInput_" + i + "' class='topFiveTicketTotal' onkeyup='checkNum(this.id, this.value, this);' style='display: none;' />"
											+"</td>"
											+"<td><input id='saveSchBtn_" + i + "' type='button' value='保存' onclick=\"saveTopFiveFunc(this.id, 'fromSch');\" disabled='disabled' class='btn-save' /></td>"
										+"</tr>";
				}
				
				$("#topFiveTblForSchTr").after(topFiveBySchHTML);
//				$("#topFiveSchHallName_0").empty().append(sltHallOptionHTML);
			}else
				$("#topFiveTblForSchTr").after(noDataHTML);
		}else{
			
		}
	});
}

/**
 * 加载明细前五
 * */
function loadTopFiveByDetail(){
	var cinemaId = getCookie("cinemaId");
	var detailTopFiveHTML = "";
	var colorValue = "";	// 前5的名次的颜色值
	var trClassName = "";
	
	server.loadTopFive(cinemaId, function(callback){
		if(callback != null && callback != "" && callback != "null"){
			if(callback.ret){
				var data = callback.data, dataL = data.length;
				$("#top5DetailTblTr").nextAll().remove();

				if(dataL > 0){
					for(var i = 0; i < data.length; i++){
						if(i % 2 == 0) {
							trClassName = " show-list-tbl-data-odd";
						}else {
							trClassName = " show-list-tbl-data-even";
						}

						if(i < 5){
							switch(i){
								case 0:
									colorValue = "color: #DD002C; font-weight: bold;";
									break;
								case 1:
									colorValue = "color: #FF0030; font-weight: bold;";
									break;
								case 2:
									colorValue = "color: #FF4469; font-weight: bold;";
									break;
								case 3:
									colorValue = "color: #FF6685; font-weight: bold;";
									break;
								case 4:
									colorValue = "color: #FF88A0; font-weight: bold;";
									break;
							}
						}else
							colorValue = "";
						
						detailTopFiveHTML += "<tr class='show-list-tbl-data" + trClassName + "'>"
												+"<td><span style='" + colorValue + "'>" + (i+1) + "</span></td>"
												+"<td><span value='" + data[i].hallId + "'>" + data[i].hallName + "</span></td>"
												+"<td><span value='" + data[i].filmId + "'>" + data[i].filmName + "</span></td>"
												+"<td><span>" + data[i].showTime + "</span></td>"
												+"<td><span>" + data[i].totalTicketCount + "</span></td>"
											+"</tr>";
					}
					$("#top5DetailTblTr").after(detailTopFiveHTML);
				}else
					$("#top5DetailTblTr").after(noDataHTMLForDetail);
			}
		}
	});
}

/**
 * 处理影片场次时间列表
 * 
 * @param viewSchedule 影片关联的影厅、场次时间信息的对象
 * @return Array
 * */
function dealShowTimeList(viewSchedule){
	var objLength = viewSchedule.length;
	var showTimeArr = [];	// 场次时间列表数组
	
	if(objLength == 1){
		var timeObj = viewSchedule[0].viewTags;
//		if(timeObj.split(",")){
		if(timeObj.indexOf(",") != -1){
			var tempArr = timeObj.split(",");
			for(var i = 0; i < tempArr.length; i++){
				var tempTime = tempArr[i].substring(0, tempArr[i].indexOf("-"));
				showTimeArr[i] = tempTime.trim();
			}
		}else{
			var singleTime = timeObj.substring(0, timeObj.indexOf("-"));
			showTimeArr[0] = singleTime.trim();
		}
	}else{
		/**
		 * 保证showTimeArr数据准确性、连续性的起始下标
		 * */
		var consecutiveIndex = 0;
		for(var j = 0; j < objLength; j++){
			var timesObj = viewSchedule[j].viewTags;
//			if(timesObj.split(",")){
			if(timesObj.indexOf(",") != -1){
				var tempArrs = timesObj.split(",");
				var tempArrsLength = tempArrs.length;
				consecutiveIndex = showTimeArr.length == 0 ? j*tempArrsLength : showTimeArr.length;
				for(var t = 0; t < tempArrsLength; t++){
					var tempTimes = tempArrs[t].substring(0, tempArrs[t].indexOf("-"));
					showTimeArr[t + consecutiveIndex] = tempTimes.trim();	// 防止外层遍历，冲刷showTimeArr里的数据
				}
			}else{
				var singleTime = timesObj.substring(0, timesObj.indexOf("-"));
				if(showTimeArr.length == 0)
					showTimeArr[0] = singleTime.trim();
				else
					showTimeArr[showTimeArr.length] = singleTime.trim();	// 保证数组的连续性、准确性
			}
		}
	}
	
	return showTimeArr;
}

/**
 * 保存
 * 
 * @param thisId 保存按钮的ID
 * @param eventModel 来自哪个模块
 * 
 * @return
 * */
function saveTopFiveFunc(thisId, eventModel){
	// loginStatus();
	var cinemaId = getCookie("cinemaId");
	var lineTr = "";
	var topFiveHallName = "";
	var topFiveFilmName = "";
	var topFiveFilmTime = "";
	var topFiveTicketTotal = "";
	var canDo = "";
	
	if(eventModel == "fromUser"){
		lineTr = "lineTr_";
		topFiveHallName = "topFiveHallName_";
		topFiveFilmName = "topFiveFilmName_";
		topFiveFilmTime = "topFiveFilmTime_";
		topFiveTicketTotal = "topFiveTicketTotal_";
		canDo = "userCanDo";
	}
	if(eventModel == "fromSch"){
		lineTr = "lineSchTr_";
		topFiveHallName = "topFiveSchHallName_";
		topFiveFilmName = "topFiveSchFilmName_";
		topFiveFilmTime = "topFiveSchFilmTime_";
		topFiveTicketTotal = "topFiveSchTicketTotal_";
		canDo = "schCanDo";
	}
	
	var thisIdA = thisId.split("_");
	var sltHall = $("#saveHallId").val();
	var sltHallName = $("#saveHallName").val();
	var sltFilm = $("#saveFilmId").val();
	var sltFilmName = $("#saveFilmName").val();
	var filmTime = $("#" + topFiveFilmTime + thisIdA[1]).next("div").find("input#createDate").val();
	var ticketCount = $("#" + topFiveTicketTotal + thisIdA[1]).next("input").val();
	
	if(sltHall*1 == 0)
		tipMsg_Single(thisId, 0, "请选择影厅", 0, '', '');
	else if(sltFilm*1 == 0)
		tipMsg_Single(thisId, 0, "请选择影片", 0, '', '');
	else if(filmTime.trim() == "")
		tipMsg_Single(thisId, 0, "请选择场次时间", 0, '', '');
	else if(ticketCount.trim() == "" || ticketCount*1 == 0)
		tipMsg_Single(thisId, 0, "请填写观影人次数", 0, '', '');
	else{
		server.saveTopFive(cinemaId, sltHall, sltHallName, sltFilm, sltFilmName, filmTime, ticketCount, function(callback){
			if(callback.ret){
				tipMsg_Single(thisId, 0, "保存成功", 0, '', '');
				$("#" + canDo).css("display", "inline-block");
				$(".unAppendSelf").css("display", "none");
				flag = false;
				
				$("#" + topFiveHallName + thisIdA[1]).parent().parent().parent().parent().prev("span").attr("value", sltHall);
				$("#" + topFiveHallName + thisIdA[1]).parent().parent().parent().parent().prev("span").text(sltHallName).show();
				$("#" + topFiveFilmName + thisIdA[1]).parent().parent().parent().parent().prev("span").attr("value", sltFilm);
				$("#" + topFiveFilmName + thisIdA[1]).parent().parent().parent().parent().prev("span").text(sltFilmName).show();
				$("#" + topFiveFilmTime + thisIdA[1]).text(filmTime).show();
				$("#" + topFiveTicketTotal + thisIdA[1]).text(ticketCount).show();
				$("#" + topFiveHallName + thisIdA[1]).parent().parent().parent().parent().hide();
				$("#" + topFiveFilmName + thisIdA[1]).parent().parent().parent().parent().hide();
				$("#" + topFiveFilmTime + thisIdA[1]).next("div").hide();
				$("#" + topFiveTicketTotal + thisIdA[1]).next("input").hide();
				
				$("#" + lineTr + thisIdA[1]).find("td:eq(0)").find("input:eq(1)").val("1");	// 更新当前记录的保存状态为 : 1(已保存)
				$("#" + lineTr + thisIdA[1]).find("td:eq(0)").find("input:eq(0)").attr("checked", false);
				$("#"+thisId).attr("disabled", "disabled");
				$(".topFiveOper").find("input:eq(0)").attr("disabled", "disabled");
				
//				resetTopFiveRankByTicketTotal();
				if(eventModel == "fromUser")
					reloadByUserSelf(thisIdA[1], eventModel);
				if(eventModel == "fromSch"){
					$("#" + lineTr + thisIdA[1]).remove();
					reloadByUserSelf(thisIdA[1], eventModel);
				}
			}else{
				tipMsg_Single(thisId, 0, "保存失败", 0, '', '');
			}
		});
	}	
}

/**
 * 修改
 * 
 * @param eventObj 触发事件的对象ID
 * @return
 * */
function editTopFive(eventObj){
	// loginStatus();
	var canDo = "";
	if(eventObj == "topFiveTbl")
		canDo = "userCanDo";
	else
		canDo = "schCanDo";
	var ckedBoxArrayEdit = [];	// 选中的复选框数组
	var ckedBox = 0;	// 选中的个数
	var ckBox = $("#" + eventObj).find("input[name='ckBox']");
	for(var i = 0; i < ckBox.length; i++){
		if($(ckBox[i]).attr("checked") == "checked"){
			ckedBoxArrayEdit[ckedBox] = $(ckBox[i]).parent("td").parent("tr").attr("id");
			ckedBox++;
		}
	}
	
	if(ckedBox == 0)
		tipMsg_Single(eventObj, 0, "请先选择要修改的记录", 0, '', '');
	else if(ckedBox > 1){
		$(".topFiveOper").find("input:eq(0)").attr("disabled", "disabled");
		$("input[name='ckBox']").attr("checked", false);
		$("#ckBoxAll").attr("checked", false);
		tipMsg_Single(eventObj, 0, "请选择一条记录进行修改", 0, '', '');
	}else{
		$("#" + canDo).hide();
		$(".unAppendSelf").css("display", "inline-block");

		var curTr = ckedBoxArrayEdit[0];
		
		var curHallValue = $("#"+curTr).find("td:eq(2)").find("span:eq(0)").attr("value");	// 当前所选影厅的ID值
		var hallOptionObj = $("#"+curTr).find("td:eq(2)").find("div.time-box-sch").find("select").find("option");
		// 设置影厅选中项
		for(var h = 0; h < hallOptionObj.length; h++){
			var opVal = $(hallOptionObj[h]).attr("value");
			if(opVal*1 == curHallValue*1) {
				$(hallOptionObj[h]).attr("selected", "selected");
				$("#"+curTr).find("td:eq(2)").find("div.time-box-sch").find(".select_text_ui").text($(hallOptionObj[h]).text());
			}
		}
		$("#"+curTr).find("td:eq(2)").find("span:eq(0)").hide();
		$("#"+curTr).find("td:eq(2)").find("div").show();
		
		var curFilmValue = $("#"+curTr).find("td:eq(3)").find("span:eq(0)").attr("value");	// 当前所选影片的ID值
		var filmOptionObj = $("#"+curTr).find("td:eq(3)").find("div.time-box-sch").find("select").find("option");
		// 设置影片选中项
		for(var f = 0; f < filmOptionObj.length; f++){
			var opVal = $(filmOptionObj[f]).attr("value");
			if(opVal*1 == curFilmValue*1) {
				$(filmOptionObj[f]).attr("selected", "selected");
				$("#"+curTr).find("td:eq(3)").find("div.time-box-sch").find(".select_text_ui").text($(filmOptionObj[f]).text());
			}
		}
		$("#"+curTr).find("td:eq(3)").find("span:eq(0)").hide();
		$("#"+curTr).find("td:eq(3)").find("div").show();
		
		$("#"+curTr).find("td:eq(4)").find("span").hide();
		$("#"+curTr).find("td:eq(4)").find("div").show();
		
		$("#"+curTr).find("td:eq(5)").find("span").hide();
		$("#"+curTr).find("td:eq(5)").find("input").addClass("topFiveTicketTotal-normal");
		$("#"+curTr).find("td:eq(5)").find("input").show();
		
		$("#"+curTr).find("td:eq(6)").find("input").removeAttr("disabled");
	}
	
	leaveCofimInfo();
}

/**
 * 修改更新
 * 
 * @param thisId 当前按钮ID
 * @param eventModel 事件所属模块
 * @return 
 * */
function updateTopFiveFunc(thisId, eventModel){
	// loginStatus();
	var cinemaId = getCookie("cinemaId");
	var lineTr = "";
	var topFiveHallName = "";
	var topFiveFilmName = "";
	var topFiveFilmTime = "";
	var topFiveTicketTotal = "";
	var canDo = "";
	
	if(eventModel == "fromUser"){
		lineTr = "lineTr_";
		topFiveHallName = "topFiveHallName_";
		topFiveFilmName = "topFiveFilmName_";
		topFiveFilmTime = "topFiveFilmTime_";
		topFiveTicketTotal = "topFiveTicketTotal_";
		canDo = "userCanDo";
	}
	if(eventModel == "fromSch"){
		lineTr = "lineSchTr_";
		topFiveHallName = "topFiveSchHallName_";
		topFiveFilmName = "topFiveSchFilmName_";
		topFiveFilmTime = "topFiveSchFilmTime_";
		topFiveTicketTotal = "topFiveSchTicketTotal_";
		canDo = "schCanDo";
	}
		
	var thisIdA = thisId.split("_");
	var recordId = $("#" + lineTr + thisIdA[1]).find("input[name='ckBox']").val();
	var sltHall = $("#saveHallId").val();
	var sltHallName = $("#saveHallName").val();
	var sltFilm = $("#saveFilmId").val();
	var sltFilmName = $("#saveFilmName").val();
	var filmTime = $("#" + topFiveFilmTime + thisIdA[1]).next("div").find("input#createDate").val();
	var ticketCount = $("#" + topFiveTicketTotal + thisIdA[1]).next("input").val();
	
	if(sltHall*1 == 0)
		tipMsg_Single(thisId, 0, "请选择影厅", 0, '', '');
	else if(sltFilm*1 == 0)
		tipMsg_Single(thisId, 0, "请选择影片", 0, '', '');
	else if(filmTime.trim() == "")
		tipMsg_Single(thisId, 0, "请选择场次时间", 0, '', '');
	else if(ticketCount.trim() == "" || ticketCount*1 == 0)
		tipMsg_Single(thisId, 0, "请填写观影人次数", 0, '', '');
	else{
		server.updateTopFive(cinemaId, recordId, sltHall, sltHallName, sltFilm, sltFilmName, filmTime, ticketCount, function(callback){
			if(callback.ret){
				tipMsg_Single(thisId, 0, "修改成功", 0, '', '');
				$("#" + canDo).css("display", "inline-block");
				$(".unAppendSelf").css("display", "none");
				flag = false;
				
				$("#" + topFiveHallName + thisIdA[1]).prev("span").attr("value", sltHall);
				$("#" + topFiveHallName + thisIdA[1]).prev("span").text(sltHallName).show();
				$("#" + topFiveFilmName + thisIdA[1]).prev("span").attr("value", sltFilm);
				$("#" + topFiveFilmName + thisIdA[1]).prev("span").text(sltFilmName).show();
				$("#" + topFiveFilmTime + thisIdA[1]).text(filmTime).show();
				$("#" + topFiveTicketTotal + thisIdA[1]).text(ticketCount).show();
				$("#" + topFiveHallName + thisIdA[1]).hide();
				$("#" + topFiveFilmName + thisIdA[1]).hide();
				$("#" + topFiveFilmTime + thisIdA[1]).next("input").hide();
				$("#" + topFiveTicketTotal + thisIdA[1]).next("input").hide();
				
				$("#" + lineTr + thisIdA[1]).find("td:eq(0)").find("input:eq(1)").val("1");	// 更新当前记录的保存状态为 : 1(已保存)
				$("#" + lineTr + thisIdA[1]).find("td:eq(0)").find("input:eq(0)").attr("checked", false);
				$("#"+thisId).attr("disabled", "disabled");
				$(".topFiveOper").find("input:eq(0)").attr("disabled", "disabled");
				
//				resetTopFiveRankByTicketTotal();
				if(eventModel == "fromUser")
					reloadByUserSelf(thisIdA[1], eventModel);
				if(eventModel == "fromSch"){
					$("#" + lineTr + thisIdA[1]).remove();
					reloadByUserSelf(thisIdA[1], eventModel);
				}
			}else{
				tipMsg_Single(thisId, 0, "修改失败", 0, '', '');
			}
		});
	}
}

/**
 * 准备删除
 * 
 * @param fromModel 事件所属模块
 * */
function startDel(fromModel){
	// loginStatus();
	var tblObj = "";
	if(fromModel == "fromUser")
		tblObj = "topFiveTbl";
	if(fromModel == "fromSch")
		tblObj = "topFiveTblForSch";
	
	var ckedBoxArrayDel = [];	// 选中的复选框数组
	var ckedBox = 0;	// 选中的个数
	var ckBox = $("#" + tblObj).find("input[name='ckBox']");
	for(var i = 0; i < ckBox.length; i++){
		if($(ckBox[i]).attr("checked") == "checked"){
			ckedBoxArrayDel[ckedBox] = $(ckBox[i]).parent("td").parent("tr").attr("id");
			ckedBox++;
		}
	}
	if(ckedBox == 0)
		tipMsg_Single(tblObj, 0, "请先选择要删除的记录", 0, '', '');
	else
		tipMsg_UserOper(fromModel);
}

/**
 * 执行删除
 * 
 * @param param 用户的选择
 * @param model 事件所属模块
 * */
function IDoDecisionImpl(param, model){
	// loginStatus();
	var cinemaId = getCookie("cinemaId");
	var tblObj = "";
	if(model == "fromUser")
		tblObj = "topFiveTbl";
	if(model == "fromSch")
		tblObj = "topFiveTblForSch";
	
	if(param == "sure"){
		var ckedBoxArrayDel = [];	// 选中的复选框数组
		var ckedBox = 0;	// 选中的个数
		var ckBox = $("#" + tblObj).find("input[name='ckBox']");
		for(var i = 0; i < ckBox.length; i++){
			if($(ckBox[i]).attr("checked") == "checked"){
				ckedBoxArrayDel[ckedBox] = $(ckBox[i]).parent("td").parent("tr").attr("id");
				ckedBox++;
			}
		}
		if(ckedBox == 0)
			tipMsg_Single(tblObj, 0, "请先选择要删除的记录", 0, '', '');
		else if(ckedBox == 1){	// 删除一条
			var tblTrNums = $("#" + tblObj).find("tr").length;	// 当前所有行数量
			var curTR = ckedBoxArrayDel[0];
			var curTrIndex = $("#"+curTR).index();	// 当前第几条
			var curSaveFlag = $("#"+curTR).find("input[name='curSaveFlag']").attr("value");	// 当前记录的保存状态(0: 未保存, 1: 已保存)
			
			//if((curTrIndex+1) == tblTrNums){	// 删除的最后一条
				if(curSaveFlag*1 == 0){	// 非保存状态只移除行
					$("#"+curTR).remove();
					ckedBoxArrayDel = [];	// 清空数组
					checkLine(model);
					
					tipMsg_Single(tblObj, 0, "删除成功", 0, '', '');
				}else{
					var delId = $("#"+curTR).find("input[name='ckBox']").attr("value");
					server.delTopFive(cinemaId, delId, function(callback){
						if(callback.ret){
							$("#"+curTR).remove();
							ckedBoxArrayDel = [];	// 清空数组
							checkLine(model);
							
							tipMsg_Single(tblObj, 0, "删除成功", 0, '', '');
						}else
							tipMsg_Single(tblObj, 0, "删除失败", 0, '', '');
					});
				}
			/*}else{
				$("#"+curTR).remove();
				resetTopFiveRank();
				ckedBoxArrayDel = [];	// 清空数组
				checkLine(model);
				
				tipMsg_Single('topFiveTbl', 0, "删除成功", 0, '', '');
			}*/
		}else{	// 删除多条
			var delIds = "";
			var removeTrArr = [];
			var line = 0;
			for(var i = 0; i < ckedBox; i++){
				var tempFlag = $("#"+ckedBoxArrayDel[i]).find("input[name='curSaveFlag']").attr("value");
				if(tempFlag*1 == 0)
					$("#"+ckedBoxArrayDel[i]).remove();
				else{
					delIds += $("#"+ckedBoxArrayDel[i]).find("input[name='ckBox']").attr("value") + "-";
					$("#"+ckedBoxArrayDel[i]).remove();
					removeTrArr[line] = ckedBoxArrayDel[i];
					line++;
				}
			}
			
			// 批量删除
			if(delIds.indexOf("-") != -1){
				var delFlag = false;
				delIds = delIds.substring(0, delIds.length - 1);
				server.delTopFive(cinemaId, delIds, function(callback){
					if(callback.ret){
						tipMsg_Single(tblObj, 0, "删除成功", 0, '', '');
						
						delFlag = true;
					}else{
						delFlag = false;
						tipMsg_Single(tblObj, 0, "删除失败", 0, '', '');
					}
					
					/*if(delFlag){
						for(var j in removeTrArr){
							$("#"+removeTrArr[j-1]).remove();
						}
					}*/
				});
			}
			
			ckedBoxArrayDel = [];	// 清空数组
			checkLine(model);
		}
	}
}

/**
 * 删除完后的检查
 * 
 * @param model 事件所属模块
 * */
function checkLine(model){
	var tblObj = "";
	var lineTr_ID = "";
	var topFiveRank_ID = "";
	var topFiveHallName_ID = "";
	var topFiveFilmName_ID = "";
	var topFiveFilmTime_ID = "";
	var topFiveTicketTotal_ID = "";
	var totalInput_ID = "";
	var saveBtn_ID = "";
	var canDo = "";
	
	if(model == "fromUser"){
		tblObj = "topFiveTbl";
		lineTr_ID = "lineTr_";
		topFiveRank_ID = "topFiveRank_";
		topFiveHallName_ID = "topFiveHallName_";
		topFiveFilmName_ID = "topFiveFilmName_";
		topFiveFilmTime_ID = "topFiveFilmTime_";
		topFiveTicketTotal_ID = "topFiveTicketTotal_";
		totalInput_ID = "topFiveTotalInput_";
		saveBtn_ID = "topFiveSaveBtn_";
		canDo = "userCanDo";
	}
	if(model == "fromSch"){
		tblObj = "topFiveTblForSch";
		lineTr_ID = "lineSchTr_";
		topFiveRank_ID = "topFiveSchRank_";
		topFiveHallName_ID = "topFiveSchHallName_";
		topFiveFilmName_ID = "topFiveSchFilmName_";
		topFiveFilmTime_ID = "topFiveSchFilmTime_";
		topFiveTicketTotal_ID = "topFiveSchTicketTotal_";
		totalInput_ID = "topFiveSchTotalInput_";
		saveBtn_ID = "topFiveSchSaveBtn_";
		canDo = "schCanDo";
	}
		
	// 删除完后，检查所剩行数，小于1表示无记录
	var tblTrObj = $("#" + tblObj).find("tr");
	if(tblTrObj.length > 1){
		resetTopFiveRank(tblObj, lineTr_ID, topFiveRank_ID, topFiveHallName_ID, topFiveFilmName_ID, topFiveFilmTime_ID, topFiveTicketTotal_ID, totalInput_ID, saveBtn_ID);
	}else{
		$(".topFiveOper").hide();
		$("#ckBoxAll").attr("checked", false);
		
		$("#" + canDo).css("display", "inline-block");
		$(".unAppendSelf").css("display", "none");
	}
	$(".topFiveOper").find("input:eq(0)").attr("disabled", "disabled");
	if($(".appendSelf").css("display") == "none"){
		$(".appendSelf").css("display", "block");
		$(".unAppendSelf").css("display", "none");
	}
}

/**
 * 获取影片列表
 * */
function getFilmList(){
	var topFiveFilmNameHTML = "";
	server.getFilmListByTime(function(callback){
		if(callback.ret){
			var data = callback.data;
			if(data.length > 0){
				topFiveFilmNameHTML = "";
				for(var i = 0; i < data.length; i++){
					topFiveFilmNameHTML += "<option value='" + data[i].id + "'>" + data[i].filmName + "</option>";
				}
				topFiveFilmNameHTML = "<select><option value='0'>请选择影片</option>" +topFiveFilmNameHTML + "</select>";
				
				return topFiveFilmNameHTML;
			}else{
				topFiveFilmNameHTML = "<select><option value='0'>请选择影片</option><option value='-1'>暂无影片</option></select>";
			}
		}else{
			
		}
		return topFiveFilmNameHTML;
	});
	return topFiveFilmNameHTML;
}

/**
 * 重设名次序号及相关ID
 * */
function resetTopFiveRank(tblObj, lineTr_ID, topFiveRank_ID, topFiveHallName_ID, topFiveFilmName_ID, topFiveFilmTime_ID, topFiveTicketTotal_ID, totalInput_ID, saveBtn_ID){
	var tblTrObj = $("#" + tblObj).find("tr");
	
	if(tblTrObj.length > 0){
		for(var i = 1; i < tblTrObj.length; i++){
			$("#" + tblObj).find("tr:eq(" + i +")").attr("id", lineTr_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(1)").find("span").text(i);
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(1)").find("span").attr("id", topFiveRank_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(2)").find("span:eq(1)").attr("id", topFiveHallName_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(3)").find("span:eq(1)").attr("id", topFiveFilmName_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(4)").find("span").attr("id", topFiveFilmTime_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(5)").find("span").attr("id", topFiveTicketTotal_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(5)").find("input").attr("id", totalInput_ID+(i-1));
			$("#" + tblObj).find("tr:eq(" + i +")").find("td:eq(6)").find("input").attr("id", saveBtn_ID+(i-1));
		}
	}
}

/**
 * 对已保存的人次数(包括所属行)，重新排位
 * */
function resetTopFiveRankByTicketTotal(){
	var arrayIndex = 0;
	var saveLineArray = [];	// 人次数为已保存状态的数组
	var saveFlagObj = $("#topFiveTbl").find("input[name='curSaveFlag']");
	
	if(saveFlagObj.length > 1){	// 当前已添加多余2条
		for(var i = 0; i < saveFlagObj.length; i++){
			var temp = "";
			var trId = "";	// 当前行ID
			var tTotal = "";	// 当前行人次数
			var saveFlagVal = $(saveFlagObj[i]).val();
			if(saveFlagVal*1 == 1){
				trId = $(saveFlagObj[i]).parent("td").parent("tr").attr("id");
				tTotal = $(saveFlagObj[i]).parent("td").siblings("td:eq(4)").find("span").text();
				
				temp = tTotal + "-" + trId;
				saveLineArray[arrayIndex] = temp;
				arrayIndex++;
			}
		}
		
		// 对已排完序的行重排
		var resultArr = sortByArray(saveLineArray);
		if(resultArr.length > 0){
			var firstRank = resultArr[0].split("-");		// 已排好序的首记录
			$("#"+firstRank[1]).insertAfter(".titleTr");	// 将首记录放到标题之后
			for(var j = 1; j < resultArr.length; j++){
				var rankRecord = resultArr[j].split("-");	// 已排好序的当前记录
				var prevRecord = resultArr[j-1].split("-");	// 已排好序的当前的上条记录
				$("#"+rankRecord[1]).insertAfter("#"+prevRecord[1]);	// 根据排序, 重新依次排列
			}
			
			// 重排后, 重置相关值和ID
			resetTopFiveRank("lineTr_", "topFiveRank_", "topFiveHallName_", "topFiveFilmName_", "topFiveFilmTime_", "topFiveTicketTotal_", "topFiveTotalInput_", "topFiveSaveBtn_");
		}
	}
}

/**
 * 全部选中
 * 
 * @param thisCheck 当前复选框的状态
 * @param eventModel 事件所属模块
 * 
 * @return 
 * */
function sltAllCkBox(thisCheck, eventModel){
	var checkBoxes = $("#" + eventModel).find("input[name='ckBox']");
	if(thisCheck){
		for(var i = 0; i < checkBoxes.length; i++){
			$(checkBoxes[i]).attr("checked", thisCheck);
		}
		$("#userOperBtn").find("input:eq(0)").removeAttr("disabled");
	}else{
		for(var j = 0; j < checkBoxes.length; j++){
			$(checkBoxes[j]).attr("checked", thisCheck);
		}
		$("#userOperBtn").find("input:eq(0)").attr("disabled", "disabled");
	}
}

/**
 * 监听用户操作，决定是否开启“修改”按钮
 * 
 * @param eventModel 驱动事件的模块标识
 * @param thisCheck 当前复选框的状态
 * @param thisObj   当前对象
 * @return 
 * */
function handleUserOper(eventModel, thisCheck, thisObj){
	var eventObj = "";
	if(eventModel == "eventUser" || eventModel == "fromUser")
		eventObj = "topFiveTbl";
	if(eventModel == "eventSch" || eventModel == "fromSch")
		eventObj = "topFiveTblForSch";
	if(thisCheck){
		var curSaveFlag = $(thisObj).next().val();	// 当前记录的保存状态(0: 未保存, 1: 已保存)
		if(eventModel == "eventUser" || eventModel == "fromUser"){
			if(curSaveFlag*1 == 0)
				$("#userOperBtn").find("input:eq(0)").attr("disabled", "disabled");
			else
				$("#userOperBtn").find("input:eq(0)").removeAttr("disabled");
		}
		
		if(eventModel == "eventSch" || eventModel == "fromSch")
			$("#userOperBtn").find("input:eq(0)").removeAttr("disabled");
		
		/*if(eventModel == "eventUserReload")
			$(".topFiveOper").find("input:eq(0)").removeAttr("disabled");*/
	}else{
		$("#userOperBtn").find("input:eq(0)").attr("disabled", "disabled");
		if(!thisCheck)
			$("#ckBoxAll").attr("checked", false);
	}

	var checkBoxes = $("#" + eventObj).find("input[name='ckBox']");
	var sltBoxNum = 0;
	for(var j = 0; j < checkBoxes.length; j++){
		if ($(checkBoxes[j]).attr("checked")){
			sltBoxNum++;
		}
	}
	if (sltBoxNum > 0)
		$("#userOperBtn").find("input:eq(0)").removeAttr("disabled");
	if (sltBoxNum == 0)
		$("#userOperBtn").find("input:eq(0)").attr("disabled", "disabled");
}

/**
 * 不可使用手动添加
 * */
function unCreateOper(thisID){
	tipMsg_Single(thisID, 0, "请先保存当前记录后，再进行添加", 0, '', '');
}

function leaveCofimInfo(){
	flag = true;
}

/**
* 影片列表
**/
function loadFilmList() {
	server.getFilmListByTime(function(callback){
		if(callback.ret){
			var data = callback.data;
			if(data.length > 0){
				topFiveFilmNameHTML = "";
				for(var i = 0; i < data.length; i++){
					topFiveFilmNameHTML += "<option value='" + data[i].id + "' label='" + data[i].filmName + "'>" + data[i].filmName + "</option>";
				}
				topFiveFilmNameHTML = "<option value='' label=''>请选择影片</option>" +topFiveFilmNameHTML;
			}else{
				topFiveFilmNameHTML = "<option value='' label=''>请选择影片</option><option value='-1' label=''>暂无影片</option>";
			}
		}else{
			
		}
		$(".ps-film-list").empty().append(topFiveFilmNameHTML);
	});
}

/**
* 影厅列表
*
* @param cinemaId 影院ID
**/
function loadHallList(cinemaId) {
	server.filmHallInfo(cinemaId, function(callback){
		if(callback.ret){
			var data = callback.data;
			if(data.length > 0){
				topFiveHallNameHTML = "";
				for(var i = 0; i < data.length; i++){
					topFiveHallNameHTML += "<option value='" + data[i].id + "' label='" + data[i].hallName + "'>" + data[i].hallName + "</option>";
				}
				topFiveHallNameHTML = "<option value='' label=''>请选择影厅</option>" + topFiveHallNameHTML;
			}else{
				topFiveHallNameHTML = "<option value='' label=''>请选择影厅</option><option value='-1' label=''>暂无影厅</option>";
			}
		}else{
			
		}
		$(".ps-hall-list").empty().append(topFiveHallNameHTML);
	});
}

/**
* 影厅列表选中事件
**/
function handleHallSelect(obj) {
	var sltHallId = $(obj).find("option:selected").val();
	var sltHallName = $(obj).find("option:selected").text();
	$("#saveHallId").val(sltHallId);
	$("#saveHallName").val(sltHallName);
	$(obj).prev(".select_text_ui").text(sltHallName);
}

/**
* 影片列表选中事件
**/
function handleFilmSelect(obj) {
	var sltFilmId = $(obj).find("option:selected").val();
	var sltFilmName = $(obj).find("option:selected").text();
	$("#saveFilmId").val(sltFilmId);
	$("#saveFilmName").val(sltFilmName);
	$(obj).prev(".select_text_ui").text(sltFilmName);
}