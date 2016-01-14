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

$(function() {
	smsMain.config();
});

var loginMainHandler = {
	_colligateHandler:function(){
		$("#password").bind('keydown', function(e){
	        var key = e.which;
	        if (key != 13)
	        	return ;
	    	e.preventDefault();
	    });
	},
	_clearCookieSh:function(){
		removeCookie("jh_sdleSessionId");
		removeCookie("jh_cinemaId");
		removeCookie("jh_sdleLoginName");
		removeCookie("jh_sdleCinemaNickName");
		removeCookie("jh_sdleUserLevel");
		removeCookie("jh_sdleUserOwner");
		loginMainHandler._skipLogin();
	},
	_skipLogin:function(){
		window.location.href = smsMain._getLocalHost()+"audit-system/login.html";
	}
};

// 退出
function logout() {
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
        	tipMsg_Single("login_main", 0, "该账号不存在", 0, '', '');
        }else if(status == 1010){
        	tipMsg_Single("login_main", 0, "用户名或密码错误", 0, '', '');
        }else if(status == 1036){
        	tipMsg_Single("totalDataArea", 0, "暂无当日数据", 0, '', '');
        	showSchTotalEmptyResult();
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