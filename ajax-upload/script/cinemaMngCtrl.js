/**
 * 全局函数设置
 */

 // 公共日期控制类
 function commonDateCtrl() {}

/**
 * 计算位置
 * 
 * @param 需要设置位置的对象的class
 * @return String
 * */
function getPost(objClass) {
	var pageW = window.screen.availWidth;
	var pageH = window.screen.availHeight;
	var scrollT = $(document).scrollTop();
	var objH = $("." + objClass).css("height");	// 提示信息容器的高度
	var objW = $("." + objClass).css("width");	// 提示信息容器的宽度
	var marginL = Math.floor((objW.replace("px","")*1 + 40)/2)*(-1);	// 计算向左边拉回的像素值
	var top = Math.ceil(pageH/3) + scrollT;	// 计算距离浏览器上边框的距离
	var left = "50%";
	
	var result = top + "+" + left + "+" + marginL;
	return result;
}

/**
 * 单纯的信息提示
 * @param obj : 需要提示信息的对象id(可见id)
 * @param type : 提示类型标识(0:不打开遮罩, 1:打开遮罩)
 * @param text : 提示信息
 * @param setBgFlag : 是否设置背景颜色(0:不设置, 1:设置)
 * @param setBgObj : 要设置背景颜色的对象(0:父对象, 1:自身)
 * @param setBgColor : 背景颜色值
 * @return
 * */
function tipMsg_Single(obj, type, text, setBgFlag, setBgObj, setBgColor) {
	var resultHTML = "";
	var textBoxHTML = "<div id='contDiv' class='tipMsg'>" + text + "</div>";
	var zhezhaoHTML = "<div id='zhezhao' class='zhezhao'></div>";
	if(type == 0){
		resultHTML = "";
		resultHTML = textBoxHTML;
	}else if(type == 1){
		resultHTML = textBoxHTML;
		resultHTML = textBoxHTML + zhezhaoHTML;
	}
	
	if(obj == "upDtlBtn"){
		$("#"+obj).parent().after(resultHTML);
	}else{
		$("#"+obj).after(resultHTML);
		// document.body.appendChild(resultHTML);
	}
	
	if(type == 1)
		$(".zhezhao").css({ display : "block", height : $(document).height()});
	
	if(setBgFlag == 1){
		if(setBgObj == 0)
			$("#"+obj).parent().css("background-color",setBgColor);
		else if(setBgObj == 1)
			$("#"+obj).css("background-color",setBgColor);
	}
	
	var result = getPost("tipMsg");
	var resultArr = result.split("+");
	
	$(".tipMsg").css({top: resultArr[0] + "px", left: resultArr[1], marginLeft: resultArr[2] + "px"});
	$(".tipMsg").show();
	$(".tipMsg").delay(3000).hide(0);	// 容器显示2秒
	if(type == 1)
		$(".zhezhao").delay(3000).hide(0);
	
	setTimeout("delObj('contDiv')", 1000);
	setTimeout("delObj('zhezhao')", 1000);
}

/**
 * 删除提示信息容器, 避免不同操作插入多个容器, 因容器ID和class相同, 导致提示信息出错
 **/
function delObj(obj){
	$("#"+obj).remove();
}

/**
* 用户交互 - 需要用户反馈
* 
* @param interactionMsg 交互信息(扩展参数)
* @param fromModel 事件所属模块
* @return 
**/
function tipMsg_UserOper(fromModel) {
	var insertObj = "<div id='delCon' class='delContainer'>"
						/*+ "<div class='del_title'>"
							+ "<table class='del_table' border='0' cellspacing='0' cellpadding='0'>"
							+ "<tbody><tr height='21'>"
							+ "<td width='450'><span id='td_seletrade'></span></td>"
							+ "<td align='right' valign='middle' style='padding-right: 5px'><a href='javascript:void(0);' id='close'>"
							+ "<img src='<%=basePath%>image/close2.jpg' width='15' height='15'></a></td>"
							+ "</tr></tbody></table>"
						+"</div>"*/
						+"<div class='userText'>"
							+"<span id='td_delspan'>您确定删除吗 ?</span>"
						+"</div>"
						+"<table class='del_table' border='0' cellspacing='0' cellpadding='0'>"
							+"<tbody><tr>"
							+"<td align='center' width='100'><input type='button' class='button white' id='delyes' value='确定' onclick=\"IDoDecision('sure', '" + fromModel + "');\" /></td>"
							+"<td align='center' valign='middle' width='100'><input type='button' class='button white' id='delno' value='取消' onclick=\"IDoDecision('cancle');\" /></td>"
							+"</tr>"
						+"</tbody></table>"
					+"</div>"
					+"<div id='zhezhao' class='zhezhao'></div>";
	
	var insertPos = document.getElementsByTagName("body");
//	$(insertPos[0]).append("<a href='#'>hello world</a>");
	$(insertPos[0]).append(insertObj);
	
	var result = getPost("delContainer");
	var resultArr = result.split("+");
	
	$(".delContainer").css({top: resultArr[0] + "px", left: resultArr[1], marginLeft: resultArr[2] + "px"});
	$(".zhezhao").css({ display : "block", height : $(document).height()});
	$(".delContainer").show();
}

/**
 * 用户做出的删除决定 - 接口
 * 
 * @param userChoice 用户的选择
 * @param fromModel  事件所属模块
 * @method IDoDecisionImpl 需要具体实现的接口方法
 * @return 
 * */
function IDoDecision(userChoice, fromModel) {
	$(".delContainer").hide();
	$(".zhezhao").hide();
	
	IDoDecisionImpl(userChoice, fromModel);
}

/**
 * 数字校验
 * 
 * @param thisID 对象ID
 * @param thisValue 对象里填的值
 * @param thisObj 对象本身
 * @return
 * */
function checkNum(thisID, thisValue, thisObj) {
	if(thisValue.trim() != ""){
		if(isNaN(thisValue)){
			tipMsg_Single(thisID, 0, "请输入数字", 1, 1, '#FF9999');
			$(thisObj).val("");
			$(thisObj).focus();
		}else if(thisValue*1 == 0){
			tipMsg_Single(thisID, 0, "请输入大于0的数字", 1, 1, '#FF9999');
			$(thisObj).val("");
			$(thisObj).focus();
		}else
			$(thisObj).css("background-color","#FFF");
	}
}

/**
* 返回日期（相对于当天的前后AddDayCount天）
*
* @param AddDayCount (相对于今天的)日期差值
* @param objValue 存储日期值的对象ID
*
* @return String
* */
function SetDateStr(AddDayCount, objValue) {
	var dd = new Date();
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
	var y = dd.getFullYear();
	var m = dd.getMonth()+1;
	var d = dd.getDate();
	
	if(m > 0 && m < 10)m = "0" + m;
	if(d > 0 && d < 10)d = "0" + d;
	return y+"-"+m+"-"+d;
	//var result = y+"-"+m+"-"+d;
	//document.getElementById("'" + objValue + "'").value = result;
}

/**
 * 获取当天日期（格式：yyyy-mm-dd）
 * 
 * @param 
 * @return String
 * */
function getCurDate() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if(month < 10)
		month = "0" + month;
	if(day < 10)
		day = "0" + day;
	var curDate = year + "-" + month + "-" + day;
	
	return curDate;
}

/**
* 返回当月天数
*
* @return int
* */
function getCurMonthDays() {
	var d = new Date();
    var curMonthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
    return curMonthDays;
}

/**
* 返回当月每天日期值
*
* @return Array
* */
function getCurMonthEveryDay() {
	var d = new Date();
    var curMonthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();

    var curMonthEveryDay = [];
    for (var i = 0; i < curMonthDays; i++) {
    	var dateM = d.getMonth() + 1;
    	if(dateM < 10)dateM = "0" + dateM;

    	var dateD = i+1;
    	if(dateD < 10)dateD = "0" + dateD;

    	curMonthEveryDay[i] = d.getFullYear() + "-" + dateM + "-" + dateD;
    }
    return curMonthEveryDay;
}

var fromPage = 1;
var filmName = null;
var status = null;
/**
 * 当前页数
 * */
var current = 0;
/**
 * 总共条数
 * */
var pageTotalCount = 0;
/**
 * 总共多少页
 * */
var pageTotalNum = 0;
/**
 * 每页多少条
 * */
var offects = 30;
/**
 * 分页处理
 * 
 * @param pageFlag 点击索引标识
 * @param curObjID 当前点击对象的ID
 * @param pagePageName 需要分页的模块名字
 * @param hallId 当前影院ID
 * @return
 * */
function pageFunc(pageFlag, curObjID, pagePageName, hallId) {
	// 首页
	if(pageFlag == "index"){
		if (fromPage == 1)
			tipMsg_Single(curObjID, 0, "已是首页", 0, '', '');
		else{
			if(pagePageName == "filmHallBind")
				loadFilmLists(null, 1, offects, null, hallId);
			else if(pagePageName == "loadBoxOfficeDetail")
				loadBoxOfficeDetail(fromPage, 5);
			
			fromPage = 1;
		}
	}
	
	// 上一页
	if(pageFlag == "prev"){
		fromPage = fromPage*1 - 1;
		if (fromPage < 1) {
			tipMsg_Single(curObjID, 0, "已到首页", 0, '', '');
			fromPage = 1;
		} else{
			if(pagePageName == "filmHallBind")
				loadFilmLists(null, fromPage, offects, null, hallId);
			else if(pagePageName == "loadBoxOfficeDetail")
				loadBoxOfficeDetail(fromPage, 5);
		}
	}
	
	// 下一页
	if(pageFlag == "next"){
		fromPage = fromPage*1 + 1;
		if (fromPage > pageTotalNum) {
			tipMsg_Single(curObjID, 0, "已到尾页", 0, '', '');
			fromPage = fromPage - 1;
		} else{
			if(pagePageName == "filmHallBind")
				loadFilmLists(null, fromPage, offects, null, hallId);
			else if(pagePageName == "loadBoxOfficeDetail"){
				loadBoxOfficeDetail(fromPage, 5);
			}
		}
	}
	
	// 尾页
	if(pageFlag == "last"){
		if (fromPage*1 == pageTotalNum*1)
			tipMsg_Single(curObjID, 0, "已是尾页", 0, '', '');
		else {
			if(pagePageName == "filmHallBind")
				loadFilmLists(null, pageTotalNum, offects, null, hallId);
			else if(pagePageName == "loadBoxOfficeDetail")
				loadBoxOfficeDetail(pageTotalNum, 5);
			
			fromPage = pageTotalNum;
		}
	}
}

/**
 * 数组排序
 * 
 * @param sortArr 需要排序的数组(数据类型不定)
 * @param sortRule 排序规则(扩展参数, 默认为true:升序, false:降序)
 * 
 * @return Array
 * */
function sortByArray(sortArr) {
	var returnArray = [];
	if(sortArr.length > 1){	// 多于2条
		if(sortArr[0].split("-")){	// 拼接字符串（格式：ID-number）
			for(var i = 0; i < sortArr.length; i++){
				for(var j = i + 1; j < sortArr.length; j++){
					var saI = sortArr[i].split("-");
					var saJ = sortArr[j].split("-");

					if(isNaN(saI[0])){
						if(saI[1]*1 < saJ[1]*1){	// 降序
							var temp = sortArr[j];
							sortArr[j] = sortArr[i];
							sortArr[i] = temp;
						}
					}else{	// 数据格式反向
						if(saI[0]*1 < saJ[0]*1){	// 降序
							var temp = sortArr[j];
							sortArr[j] = sortArr[i];
							sortArr[i] = temp;
						}
					}
					
				}
			}
			returnArray = sortArr;
		}else{	// 纯数字、字母、其他
			
		}
	}
	
	return returnArray;
}

/**
* 重新排列 行（每个 TR 必须有唯一的ID）
*
* @param sortArr 已排完序的数组（数据格式：trID-trNumber；trID:行ID, trNumber:行内数字）
* @param firstRecordPosObj 数组中首记录的定位对象（类型：String; 格式：".className" or "#IdName"）
* */
function resortTR(sortArr, firstRecordPosObj) {
	if(sortArr.length > 0){
		var firstRank = sortArr[0].split("-");		// 已排好序的首记录
		if(isNaN(firstRank[1]))
			$("#"+firstRank[1]).insertAfter(firstRecordPosObj);	// 将首记录放到标题之后
		else	// 数据格式反向
			$("#"+firstRank[0]).insertAfter(firstRecordPosObj);

		for(var j = 1; j < sortArr.length; j++){
			var rankRecord = sortArr[j].split("-");	// 已排好序的当前（j）记录
			var prevRecord = sortArr[j-1].split("-");	// 已排好序的当前的上条记录

			if(isNaN(rankRecord[1]))
				$("#"+rankRecord[1]).insertAfter("#"+prevRecord[1]);	// 根据排序, 重新依次排列行
			else
				$("#"+rankRecord[0]).insertAfter("#"+prevRecord[0]);
		}
	}
}

/**
 * 重置左侧菜单样式
 * 
 * @param curIndex 当前点击菜单下标
 * @param curText  当前点击菜单名字
 * @param tabNums  菜单总数
 * @param fromPage 当前菜单所属页面（约定：setSchedule(排期设置页面)，planlist(排片计划页面)）
 *
 * @return
 * */
function resetSubNav(curIndex, curText, tabNums, fromPage) {
	var activeTabHTML = "<span>" + curText + "</span><img src='images/jiantou_03.png'/>";
	var normalTabHTML_start = "<a href='javascript:;'>";
	var normalTabHTML_end = "</a>";
	var curTab = "";

	for(var i = 0; i < tabNums; i++){
		if(i == curIndex - 1){
			$(".sub_nav ul li").eq(curIndex-1).html(activeTabHTML);
		}else{
			if(i == 0){
				if(fromPage == "setSchedule")curTab = "工作日模板";
				if(fromPage == "planlist")curTab = "推荐排片";

				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + curTab + normalTabHTML_end);
			}
			
			if(i == 1){
				if(fromPage == "setSchedule")curTab = "节假日模板";
				if(fromPage == "planlist")curTab = "自定义排片";

				$(".sub_nav ul li").eq(i).html(normalTabHTML_start + curTab + normalTabHTML_end);
			}
			
			if(i == 2){

			}
		}
	}
}

/**
* 返回今天是工作日还是节假日
*
* @return int 0: 工作日, 1: 节假日
**/
commonDateCtrl.prototype.getWeekdaysOrHoliday = function() {
	var todayTemplate;	// 当日模板

	// 每年每月的节假日 日期
	var holidayObj = {
		"0":[1, 2, 3],
		"1":[18, 19, 20, 21, 22, 23, 24],
		"2":[],
		"3":[6],
		"4":[1],
		"5":[22],
		"6":[],
		"7":[],
		"8":[3, 4],
		"9":[1, 2, 5, 6, 7],
		"10":[],
		"11":[]
	};

	// 每年每月的周末工作日期
	var weekendObj = {
		"0":[4],
		"1":[15, 28],
		"2":[],
		"3":[],
		"4":[],
		"5":[],
		"6":[],
		"7":[],
		"8":[6],
		"9":[10],
		"10":[],
		"11":[]
	};

	// 一周名字
	var weekdayObj = {"0":"周日", "1":"周一", "2":"周二", "3":"周三", "4":"周四", "5":"周五", "6":"周六"};

	var d = new Date();
	var month = d.getMonth();	// 获取当前月份
	var day = d.getDate();		// 获取当天日期
	var weekDay = d.getDay();	// 获取当天周几

	if(weekDay == 0 || weekDay == 6){	// 0: 周日, 6: 周六
		if(weekendObj[month.toString()].length > 0){
			// 如果周六、周日所属当月对象值不为空，若包括周六、周日对应日期，即为工作日
			for (var i = 0; i < weekendObj[month.toString()].length; i++) {
				if(day == weekendObj[month.toString()][i]){
					// 因只校验当天，故找到后立即退出
					todayTemplate = 0;
					break;
				}else{	// 无匹配记录表示是节假日
					todayTemplate = 1;
				}
			}
		}else{
			// 否则，即为节假日
			todayTemplate = 1;
		}
	}else{	// 非周六、周日
		if(holidayObj[month.toString()].length > 0){
			// 如果非周六、周日所属当月对象值不为空，若包括当天日期，即为节假日
			for (var i = 0; i < holidayObj[month.toString()].length; i++) {
				if(day == holidayObj[month.toString()][i]){
					// 因只校验当天，故找到后立即退出
					todayTemplate = 1;
					break;
				}else{	// 无匹配记录表示是工作日
					todayTemplate = 0;
				}
			}
		}else{
			// 否则，即为工作日
			todayTemplate = 0;
		}
	}

	return todayTemplate;
}
