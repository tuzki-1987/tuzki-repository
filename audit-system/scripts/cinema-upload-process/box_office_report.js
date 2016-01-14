/*
*
* @author ccq by 2015-11-10
*/

/**
 * 加载票房成绩单模块内容
 * */
function loadBoxOfficeReport(){
	var cinemaId = cinemaObj.id;
	var queryDate = "";
	var current = 0;
	$("#initSchDate").val(getCurDate());	// 初始化保存查询日期
	
	// 执行加载票房明细(未提交的时候, 加载明细)
	if(localStorage.detailSubmitFlag == 0) {
		// loadBoxOfficeDetail(current, 5, "reportTitle");
	}

	// 执行加载当日票房成绩单
	loadBoxOfficeTotals(cinemaId, queryDate);
}

/**
 * 上传票房 - 点击事件
 * 
 * @param
 * 		obj 点击对象
 * @return
 * */
function upScheDetail(obj){
	var cinemaId = cinemaObj.id;
	var upFileName = document.getElementById('viewfile').value;
	
	if(cinemaId == "") {
		tipMsg_Single("reportTitle", 0, "登录状态已失效，请重新登录", 0, '', '');
		// window.location.href = "login.html";
	}else{
		if(upFileName.trim() == "" || upFileName.trim().length < 1){
			tipMsg_Single(obj, 0, "请选择文件后上传", 0, '', '');
			return false;
		}else{
			if(upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xls" && 
				upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xlsx"){	// 03版".xls"、07/10/13版".xlsx"
				tipMsg_Single(obj, 0, "请上传Excel文件", 0, '', '');
				document.getElementById('viewfile').value = "";
				return false;
			}else{
				var loadImg = "<span class='fs13'>查看明细：</span><a href='javascript:;' id='loadImg' class='load_img'><img src='images/load.gif' width='20' height='20' /></a>";
				$("#detailIndex").empty().append(loadImg);
				
				var urlPath = "/schedule/apis/boxOffice/" + cinemaId + "/upload.html";
				$.ajaxFileUpload({
			        url: urlPath, //需要链接到服务器地址
			        secureuri: false,
			        fileElementId: 'uploadDetail', //文件选择框的id属性
			        type: 'iframe',
			        dataType: 'json', //服务器返回的格式（数据需要二次处理）
			        success : function(data, status){
			        	result = jQuery.parseJSON(data);
			        	
			        	if(result.ret){
			        		$("#loadImg").remove();
			        		tipMsg_Single(obj, 0, "上传成功", 0, '', '');
			        		
			        		var detailTitle = "";
			        		if(upFileName.indexOf("\\") != -1)
			        			detailTitle = upFileName.substring(upFileName.lastIndexOf("\\") + 1, upFileName.indexOf("."));
			        		else
			        			detailTitle = upFileName.substring(0, upFileName.indexOf("."));
			        		
			        		var detailTitleHTML = "<a id='show_detail_btn' href='javascript:;' title='" + detailTitle + "' data='" + result.showDate + "' onclick=\"showDetail(this.title, 1, '" + result.showDate + "');\">"+detailTitle+"</a>";
			        		$("#detailIndex").append(detailTitleHTML);
			        		$(".detailIndex a").fadeIn(1000);
			        		
			        		document.getElementById('viewfile').value = "";
			        		localStorage.detailSubmitFlag = 0;	// 上传后，是否提交的标示位(0:未提交, 1:已提交)
			        	}else{
			        		tipMsg_Single(obj, 0, "上传失败", 0, '', '');
			        		$("#loadImg").remove();
			        		document.getElementById('viewfile').value = "";
			        	}
			        },
			        error: function(data,status){
			        	// if(status == "error")
			        	// 	tipMsg_Single(obj, 0, "上传失败", 0, '', '');
			        	// else{
			        	// 	var ieB = navigator.appVersion;
			        	// }
			        }
			    });
			}
		}
	}
}
