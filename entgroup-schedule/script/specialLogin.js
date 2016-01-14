/**
 * Created by ccq on 2014/10/28.
 */


$(function(){
	// 保证登陆框始终水平/垂直居中
	$(window).scroll(function(){
		var loginBoxDisplay = $("#specialLoginBox").css("display");
		if(loginBoxDisplay == "block")
			$("#specialLoginBox").css({"top":$(window).height()/2 + $(document).scrollTop(), "margin-top":"-170px"});
	});

	// 登录框的关闭
	$("#specialLoginCloseBtn").click(function(){
		$(".zhezhao2").css("display","none");
		$("#specialLoginBox").hide();
		
	});
	// 影片编辑框的关闭
	$("#editFilmCloseBtn").click(function(){
		
	});
	// 影片编辑框的取消
	$("#cancel_edit").click(function(){

	});
	
	// 获取焦点
	$("#slbUsername").focus(function(){
		$("#error_msg_span").text("");
	});
	$("#slbUsername").bind("keydown", function(){
		$("#error_msg_span").text("");
	});
	
	// 获取焦点
	$("#slbPassword").focus(function(){
		$("#error_msg_span").text("");
	});
	$("#slbPassword").bind("keydown", function(){
		$("#error_msg_span").text("");
	});

	// 登录按钮
	$("#lgUserLoginBtn").click(submitSpecialLogin);
	
});

/**
* 初始化登录弹出框
* */
function initLoginDialog(){
	var bootstrapShade1 = $("div[id^='xubox_shade']").css("z-index");
	var bootstrapLayer2 = $("div[id^='xubox_layer']").css("z-index");

	$(".zhezhao2").css({display : "block", height : $(document).height(), "z-index": bootstrapLayer2+1});
	$("#specialLoginBox").css({"display":"block", "top":"50%", "margin-top":"-120px", "z-index": bootstrapLayer2+2});
	$("#slbTitle").text("登录状态已失效，请重新登录");
	$("#slbUsername").focus();
		
	// 重置小登录框的用户名、密码
	$("#slbUsername").val("");
	$("#slbPassword").val("");
	// 重置小登录框的密码
	var browserVer = navigator.appVersion;
	if(browserVer.indexOf("MSIE 8") != -1 || browserVer.indexOf("MSIE 7") != -1 || browserVer.indexOf("MSIE 6") != -1){
		
	}else{
			
	}
}

// 键盘事件 - 捕获“回车”键
document.onkeydown=function(e){
	var currKey=0,e=e||event;
	currKey=e.keyCode||e.which||e.charCode;		// IE||Other Browser
 	//var keyName = String.fromCharCode(currKey);	// 键值对应的键名
	
	if(currKey == 13)submitSpecialLogin();	// 回车键，登录提交
};

// "登录"按钮提交
function submitSpecialLogin(){
	var unameFlag = false;
	var username = $("#slbUsername").val().trim();
	var password = $("#slbPassword").val().trim();;
		
	if(username == null || username == ""){
		$("#error_msg_span").text("请输入常用邮箱地址");
	}else if(username != null || username != ""){
		var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if (regEmail.test(username) == false) {
			$("#error_msg_span").text("邮箱格式不正确!");
			unameFlag = false;
		}else
			unameFlag = true;
	}

	if(unameFlag){
		if(password == null || password == ""){
			$("#error_msg_span").text("请输入密码");
		}
	}
		
	if(username != null && username != "" && unameFlag && password != null && password != ""){
		smsMain.config();
		server.userLogin (
			username, 
			Base64.encode(password), 
			function(callback){
				if (callback.ret == true) {
					server.userLoginSuc(
						function(callbackDatas){
							if (callbackDatas.ret == true) {
								if(callbackDatas.cinemaNickName != ""){
									setCookie("sdleSessionId", callback.sid, 40);
									setCookie("cinemaId", callbackDatas.cinemaId, 40);
									setCookie("sdleLoginName", callbackDatas.nickName, 40);
									setCookie("sdleCinemaNickName", callbackDatas.cinemaNickName, 40);
									setCookie("sdleUserLevel", callbackDatas.userLevel, 40);
								} else {
									setCookie("sdleSessionId", callback.sid, 40);
									setCookie("cinemaId", "", 40);
									setCookie("sdleLoginName", callbackDatas.nickName, 40);
									setCookie("sdleCinemaNickName", callbackDatas.cinemaNickName, 40);
									setCookie("sdleUserLevel", callbackDatas.userLevel, 40);
								}

								// 排片率 - 自动重新获取参数
								var autoRecmd = getCookie("autoRecmd");
								if(autoRecmd == ""){
									autoRecmd = 1;	// 1：自动获取
									setCookie("autoRecmd", autoRecmd, 40);
								}
							} else {
								return;
							}
						}
					);
					smsMain.config();
					$("#slbUsername").val("");
					$("#slbPassword").val("");
					$("#specialLoginBox").hide();
					$(".zhezhao2").css("display","none");
				}
			}
		);
	}
}

