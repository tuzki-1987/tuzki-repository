/*
*
* @author ccq by 2015-11-10
*/


// 自动提示类
function autoPrompt(){}

var controlShowHide = 0;	// 循环显示、隐藏的控制变量
var objX, objY;				// 用于隐藏当前对象的 "坐标比较变量"

/**
* 控制列表显示、隐藏
*
* @param obj 当前点击对象
* @param e 事件手柄
**/
autoPrompt.prototype.ctrlFilmListFunc = function(obj, e) {
	e = e || event;
	objX = e.clientX;	// 当前对象的 X轴坐标
	objY = e.clientY;	// 当前对象的 Y轴坐标

	$(".filmListBox-div").hide();	// 先隐藏所有

	$(obj).next(".filmListBox-div").find(".userInputFilm").val("不如试试搜索");	// 重置搜索框文字
	$(obj).next(".filmListBox-div").find(".filmListBox-ul").html(saveFilmListsHTML);	// 重置影片列表
	$(obj).next(".filmListBox-div").css("height", "280px");		// 重置列表容器高度
	ap.bindFuncForBrowser(obj, $(obj).next(".filmListBox-div").find(".userInputFilm").attr("id"));

	if(controlShowHide % 2 == 0){
		$(obj).next(".filmListBox-div").show();
		$(obj).next(".filmListBox-div").prop("scrollTop", 0);	// 将滚动条重置归顶
	}else{	
		$(obj).next(".filmListBox-div").hide();
	}
	controlShowHide++;
};

/**
* 搜索框事件
*
* @param obj 当前点击对象
* @param e 事件手柄
**/
autoPrompt.prototype.searchInputFunc = function(obj, e) {
	e = e || event;
	objX = e.clientX;	// 当前对象的 X轴坐标
	objY = e.clientY;	// 当前对象的 Y轴坐标

	$(obj).val("");		// 聚焦时清空内容
	// ap.filmListByKey(obj);
	$(obj).parent(".filmListBox-div").find(".filmListBox-ul").html(saveFilmListsHTML);	// 清空内容后，重置影片列表
	$(obj).parent(".filmListBox-div").css("height", "280px");		// 重置列表容器高度
};

/**
* 点击页面非当前对象的地方，隐藏当前对象
* @description 当前点击的对象的坐标，与在body体中的坐标不一致，即 非同一目标/当前目标，则隐藏
*
* @param e 事件手柄
**/
document.body.onclick = function(e) {
	e = e || event;
	var x = e.clientX;	// 点击位置在页面中的 X轴坐标

	if(x != objX && x != undefined && objX != undefined){
		$(".filmListBox-div").hide();	// 隐藏对象

		controlShowHide = 0;			// 重置控制变量
	}
}

/**
* 检索影片列表（根据手动输入，自动提示）
*
* @param obj 当前点击对象
* @param e 事件手柄
**/
autoPrompt.prototype.filmListByKey = function(obj) {
	var liObj = $(obj).parent(".filmListBox-div").find(".filmListBox-ul").find("li");	// 列表对象
	var searchInputValue = $(obj).val().trim();

	if(searchInputValue != "" && searchInputValue.length > 0){
		for (var i = 0; i < liObj.length; i++) {
			var liFilmName = $(liObj[i]).text();
			if(liFilmName.indexOf(searchInputValue) == -1){
				$(liObj[i]).hide();
			}else{
				$(liObj[i]).show();
			}
			$(obj).parent(".filmListBox-div").css("height", "auto");
		}
	}else{	// 输入框为空时，默认全部影片，并重置高度
		$(obj).parent(".filmListBox-div").find(".filmListBox-ul").html(saveFilmListsHTML);
		$(obj).parent(".filmListBox-div").css("height", "280px");
	}
}

/**
* 根据浏览器版本添加对应事件
**/
autoPrompt.prototype.bindFuncForBrowser = function(obj, objId) {
	var element = document.getElementById(objId);

	if(/msie/.test(navigator.userAgent.toLowerCase())){	// IE
		element.onpropertychange = ap.filmListByKey(obj);
	}else{	// 非IE
		if(/firefox/.test(navigator.userAgent.toLowerCase())){	// 火狐
			element.addEventListener("input", ap.filmListByKey(obj), true);
			// if(browserObj.version == "11.0"){	// IE-11 版本属性竟然与火狐一样
			// 	element.onpropertychange = ap.filmListByKey(obj);
			// }else{
			// 	element.addEventListener("input", ap.filmListByKey(obj), true);
			// }
		}
	}
}

/**
* 选中赋值
*
* @param obj 当前对象
**/
function setValueBySlt(obj){
	$(obj).parent(".filmListBox-ul").parent(".filmListBox-div").prev(".userSltFilm").val($(obj).text());	// 选取赋值 - 影片名
	$(obj).parent(".filmListBox-ul").parent(".filmListBox-div").prev(".userSltFilm").attr("title", $(obj).text());	// 鼠标指向时的提示信息 - 影片名
	$(obj).parent(".filmListBox-ul").parent(".filmListBox-div").prev(".userSltFilm").prev("#userSltFilmValue").val($(obj).attr("value"));	// 选取赋值 - 影片id
	$(obj).parent(".filmListBox-ul").parent(".filmListBox-div").hide();	// 隐藏对象

	controlShowHide = 0;	// 重置控制变量

	// 同时修改影片名字
	var parentObjId = $(obj).parent(".filmListBox-ul").parent(".filmListBox-div").parent().parent().parent().parent().attr("id");
	$("#" + parentObjId).find(".unmatch-film-name").text($(obj).text());
}

/**
* 鼠标经过
*
* @param obj 当前对象
**/
function handleMouseover(obj){
	$(obj).css("background-color", "#eee");
}

/**
* 鼠标移出
*
* @param obj 当前对象
**/
function handleMouseout(obj){
	$(obj).css("background-color", "#fefefe");
}
