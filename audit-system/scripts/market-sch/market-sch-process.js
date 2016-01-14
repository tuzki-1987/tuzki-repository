/**
* 系统排期生成
*
* @author ccq by 2015-11-10
**/


/**
* 初始化排片率
*
* @param queryDate 查询日期
**/
function initRateList(queryDate) {
	// insert into jh_plan, jh_plan_item
	server.readyForRateListJH(cinemaObj.id, queryDate, function(callback) {
		if(callback.ret) {
			loadSchRateList(queryDate);
		}
	});
}

/**
* 加载排片率列表(来自大盘排期)
*
* @param queryDate 查询日期
**/
function loadSchRateList(queryDate) {
	// 操作来源标识(空串:单独访问, 1:来自流程)
	var fromFlag = $("#ctrlCreateSchBtn").val();
	$("#queryDate").val(queryDate);
	$("#marketSchTbl").find("thead").nextAll().remove();
	$("#marketSchTbl").append("<tr><td colspan='6' align='center'><img src='images/loading.gif' /></td></tr>");

	// 来自流程时, 加载时间设置
	// if(parseInt(fromFlag) == 1)
		// 加载时间设置数据
		loadSchSetList(cinemaObj.id, queryDate);

	server.rowPieceRateListJH(cinemaObj.id, queryDate, function(callback) {
		if(callback.ret) {
			var film_lang_arrs = ["", "国语", "粤语", "英语", "日语", "韩语", "法语", "俄语", "德语", "意大利语", "西班牙语", "其他"];
			$("#marketSchTbl").find("thead").nextAll().remove();

			var datas = callback.data, datasL = 0;
			var dataHtml = "", totalPercentage = 0, totalHtml = "", filmType = "", filmLang = 0;

			if(datas != undefined) {
				datasL = datas.length;

				if(datasL == 0) {
					filmType = datas[0].filmType == undefined ? "" : datas[0].filmType;
					filmLang = datas[0].langId == undefined ? 0 : datas[0].filmType;

					dataHtml += "<tr>"
								+ "<td>" + datas[0].filmName + "</td>"
								+ "<td>" + datas[0].length + "</td>"
								+ "<td>" + datas[0].percentage + "</td>"
								+ "<td>" + filmType + "</td>"
								+ "<td>" + film_lang_arrs[filmLang] + "</td>"
								// + "<td>推荐计划</td>"
								// + "<td>"
								// 	+ "<a href='javascript:;' id='' title='保存' class='oper-a oper-a-sv'></a>"
								// 	+ "<a href='javascript:;' id='' title='编辑' class='oper-a oper-a-et' onclick='editPlanSon(this);'></a>"
								// 	+ "<a href='javascript:;' id='' title='删除' class='oper-a oper-a-dt' onclick='delPlanSon(this);'></a>"
								// + "</td>"
							+ "</tr>";

					totalPercentage += datas[0].percentage;
				}

				if(datasL > 0) {
					for(var i = 0; i < datasL; i++) {
						filmType = datas[i].filmType == undefined ? "" : datas[i].filmType;
						filmLang = datas[i].langId == undefined ? 0 : datas[i].filmType;

						dataHtml += "<tr>"
									+ "<td>" + datas[i].filmName + "</td>"
									+ "<td>" + datas[i].length + "</td>"
									+ "<td>" + datas[i].percentage + "</td>"
									+ "<td>" + filmType + "</td>"
									+ "<td>" + film_lang_arrs[filmLang] + "</td>"
									// + "<td>推荐计划</td>"
									// + "<td>"
									// 	+ "<a href='javascript:;' id='' title='保存' class='oper-a oper-a-sv'></a>"
									// 	+ "<a href='javascript:;' id='' title='编辑' class='oper-a oper-a-et' onclick='editPlanSon(this);'></a>"
									// 	+ "<a href='javascript:;' id='' title='删除' class='oper-a oper-a-dt' onclick='delPlanSon(this);'></a>"
									// + "</td>"
								+ "</tr>";

						totalPercentage += datas[i].percentage;
					}

					totalHtml = "<tr>"
								+ "<td><B>合计</B></td>"
								+ "<td>&nbsp;</td>"
								+ "<td colspan='4'><B>" + Math.round(totalPercentage) + "</B></td>"
							+ "</tr>";

					$("#schTipDate").val(queryDate);

					// 走流程才显示
					// if(parseInt(fromFlag) == 1)
						$(".create-sch-box").show();
				}
			}else {
				dataHtml = "<tr>"
							+ "<td colspan='6'>"
								+ "<div>"
						            + "<img src='images/tip.png' width='80' />"
									+ "<span class='tip-text-nodata pdlt10 fs20 clr8'>暂无数据，请稍后查看</span>"
								+ "</div>"
							+ "</td>"
						+ "</tr>";
				totalHtml = "";

				$(".create-sch-box").hide();
			}

			$("#marketSchTbl").append(dataHtml + totalHtml);
		}
	});
}

/**
* 排期设置列表接口
**/
function loadSchSetList(cinemaId, queryDate) {
	// $(".sch-timeset-area").show();

	server.schSetList(cinemaId, queryDate, function(callback) {
		if(callback.ret) {
			var datas = callback.data;

			// 开始时间
			if(datas.beginTime != undefined)
				$("#schStartTime").val(datas.beginTime);
			else
				$("#schStartTime").val("");

			// 结束时间
			if(datas.endTime != undefined)
				$("#schEndTime").val(datas.endTime);
			else
				$("#schEndTime").val("");

			// 晚场黄金时段开始时间
			if(datas.goldTime != undefined)
				$("#nightGoldStartTime").val(datas.goldTime);
			else
				$("#nightGoldStartTime").val("");

			// 主打片场次间隔
			if(datas.mainDur != undefined)
				$("#mainFilmDur").val(datas.mainDur);
			else
				$("#mainFilmDur").val("");

			// 不同影片场次间隔
			if(datas.difDur != undefined)
				$("#diffFilmDur").val(datas.difDur);
			else
				$("#diffFilmDur").val("");
		}
	});
}

/**
* 日期查询
**/
function queryMarketSchByDate() {
	var queryDate = $dp.cal.getDateStr();
	
	if(queryDate == "")
		tipMsg_Single('marketSchTbl', 0, "请选择查询日期", 0, '', '');
	else{
		loadSchRateList(queryDate);
		$dp.hide();
	}
}

/**
* 生成排期
*
**/
function auditCreateSch() {
	var cinemaId = cinemaObj.id;
	var paramDate = $("#singleDate").val();

	server.createScheForUser(cinemaId,paramDate, function(callback){
		if (callback.ret) {
			if (callback.data != "") {
				tipMsg_Single('marketSchTbl', 0, "排期生成成功", 0, '', '');
				setTimeout(function() {
					$(".main").html(muObj.loadImg);
					$(".main").load(muObj.url_ps_3);
				}, 500);	// 500毫秒后转至 明细比较
			} else {
				tipMsg_Single('marketSchTbl', 0, "此计划排片率为空，请添加排片率", 0, '', '');
				return ;
			}
		}else {
			alert("here ")
		}
	});
}

/**
* 编辑
*
* @param obj 当前对象
**/
function editPlanSon(obj) {}

/**
* 删除
*
* @param obj 当前对象
**/
function delPlanSon(obj) {}