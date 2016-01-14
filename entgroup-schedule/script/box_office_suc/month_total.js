/**
 * 本月累计
 **/

$(function() {
 	resultA = {};	// 全局对象，存放接口返回数据
 	contnerObj = "#chartContainer";	// 图表容器对象(全局)
 	columnCharFilm = [];	// 全局数组变量，存放柱状图的影片数量
 	var initCharType = "pieChar";
 	var showCharType = "";	// 设置图表类型

 	// 初始化单日的日期
 	$("#mtOneDayDate").text("("+getCurDate()+")");
 	// 初始化日期控件的值
 	$("#mtOneDaySltDate").val(getCurDate());
 	// 初始化 数据展示 菜单样式
 	$("#mtShowDataKinds").find("li").unbind("click");	// 移除所有点击绑定
 	$("#mtShowDataKinds").find("li").removeClass("active");
 	$("#mtShowDataKinds").find("li:eq(0)").addClass("active");

 	// 图表初始化
 	var pieCharDateInit = $("#mtOneDayDate").text();
 	pieCharDateInit = pieCharDateInit.substring(1, pieCharDateInit.length - 1);
	var dataR = monthTotalInterface("mtTicketTotal", getCurDate(), "");	// 初始数据集
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("li.active").text();	// 初始Y轴标题
 	showCharFunc(contnerObj, dataR, initCharType, "", "", "", yAxisTitle, pieCharDateInit);	// 初始图表

 	// 单日排片
 	$("#mtOneDay").find("a").bind("click", mtSubMenuClickStyle);

 	// 分时排片
 	$("#mtTimeCycle").find("a").bind("click", mtSubMenuClickStyle);

 	// 数据展示
 	$("#mtShowDataKinds").find("a").bind("click", dataKindShow);

 	// 单日、趋势 点击事件
 	$(".mt_title_cnt").find("a").click(function(){
 		var curIndex = $(this).index();		// 当前点击对象的索引
 		var curObjId = $(this).attr("id");	// 当前点击对象的ID
 		var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单

 		// 展示图表函数所需参数
 		var charType = "";
 		var title = "";
 		var subTitle = "";
 		var yAxisTitle = "";
 		var pieCharDateCurr = $("#mtOneDayDate").text();
 		pieCharDateCurr = pieCharDateCurr.substring(1, pieCharDateCurr.length - 1);

 		$(".mt_title_cnt").find("a").removeClass("active mttcl1 mttcr1");
 		if(curIndex == 0){	// 单日(区分饼图和柱状图)
 			$(this).removeClass("mttcl1");

 			// 区分 饼图 与 柱状图
 			if(interfaceKind == "topFiveOfDay"){
				charType = "columnChar";
				showCharType = "column";
			}else{
				charType = "pieChar";
				showCharType = "";
			}
 			
 			title = "";
 			subTitle = "";
 		}

 		if(curIndex == 1){	// 趋势(区分柱状图和曲线图)
 			$(this).addClass("mttcr1");
 			$(".mt_title_cnt").find("a:eq(0)").addClass("mttcl1");

 			if(interfaceKind == "topFiveOfDay"){
				charType = "columnChar";	// 使用柱状图展示
				showCharType = "spline";	// 使用柱状图展示曲线图
			}else{
				// 非单日前五, 已曲线图展示
				charType = "lineChar";
				showCharType = "";
			}
 			
 			title = "";
 			subTitle = "";
 			yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();
 		}
 		
 		showCharFunc(contnerObj, resultA, charType, showCharType, title, subTitle, yAxisTitle, pieCharDateCurr);
 	});

	// 开始分析
 	$("#startAnalysis").click(function() {
 		var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
		var singleDate = $("#mtOneDaySltDate").val();		// 当前点击的单日排片日期
		var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单

		var dataR = monthTotalInterface(interfaceKind, singleDate, timeCycle);
		resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
		var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

		// 区分 饼图 与 柱状图
		if(interfaceKind == "topFiveOfDay"){
			initCharType = "columnChar";
			showCharType = "column";
			columnCharFilm = countFilmByID(dataR.data);	// 接口数据已按人次降序
		}else{
			initCharType = "pieChar";
			showCharType = "";
		}

		showCharFunc(contnerObj, dataR, initCharType, showCharType, "", "", yAxisTitle, singleDate);
 	});
});

/**
* （本月累计）二级菜单点击事件 —— 样式及日期值重置
*
**/
function mtSubMenuClickStyle() {
	var clickParentObj = $(this).parent().attr("id");
	var clickObjIndex = $(this).index();
 	var clickObjName = $(this).attr("name");

 	// 重置展示区选项卡样式
 	$(".mt_title_cnt").find("a").removeClass("active mttcl1 mttcr1");
 	$(".mt_title_cnt").find("a:eq(0)").addClass("active");

 	$("#" + clickParentObj).find("a").unbind("click");	// 移除所有点击绑定
 	$("#" + clickParentObj).find("a").removeClass("today-menu-act active");
 	if(clickParentObj == "mtShowDataKinds") {
 		if(clickObjIndex == 0)
 			$("#" + clickParentObj).find("a:eq(0)").addClass("today-menu-act");
 	}
 	$("#" + clickParentObj).find("a:eq(" + clickObjIndex + ")").addClass("active");	// 为当前点击添加激活样式
 	
	var curAobjNums = $("#" + clickParentObj).find("a");
	for (var i = 0; i < curAobjNums.length; i++) {	// 为当前子模块重新绑定点击事件。除了当前激活的，为了避免重复点击请求接口
		if(i != clickObjIndex) {
			if(clickParentObj == "mtShowDataKinds") {
				$("#" + clickParentObj).find("a:eq(" + i + ")").bind("click", dataKindShow);
			}else {
				$("#" + clickParentObj).find("a:eq(" + i + ")").bind("click", mtSubMenuClickStyle);
			}
		}
	}

	if(clickParentObj == "mtOneDay"){
		if(clickObjIndex == 0){
			$("#mtOneDayDate").text("(" + SetDateStr(-1, "") + ")");	// 单日选项卡
			$("#mtOneDaySltDate").val(SetDateStr(-1, ""));	// 日期插件
		}
			
		if(clickObjIndex == 1){
			$("#mtOneDayDate").text("(" + SetDateStr(0, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(0, ""));
		}
			
		if(clickObjIndex == 2){
			$("#mtOneDayDate").text("(" + SetDateStr(1, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(1, ""));
		}
	}

	// 组织调用接口参数
	/*var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
	var singleDate = $("#mtOneDaySltDate").val();		// 当前点击的单日排片日期
	var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单
	// 获取日期参数
	if(singleDate == ""){
		singleDate = $("#mtOneDay").find("#mtOneDaySltDate").val();
	}else{
		singleDate = singleDate.substring(1, singleDate.length - 1);
	}

	var dataR = monthTotalInterface(interfaceKind, singleDate, timeCycle);
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

	// 区分 饼图 与 柱状图
	if(interfaceKind == "topFiveOfDay"){
		initCharType = "columnChar";
		showCharType = "column";
		columnCharFilm = countFilmByID(dataR.data);	// 接口数据已按人次降序
	}else{
		initCharType = "pieChar";
		showCharType = "";
	}

	showCharFunc(contnerObj, dataR, initCharType, showCharType, "", "", yAxisTitle, singleDate);*/
}

/**
* 4种类型数据菜单
**/
function dataKindShow() {
	var clickParentObj = $(this).parent().attr("id");
	var clickObjIndex = $(this).index();
 	var clickObjName = $(this).attr("name");

 	// 重置展示区选项卡样式
 	$(".mt_title_cnt").find("a").removeClass("active mttcl1 mttcr1");
 	$(".mt_title_cnt").find("a:eq(0)").addClass("active");

 	$("#" + clickParentObj).find("a").unbind("click");	// 移除所有点击绑定
 	$("#" + clickParentObj).find("a").removeClass("today-menu-act active");
 	if(clickParentObj == "mtShowDataKinds") {
 		if(clickObjIndex == 0)
 			$("#" + clickParentObj).find("a:eq(0)").addClass("today-menu-act");
 	}
 	$("#" + clickParentObj).find("a:eq(" + clickObjIndex + ")").addClass("active");	// 为当前点击添加激活样式
 	
	var curAobjNums = $("#" + clickParentObj).find("a");
	for (var i = 0; i < curAobjNums.length; i++) {	// 为当前子模块重新绑定点击事件。除了当前激活的，为了避免重复点击请求接口
		if(i != clickObjIndex) {
			if(clickParentObj == "mtShowDataKinds") {
				$("#" + clickParentObj).find("a:eq(" + i + ")").bind("click", dataKindShow);
			}else {
				$("#" + clickParentObj).find("a:eq(" + i + ")").bind("click", mtSubMenuClickStyle);
			}
		}
	}

	if(clickParentObj == "mtOneDay"){
		if(clickObjIndex == 0){
			$("#mtOneDayDate").text("(" + SetDateStr(-1, "") + ")");	// 单日选项卡
			$("#mtOneDaySltDate").val(SetDateStr(-1, ""));	// 日期插件
		}
			
		if(clickObjIndex == 1){
			$("#mtOneDayDate").text("(" + SetDateStr(0, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(0, ""));
		}
			
		if(clickObjIndex == 2){
			$("#mtOneDayDate").text("(" + SetDateStr(1, "") + ")");
			$("#mtOneDaySltDate").val(SetDateStr(1, ""));
		}
	}

	var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
	var singleDate = $("#mtOneDaySltDate").val();		// 当前点击的单日排片日期
	var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单

	var dataR = monthTotalInterface(interfaceKind, singleDate, timeCycle);
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

	// 区分 饼图 与 柱状图
	if(interfaceKind == "topFiveOfDay"){
		initCharType = "columnChar";
		showCharType = "column";
		columnCharFilm = countFilmByID(dataR.data);	// 接口数据已按人次降序
	}else{
		initCharType = "pieChar";
		showCharType = "";
	}

	showCharFunc(contnerObj, dataR, initCharType, showCharType, "", "", yAxisTitle, singleDate);
}

/**
* 日期框选择事件
**/
function WdatePickedFunc() {
	var sltDate = $dp.cal.getDateStr();
	var charType = "";

	var yestD = SetDateStr(-1, "");	// 昨天
	var todyD = SetDateStr(0, "");	// 今天
	var tmrwD = SetDateStr(1, "");	// 明天

	$("#mtOneDay").find("a").removeClass("active");	// 清空样式
	
	if(sltDate == tmrwD)
		$("#mtOneDay").find("a:eq(2)").addClass("active");
	if(sltDate == todyD)
		$("#mtOneDay").find("a:eq(1)").addClass("active");
	if(sltDate == yestD)
		$("#mtOneDay").find("a:eq(0)").addClass("active");

	// 重置展示区选项卡样式和日期值
 	$(".mt_title_cnt").find("a").removeClass("active mttcl1 mttcr1");
 	$(".mt_title_cnt").find("a:eq(0)").find("#mtOneDayDate").text("(" + sltDate + ")");

	// 组织调用接口参数
	/*var interfaceKind = $("#mtShowDataKinds").find("a.active").attr("name");	// 当前点击的数据展示菜单
	var timeCycle = $("#mtTimeCycle").find("a.active").attr("name");			// 当前点击的分时排片菜单

	var dataR = monthTotalInterface(interfaceKind, sltDate, timeCycle);
	resultA = dataR;	// 及时更新 resultA 的值，供其他调用使用（单日、趋势）
	var yAxisTitle = $("#mtShowDataKinds").find("a[class='active']").text();

	if(interfaceKind == "topFiveOfDay"){
		charType = "columnChar";
		showCharType = "column";
	}else{
		charType = "pieChar";
		showCharType = "";
	}

	showCharFunc(contnerObj, dataR, charType, showCharType, "", "", yAxisTitle, sltDate);*/
}

/**
* 调用指定接口（同步调用）
*
* @param interfaceKind 接口类别（调用哪类接口）
* @param singleDate 日期
* @param timeCycle 时间段
**/
function monthTotalInterface(interfaceKind, singleDate, timeCycle) {
	$("#chartContainer").empty();	// 清空容器
	var char_load_id = document.getElementById("char_load");	// 加载动画
	if(char_load_id == undefined){
		var load_html = "<p style='text-align: center;' id='char_load'><img src='images/load.gif' width='20' height='20' /></p>";
    	$("#chartContainer").before(load_html);
	}else{
		$(".nowUpLoad").hide();
		$(char_load_id).show();
	}

	var cinemaId = getCookie("cinemaId");
	
	if(cinemaId.trim() != ""){
		// 排片率
		if(interfaceKind == "mtSetFilmRate"){
			resultA = {};
		}

		// 场次数
		if(interfaceKind == "mtTicketTotal"){
			server.filmTicketTotal(cinemaId, singleDate, function(callback){
				if(callback.ret){
					resultA = callback;
				}else{	// 无数据
					resultA = {};
				}
			});
		}

		// 票房占比
		if(interfaceKind == "mtTicketRate"){
			resultA = {};
			server.ticketRateTotal(cinemaId, singleDate, function(callback){
				if(callback.ret){
					resultA = callback;
				}else{	// 无数据
					resultA = {};
				}
			});
		}

		// 人次占比
		if(interfaceKind == "mtPersonRate"){
			resultA = {};
			server.personRateTotal(cinemaId, singleDate, function(callback){
				if(callback.ret){
					resultA = callback;
				}else{	// 无数据
					resultA = {};
				}
			});
		}

		// 单日前五
		if(interfaceKind == "topFiveOfDay"){
			resultA = {};
			server.topFiveTotal(cinemaId*1, singleDate, function(callback){
				if(callback.ret){
					resultA = callback;
				}else{	// 无数据
					resultA = {};
				}
			});
		}

		return resultA;
	}else{
		tipMsg_Single("mtShowDataKinds", 0, "登录状态已过期，请重新登录", 0, '', '');
		resultA = {};
		return resultA;
	}
}

/**
* 按【影片ID】分类统计影片
*
* @param dataObj 接口数据
* @return Array
**/
function countFilmByID(dataObj) {
	var film_arr = [];
	var temp_obj = {};

	if(dataObj.length > 0){
		for(var i in dataObj) {
			if(!temp_obj[dataObj[i].filmId] && dataObj[i].filmId != "") {
				temp_obj[dataObj[i].filmId] = dataObj[i].filmName;
				film_arr[film_arr.length] = dataObj[i].filmId;
			}else{
				
			}
		}
	}

	return film_arr;
}

/**
 * 快速上传票房
 * 
 * @param
 * 		obj 点击对象
 * @return
 * */
function upScheDetailForChar(obj){
	// loginStatus();

	var cinemaId = getCookie("cinemaId");
	var upFileName = document.getElementById('viewfile').value;
	
	if(upFileName.trim() == "" || upFileName.trim().length < 1){
		tipMsg_Single(obj, 0, "请选择文件后上传", 0, '', '');
		return false;
	}else{
		if(upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xls" && 
			upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xlsx"){	// 03版".xls"、07/10/13版".xlsx"
			tipMsg_Single(obj, 0, "请上传Excel文件", 0, '', '');
			document.getElementById('viewfile').value = "";
			return false;
		}else{
			var loadImg = "<a href='javascript:;' id='loadImg' class='load_img'><img src='images/load.gif' width='20' height='20' /></a>";
			$("#detailIndex").empty().append(loadImg);
			
			var urlPath = "/schedule/apis/boxOffice/" + cinemaId + "/upload.html";
			$.ajaxFileUpload({
		        url: urlPath, //需要链接到服务器地址
		        secureuri: false,
		        fileElementId: 'uploadDetail', //文件选择框的id属性
		        type: 'iframe',
		        dataType: 'json', //服务器返回的格式（数据需要二次处理）
		        success : function(data, status){
		        	result = jQuery.parseJSON(data);
		        	
		        	if(result.ret){
		        		$("#loadImg").remove();
		        		tipMsg_Single(obj, 0, "上传成功", 0, '', '');
		        		
		        		document.getElementById('viewfile').value = "";
		        		localStorage.detailSubmitFlag = 0;	// 上传后，是否提交的标示位(0:未提交, 1:已提交)
		        	}else{
		        		tipMsg_Single(obj, 0, "上传失败", 0, '', '');
		        		$("#loadImg").remove();
		        		document.getElementById('viewfile').value = "";
		        	}
		        },
		        error: function(data,status){
		        	// if(status == "error")
		        	// 	tipMsg_Single(obj, 0, "上传失败", 0, '', '');
		        	// else{
		        	// 	var ieB = navigator.appVersion;
		        	// }
		        }
		    });
		}
	}
}