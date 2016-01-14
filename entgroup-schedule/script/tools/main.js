var smsMain = {
	clientDebug:true,
	lang:"zh",
	config: function(){
        SmsErr=SmsErrZh;
        server.errorHandler=defaultErrorHandler;
    },
    _getLocalHost:function(){
		return "http://"+window.location.host+"/";
	},
	ownerList:["经理人", "万达网", "时光网", "TSP"]
};

function loginInit(){
	loginMainHandler._colligateHandler();
	loginMainHandler._mainLogin();
	returnTop();
	initLoginBox();
}
$(function(){
	
	// $("#dateLiCom").text(server.dateNowymd());
	loginMainHandler._loginOut();
	loginMainHandler._commontUserInfo();
	// if(getCookie("sdleLoginName") != "") {
	// 	$("#entermywork").show();
	// }
	
	smsMain.config();

});

var loginMainHandler = {
	_colligateHandler:function(){
		$("#password").bind('keydown', function(e){
	        var key = e.which;
	        if (key != 13)
	        	return ;
	    	e.preventDefault();
	    	loginMainHandler._loginHandler();
	    });
		$("#entermywork").bind({
			click:function(){
				window.location.href = smsMain._getLocalHost()+"schedule/show_schedule.html";
			}
		});
	},
	_mainLogin:function(){
		$('#lgUserLoginBtn').click(function(){
			loginMainHandler._loginHandler();
		});
	},
	_loginHandler:function(){
		var email = $('#username');
		var password = $('#password');
		var regUsername = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if (email.val() == "") {
			email.val('邮箱不能为空');
			return false;
		} else {
			if (regUsername.test(email.val()) == false) {
				alert("邮箱格式不正确，请重新输入！");
				email.val("");
				email.focus();
				return false;
			}
		}
		if (password.val() == "") {
			alert('密码不能为空！');
			password.focus();
			return false;
		} else {
			//showShadeHidden();
			smsMain.config();
			server.userLogin(
				email.val(), 
				Base64.encode(password.val()), 
				function(callback){
					hideShadeHidden();
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
										setCookie("sdleUserOwner", callbackDatas.owner, 40);
									} else {
										setCookie("sdleSessionId", callback.sid, 40);
										setCookie("cinemaId", "", 40);
										setCookie("sdleLoginName", callbackDatas.nickName, 40);
										setCookie("sdleCinemaNickName", callbackDatas.cinemaNickName, 40);
										setCookie("sdleUserLevel", callbackDatas.userLevel, 40);
										setCookie("sdleUserOwner", callbackDatas.owner, 40);
									}
								} else {
									return;
								}
							}
						);
						smsMain.config();
						setTimeout(loginMainHandler._successLogin, 400);
					} 
				}
			);
		}
	},
	_loginOut:function() {
		$("#loginOuts").bind(
			'click', 
			function (){
				var cfrmPro = confirm("您确定退出登录吗 ?");
				if (cfrmPro == true) {
					server.loginOut(
						function(callback){
							if(callback.ret = true){
								loginMainHandler._clearCookieSh();
							}
						}	
					);
				} else {
					return;
				}
			}
		);
	},
	_clearCookieSh:function(){
		removeCookie("sdleSessionId");
		removeCookie("cinemaId");
		removeCookie("sdleLoginName");
		removeCookie("sdleCinemaNickName");
		removeCookie("sdleUserLevel");
		removeCookie("sdleUserOwner");
		loginMainHandler._skipLogin();
	},
	_skipLogin:function(){
		window.location.href = smsMain._getLocalHost()+"schedule/login.html";
	},
	_successLogin:function(){
		window.location.href = smsMain._getLocalHost()+"schedule/show_schedule.html";
		setTimeout(loginMainHandler._clearLogins, 500);
	},
	_clearLogins:function(){
		$('#username').val('');
		$('#password').val('');
	},
	_commontUserInfo:function(){
		$("#userInfoName").text(loginMainHandler._nullHandler(getCookie("sdleLoginName")));
		$("#userInfoCinema").text(loginMainHandler._nullHandler(server._strHandler(getCookie("sdleCinemaNickName"), 10)));
		$("#userInfoCinema").attr({title: loginMainHandler._nullHandler(getCookie("sdleCinemaNickName"))});
		$("#userInfoCinema").css({cursor: "pointer"});
		var cookieUserLev = loginMainHandler._nullHandler(getCookie("sdleUserLevel"));
		var levelStr = $('#userInfoLevel');
		if (cookieUserLev == 1) {
			levelStr.text("初级");
		} else if (cookieUserLev == 2) {
			levelStr.text("中级");
		} else if (cookieUserLev == 3) {
			levelStr.text("高级");
		} else {
			levelStr.text(cookieUserLev);
		}

		var cookieUserOwn = loginMainHandler._nullHandler(getCookie("sdleUserOwner"));
		if(cookieUserOwn != undefined && cookieUserOwn != 0) {
			$('#userInfoOwner').text(smsMain.ownerList[cookieUserOwn-1]);
		}
	},
	_nullHandler:function(val){
		if(val == null){
			return "";
		} else {
			return val;
		}
	},
};

//缺省的错误处理函数
function defaultErrorHandler(statusText, status, responseText, errorThrown){
    var response = undefined;
    try {
        response = eval( "(" + responseText + ")" );
    } catch( ex){
    }
    if(response != undefined && !response){
        response = responseText;
        response = response.toString() ? undefined : response;
    }
    if( response ){
        if( response.errcode ) {
            alert(SmsErr.txt(response.errcode, response.errmsg));
        } 
    } else {
        if(status == 1006){
        	tipMsg_Single("lgUserLoginBtn", 0, "该账号不存在", 0, '', '');
        }else if(status == 1010){
        	tipMsg_Single("lgUserLoginBtn", 0, "用户名或密码错误", 0, '', '');
        }/*else if(status == 1029){
        	tipMsg_Single("planlist_model", 0, "排片率为空，请重新获取", 0, '', '');
        	// 此步操作属于推荐排片列表(因列表接口不规范, 故在此加)
        	$("#recmd_load_gif").parent("td").parent("tr").remove();
        }else if(status == 1051){
        	tipMsg_Single("gzt_show", 0, "排片率为空，请添加排片率", 0, '', '');
        	// 此两步操作属于主打片(因列表接口不规范, 故在此加)
        	$(".pri-film-initlist").hide();
			$(".mp-step-1").fadeIn();
			// 此步操作属于自定义排片列表(因列表接口不规范, 故在此加)
			$("#custom_load_gif").parent("td").parent("tr").remove();
        }*/else if(status == 1003){
        	tipMsg_Single("oldPwd", 0, "旧密码输入错误", 0, '', '');
        	$("#oldPwd").val("");
			$("#oldPwd").focus();
        }else if(status == 1049) {
			tipMsg_Single("reg_inf1", 0, "请正确填写邀请码", 0, '', '');
		}else if(status == 1050) {
			tipMsg_Single("reg_inf1", 0, "邀请码不可用", 0, '', '');
		}else{
        	// alert(SmsErr.txt(status, responseText));
        }
    }
}

function __showLoginfo__( mesg){
	if( smsMain.clientDebug ){
		if(window.console) console.log(mesg);
	}
}

/**
* 初始化登录框
*
* @param mid_h 中间区域高度
**/
function initLoginBox() {
	var login_main_h = $(".log_main_banner").height();
	var login_box_h = $(".loginBox").height();
	// 登录框的位置：中间区域高度 - 登录框高度 = 所剩空白部分, 取该部分的一半高度
	var login_box_pos = Math.floor((login_main_h - login_box_h)/2);
	$(".loginBox").css("margin-top", login_box_pos + "px");
	$(".loginBox").fadeIn(1000);
}

//加载return top
function returnTop(){
	$("#addmyplan").hide();

	$(window).scroll(function(){
		var scrlTop = $(document).scrollTop();
		if(scrlTop > 120)
			$("#addmyplan").show();
		else
			$("#addmyplan").hide();
	});
	
	$("#addmyplan .toTop").bind({
		click:function(){
			$("#addmyplan").hide();
			$(document).scrollTop(0);
		}
	});
}

// 显示用户中心
function showUserCenter() {
	$("#user_center").show();
}

function showShadeHidden(){
	$("#shadeOver").show();
	$("#shadeLayout").show();
}
function hideShadeHidden(){
	$("#shadeOver").hide();
	$("#shadeLayout").hide();
}