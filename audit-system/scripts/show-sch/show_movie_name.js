var emptySchData = "";	// 是否有排期的标识，用于控制相关按钮操作
var dataForCanvas;	// 保存接口返回数据：为画布做数据准备
var crtLgnCinemaId;
var viewArrayAll = [];
function movieNameInit(){
	$("#temptime").val(dateObj.dateNowymd2());
	movieNameHandler._colligateHandler();
}

var movieNameHandler = {
	_colligateHandler:function(){
		var crtLgnCinemaName = getCookie("jh_sdleLoginName");
		if (crtLgnCinemaName != "") {
			crtLgnCinemaId = cinemaObj.id;
			this._showInfoByfilmName();
			this._downloadSche();
		} else {
			crtLgnCinemaId = "";
		}
		
		movieNameHandler._searchMovie();
	},
	_showInfoByfilmName:function(){
		movieNameHandler._showInfoByfilm($("#temptime").val());
	},
	_showInfoByfilm:function(nowDate){
		if (crtLgnCinemaId == "") {
			tipMsg_Single("showByFilmNameDiv", 0, "无影院信息，无法查询", 0, '', '');
			return false;
		} else {
			server.viewByFilmName(
				crtLgnCinemaId, 
				nowDate, 
				function(callbackData){
					if (callbackData.ret) {
						$('#showByFilmName').empty();
						$("#sch_film_list").empty();

						if(callbackData.data!="") {
							emptySchData = 1;	// 有排期
							dataForCanvas = callbackData.data;
						}else{
							emptySchData = 0;	// 没有排期
							dataForCanvas = null;
						}
						
						if(emptySchData == 1) {
							for ( var i = 0; i < callbackData.data.length; i++) {
								viewArrayAll = [];
								$("#sch_film_list").append("<option value='"+callbackData.data[i].filmName+"' label='"+callbackData.data[i].filmName+"'>"+callbackData.data[i].filmName+"</option>");

								$('#showByFilmName').append("<tr>" +
									"<td width='120' class='ytname'><span class='fileNamecl'>"+callbackData.data[i].filmName+"</span><br />" +
											"<em>（片长"+callbackData.data[i].length+"分钟）</em></td>" +
											"<td class='yplist'>" +
											"<table width='100%' border='0' cellspacing='0' cellpadding='0' id='filmNameDiv"+callbackData.data[i].filmId+"'></table></td></tr>");

								var viewScheduleStr = callbackData.data[i].viewSchedule;
								
								
								for ( var j = 0; j < viewScheduleStr.length; j++) {
									
									var viewTagss = viewScheduleStr[j].viewTags.split(",");
									for( var k = 0; k < viewTagss.length; k++) {
										var startTime = viewTagss[k].substring(0, viewTagss[k].indexOf("-")-1);
										var viewParameters = {};
										viewParameters["hallName"] = viewScheduleStr[j].hallName;
										viewParameters["viewTagsTime"] = movieNameHandler._dateHandler(startTime);
										viewParameters["viewTagsTimes"] = viewTagss[k];
										viewArrayAll.push(viewParameters);
										
									}
								}
								

								var resultData = movieNameHandler._dataSort(viewArrayAll);
								
								var lengths = Math.ceil(resultData.length/7);
								
								var no_right_border, no_bottom_border;
								for ( var k = 0; k < lengths; k++) {
									$('#filmNameDiv'+callbackData.data[i].filmId).append("<tr id='filmNameDiveTr"+callbackData.data[i].filmId+k+"'></tr>");

									for ( var m = 0; m < 7; m++)	{
										if(i == (callbackData.data.length - 1)){
											// 去掉最后一部影片的最后一行的下边框
											if(k == (lengths - 1)){
												no_bottom_border = " border-bottom: none;"
											}else{
												no_bottom_border = "";
											}
										}else{
											no_bottom_border = "";
										}

										if(m == 6){	// 去掉右边框
											no_right_border = " border-right: none;"
										}else{
											no_right_border = "";
										}
										$("#filmNameDiveTr"+callbackData.data[i].filmId+k).append("<td style='width:86px; height:70px;" + no_right_border + no_bottom_border + "' id='filmNameDiveTd"+callbackData.data[i].filmId+k+m+"'></td>");
									}
								}

								for (var n = 0; n < resultData.length; n++) {
									$("#filmNameDiv"+callbackData.data[i].filmId+" td:eq("+n+")").html(resultData[n].hallName+"<br><br>"+resultData[n].viewTagsTimes);
								}
								
								var objTd = $("#showByFilmName .fileNamecl"+callbackData.data[i].filmId).parent("td");
								var widthTd = (objTd.height())/lengths;
								for (var d = 0; d < lengths; d++) {
									$("#filmNameDiv"+callbackData.data[i].filmId+" #filmNameDiveTr"+callbackData.data[i].filmId+d+" td:eq(0)").attr("height", (widthTd+1)+"px");
								}
							}

							$("#sch_film_list").prepend("<option value='' label='' selected='selected'>请选择影片</option>");
						}else {
							tipMsg_Single("showByFilmNameDiv", 0, "当前暂无排期", 0, '', '');
							// 没有排期
							var noDataHtml = "<tr><td style='border: 1px solid #fff; text-align: left;'>"
												+ "<img src='images/tip.png' class='tip-light' />"
                								+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无数据，您可在生成排片后查看</span>"
                							+ "</td></tr>";
                			$("#showByFilmName").html(noDataHtml);
                			$("#sch_film_list").html("<option value='' label='' selected='selected'>暂无可查影片</option>");
						}
					}
				}
			);
		}
	},
	_dateHandler:function(dateObj){
		if (!dateObj) 
			return ;
		var startHours = dateObj.substring(0, dateObj.indexOf(":"));
		var startSeconds = dateObj.substring(dateObj.indexOf(":")+1, dateObj.length);

		if (Number(startHours) == 0) {
			startHours = 24;
		}
		return startHours+":"+startSeconds;
	},
	_dataSort:function(sortObj){
		if (!sortObj) 
			return ;
		for ( var i = 0; i < sortObj.length; i++) {
			for ( var j = i; j < sortObj.length; j++) {
				if (sortObj[i].viewTagsTime > sortObj[j].viewTagsTime) {
					var temp = sortObj[i];
					sortObj[i] = sortObj[j];
					sortObj[j] = temp;
				}
			}
		}
		return sortObj;
	},
	_searchMovie:function(){
		//按影片名称搜索
		$("#sch_film_list").change(function() {
			var inputVal = $(this).find("option:selected").val();
			var listLen = $(this).find("option").length, curIndex = $(this).find("option:selected").index();

			if (inputVal == "") {
				movieNameHandler._showInfoByfilmName();
			} else {
				$("#showByFilmName span.fileNamecl").each(function(i){
					if ($(this).text().trim() == inputVal) {
						$(this).parent("td").parent("tr").show();
						$(this).parent("td").next().find("table tr:last").find("td").css("border-bottom", "none");
					} else {
						$(this).parent("td").parent("tr").hide();
					}
				});
			}
		});
	},
	_downloadSche:function(){
		$("#downloadSche").bind({
			click:function(){
				if (crtLgnCinemaId == "" || emptySchData == 0) {
					tipMsg_Single("showByFilmNameDiv", 0, "请先生成排期后，再下载", 0, '', '');
					return false;
				} else {
					var data = $("#temptime").val();
					window.open('/schedule/apis/schedule/'+crtLgnCinemaId+'/'+data+'/downByHall.html','newwindow');
				}
			}
		});
	}
};

//按照时间查询
function searchByDateForFilmSch() {
	var inputVal = $dp.cal.getDateStr();

	if (inputVal == "") {
		tipMsg_Single("showByFilmNameDiv", 0, "请选择要搜索的日期", 0, '', '');
	}else {
		movieNameHandler._showInfoByfilm(inputVal);
	}
}

$(window).scroll(function() {
	
});
