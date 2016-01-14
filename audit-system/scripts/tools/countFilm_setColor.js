/**
* 功能说明：
* 1、分类统计对象
* 2、为影片选取颜色
* 3、为影片块添加颜色
*
* @author ccq by 2015-11-10
**/

/*
* 颜色池
*
* @description 索引0: 影片列表使用色(10种色), 索引1: 影厅列表使用色(4种色)
*/
var color_pool = [
["#E69000", "#019BE3", "#015794", "#B64A02", "#6C0000", "#5D5D5D", "#8CC14C", "#DA314B", "#8085E9", "#75476E"],
["#E0D68E", "#009075", "#689E6C", "#B09462"]
];

/**
* 为影片块添加颜色 - 排期展示
*
* @param objColorArr 	对象与颜色值对应的数组
**/
function setFilmColorForShowSch(objColorArr) {
	var film;
	var filmObj = $(".waitB");
	for (var v = 0; v < filmObj.length; v++) {
		film = $(filmObj[v]).find("p:eq(1)").text().trim();

		for(var i = 0; i < objColorArr.length; i++) {
			if(objColorArr[i].obj == film){
				$(filmObj[v]).css("background-color", objColorArr[i].color);
			}
		}
	}
}

/**
* 为影片块添加颜色 - 调整插件
*
* @param objColorArr 	对象与颜色值对应的数组
**/
function setFilmColorForAdjust(objColorArr) {
	var film;
	var filmObj = $("#showTime_film").find("li").find(".film");
	for (var v = 0; v < filmObj.length; v++) {
		film = $(filmObj[v]).find("p.time").next().text().trim();

		for(var i = 0; i < objColorArr.length; i++) {
			if(objColorArr[i].obj == film){
				$(filmObj[v]).css("background-color", objColorArr[i].color);
			}
		}
	}
}

/**
* 为厅列表添加颜色 - 调整插件
*
* @param objColorArr 	对象与颜色值对应的数组
**/
function setHallColorForAdjust(objColorArr) {
	var hallObj = $(".hall-label");
	var hallNum = $(".hall-label").length;
	var temp_hallName = "";	// 页面上的厅名
	
	for(var i = 0; i < hallNum; i++) {
		temp_hallName = $(hallObj[i]).attr("title");

		for(var j = 0; j < objColorArr.length; j++) {
			if(temp_hallName == objColorArr[j].hallName) {
				$(hallObj[i]).css("background", "none");
				$(hallObj[i]).parent("a").css({"background-color":objColorArr[j].color, "border-color":objColorArr[j].color, "color":"#fff"});
				break;
			}
		}
	}
}

/**
* 为对象选取颜色
*
* @param count_result 根据接口数据的统计结果
* @param use_color_index 当前所使用的颜色池中的颜色索引
* @param flag 随机开关
*
* @return obj_color_arr
**/
function selectColorForObj(count_result, use_color_index, flag) {
	// 临时颜色容器
	var colorArr = color_pool[use_color_index];
	var colorArrL = colorArr.length;

	var obj_color_obj = {}, obj_color_arr = [];	// 对象与其颜色值 对象、数组

	var result_length = count_result.length;	// 影片数量

	var random_color_num;	// 颜色数量(随机取)
	var temp_colorArr = [];	// 随机颜色数组
	var temp_color;	// 随机颜色值
	var temp_random;	// 随机数

	// 从颜色容器中，随机取 与 统计结果 同数量的 唯一色值
	for(var v = 0; v < colorArrL; v++) {
		random_color_num = Math.random()*colorArrL;
		if(flag) {
			temp_random = parseInt(random_color_num, 10);
		}else {
			temp_random = v;
		}
		
		temp_color = colorArr[temp_random];

		if(v == 0) {
			temp_colorArr[v] = temp_color;
		}else {
			var temp_num = 0;
			for(var i = 0; i < temp_colorArr.length; i++) {
				if(temp_colorArr[i] == temp_color) {
					temp_num++;
				}
			}
			if(temp_num == 0){	// 由for循环保证颜色值唯一
				temp_colorArr[temp_colorArr.length] = temp_color;
			}
		}

		if(temp_colorArr.length == result_length) {
			break;
		}
	}

	// 为对象关联颜色
	for(var k in count_result) {
		obj_color_obj = {
			"obj":count_result[k],
			"color":temp_colorArr[k]
		};
		obj_color_arr[k] = obj_color_obj;
	}

	return obj_color_arr;
}

/**
* 按【影片名字】分类统计影片
*
* @param 接口数据
* @return Array
**/
function countGroupByFilmName(dataObj) {
	var film_arr = [];
	var temp_obj = {};

	if(dataObj.length > 0){
		for(var i in dataObj) {
			var vs_data = dataObj[i].viewSchedule;
			for(var j in vs_data) {
				if(!temp_obj[vs_data[j].filmName] && vs_data[j].filmName != "") {
					temp_obj[vs_data[j].filmName] = vs_data[j].id;
					film_arr[film_arr.length] = vs_data[j].filmName;
				}else{
					
				}
			}
		}
	}

	return film_arr;
}

/**
* 按【影片ID】分类统计影片
*
* @param dataObj 接口数据
* @return Array
**/
function countGroupByFilmID(dataObj) {
	var film_arr = [];
	var temp_obj = {};

	if(dataObj.length > 0){
		for(var i in dataObj) {
			var vs_data = dataObj[i].viewSchedule;
			for(var j in vs_data) {
				if(!temp_obj[vs_data[j].id] && vs_data[j].id != "") {
					temp_obj[vs_data[j].id] = vs_data[j].filmName;
					film_arr[film_arr.length] = vs_data[j].id;
				}else{
					
				}
			}
		}
	}

	return film_arr;
}

/**
* 按【影厅名字】分类统计影厅
*
* @param 接口数据
* @return Array
**/
function countGroupByHallName(dataObj) {
	var hall_arr = [];
	var temp_obj = {};

	if(dataObj.length > 0){
		for(var i in dataObj) {
			if(!temp_obj[dataObj[i].hallName] && dataObj[i].hallName != "") {
				temp_obj[dataObj[i].hallName] = dataObj[i].id;
				hall_arr[hall_arr.length] = dataObj[i].hallName;
			}else{
					
			}
		}
	}

	return hall_arr;
}

/**
* 按【影厅类型】分类统计影厅
*
* @param dataObj 接口数据
* @return Array
**/
function countGroupByHallType(dataObj) {
	var hall_arr = [];
	var temp_obj = {};
	var temp_type = "";

	if(dataObj.length > 0){
		for(var i in dataObj) {
			temp_type = dataObj[i].hallType+"";	// 转为字符串(否则遇到0, 会出问题)
			if(!temp_obj[temp_type] && temp_type != "") {
				temp_obj[temp_type] = dataObj[i].hallName;
				hall_arr[hall_arr.length] = temp_type;
			}else{
					
			}
		}
	}

	return hall_arr;
}

/**
* 已选影片列表 — 准备数据
* 
* @description 实时遍历排期列表，按影片ID分类影片，取每部影片的 id、名字、时长、背景色
**/
function sltedFilmList() {
	var data_json = {}, data_json2 = {}, filmArr = [];
	
	$.each($(".film"), function(index, val) {
		if(!data_json[$(val).attr("data")]){
			data_json[$(val).attr("data")] = {
				"id":$(val).attr("data"),
				"name":$(val).find("p.time").next().text(),
				"time":$(val).find("p.time").attr("data"),
				"color":$(val).css("background-color")
			};
			data_json2 = {
				"id":$(val).attr("data"),
				"name":($(val).find("p.time").next().text()).trim(),
				"time":$(val).find("p.time").attr("data"),
				"color":$(val).css("background-color")
			};

			filmArr[filmArr.length] = data_json2;
		}else{
			
		}
	});

	return filmArr;
}