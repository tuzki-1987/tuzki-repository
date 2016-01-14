/*
 * 影院信息
 *
 * @author ccq
 */


var csArray = ["", "Vista", "满天星", "粤科", "中鑫汇科"];
var ccArray = ["", "北京万达院线", "中影星美院线", "上海联和院线", "广东大地院线", "深圳中影南方新干线", "广州金逸珠江院线", "中影数字院线", "浙江横店院线", 
"北京新影联院线", "浙江时代院线", "四川太平洋院线", "重庆保利万和院线", "江苏幸福蓝海院线", "华夏联合电影院线", "湖北银兴院线", "辽宁北方院线", 
"时代华夏今典院线", "河南奥斯卡院线", "深影橙天院线", "武汉天河院线", "浙江星光院线院线", "北京红鲤鱼院线", "世纪环球院线", "湖南潇湘院线", 
"上海大光明院线", "浙江温州雁荡院线", "北京世茂电影院线", "山东奥卡新世纪院线", "北京长城沃美院线", "北京九州中原院线", "江苏东方院线", 
"福建中兴院线", "河北中联影业院线", "北京华夏新华大地", "山东鲁信院线", "江西星河电影院线", "四川峨嵋院线", "吉林吉影院线", "湖南楚湘院线", 
"新疆华夏天山院线"];

// 页面初始化
function initCinemaMng() {
	// 加载影院信息
	getCinemaInfo(cinemaObj.id);

	// 加载影厅信息
	getHallInfoOfCinema(cinemaObj.id);
}

/**
* 获取影院信息
**/
function getCinemaInfo(cinemaId) {
	$("#cinemaInfoTbl").find("thead").nextAll().remove();

	server.cinemaInfo(cinemaId, function(callback) {
		if(callback.ret) {
			var datas = callback.data, datasExt = callback.cinemaExt, infoHtml = "";
			var cinemaName = "", cinemaCode = "", owner = "", tcSys = "", hallCount = "", seatCount = "", cAdd = "";

			if(datas != "" && datas != undefined) {
				cinemaName = datas.cinemaName == "" || datas.cinemaName == undefined ? "" : datas.cinemaName;
				cinemaCode = datas.cinemaCode == "" || datas.cinemaCode == undefined ? "" : datas.cinemaCode;
				hallCount = datas.hallCount == "" || datas.hallCount == undefined ? "" : datas.hallCount;
				seatCount = datas.seatCount == "" || datas.seatCount == undefined ? "" : datas.seatCount;
				cAdd = datas.cinemaAddress == "" || datas.cinemaAddress == undefined ? "" : datas.cinemaAddress;

				if(datasExt != undefined) {
					owner = ccArray[datasExt.owner];
					tcSys = csArray[datasExt.ticketSystem];
				}else {
					owner = "";
					tcSys = "";
				}

				infoHtml += "<tr>"
							+ "<td>" + cinemaName + "</td>"
							+ "<td>" + cinemaCode + "</td>"
							+ "<td>" + owner + "</td>"
							+ "<td>" + tcSys + "</td>"
							+ "<td>" + hallCount + "</td>"
							+ "<td>" + seatCount + "</td>"
							+ "<td>" + cAdd + "</td>"
						+ "</tr>";

				$("#cinemaInfoTbl").find("thead").after(infoHtml);
			}
		}
	});
}

/**
* 获取影院的影厅信息
* 
* @param cinemaId 当前影院ID
**/
function getHallInfoOfCinema(cinemaId) {
	$("#cinemaHallTbl").find("thead").nextAll().remove();

	server.hallInfo(cinemaId, function(callback) {
		if(callback.ret) {
			var sortResult = sortByfilmHallInfo(callback.data), sortResultL = sortResult.length;
			var hallHtml = "";

			for ( var i = 0; i < sortResultL; i++) {
				var hallCode = sortResult[i].hallCode;

				if(hallCode == undefined){
					hallCode = "";
				}

				if(sortResult[i].delTag != 1) {
					hallHtml += "<tr>"
								+ "<td title='" + sortResult[i].hallName + "'>" + sortResult[i].hallName + "</td>"
								+ "<td>" + sortResult[i].seatCount + "</td>"
								+ "<td>" + hallTypeHandler(sortResult[i].hallType) + "</td>"
								+ "<td>" + hallCode + "</td>"
								+ "<td>" + stateHandler(sortResult[i].status) + "</td>"
								+ "<td>" + sortResult[i].intervalTime + "</td>"
							+ "</tr>";
				}
			}

			$("#cinemaHallTbl").find("thead").after(hallHtml);
		}
	});
}

/**
* 影厅排序
*
* @param filmHallInfo 接口数据
* @return 排完序的数据
**/
function sortByfilmHallInfo(filmHallInfo) {
	for ( var i = 0; i < filmHallInfo.length; i++) {
		for ( var j = i; j < filmHallInfo.length; j++) {
			if (filmHallInfo[i].id > filmHallInfo[j].id) {
				var temp = filmHallInfo[i];
				filmHallInfo[i] = filmHallInfo[j];
				filmHallInfo[j] = temp;
			}
		}
	}
	return filmHallInfo;
}

/**
* 处理影厅类型
*
* @param type 当前影厅类型ID
**/
function hallTypeHandler(type){
	if(type == 0) {
		return "2D";
	} else if(type == 1) {
		return "3D";
	} else {
		return "未知";
	}
}

/**
* 处理影厅状态
*
* @param status 当前影厅类型ID
**/
function stateHandler(status) {
	if (!status && status!=0)
		return "";
	if (status == 0) {
		return "不可用";
	} else if (status == 1) {
		return "待审核";
	} else if (status == 2) {
		return "可用";
	}
}