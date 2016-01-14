/**
 * 加载票房成绩单模块内容
 *
* @author ccq by 2015-11-10
 * */
function loadBoxOfficeReport(){
	var cinemaId = cinemaObj.id;
	var queryDate = $("#queryDate").val();
	var current = 0;
	
	// 执行加载当日票房成绩单
	loadBoxOfficeTotals(cinemaId, queryDate);
	// 执行加载当日票房明细
	setTimeout(function() {
		loadBoxOfficeDetail(cinemaId, queryDate);
	}, 300);
}