var saveFilmListsHTML;	// 存放片源列表HTML（用于自动提示无输入或为空时，显示全部影片列表）
var saveFilmListsData;	// 存放片源列表元数据

var callback = { "ver" : "1.0" , "ret" : true , "errcode" : 0 , "errmsg" : "" , "totalCount" : 254 , "current" : 0 , "offset" : 5 , "data" : [ { "id" : 2539 , "code" : "boxOfficeDetail20150525" , "cinemaId" : 510 , "hallId" : 1416 , "hallName" : "4号4K厅" , "filmName" : "灰姑娘（数字）" , "showDate" : "2015-03-14" , "showTime" : "19:20" , "sessionCount" : 1 , "ticketCount" : 84 , "price" : 1706 , "totalTicketCount" : 84 , "totalPrice" : 1706 , "avgPrice" : 20 , "totalSeatCount" : 157 , "seatRate" : 53.5 , "flag" : 0} , { "id" : 2553 , "code" : "boxOfficeDetail20150525" , "cinemaId" : 510 , "hallId" : 1407 , "hallName" : "3号4K厅" , "filmName" : "超能陆战队（数字3D）" , "showDate" : "2015-03-15" , "showTime" : "13:10" , "sessionCount" : 1 , "ticketCount" : 71 , "price" : 1775 , "totalTicketCount" : 71 , "totalPrice" : 1775 , "avgPrice" : 25 , "totalSeatCount" : 133 , "seatRate" : 53.38 , "flag" : 0} , { "id" : 2692 , "code" : "boxOfficeDetail20150525" , "cinemaId" : 510 , "hallId" : 1417 , "hallName" : "5号4K厅" , "filmName" : "飓风营救3" , "showDate" : "2015-03-20" , "showTime" : "19:50" , "sessionCount" : 1 , "ticketCount" : 66 , "price" : 1650 , "totalTicketCount" : 66 , "totalPrice" : 1650 , "avgPrice" : 25 , "totalSeatCount" : 201 , "seatRate" : 32.84 , "flag" : 0} , { "id" : 2560 , "code" : "boxOfficeDetail20150525" , "cinemaId" : 510 , "hallId" : 1406 , "hallName" : "2号4K厅" , "filmName" : "超能陆战队（数字3D）" , "showDate" : "2015-03-15" , "showTime" : "15:45" , "sessionCount" : 1 , "ticketCount" : 65 , "price" : 1625 , "totalTicketCount" : 65 , "totalPrice" : 1625 , "avgPrice" : 25 , "totalSeatCount" : 154 , "seatRate" : 42.21 , "flag" : 0} , { "id" : 2691 , "code" : "boxOfficeDetail20150525" , "cinemaId" : 510 , "hallId" : 1416 , "hallName" : "4号4K厅" , "filmName" : "失孤" , "showDate" : "2015-03-20" , "showTime" : "19:20" , "sessionCount" : 1 , "ticketCount" : 62 , "price" : 1264 , "totalTicketCount" : 62 , "totalPrice" : 1264 , "avgPrice" : 20 , "totalSeatCount" : 157 , "seatRate" : 39.49 , "flag" : 0}] , "films" : [ { "id" : 269 , "filmName" : "第七子：降魔之战"} , { "id" : 270 , "filmName" : "暴走神探 "} , { "id" : 271 , "filmName" : "谍·莲花 "} , { "id" : 272 , "filmName" : "暴走神探"} , { "id" : 273 , "filmName" : "功夫"} , { "id" : 274 , "filmName" : "谍·莲花"} , { "id" : 275 , "filmName" : "第七子：降魔之战"} , { "id" : 276 , "filmName" : "霍比特人：五军之战"} , { "id" : 277 , "filmName" : "怪谈"} , { "id" : 278 , "filmName" : "味道中国 (2015)"} , { "id" : 279 , "filmName" : "霍比特人：五军之战"} , { "id" : 280 , "filmName" : "怪谈"} , { "id" : 281 , "filmName" : "味道中国"} , { "id" : 282 , "filmName" : "黄金福将"} , { "id" : 283 , "filmName" : "奇缘灰姑娘"} , { "id" : 284 , "filmName" : "黄金福将"} , { "id" : 285 , "filmName" : "熊出没之雪岭熊风"} , { "id" : 286 , "filmName" : "我要你开花"} , { "id" : 287 , "filmName" : "有种你爱我"} , { "id" : 288 , "filmName" : "坚不可摧"} , { "id" : 289 , "filmName" : "奔跑吧！兄弟"} , { "id" : 290 , "filmName" : "时光大战"} , { "id" : 291 , "filmName" : "热血男人帮"} , { "id" : 292 , "filmName" : "喜羊羊与灰太狼之羊年喜羊羊"} , { "id" : 293 , "filmName" : "宝贝，对不起"} , { "id" : 294 , "filmName" : "一路惊喜"} , { "id" : 295 , "filmName" : "摩尔庄园3：魔幻列车大冒险"} , { "id" : 296 , "filmName" : "天将雄师"} , { "id" : 297 , "filmName" : "饥饿游戏3：嘲笑鸟（上）"} , { "id" : 298 , "filmName" : "神探驾到"} , { "id" : 299 , "filmName" : "蜡笔总动员"} , { "id" : 300 , "filmName" : "甲方乙方"} , { "id" : 301 , "filmName" : "不见不散"} , { "id" : 302 , "filmName" : "死亡之谜"} , { "id" : 303 , "filmName" : "有一个地方只有我们知道"} , { "id" : 304 , "filmName" : "钟馗伏魔：雪妖魔灵"} , { "id" : 305 , "filmName" : "狼图腾"} , { "id" : 306 , "filmName" : "深海挑战"} , { "id" : 307 , "filmName" : "新年快乐之盗贼联盟"} , { "id" : 308 , "filmName" : "吉星高照2015"} , { "id" : 309 , "filmName" : "甜蜜蜜"} , { "id" : 310 , "filmName" : "我只要我们在一起"} , { "id" : 311 , "filmName" : "澳门风云2"} , { "id" : 312 , "filmName" : "爸爸的假期"} , { "id" : 313 , "filmName" : "爸爸去哪儿2"} , { "id" : 314 , "filmName" : "冲上云霄"} , { "id" : 315 , "filmName" : "母亲的梦想"} , { "id" : 316 , "filmName" : "超能陆战队"} , { "id" : 317 , "filmName" : "将错就错"} , { "id" : 318 , "filmName" : "全能囧爸"} , { "id" : 319 , "filmName" : "帕丁顿熊"} , { "id" : 320 , "filmName" : "战狼"} , { "id" : 321 , "filmName" : "北京，纽约"} , { "id" : 322 , "filmName" : "木星上行"} , { "id" : 323 , "filmName" : "大喜临门"} , { "id" : 324 , "filmName" : "美丽笨女人"} , { "id" : 325 , "filmName" : "母亲的梦想"} , { "id" : 326 , "filmName" : "海岛之恋"} , { "id" : 327 , "filmName" : "封门诡影"} , { "id" : 328 , "filmName" : "灰姑娘"} , { "id" : 329 , "filmName" : "扑通扑通我的人生"} , { "id" : 330 , "filmName" : "枪过境"} , { "id" : 331 , "filmName" : "红包"} , { "id" : 332 , "filmName" : "飓风营救3"} , { "id" : 333 , "filmName" : "可爱的你"} , { "id" : 334 , "filmName" : "失孤"} , { "id" : 335 , "filmName" : "少年毛泽东"} , { "id" : 336 , "filmName" : "璀璨的婚礼"} , { "id" : 337 , "filmName" : "菜鸟"} , { "id" : 338 , "filmName" : "王牌特工：特工学院"} , { "id" : 339 , "filmName" : "一万年以后"} , { "id" : 340 , "filmName" : "贵族大盗"} , { "id" : 341 , "filmName" : "念念"} , { "id" : 342 , "filmName" : "咱们结婚吧"} , { "id" : 343 , "filmName" : "抢过境"} , { "id" : 344 , "filmName" : "璀璨的婚礼"} , { "id" : 345 , "filmName" : "第七谎言"} , { "id" : 349 , "filmName" : "速度与激情7"} , { "id" : 350 , "filmName" : "特功明星 "} , { "id" : 351 , "filmName" : "魔法总动员"} , { "id" : 352 , "filmName" : "公路美人"} , { "id" : 353 , "filmName" : "白幽灵传奇之绝命逃亡"} , { "id" : 354 , "filmName" : "三更车库"} , { "id" : 355 , "filmName" : "暴疯语"} , { "id" : 356 , "filmName" : "冲锋车"} , { "id" : 357 , "filmName" : "我是女王"} , { "id" : 358 , "filmName" : "枪过境"} , { "id" : 359 , "filmName" : "陌路惊笑"} , { "id" : 360 , "filmName" : "十万伙急"} , { "id" : 361 , "filmName" : "十万伙急"} , { "id" : 362 , "filmName" : "万物生长"} , { "id" : 363 , "filmName" : "破坏者 "} , { "id" : 366 , "filmName" : "复仇者联盟2：奥创纪元"} , { "id" : 367 , "filmName" : "何以笙箫默"} , { "id" : 368 , "filmName" : "左耳"} , { "id" : 369 , "filmName" : "贵族大盗"} , { "id" : 370 , "filmName" : "赤道"} , { "id" : 383 , "filmName" : "测试影片"} , { "id" : 384 , "filmName" : "测试影片001"} , { "id" : 385 , "filmName" : "测试影片002"} , { "id" : 386 , "filmName" : "疯狂外星人"}]};	// 片源列表

/**
 * 加载票房明细
 * 
 * @param 
 * 		current 当前条数
 * 		offset  每页显示数
 * 		obj     对象ID
 * @return
 * */
function loadBoxOfficeDetail(){	
	if(callback.ret){
		var filmsListHTML = "";
		var finalHTML = "";

		var filmLists = callback.films;	// 片源列表
		saveFilmListsData = filmLists;	// 存放片源列表元数据
		for(var m = 0; m < filmLists.length; m++){
			filmsListHTML += "<li value='" + filmLists[m].id +"'>" + filmLists[m].filmName + "</li>";
		}
		saveFilmListsHTML = filmsListHTML;	// 存放片源列表HTML

		// 方式2
		finalHTML = "<input type='hidden' name='userSltFilmValue' id='userSltFilmValue' value='' />"
					+"<input type='text' name='userSlt' id='userSltFilm' class='userSltFilm' value='请选择匹配片源' title='请选择匹配片源' readonly='readonly' onclick='return ap.ctrlFilmListFunc(this, event);' />"
					+"<div class='filmListBox-div'>"
						+"<input type='text' name='userInput' id='userInputFilm' class='userInputFilm' value='不如试试搜索' onclick='return ap.searchInputFunc(this, event);' onkeyup='return ap.filmListByKey(this);' />"
						+"<ul class='filmListBox-ul'>"
						+filmsListHTML
						+"</ul>"
					+"</div>";						
		
		$("#show_div").empty().html(finalHTML);	// 显示内容
	}
}

$(function(){
	loadBoxOfficeDetail();
});