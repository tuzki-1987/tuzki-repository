/**
* @author ccq
*
* 打开容器，准备绘图
**/
var _canvas;
function startCanvas() {
	if (emptySchData == 0) {
		tipMsg_Single("dateLiCom", 0, "暂无排期", 0, '', '');
	}else{
		var _cinemaName = $("#userInfoCinema").attr("title");	// 影院名字
		var _schDate = $("#temptime").val();	// 排期日期

		_canvas = new createCanvas();	// 创建画布类对象
		_canvas.text_xPos = 20;	// 内容的X轴坐标

		// 计算画布高度
		var canvasHeight = _canvas.canvasHeight();
		// alert("here : "+canvasHeight);
		var cs = _canvas.canvasID;
		cs.height = canvasHeight + 60;	// 根据数据量，动态设置画布高度

		_canvas.drawCinemaName(_cinemaName, _canvas.canvasObj, _canvas.canvasID, canvasHeight + 60);	// 绘制影院名字

		_canvas.drawCanvasTitle(_schDate, _canvas.canvasObj, _canvas.canvasID);	// 绘制画布标题
		_canvas.canvasTitlePos = 56;	// 画布标题矩形的高度，Y轴的坐标
		
		_canvas.film_yPos = _canvas.posSpace_1 + _canvas.canvasTitlePos;	// 初始影片名Y轴坐标
		_canvas.hall_yPos = _canvas.film_yPos + 30;	// 初始影厅名Y轴坐标
		_canvas.hallT_yPos = _canvas.hall_yPos + 20;	// 初始场次时间Y轴坐标

		for (var i = 0; i < dataForCanvas.length; i++) {	// 循环绘制影片
			var canvas_filmName = dataForCanvas[i].filmName;	// 影片名
			var canvas_filmTime = dataForCanvas[i].length;		// 影片时长
			var canvas_film_title = canvas_filmName + "  " + "[" +canvas_filmTime + "分钟]";

			_canvas.drawCanvasFilmName(canvas_film_title, _canvas.canvasObj, _canvas.canvasID);	// 绘制影片名

			var hallDataArr = dataForCanvas[i].viewSchedule;	// 影厅数据集
			for (var j = 0; j < hallDataArr.length; j++) {	// 循环绘制影厅、场次时间
				var canvas_hallName = hallDataArr[j].hallName;
				_canvas.drawCanvasHallName(canvas_hallName, _canvas.canvasObj, _canvas.canvasID);	// 绘制影厅名
				_canvas.hall_yPos = _canvas.hallT_yPos + 30;	// 递增影厅名的Y轴坐标

				var viewTags = hallDataArr[j].viewTags;
				var canvas_hallTimeArrs = viewTags.split(",");
				_canvas.drawCanvasHallTime(canvas_hallTimeArrs, _canvas.canvasObj, _canvas.canvasID, _canvas.hall_time_num);	// 绘制场次时间
				_canvas.hallT_yPos += 50;	// 递增场次时间的Y轴坐标
			}

			// 按影片递增Y轴坐标
			_canvas.film_yPos = _canvas.hallT_yPos;	// 递增影片名的Y轴坐标
			_canvas.hall_yPos = _canvas.hallT_yPos + 30;	// 影厅名的Y轴坐标
			_canvas.hallT_yPos += 50;	// 递增场次时间的Y轴坐标
		}

		showCanvas(_schDate, canvasHeight);	// 显示容器
	}
}

// 显示容器, 并准备下载
function showCanvas(schDateValue, canvasHeight) {
	var dcmtH = $(window).height();
	var sclTop = $(document).scrollTop();
	
	$(".zhezhao2").css("height", dcmtH +"px");
	var zhezhaoIndex = $(".zhezhao2").css("zIndex");
	$(".image-container").css({"top": sclTop + 30 + "px", "z-index":zhezhaoIndex+1});
	$(".down-canvas-btn").css("z-index", zhezhaoIndex+1);

	$("#zhezhao2").show();
	$("#imageContainer").show();

	// 重置遮罩层高度(避免页面被弹出层内容撑高时，遮罩层高度不够)
	dcmtH = $(document).height();
	$(".zhezhao2").css("height", dcmtH +"px");

	var imageName = schDateValue.replace(/-/g, "") + "_排期.png";
	_canvas.downSchImage(imageName, sclTop + 110);	// 下载画布图片
}

// 关闭容器
function closeCanvas() {
	$("#imageContainer").hide();
	$("#zhezhao2").hide();
	var downBtn = document.getElementById("down_canvas_image");
	downBtn.download = "";	// 设置下载图片名字
	downBtn.href = "javascript:;";	// 设置下载图片内容

	var cs = _canvas.canvasID;
	cs.height = _canvas.hallT_yPos;	// 清空画布
}

/**
* 创建画布类
**/
function createCanvas() {
	var _canvasID = document.getElementById("canvasSch");	// canvas 容器对象
	this.canvasID = document.getElementById("canvasSch");	// canvas ID对象
	this.canvasObj = _canvasID.getContext("2d");			// canvas 对象
	this.canvasCenterPoint = (_canvasID.width)/2;

	this.canvasTitlePos = 0;	// 画布标题Y轴坐标
	this.text_xPos = 0;
	this.film_xPos = 0;	// 影片名X轴、y轴坐标
	this.film_yPos = 0;
	this.hall_xPos = 0;	// 影厅名X轴、y轴坐标
	this.hall_yPos = 0;
	this.hallT_xPos = 0;	// 影厅场次X轴、y轴坐标
	this.hallT_yPos = 0;
	this.hall_time_num = 7;	// 每行的场次时间的个数
	this.posSpace_1 = 40;	// 位置间距
	this.posSpace_2 = 30;
	this.posSpace_3 = 20;

	this.test = function() {};
}

/**
* 绘制影院名字
*
* @param cinemaName 影院名字
* @param ctx 		画布2D对象
* @param ctxID		画布ID
**/
createCanvas.prototype.drawCinemaName = function(cinemaName, ctx, ctxID, canvasHeight) {
	// 绘制矩形
	var rectGradient = ctx.createLinearGradient(0, 0, 0, 55);
	rectGradient.addColorStop(0, "#F7F7F7");
	rectGradient.addColorStop(1, "#eeeeee");
	ctx.fillStyle = rectGradient;
	ctx.fillRect(0,0, 760, 55);	// x0, y0, x1, y1 (x0,y0 - 起始点坐标; x1,y1 - 结束点坐标)

	// 绘制线条
	ctx.beginPath();
	ctx.moveTo(0, 56);
	ctx.lineTo(760, 56);
	ctx.strokeStyle = "green";
	ctx.stroke();

	// 绘制内容区矩形
	ctx.fillStyle = "#f7f7f7";
	ctx.fillRect(0, 56, 760, canvasHeight - 56);	// 起始点坐标: 0, 56; 结束点坐标: 760, canvasHeight - 56

	// 设置字体，对齐方式
	ctx.font = "12px Verdana";
	ctx.textAlign = "center";

	// 用渐变色填充
	ctx.fillStyle = "#1D7FC0";
	ctx.fillText(cinemaName, _canvas.canvasCenterPoint, 45);	// 190：画布的水平中心点(宽度一半)，38：垂直位置
};

/**
* 绘制画布标题
*
* @param schDate    排期日期
* @param ctx 		画布2D对象
* @param ctxID		画布ID
**/
createCanvas.prototype.drawCanvasTitle = function(schDate, ctx, ctxID) {
	// 设置字体，对齐方式
	ctx.font = "20px Verdana";
	ctx.textAlign = "center";

	// 创建渐变
	var gradient = ctx.createLinearGradient(0, 0, ctxID.width, 0);
	gradient.addColorStop("0.1","#1D7FC0");
	gradient.addColorStop("0.8","#FF8533");
	gradient.addColorStop("1.0", "orange");

	// 用渐变色填充
	// ctx.strokeStyle = gradient;	// 无填充渐变色
	ctx.fillStyle = gradient;
	ctx.fillText(schDate + " 排期", _canvas.canvasCenterPoint, 28);	// 190：画布的水平中心点(宽度一半)，38：垂直位置
	// ctx.strokeText(cinemaName + "    " + schDate + " 排期", 380, 38);	// 无填充渐变
};

/**
* 绘制影片名
*
* @param filmName 影片名字
* @param ctx 	画布2D对象
* @param ctxID	画布ID
**/
createCanvas.prototype.drawCanvasFilmName = function(filmName, ctx, ctxID) {
	ctx.font = "16px Microsoft YaHei, SimHei, SimSun";
	ctx.textAlign = "left";

	ctx.fillStyle = "#333";
	ctx.fillText(filmName, _canvas.text_xPos, _canvas.film_yPos);
};

/**
* 绘制影厅名
*
* @param hallName 影厅名字
* @param ctx 	画布2D对象
* @param ctxID	画布ID
**/
createCanvas.prototype.drawCanvasHallName = function(hallName, ctx, ctxID) {
	ctx.font = "14px Microsoft YaHei, SimHei, SimSun";
	ctx.textAlign = "left";

	ctx.fillStyle = "#999";
	ctx.fillText(hallName, _canvas.text_xPos, _canvas.hall_yPos);
};

/**
* 绘制影厅的场次时间
*
* @param hallTimeArrs 影厅场次时间(数组)
* @param cxt 		画布2D对象
* @param cxtID		画布ID
* @param timeNum	每行的时间个数
**/
createCanvas.prototype.drawCanvasHallTime = function(hallTimeArrs, ctx, cxtID, timeNum) {
	_canvas.hallT_xPos = _canvas.text_xPos;	// 初始水平坐标

	ctx.font = "15px Microsoft YaHei, SimHei, SimSun";
	ctx.textAlign = "left";
	ctx.fillStyle = "#0FA8CE";

	for (var i = 0; i < hallTimeArrs.length; i++) {
		if(i > 0 && (i % timeNum) == 0) {	// 控制每行的场次时间个数
			_canvas.hall_yPos += 20;	// 受新行影响，增加厅名的Y轴坐标
			_canvas.hallT_yPos += 21;	// 增加 新行的Y轴坐标
			_canvas.hallT_xPos = _canvas.text_xPos;	// 初始化新行的X轴坐标
		}

		var hall_time = hallTimeArrs[i].split("-");
		ctx.fillText(hall_time[0], _canvas.hallT_xPos, _canvas.hallT_yPos);
		_canvas.hallT_xPos += 50;
	}
};

/**
* 根据接口返回数据，计算画布的高度
**/
createCanvas.prototype.canvasHeight = function() {
	var posSpace = 40, canvasTitlePos = 56;
	var filmYpos = posSpace + canvasTitlePos;	// 初始影片名Y轴坐标
	var hallYpos = filmYpos + 30;	// 初始影厅名Y轴坐标
	var hallTyPos = hallYpos + 20;	// 初始场次时间Y轴坐标

	for (var i = 0; i < dataForCanvas.length; i++) {	// 循环影片
		
		var hallDataArr = dataForCanvas[i].viewSchedule;	// 影厅数据集
		for (var j = 0; j < hallDataArr.length; j++) {	// 循环影厅、场次时间
			if(j > 0 && (j % _canvas.hall_time_num) == 0) {	// 受场次时间行数影响，增加厅名、场次的Y轴坐标
				hallYpos += (_canvas.hall_time_num)*10;
				hallTyPos += (_canvas.hall_time_num)*10 + 100;
			}

			hallYpos = hallTyPos + 30;	// 递增影厅名的Y轴坐标
			hallTyPos += 50;	// 递增场次时间的Y轴坐标
		}

		// 按影片递增Y轴坐标
		filmYpos = hallTyPos;	// 递增影片名的Y轴坐标
		hallYpos = hallTyPos + 30;	// 影厅名的Y轴坐标
		hallTyPos += 50;	// 递增场次时间的Y轴坐标
	}

	return hallTyPos;
}

/**
* 执行下载
*
* @description html5 a标签的 download属性 实现（download: 下载文件名字, href: 下载文件内容）
*
* @param imageName 图片名字
**/
createCanvas.prototype.downSchImage = function(imageName, curSclTop) {
	var cs = _canvas.canvasID;
	var downObj = document.getElementById("down_canvas_image");
	$(downObj).attr("download", imageName);	// 设置下载图片名字
	downObj.href = cs.toDataURL();	// 设置下载图片内容

	// downObj.onclick = function(e) {	// 可以下载，但是不能指定名字
	// 	var w = cs.width;
	// 	var h = _canvas.canvasHeight();
	// 	alert("尺寸 ："+w+" - "+h);
	// 	var type = false;
	// 	// Canvas2Image.saveAsPNG(cs, type, w, h);
	// };
	if($.browser.mozilla){

	}
	
	$(window).scroll(function() {
		var downBtn_top = $(".down-canvas-btn").css("marginTop");
		var scrollTop = $(document).scrollTop();
		if(scrollTop == 0){
			$(".down-canvas-btn").css("margin-top", "10px");
		}else{
			$(".down-canvas-btn").css("margin-top", $(document).scrollTop() + "px");
		}
		
	});
}
