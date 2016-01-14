/*
 * interface of SMS server
 *
 * @author ccq
 */

/**
 * 重写trim方法
 * */
String.prototype.trim = function () {
	return this.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
};

// main of SmsServer
var server = {
	dmain: "",
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
							/*
							* 这句会导致浏览报：uncaught exception: out of memory
							*/
							// alert(SmsErr.txt("1004", "登录失效，请重新登录。"));
							if ( getCookie("sdleUserLevel") ) {
								loginMainHandler._clearCookieSh();
							} else {
								loginMainHandler._clearCookieSh();
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
							/*
							* 这句会导致浏览报：uncaught exception: out of memory
							*/
							// alert(SmsErr.txt("1004", "登录失效，请重新登录。"));
							if ( getCookie("sdleUserLevel") ) {
								loginMainHandler._clearCookieSh();
							} else {
								loginMainHandler._clearCookieSh();
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


/**
* 影院信息
**/
// 影院信息
server.cinemaInfo = function(cinemaId, callback, opts) {
};
// 影厅信息
server.hallInfo = function(currentCinemaId, callback, opts) {
};

/**
 * 明日排片提醒
 * */
// 万达明日排期接口
server.loadDataFromWdShgw = function(showDate, platFormId, callback, opts){
};


/**
 * 大盘票房
 **/
server.loadMarketBoxOffice = function(showDate, callback, opts){
};


/**
 * 生成排期
 */
server.createScheForUser = function(cinemaId, paramDate,callback, opts) {
};
/**
* 排期时间参数
**/
server.updateCinemaTime = function(cinemaId, date, beginTime, endTime, goldTime, difDur, mainDur, goldBeginTime1, goldEndTime1, goldBeginTime2, goldEndTime2, callback, opts) {
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
server.getFilmListByTime = function(callback, opts) {
};


/*
 *影院票房上传
 */
// 观影成绩单
server.detailList = function(cinemaId, current, offset, date, callback, opts) {
};
server.boxOfficeList = function(cinemaId, date, callback, opts) {
};
server.updateDetail = function(id, filmId, filmName, flag, callback, opts) {
};
server.createBoxOffice = function(cinemaId, callback, opts) {
};
// 保存场次分析
server.saveAnalysis = function(cinemaId, analysisDate, callback, opts) {
};
// 场次分析明细
server.showAnalysisDetail = function(cinemaId, analysisDate, callback, opts) {
};


/*
 *系统排期生成
 */
// 生成排期计划接口
server.readyForRateListJH = function(cinemaId, showDate, callback, opts) {
};
server.readyForRateListJH2 = function(cinemaId, showDate, callback, opts) {
};
// 排片率统一列表
server.rowPieceRateListJH = function(cinemaId, planDate, callback, opts) {
};
server.rowPieceRateListGroupJH = function(cinemaId, planDate, callback, opts) {
};
// 排期设置列表接口
server.schSetList = function(cinemaId, queryDate, callback, opts) {
};


/*
 *票房明细比较
 */
// 排期汇总数据
server.getTotalSchData = function(cinemaId, queryDate, callback, opts) {
};
// 查看排期数据
server.viewScheduleByFilm = function(cinemaId, queryDate, callback, opts) {
};
// 导出对比结果
server.exportCompareData = function(cinemaId, compareDate, callback, opts) {
};
// 票房对比
server.boxOfficeCompare = function(cinemaId, compareDate, platformId, callback, opts) {
};
// 票房对比查询
server.queryBoxOfficeCompare = function(cinemaId, queryDate, callback, opts) {
};


/*
 *排期汇总分时段显示
 */
server.schTotalData = function(cinemaId, schDate, timeSlot, callback, opts) {
};


/*
 *稽核账号相关
 */
//查询稽核财务账号下影院集合
server.queryAuditAccounts = function(callback, opts) {
};
// 添加稽核财务账号所属影院集合
server.addAuditAccount = function(callback, opts) {
};


/*
 *影院分组相关
 */
// 添加分组
server.addGroup = function(userId, platformId, groupName, callback, opts) {
};
// 删除分组
server.delGroup = function(groupId, callback, opts) {
};
// 分组添加影院
server.addCinemaForGroup = function(userId, groupId, cinemaIds, callback, opts) {
};
// 分组列表
server.getGroupLists = function(callback, opts) {
};
// 分组影院列表
server.getCinemaListOfGroup = function(groupId, callback, opts) {
};
// 影院汇总统计列表
server.getCinemaTotalListOfGroup = function(groupId, queryDate, current, offset, callback, opts) {
};
// 查看报告 - 实际
server.getRealReport = function(cinemaId, queryDate, callback, opts) {
};
// 查看报告 - 系统
server.getSysReport = function(cinemaId, queryDate, callback, opts) {
};
// 导出报告
server.downReport = function(cinemaId, queryDate, callback, opts) {
};


/*
 *上传票房[独立]
 */
// 上传票房影院汇总列表
server.queryUploadCinemas = function(queryDate, callback, opts) {
};
// 一键生成票房对比
server.compareBoxOfficeJH = function(cinemaId, platformId, dcode, callback, opts) {
};
// 票房明细
server.boxOfficeDetailListJH = function(cinemaId, queryDate, callback, opts) {
};


/*
 *票房汇总统计(多日汇总)
 */
// 影院汇总统计列表
server.queryCinemaBoxOfficeByDate = function(groupId, beginDate, endDate, current, offset, callback, opts) {
};
// 差额明细
server.difBoxOfficeDetail = function(cinemaId, beginDate, endDate, current, offset, callback, opts) {
};