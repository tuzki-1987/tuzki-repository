
// error info
var smsErrProtype ={
	txt : function( errno, defaulttxt, reason, moduleType){
		var msg;
		if (moduleType) {
			var module = this[moduleType];
 			if( module ){
 				msg = module[moduleType];
 			}
		}
		msg = msg ? msg : this[errno];
		if( !msg ){
			msg = defaulttxt ? defaulttxt : errno;
		}
		msg = reason ? msg +" "+ reason : msg;
		
		return msg;
	},
	
	txtInMod : function( errno, defaulttxt, moduleType){
		return this.txt( errno, defaulttxt, "", moduleType);
	}
};
SmsErrZh = {
	"1000": "1000: 无效的请求，请联系管理员。",
	"1004": "1004: 请求失效，请重新登录。",
	"1007": "账号已存在，请选择其它账号。",
	
	"1010": "1010: 登录失败，密码错误。",
	"1016": "1016: 此用户无登录权限，请退出重新登录。",
	
	
};

mixin( SmsErrZh, smsErrProtype);

