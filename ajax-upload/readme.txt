最近工作中有用到异步上传的部分，在网上找了ajaxupload.js做的，使用中遇到了几个问题，其中最纠结的一个是后台返回json串后，IE默认下载的问题。
现在把这几个问题及解决办法总结如下：

平台：win8
开发环境：Struts2、Spring、mybatis，Maven，Tomcat
上传组件：ajaxFileUpload.js
出现的问题：
1、运行时，报jQuery.handleError is not a function
2、无论上传成功失败，总是执行error方法，不执行success方法
3、IE 总是默认下载返回的json串

解决方法：
1、在ajaxFileUpload.js中添加handleError方法
handleError : function(s, xhr, status, e) {
	// If a local callback was specified, fire it
	if (s.error) {
		s.error.call(s.context || s, xhr, status, e);
	}

	// Fire the global callback
	if (s.global) {
		(s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [ xhr, s, e ]);
	}
}

2、在Firefox下跟踪发现，在执行到 var data = jQuery.uploadHttpData(xml, s.dataType); 这一句时，后续不再执行，直接转到了catch里。
uploadHttpData 方法是处理和返回由后台传回来的数据的，处理了3种格式：script、json、html，所以前台调用 ajaxFileUpload 时，需指明dataType；
并且处理json数据的方式也有问题，结合我的情况，把源码进行了修改。

3、后台返回的json串，IE 会默认将其作为文件下载。这里后台设置的 content-type 是 application/json，将其改为”text/plain“后，测试通过。

【重要】4、后台部分
response.setContentType("text/plain");