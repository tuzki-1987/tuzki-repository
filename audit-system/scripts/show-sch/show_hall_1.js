var emptySchData = "";	// 是否有排期的标识，用于控制相关按钮操作
var crtLgnCinemaId;
var allHallNameInfo = [];
function hallInit(){
	// 预设时间控件值
	$("#temptime").val($("#scheDateYet").text());
	hallHandler._colligateHandler();
}

var hallHandler = {
	_colligateHandler:function(){
		var crtLgnCinemaName = getCookie("jh_sdleLoginName");
		if (crtLgnCinemaName != "") {
			crtLgnCinemaId = cinemaObj.id;
			this._hallListsBySchedule();
			this._downloadSche();
		} else {
			crtLgnCinemaId = "";
		}

		hallHandler._searchHallInfoByName();
	},
	_hallListsBySchedule:function(){
		//影厅列表
		hallHandler._hallInfo($("#temptime").val());
	},
	_hallInfo:function(nowDate){
		var langId = "", filmCode = "";
		if (crtLgnCinemaId == "") {
			tipMsg_Single("showByFilmHall", 0, "无影院信息，无法查询", 0, '', '');
			return false;
		} else {
			server.viewByHall(
				crtLgnCinemaId, 
				nowDate, 
				langId, 
				filmCode, 
				function(callback){
					if (callback.ret) {
						$("#hall_list").empty();
						$('#showByFilmHall').empty();
						
						if(callback.data!="") {
							emptySchData = 1;	// 有排期
						}else{
							emptySchData = 0;	// 没有排期
						}

						if(emptySchData == 1) {
							var datas = callback.data, datasL = datas.length;
							var hallData = callback.halls, hallDataL = hallData.length;

							for(var h = 0; h < hallDataL; h++) {
								$("#hall_list").append("<option value='"+hallData[h].hallName+"' label='"+hallData[h].hallName+"'>"+hallData[h].hallName+"</option>");
							}
							$("#hall_list").prepend("<option value='' label='' selected='selected'>请选择影厅</option>");
							
							var trBgClrHtml = "";
							for ( var i = 0; i < datasL; i++) {
								$('#showByFilmHall').append("<div class='ting_list' id='filmHallDiv"+i+"'>" +
										"<div class='t_name' id='hallNameDiv' data='0' onclick='hide_hall_data(this);'><span>"+callback.data[i].hallName+"</span></div></div>");
								
								$("#filmHallDiv"+i).append("<table width='100%' id='filmHallTr"+i+"' cellspacing='0' cellpadding='0'>" +
										"<tr><th>片名</th>" +
										"<th>开场时间</th>" +
										"<th>散场时间</th>" +
										"<th>间隔</th></tr></table>");

								var viewSchedules = hallHandler._timeHandler(callback.data[i].viewSchedule), viewSchedulesL = viewSchedules.length;
								for ( var j = 0; j < viewSchedulesL; j++) {
									if(j % 2 == 0) {
										trBgClrHtml = "";
									}else {
										trBgClrHtml = " class='even-bgclr'";
									}

									$('#filmHallTr'+i).append("<tr" + trBgClrHtml + ">" +
										"<td>"+viewSchedules[j].filmName+"</td>" +
										"<td>"+viewSchedules[j].showBeginTime+"</td>" +
										"<td>"+viewSchedules[j].showEndTime+"</td>" +
										"<td>"+viewSchedules[j].intervalTime+"</td></tr>");
								}
							}
						}else {
							tipMsg_Single("showByFilmHall", 0, "当前暂无排期", 0, '', '');
							// 没有排期
							var noDataHtml = "<img src='images/tip.png' class='tip-light' />"
                							+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无数据，您可在生成排片后查看</span>";
                			$("#showByFilmHall").html(noDataHtml);
                			$("#hall_list").html("<option value='' label='' selected='selected'>暂无可查影厅</option>");
						}
					}
				}
			);
		}
	},
	_timeHandler:function(object) {
		if (!object)
			return ;
		for ( var i = 0; i < object.length; i++) {
			for ( var j = i; j < object.length; j++) {
				if (object[i].showBeginTime > object[j].showBeginTime) {
					var temp = object[i];
					object[i] = object[j];
					object[j] = temp;
				}
			}
		}
		return object;
	},
	_searchHallInfoByName:function(){
		$("#hall_list").change(function() {
			// 搜索影厅信息（按影厅号）
			var hallInpVal = $(this).find("option:selected").val();
			if (hallInpVal == "") {
				hallHandler._hallListsBySchedule();
			} else {
				$("#showByFilmHall #hallNameDiv").each(function(i){
					var thisVal = $(this).text();
					if (thisVal == hallInpVal) {
						$(this).parent("div").show();
					} else {
						$(this).parent("div").hide();
					}
				});
			}
		});
	},
	_downloadSche:function(){
		$("#downloadSche").bind({
			click:function(){
				if (crtLgnCinemaId == "" || emptySchData == 0) {
					tipMsg_Single("showByFilmHall", 0, "请先生成排期后，再下载", 0, '', '');
					return false;
				} else {
					var data = $("#temptime").val();
					window.open('/schedule/apis/schedule/'+crtLgnCinemaId+'/'+data+'/downByHall.html','newwindow');
				}
			}
		});
	},
};

//按照时间查询
function searchByDateForHallSch() {
	var inputVal = $dp.cal.getDateStr();
	
	if (inputVal == "") {
		tipMsg_Single("showByFilmHall", 0, "请选择要搜索的日期", 0, '', '');
	} else {
		hallHandler._hallInfo(inputVal);
	}
}

/**
* 显示/隐藏 厅的数据
**/
function hide_hall_data(obj) {
	var hideObj = $(obj).next("table");
	var objData = $(obj).attr("data");

	if(objData == 0){
		$(hideObj).fadeOut();
		$(obj).attr("data", "1");
	}else{
		$(hideObj).fadeIn();
		$(obj).attr("data", "0");
	}
}