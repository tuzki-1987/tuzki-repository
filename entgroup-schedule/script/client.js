/*
 * interface of SMS server
 */

/**
 * 重写trim方法
 * */
String.prototype.trim = function () {
	return this.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
};

function SmsServer() {
	return this;
}

SmsServer.prototype={
	mixin : function(properties){
        for (var propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
                this[propertyName] = properties[propertyName];
            }
        }
	},
};

// main of SmsServer
var server = {
	dmain: "qinpr.dyjlr.com:81",
	dataType: "json",
	errorHandler: undefined,
	loginHandler: undefined,
	get: function(path, param, doneprocess, opts){
		this.asyncajax( "GET", path, param, doneprocess, opts);
	},
	post: function(path, param, doneprocess, opts){
		this.asyncajax( "POST", path, param, doneprocess, opts);
	},
	del: function(path, param, doneprocess, opts){
		this.asyncajax( "DELETE", path, param, doneprocess, opts);	
	},
	asyncajax: function(method, path, param, successcallback, opts){
		var opt = opts ? opts : {};
		var pattern = new RegExp(".html", "g");
		if (pattern.test(path)) {
			path = path;
		} else {
			path = path+".html";
		}
		
		$.ajax({
			type: method,
			url: this.dmain + path,
			data: param,
			dataType: this.dataType,
			processData: false,
			contentType: "application/json; charset=utf-8",
			loginHandler: this.loginHandler,
			errorHandler: this.errorHandler,
			beforeSend: function(xhr) {
				if( this.auth ){
					xhr.setRequestHeader("Authentication", "Basic " + this.auth);
				}
			},
			success : function(data) {
				if (successcallback) {
					if (this.dataType == "json" && data.ret == false) {
						if (data.errcode == "1004") {
							alert(SmsErr.txt("1004", "登录失效，请重新登录。"));
							if ( getCookie("sdleUserLevel") ) {
								loginMainHandler._clearCookieSh();
							} else {
								mainMge._removeCookies();
							}
							return ;
						}
						var handler = opt.errorcallback || this.errorHandler;
						if (handler) {
							handler("failed", data.errcode, data.errmsg);
							return;
						}
						return;
					}
					successcallback(data);
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				if (jqxhr.status==401||jqxhr.status==500 && jqxhr.responseText) {
					alert(SmsErr.txt("1000", "无效的请求，请联系管理员。"));
				} else {
					var handler = opt.errorcallback || this.errorHandler;
					if( handler ){
						handler(jqxhr.statusText, jqxhr.status, jqxhr.responseText, errorThrown);
						return;
					}
				}
				alert(jqxhr.statusText + ":(" + jqxhr.status + ")"+ jqxhr.responseText);
			},
		  });
	},
	asyncajaxfalse: function(method, path, param, successcallback, opts){
		var opt = opts ? opts : {};
		var pattern = new RegExp(".html", "g");
		if (pattern.test(path)) {
			path = path;
		} else {
			path = path+".html";
		}
		$.ajax({
			type: method,
			url: path,
			async: false,
			data: param,
			dataType: this.dataType,
			processData: false,
			contentType: "application/json; charset=utf-8",
			loginHandler: this.loginHandler,
			errorHandler: this.errorHandler,
			beforeSend: function(xhr) {
				if( this.auth ){
					xhr.setRequestHeader("Authentication", "Basic " + this.auth);
				}
			},
			success : function(data) {
				if (successcallback) {
					if (this.dataType == "json" && data.ret == false) {
						if (data.errcode == "1004") {
							alert(SmsErr.txt("1004", "登录失效，请重新登录。"));
							if ( getCookie("sdleUserLevel") ) {
								loginMainHandler._clearCookieSh();
							} else {
								mainMge._removeCookies();
							}
							return ;
						}
						var handler = opt.errorcallback || this.errorHandler;
						if (handler) {
							//handler("failed", data.errcode, data.errmsg);
							if(data.errcode == 1000){	// 查无数据
								successcallback(data);
							}
							return;
						}
						return;
					}else{
						successcallback(data);
					}
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				if (jqxhr.status==401||jqxhr.status==500 && jqxhr.responseText) {
					alert(SmsErr.txt("1000", "无效的请求，请联系管理员。"));
				} else {
					var handler = opt.errorcallback || this.errorHandler;
					if( handler ){
						handler(jqxhr.statusText, jqxhr.status, jqxhr.responseText, errorThrown);
						return;
					}
				}
				//alert(jqxhr.statusText + ":(" + jqxhr.status + ")"+ jqxhr.responseText);
			},
		  });
	},
	_strHandler:function (str, strNumber) {
		if (!str)
			return "";
		var cplNameStr = str.toString();
		if (cplNameStr.length > strNumber && cplNameStr.length > 0) {
			return str.substring(0, strNumber)+"...";
		} else {
			return cplNameStr;
		}
	}
};


/*
 *我的影院 功能接口
 */
server.cinemaInfo = function(callback, opts){ //影院信息
};
server.saveCinemaInfo = function(cinemaName,cinemaCode, hallCount, cinemaAddres, seatCount, ticketSystem, owner, province, city, county, callback, opts){ //save cinema info
};
server.filmHallInfo = function(currentCinemaId, callback, opts){ //影厅信息
};
server.addHallInfo = function(currentCinemaId, hallName, seatCount, hallType, hallCode,
		hallStatus, intervalTime, delTag, callback, opts) { // 添加影厅信息
};
server.deleteHallInfo = function(hallIdUp, callback, opts){
};
server.saveUpHallInfo = function(hallIdUp, hallNameUpSv, seatCountUpSv, hallTypeUpSv,hallCodeUpSv, 
		hallStatusUpSv, intervalTimeUpSv, delTagSv, callback, opts) { // 保存修改影厅信息
};


/*
 * 设置排期
 */
server.cinemaTimeList = function(currentCinemaId, templateType, callback, opts){ //影院时间列表
};
server.saveCinemaTime = function(currentCinemaId, templateType, beginTime, endTime, goldTime, difDur, sdur, mainDur, cf_end_time, dm_begin_time, callback, opts){ //保存影院时间
};
server.templateList = function(currentCinemaId, templateType, callback, opts){ //预排影厅列表
};


/**
 * 排片计划
 */
// 排片率统一列表
server.rowPieceRateList = function(planId, callback, opts) {
};
// 抓取的排期数据作为 "推荐排片" 的新列表插入到表中
server.rowPieceRateListForRecommandPlanNoSelfData = function(planId, callback, opts) {
};
// 重新获取排片率
server.resetRowPieceRateList = function(planId, callback, opts) {
};
server.addRowPieceRate = function(planId, filmId, filmName, filmTime, percentage, filmCode, langId, flag, mpIsMain, callback, opts) {
};
server.updateRowPieceRate = function(itemId, planId, filmId, filmName, filmTime, percentage, filmCode, langId, flag, isMain, callback, opts) {
};
server.deleteRowPieceRate = function(itemId, callback, opts) {
};
server.getCinemaPlan = function(planMark, callback, opts) {
};


/**
 * 明日排片提醒
 * */
// 万达明日排期接口
server.loadDataFromWdShgw = function(showDate, platFormId, callback, opts){
};


/**
 * 生成排期
 */
server.createScheByCinemaId = function(paramString, callback, opts) {
};
server.createScheByPlanId = function(planId,paramDate, callback, opts) {
};
server.createScheByUserName = function(paramString, callback, opts) {
};
server.createScheForUser = function(planId, paramDate,callback, opts) {
};


/*
 * 智能排片
 */
 // 排期展示接口
server.rowDisplay = function(currentCinemaId, date, langId, filmCode, callback, opts){
};
// 按影片名称显示接口
server.viewByFilmName = function(currentCinemaId, date, callback, opts){
};
// 按影厅显示接口
server.viewByHall = function(currentCinemaId, date, langId, filmCode, callback, opts){
};
// 按影厅显示接口
server.viewByHalls = function(currentCinemaId, date, callback, opts){
};
// 排期保存接口
server.saveSchedule = function(currentCinemaId, date, data, callback, opts){
};
// 抓取排期展示接口
server.viewByHallss = function(currentCinemaId, date, callback, opts){
};


/**
 * 票房成绩单
 * */
// 观影成绩单
server.detailList = function(cinemaId, current, offset, date, callback, opts) {
};
server.boxOfficeList = function(cinemaId, date, callback, opts) {
};
server.updateDetail = function(id, filmId, filmName, flag, callback, opts) {
};
server.createBoxOffice = function(cinemaId, callback, opts) {
};

// 首周人次分析
server.scanPersonOfFilm = function(cinemaId, callback, opts) {
};
server.analyzeBySltFilm = function(cinemaId, filmIds, showDate, callback, opts) {
};

// 当日前五
server.loadTopFive = function(cinemaId, callback, opts) {
};
server.saveTopFive = function(cinemaId, hallId, hallName, filmId, filmName, showTime, totalTicketCount, callback, opts) {
};
server.updateTopFive = function(cinemaId, id, hallId, hallName, filmId, filmName, showTime, totalTicketCount, callback, opts) {
};
server.delTopFive = function(cinemaId, id, callback, opts) {
};

// 统计分析
server.filmTicketTotal = function(cinemaId, showDate, callback, opts){
};
server.ticketRateTotal = function(cinemaId, showDate, callback, opts){
};
server.personRateTotal = function(cinemaId, showDate, callback, opts){
};
server.topFiveTotal = function(cinemaId, queryDate, callback, opts){
};

/*
 * 登录后用户信息
 */
server.userLoginSuc = function( callback, opts){
};

/*
 * login Interface
 */
server.userLogin = function(email, password, callback, opts){
};

/*
 *注销
 */
server.loginOut = function(callback, opts){
};

/**
 * film manage
 * pageNum	页数
 * lineNum	每页显示条数
 */
server.filmList = function(filmName, pageNum, lineNum, releaseDate, callback, opts) {
};
server.getFilmListByTime = function(callback, opts) {
};
server.getFilmListRB = function(callback, opts) {
};
server.getFilmListSY = function(callback, opts) {
};
server.addFilmInfo = function(filmNumber, filmName, timeLen, releaseDate, endDate, director, area, type, status, callback, opts) {
};
server.updateFilmInfo = function(filmId, filmNumber, filmName, timeLen, releaseDate, endDate, director, area,filmType, callback, opts) {
};