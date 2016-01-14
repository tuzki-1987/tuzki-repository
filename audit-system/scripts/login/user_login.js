function userLoginInit(){
	userLoginHandler._colligateHandler();
	var mid_h = setPageHeight("log_main_banner");
	initLoginBox(mid_h);
}

var userLoginHandler = {
	_colligateHandler:function(){
		$("#username").bind(
			"blur", 
			function(){
				var regEmail = /^([a-zA-Z0-9]+[-|_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if ($(this).val() == "") {
					$(this).val("请输入常用邮箱地址");
					return false;
				} else {
					if (regEmail.test($(this).val().trim()) == false) {
						$(this).val("邮箱格式不正确!");
						return false;
					}
				}
			}
		);
		
		$("#password").bind('keydown', function(e){
	        var key = e.which;
	        if (key != 13)
	        	return ;
	    	e.preventDefault();
	    	userLoginHandler._userLogin();
	    });
		
		$("#lgUserLoginBtn").bind({
			click:function(){
				userLoginHandler._userLogin();
			}
		});
	},
	_userLogin:function(){
		var lgUserEmail = $("#username");
		var lgUserPwd = $("#password");
		
		var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		if (lgUserEmail.val() == "") {
			lgUserEmail.val("请输入常用邮箱地址");
			return false;
		} else {
			if (regEmail.test(lgUserEmail.val().trim()) == false) {
				lgUserEmail.val("邮箱格式不正确!");
				return false;
			}
		}
		
		if (lgUserPwd.val() == "") {
			tipMsg_Single('login_main', 0, "请输入密码", 0, '', '');
			return false;
		} else {
			smsMain.config();
			server.userLogin (
				lgUserEmail.val(), 
				Base64.encode(lgUserPwd.val()), 
				function(callback){
					if (callback.ret == true) {
						server.userLoginSuc(
							function(callbackDatas){
								if (callbackDatas.ret == true) {
									if(callbackDatas.cinemaNickName != ""){
										// setCookie("jh_sdleSessionId", callback.sid, 30);
										// setCookie("jh_cinemaId", callbackDatas.cinemaId, 30);
										setCookie("jh_sdleUserId", callbackDatas.userId, 30);
										setCookie("jh_sdleLoginName", callbackDatas.nickName, 30);
										// setCookie("jh_sdleCinemaNickName", callbackDatas.cinemaNickName, 30);
										setCookie("jh_sdleUserLevel", callbackDatas.userLevel, 30);
										// setCookie("jh_sdleUserOwner", callbackDatas.owner, 30);
									} else {
										// setCookie("jh_sdleSessionId", callback.sid, 30);
										// setCookie("jh_cinemaId", "", 30);
										setCookie("jh_sdleUserId", "", 30);
										setCookie("jh_sdleLoginName", callbackDatas.nickName, 30);
										// setCookie("jh_sdleCinemaNickName", callbackDatas.cinemaNickName, 30);
										setCookie("jh_sdleUserLevel", callbackDatas.userLevel, 30);
										// setCookie("jh_sdleUserOwner", callbackDatas.owner, 30);
									}
								} else {
									return;
								}
							}
						);
						smsMain.config();
						setTimeout(userLoginHandler._sucLogin, 300);
					}
				}
			);
		}
	},
	_sucLogin:function(){
		window.location.href = smsMain._getLocalHost()+"audit-system/index.html";
		setTimeout(userLoginHandler._clearLogin, 500);
	}, 
	_clearLogin:function(){
		$('#username').val('');
		$('#password').val('');
	}
};

/**
* 初始化登录框
*
* @param mid_h 中间区域高度
**/
function initLoginBox(mid_h) {
	var userId = getCookie("jh_sdleUserId");
	var userName = getCookie("jh_sdleLoginName");
	// console.log("userId : "+userId+", userName : "+userName);
	var login_box_h = $(".loginBox").height();
	// 登录框的位置：中间区域高度 - 登录框高度 = 所剩空白部分, 取该部分的一半高度
	var login_box_pos = Math.floor((mid_h - login_box_h)/2);
	$(".loginBox").css("margin-top", login_box_pos + "px");
	$(".loginBox").fadeIn(1000);
}