/**
* 模块定义与引用
**/

define(function() {
	var loadHtml = "<center><img src='loading.gif' /></center>";
	
	return {
		loadImg: function(container) {
			$(container).html(loadHtml);
		}
	}
});