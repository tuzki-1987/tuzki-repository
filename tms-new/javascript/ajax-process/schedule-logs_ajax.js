/**
* ajax process:schedule-logs
* @description: 排期-日程 模块 接口数据处理
**/

var scheduleLogsObj = {
	scheduleEmpty: null,	// 排期是否为空
	quickDateVM: null,	// 速选日期Vue实例
	schHallVM: null,	// 排期影厅Vue实例
	hallSchVM: null,	// 影厅排期Vue实例
	splListVM: null,	// spl列表区域实例
	playListVM: null,	// 播放列表区域实例
	layerObjImportDate: null,
	layerObjDistributeDate: null,
	layerObjEditScheDate: null,
	layerObjSynchronizeDate: null,
	layerObjCopyScheFromDate: null,
	layerObjCopyScheToDate: null,
	curDate: global.dateTool.getNowDate(),
	// 区分"新增/编辑"(编辑:选中某一个排期块时)
	operFlag: null,
	// 速选日期Vue数据和方法
	quickDateVueData: {
		title: "",
		curDateTab: 0,	// 当前选中的速选日期
		dateItems: null,
		methods: {}
	},
	// 点击排期块数据
	schBlockData: {
		showId: null,
		showState: null
	},
	// spl列表点击数据
	splClickData: {
		id: null,
		name: null
	},
	// 第一场排期的影片信息
	firstSchInfo: {
		showId: null,
		hallName: null,
		filmName: null,
		stime: null
	},
	// 播放列表的影片信息
	playSchInfo: {
		showId: null,
		hallName: null,
		filmName: null,
		stime: null
	},
	// 排期影厅Vue数据和方法
	schHallVueData: {
		title: "",
		hallItems: null
	},
	// 影厅排期Vue数据和方法
	hallSchVueData: {
		title: "",
		scheduleItems: null
	},
	// SPL列表区域Vue数据和方法
	splListVueData: {
		title: "",
		isEdit: true,	// 默认新增(控制spl列表显示)
		keyWords: "",
		splListItems: null
	},
	// 播放列表区域Vue数据和方法
	playListVueData: {
		title: "",
		filmInfo: {
			hallName: null,
			filmName: null,
			stime: null
		},
		descInfo: null,
		playListItems: null
	},
	// 以"Ops"结尾的接口参数
	scheduleOps: {
		url: "ajaxes/schedule.php",
		data: {}	// 接口参数在具体调用的时候定义
	},
	scheduleShowOps: {
		url: "ajaxes/show.php",
		data: {}
	},
	splListOps: {
		url: "ajaxes/spl.php",
		data: {}
	},
	deviceOps: {
		url: "ajaxes/hall.php",
		data: {}
	},
	// 初始函数
	main: function() {
		global.msgTip.load();
		var dateWeek = global.dateTool.getDateWeekArr(null, 3);	// 获取速选日期列表
		scheduleLogsObj.operFlag = {
			isEdit: false	// 当前是否是编辑操作(默认新增)
		};
		scheduleLogsObj.resetFunc();
		scheduleLogsObj.registEvent();
		scheduleLogsObj.quickDateVueData.dateItems = dateWeek;	// 快速选择日期数据
		// 创建速选日期Vue实例
		scheduleLogsObj.quickDateVM = global.vueController.create({
			el: "#quickDate",
			data: scheduleLogsObj.quickDateVueData,
			vm: scheduleLogsObj.quickDateVM,
			computed: {
				dateItemsCpt: function() {
					return this.dateItems;
				}
			},
			methods: {
				handleClickQuickDate: scheduleLogsObj.handleClickQuickDate
			}
		});
		scheduleLogsObj.quickDateVM.dateItems = dateWeek;
		// 存放Vue实例
		global.vueController.vueVM.push(scheduleLogsObj.quickDateVM);
		// console.log(scheduleLogsObj.quickDateVM);
		// console.log("速选日期Vue 实例已创建, isDestroyed状态 : "+scheduleLogsObj.quickDateVM._isDestroyed);

		// 创建排期影厅Vue实例
		scheduleLogsObj.schHallVM = global.vueController.create({
			el: "#schHallWait",
			data: scheduleLogsObj.schHallVueData,
			vm: scheduleLogsObj.schHallVM,
			computed: {
				hallItemsCpt: function() {
					return this.hallItems;
				}
			}
		});
		// 存放Vue实例
		global.vueController.vueVM.push(scheduleLogsObj.schHallVM);
		// console.log("排期影厅Vue 实例已创建, isDestroyed状态 : "+scheduleLogsObj.schHallVM._isDestroyed);

		// 创建影厅排期Vue实例
		scheduleLogsObj.hallSchVM = global.vueController.create({
			el: "#waitListSch",
			data: scheduleLogsObj.hallSchVueData,
			vm: scheduleLogsObj.hallSchVM,
			computed: {
				scheduleItemsCpt: function() {
					return this.scheduleItems;
				}
			},
			methods: {
				handleClickSchBlock: scheduleLogsObj.handleClickSchBlock,
				hanldeMouseEnter: scheduleLogsObj.hanldeMouseEnter,
				hanldeMouseleave: scheduleLogsObj.hanldeMouseleave
			}
		});
		// 存放Vue实例
		global.vueController.vueVM.push(scheduleLogsObj.hallSchVM);
		// console.log("影厅排期Vue 实例已创建, isDestroyed状态 : "+scheduleLogsObj.hallSchVM._isDestroyed);

		// 创建SPL列表Vue实例(未重新加载模块时, 不需要重新创建)
		scheduleLogsObj.splListVM = global.vueController.create({
			el: "#splListArea",
			data: scheduleLogsObj.splListVueData,
			vm: scheduleLogsObj.splListVM,
			computed: {
				isEditCpt: function() {
					return this.isEdit;
				},
				splListItemsCpt: function() {
					return this.splListItems;
				}
			},
			methods: {
				handleClickSearch: scheduleLogsObj.handleClickSearch,
				handleClickSPL: scheduleLogsObj.handleClickSPL
			}
		});
		// 存放Vue实例
		global.vueController.vueVM.push(scheduleLogsObj.splListVM);
		// console.log("SPL列表Vue 实例已创建, isDestroyed状态 : "+scheduleLogsObj.splListVM._isDestroyed);

		// 创建播放列表Vue实例
		scheduleLogsObj.playListVM = global.vueController.create({
			el: "#playListCnt",
			data: scheduleLogsObj.playListVueData,
			vm: scheduleLogsObj.playListVM,
			computed: {
				filmInfoCpt: function() {
					return this.filmInfo;
				},
				descInfoCpt: function() {
					return this.descInfo;
				},
				playListItemsCpt: function() {
					return this.playListItems;
				}
			},
			methods: {
				handleClickPlayListItem: scheduleLogsObj.handleClickPlayListItem
			}
		});
		// 存放Vue实例
		global.vueController.vueVM.push(scheduleLogsObj.playListVM);
		// console.log("SPL列表Vue 实例已创建, isDestroyed状态 : "+scheduleLogsObj.playListVM._isDestroyed);
		// 显示排期
		scheduleLogsObj.showScheduleList();
	},
	// 排期列表
	showScheduleList: function(param) {
		param && global.msgTip.load();	// 加载动画
		console.log("排期日期 ------------------------ ："+scheduleLogsObj.curDate);
		scheduleLogsObj.scheduleEmpty = true;	// 排期默认为空
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "listShow",
			showDate: scheduleLogsObj.curDate
		};
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		// 请求接口
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			// console.log("--------------- 请求成功 ---------------");
			// console.log(res);
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			let hallDatas, hallSchDatas;
			hallDatas = scheduleLogsObj.processData.getHallFromSchedule(res.data);	// 排期影厅数据
			scheduleLogsObj.schHallVueData.hallItems = hallDatas;
			hallSchDatas = scheduleLogsObj.processData.getHallSchedule(res.data);	// 排期数据
			scheduleLogsObj.hallSchVueData.scheduleItems = hallSchDatas;
			// 更新Vue实例数据
			scheduleLogsObj.schHallVM.hallItems = hallDatas;
			scheduleLogsObj.hallSchVM.scheduleItems = hallSchDatas;
			param && global.msgTip.closeLayer();	// 关闭
			console.log("排期是否为空 ："+scheduleLogsObj.scheduleEmpty);
			// 排期为空
			if(scheduleLogsObj.scheduleEmpty) {
				global.msgTip.tipAlert({txt: "所选日期暂无排期", icon: 5, cancel: global.msgTip.closeLayer(), yes: global.msgTip.closeLayer()});
				// 清空右侧播放列表
				scheduleLogsObj.playListVueData.filmInfo.showId = null;
				scheduleLogsObj.playListVueData.filmInfo.hallName = null;
				scheduleLogsObj.playListVueData.filmInfo.filmName = null;
				scheduleLogsObj.playListVueData.filmInfo.stime = null;
				scheduleLogsObj.playListVueData.descInfo = null;
				scheduleLogsObj.playListVueData.playListItems = null;
				return;
			}else scheduleLogsObj.doScheduleDetail(scheduleLogsObj.scheduleEmpty);	// 显示右侧播放列表
			global.msgTip.closeSelf();
		}, global.msgTip.handleRequestFail);
	},
	// 导入排期
	doImport: function() {
		let importDate = document.getElementById("importDateBtn").value;
		if(importDate == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择日期", "importDateBtn");
			return;
		}
		global.msgTip.load();
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "importShow",
			importDate: importDate
		};
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 导入排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc();
				global.msgTip.tipAlert({"txt":res.data, "yes": function() {layer.closeAll();}});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 下发排期
	doDistribute: function() {
		let distributeDate = document.getElementById("distributeDateBtn").value;
		if(distributeDate == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择日期", "distributeDateBtn");
			return;
		}
		// 接口参数
		scheduleLogsObj.scheduleOps.data = {
			act: "sendShow",
			showDate: distributeDate
		};
		// 转换参数
		scheduleLogsObj.scheduleOps.data = global.convertOpsData(scheduleLogsObj.scheduleOps.data);
		tmsRequest.ajax(scheduleLogsObj.scheduleOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 下发排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc();
				global.msgTip.tipAlert({"txt":res.data, "yes": function() {layer.closeAll();}});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 复制排期
	doCopy: function() {
		var fromDate = $("#copyScheFromDateBtn").val(),
			fromHall = $("#inputselect").val(),
			toDate = $("#copyScheToDateBtn").val(),
			toHall = [],
			inputObj = $(".copy-hall-list").find("input");
		if(fromDate == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择源日期", "copyScheFromDateBtn");
			return;
		}
		if(fromHall == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择源厅", "copySltHall");
			return;
		}
		if(toDate == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择目标日期", "copyScheToDateBtn");
			return;
		}
		for(var i = 0, len = inputObj.length; i < len; i++) {
			let status = $(inputObj[i])[0].checked;
			if(status) {
				toHall.push($(inputObj[i])[0].value);
			}
		}
		if(toHall.length == 0) {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择目标厅", "copyHallList");
			return;
		}
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "copyShow",
			fromHall: fromHall,
			toHall: toHall,
			fromDate: fromDate,
			toDate: toDate
		};
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		if(scheduleLogsObj.scheduleShowOps.data.indexOf("replaceKey") != -1){
			scheduleLogsObj.scheduleShowOps.data = scheduleLogsObj.scheduleShowOps.data.replace(/replaceKey/, "toHall");
		}
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 复制排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc();
				global.msgTip.tipAlert({"txt":res.data});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 删除排期
	doDelete: function() {
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "delShow",
			showId: scheduleLogsObj.schBlockData.showId,
			delDate: null,
			isAll: 0
		};
		if(!scheduleLogsObj.schBlockData.showId) {
			scheduleLogsObj.scheduleShowOps.data.delDate = scheduleLogsObj.curDate;
			scheduleLogsObj.scheduleShowOps.data.isAll = 1;
		}else {
			scheduleLogsObj.scheduleShowOps.data.delDate = null;
			scheduleLogsObj.scheduleShowOps.data.isAll = 0;
		}
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 删除排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc("update");
				global.msgTip.tipAlert({
					"txt":res.data,
					"yes": function() {scheduleLogsObj.showScheduleList(true);},
					"cancel": function() {scheduleLogsObj.showScheduleList(true);}
				});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 编辑排期(新增/修改)
	doUpdate: function() {
		var isEdit = scheduleLogsObj.operFlag.isEdit,
			hallId = $("#inputselect01").val(),
			stime = $("#editScheDateBtn").val(),
			splId = scheduleLogsObj.splClickData.id,
			splName = scheduleLogsObj.splClickData.name,
			showId = scheduleLogsObj.schBlockData.showId,
			showState = scheduleLogsObj.schBlockData.showState;
		if(hallId == "") {
			global.msgTip.tipTips("请选择影厅", "editSltHall");
			return;
		}
		if(stime == "") {
			global.msgTip.tipTips("请选择开始时间", "editScheDateBtn");
			return;
		}
		if(!splId || !splName) {
			global.msgTip.tipTips("请选择选择一个SPL", "splListDiv");
			return;
		}
		// 准备参数
		if(!isEdit) {
			console.log("---------------------- 新增排期 ----------------------")
			// 接口参数
			scheduleLogsObj.scheduleShowOps.data = {
				act: "newShow",
				hallId: hallId,
				startTime: stime,
				splId: splId,
				splName: splName
			};
		}else {
			console.log("---------------------- 编辑排期 ----------------------")
			// 接口参数
			scheduleLogsObj.scheduleShowOps.data = {
				act: "editShow",
				hallId: hallId,
				startTime: stime,
				splId: splId,
				splName: splName,
				showId: showId,
				showState: showState
			};
		}
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		// 请求接口
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 编辑排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc("update");
				global.msgTip.tipAlert({
					"txt": res.data,
					"yes": function() {scheduleLogsObj.showScheduleList(true);},
					"cancel": function() {scheduleLogsObj.showScheduleList(true);}
				});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 同步排期
	doSynchronize: function() {
		let syncDate = document.getElementById("synchronizeDateBtn").value,
			inputObj = $(".syn-hall-list").find("input"),
			hallIdArr = [];
		if(syncDate == "") {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择日期", "synchronizeDateBtn");
			return;
		}
		for(var i = 0, len = inputObj.length; i < len; i++) {
			let status = $(inputObj[i])[0].checked;
			if(status) {
				hallIdArr.push($(inputObj[i])[0].value);
			}
		}
		if(hallIdArr.length == 0) {
			// global.msgTip.tipAlert({"txt":"请选择日期"});
			global.msgTip.tipTips("请选择影厅", "synHallList");
			return;
		}
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "synShow",
			syncDate: syncDate,
			hallIdArr: hallIdArr
		};
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		if(scheduleLogsObj.scheduleShowOps.data.indexOf("replaceKey") != -1){
			scheduleLogsObj.scheduleShowOps.data = scheduleLogsObj.scheduleShowOps.data.replace(/replaceKey/, "hallIdArr");
		}
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 同步排期 -----------------");
			console.log(res);
			if(res && res.status == "ok") {
				$.unblockUI();
				scheduleLogsObj.resetFunc();
				global.msgTip.tipAlert({"txt":res.data});
			}
		}, global.msgTip.handleRequestFail);
	},
	// 排期详情
	doScheduleDetail: function(flag) {
		global.msgTip.load();	// 加载动画
		// 非编辑时默认显示第一场排期信息
		var infos = !scheduleLogsObj.operFlag.isEdit ? scheduleLogsObj.firstSchInfo : scheduleLogsObj.playSchInfo,
			showId = infos.showId,
			stime;
		if(scheduleLogsObj.playSchInfo.stime.split(":").length == 3) {
			stime = scheduleLogsObj.playSchInfo.stime.slice(0, 5);
			scheduleLogsObj.playSchInfo.stime = stime;
		}
		// 更新Vue实例数据
		scheduleLogsObj.playListVueData.filmInfo = infos;
		// 接口参数
		scheduleLogsObj.scheduleShowOps.data = {
			act: "detailsShow",
			showId: showId
		};
		// 转换参数
		scheduleLogsObj.scheduleShowOps.data = global.convertOpsData(scheduleLogsObj.scheduleShowOps.data);
		tmsRequest.ajax(scheduleLogsObj.scheduleShowOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			if(res && res.status == "ok") {
				console.log("------------------------ 排期详情 ------------------------");
				console.log(res);
				let descInfos = res.data.excptInfo,
					playItems = res.data.splInfo, 
					len = playItems.length,
					duration = 0,
					duration2 = 0,
					isActive = false;
				for(let i = 0; i < len; i++) {
					isActive = i == 0 ? true : false;
					duration = playItems[i].duration*1;
					// 时间单位转换(转为分钟)
					if(duration < 60)duration2 = duration + "″";
					if(duration == 60)duration2 = "1′";
					if(duration > 60) {
						// 1小时
						if(duration === 3600)duration2 = "60′";
						else {
							if(duration%60 === 0)duration2 = Math.floor(duration/60) + "′";
							else duration2 = Math.floor(duration/60) + "′" + duration%60 + "″";
						}
					}
					// 列表展开状态
					playItems[i].isActive = isActive;
					playItems[i].duration2 = duration2;
				}
				// 描述信息
				for(let s = 0, len2 = descInfos.length; s < len2; s++) {
					descInfos[s].descs = [];	// 添加异常信息
					switch(descInfos[s].show_state*1) {
						case 0:
							descInfos[s].showInfo = "排期未下发";
							break;
						case 1:
							descInfos[s].showInfo = "排期已经正常下发";
							break;
						case 2:
							let excptInfo2 = descInfos[s].excptInfo,
								len3 = excptInfo2.length;
							for(let j = 0; j < len3; j++) {
								descInfos[s].descs.push({
									text: excptInfo2[j].description
								})
							}
							descInfos[s].showInfo = "排期下发失败";
							break;
					}
				}
				// 更新Vue实例数据
				scheduleLogsObj.playListVueData.descInfo = descInfos;
				scheduleLogsObj.playListVueData.playListItems = playItems;
				setTimeout(function() {
					$(".content_1").mCustomScrollbar("destroy");
					$(".content_1").mCustomScrollbar({
						scrollInertia:150
					});
				}, 200);
				setTimeout(function() {
					$(".desc_info_box").mCustomScrollbar("destroy");
					$(".desc_info_box").mCustomScrollbar({
						scrollInertia:150
					});
				}, 100);
			}
			global.msgTip.closeSelf();
		}, global.msgTip.handleRequestFail);
	},
	// 获取SPL列表
	getSplList: function() {
		scheduleLogsObj.splListOps.data = {
			act: "listSpl",
			searchArr: [{"splName": ""}],
			pageNum: "",
			pageCode: ""
		};
		// 转换参数
		scheduleLogsObj.splListOps.data = global.convertOpsData(scheduleLogsObj.splListOps.data);
		if(scheduleLogsObj.splListOps.data.indexOf("replaceKey") != -1){
			scheduleLogsObj.splListOps.data = scheduleLogsObj.splListOps.data.replace(/replaceKey/, "searchArr");
		}
		tmsRequest.ajax(scheduleLogsObj.splListOps, function(res) {
			if(res && res.status == "error") {
				tmsRequest.handleSuccessStatusError(res);
				return;
			}
			console.log("----------------- 获取SPL列表 -----------------");
			console.log(scheduleLogsObj.operFlag);
			console.log(res);
			let datas = res.data.spl || [],
				len = datas ? Object.keys(datas).length : 0,
				duration = 0,
				duration2 = 0;
			for(var i in datas) {
				duration = datas[i].totalDuration*1;
				// 时间单位转换(转为分钟)
				if(duration < 60)duration2 = duration + "″";
				if(duration == 60)duration2 = "1′";
				if(duration > 60) {
					// 1小时
					if(duration === 3600)duration2 = "60′";
					else {
						if(duration%60 === 0)duration2 = Math.floor(duration/60) + "′";
						else duration2 = Math.floor(duration/60) + "′" + duration%60 + "″";
					}
				}
				datas[i].duration2 = duration2;
			}
			var isEdit = scheduleLogsObj.operFlag.isEdit ? false : true;
			// 更新Vue实例数据
			scheduleLogsObj.splListVueData.splListItems = datas;
			scheduleLogsObj.splListVM.isEdit = isEdit;
			// scheduleLogsObj.splListVM.splListItems = scheduleLogsObj.splListVueData.splListItems;
			$(".overflow01").mCustomScrollbar({
				scrollInertia:150
			});
		}, global.msgTip.handleRequestFail);
	},
	// 影厅基础信息
	getHallInfo: function() {
		var args = arguments,
			dataStatus = Boolean(document.querySelector(".hall-list-ul").dataset.status*1),	// 当前是否已有数据
			dataStatus2 = Boolean(document.querySelector(".syn-hall-list").dataset.status*1),
			dataStatus3 = Boolean(document.querySelector(".copy-hall-list").dataset.status*1);
		scheduleLogsObj.deviceOps.data = {
			act: "listHall",
			hallID: null
		}
		// 转换参数
		scheduleLogsObj.deviceOps.data = global.convertOpsData(scheduleLogsObj.deviceOps.data);
		// 区分新增/编辑
		if(args && args[0] == "edit")scheduleLogsObj.loadEditData();
		// 请求接口
		if(!dataStatus || !dataStatus2 || !dataStatus3) {
			tmsRequest.ajax(scheduleLogsObj.deviceOps, function(res) {
				if(res && res.status == "error") {
					tmsRequest.handleSuccessStatusError(res);
					return;
				}
				console.log("----------------- 获取影厅数据 -----------------");
				console.log(res);
				let datas = res.data,
					size = datas.length,
					cls = "",
					str = "",	// 编辑厅列表
					str1 = "",	// 复制厅源列表
					str2 = "",	// 复制厅目标列表
					str3 = "";	// 同步厅列表
				for(var i = 0; i < size; i++) {
					i == 0 && (cls = "top");
					i == size - 1 && (cls = "bottom");
					str += "<li class='" + cls + "' onclick='global.divselect.setSelectVal(this, event);'><a href='javascript:;' selectid='" + datas[i].hall_id + "'>" + datas[i].hall_name + "厅</a></li>";
					str1 += "<li class='" + cls + "' onclick='global.divselect.setSelectVal(this, event, \"inputselect\");'><a href='javascript:;' selectid='" + datas[i].hall_id + "'>" + datas[i].hall_name + "厅</a></li>";
					str2 += "<p><input type='checkbox' value='" + datas[i].hall_id + "' id='copyHall" + datas[i].hall_id + "' class='hall-check' /><label for='copyHall" + datas[i].hall_id + "'>" + datas[i].hall_name + "厅</label></p>"
					str3 += "<p><input type='checkbox' value='" + datas[i].hall_id + "' id='synHall" + datas[i].hall_id + "' class='hall-check' /><label for='synHall" + datas[i].hall_id + "'>" + datas[i].hall_name + "厅</label></p>"
				}
				document.querySelector(".hall-list-ul").innerHTML = str;
				document.querySelector(".hall-list-ul2").innerHTML = "<li class='" + cls + "' onclick='global.divselect.setSelectVal(this, event, \"inputselect\");'><a href='javascript:;' selectid='all'>所有厅</a></li>" + str1;
				document.querySelector(".copy-hall-list").innerHTML = str2;
				document.querySelector(".syn-hall-list").innerHTML = str3;
				document.querySelector(".hall-list-ul").dataset.status = 1;
				document.querySelector(".hall-list-ul2").dataset.status = 1;
				document.querySelector(".copy-hall-list").dataset.status = 1;
				document.querySelector(".syn-hall-list").dataset.status = 1;
			}, global.msgTip.handleRequestFail);
		}
	},
	// 更新速选日期列表
	updateQuickDates: function(chooseDate) {
		var dateWeek = global.dateTool.getDateWeekArr(chooseDate, 3);
		scheduleLogsObj.quickDateVueData.dateItems = dateWeek;	// 更新Vue实例数据
		console.log(scheduleLogsObj.quickDateVueData);
	},
	// 按速选日期显示排期
	handleClickQuickDate: function(evt) {
		var value = evt.target.dataset.value,
			idx = evt.target.dataset.idx,
			valueArr = value.split("-");
		this.curDateTab = idx;
		scheduleLogsObj.curDate = value;
		scheduleLogsObj.showScheduleList(true);
	},
	// 点击排期块
	handleClickSchBlock: function(evt) {
		var target = evt.target.dataset,
			nodeName = target.nodeName,
			pid = null,
			cid = null,
			hallId = null,
			hallName = null,
			filmName = null,
			sdtime = null,
			etime = null,
			isSelected = null;
			showId = null;
			showState = null;
		/*if(nodeName === "DIV") {
			pid = target.dataset.pid;
			cid = target.dataset.cid;
			hallId = target.dataset.hallid;
			hallName = target.dataset.hallname;
		}
		if(nodeName === "SPAN") {
			pid = target.parentNode.parentNode.dataset.pid;
			cid = target.parentNode.parentNode.dataset.cid;
			hallId = target.parentNode.parentNode.dataset.hallid;
			hallName = target.parentNode.parentNode.dataset.hallname;
		}
		if(nodeName === "P") {
			pid = target.parentNode.dataset.pid;
			cid = target.parentNode.dataset.cid;
			hallId = target.parentNode.dataset.hallid;
			hallName = target.parentNode.dataset.hallname;
		}*/
		pid = target.pid;
		cid = target.cid;
		hallId = target.hallid;
		hallName = target.hallname;
		filmName = target.name;
		sdtime = target.sdtime;
		etime = target.etime;
		isSelected = scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].isSelected;
		showId = target.id;
		showState = target.showstate;
		console.log("parent index : "+pid);
		console.log("children index : "+cid);
		console.log("hall id : "+hallId);
		console.log("hall name : "+hallName);
		console.log("film name : "+filmName);
		console.log("show id : "+showId);
		console.log("show state : "+showState);
		console.log("start date-time : "+sdtime);
		console.log("end date-time : "+etime);
		// Vue数据驱动
		for(var i = 0, len = scheduleLogsObj.hallSchVM.scheduleItems.length; i < len; i++) {
			let tempShow = scheduleLogsObj.hallSchVM.scheduleItems[i].show,
				tempShowLen = tempShow.length;
			// 将所有排期全部置为false
			for(var j = 0; j < tempShowLen; j++) {
				scheduleLogsObj.hallSchVM.scheduleItems[i].show[j].isSelected = false;
			}
		}
		scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].isSelected = isSelected ? false: true;
		console.log("排期块是否选中 : "+scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].isSelected)
		if(scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].isSelected) {
			global.msgTip.tipMsg("已选中排期，可进行编辑");
			scheduleLogsObj.operFlag.isEdit = true;
			scheduleLogsObj.operFlag.hallId = hallId;
			scheduleLogsObj.operFlag.hallName = hallName;
			scheduleLogsObj.operFlag.datetime = sdtime;
			scheduleLogsObj.operFlag.endtime = etime;
			scheduleLogsObj.schBlockData.showId = showId;
			scheduleLogsObj.schBlockData.showState = showState;
			scheduleLogsObj.playSchInfo.showId = showId;
			scheduleLogsObj.playSchInfo.hallName = hallName + "厅";
			scheduleLogsObj.playSchInfo.filmName = filmName;
			scheduleLogsObj.playSchInfo.stime = sdtime.split(" ")[1];
		}else {
			// 重置
			scheduleLogsObj.operFlag = {
				isEdit: false	// 当前是否是编辑操作
			};
			scheduleLogsObj.schBlockData = {
				showId: null,
				showState: null
			};
			layer.closeAll();
		}
		// 显示排期详情
		scheduleLogsObj.doScheduleDetail();
	},
	// 鼠标进入排期块(显示)
	hanldeMouseEnter: function(evt) {
		var nodeName = evt.target.nodeName,
			pid = evt.target.dataset.pid,
			cid = evt.target.dataset.cid;
		// dom样式控制
		// if(nodeName === "DIV")evt.target.children[3].style.display = "block";
		// if(nodeName === "P")evt.fromElement.style.display = "block";
		// Vue数据驱动
		scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].wholeName = true;
	},
	// 鼠标离开排期块(隐藏)
	hanldeMouseleave: function(evt) {
		var nodeName = evt.target.nodeName,
			pid = evt.target.dataset.pid,
			cid = evt.target.dataset.cid;
		// dom样式控制
		// if(nodeName === "DIV")evt.target.children[3].style.display = "none";
		// if(nodeName === "P")evt.fromElement.style.display = "none";
		// Vue数据驱动
		scheduleLogsObj.hallSchVM.scheduleItems[pid].show[cid].wholeName = false;
	},
	// 点击"选择SPL"按钮
	showSPLforInsert: function() {
		console.log("显示SPL列表");
		scheduleLogsObj.splListVM.isEdit = false;
		$(".spl-list-ul").find("li").show();
	},
	// 点击"搜索"按钮
	handleClickSearch: function() {
		var keyWords = this.keyWords,
			liObj = $(".spl-list-ul").find("li"),
			len = liObj.length,
			name;
		// if(keyWords == "" || len <= 1) {
		// 	global.msgTip.tipTips("请获取SPL列表后，输入关键字搜索", "splKeyWords");
		// 	return;
		// }
		for(var i = 0; i < len; i++) {
			name = $(liObj[i]).attr("data-name");
			if(name.indexOf(keyWords) === -1)$(liObj[i]).hide();
			else $(liObj[i]).show();
		}
	},
	// 点击SPL列表
	handleClickSPL: function(evt) {
		var dtst = evt.target.dataset,
			id = dtst.id,
			name = dtst.name;
		console.log("id : "+id);
		console.log("name : "+name);
		$("#showSltSPLName").val(name);
		scheduleLogsObj.splClickData.id = id;
		scheduleLogsObj.splClickData.name = name;
	},
	// 选择全部厅
	handleCheckAllHall: function(obj, flag) {
		var allStatus = $(obj).find("input")[0].checked,
			inputObj;
		setTimeout(function() {
			console.log("all status : "+allStatus);
			if(flag === 1) {
				// 复制排期
				inputObj = $(".copy-hall-list").find("input");
			}
			if(flag === 2) {
				// 同步排期
				inputObj = $(".syn-hall-list").find("input");
			}
			for(var i = 0, len = inputObj.length; i < len; i++) {
				$(inputObj[i])[0].checked = allStatus;
			}
		}, 50);
	},
	// 复制排期:监控源厅是否为"所有厅"
	handleListenAllForCopySch: function(ele, val) {
		var inputObj = null, len = 0;
		if(ele == "inputselect") {
			console.log("复制排期:监控源厅是否为'所有厅'");
			// 复制排期:所有厅
			inputObj = $(".copy-sch-hall-all").find("input");
			len = inputObj.length;
			if(val == "all") {
				for(var i = 0; i < len; i++) {
					$(inputObj[i])[0].checked = true;
					$(inputObj[i])[0].disabled = true;
				}
			}else {
				for(var i = 0; i < len; i++) {
					$(inputObj[i])[0].checked = false;
					$(inputObj[i])[0].disabled = false;
				}
			}
		}
	},
	// 点击播放列表某一记录
	handleClickPlayListItem: function(evt) {
		var idx = evt.target.dataset.idx*1,
			lists = this.playListItems,
			len = lists.length,
			isActive = false;
		console.log("当前点击的是第 " + (idx + 1) + " 项");
		console.log(lists);
		for(var i = 0; i < len; i++) {
			isActive = i == idx ? true : false;
			lists[i].isActive = isActive;
		}
		this.playListItems = lists;	// 更新Vue实例数据
		$(".content_1").mCustomScrollbar({
			scrollInertia:150
		});
		/*setTimeout(function() {
			$(".desc_info_box").mCustomScrollbar({
				scrollInertia:150
			});
		}, 100);*/
	},
	// 加载编辑数据项
	loadEditData: function() {
		console.log("---------------------- 加载编辑数据项 ----------------------");
		var operData = scheduleLogsObj.operFlag;
		if(operData.isEdit) {	// 编辑
			document.getElementById("editLayerTitle").innerText = "编辑排期";
			document.getElementById("editSltHall").innerText = operData.hallName + "厅";
			document.getElementById("inputselect01").value = operData.hallId;
			document.getElementById("editScheDateBtn").value = operData.datetime;
		}else {	// 新增
			document.getElementById("editLayerTitle").innerText = "新增排期";
			document.getElementById("editSltHall").innerText = "请选择厅";
			document.getElementById("inputselect01").value = "";
			document.getElementById("editScheDateBtn").value = "";
		}
	},
	// 重置数据
	resetFunc: function(param) {
		$("#importDateBtn, #distributeDateBtn, #copyScheFromDateBtn, #copyScheToDateBtn, #synchronizeDateBtn").val("");
		$("#showSltSPLName").val("");
		$("#copySltHall").text("请选择厅");
		if(document.querySelector(".hall-check")) {
			$(".hall-check, #copySltAll").attr("disabled", false);
			$(".hall-check, #copySltAll, #synAllHall").attr("checked", false);
		}
		if(param && param == "update") {
			// 重置
			scheduleLogsObj.operFlag = {
				isEdit: false	// 当前是否是编辑操作
			};
			// 点击排期块数据
			scheduleLogsObj.schBlockData = {
				showId: null,
				showState: null
			};
		}
		// spl列表点击数据
		scheduleLogsObj.splClickData = {
			id: null,
			name: null
		};
	},
	// 处理数据
	processData: {
		// 获取排期影厅
		getHallFromSchedule: function(datas) {
			global.valideDataObj.valideDataType(datas, "object");	// 校验数据类型
			console.log("------------------- 获取排期影厅 -------------------");
			let size = datas.length,
				className = "",
				tempObj = {},
				result = [];
			for(var i = 0; i < size; i++) {
				tempObj = datas[i];
				switch(tempObj.hallState) {
					case 0:
						className = "color_blue";
						break;
					case 1:
						className = "color_yellow";
						break;
					case 2:
						className = "color_red";
						break;
					default:
						className = "";
						break;
				}
				result.push({
					id: tempObj.hall_id,
					name: tempObj.hall_name,
					className: className
				})
			}
			return result;
		},
		// 获取排期数据
		getHallSchedule: function(datas) {
			global.valideDataObj.valideDataType(datas, "object");	// 校验数据类型
			console.log("------------------- 获取排期数据 -------------------");
			let size = datas.length,
				hallId = null,
				hallName = null,
				hasAdver = false,
				styleVal = "",
				selectedStyleVal = "background-color: rgb(235, 150, 29); ",	// 选中时的样式
				adverStyle = "";
				nameStyle = "";
				stimeStyle = "";
				ptimeStyle = "";
				showId = null,
				showState = null,
				splState = null;
				width = 0;
				tempShow = [],
				playShow = [],
				showSize = 0,
				tempObj = {},
				showSch = [],
				result = [];
			for(var i = 0; i < size; i++) {
				// 无排期
				if(!datas[i].show || datas[i].show.length == "") {
					result.push({"show": []});
					continue;
				}
				scheduleLogsObj.scheduleEmpty = false;	// 有排期
				playShow = playShow == "" ? datas[i].show : playShow;
				hallId = datas[i].hall_id;
				hallName = datas[i].hall_name;
				tempShow = datas[i].show;
				showSize = tempShow.length;
				showSch = [];
				// 遍历厅的排期
				for(let j = 0; j < showSize; j++) {
					styleVal = "";
					tempObj = tempShow[j];
					showId = tempObj.st_id;
					showState = tempObj.show_state*1;
					splState = tempObj.splState;
					width = tempObj.f_width;
					switch(showState) {
						case 1:
							styleVal = "background-color:#1db2eb; ";
							break;
						case 2:
							styleVal = "background-color:#f44a48; ";
							break;
					}
					// 是否有广告
					switch(splState) {
						case 1:
							hasAdver = false;	// 只有正片, 没有广告
							break;
						case 2:
						 	hasAdver = true;	// 排期有正片也有广告
						 	break;
						 case 3:
						 	hasAdver = true;	// 只有广告
						 	break;
					}
					// 色块宽度
					if(width >= 70) {
						adverStyle = "";
						nameStyle = "";
						stimeStyle = "";
						ptimeStyle = "";
					}
					if(width >= 35 && width < 70) {
						adverStyle = "";
						nameStyle = " display: none;";
						stimeStyle = "";
						ptimeStyle = " display: none;";
					}
					if(width < 35) {
						adverStyle = "";
						nameStyle = " display: none;";
						stimeStyle = " display: none;";
						ptimeStyle = " display: none;";
					}
					styleVal += "width: " + tempObj.f_width + "px; left: " + tempObj.left_set + "px;";
					selectedStyleVal += "width: " + tempObj.f_width + "px; left: " + tempObj.left_set + "px;";
					
					showSch.push({
						id: tempObj.st_id,
						name: tempObj.show_name,	// 影片名
						stuid: tempObj.st_uuid,
						splid: tempObj.spl_uuid,
						date: tempObj.belong_date,	// 日期
						stime: tempObj.start_time_d,	// 开始时间
						ptime: "(" + tempObj.p_time_d + ")",	// 正片开始时间
						etime: tempObj.belong_date + " " + tempObj.end_time_d + ":00",	// 结束时间
						datetime: tempObj.belong_date + " " + tempObj.start_time_d + ":00",
						duration: tempObj.duration,
						showState: tempObj.show_state,
						playState: tempObj.play_state,
						hallId: hallId,
						hallName: hallName,
						hasAdver: hasAdver,
						wholeName: false,
						isSelected: false,
						styleVal: styleVal,
						adverStyle: adverStyle,
						nameStyle: nameStyle,
						stimeStyle: stimeStyle,
						ptimeStyle: ptimeStyle,
						selectedStyleVal: selectedStyleVal
					});
				}
				result.push({"show": showSch});
				// 保存第一场排期的信息
				if(!scheduleLogsObj.firstSchInfo.showId) {
					scheduleLogsObj.firstSchInfo.showId = showId;
					scheduleLogsObj.firstSchInfo.hallName = hallName + "厅";
					scheduleLogsObj.firstSchInfo.filmName = playShow[0].show_name;
					scheduleLogsObj.firstSchInfo.stime = playShow[0].start_time_d;
					scheduleLogsObj.playSchInfo.showId = showId;
					scheduleLogsObj.playSchInfo.hallName = hallName + "厅";
					scheduleLogsObj.playSchInfo.filmName = playShow[0].show_name;
					scheduleLogsObj.playSchInfo.stime = playShow[0].start_time_d;
				}
			}
			return result;
		}
	},
	// 快速选择日期控件
	handlePickerQuickDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
		scheduleLogsObj.quickDateVM.curDateTab = 0;
		scheduleLogsObj.curDate = sltDate;
		scheduleLogsObj.updateQuickDates(sltDate);
		scheduleLogsObj.showScheduleList(true);
	},
	// 导入排期日期控件
	handlePickerImportDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	// 下发排期日期控件
	handlePickerDistributeDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	// 编辑排期日期控件
	handlePickerEditScheDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	// 同步排期日期控件
	handlePickerSynchronizeDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	// 复制排期日期控件 - 源
	handlePickerCopyScheFromDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	// 复制排期日期控件 - 目标
	handlePickerCopyScheToDate: function() {
		let sltDate = $dp.cal.getDateStr();
		console.log("选择的日期为："+sltDate);
	},
	/**
	* 弹层(排期 - 日志)
	* @description: 注册相关事件
	**/
	registEvent() {
		// 导入
		$('#ele1').unbind("click").click(function() {
			$.blockUI({ message: $('#blk1') });
		});
		// 下发
		$('#ele01').unbind("click").click(function() {
			$.blockUI({ message: $('#blk01') });
		});
		// 复制
		$('#ele2').unbind("click").click(function() {
			scheduleLogsObj.getHallInfo();
			/*if(scheduleLogsObj.scheduleEmpty) {
				layer.alert("当前暂无排期", {title: "系统提示", icon: 5, move: false});
				return;
			}*/
			$.blockUI({ message: $('#blk2') });
		});
		// 删除
		$('#ele3').unbind("click").click(function() {
			console.log("schedule isSelected [delete] : "+scheduleLogsObj.operFlag.isEdit);
			console.log("schedule end-time [delete] : "+scheduleLogsObj.operFlag.endtime);
			var scheEndtime = null, nowTime = global.dateTool.getNowTime();
			if(scheduleLogsObj.scheduleEmpty) {
				layer.alert("当前暂无排期", {title: "系统提示", icon: 5, move: false});
				return;
			}else {
				if(scheduleLogsObj.operFlag.isEdit) {
					scheEndtime = scheduleLogsObj.operFlag.endtime;
					if(scheEndtime < nowTime) {
						layer.alert("已结束的单场排期不可删除", {title: "系统提示", icon: 6, move: false});
						return;
					}
					console.log("scheEndtime : "+scheEndtime);
					console.log("nowTime : "+nowTime);
					console.log("scheEndtime > nowTime ----------- " + (scheEndtime > nowTime));
				}
			}
			$.blockUI({ message: $('#blk3') });
		});
		// 编辑
		$('#ele4').unbind("click").click(function() {
			console.log("schedule isSelected [edit] : "+scheduleLogsObj.operFlag.isEdit);
			console.log("schedule end-time [edit] : "+scheduleLogsObj.operFlag.endtime);
			var scheEndtime = null, nowTime = global.dateTool.getNowTime(),
				valueArr = scheduleLogsObj.curDate.split("-"),
				nowTime = global.dateTool.getNowTime().split(":");
			if(scheduleLogsObj.operFlag.isEdit) {
				scheEndtime = scheduleLogsObj.operFlag.endtime;
				if(scheEndtime < nowTime) {
					layer.alert("已结束的排期不可编辑", {title: "系统提示", icon: 6, move: false});
					return;
				}
				console.log("scheEndtime : "+scheEndtime);
				console.log("nowTime : "+nowTime);
				console.log("scheEndtime > nowTime ----------- " + (scheEndtime > nowTime));
			}
			scheduleLogsObj.getHallInfo("edit");
			scheduleLogsObj.getSplList();
			$.blockUI({ message: $('#blk4') });
		});
		// 同步
		$('#ele5').unbind("click").click(function() {
			scheduleLogsObj.getHallInfo();
			/*if(scheduleLogsObj.scheduleEmpty) {
				layer.alert("当前暂无排期", {title: "系统提示", icon: 5, move: false});
				return;
			}*/
			$.blockUI({ message: $('#blk5') });
		});
		// 查看详情
		$('#ele6').unbind("click").click(function() {
			$.blockUI({ message: $('#blk6') });
		});
		$(".closeST, #closeST").unbind("click").click(function(){
			$.unblockUI();
			scheduleLogsObj.resetFunc();
		});
	}
}