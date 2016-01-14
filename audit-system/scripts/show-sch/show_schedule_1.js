var createSchDateInCookie = getCookie("jh_createSchDate");	// 获取生成排期时选择的日期值
var emptySchData = "";	// 是否有排期的标识，用于控制相关按钮操作
var widthMargin = [];
var crtLgnCinemaId;
var scheduledate, minStartTimePos;

function init(){
	showSdlHandler._colligateHandler();

	if(window.PIE) {
		$('.waitB').each(function() {
            PIE.attach(this);
        });
	}
}

var showSdlHandler = {
	_colligateHandler:function(){
		var crtLgnCinemaName = getCookie("jh_sdleLoginName");
		if (crtLgnCinemaName != "") {
			crtLgnCinemaId = cinemaObj.id;
			showSdlHandler._showInfoByScheduleDelay();
		} else {
			crtLgnCinemaId = "";
		}
		
		if(createSchDateInCookie != undefined && createSchDateInCookie != ""){
			$("#temptime").val(createSchDateInCookie);
			showSdlHandler._initQuickSearchStyle();
		}else{
			// 默认为明天
			$("#temptime").val($("#scheDateYet").text());
			$(".day-name-box-m").text("明天");
			$("#dayFlag").val(1);
		}
		
		$("#Wdate").val(dateObj.dateNowymd2());
		
		showSdlHandler._searchFilm();
		showSdlHandler._adjustEvent();
		showSdlHandler._downloadSche();
		showSdlHandler._getFilmRateFunc();
		showSdlHandler._getFilmTimeListFunc();
		showSdlHandler._closeFilmRate();
		showSdlHandler._closeFilmTimeList();
	},
	_initQuickSearchStyle:function() {
		// 初始化快速查询样式
		var zt = SetDateStr(-1, "");	// 昨天
		var jt = SetDateStr(0, "");		// 今天
		var mt = SetDateStr(1, "");		// 明天
		var ht = SetDateStr(2, "");		// 后天

		if(createSchDateInCookie == zt){
			$(".day-name-box-m").text("昨天");
			$("#dayFlag").val(-1);
		}else if(createSchDateInCookie == jt){
			$(".day-name-box-m").text("今天");
			$("#dayFlag").val(0);
		}else if(createSchDateInCookie == mt){
			$(".day-name-box-m").text("明天");
			$("#dayFlag").val(1);
		}else if(createSchDateInCookie == ht){
			$(".day-name-box-m").text("后天");
			$("#dayFlag").val(2);
		}else{

		}
	},
	_showInfoByScheduleDelay:function(){
		//排期列表展示
		var date;
		if(createSchDateInCookie != undefined && createSchDateInCookie != ""){
			date = createSchDateInCookie;
		}else{
			date = dateObj.dateNowymd2();
		}
		showSdlHandler._showInfoBySchedule(date);
		removeCookie("jh_createSchDate");	// 移除cookie中的生成排期时所选的日期值
	},
	_showInfoBySchedule:function(date){
		if (crtLgnCinemaId == "") {
			tipMsg_Single("searchFilm", 0, "无影院信息，无法查询", 0, '', '');
			return false;
		} else {
			var langId = "", filmCode = "";	// 语言、影片编号
			//排期展示列表信息
			server.rowDisplay(
				crtLgnCinemaId, 
				date, 
				langId, 
				filmCode, 
				function(callbackData){
					$(".table-left .table-mask").empty();
					$('.table-right').empty();
					if (callbackData.ret == true) {
						if(callbackData.data != "") {
							emptySchData = 1;	// 有排期

							for ( var i = 0; i < callbackData.data.length; i++) {
								var tableLeftMask = $(".table-left .table-mask");
								tableLeftMask.append("<div title='"+callbackData.data[i].hallName+"'>"+server._strHandler(callbackData.data[i].hallName, 3)+"</div>");
						
								var tableRightMask = $(".table-right");
								tableRightMask.append("<div id='tableRightSon"+callbackData.data[i].hallId+"'></div>");

								var viewScheduleResult = callbackData.data[i].viewSchedule;
								widthMargin = [];
								for ( var j = 0; j < viewScheduleResult.length; j++) {
									var filmWidth = showSdlHandler._timeWidthHandler(viewScheduleResult[j].showBeginTime, viewScheduleResult[j].showEndTime);
									var marginLeft = showSdlHandler._filmMgLfHandler(viewScheduleResult[j].showBeginTime);
							
									var elements = {};
									elements["beginTime"] = viewScheduleResult[j].showBeginTime;
									elements["befMarginLeft"] = filmWidth+marginLeft;
									widthMargin.push(elements);
							
									var marginLeftStr = null;
									if (j == 0) {
										marginLeftStr = marginLeft;
									} else if (j>0) {
										marginLeftStr = showSdlHandler._marginletfHandler(viewScheduleResult[j].showBeginTime, marginLeft, j);
									}
							
									$("#tableRightSon"+callbackData.data[i].hallId).append("<div id='' class='waitB lf btn-all-none btn-common btn-radius-all' title='"+viewScheduleResult[j].showBeginTime+" - "+viewScheduleResult[j].showEndTime+"\n"+viewScheduleResult[j].filmName+"' style='width:"+(filmWidth)+"px; margin-left:"+marginLeftStr+"px; float:left;overflow:hidden; cursor:pointer;'>" +
										"<p>"+viewScheduleResult[j].showBeginTime+" - "+viewScheduleResult[j].showEndTime+"</p>" +
										"<p>"+viewScheduleResult[j].filmName+"</p></div>");
								}

								// 为影片块添加颜色
								var countFilmResult = countGroupByFilmName(callbackData.data);	// 影片统计结果
								var film_color = selectColorForObj(countFilmResult, 0);	// 选颜色
								setFilmColorForShowSch(film_color);	// 设置颜色
							}

							// 此处何用?(忘记了)
							if (callbackData.data.length < 7) {
								var leg = 7 - callbackData.data.length;
								for ( var d = 0; d < leg; d++) {
									var tableLeftMask = $(".table-left .table-mask");
									tableLeftMask.append("<div></div>");
							
									var tableRightMask = $(".table-right");
									tableRightMask.append("<div id='tableRightSon"+i+"'></div>");
								}
							}

							// 动态设置排期展示区位置
							showSdlHandler._dynamicPositionViewArea();
						} else {
						 	emptySchData = 0;	// 没有排期
							for ( var i = 0; i < 8; i++) {
									var tableLeftMask = $(".table-left .table-mask");
									tableLeftMask.append("<div></div>");
							
									var tableRightMask = $(".table-right");
									tableRightMask.append("<div id='tableRightSon"+i+"'></div>");
							}

							tipMsg_Single("searchFilm", 0, "所查日期，暂无排期", 0, '', '');
						}		
					}
				});
		}
	},
	_marginletfHandler:function(beginTime, marginLeft2, j) {
		if (!marginLeft2)
			return ;
		for ( var i = 0; i < widthMargin.length; i++) {
			if(widthMargin[i].beginTime == beginTime) {
				return marginLeft2 - widthMargin[j-1].befMarginLeft;
			}
		}
	},
	_timeWidthHandler:function(startTime, endTime) {
		//23:44 - 02:30
		var startHours = Number(startTime.substring(0, startTime.indexOf(":")));
		var endHours = Number(endTime.substring(0, endTime.indexOf(":")));
		var startHoursNum = 0;
		var endHoursNum = 0;
		var hours = 0;
		if(startHours >= 7 && startHours <= 23){
			startHoursNum = startHours;
		} else if(startHours == 0){
			startHoursNum = 24;
		} else if(startHours > 0 && startHours <= 6){
			startHoursNum = 24+startHours;
		}
		
		if(endHours >= 7 && endHours <= 23){
			endHoursNum = endHours;
		} else if(endHours == 0){
			endHoursNum = 24;
		} else if(endHours > 0 && endHours <=6){
			endHoursNum = 24+endHours;
		}

		hours = endHoursNum - startHoursNum -1;

		var startSeconds = startTime.substring(startTime.indexOf(":")+1, startTime.length);
		var endSeconds = endTime.substring(endTime.indexOf(":")+1, endTime.length);
		
		var seconds = (60 - Number(startSeconds)) + Number(endSeconds);
		
		return hours * 60 + seconds;
	},
	_filmMgLfHandler:function(filmStartTime) {
		if (!filmStartTime) 
			return ;
		
		var startHours = filmStartTime.substring(0, filmStartTime.indexOf(":"));
		var startSeconds = filmStartTime.substring(filmStartTime.indexOf(":")+1, filmStartTime.length);
		var hours = Number(startHours);
		
		if (hours >= 7 && hours <= 24) {// 6:00 - 24:00
			return (hours - 7) * 60 + Number(startSeconds);
		} else if (hours >= 0 && hours <= 6) { //0:00 - 5:00
			// 2015-07-28 修改
			return 17*60 + hours*60 + Number(startSeconds);
		}
	},
	_searchFilm:function(){
		$("#searchFilm").click(function(){
			var dataVal = $("#temptime");
			if(dataVal.val() == "") {
				tipMsg_Single("searchFilm", 0, "请选择要搜索的日期", 0, '', '');
			} else {
				showSdlHandler._showInfoBySchedule(dataVal.val());
			}
		});
	},
	_adjustEvent:function(){	
		$('#adjustId').on('click', function(){
			if(emptySchData == 1){
				scheduledate = $("#temptime").val();
				$.layer({
				    type: 1,
				    shadeClose: true,
				    closeBtn: [1, true],
				    title: false,
				    border: [0],
				    offset: ['20px',''],
				    fix: false,
				    fadeIn: 1000,
				    area: ['90%', '1000px'],
				    page: {url: '/audit-system/adjust_schedule/adjust_schedule.html'}
				}); 
			}else{
				tipMsg_Single("adjustId", 0, "请先生成排期后，再调整", 0, '', '');
			}
		});
	},
	_downloadSche:function(){
		$("#downloadSche").bind({
			click:function(){
				if (crtLgnCinemaId == "" || emptySchData == 0) {
					tipMsg_Single("downloadSche", 0, "请先生成排期后，再下载", 0, '', '');
					return false;
				} else {
					var data = $("#searchFilm").parent(".time_search").find(".time").val();
					window.open('/schedule/apis/schedule/'+crtLgnCinemaId+'/'+data+'/downByHall.html','newwindow');
				}
			}
		});
	},
	// 影片占比
	_getFilmRateFunc:function() {
		$("#getFilmRateId").click(function(){
			if(emptySchData == 1){
				var scrollTop = $(document).scrollTop();

				$(".fr-body-tbl-title").nextAll().remove();//清除上一次数据
				var count = $(".waitB").size();//计算总影片数
				var sortArr = [];	// 存放欲排序数组

				var data_json = {};
				var filmIdArr = new Array(); 
				$.each($(".waitB"), function(index, val) {
					var num = 0;
					if(data_json[$(val).find("p:eq(1)").text()]){
						num = data_json[$(val).find("p:eq(1)").text()].count+1;
					}else{
						num = 1;
					}
					data_json[$(val).find("p:eq(1)").text()] = {
						"name":$(val).find("p:eq(1)").text(),
						"count":num
					}
				});
				var trHtml = "";
				var trIndex = 0;
				$.each(data_json, function(index, val) {
					trHtml += "<tr id='lineTr_" + trIndex + "'>";
					trHtml += '<td>'+val.name+'</td><td>'+val.count+'</td><td>'+(Math.round(val.count/count * 10000)/100).toFixed(2)+'%</td>';
					trHtml += "</tr>";
					trIndex++;
				});
				//总计
				trHtml += "<tr class='warning'>";
				trHtml += "<td>总计</td><td>"+count+"</td><td>100%</td>";
				trHtml += "</tr>";
				$(".fr-body-tbl-title").after(trHtml);

				// 排序（组织排序数据）
				var tblTR = $("#frTblBody").find("tr");
				for (var i = 1; i < tblTR.length - 1; i++) {
					var temp = "";
					var trId = "";	// 当前行ID
					var trFilmNum = "";	// 当前行的影片场次

					trId = $(tblTR[i]).attr("id");
					trFilmNum = $(tblTR[i]).find("td:eq(1)").text();
					temp = trId + "-" + trFilmNum;
					sortArr[i-1] = temp;
				}
				resortTR(sortByArray(sortArr), ".fr-body-tbl-title");	// 重排行

				$("#zhezhao2").show();
				$(".zhezhao2").css("height",$(document).height()+"px");
				$("#film_rate").slideDown();
				var zhezhaoIndex = $(".zhezhao2").css("zIndex");
				$(".film-rate").css({"top":100 + scrollTop + "px", "z-index":zhezhaoIndex+1});
			}else{
				tipMsg_Single("getFilmRateId", 0, "请先生成排期后，再查看", 0, '', '');
			}
		});
	},
	_closeFilmRate:function() {
		$(".fr-header-close").click(function(){
			$("#film_rate").slideUp();
			$("#zhezhao2").hide();
			$(".fr-body-tbl-title").nextAll().remove();
		});
	},
	// 影片时间表
	_getFilmTimeListFunc:function() {
		$("#getFilmTimeList").click(function(){
			if(emptySchData == 1){
				var scrollTop = $(document).scrollTop();

				$(".ftl-body-tbl-title").nextAll().remove();//清除上一次数据
				var count = $(".waitB").size();//计算总影片数
				var timeArr = [];	// 存放时间数组
				var time_value;

				var data_json = {};
				var filmIdArr = new Array();	// 影片数组
				$.each($(".waitB"), function(index, val) {
					time_value = $(val).find("p:eq(0)").text();
					time_value = time_value.replace(/ /g, "");
					time_value = time_value.substring(0, time_value.indexOf("-"));
					

					if(data_json[$(val).find("p:eq(1)").text()]){
						timeArr = data_json[$(val).find("p:eq(1)").text()];
						timeArr[timeArr.length] = time_value;
						data_json[$(val).find("p:eq(1)").text()] = timeArr;
					}else{
						timeArr = [];
						timeArr[0] = time_value;
						data_json[$(val).find("p:eq(1)").text()] = timeArr;
						filmIdArr[filmIdArr.length] = $(val).find("p:eq(1)").text();
					}
					
				});

				// 对每部影片的时间表排序
				for(var v in filmIdArr) {
					var temp_arr = data_json[filmIdArr[v]];
					data_json[filmIdArr[v]] = temp_arr.sort();
				}

				var trHtml = "", timeHtml = "", trIndex = 0;
				for(var v in filmIdArr) {
					timeHtml = "";
					$.each(data_json[filmIdArr[v]], function(index, val) {
						timeHtml += "<a href='javascript:;' class='time-span btn-radius-all'>"+val +"</a>";
					});

					trHtml += "<tr id='lineTr_" + trIndex + "'>";
					trHtml += "<td>" + filmIdArr[v] + "</td><td style='color: #999; text-align: left;'>" + timeHtml + "</td>";
					trHtml += "</tr>";
					trIndex++;
				}
				$(".ftl-body-tbl-title").after(trHtml);
				
				$("#zhezhao2").show();
				$(".zhezhao2").css("height",$(document).height()+"px");
				$("#film_time_list").slideDown();
				var zhezhaoIndex = $(".zhezhao2").css("zIndex");
				$(".film-time-list").css({"top":100 + scrollTop + "px", "z-index":zhezhaoIndex+1});
			}else{
				tipMsg_Single("getFilmTimeList", 0, "请先生成排期后，再查看", 0, '', '');
			}
		});
	},
	_closeFilmTimeList:function() {
		$(".ftl-header-close").click(function(){
			$("#film_time_list").slideUp();
			$("#zhezhao2").hide();
			$(".ftl-body-tbl-title").nextAll().remove();
		});
	},
	// 动态设置排期区域位置
	_dynamicPositionViewArea:function() {
		var schData = $("div[id^='tableRightSon']").children();
		var minStartTimeValue = "";		// 最小开始时间
		// var minStartTimePos = "";	// 最小开始时间位置
		var temp_time = "";	// 临时存储时间
		$.each($(".waitB"), function(index, val) {	// 遍历排期项
			var timeCycle = $(val).find("p:eq(0)").text();	// 获取时间段
			temp_time = timeCycle.split("-")[0];
			if(minStartTimeValue == ""){
				minStartTimeValue = timeCycle.split("-")[0];	// 取开始时间
				minStartTimePos = $(val).css("marginLeft");		// 获取开始时间的 marginLeft 样式属性值, 作为动态位置值
			}

			// 比较获得排期项中的最小时间
			if(temp_time.trim() < minStartTimeValue.trim()){
				minStartTimeValue = timeCycle.split("-")[0];
				minStartTimePos = $(val).css("marginLeft");		// 获取最小时间的 marginLeft 样式属性值, 作为动态位置值
			}
		});
		
		minStartTimePos = minStartTimePos.replace(/px/g, "");
		minStartTimePos = minStartTimePos*1 - 10;	// 将 marginLeft 属性值 -10px
		$("#table-container").scrollLeft(minStartTimePos);	// 根据最小时间的 marginLeft 样式属性值, 动态设置排期区域位置
	}
};

/**
* 按钮快速查询
* @description 快速查询按钮，可查询范围4天
*
* @param curDayFlag 点击日期标记值
**/
function nowDateEvent(curDayFlag){
	var dayNameArr = ["昨天", "今天", "明天", "后天"];
	var nowDayFlag = $("#dayFlag").val();	// 当前日期标记值
	var resultDayFlag = nowDayFlag*1 + curDayFlag*1;	// 结果日期标记值
	var nowDate = SetDateStr(resultDayFlag, "");	// 结果日期值

	if(resultDayFlag > -2 && resultDayFlag < 3) {
		$("#temptime").val(nowDate);
		$(".day-name-box-m").text(dayNameArr[resultDayFlag + 1]);
		$("#dayFlag").val(resultDayFlag);

		showSdlHandler._showInfoBySchedule(nowDate);
	}else {
		tipMsg_Single("show_sch_script", 0, "查询范围仅支持4天<br />您可使用日期栏进行查询", 0, '', '');
	}
}

/**
* 日期选取查询
**/
function WdatePickedFunc() {
	var sltDate = $dp.cal.getDateStr();

	var yestD = SetDateStr(-1, "");	// 昨天
	var todyD = SetDateStr(0, "");	// 今天
	var tmrwD = SetDateStr(1, "");	// 明天
	var afttD = SetDateStr(2, "");	// 后天

	if(sltDate > afttD){}
	if(sltDate == yestD) {
		$(".day-name-box-m").text("昨天");
		$("#dayFlag").val(-1);
	}
	if(sltDate == todyD) {
		$(".day-name-box-m").text("今天");
		$("#dayFlag").val(1);
	}
	if(sltDate == tmrwD) {
		$(".day-name-box-m").text("明天");
		$("#dayFlag").val(1);
	}
	if(sltDate == afttD) {
		$(".day-name-box-m").text("后天");
		$("#dayFlag").val(2);
	}

	$("#scheDateYet").text(sltDate);

	showSdlHandler._showInfoBySchedule(sltDate);
}

$(function() {
	/**
	* 左按钮hover
	**/
	$(".day-left-btn").hover(
		function() {
			$(this).attr("src", "images/left-btn-1.png");
		},
		function() {
			$(this).attr("src", "images/left-btn.png");
		}
	);

	/**
	* 右按钮hover
	**/
	$(".day-right-btn").hover(
		function() {
			$(this).attr("src", "images/right-btn-1.png");
		},
		function() {
			$(this).attr("src", "images/right-btn.png");
		}
	);
});