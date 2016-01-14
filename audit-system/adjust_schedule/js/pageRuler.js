/**
* 所有基于时间的操作，都基于7点计算
**/

var crtLgnCinemaId = cinemaObj.id;
var film_color;	// 随机影片组颜色
var hallData;	// 影厅数据
var delObj;	// 影片对象(删除用)

/**
 * 排期时间轴标尺工具(起始点：7点)
 */
(function($){
	$.pageRuler = function(params){
		//参数
		params = params || {};
		//对象
		var x= $("#zxxScaleBox"), rh = $("#zxxScaleRulerH") ,fm = $(".film"),dotv = $("#zxxRefDotV");
		//容器的宽高
		var w;
		var f = {
			box: function(){
				w = $("#zxxScaleBox").width();
			},
			ui: function(){
				rh.html("");
				//创建标尺数值(初始值：7点)
				var h = 7;
				for(var i=0; i<w; i+=1){
					if(i % 60 === 0){
						h = 7 + i/60;
						if( h >= 24){
							h = h-24;
						}
						$('<span class="n">'+h+':00</span>').css("left", i+2).appendTo(rh);
					}
				}	
			},
			//初始化执行
			init: function(){
				f.box();
				f.ui();
			}
		};
		f.init();
	};
})(jQuery)


/**
 * [time_count 时间格式化](以起始点7点为临界点)
 * @param  {[type]} start [影片开始时间]
 * @param  {[type]} end   [影片结束时间]
 * @return {[type]}       [description]
 * 
 * @remark (2015/4/15) Modify_1 与 Modify_2 无代码内容修改, 只调换了位置。目的: 使弹出层的影片列表中, 过00:00(包括)的影片宽度设置正确。
 */
function time_count(start,end){
	var time_json = {};
	if(!start){
		return time_json;
	}
	var startArr = start.split(":");
	//计算影片便宜量
	if( startArr[0]<7 ){
		if(startArr[0] == 0) {
			// 凌晨12(00)时,startArr[0]+1:表示1小时
			time_json.film_left = (parseInt(startArr[0]+1)+16)*60+parseInt(startArr[1]);
		}else {
			time_json.film_left = (parseInt(startArr[0])+16)*60+parseInt(startArr[1])+60;
		}
	}else{
		time_json.film_left = (startArr[0]-7)*60+parseInt(startArr[1]);
	}

	//计算分钟数
	time_json.start_min = startArr[0]*60+parseInt(startArr[1]);

	if( end ){
		var endArr = end.split(":");
		if( endArr[0]<7 ){
			endArr[0] = parseInt(endArr[0]);
		}
		time_json.end_min = endArr[0]*60+parseInt(endArr[1]);
		
		//计算film长度  - Modify_1(20150415)
		time_json.film_size = time_json.end_min-time_json.start_min;

		//计算分钟数    - Modify_2(20150415)
		if(startArr[0] > 7 && endArr[0] < 7){
			time_json.film_size = time_json.end_min+24*60-time_json.start_min;
		}
	}

	return time_json;
}

/**
 * [moveOption 影片移动](以起始点7点为基点，进行计算)
 * @type {Object}
 */
var moveOption = {
	draggObject:"",  //film拖拽的当前元素对象
	draggFilm:"", //右侧影片拖拽的元素
	dropIndex:-1, //film拖拽放入的li的索引值
	draggFlag:false,
	onFilmDrop:false, //判断拖拽的元素是否在.film上
	isOverlapping:false,  //判断新添加的元素 是否重叠
	testH:0,
	//排期拖拽事件
	_moveFilm:function(){
		$('.film').draggable({
				containment:".yinpianList",
				grid:[5,47],
				// dragPrevention:['div'],
				revert:false,
				start:function(e,ui){
					// console.log(e);
					moveOption.draggObject = this;//把当前拖拽元素赋值给变量
					$(this).draggable({revert:false});
					moveOption._liDrop();
					//触碰时触发
					$('.film').droppable({
						tolerance:"touch",
						drop:function(e,ui){
							// console.log(123);
							$(moveOption.draggObject).draggable({revert:true});
						},
					});
				},
				drag:function(e,ui){
					var leftWidth = ($(this).css("width")).replace(/px/g, "");
					$("#zxxRefDotV").css('left',ui.position.left-1);	// 左标线
					$("#zxxRefDotV2").css('left',ui.position.left+leftWidth*1-1);	// 右标线

					//计算时间
					var h = Math.floor(ui.position.left/60);
					var m = ui.position.left%60;
					h += 7;	// 基于7点计算
					if( h >= 24 ){
						h -= 24;
					}
					h = "0000000000"+h;
					m = "0000000000"+m;
					// 改为ie8兼容方式
					h = h.substr(h.length-2, 2);
					m = m.substr(m.length-2, 2);

					var count = $(this).find(".time").attr('data');
					
					var eh = Math.floor((ui.position.left+parseInt(count))/60);
					var em = (ui.position.left+parseInt(count))%60;
					eh += 7;
					if( eh >= 24 ){
						eh -= 24;
					}
					eh = "0000000000"+eh;
					em = "0000000000"+em;
					eh = eh.substr(eh.length-2, 2);
					em = em.substr(em.length-2, 2);

					$(this).find(".time").html(h+":"+m+" - "+eh+":"+em);
				},
				stop:function(e,ui){
					if( moveOption.dropIndex != -1 ){
						$("#showTime_film li").eq(moveOption.dropIndex).append(this);
					}
					$("#zxxRefDotV").css('left',-10);
					$("#zxxRefDotV2").css('left',-10);
				},
				leave:function(e,ui){
					alert(123);
				}
			});
	},
	//影片drop事件
	_filmDrop:function(){
		//鼠标指针碰触时触发
		$('.film').droppable({
			tolerance:"pointer",
			over:function(e,ui){
				moveOption.isOverlapping = false;
				moveOption.onFilmDrop = true;
				if(moveOption.draggFlag){
					// 当前厅的影片数量
					var filmSize = $(this).parent("li").find(".film").length;
					// 获取li的position 的最小值
					var minLeft = 0;
					//获取li的position 的最大值
					var maxLeft = $(this).css('left');
					// 2015-07-27 修改后的获取方式
					// var positonLeft = parseInt(maxLeft);

					$.each($(this).parent("li").find(".film"), function(index, val) {
						if($(this).index() == 0) {
							minLeft = parseInt($(val).css('left'));
						}else {
							// 获取厅中的最小left
							if(parseInt($(val).css('left')) < minLeft) {
								minLeft = parseInt($(val).css('left'));
							}
						}
					});

					// 2015-07-27 未排满的厅，往里拖放(右侧)影片时的位置判断
					if(moveOption.testH < minLeft && $(this).index() < Math.floor(filmSize/2)) {
						// 所拖放影片的时长，小于当前厅的最小左边距(可放置影片)，并且所经过影片索引，小于总列表数的一半，
						// 则放置到第一部影片左侧，左边距为10
						positonLeft = minLeft - moveOption.testH - 10;
					}else {
						// 接着最后一部影片放置
						positonLeft = parseInt(maxLeft)+parseInt($(this).find("P.time").attr("data"))+parseInt($("select[name='step']").val());
					}
					
					// 原来的坐标位置获取方式
					// var positonLeft = parseInt(maxLeft)+parseInt($(this).find("P.time").attr("data"))+parseInt($("select[name='step']").val());
					
					if(positonLeft%5!=0){
						positonLeft = (Math.floor(positonLeft/5)+1)*5;
					}
					var wd = parseInt($(ui.draggable.context).attr("data"));
					$(".addDiv").remove();
					$(this).after('<div class="addDiv bg3 label" style="left:'+positonLeft+'px;">'+$(ui.draggable.context).text()+'</div>');

					var filmLeft = positonLeft;
					var filmRight = positonLeft+wd;
					$.each($(this).closest("li").find(".film"), function(index, val) {
						 var left = parseInt($(val).css("left"));
						 var right = parseInt($(val).css("left"))+parseInt($(val).css("width"));
						 if((filmLeft<=left&&filmRight>=left) || (filmLeft<=right&&filmRight>=right)){
						 	moveOption.isOverlapping = true;
						 	console.log(moveOption.isOverlapping);
						 }

					});
				}
			},
			out:function(e,ui){
				if(moveOption.draggFlag){
					moveOption.onFilmDrop = false;
					moveOption.isOverlapping = false;
					$(this).closest('li').find(".addDiv").remove();
				}			
			}
		})
	},
	//影厅drop事件
	_liDrop:function(){
		$("#showTime_film li").droppable({
			drop:function(e,ui){
				moveOption.dropIndex = $(this).index();
				// if(moveOption.draggFlag){
				// 	var filmLeft = ui.position.left;
				// 	console.log(filmLeft);
				// 	var filmRight = parseInt(ui.position.left)+parseInt($(ui.draggable.context).attr("data"));
				// 	$.each($(this).find(".film"), function(index, val) {
				// 		 var left = parseInt($(val).css("left"));
				// 		 var right = parseInt($(val).css("left"))+parseInt($(val).css("width"));
				// 		 if((filmLeft<left&&filmRight>left) ||(filmLeft<right&&filmRight>right) || filmRight>=1100){
				// 		 	$(moveOption.draggFilm).draggable({revert:true});
				// 		 }

				// 	});
				// }
			},
			over:function(e,ui){
				if(moveOption.draggFlag&&!moveOption.onFilmDrop){
					//获取li的position 的最大值
					var maxLeft = 0;
					var positonLeft = 0;
					var minLeft = 0;	// 获取li的position 的最小值
					
					if(($(this).find(".film")).length > 0) {	// 非空厅的时候
						$.each($(this).find(".film"), function(index, val) {
							if($(this).index() == 0) {
								minLeft = parseInt($(val).css("left"));
							}

							var left = parseInt($(val).css("left"));
							if(left*1 == 0) {	// 只有一部影片的时候
								// 初始化坐标(2015-07-27)
								positonLeft = maxLeft+parseInt($(val).find("P.time").attr("data"))+parseInt($("select[name='step']").val());
							}else {
								// 获取厅中的最小left
								if(left < minLeft) {
									minLeft = left;
								}
							}

							if( left>maxLeft ){
								maxLeft = parseInt($(val).css("left"));
								//获取时长
								positonLeft = maxLeft+parseInt($(val).find("P.time").attr("data"))+parseInt($("select[name='step']").val());
							}

							// 类同于影片drop
							if(moveOption.testH < minLeft) {
								positonLeft = minLeft - moveOption.testH - 10;
							}else {
								positonLeft = maxLeft+parseInt($(val).find("P.time").attr("data"))+parseInt($("select[name='step']").val());
							}
						});
					}
					
					if(positonLeft%5!=0){
						positonLeft = (Math.floor(positonLeft/5)+1)*5;
					}
					$(this).append('<div class="addDiv bg3 label" style="left:'+positonLeft+'px">'+$(ui.draggable.context).text()+'</div>');
				}
			},
			out:function(e,ui){
				if(moveOption.draggFlag&&!moveOption.onFilmDrop){
					$(this).find(".addDiv").remove();
				}
			}
		})
	},
	//设置步长
	_setGrid:function(val){
		$('.film').draggable({grid:[val,47]});
	},
	//设置影片拖动(基于7点计算), 右侧影片; 新拖入的影片, 语言默认为1
	_moveCpl:function(){
		$('.cpl').draggable({
			helper:function(event){
            	return $("<span>&nbsp<span>");
            },
			containment:".mainTable",
			start:function(e,ui){
				moveOption.draggFilm = this;//把当前拖拽元素赋值给变量
				moveOption.draggFlag = true;
				moveOption.testH = parseInt($(this).attr("data"));
				moveOption._liDrop();
				moveOption._filmDrop();
				console.log(ui);
			},
			stop:function(e,ui){
				var start = parseInt($(".addDiv").css("left"));
				var countTime = parseInt($(this).attr("data"));
				var end = start+countTime;
				var sh = Math.floor(start/60);
				var eh = Math.floor(end/60);
				sh += 7;	// 基于7点计算
				eh += 7;
				if( sh >= 24 ){
					sh -= 24;
				}
				if( eh >= 24 ){
					eh -= 24;
				}
				("0000000000"+start%60).substr(-2);
				//格式化时间
				var format_start = ("0000000000"+sh).substr(-2)+":"+("0000000000"+start%60).substr(-2);
				var format_end = ("0000000000"+eh).substr(-2)+":"+("0000000000"+end%60).substr(-2);

				var filmName = $(this).attr('title');
				var filmType = $(this).attr("default");
				filmType = filmType == 0 || filmType == undefined ? "" : film_type_arr[filmType];
				var filmHtml = "", film_color_html = "";
				// var film_color_js = this.style.backgroundColor;	// js 取影片背景色，为了区分 已选影片/全部影片
				var filmNums = $(".film").length;	// 当前列表中，影片块总数
				// 当前影片块中的最大索引值
				var maxIdIndex = filmNums;
				
				for(var j = 0; j < film_color.length; j++){	// 确保影片原背景色
					if(filmName == film_color[j].obj){
						film_color_html = " background-color:" + film_color[j].color + ";";
						break;
					}else{
						film_color_html = "";
					}
				}

			    filmHtml += "<div id='filmBlock_" + (maxIdIndex+1) + "' class='film bg3 label label-primary' data='"+$(this).attr("id")+"' style='left:"+start+"px; width:"+countTime+"px;" + film_color_html + "'>";
			    filmHtml += "<div id='editBtn_" + (maxIdIndex+1) + "' class='edit-div' style='width:" + countTime + "px; left:0px;' onclick='openEditFilmLayer(this);'>编&nbsp;&nbsp;辑</div>";
			    // strVar += "	<div class=\"left\">";
			    // strVar += "	<\/div>";
			    // strVar += "	<div class=\"right\">";
			    // strVar += "		<div class=\"rightL\">";
			    // strVar += "		<\/div>";
			    filmHtml += "<div class='rightR' lang='1' title='"+filmName+"' style='width:100%;'>";
			    filmHtml += "<p class='time' data='"+countTime+"'>";
			    filmHtml += format_start+" - "+format_end;
			    filmHtml += "</p>";
			    filmHtml += "<p style='overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'>";
			    filmHtml += filmName;
			    filmHtml += "</p>";
			    filmHtml += "</div>";
			    filmHtml += "<div class='film-type-block btn-bg-color-1 btn-bc-5 btn-common btn-radius-all'>" + filmType + "</div>";
			    // strVar += "	<\/div>";
			    filmHtml += "</div>";

			    if((countTime+start)>=1180){
					tipMsg_Single("dateTitle", 0, "影厅排期已满！", 0, '', '');
				}else if(moveOption.isOverlapping){
					tipMsg_Single("dateTitle", 0, "排期时间重叠！", 0, '', '');
				}else{
					if(!isNaN(start))
						$("#showTime_film li").eq(moveOption.dropIndex).append(filmHtml);
				}
				
				$(".addDiv").remove();
				moveOption.draggFlag = false;
				moveOption.onFilmDrop = false;

				//绑定拖动时间
				moveOption._moveFilm();
				moveOption._filmDrop();
				moveOption._bindDBLClick();
				moveOption._bindClick();
			}
		});
	},
	//排期绑定点击事件
	_bindDBLClick:function(){
		//解除已经绑定事件
		$(".film").unbind("dblclick");
		$(".film").bind("dblclick",function(){
			delObj = $(this);
			var zIndexV = $("div[id^='xubox_layer']").css("z-index");
			tipMsg_UserDelOper("您确定要删除该排期？", zIndexV);
		});
	},
	//绑定单击事件/鼠标经过事件
	_bindClick:function(){
		$(".edit-div").hide();	// 隐藏所有编辑按钮

		// 鼠标进入影片
		$(".film").mouseenter(function() {
			$(this).find("div.edit-div").stop(true).delay(300).fadeIn();
		});
		// 鼠标离开影片
		$(".film").mouseleave(function() {
			$(this).find("div.edit-div").stop(true).delay(1000).fadeOut();
		});

		// 影片点击
		$(".film").unbind("click");
		$(".film").bind("click",function(){
			var _this = this;
			var flag = $(_this).hasClass('label-primary');
			var self_color, active_color = "#f9863a";	// 影片原来颜色、激活颜色

			//获取当前影片的id, 名字
			var film_id = $(this).attr("data"), film_name;
			
			$(".film").each(function(index, el) {
				if($(el).attr("data") == film_id){
					film_name = ($(el).find("p:eq(1)").text()).trim();

					for(var j = 0; j < film_color.length; j++){	// 确保影片原背景色
						if(film_name == film_color[j].obj){
							self_color = film_color[j].color;
							break;
						}else{
							self_color = "#f6dab2";
						}
					}
					if(flag){
						$(el).removeClass('label-primary');
						$(el).addClass('label-success');

						$(el).css({"background-color":active_color, "color":"#07637d"});
					}else{
						$(el).removeClass('label-success');
						$(el).addClass('label-primary');

						$(el).css({"background-color":self_color, "color":"#fff"});
					}
				}else{
					if($(el).hasClass('label-success')){
						film_name = ($(el).find("p:eq(1)").text()).trim();

						for(var j = 0; j < film_color.length; j++){	// 确保影片原背景色
							if(film_name == film_color[j].obj){
								self_color = film_color[j].color;
								break;
							}else{
								self_color = "#f6dab2";
							}
						}

						$(el).removeClass('label-success');
						$(el).addClass('label-primary');
						
						$(el).css({"background-color":self_color, "color":"#fff"});
					}
				}		
			});
		});

		//步长设置
		$("select[name='step']").on("change",function(){
			if(getCookie("cinemaId") != null && getCookie("cinemaId") != "" && getCookie("cinemaId").length > 0){
				moveOption._setGrid($(this).val());
				tipMsg_Single("moveSize", 0, "设置成功！", 0, '', '');
			}else{
				
			}
		});

		//影片切换
		$(".film_type li").unbind("click");
		$(".film_type li").bind("click",function(){
			var idx = $(this).index();
			moveOption._showFilm(idx, film_color);
		});

		// //checkBox 绑定事件
		// $('input[type="checkbox"][name="hall_id"]').bind("change",function(){
		// 	if($(this).prop('checked')){
		// 		var checkBox = $('input[type="checkbox"][name="hall_id"]:checked');
		// 		if($(checkBox).size()>2){
		// 			tipMsg_Single("moveSize", 0, "最多只能选择2个！", 0, '', '');
		// 			$(this).prop('checked', false);
		// 		}
		// 	}
		// });
	},
	//导出排期数据到excel
	_exportData:function(){
		if(typeof json_showtime.data == "undefined"){
			tipMsg_Single("dateTitle", 0, "初始模版不存在，获取不到数据信息", 0, '', '');
		}
		$.each(json_showtime.data, function(index, val) {
			var show_data = new Array();
			$.each($("#showTime_film li").eq(index).find("div.film"), function(i, v) {
				 var startArr = $(v).find(".time").text().split(" - ");
				 var data = {
				 	"id": $(v).attr("id"),
				 	"filmName": $(v).find(".rightR").attr("title"),
				 	"showBeginTime": startArr[0].trim(),
				 	"showEndTime": startArr[1].trim(),
				 	"intervalTime": 15
				 };
				 show_data.push(data);
			});
			json_showtime.data[index].viewSchedule=show_data;
		});
		var msg =JSON.stringify(json_showtime);
		// console.log(json_showtime);
		moveOption._writeFile(msg,"text/latex","showTime.json");
	},
	//文件写入操作
	_writeFile:function(data,type,name){
		//数据写入文件
		var blob; 
	    if (typeof window.Blob == "function") {  
	        blob = new Blob([data], {type: type});  
	    } else {  
	        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;  
	        var bb = new BlobBuilder();  
	        bb.append(data);  
	        blob = bb.getBlob(type);  
	    }
	    var URL = window.URL || window.webkitURL;  
        var bloburl = URL.createObjectURL(blob);  
        var anchor = document.createElement("a");  
        if ('download' in anchor) {  
            anchor.style.visibility = "hidden";  
            anchor.href = bloburl;  
            anchor.download = name;  
            document.body.appendChild(anchor);  
            var evt = document.createEvent("MouseEvents");  
            evt.initEvent("click", true, true);  
            anchor.dispatchEvent(evt);  
            document.body.removeChild(anchor);  
        } else if (navigator.msSaveBlob) {  
            navigator.msSaveBlob(blob, name);  
        } else {  
            location.href = bloburl;  
        }
	},
	// 右侧影片列表
	_showFilm:function(idx, film_color){
		$("#film_list #film_model").html("");
		$("#film_list").find("ul").find("li").find("a").removeClass("current");
		$("#film_list").find("ul").find("li:eq(" + idx + ")").find("a").addClass("current");

		if(idx == 0){
			var result = sltedFilmList();	// 返回影片准备数据
			var slted_film_type = "";	// 已选影片列表的影片类型

			for (var i = 0; i < result.length; i++) {
				for(var f = 0; f < global_all_film_type.length; f++) {
					if(global_all_film_type[f][0] == result[i].id) {
						slted_film_type = " default='" + global_all_film_type[f][1] + "'";
						break;
					}
				}
				for(var j = 0; j < film_color.length; j++){	// 确保颜色不会因为其他点击行为而改变
					if(result[i].name == film_color[j].film){
						result[i].color = film_color[j].color;
						break;
					}
				}
				$("#film_list #film_model").append('<p class="bg-info cpl" id="' + result[i].id + '"' + slted_film_type + ' data="' + result[i].time + '" title="' + result[i].name + '"  style="background-color:' + result[i].color + ';">(' + result[i].time+ '分钟)' + result[i].name + '</p>');
			}
			
			var hg = $(".mainTable").height(); + 
			$("#film_list").css({
				height:hg,
				marginTop: -hg,
			});
			moveOption._moveCpl();
		}
		else if(idx == 1){
			server.getFilmListByTime(function(callback){
				if(typeof callback.data != "undefined"){
					// 影片编码, 接口返回数据数组, 默认影片类型(0:无默认, 1:默认)
					var film_code = "", code_type = [], default_type = 0;

					$.each(callback.data, function(index, val) {
						// 影片编码和影片类型
						if(val.codeType != "undefined" && val.codeType != undefined){
							code_type = val.codeType;
							if(code_type.length == 1){	// 只有一种编码和类型
								// film_type = code_type[0].type;
								// film_code = code_type[0].code;
								// default_type = code_type[0].defaultKey;
								default_type = code_type[0].type;
								film_code = code_type[0].type + "-" + code_type[0].code;
							}else{
								film_code = "";
								for(var i = 0; i < code_type.length; i++) {
									if(code_type[i].defaultKey == 1){
										default_type = code_type[i].type;	// 影片的默认类型值
									}
									film_code += code_type[i].type + "-" + code_type[i].code + ",";
								}

								film_code = film_code.substring(0, film_code.length - 1);
							}
						}else{
							film_code = "";
							default_type = 0;
						}

						$("#film_list #film_model").append('<p class="bg-info cpl" id="'+val.id+'" data="'+val.filmRunningTime
							+'" title="'+val.filmName+'" code="' + film_code + '" default="' + default_type + '">('+val.filmRunningTime+'分钟)'+val.filmName+'</p>');
					});
				}
				moveOption._moveCpl();
			});	
		}
	},
	//对换排期
	_exchangeSchedule:function(){
		var checkBox = $('input[type="checkbox"][name="hall_id"]:checked');
		if($(checkBox).size() < 2){
			tipMsg_Single("moveSize", 0, "请选择要交换的排期所属的厅！", 0, '', '');
			return false;
		}
		if($(checkBox).size() > 2){
			tipMsg_Single("moveSize", 0, "最多只能选择2个！", 0, '', '');
			return false;
		}
		var hall_a = $("#showTime_film li").eq($($(checkBox)[0]).val());
		var data_a = $(hall_a).html();
		$(hall_a).find(".film").removeAttr('top');
		var hall_b = $("#showTime_film li").eq($($(checkBox)[1]).val());
		var data_b = $(hall_b).html();

		$(hall_a).html(data_b);
		$(hall_b).html(data_a);
		$.each($("#showTime_film li").eq($($(checkBox)[0]).val()).find(".film"), function(index, val) {
			$(val).css("top","");
		});
		$.each($("#showTime_film li").eq($($(checkBox)[1]).val()).find(".film"), function(index, val) {
			$(val).css("top","");
		});

		//绑定拖动时间
		moveOption._moveFilm();
		moveOption._filmDrop();
		moveOption._bindDBLClick();
		moveOption._bindClick();
	},
	//统计排期影片
	_filmCount:function(){
		$(".count_title").nextAll().remove();//清除上一次数据
		var count = $(".film").size();//计算总影片数
		var sortArr = [];	// 存放欲排序数组

		var data_json = {};
		var filmIdArr = new Array(); 
		$.each($(".film"), function(index, val) {
			var num = 0;
			if(data_json[$(val).attr("data")]){
				num = data_json[$(val).attr("data")].count+1;
			}else{
				num = 1;
			}
			data_json[$(val).attr("data")] = {
				"id":$(val).attr("data"),
				"name":$(val).find("p.time").next().text(),
				"count":num,
			}
		});
		var trHtml = "";
		var trIndex = 0;
		$.each(data_json, function(index, val) {
			trHtml += "<tr id='lineTr_" + trIndex + "'>";
			trHtml += '<td>'+val.name+'</td><td>'+val.count+'</td><td>'+(Math.round(val.count/count * 10000)/100).toFixed(2)+'%</td>';
			trHtml += "</tr>";
			trIndex++;
		});
		//总计
		trHtml += "<tr class='warning'>";
		trHtml += "<td>总计</td><td>"+count+"</td><td>100%</td>";
		trHtml += "</tr>";
		$(".count_title").after(trHtml);

		// 排序（组织排序数据）
		var tblTR = $("#tblFilmTotal").find("tr");
		for (var i = 1; i < tblTR.length - 1; i++) {
			var temp = "";
			var trId = "";	// 当前行ID
			var trFilmNum = "";	// 当前行的影片场次

			trId = $(tblTR[i]).attr("id");
			trFilmNum = $(tblTR[i]).find("td:eq(1)").text();
			temp = trId + "-" + trFilmNum;
			sortArr[i-1] = temp;
		}
		resortTR(sortByArray(sortArr), ".count_title");	// 重排行

		//总计
		//$("#statistical_body").append('<label>总计</label>：<span class="text-muted">'+count+'</span> &nbsp;&nbsp;<label>占比</label>：<span class="text-muted">100%</span>');

		$('#myModal').modal();
	},
	// 统计黄金场次(2015-05-05)
	_goldCount:function(){
		$(".remove_only").remove();//清除上一次数据
		$("#goldTotal").nextAll().remove();
		var count = $(".film").size();//计算总影片数
		var sortArr = [];	// 存放欲排序数组
		var sortArrIndex = 0;	// 数组下标
		var liObj = $("#showTime_film").find("li");	// 厅容器对象

		var num = 0;	// 总场次
		var normalNum = 0;	// 普通场次
		var aftnNum = 0;	// 下午黄金场
		var nigNum = 0;		// 晚上黄金场
		var filmGoldNum = 0;	// 某影片的黄金场总计
		var goldNum = 0;	// 黄金场总计

		var commn_json = {};	// 分别统计 下午/晚上黄金场 的全部场次
		$.each($(".film"), function(index, val) {
			var filmTime = $(val).find("p.time").text();
			filmTime = filmTime.replace(/ /g, "");
			var ftArr = filmTime.split("-");
			if(ftArr[0] >= "13:00" && ftArr[0] < "17:00")aftnNum += 1;
			if(ftArr[0] >= "19:00" && ftArr[0] < "22:00")nigNum += 1;
			if(ftArr[0] < "13:00" || (ftArr[0] >= "17:00" && ftArr[0] < "19:00") || ftArr[0] >= "22:00")normalNum += 1;

			commn_json.normalNum = normalNum;
			commn_json.aftnNum = aftnNum;
			commn_json.nigNum = nigNum;
		});

		var data_json = {};	// 统计每部影片的黄金场次总计/普通场次总计
		for (var i = 0; i < liObj.length; i++) {
			var curAftnNum = 0, curNigNum = 0;	// 下午/晚上黄金场
			var curNormalNum = 0;	// 下午/晚上普通场

			var filmObj = $(liObj[i]).find(".film");
			for (var j = 0; j < filmObj.length; j++) {
				var filmTime = $(filmObj[j]).find("p.time").text();
				filmTime = filmTime.replace(/ /g, "");
				var ftArr = filmTime.split("-");
				// 下午黄金场
				if(ftArr[0] >= "13:00" && ftArr[0] < "17:00"){
					if(data_json[$(filmObj[j]).attr("data")])
						curAftnNum = data_json[$(filmObj[j]).attr("data")].curAftnNum + 1;
					else
						curAftnNum = 1;
				}else{
					if(data_json[$(filmObj[j]).attr("data")])
						curAftnNum = data_json[$(filmObj[j]).attr("data")].curAftnNum;
					else
						curAftnNum = 0;
				}

				// 晚上黄金场
				if(ftArr[0] >= "19:00" && ftArr[0] < "22:00"){
					if(data_json[$(filmObj[j]).attr("data")])
						curNigNum = data_json[$(filmObj[j]).attr("data")].curNigNum + 1;
					else
						curNigNum = 1;
				}else{
					if(data_json[$(filmObj[j]).attr("data")])
						curNigNum = data_json[$(filmObj[j]).attr("data")].curNigNum;
					else
						curNigNum = 0;
				}

				// 普通场
				if(ftArr[0] <= "12:59" || (ftArr[0] > "17:00" && ftArr[0] < "19:00") || ftArr[0] >= "21:59") {
					if(data_json[$(filmObj[j]).attr("data")]) {
						curNormalNum = data_json[$(filmObj[j]).attr("data")].filmNormalNum + 1;
					}else {
						curNormalNum = 1;
					}
				}else {
					// 避免非本影片的数据累计
					if(data_json[$(filmObj[j]).attr("data")]) {
						curNormalNum = data_json[$(filmObj[j]).attr("data")].filmNormalNum;
					}else {
						curNormalNum = 0;
					}
				}

				data_json[$(filmObj[j]).attr("data")] = {
					"id":$(filmObj[j]).attr("data"),
					"name":$(filmObj[j]).find("p.time").next().text(),
					"curAftnNum":curAftnNum,
					"curNigNum":curNigNum,
					"filmGoldNum":curAftnNum + curNigNum,
					"filmNormalNum":curNormalNum
				}
			}
		}

		// 总计数据
		var trHtml = "<tr class='remove_only'><td>"+cinemaObj.name+"</td><td>"+commn_json.normalNum+"</td><td>"
					+commn_json.aftnNum+"</td><td>"+commn_json.nigNum+"</td><td>"+count+"</td></tr>";
		$(".gold_title").after(trHtml);

		var rowspanNum = 0;	// 合并行数
		$.each(data_json, function(index, val) {
			rowspanNum++;
			goldNum += val.filmGoldNum;	// 计算黄金场次总计
		});
		commn_json.goldNum = goldNum;	// 保存黄金场次总计

		// 每部影片的统计数据
		var goldTrHtml = "";
		var goldIndex = 0;	// 行ID的下标
		$.each(data_json, function(index, val) {
			goldTrHtml += "<tr id='goldTr_" + goldIndex + "'>";
			goldTrHtml += "<td colspan='2'>"+val.name+"</td><td>"+val.filmGoldNum+"</td><td>" + val.filmNormalNum + "</td><td>" + (val.filmGoldNum + val.filmNormalNum) + "</td>";
			goldTrHtml += "</tr>";

			goldIndex++;
		});

		$("#goldTotal").after(goldTrHtml);

		// 排序（组织排序数据）
		var tblTR = $("#tblGoldTotal").find("tr");
		for (var i = 3; i < tblTR.length; i++) {
			var temp = "";
			var trId = "";	// 当前行ID
			var trFilmNum = "";	// 当前行的影片场次

			trId = $(tblTR[i]).attr("id");
			trFilmNum = $(tblTR[i]).find("td:eq(1)").text();
			temp = trId + "-" + trFilmNum;
			sortArr[sortArrIndex] = temp;
			sortArrIndex++;
		}
		resortTR(sortByArray(sortArr), "#goldTotal");

		// 总计HTML
		var goldTotalTrHtml = "<tr id='goldTr_" + goldIndex + "' style='background-color: #f7f7f7;'><td colspan='2' style='font-weight:600;'>总计</td><td>"
							 + commn_json.goldNum + "</td><td>" + commn_json.normalNum + "</td><td>&nbsp;</td></tr>";
		$("#tblGoldTotal").append(goldTotalTrHtml);

		$('#goldTotalModal').modal();
	},
	//清扫时间
	_clearTime:function(){
		$(".clear_title").nextAll().remove();//清除上一次数据
		var clear_json = new Array();
		$.each($(".film"), function(index, val) {
			var format_time =$(val).find("p.time").text();
			var timeArr = format_time.split(" - ");
			var mtime = parseInt($(val).css("left"))+parseInt($(val).css('width'));
			var json = {
				time:timeArr[1],
				hallName:json_showtime.data[$($(val).closest('li')).index()].hallName,
				mtime:mtime,
			}
			clear_json.push(json);
		});
		//数组升序排序
		clear_json.sort(function(a,b){return a.mtime-b.mtime;});
		var trHtml = "";
		$.each(clear_json, function(index, val) {
			 trHtml += '<tr>';
			 trHtml += '<td>'+val.time+'</td>';
			 trHtml += '<td>'+val.hallName+'</td>';
			 trHtml += '<td></td>';
			 trHtml += '</tr>';
		});
		$(".clear_title").after(trHtml);
		$('#clearModal').modal();
	},
	// 保存排期
	_saveSchedule:function(){
		if(getCookie("cinemaId") != null && getCookie("cinemaId") != "" && getCookie("cinemaId").length > 0){
			var langId = "", filmCode = "";	// 每部影片的语言ID, 影片编号

			$.each(json_showtime.data, function(index, val) {
				var show_data = new Array();
				$.each($("#showTime_film li").eq(index).find("div.film"), function(i, v) {
					 var startArr = $(v).find(".time").text().split(" - ");
					 langId = $(v).find(".rightR").attr("lang");
					 filmCode = $(v).find(".rightR").attr("code");

					 // 添加语言、影片编号默认值
					 var data = {
					 	"id": $(v).attr("data"),
					 	"filmName": $(v).find(".rightR").attr("title"),
					 	"showBeginTime": startArr[0].trim(),
					 	"showEndTime": startArr[1].trim(),
					 	"intervalTime": 15,
					 	"langId": langId*1,
					 	"filmCode": filmCode
					 };
					 show_data.push(data);
				});
				json_showtime.data[index].viewSchedule=show_data;
			});
			
			var saveData =JSON.stringify(json_showtime);
			server.saveSchedule(crtLgnCinemaId, scheduledate, saveData, function(cbkData){
				if(cbkData.ret){
					tipMsg_Single("moveSize", 0, "保存成功!", 0, '', '');
				}else{
					tipMsg_Single("moveSize", 0, "保存失败，请联系管理员!", 0, '', '');
				}
			});
		}else{
			//tipMsg_Single("moveSize", 0, "登录状态已失效，请重新登录", 0, '', '');
			initLoginDialog();	// 初始化登录框(2015-05-08)
		}
	},
	// 另存为
	_saveAsSchedule:function(slt_date){
		if(getCookie("cinemaId") != null && getCookie("cinemaId") != "" && getCookie("cinemaId").length > 0){
			if(slt_date == "")
				tipMsg_Single("dateTitle", 0, "请选择存储日期", 0, '', '');
			else{
				var langId = "", filmCode = "";	// 每部影片的语言ID, 影片编号

				$.each(json_showtime.data, function(index, val) {
					var show_data = new Array();
					$.each($("#showTime_film li").eq(index).find("div.film"), function(i, v) {
						var startArr = $(v).find(".time").text().split(" - ");
						langId = $(v).find(".rightR").attr("lang");
						filmCode = $(v).find(".rightR").attr("code");

						// 添加语言、影片编号默认值
						var data = {
								"id": $(v).attr("data"),
								"filmName": $(v).find(".rightR").attr("title"),
								"showBeginTime": startArr[0].trim(),
								"showEndTime": startArr[1].trim(),
								"intervalTime": 15,
								"langId": langId*1,
					 			"filmCode": filmCode
						};
						show_data.push(data);
					});
					json_showtime.data[index].viewSchedule=show_data;
				});
				
				var saveData =JSON.stringify(json_showtime);
				server.saveSchedule(crtLgnCinemaId, slt_date,saveData, function(cbkData){
					if(cbkData.ret){
						tipMsg_Single("dateTitle", 0, "保存成功!", 0, '', '');
					}else{
						tipMsg_Single("dateTitle", 0, "保存失败，请联系管理员!", 0, '', '');
					}
				});
			}
		}else{
			initLoginDialog();	// 初始化登录框(2015-05-08)
		}
	},
	//打印文档
	_print:function(param){
		var oWin=window.open("","_blank");
		// var newstr = $(param).html();
		// var odlstr = $("body",).html();
		// $("body").html(newstr);
		// window.print();
		// $("body").html(odlstr);
	},
	//移动排期
	_moveAllFilm:function(param){//L向左移动  R向右移动
		var size = $("#moveSize").val();
		if(isNaN(size)||size==""){
			tipMsg_Single("moveSize", 0, "请输入移动数字内容，并选择对应的厅！<br />【默认移动全部的厅】", 0, '', '');
			return false;
		}
		if(parseInt(size) <= 0 ) {
			tipMsg_Single("moveSize", 0, "请输入大于0的整数！", 0, '', '');
			return false;
		}
		
		var flag = false;
		$.each($(".film"), function(index, val) {
			var left = parseInt($(val).css("left"));
			if(param == "L"){
				left = left - parseInt(size);
				if(left <= 0) flag = true;
			}else if(param == "R"){
				left = left + parseInt(size);
				if(left >= 1100) flag = true;
			}
		});
		if(flag){
			tipMsg_Single("moveSize", 0, "移动值超过排期规定的界限！", 0, '', '');
			return false;
		}
		$.each($(".film"), function(index, val) {
			var left = parseInt($(val).css("left"));
			if(param == "L"){
				left = left - parseInt(size);
				$(val).css('left', left);
			}else if(param == "R"){
				left = left + parseInt(size);
				$(val).css('left', left);
			}
			//计算时间
			var h = Math.floor(left/60);
			var m = left%60;
			h +=8;
			if( h >= 24 ){
				h -= 24;
			}
			h = "0000000000"+h;
			m = "0000000000"+m;
			// 改为ie8兼容方式
			h = h.substr(h.length-2, 2);
			m = m.substr(m.length-2, 2);

			var count = $(val).find(".time").attr('data');
			
			var eh = Math.floor((left+parseInt(count))/60);
			var em = (left+parseInt(count))%60;
			eh += 8;
			if( eh >= 24 ){
				eh -= 24;
			}
			eh = "0000000000"+eh;
			em = "0000000000"+em;
			eh = eh.substr(eh.length-2, 2);
			em = em.substr(em.length-2, 2);

			$(val).find(".time").html(h+":"+m+" - "+eh+":"+em);
		});
	},
	//选择性移动排期
	_moveSltorAllFilm:function(param){//L向左移动  R向右移动
		var size = $("#moveSize").val();
		if(isNaN(size)||size==""){
			tipMsg_Single("moveSize", 0, "请输入移动数字内容，并选择对应的厅！<br />【默认移动全部的厅】", 0, '', '');
			return false;
		}
		if(parseInt(size) <= 0 ) {
			tipMsg_Single("moveSize", 0, "请输入大于0的整数！", 0, '', '');
			return false;
		}
		
		var flag = false;
		$.each($(".film"), function(index, val) {
			var left = parseInt($(val).css("left"));
			if(param == "L"){
				left = left - parseInt(size);
				if(left <= 0) flag = true;
			}else if(param == "R"){
				left = left + parseInt(size);
				if(left >= 1100) flag = true;
			}
		});
		if(flag){
			tipMsg_Single("moveSize", 0, "移动值超过排期规定的界限！", 0, '', '');
			return false;
		}

		var hallObj = $("input[id^='hall_']");	// 所有厅的选取框
		var hallObjArr = [];	// 需要移动的厅的索引
		for (var i = 0; i < hallObj.length; i++) {
			var hallObjArrIndex = hallObjArr.length;
			if(hallObj[i].checked){
				var parObjIndex = $(hallObj[i]).val();
				hallObjArr[hallObjArrIndex] = parObjIndex;
			}
		}

		if(hallObjArr.length == 0){
			moveOption._moveSltorAllFilmDo($(".film"), param, size);
		}else if(hallObjArr.length >= 1){
			for (var i = 0; i < hallObjArr.length; i++) {
				var moveObj = $("#showTime_film").find("li:eq(" +hallObjArr[i] + ")").find(".film");
				moveOption._moveSltorAllFilmDo(moveObj, param, size);
			}
		}
	},
	//选择性移动排期 - 执行移动
	_moveSltorAllFilmDo:function(moveObj, param, size){
		$.each(moveObj, function(index, val) {
			var left = parseInt($(val).css("left"));
			if(param == "L"){
				left = left - parseInt(size);
				$(val).css('left', left);
			}else if(param == "R"){
				left = left + parseInt(size);
				$(val).css('left', left);
			}
			//计算时间
			var h = Math.floor(left/60);
			var m = left%60;
			h +=7;	// 基于7点计算
			if( h >= 24 ){
				h -= 24;
			}
			h = "0000000000"+h;
			m = "0000000000"+m;
			// 改为ie8兼容方式
			h = h.substr(h.length-2, 2);
			m = m.substr(m.length-2, 2);

			var count = $(val).find(".time").attr('data');
			
			var eh = Math.floor((left+parseInt(count))/60);
			var em = (left+parseInt(count))%60;
			eh += 7;
			if( eh >= 24 ){
				eh -= 24;
			}
			eh = "0000000000"+eh;
			em = "0000000000"+em;
			eh = eh.substr(eh.length-2, 2);
			em = em.substr(em.length-2, 2);

			$(val).find(".time").html(h+":"+m+" - "+eh+":"+em);
		});
	},
	_downloadSche:function(){
		if (crtLgnCinemaId == "") {
			tipMsg_Single("searchFilm", 0, "无可下载信息！", 0, '', '');
			return false;
		} else {
			var data = $("#searchFilm").parent(".time_search").find(".time").val();
			window.open('/schedule/apis/schedule/'+crtLgnCinemaId+'/'+data+'/downByHall.html','newwindow');
		}
	}
}
/**
 * [initPage 初始化页面]
 * @return {[type]} [description]
 * 
 * @remark (20150415) 为影片名字部分设置width/overflow/white-space/text-overflow, 控制超出部分显示省略号
 */
var json_showtime = "";

function initPage(){
	var browserV = navigator.appVersion;
	$("#filmNameForSch").text(cinemaObj.name);	// 设置插件标题的影院名字
	$("#dateTitle").text(scheduledate);	// 设置插件标题的日期
	var langId = "", filmCode = "";	// 语言、影片编号
	
	var HallHtml = "";
	server.rowDisplay(
			crtLgnCinemaId, 
			scheduledate, 
			langId, 
			filmCode, 
			function(callbackData){
				hallData = callbackData.halls;
				json_showtime = callbackData;	
				if(typeof json_showtime.data != "undefined"){
					var dataObj = json_showtime.data;
					var hallObj = json_showtime.halls;
					var returnObj = findHallOfNoSch(dataObj, hallObj);

					var theIndex = 0;	// 下标索引
					//初始化排期列表
					$.each(json_showtime.data, function(index, val) {
						var hall_pos = "";	// 确保每个厅的位置
						if(index > 0)hall_pos=" style='margin-top:-1px;'";
						//初始化影厅名称
						$(".mainTable .officeNum .downicon").before('<li' + hall_pos + '>'
							+'<span id="hallTypeLayer_' + (index) + '" class="hall-type-layer"></span>'
							+'<a href="javascript:;" class="hall-a-1">'
							+'<label for ="hall_'+(index)+'" class="hall-label" title="'+val.hallName+'" onmouseover="showHallType(this, event);"'
							+' onmouseout="hideHallType(this, event);">'+val.hallName.substr(0,4)+'</label>'
							+'<input type="checkbox" name="hall_id" id="hall_'+(index)+'" value="'+(index)+'" />'
							+'</a></li>');
						
						// 保证影片列表id下标索引的连续性
						if(index > 0){
							theIndex += ((json_showtime.data)[index-1].viewSchedule).length;
						}else{
							theIndex = index;
						}

						//循环获取影厅排期
						var strVar = "<li>", film_lang = "", film_code = "";

						$.each(val.viewSchedule, function(idx, v) {
							if(v.langId != undefined && v.langId != ""){
								film_lang = v.langId;
							}else{
								film_lang = "";
							}

							if(v.filmCode != undefined && v.filmCode != ""){
								film_code = v.filmCode;
							}else{
								film_code = "";
							}

							var time_json = time_count(v.showBeginTime,v.showEndTime);	
							strVar += "<div id='filmBlock_"+ (idx+1 + theIndex) + "' class='film bg3 label label-primary' data='"+v.id+"' style='left:"+time_json.film_left+"px;width:"+time_json.film_size+"px;'>";
							strVar += "<div id='editBtn_" + (idx+1 + theIndex) + "' class='edit-div' style='width:" + time_json.film_size + "px; left:0px;' onclick='openEditFilmLayer(this);'>编&nbsp;&nbsp;辑</div>";
							// strVar += "<div id='filmBlock_"+ (idx+1 + theIndex) + "' class='film bg3 label label-primary' data='"+v.id+"' style='left:"+time_json.film_left+"px;width:"+time_json.film_size+"px;'>";
							    
							// strVar += "	<div class=\"left\">";
							// strVar += "	<\/div>";
							// strVar += "	<div class=\"right\">";
							// strVar += "		<div class=\"rightL\">";
							// strVar += "		<\/div>";
							strVar += "<div class='rightR' title='"+v.filmName+"' lang='" + film_lang + "' code='" + film_code + "' style='width:100%;'>";
							strVar += "<p class='time' data='"+time_json.film_size+"'>";
							strVar += v.showBeginTime+" - "+v.showEndTime;
							strVar += "</p>";
							strVar += "<p style='width:"+time_json.film_size+"px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;'>";
							strVar += v.filmName;
							strVar += "</p>";
							strVar += "</div>";
							strVar += "<div class='film-type-block btn-bg-color-1 btn-bc-5 btn-common btn-radius-all'></div>";
							// strVar += "	<\/div>";
							strVar += "</div>";
						});
						strVar += "</li>";
						$("#showTime_film").append(strVar);


					});

					// 将无排期的厅插到顺序位置 2015-05-13
					if(returnObj.length > 0){
						// alert(returnObj[0][0]+" - "+returnObj[0][1]+" - "+returnObj[0][2]+" - "+returnObj[0][3]+" - "+returnObj[0][4]);
						// console.log(returnObj);
						var emptyHallHtml = "", objLength = returnObj.length;
						for (var i = 0; i < objLength; i++) {
							var positionIndex = returnObj[i][0];
							var positionIndexHallName = returnObj[i][1];

							emptyHallHtml = '<li style="margin-top:-1px;">'
								+'<span id="hallTypeLayer_' + (positionIndex) + '" class="hall-type-layer"></span>'
								+'<a href="javascript:;" class="hall-a-1">'
								+'<label for="hall_empty_'+(positionIndex)+'" class="hall-label" title="'+positionIndexHallName+'" onmouseover="showHallType(this, event);"'
								+' onmouseout="hideHallType(this, event);">' + positionIndexHallName.substr(0,4)+'</label>'
								+'<input type="checkbox" name="hall_id" id="hall_empty_'+(positionIndex)+'" value="'+(positionIndex)+'" />'
								+'</a></li>';

							if(positionIndex == 0) {	// 1号厅
								$(".mainTable").find(".officeNum").find("li:eq(" + positionIndex + ")").after(emptyHallHtml);
								$(".mainTable .listCon .yinpianList").find("ul").find("li:eq(" + (positionIndex) + ")").before("<li>&nbsp;</li>");
							}else {
								$(".mainTable").find(".officeNum").find("li:eq(" + positionIndex + ")").after(emptyHallHtml);
								$(".mainTable .listCon .yinpianList").find("ul").find("li:eq(" + (positionIndex-1) + ")").after("<li>&nbsp;</li>");
							}
						}

						correctSomeHallProp();	// 校正部分厅的相关属性值

						json_showtime.data = resetSchData(dataObj, returnObj);	// 为排期信息重新赋值，避免修改排期，保存后出现数据错乱（2015-05-13）
					}
					
					// 为影片块添加颜色
					var countFilmResult = countGroupByFilmName(dataObj);	// 影片统计结果
					film_color = selectColorForObj(countFilmResult, 0, true);	// 选颜色
					setFilmColorForAdjust(film_color);	// 设置颜色

					$(".listCon").scrollLeft(minStartTimePos);	// 根据排期展示获得的最小开始时间位置，动态设置区域位置

					moveOption._moveFilm();
					moveOption._filmDrop();
					moveOption._bindDBLClick();
					moveOption._bindClick();

					// 延迟添加影片类型提示
					setTimeout(function() {
						setFilmBlockType(dataObj);
					}, 500);

					// 设置厅颜色, 添加颜色图例
					var countHallResult = countGroupByHallType(hallObj);	// 影厅统计结果
					var hall_color_type = selectColorForObj(countHallResult, 1, false);	// 选颜色
					var hall_color_name = reviewHallColor(hall_color_type, hallObj);	// 重新关联颜色
					setHallColorForAdjust(hall_color_name);	// 设置颜色
					createHallTypeLegend(hall_color_type);

					// 动态设置弹出层的高度、宽度
					var titleH = $(".container").find("div:eq(0)").height() + 15;
					var legendH = $(".hall-type-imgLegend").height() + 15;
					var filmAreaH = ($("#showTime_film").find("li").length)*50 + 60;
					var pH = $(".container").find("div:eq(1)").find("p").height() + 95;
					$(".xubox_main").css({"height":titleH+legendH+filmAreaH+pH+"px", "border-width":"1px", "border-style":"solid", "border-color":"#CCC", "border-radius":"6px", "box-shadow":"0 0 10px 5px #EEE", "background-color":"#FAFAFA"});
					$(".xubox_layer").css("width", "1220px");	// 宽度设为绝对值

					// 动态设置右侧影片列表块高度、位置
					var filmAreaH2 = ($("#showTime_film").find("li").length)*50;
					var setHeight = filmAreaH2 + 30;	// 30:标尺高度
					var setMarginT = (setHeight - 8)*(-1);
					$("#film_list").css({"height":setHeight+"px", "margin-top":setMarginT+"px"});
				}
				

				//初始化影片列表
				moveOption._showFilm(1, film_color);
			});

	
}

/**
* 检索没有排期的厅 2015-05-13
*
* @param dataObj 排期数据对象
* @param hallObj 影厅数据对象
*
* @return Array
* */
function findHallOfNoSch(dataObj, hallObj){
	var returnObj = [];

	if(hallObj.length > dataObj.length){
		var returnObjIndex = 0;

		for (var i = 0; i < hallObj.length; i++) {
			var hallArr = [];
			var hallFlag = false;

			for (var j = 0; j < dataObj.length; j++) {
				if(hallObj[i].id == dataObj[j].hallId){
					hallFlag = true;
				}
			}

			if(!hallFlag){
				hallArr[0] = i;
				hallArr[1] = hallObj[i].hallName;
				hallArr[2] = hallObj[i].hallType;
				hallArr[3] = hallObj[i].intervalTime;
				hallArr[4] = hallObj[i].id;
				returnObj[returnObjIndex]=hallArr;
				returnObjIndex++;
			}
		}
	}

	return returnObj;
}

/**
* 校正部分厅的"类型提示框ID"、"复选框ID 及 value"
*
* @description 校正规则:从有效厅开始, 厅的位置索引值 和 该厅的复选框值 一致; 有效索引:0~厅的数量-1
**/
function correctSomeHallProp() {
	var liObj = $(".officeNum").find("li");	// 获取存放厅的li
	var liNum = liObj.length;	// li数量
	var tempHallTypeLayerObj, tempHallCheckObj;	// 存放需校正对象属性值的临时对象
	var tempHallTypeLayer, tempHallCheckId, tempHallCheckValue, tempHallName;	// 存放需校正对象属性值的临时变量
	var prefix_hallTypeLayer, prefix_hallCheckId;	// id 属性前缀

	// 从有效厅开始遍历, i 代表厅的索引(实际从0开始)
	for(var i = 1; i < liNum-1; i++) {	// 根据html结构, 从1开始遍历(有效厅从0开始); 但相关值的索引值应该设为 i-1
		tempHallTypeLayerObj = $(liObj).eq(i).find("span");
		tempHallCheckObj = $(liObj).eq(i).find("input");

		tempHallTypeLayer = tempHallTypeLayerObj.attr("id");
		tempHallName = $(liObj).eq(i).find("label").attr("title");
		tempHallCheckId = tempHallCheckObj.attr("id");
		tempHallCheckValue = tempHallCheckObj.val();

		// 该厅的复选框值和当前厅的索引 不一致, 需要校正
		if(tempHallCheckValue != (i-1)) {
			prefix_hallTypeLayer = tempHallTypeLayer.substring(0, tempHallTypeLayer.indexOf("_") + 1);
			prefix_hallCheckId = tempHallCheckId.substring(0, tempHallCheckId.indexOf("_") + 1);

			tempHallTypeLayerObj.attr("id", prefix_hallTypeLayer + (i-1));
			tempHallCheckObj.attr("id", prefix_hallCheckId + (i-1));
			tempHallCheckObj.val(i-1);
		}
	}
}

/**
* 重置排期信息，避免有空厅时，修改排期，保存后出现数据错乱问题
* 问题原因：保存是遍历json_showtime.data；但是json_showtime.data中没有空厅数据记录
*
* @param dataObj 排期数据对象
* @param emptyHallObj 空影厅数据集
* 
* @return Object json_showtime.data加入空厅后的数据集
* */
function resetSchData(dataObj, emptyHallObj){
	var returnArr = {};

	for (var i = 0; i < dataObj.length; i++) {
		var dataObjIndex = i + 1;	// 用于定位的位置索引值
		var equalFlag = false;	// 返回结果是否取dataObj的标识

		for (var j = 0; j < emptyHallObj.length; j++) {
			if(dataObjIndex == emptyHallObj[j][0]*1){
				equalFlag = true;
				var tempDataObj = dataObj[dataObjIndex];
				var newHallObjData = { 
					"hallId" : emptyHallObj[j][4] , 
					"hallName" : emptyHallObj[j][1] , 
					"hallType" : emptyHallObj[j][2], 
					"viewSchedule" : [ {
						"id" : "", "filmName" : "" , "showBeginTime" : "" , "showEndTime" : "" , "intervalTime" : emptyHallObj[j][3]
					} ]
				};
				dataObj[dataObjIndex] = newHallObjData;

				returnArr = resetDataObj(dataObj, dataObj.length, dataObjIndex + 1, tempDataObj);
			}
		}
		
		if(!equalFlag){	
			returnArr = dataObj;
		}
	}

	return returnArr;
}

/**
* 重置Object中数据(json_showtime.data)的位置
*
* @param dataObject 排期数据对象
* @param fromPos 开始位置
* @param toPos 结束位置
* @param tempDataObj 被占位的数据
*
* @return Object
* */
function resetDataObj(dataObj, fromPos, toPos, tempDataObj){
	var returnObj = {};
	for (var i = fromPos; i >= toPos; i--) {
		if(fromPos != toPos){
			if (i == toPos){
			dataObj[i] = tempDataObj;
			}else{
				dataObj[i] = dataObj[i - 1];
			}
		}
		
		returnObj = dataObj;
	}

	return returnObj;
}

/**
* 日期框选择事件
**/
function WdatePickedFunc() {
	var sltDate = $dp.cal.getDateStr();
	moveOption._saveAsSchedule(sltDate);
	$("#save_as_btn").val("另存为");
}

/**
* 获取屏幕宽度，调整相关样式
**/
function getWorkPageW() {
	var pageW = window.screen.availWidth;	// 屏幕可用工作区宽度(等于屏幕分辨率宽度)
	if(pageW <= 1024){
		alert("您的屏幕分辨率宽度不足 [1024]");
		$(".xubox_page").css("width", "100%");
		$(".container").css("width", "100%");
		$(".containerTitle").css("width", "91%");
		$(".mainTable").css("width", "890px");
		$(".listCon").css("width", "610px");
	}
}

// 用于隐藏日期控件
document.body.onclick = function() {
	var divObj;
	if($(".xubox_layer").next("div").attr("lang")){
		divObj = $(".xubox_layer").next("div");
	}
	if($(".zhezhao2").next("div").attr("lang")){
		divObj = $(".zhezhao2").next("div");
	}
	if($(".xubox_shade").prev("div").attr("lang")){
		divObj = $(".xubox_shade").prev("div");
	}
	if($("iframe").parent().attr("lang")) {
		divObj = $("iframe").parent();
	}

	if(divObj){
		divObj.hide();
	}
};

/**
* 执行删除排期
*
* @param choice 用户的选择
* @param obj 
**/
function IDoDecisionImpl(choice, obj) {
	if(choice == "sure") {
		$(delObj).remove();

		$(".delContainer").remove();
		$(".zhezhao1").remove();
	}
}

/**
* 关闭按钮
**/
function closeAdjustLayer() {
	$(".xubox_shade").remove();
	$(".xubox_layer").remove();
}
