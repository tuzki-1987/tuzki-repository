/**
 * 加载票房成绩单模块内容
 *
* @author ccq by 2015-11-10
 * */
function loadBoxOfficeReport(){
	var cinemaId = cinemaObj.id;
	var queryDate = "";
	var current = 0;
	$("#initSchDate").val($("#queryDate").val());	// 初始化保存查询日期
	
	// 执行加载票房明细(未提交的时候, 加载明细)
	if(localStorage.detailSubmitFlag == 0) {
		// loadBoxOfficeDetail(current, 5, "reportTitle");
	}

	// 执行加载当日票房成绩单
	loadBoxOfficeTotals(cinemaId, queryDate);
}