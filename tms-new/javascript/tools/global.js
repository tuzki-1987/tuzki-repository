/**
* 工具模块
* 
* @author ccq
**/

var global;
define(["require", "vue"], function(require, Vue) {
	global = {
		// 消息提示
		msgTip: {
			// 关闭当前层
			closeSelf: function() {
				layer.close(layer.index);
			},
			// 关闭所有层
			closeLayer: function(flag) {
				layer.closeAll();
			},
			// 加载动画
			load: function(options) {
				let icon = options && options.icon || 1,
					time = options && options.time || 30*1000;	// 默认30秒
				layer.load(icon, {time: time});
			},
			// 信息提示层
			tipMsg: function(msg) {
				layer.msg(msg, {time: 2000});
			},
			// 信息提示层(跟随当前dom)
			tipTips: function(msg, id) {
				var args = arguments;
				if(args.length != 2) {
					msgTxt = `期望参数个数 是2个；而调用时只传了 ${args.length} 个参数。`;
					layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
					throw new Error(msgTxt);
				}
				if(!document.getElementById(id))throw new Error(`未找到dom元素[${id}]`);
				id = id.indexOf("#") != -1 ? id : ("#" + id);
				layer.tips(msg, id, {time: 2000});
			},
			// 确认框
			tipAlert: function(options) {
				global.valideDataObj.valideDataType(options, "object");
				if(!options.txt) {
					layer.alert('未设置提示信息属性[txt]', {title: "系统提示", icon: 5, move: false});
					throw new Error("未设置提示信息属性[txt]");
				}
				let title = options.title || "系统提示",
					icon = options.icon || 6;
				layer.alert(options.txt, {title: title, icon: icon, move: false, cancel: options.cancel}, options.yes);
			},
			// 询问框
			tipConfirm: function(options) {
				global.valideDataObj.valideDataType(options, "object");
				if(!options.txt || !options.callback) {
					layer.alert('未设置提示信息属性[txt] || 回调函数[callback]', {title: "系统提示", icon: 5, move: false});
					throw new Error("未设置提示信息属性[txt] || 回调函数[callback]");
				}
				let title = options.title || "系统提示",
					icon = options.icon || 3;
				options.txt = (options.txt.indexOf("?") == -1 && options.txt.indexOf("？") == -1) ? options.txt + "？" : options.txt;
				layer.confirm(options.txt, {title: title, icon: icon, move: false}, function(index){
					// 点击确认(执行回调)
					options.callback();
					layer.close(index);
				}, function(index) {
					// 点击取消
					console.log("click cancel");
					layer.close(index);
				});
			},
			// common ajax-fail
			handleRequestFail: function() {
				console.log("请求失败");
				tmsRequest.handleFailStatusError("请求失败，请稍后重试");
			}
		},
		/**
		* 日期工具
		**/
		dateTool: {
			// 获取当前日期
			getNowDate: function() {
				var d = new Date(),
					year = d.getFullYear(),
					month = d.getMonth() + 1,
					date = d.getDate(),
					result = "";
				month = month < 10 ? "0" + month : month;
				date = date < 10 ? "0" + date : date;
				result = year + "-" + month + "-" + date;
				
				return result;
			},
			// 获取当前时间
			getNowTime: function() {
				var d = new Date(),
					hour = d.getHours(),
					minute = d.getMinutes(),
					second = d.getSeconds(),
					result = "";
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				result = hour + ":" + minute + ":" + second;
				
				return result;
			},
			// 获取当前日期时间
			getNowDatetime: function() {
				var d = new Date(),
					year = d.getFullYear(),
					month = d.getMonth() + 1,
					date = d.getDate(),
					hour = d.getHours(),
					minute = d.getMinutes(),
					second = d.getSeconds(),
					result = "";
				month = month < 10 ? "0" + month : month;
				date = date < 10 ? "0" + date : date;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				result = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
				
				return result;
			},
			// 获取当前是周几
			getNowDay: function() {
				var d = new Date(),
					weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
					
				return weeks[d.getDay()];
			},
			/**
			* 返回日期和周（相对于某一天的前后dayP天）
			*
			* @param dateP (某一个日期值)日期值
			* @param dayP 日期差值
			*
			* @return Array
			* */
			getDateWeekArr: function(dateP, dayP) {
				var dateArr = dateP ? dateP.split("-") : null,
					d = dateP ? new Date(dateArr[0], parseInt(dateArr[1])-1, dateArr[2]) : new Date(),
					year,
					month,
					date,
					week,
					weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
					dstr = "",
					dval = "",
					dArr = [];
				for(var i = 0; i < dayP; i++) {
					var dItem = {};
					d.setDate(d.getDate() + i);	// 获取 i 天后的日期
					year = d.getFullYear();
					month = d.getMonth() + 1;
					date = d.getDate();
					week = d.getDay();
					
					if(month > 0 && month < 10)month = "0" + month;
					if(date > 0 && date < 10)date = "0" + date;
					
					dstr = month + "月" + date + "日";
					dval = year + "-" + month + "-" + date;
					dItem = {
						idx: i,
						date: dstr,
						value: dval,
						week: weeks[week]
					};
					dArr.push(dItem);
					d = dateP ? new Date(dateArr[0], parseInt(dateArr[1])-1, dateArr[2]) : new Date();
				}
				return dArr;
			}
		},
		/**
		* 模块加载器
		**/
		moduleAdapter: {
			el: ".content-container",	// 模块容器
			defaultModule: "monitorAll",	// 默认模块ID(监控-全厅)
			// 容器渲染
			render: function(moduleID) {
				var _this = this, callbackParam;
				console.log("run module adapter");
				if(!document.getElementById(_this.el) && !document.querySelector(_this.el))throw new Error("未找到模块容器！请使用id或class指定");
				moduleID = moduleID || this.defaultModule;
				console.log("ready render by moduleID : "+moduleID);

				// 获取对应moduleID的模块
				require([moduleID], function(moduleObject) {
					headVM.page = moduleObject.page;	// 更新头部组件Vue-data-page值
					headVM.pageSub = moduleObject.pageSub;	// 更新头部组件Vue-data-pageSub值
					callbackParam = moduleObject.scriptObj || "";
					console.log("headVM.page >>>>>>>>>>>>>>> "+headVM.page)
					console.log("headVM.pageSub >>>>>>>>>>>>>>> "+headVM.pageSub)
					console.log("callbackParam >>>>>>>>>>>>>>> "+callbackParam)
					document.title = moduleObject.title;	// 当前模块的title
					// 通过DOM-id渲染
					if(document.getElementById(_this.el)) {
						document.getElementById(_this.el).innerHTML = moduleObject.template;	// 渲染
					}
					// 通过DOM-class渲染
					if(document.querySelector(_this.el)) {
						document.querySelector(_this.el).innerHTML = moduleObject.template;	// 渲染
					}
					moduleObject.callback && moduleObject.callback(callbackParam);	// 如果有回调, 则渲染完成后回调
					global.msgTip.closeLayer();
				}, function(err) {
					if(err.requireType === "timeout")layer.alert("模块加载超时或未定义: "+err.requireModules.toString(), {title: "系统提示", icon: 5, move: false});
					if(err.requireType === "nodefine")layer.alert("模块未定义", {title: "系统提示", icon: 5, move: false});
					if(err.requireType === "scripterror")layer.alert("模块加载错误: 请检查是否有该模块 - "+err.requireModules.toString(), {title: "系统提示", icon: 5, move: false});
					throw err;
					// 获取模块失败时自动转到首页
					// _this.render(_this.defaultModule);
					// window.location.hash = _this.defaultModule;
				})
			}
		},
		/**
		* 脚本动态创建/删除
		**/
		scriptLoader: {
			basePath: "javascript/",
			/**
			* 引入JS
			*
			* @param args 引入的js文件参数
			*			name: js文件名
			*			path: js文件路径
			**/
			createJSFile: function(args) {
				var _this = this;
				if(args.length <= 0)return;
				_this.removeJSFile(args);
				console.log("--------------- 动态创建JS ---------------");
				console.log(args);
				for(var i = 0, len = args.length; i < len; i++) {
					var scriptEle = document.createElement("script");
					scriptEle.id = args[i].name;
					scriptEle.type = "text/javascript";
					scriptEle.src = _this.basePath + args[i].path + ".js";
					document.body.appendChild(scriptEle);
				}
			},
			/**
			* 移除JS
			*
			* @param args 移除的js文件参数
			*			name: js文件名
			*			path: js文件路径
			**/
			removeJSFile: function(args) {
				if(args.length <= 0)return;
				console.log("--------------- 删除创建JS ---------------");
				console.log(args);
				for(var i = 0, len = args.length; i < len; i++) {
					if(document.getElementById(args[i].name))document.body.removeChild(document.getElementById(args[i].name));
				}
			}
		},
		/**
		* Vue控制器
		**/
		vueController: {
			vueVM: [],	// 已创建的Vue实例
			// 销毁单个Vue实例
			destroySingleVue: function(vm) {
				if(vm && vm._isVue) {
					vm.$destroy();
					console.log("销毁单个Vue实例，是否是Vue实例 ："+vm._isVue);
					console.log("销毁单个Vue实例，是否已销毁 ："+vm._isDestroyed);
				}
			},
			// 销毁全部Vue实例
			destroy: function() {
				var _this = this,
					vms = _this.vueVM;
				if(vms.length > 0) {
					console.log("---------------- 销毁全部Vue实例");
					for(var i = 0, len = vms.length; i < len; i++) {
						vms[i].$destroy();
					}
				}else console.log("还未创建Vue实例")
			},
			// 创建Vue实例
			create: function(options) {
				if(typeof options !== "object")throw new Error("参数类型错误[options]");
				if(!options.el)throw new Error("未找到dom元素[options.el]");
				else {
					// console.log("Vue根元素 : "+options.el.slice(1));
					// console.log(document.getElementById(options.el.slice(1)));
					if(options.el.indexOf("#") != -1 && !document.getElementById(options.el.slice(1)))throw new Error("未找到dom元素[options.el]");
					if(!document.querySelector(options.el))throw new Error("未找到dom元素[options.el]");
				}
				
				var _this = this;
				// _this.destroy();	// 销毁
				// _this.destroySingleVue(options.vm);	// 销毁单个
				// console.log("############################################")
				// console.log(options.data);
				// 返回Vue实例
				return new Vue({
					el: options.el,
					data: options.data || {},
					computed: options.computed || {},
					directives: options.directives || {},
					methods: options.methods || {},
					beforeDestroy: function() {
						console.log("vue 实例销毁---之前---isDestroyed状态 : "+this._isDestroyed);
					},
					destroyed: function() {
						console.log("vue 实例销毁---之后---isDestroyed状态 : "+this._isDestroyed);
					}
				})
			}
		},
		// 处理接口参数格式(将对象转为拼接字符串)
		convertOpsData: function(params) {
			global.valideDataObj.valideDataType(params, "object");	// 校验数据类型
			var result = "";
			for(var prop in params) {
				if(params[prop] && (typeof params[prop] === "object")) {
					result += "replaceKey=" + JSON.stringify(params[prop]) + "&";
					// for(var i = 0, len = params[prop].length; i < len; i++) {
					// 	let propArr = params[prop][i];
					// 	for(var propo in propArr) {
					// 		result += propo + "=" + propArr[propo] + "&";
					// 	}
					// }
				}else result += prop + "=" + params[prop] + "&";
			}
			return result.slice(0, result.length - 1);
		},
		/**
		* 校验数据
		**/
		valideDataObj: {
			/**
			* 校验数据类型
			* 
			* @param data 期望校验的数据
			* @param type 期望校验的数据所属的类型
			**/
			valideDataType: function(data, type) {
				var args = arguments,
					types = ["string", "object", "number", "boolean", "null", "undefined"],
					msgTxt = "";
				if(args.length != 2) {
					msgTxt = `期望参数个数 是2个；而调用时只传了 ${args.length} 个参数。`;
					layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
					throw new Error(msgTxt);
				}
				if(type === "null" || type === "undefined") {
					msgTxt = "无意义的数据类型 [" + type + "]";
					layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
					throw new Error(msgTxt);
				}
				if(types.indexOf(type) == -1) {
					msgTxt = "期望校验的数据所属的类型 不存在, 请检查[type]参数是否正确";
					layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
					throw new Error(msgTxt);
				}
				// 校验数据类型
				if(typeof data !== type) {
					msgTxt = "数据不是期望的类型！期望：[" + type + "]";
					layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
					throw new Error(msgTxt);
				}
			}
		},
		// 重置数据
		resetData: function(key, value) {
			var args = arguments;
			if(args.length != 2) {
				msgTxt = `期望参数个数 是2个；而调用时只传了 ${args.length} 个参数。`;
				layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
				throw new Error(msgTxt);
			}
			if(typeof key !== "string") {
				var type = typeof key;
				msgTxt = `期望参[key]类型是 string；而调用时传了 ${type} 类型。`;
				layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
				throw new Error(msgTxt);
			}
			key = null;
			console.log("key : "+key)
			key = value;
			console.log(key);
		},
		// 去空格
		trim: function(str) {
			return str.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
		},
		// 下拉框事件
		divselect: {
			objX: 0,
			objXx: 0,
			listObj: null,
			// 显示列表
			showList: function(obj, e) {
				e = e || event;
				let _this = this;
				_this.listObj = null;
				_this.objX = e.clientX;	// 记录当前点击位置
				let ul = $(obj).parent().find("ul");
				_this.listObj = ul;
				// 控制显示隐藏
				if(ul.css("display")=="none"){
					ul.slideDown("fast");
				}else{
					ul.slideUp("fast");
				}
				// 注册document事件
				global.divselect.eventkDocument();
			},
			// 设置选中
			setSelectVal: function(obj, e) {
				let args = arguments,
					txt = $(obj).find("a").text(),
					value = $(obj).find("a").attr("selectid"),
					url = location.href;
				$(obj).parent().prev().html(txt);
				$(obj).parent().parent().next().val(value);
				global.divselect.listObj.hide();
				// 复制排期时, 监控全厅
				if(url.indexOf("scheduleLogs") != -1) {
					console.log("args length : "+args.length);
					args.length === 3 && scheduleLogsObj.handleListenAllForCopySch(args[2], value);
				}
			},
			// document-event register(先移除, 再注册)
			eventkDocument: function() {
				if(document.addEventListener) {
					document.removeEventListener("click", global.divselect.clickDocumentFunc);
					document.addEventListener("click", global.divselect.clickDocumentFunc);
				}else if(document.attachEvent) {
					document.detachEvent("onclick", global.divselect.clickDocumentFunc);
					document.attachEvent("onclick", global.divselect.clickDocumentFunc);
				}
			},
			// document-event function
			clickDocumentFunc: function(e) {
				e = e || event;
				let objX = global.divselect.objX,
					objXx = e.clientX;	// 记录当前点击位置
				console.log("addEventListener...global.divselect.objXx : "+objXx);
				// 隐藏
				if(objXx != objX)global.divselect.listObj.hide();
			}
		}
	};
	// return global;
})