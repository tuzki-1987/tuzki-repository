/**
* 票房明细
*
* @author ccq by 2015-11-10
**/

var filmLists;	// 片源列表
var saveFilmListsHTML;	// 存放片源列表HTML（用于自动提示无输入或为空时，显示全部影片列表）
var saveFilmListsData;	// 存放片源列表元数据
var ctrl_flag_0 = 0;	// 控制显示/隐藏变量，

/**
 * 显示票房明细
 * 
 * @param 
 * 		thisTitle 票房明细文件名
 * 		current   查询页号
 * @return
 * */
function showDetail(thisTitle, current, fileDate) {
	var current = 0;
	loadBoxOfficeDetail(current, 5, 'detailIndex', fileDate);
	
	$("#show_detail_btn").hide();
}

var pageCurrent = 1;
var pageTotalNum = 0;
/**
 * 加载票房明细
 * 
 * @param 
 * 		current 当前条数
 * 		offset  每页显示数
 * 		obj     对象ID
 * @return
 * */
function loadBoxOfficeDetail(current, offset, obj, date) {
	failedMatch = 0, sucMatch = 0;	// 避免"未匹配"、"已匹配"统计数据叠加
	var offset = "", date= date == "" || date == undefined ? "" : date;
	var cinemaId = cinemaObj.id;
	
	var load_html = "<p style='text-align: center;'><img src='images/load.gif' width='20' height='20' /></p>";
	$("#detailContainer").html(load_html);
	
	if(cinemaId == "") {
		tipMsg_Single("reportTitle", 0, "登录状态已失效，请重新登录", 0, '', '');
		goPageDelay();
	}else{
		server.detailList(cinemaId, current, offset, date, function(callback){
			if(callback != null && callback != "" && callback != "null"){
				var records = 0;
				var submit_flag = localStorage.detailSubmitFlag;	// 判断是否已提交
				if(callback.ret){
					filmLists = callback.films;	// 片源列表
					saveFilmListsData = filmLists;	// 存放片源列表元数据
					records = callback.data;	// 明细记录
					if(records.length > 0){
						$("#detailContainer").show();

						// 处理数据的返回值
						var return_dealed_data = dealDataForPageStructureFunc(records);

						// 页面展现
						showPageByData(return_dealed_data, submit_flag);

						// 未提交时, 给出提示信息
						if(submit_flag == 0) {
							setTimeout(function() {
								tipMsg_Single("reportTitle", 0, "请及时提交您的观影人次数据", 0, '', '');
							}, 300);
						}
					}else{
						$("#detailContainer").html("");
						$("#detailContainer").hide();
						tipMsg_Single(obj, 0, "没有当日观影人次明细记录，请上传明细", 0, '', '');
					}
				}else
					tipMsg_Single(obj, 0, callback.errmsg, 0, '', '');			
			}
		});
	}
}

/**
 * 分页处理
 * 
 * @param 
 * 		pageFlag 点击索引标识
 * 		curObjID 当前点击对象的ID
 * 		current  当前条数
 * 		offset	 每页条数
 * 		pageCurrent 当前页号
 * */
function pageDetail(pageFlag, curObjID, current, offset, pageCurrent) {
	// 首页
	if(pageFlag == "index"){
		if (pageCurrent == 1)
			tipMsg_Single(curObjID, 0, "已是首页", 0, '', '');
		else{
			loadBoxOfficeDetail(0, offset, curObjID);
			
			pageCurrent = 1;
		}
	}
	
	// 上一页
	if(pageFlag == "prev"){
		pageCurrent = pageCurrent*1 - 1;
		if (pageCurrent < 1) {
			tipMsg_Single(curObjID, 0, "已到首页", 0, '', '');
			pageCurrent = 1;
		} else{
			loadBoxOfficeDetail(current*1 - offset, offset, curObjID);
		}
	}
	
	// 下一页
	if(pageFlag == "next"){
		pageCurrent = pageCurrent*1 + 1;
		if (pageCurrent > pageTotalNum) {
			tipMsg_Single(curObjID, 0, "已到尾页", 0, '', '');
			pageCurrent = pageCurrent - 1;
		} else{
			loadBoxOfficeDetail(current*1 + offset, offset, curObjID);
		}
	}
	
	// 尾页
	if(pageFlag == "last"){
		if (pageCurrent*1 == pageTotalNum*1)
			tipMsg_Single(curObjID, 0, "已是尾页", 0, '', '');
		else {
			loadBoxOfficeDetail(pageTotalCount - pageTotalNum, offset, curObjID);
			
			pageCurrent = pageTotalNum;
		}
	}
}

/**
 * 更新明细
 * 
 * @param 
 * 		curObj 所属更新对象
 * @return
 * */
function updateRecord(curObj) {
	var cinemaId = cinemaObj.id;

	var recordIdArr = [];	// 存放记录ID的数组
	var parentID = $(curObj).parent().parent().parent().parent().attr("id");	// 当前按钮所属循环块的父对象id

	var filmId = $("#" + parentID).find("#userSltFilmValue").val();	// 所选影片id
	var filmName = $("#" + parentID).find(".unmatch-film-name").text();	// 影片名字
	var tip_html = $("#" + parentID).find(".unmatch-film-tip");	// 未匹配的提示信息
	var flag = true;
	var recordIdObj = $("#" + parentID).find(".dcdbox-right-tbl").find(".cur-record-id");	// 存放记录id的input

	if(recordIdObj.length == 1){
		recordIdArr[0] = $(recordIdObj[0]).val();
	}

	// 汇总记录ID
	if(recordIdObj.length > 1){
		for (var rid = 0; rid < recordIdObj.length; rid++) {
			recordIdArr[rid] = $(recordIdObj[rid]).val();
		}
	}
	
	if(cinemaId == "") {
		tipMsg_Single("reportTitle", 0, "登录状态已失效，请重新登录", 0, '', '');
		goPageDelay();
	}else{
		if(filmId == ""){
			tipMsg_Single("reportTitle", 0, "请选择匹配片源", 0, '', '');
		}else{
			$(curObj).removeClass("updateBtn");
			$(curObj).addClass("updateBtn-load");
			
			var update_flag = false;
			// 根据记录id数量，异步请求更新接口
			for (var rida = 0; rida < recordIdArr.length; rida++) {
				server.updateDetail(recordIdArr[rida], filmId, filmName, flag, function(callback) {
					if(callback.ret){
						update_flag = true;
					}else{
						update_flag = false;
					}
				});
			}

			tipMsg_Single("reportTitle", 0, "更新成功", 0, '', '');
			$(curObj).hide();	// 隐藏更新按钮
			$(tip_html).hide();	// 隐藏未匹配提示信息
			failedMatch--;	// 未匹配记录数递减
			sucMatch++;	// 已匹配记录数递增
			$("#failedMatchId").text(failedMatch);
			$("#sucMatchId").text(sucMatch);

			var slt_film_lit = $("#" + parentID).find(".dcdbox-left-data-list");	// 选择影片的位置
			var html_updated = "<ul class='filmListBox-ul-ok'><li value='' class='text-solong'>" + filmName + "</li></ul>";
			$(slt_film_lit).html(html_updated);	// 更新成功后，修改列表容器的 html内容
		}
	}
}

/**
 * 提交明细
 * 
 * @param 
 * 		obj	提交按钮ID
 * 		dataTblObj 数据表ID
 * @return
 * */
function submitDetail() {
	var cinemaId = cinemaObj.id, showDate = "";
	
	if(cinemaId == "") {
		tipMsg_Single("reportTitle", 0, "登录状态已失效，请重新登录", 0, '', '');
		goPageDelay();
	}else {
		if(failedMatch > 0){
			tipMsg_Single("reportTitle", 0, "请核对校正后，再提交", 0, '', '');
		}else{
			server.createBoxOffice(cinemaId, function(callback){
				if(callback.ret){
					showDate = callback.showDate;
					$("#initSchDate").val(showDate);	// 保留上传日期

					$("#submitBtn").attr("disabled", "disabled");
					$(".submitBtn").css({"background":"#ccc", "cursor":"default"});

					tipMsg_Single("reportTitle", 0, "提交成功", 0, '', '');
					// $(".analysis-btn-process").show();	// 提交成功后，显示 "场次分析" 按钮
					loadBoxOfficeTotals(cinemaId, showDate);
					localStorage.detailSubmitFlag = 1;	// 提交后，更新标示位(0:未提交, 1:已提交)
				}
			});
		}
	}
}

/**
* 数据处理 —— 为页面结构
*
* @description 最终数据结构
*[
	{
	"matchResult":匹配结果(0: 未匹配, 1: 已匹配),
	"totalFilmShow":该影片总场次,
	"filmName":"影片名",
	"filmData":[
		{"hallName":"4K厅", "hallData":[
			{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率},
			{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}
			]
		},
		{"hallName":"4K厅", "hallData":[{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}]},
		{"hallName":"4K厅", "hallData":[{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}]}
		]
	},
	{
	"matchResult":匹配结果(0: 未匹配, 1: 已匹配),
	"totalFilmShow":该影片总场次,
	"filmName":"影片名",
	"filmData":[
		{"hallName":"4K厅", "hallData":[{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}]},
		{"hallName":"4K厅", "hallData":[
			{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率},
			{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}
			]
		},
		{"hallName":"4K厅", "hallData":[{"id":记录id, "filmId":影片id, "hallId":影厅id, "showDate":"放映日期", "showTime":"放映时间", "totalTicketCount":总票数, "totalPrice":总票房, "totalSeatCount":总座位数, "seatRate":上座率}]}
		]
	},
	......
]
*
* @param resultData 异步请求返回数据
* 
* @return Array 汇总结果集
**/
var total_show = 0;	// 明细文件总场次
var failedMatch = 0, sucMatch = 0;	// 未匹配、已匹配总数
function dealDataForPageStructureFunc(resultData) {
	var all_match_record_arr = [];	// 所有匹配结果（包括未匹配、已匹配）

	// 遍历接口返回数据，汇总数据	
	for(var i = 0; i < resultData.length; i++){
		if(!resultData[i].flag){	// 未匹配成功
			matchResultFunc(resultData, i, all_match_record_arr, resultData[i].flag);
		}else{	// 匹配成功
			matchResultFunc(resultData, i, all_match_record_arr, resultData[i].flag);
		}
	}

	// 统计每部影片的场次数
	for (var m = 0; m < all_match_record_arr.length; m++) {
		var filmDataResult = all_match_record_arr[m].filmData;
		var hallDataResultLength = 0;
		for (var n = 0; n < filmDataResult.length; n++) {
			var hallDataResult = filmDataResult[n].hallData;
			hallDataResultLength += hallDataResult.length;
		}
		all_match_record_arr[m].totalFilmShow = hallDataResultLength;
	}
	total_show = i;	// 记录明细文件总场次

	// 排序：将未匹配的冒泡到上面
	var sort_1, sort_2;
	for (var s = 0; s < all_match_record_arr.length; s++) {
		sort_1 = all_match_record_arr[s].matchResult;

		for (var t = s + 1; t < all_match_record_arr.length; t++) {
			sort_2 = all_match_record_arr[t].matchResult;

			if(sort_1 > sort_2){	// 将未匹配的冒泡到上面
				var temp = all_match_record_arr[s];
				all_match_record_arr[s] = all_match_record_arr[t];
				all_match_record_arr[t] = temp;
			}
		}
	}

	// 统计 未匹配、已匹配 总数
	var temp_0;
	for (var v = 0; v < all_match_record_arr.length; v++) {
		temp_0 = all_match_record_arr[v].matchResult;

		if(temp_0 == 0){
			failedMatch++;
		}

		if(temp_0 == 1){
			sucMatch++;
		}
	}

	return all_match_record_arr;
}

/**
* 数据匹配，按影片名、影厅名汇总
*
* @param resultData 接口返回数据
* @param i 循环变量
* @param all_match_record_arr 汇总结果集
* @param match_result_index 接口返回的记录的匹配结果(0: 未匹配, 1: 已匹配)
* 
**/
function matchResultFunc(resultData, i, all_match_record_arr, match_result_index) {
	var all_match_record_arr_length = all_match_record_arr.length;	// 当前结果集数量, 用于其下标

	var objHallName = resultData[i].hallName;
	var objFilmName = resultData[i].filmName;
	// 厅的数据对象
	var finalDataArr = {
		"id": resultData[i].id,
		"filmId": resultData[i].filmId,
		"hallId": resultData[i].hallId,
		"showDate": resultData[i].showDate,
		"showTime": resultData[i].showTime,
		"totalTicketCount": resultData[i].totalTicketCount,
		"totalPrice": resultData[i].totalPrice,
		"totalSeatCount": resultData[i].totalSeatCount,
		"seatRate": resultData[i].seatRate
	};

	// 当前影片存在的标识, 当前影片在结果集中的下标
	var exist_films_flag, exist_films_index;
	var film_data_obj = {};	// 影片数据集对象
	var film_data_arr = [];	// 影片的数据集
	if(all_match_record_arr_length > 0) {	// 结果集是否为初始值
		// 遍历结果集，若存在影片，取回当前【影片】相关数据项
		for (var j = 0; j < all_match_record_arr_length; j++) {
			if(objFilmName == all_match_record_arr[j].filmName){	// 影片已存在
				exist_films_flag = true;
				exist_films_index = j;
				film_data_obj = all_match_record_arr[j];
				film_data_arr = all_match_record_arr[j].filmData;
				film_data_arr_length = film_data_arr.length;

				break;
			}else{
				exist_films_flag = false;
				exist_films_index = -1;
			}
		}
	}else {
		exist_films_flag = false;
		exist_films_index = 0;
	}
	

	if(exist_films_flag) {	// 影片已存在
		// 当前影厅存在的标识, 当前影厅在影片的数据集中的下标
		var exist_hall_flag, exist_halls_index;
		var hall_data_obj = {};		// 厅数据集对象
		var hall_data_arr = [];	// 厅的数据集
		// 当前影片数据集数量, 当前厅数据集数量, 均用于其下标
		var film_data_arr_length, hall_data_arr_length;

		// 遍历当前影片数据集，若存在影厅，取回【影厅】相关数据项
		for (var k = 0; k < film_data_arr_length; k++) {
			if(objHallName == film_data_arr[k].hallName) {	// 影厅已存在
				exist_hall_flag = true;
				exist_halls_index = k;
				hall_data_obj = film_data_arr[k];
				hall_data_arr = film_data_arr[k].hallData;
				hall_data_arr_length = hall_data_arr.length;

				break;
			}else {
				exist_hall_flag = false;
				exist_halls_index = -1;
			}
		}

		if(exist_hall_flag) {	// 厅已存在, 在原结果集上累计(反向累计)
			hall_data_arr[hall_data_arr_length] = finalDataArr;
			hall_data_obj.hallData = hall_data_arr;
			film_data_arr[exist_halls_index] = hall_data_obj;
			film_data_obj.filmData = film_data_arr;
			all_match_record_arr[exist_films_index] = film_data_obj;
		}else {	// 厅未存在 : 初始化【影厅】各项属性值, 附加到原结果集上(反向附加); 声明顺序：变量作用域升序
			var temp_hall_data_arr = [], temp_hall_data_obj = {};
			temp_hall_data_arr[0] = finalDataArr;
			temp_hall_data_obj = {
				"hallName": objHallName,
				"hallData": temp_hall_data_arr
			}
			film_data_arr[film_data_arr_length] = temp_hall_data_obj;
			film_data_obj.filmData = film_data_arr;
			all_match_record_arr[exist_films_index] = film_data_obj;
		}
	}else {	// 影片未存在 : 初始化各项值
		var temp_total_show = 1;	// 初始值
		var hall_data_arr = [];	// 厅的数据集（数组类型，存放对象）：未匹配的数据，表格部分
		hall_data_arr[0] = finalDataArr;

		var hall_data_obj = {
			"hallName": objHallName,
			"hallData": hall_data_arr
		};	// 厅数据集对象：用于存放 hall_data_arr 和 厅名

		var film_data_arr = [];	// 影片对应的数据集：厅对象
		film_data_arr[0] = hall_data_obj;

		var film_data_obj = {
			"matchResult": match_result_index,
			"totalFilmShow": temp_total_show,
			"filmName": objFilmName,
			"filmData": film_data_arr
		};	// 影片数据集对象：用于存放 影片名 和 影片数据集

		all_match_record_arr[all_match_record_arr_length] = film_data_obj;	// 当前结果累计
	}
}

/**
* 页面展现
*
* @param arr_data	处理后的结果集
* @param submit_flag	是否已提交的判断参数(本地存储的常量)
**/
function showPageByData(arr_data, submit_flag) {
	var total_films = arr_data.length;	// 影片总数
	var html_title = "<span class='dc-title-0'>观影信息</span>";
	var html_title_1 = "<span class='dc-title-1'>按&nbsp;<strong>[分厅影讯]</strong>&nbsp;匹配，"
					 + "共&nbsp;<strong>" + total_films + "</strong>&nbsp;部影片,&nbsp;<strong>" + total_show + "</strong>&nbsp;场</span>";
	var html_title_2 = "<span class='dc-title-2'>未匹配影片&nbsp;<span id='failedMatchId'>" + failedMatch + "</span>&nbsp;部，</span>";
	var html_title_3 = "<span class='dc-title-3'>已匹配影片&nbsp;<span id='sucMatchId'>"+ sucMatch + "</span>&nbsp;部</span>";
	// 组合标题信息
	var html_dc_title = "<p id='dc_title' class='dc-title' onclick='titleCtrlFunc(this);'>" + html_title + html_title_1 + html_title_2 + html_title_3 + "</p>";

	// 提交按钮
	var html_submitBtn;
	if(submit_flag == 1){	// 已提交
		html_submitBtn = "";
	}else{
		html_submitBtn = "<div id='submitBtnBox' style='margin-top: 20px; text-align: center;'>"
							+"<input type='button' id='submitBtn' class='btn submitBtn' name='submitBtn' value='提交' onclick=\"submitDetail();\" />"
						+"</div>";
	}
	
	// 更新按钮
	var html_updateBtn = "<input class='updateBtn' type='button' onclick='updateRecord(this);' title='保存' value='' name='update' />";
	var operFlag = false;	// 提交按钮 可操作标识
	var filmsListHTML = "";		// 系统片源列表
	var finalListHTML = "";		// 系统片源最终HTML（匹配成功、失败）
	for(var m = 0; m < filmLists.length; m++){
		filmsListHTML += "<li value='" + filmLists[m].id +"' onclick='setValueBySlt(this);' onmouseover='handleMouseover(this);' onmouseout='handleMouseout(this);'>" + filmLists[m].filmName + "</li>";
	}
	saveFilmListsHTML = filmsListHTML;	// 存放片源列表HTML

	// 定义数据循环块变量
	var html_data_box_start_1 = "<div id='dc_data_box_", html_data_box_start_2 = "' class='dc-data-box clearF'>", html_data_box_end = "</div>";
	var html_data_left_0 = "<div id='dcdbox_left' class='dcdbox-left ft'>"
							+"<div id='dcdbox_left_data' class='dcdbox-left-data area-ht clearF'>"
								+"<a href='javascript:;' class='h4title-btn-cmn h4title-btn' data='0' onclick='dataBlockCtrlFunc(this);'>-</a><h4 class='ft'>"
	// 记录序号(0 与 1 之间)
	var html_data_left_1 = "</h4><div class='dcdbox-left-data-list'>";
	// 影片列表(1 与 2 之间)
	var html_data_left_2 = 	"</div></div>"
							+"<div class='dcdbox-left-data-name'>"
								+"<p class='unmatch-film-name'>"
	// 影片名字(2 与 3 之间)
	var html_data_left_3 = 	"</p>";
	var html_data_left_4 = 	"<span class='unmatch-film-tip'>未匹配影片，请手动选择</span>"
	var html_data_left_5 = 	"</div></div>";

	var html_data_right_1_1 = "<div id='dcdbox_right_";
	var html_data_right_1_2 = "' class='dcdbox-right ft'>"
								+"<table id='dcdbox_right_tbl' class='dcdbox-right-tbl' cellspacing='0' cellpadding='0' border='0'>"
									+"<thead><tr>"
										+"<th class='area-ht'>厅名</th>"
										+"<th class='area-ht'>放映日期</th>"
										+"<th class='area-ht'>放映时间</th>"
										+"<th class='area-ht'>总票数</th>"
										+"<th class='area-ht'>总人次</th>"
										+"<th class='area-ht'>总座位数</th>"
										+"<th class='area-ht'>上座率</th>"
									+"</tr></thead>";
	var html_data_right_2;	// 循环数据
	var html_data_right_3 = "</table></div>";

	// 遍历汇总结果集，构建展示区域
	var temp_data_block = "", temp_html_data_left, temp_html_data_right, temp_filmsListHTML, temp_finalHTML, temp_filmData, temp_hallName, temp_hallData, temp_class = "";
	for (var z0 = 0; z0 < arr_data.length; z0++) {
		// 未匹配
		if(arr_data[z0].matchResult == 0){
			finalListHTML = "<input type='hidden' name='userSltFilmValue' id='userSltFilmValue' value='' />"
						+"<input type='text' name='userSlt' id='userSltFilm' class='userSltFilm' value='请选择匹配片源' title='请选择匹配片源' readonly='readonly' onclick='return ap.ctrlFilmListFunc(this, event);' />"
						+"<div class='filmListBox-div'>"
							+"<input type='text' name='userInput' id='userInputFilm' class='userInputFilm' value='不如试试搜索' onclick='return ap.searchInputFunc(this, event);' onkeyup='return ap.filmListByKey(this);' />"
							+"<ul class='filmListBox-ul'>"
							+filmsListHTML
							+"</ul>"
						+"</div>";
			temp_html_data_left = html_data_left_0 + (z0+1) + html_data_left_1 + finalListHTML + html_updateBtn + html_data_left_2 + arr_data[z0].filmName + html_data_left_3 + html_data_left_4 + html_data_left_5;
		}

		// 已匹配
		if(arr_data[z0].matchResult == 1){
			temp_filmsListHTML= "<li value='' class='text-solong'>" + arr_data[z0].filmName + "</li>";
			temp_finalHTML = "<ul class='filmListBox-ul-ok'>" +temp_filmsListHTML +"</ul>";
			temp_html_data_left = html_data_left_0 + (z0+1) + html_data_left_1 + temp_finalHTML + html_data_left_2 + arr_data[z0].filmName + html_data_left_3 + html_data_left_5;
		}

		temp_filmData = arr_data[z0].filmData;	// 影片数据集
		// 遍历影片数据集，构建表格数据
		html_data_right_2 = "";
		for (var z1 = 0; z1 < temp_filmData.length; z1++) {
			temp_hallName = temp_filmData[z1].hallName;	// 厅名
			temp_hallData = temp_filmData[z1].hallData;	// 厅数据集

			if(temp_hallData.length == 1){
				temp_class = " class='btm-line'";
				html_data_right_2 += "<tr class='dcdbox-right-tbl-title'>"
										+"<td" + temp_class + ">" +temp_hallName + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].showDate + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].showTime + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].totalTicketCount + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].totalPrice + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].totalSeatCount + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[0].seatRate
											+"<input type='hidden' id='curRecordId' class='cur-record-id' value='" + temp_hallData[0].id + "' />"
											+"<input type='hidden' id='curHallId' value='" + temp_hallData[0].hallId + "' />"
										+ "</td>"
									+"</tr>";
			}
			
			if(temp_hallData.length > 1){
				// 遍历影厅数据集
				for (var z2 = 0; z2 < temp_hallData.length; z2++) {
					if(z2 == 0){
						html_data_right_2 += "<tr class='dcdbox-right-tbl-title' onclick=''>"
										+"<td rowspan="+ temp_hallData.length + " class='btm-line'>" +temp_hallName + "</td>"
										+"<td>" + temp_hallData[z2].showDate + "</td>"
										+"<td>" + temp_hallData[z2].showTime + "</td>"
										+"<td>" + temp_hallData[z2].totalTicketCount + "</td>"
										+"<td>" + temp_hallData[z2].totalPrice + "</td>"
										+"<td>" + temp_hallData[z2].totalSeatCount + "</td>"
										+"<td>" + temp_hallData[z2].seatRate
											+"<input type='hidden' id='curRecordId' class='cur-record-id' value='" + temp_hallData[z2].id + "' />"
											+"<input type='hidden' id='curHallId' value='" + temp_hallData[z2].hallId + "' />"
										+ "</td>"
									+"</tr>";
					}else{
						if(z2 == (temp_hallData.length - 1)){
							temp_class = " class='btm-line'";
						}else{
							temp_class = "";
						}
						html_data_right_2 += "<tr class='dcdbox-right-tbl-title'>"
										+"<td" + temp_class + ">" + temp_hallData[z2].showDate + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[z2].showTime + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[z2].totalTicketCount + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[z2].totalPrice + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[z2].totalSeatCount + "</td>"
										+"<td" + temp_class + ">" + temp_hallData[z2].seatRate
											+"<input type='hidden' id='curRecordId' class='cur-record-id' value='" + temp_hallData[z2].id + "' />"
											+"<input type='hidden' id='curHallId' value='" + temp_hallData[z2].hallId + "' />"
										+ "</td>"
									+"</tr>";
					}
				}// 影厅数据集遍历结束
			}

		}// 影片数据集遍历结束

		// 组合表格数据
		temp_html_data_right = html_data_right_1_1 + z0 + html_data_right_1_2 + html_data_right_2 + html_data_right_3;
		// 左右汇总
		temp_data_block += html_data_box_start_1 + z0 + html_data_box_start_2 + temp_html_data_left + temp_html_data_right + html_data_box_end;

	}// 汇总结果集遍历结束

	$("#detailContainer").empty().html(html_dc_title + temp_data_block + html_submitBtn);
}

/**
* 点击标题，显示/隐藏
*
* @param obj 当前对象
**/
function titleCtrlFunc(obj) {
	if((ctrl_flag_0 % 2) == 0){
		$(".dc-data-box").slideUp();
		$(obj).css("background", "rgba(0, 0, 0, 0) url('images/plus.png') no-repeat scroll left center");
	}else{
		$(".dc-data-box").slideDown();
		$(obj).css("background", "rgba(0, 0, 0, 0) url('images/minus.png') no-repeat scroll left center");
	}

	ctrl_flag_0++;
}

/**
* 明细数据块，显示/隐藏
**/
function dataBlockCtrlFunc(obj) {
	var objData = $(obj).attr("data");
	var objParentID = $(obj).parent().parent().parent().attr("id");

	var obj_left = $("#" + objParentID).find(".dcdbox-left-data-name");
	var obj_right = $("#" + objParentID).find(".dcdbox-right-tbl").find(".dcdbox-right-tbl-title");

	if(objData == 0){
		$(obj_left).fadeOut();
		$(obj_right).fadeOut();
		$(obj).attr("data", "1");
		$(obj).text("+");
	}else{
		$(obj_left).fadeIn();
		$(obj_right).fadeIn();
		$(obj).attr("data", "0");
		$(obj).text("-");
	}
}
