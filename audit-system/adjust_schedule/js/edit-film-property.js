/********************************************* 影厅类型事件 start ******************************************/
/**
* 显示厅的类型
*
* @param obj 当前对象
* @param e 事件对象
**/
function showHallType(obj, e) {
	var hall_type_arr = ["2D", "3D"];		// 影厅类型池
	var hall_name = $(obj).attr("title");	// 影厅名字
	var hall_type;	// 影厅类型

	var bootstrapLayer2 = $("div[id^='xubox_layer']").css("z-index");	// 当前层次顺序
	var parentId = $(obj).parent("a").prev("span").attr("id");

	for (var i = 0; i < hallData.length; i++) {
		if(hallData[i].hallName == hall_name){
			hall_type = "【" + hall_type_arr[hallData[i].hallType] + "】厅";
			$("#" + parentId).html(hall_type);
		}
	}

	$("#" + parentId).css("z-index", bootstrapLayer2 + 1);
	$("#" + parentId).slideDown();
	
}

/**
* 隐藏厅的类型
**/
function hideHallType(obj, e) {
	var parentId = $(obj).parent("a").prev("span").attr("id");
	$("#" + parentId).slideUp();
}
/********************************************* 影厅类型事件 end ******************************************/

/********************************************* 影片编辑事件 start ******************************************/
var film_lang_arr = ["", "国语", "粤语", "英语", "日语", "韩语", "法语", "俄语", "德语", "意大利语", "西班牙语", "其他"];
var film_type_arr = ["", "2D", "3D", "巨幕", "IMAX", "胶片(进口)", "其他特种电影", "其他", "动画片", "纪录片", "科教片"];
/**
* 打开影片编辑层
*
* @param obj 当前按钮对象
**/
function openEditFilmLayer(obj) {
	$(".show-film-name").attr("disabled", "disabled");
	$(".show-film-code").attr("disabled", "disabled");
	var cur_film_list_obj = $(".film_type").find("li").find("a.current");
	var cur_index = $(cur_film_list_obj).parent().index();	// 右侧当前影片列表类型的索引
	
	// 执行打开
	this.doOpen = function() {
		$("#belong_film_block_id").val($(obj).parent().attr("id"));	// 当前按钮所属影片块ID
		$("#original_film_id").val($(obj).parent().attr("data"));	// 当前按钮所属影片ID
		$("#original_film_name").val($(obj).next(".rightR").attr("title"));	// 当前按钮所属影片名字
		$("#original_film_duration").val($(obj).next(".rightR").find("p.time").attr("data"));	// 当前按钮所属影片时长
		$("#original_film_time").val(($(obj).next(".rightR").find("p.time").text()).trim());	// 当前按钮所属影片时段
		$("#original_film_langId").val($(obj).next(".rightR").attr("lang"));	// 当前按钮所属影片语言
		$("#original_film_type_code").val($(obj).next(".rightR").attr("code"));	// 当前按钮所属影片编码
		$(".show-film-name").val($("#original_film_name").val());	// 显示影片名字

		// 预设语言值
		if(($(obj).next(".rightR").attr("lang")) != ""){
			var original_film_langId = $(obj).next(".rightR").attr("lang");	// 影片源语言ID
			$("#langKind").attr("data", original_film_langId);
			$("#langKind").val(film_lang_arr[original_film_langId]);
		}

		var dataObj = getFilmTypeAndCode($(obj).parent().attr("data"));
		var radio_html = "";
		if(dataObj.code == ""){
			// 无影片编码时，设初始值:0
			radio_html = "<span class='no-type'><input type='radio' name='filmType' id='default' class='input-chk' value='0' checked='checked' />"
							+"<label for='default' class='label-2'>默认</label></span><span class='default-type'>无可选影片类型，将使用默认类型</span>";
		}else{
			if((dataObj.code).indexOf(",") != -1){	// 多种类型
				var temp_code_arr = [], radio_htmls = "", checked_html = "";
				var code_arrs = (dataObj.code).split(",");
				for(var i = 0; i < code_arrs.length; i++) {
					temp_code_arr = code_arrs[i].split("-");

					if(dataObj.defaultT == temp_code_arr[0]){	// 将默认类型设为选中状态
						checked_html = " checked='checked'";
						$(".show-film-code").val(temp_code_arr[1]);	// 显示影片编码
					}else{
						checked_html = "";
					}

					radio_htmls += "<span><input type='radio' name='filmType' id='radio_"+ i + "' class='input-chk' "
								+"value='" + temp_code_arr[1] + "'" + checked_html + " onclick='changeFilmCodeShow(this.value);' />"
								+"<label for='radio_" + i + "' class='label-2'>" + film_type_arr[temp_code_arr[0]] + "</label></span>";
				}

				radio_html = radio_htmls;
			}else{	// 一种类型
				var code_arr = (dataObj.code).split("-");
				radio_html = "<span><input type='radio' name='filmType' id='default' class='input-chk' value='" + code_arr[1] + "' checked='checked' />"
							+"<label for='default' class='label-2'>" + film_type_arr[code_arr[0]] + "</label></span>";
				$(".show-film-code").val(code_arr[1]);	// 显示影片编码
			}
		}

		$("#edit_film_type").find("p").html(radio_html);
		
		var seeAreaHeight = document.documentElement.clientHeight;	// 页面可视区域高度:$(window).height(),也可以
		var sclTop = $(window).scrollTop();
		var bootstrapLayer2 = $("div[id^='xubox_layer']").css("z-index");
		var mt_height = Math.ceil(seeAreaHeight/2)*(-1);

		$(".zhezhao2").css({ display : "block", height : $(document).height(), "z-index": bootstrapLayer2+1});
		$("#edit_film_box").css({"display":"block", "left":"25%", "top":(30 + sclTop) + "px", "z-index":bootstrapLayer2+2});
	}

	if(cur_index == 0){
		moveOption._showFilm(1, film_color);	// 编辑的时候，切换到"全部影片"，取该影片的相关值

		setTimeout("doOpen()", 500);	// 延迟500毫秒执行，以便能获取到相关值
	}else {
		doOpen();
	}
}

/**
* 关闭影片编辑层
**/
function closeEditFilmLayer() {
	$(".zhezhao2").css("display","none");
	$("#edit_film_box").hide();

	// 初始化相关项的默认值
	$("#langKind").val("请选择所属语种");
	$("#langKind").attr("data", "-1");
	$("#edit_film_type").find("input[type='radio']").attr("checked", false);
	$("#belong_film_block_id").val("");
	$("#original_film_id").val("");	// 当前按钮所属影片ID
	$("#original_film_name").val("");	// 当前按钮所属影片名字
	$("#original_film_duration").val("");	// 当前按钮所属影片时长
	$("#original_film_time").val("");	// 当前按钮所属影片时段
	$("#original_film_langId").val("");	// 当前按钮所属影片语言
	$("#original_film_time").val("");	// 当前按钮所属影片编码
}

/**
* 语言选择框事件 — 显示、隐藏语言面板
**/
function showLanguagePannel(obj) {
	$(".lang-kind-list").slideDown();
}
function hideLanguagePannel(obj) {
	$(".lang-kind-list").slideUp();
}

/**
* 类型选择事件(多类型时):动态显示影片编码
**/
function changeFilmCodeShow(thisValue) {
	$(".show-film-code").val(thisValue);	// 动态显示影片编码
}

/**
* 保存影片编辑
**/
function saveEditFilm(obj) {
	var film_id = $("#belong_film_block_id").val();
	// $("#" + film_id).attr("data", "测试");
	
	var langKindData = $("#langKind").attr("data");	// 语言
	var v_film_type_obj = $("#edit_film_type").find("input[type='radio']"), v_film_type = "", name_film_type;
	// 获取所选影片类型
	// for(var i = 0; i < v_film_type_obj.length; i++){
	// 	if(v_film_type_obj[i].checked == true){
	// 		v_film_type += v_film_type_obj[i].value + ",";
	// 	}
	// }

	// 获取所选影片类型(单选按钮方式)
	for(var i = 0; i < v_film_type_obj.length; i++){
		if(v_film_type_obj[i].checked == true){
			v_film_type = v_film_type_obj[i].value;
			name_film_type = $(v_film_type_obj[i]).next("label").text();	// 所选类型名字
			break;
		}
	}

	if(langKindData == "-1"){
		tipMsg_Single('langKind', 0, "请选择 所属语种", 0, '', '');
		return false;
	}else if(v_film_type == ""){
		tipMsg_Single('langKind', 0, "请选择 影片类型", 0, '', '');
		return false;
	}else{
		// if(v_film_type.lastIndexOf(",") != -1){	// 针对复选框的形式，选多个的时候
		// 	// 处理影片类型
		// 	v_film_type = v_film_type.substring(0, v_film_type.length - 1);
		// }

		if(v_film_type == 0){	// 没有影片类型
			if(($("#original_film_type_code").val()) != ""){	// 影片有源类型
				v_film_type = $("#original_film_type_code").val();
			}else{	// 影片没有源类型，设为空
				v_film_type = "";
			}
		}
		
		// 将语言和编码保存到页面
		$("#" + film_id).find(".rightR").attr("lang", langKindData);
		$("#" + film_id).find(".rightR").attr("code", v_film_type);

		// 更新类型提示内容
		name_film_type = name_film_type == "默认" ? "" : name_film_type;
		$("#" + film_id).find(".film-type-block").text(name_film_type);

		// 操作成功后，关闭影片编辑层
		closeEditFilmLayer();
	}
}

/**
* 从右侧列表(全部影片)获取所编辑影片的影片类型和编码
*
* @param filmID 当前编辑影片的ID
* @return 对象(默认影片类型值[id值], 影片类型与编码对应数组值)
**/
function getFilmTypeAndCode(filmID) {
	var data_obj = {defaultT: "", code: ""};
	
	var all_films = $("#film_list #film_model").find("p");
	for(var i = 0; i < all_films.length; i++) {
		if($(all_films[i]).attr("id") == filmID) {
			data_obj.code = $(all_films[i]).attr("code");
			data_obj.defaultT = $(all_films[i]).attr("default");
			break;
		}
	}

	return data_obj;
}


$(function() {
	var langKind = $("#langKind").val();
	// 初始化语言选择框提示信息
	if(langKind != "请选择所属语种"){
		$("#langKind").val("请选择所属语种");
		$("#langKind").attr("data", "-1");
	}

	// 语言点击事件
	$(".lang-kind-list a").click(function() {
		$("#langKind").val($(this).text());
		$("#langKind").attr("data", $(this).attr("value"));
	});
});
/********************************************* 影片编辑事件 end ******************************************/