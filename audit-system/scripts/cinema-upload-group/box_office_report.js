/**
 * 加载票房成绩单模块内容
 *
* @author ccq by 2015-11-10
 * */
function loadBoxOfficeReport(){
	var cinemaId = $("#curCinemaID").val();
	var queryDate = $("#queryDate").val();
	var current = 0;
	
	// 执行加载当日票房成绩单
	loadBoxOfficeTotals(cinemaId, queryDate);
}