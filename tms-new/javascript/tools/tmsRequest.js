/**
* 接口通信模块
* 
* @author ccq
**/

var tmsRequest;
define(["jquery"], function($) {
	tmsRequest = {
		statusCode: {
			404: function() {
				layer.alert('服务器开小差了~:)', {title: "系统提示", icon: 5, move: false});
			}
		},
		handleSuccessStatusError: function(res) {
			var msgTxt = "";
			if(res.status == "error" || res.state == "error") {
				msgTxt = res.data || res.ret || "空~:)"
				layer.alert(msgTxt, {title: "系统提示", icon: 5, move: false});
			}
		},
		handleFailStatusError: function(msg) {
			layer.alert(msg, {title: "系统提示", icon: 5, move: false, cancel: function() {layer.closeAll();}}, function() {layer.closeAll();});
		},
		ajax(options, handleSuccess, handleFail, handleStatusCode) {
			if(typeof options !== "object")throw new Error("请求参数类型错误[options]");
			console.log("--------------- 发起ajax请求 ---------------");
			console.log(options);

			var urlDomain = "",
				type = options.method || "POST",
				url = options.url.indexOf("://") == -1 ? urlDomain + options.url : options.url,
				data = options.data || {},
				dataType = options.dataType || "json",
				processData = false,
				statusCode = handleStatusCode || this.statusCode;

			$.ajax({
				type: type,
				url: url,
				data: data,
				dataType: dataType,
				processData: processData,
				statusCode: statusCode,
				success: function(res) {
					if(handleSuccess) {
		                if(typeof handleSuccess !== "function")throw new Error("不是可执行的函数---success");
		                handleSuccess(res);
		            }
				},
				error: function(res) {
					if(handleFail) {
		                if(typeof handleFail !== "function")throw new Error("不是可执行的函数---fail");
		                handleFail(res);
		            }
				}
			})
		},
		test() {
			console.log("start request ...");
		}
	};
	// return tmsRequest;
})