/******************************************** 设置影厅类型 start ******************************************/
/**
* 根据影厅类型关联影厅名字，将颜色关联到影厅名字
*
* @param hall_color 选完颜色的[厅与颜色]对应的数组
* @return hall_color_arr 重新关联后的颜色数组
**/
function reviewHallColor(hall_color, hallObj) {
	var hall_color_obj = {}, hall_color_arr = [];
	var hallObjLen = hallObj.length, hcLen = hall_color.length;
	var temp_hall_name = "", temp_hall_type = "";

	for(var i = 0; i < hallObjLen; i++) {
		temp_hall_name = hallObj[i].hallName;
		temp_hall_type = hallObj[i].hallType;

		for(var j = 0; j < hcLen; j++) {
			// 颜色数组里的影厅类型 与 接口返回数据中 一致，将影厅名字与该颜色关联
			if(temp_hall_type*1 == (hall_color[j].obj)*1) {
				hall_color_obj = {
					"hallName":temp_hall_name,
					"color":hall_color[j].color
				};
				hall_color_arr[hall_color_arr.length] = hall_color_obj;
			}
		}
	}

	return hall_color_arr;
}

/**
* 绘制影厅类型图例
*
* @param hall_color_type 与影厅类型关联的颜色数组
**/
function createHallTypeLegend(hall_color_type) {
	var len = hall_color_type.length;
	var legend_html = "", temp_hall_type;
	$(".hall-type-imgLegend").empty();
	
	for(var i = 0; i < len; i++) {
		temp_hall_type = hall_color_type[i].obj;
		legend_html = "<span style='background-color:" + hall_color_type[i].color +  "; padding:0 6px; height:15px;'>&nbsp;</span>"
					+"<span style='margin: 0 15px 0 5px; font-weight: bold; color: #666;'>" + film_type_arr[temp_hall_type*1+1] + "&nbsp;厅</span>";

		$(".hall-type-imgLegend").append(legend_html);
	}
}
/********************************************* 设置影厅类型 end ******************************************/

/********************************************* 设置影片类型 start ******************************************/
var global_all_film_type;	// 全局 影片对应类型 数组
/**
* 分类获取排期列表中影片的类型
*
* @param dataObj 接口数据
* @return Array [[影片id, 类型id]]
**/
function getFilmTypeGroupByID(dataObj) {
	var all_film_type = [];	// 所有影片对应类型
	var data_arr = countGroupByFilmID(dataObj);

	for(var i = 0; i < data_arr.length; i++) {
		var film_type = [];	// 临时影片对应类型(在此声明数组，保证每个影片的数据准确性)
		var getObj = getFilmTypeAndCode(data_arr[i]);
		
		film_type[0] = data_arr[i];
		if(getObj.code != "") {
			film_type[1] = getObj.defaultT;
		}else {	// 影片无类型
			film_type[1] = "";
		}

		all_film_type[i] = film_type;
	}
	global_all_film_type = all_film_type;

	return all_film_type;
}

/**
* 为影片块添加类型
*
* @param dataObj 接口数据
**/
function setFilmBlockType(dataObj) {
	var film_types = getFilmTypeGroupByID(dataObj);
	var film_blocks = $(".film"), cur_film_id;

	for(var i = 0; i < film_blocks.length; i++) {
		cur_film_id = $(film_blocks[i]).attr("data");

		for(var j = 0; j < film_types.length; j++) {
			if(cur_film_id == film_types[j][0]) {
				$(film_blocks[i]).find(".film-type-block").text(film_type_arr[film_types[j][1]]);
				break;
			}
		}
	}
}
/********************************************* 设置影片类型 end *****************************************/