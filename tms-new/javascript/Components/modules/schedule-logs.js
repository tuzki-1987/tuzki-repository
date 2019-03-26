/**
* Module:scheduleLogs
* @description: 排期-日程 模块
*
* @type Object
*			id: 模块ID(与require.config.*.js中 paths 的模块配置的key一致, 与菜单hash值一致)
*			title: 模块标题
*			page: 当前模块一级菜单名字索引
*			pageSub: 当前模块二级菜单名字索引
*			scriptObj: 当前模块所需要的脚本模块集合(在require.config.*.js的paths中配置)
*			template: 模块模板(采用ES6语法包裹)
*			callback: 模块回调函数
**/

define({
	id: "scheduleLogs",
	title: "排期管理",
	page: "menu_schedule",
	pageSub: "menu_schedule_tab1",
	scriptObj: ["blockUI", "scheduleLogsAjax"],
	template: `<link type="text/css" href="css/waitmanage.css" rel="stylesheet" />
				<div class="date">
					<a href="javascript:;" class="a04 lf">
						<input type="text" class="Wdate quick-date-input" id="quickDateBtn" onclick="WdatePicker({qsEnabled:false, onpicked:scheduleLogsObj.handlePickerQuickDate})" />
						<img src="images/date01.png" />
					</a>
				    <ul class="list04 lf" id="quickDate" v-bind:title="title">
				    	<li v-for="(item, index) in dateItemsCpt" v-bind:key="item.value" v-bind:data-value="item.value" v-bind:data-idx="index" v-bind:class="{'current06': index == curDateTab}" v-on:click="handleClickQuickDate">{{item.date}} {{item.week}}</li>
				    </ul>
				    <div class="lf" style="width:15%; padding:13px 0 0 5%;">
				    	<p style="padding-right:10%;">
				        	<a href="javascript:;" class="a-img" id="ele1"><img src="images/bg11.png" alt="" /></a>
				            <div id="blk1" class="popB" style="display:none; width:450px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">导入排期</h2>
				                <div style="padding:50px 0 50px 78px;">
				                	<div class="date01">
				                    	<p>日期：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="importDateBtn" class="Wdate layer-date-input" readonly="readonly" onclick="WdatePicker({qsEnabled:false, minDate:'%y-%M-%d', onpicked:scheduleLogsObj.handlePickerImportDate})" />
				                        </p>
				                    </div>
				                    <div class="input04" style="padding-left:20px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doImport();"></a>
				                        <a href="javascript:;" class="a_pop02" id="closeST"></a>
				                    </div>
				                </div>
				            </div>
				        </p>
				    	<p>
				    		<a href="javascript:;" class="a-img" id="ele01"><img src="images/bg12.png" alt="" /></a>
				    		<div id="blk01" class="popB" style="display:none; width:450px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">下发排期</h2>
				                <div style="padding:50px 0 50px 78px;">
				                	<div class="date01">
				                    	<p>日期：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="distributeDateBtn" class="Wdate layer-date-input" readonly="readonly" onclick="WdatePicker({qsEnabled:false, minDate:'%y-%M-%d', onpicked:scheduleLogsObj.handlePickerDistributeDate})" />
				                        </p>
				                    </div>
				                    <div class="input04" style="padding-left:20px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doDistribute();"></a>
				                        <a href="javascript:;" class="a_pop02" id="closeST"></a>
				                    </div>
				                </div>
				            </div>
				    	</p>
				    </div>
				    <div class="rt" style="width:32%; padding-top:13px;">
				    	<p style="padding-right:5%;">
				        	<a href="javascript:;" class="a-img" id="ele2"><img src="images/bg13.png" alt="" /></a>
				            <div id="blk2" class="popB" style="display:none; width:550px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">复制排期</h2>
				                <div style="padding:40px 0 50px 78px;">
				                <!--开始-->
				                	<div class="date01">
				                    	<p>以下排期：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="copyScheFromDateBtn" class="Wdate layer-date-input" readonly="readonly" onclick="WdatePicker({qsEnabled:false, maxDate:'%y-%M-{%d-1}', onpicked:scheduleLogsObj.handlePickerCopyScheFromDate})" />
				                        </p>
				                    </div>
				                    <div class="divse01">
				                        <form action="" method="post">
				                        <div id="divselect" class="divselect01 add02">
				                            <cite id="copySltHall" onclick="global.divselect.showList(this, event);">请选择厅</cite>
				                            <ul class="hall-list-ul2" data-status="0"></ul>
				                        </div>
				                        <input name="" type="hidden" value="" id="inputselect" />
				                        </form>
				                    </div>
				                    <div class="date01">
				                    	<p>复制到：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="copyScheToDateBtn" class="Wdate layer-date-input" readonly="readonly" onclick="WdatePicker({qsEnabled:false, minDate:'%y-%M-%d', onpicked:scheduleLogsObj.handlePickerCopyScheToDate})" />
				                        </p>
				                    </div>
				                    <div class="">
				                    	<div class="copy-sch-hall-all" style="background-color: #1c2340; width: 92%;">
						                	<p class="gp03" style="width: 75px; padding: 5px 0 5px 16px;" onclick="scheduleLogsObj.handleCheckAllHall(this, 1);">
						                		<input type="checkbox" id="copySltAll" style="vertical-align: middle; margin-right: 5px;" />
						                		<label for="copySltAll">全部厅</label>
						                	</p>
						                    <div class="ting01 copy-hall-list" id="copyHallList" data-status="0"></div>
						                </div>
					                </div>
				                    <!--结束-->
				                    <!--开始--><!--<p class="gp03">复制方式：<span><input type="radio" checked="checked" />日期</span><span><input type="radio" />厅</span></p>
				                    <div class="date01">
				                    	<p>原日期：</p>
				                        <p class="p_01">2018-01-23 12:36:39</p>
				                    </div>
				                    <div class="date01">
				                    	<p>日期日期：</p>
				                        <p class="p_01">2018-01-23 12:36:39</p>
				                    </div>--><!--结束-->
				                    <div class="input04" style="padding-left:58px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doCopy();"></a>
				                        <a href="javascript:;" class="a_pop02" id="closeST"></a>
				                    </div>
				                </div>
				            </div>
				        </p>
				    	<p style="padding-right:5%;">
				        	<a href="javascript:;" class="a-img" id="ele3"><img src="images/a_03.png" alt="" /></a>
				            <div id="blk3" class="popB" style="display:none; width:450px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">删除排期</h2>
				                <div style="padding:50px 0 50px 0">
				                	<p class="p_02">确定要删除全部排期吗？</p>
				                    <div class="input04" style="padding-left:93px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doDelete();"></a>
				                        <a href="javascript:;" class="a_pop02" id="closeST"></a>
				                    </div>
				                </div>
				            </div>
				        </p>
				    	<p style="padding-right:5%;">
				        	<a href="javascript:;" class="a-img" id="ele4"><img src="images/bg13_02.png" alt="" /></a>
				            <div id="blk4" class="popB" style="display:none; width:535px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10" id="editLayerTitle">编辑排期</h2>
				                <div style="padding:50px 0 30px 36px;">
				                	<div class="divse01">
				                    	<p class="lf">影厅：</p>
				                        <form action="" method="post">
				                        <div id="divselect01" class="divselect01 add02">
				                            <cite id="editSltHall" onclick="global.divselect.showList(this, event);">请选择厅</cite>
				                            <ul class="hall-list-ul" data-status="0"></ul>
				                        </div>
				                        <input name="" type="hidden" value="" id="inputselect01"/>
				                        </form>
				                    </div>
				                	<div class="date01">
				                    	<p>开始时间：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="editScheDateBtn" class="Wdate layer-date-input" readonly="readonly" onclick="WdatePicker({qsEnabled:false, minDate:'%y-%M-%d', onpicked:scheduleLogsObj.handlePickerEditScheDate})" />
				                        </p>
				                    </div>
				                    <div class="date01">
				                    	<p style="width:60px;">SPL：</p>
				                        <p style="width:250px;">
				                        	<input type="text" value="" class="text05" id="showSltSPLName" />
				                        </p>
				                        <p>
				                        	<a href="javascript:;" class="a-img">
				                        		<img src="images/bg23.png" onclick="scheduleLogsObj.showSPLforInsert();" />
				                        		<!--<input type="file" name="file" id="fileSPL" value="" class="choose-file" />-->
				                        	</a>
				                        </p>
				                    </div>
				                    <div class="box04" id="splListArea">
				                    	<div class="search">
				                            <div class="textB01 lf add04">
				                            	<input type="text" placeholder="SPL名称" class="text02" id="splKeyWords" v-model.trim="keyWords" />
				                            </div>
				                        	<a href="javascript:;" class="a-img" v-on:click="handleClickSearch">
				                        		<img src="images/bg16_01.png" alt="" />
				                        	</a>
				                        </div>
				                        <div class="overflow01" id="splListDiv">
				                        	<ul class="spl-list-ul">
				                        		<li v-if="isEditCpt">
				                        			<p style="width: 99%; text-align: center;">点击"选择SPL"获取</p>
				                        		</li>
				                            	<li v-else v-for="(item, index) in splListItemsCpt" 
				                            		v-bind:key="item.spl_id"
				                            		v-bind:data-id="item.spl_id" 
				                            		v-bind:data-name="item.chinese" 
				                            		v-bind:data-title="item.title" 
				                            		v-bind:title="item.chinese" 
				                            		v-on:click.capture="handleClickSPL">
				                                	<p class="p1" 
					                                	v-bind:data-id="item.spl_id" 
					                            		v-bind:data-name="item.chinese" 
					                            		v-bind:data-title="item.title" >{{index*1 + 1}}</p>
				                                    <p class="p2" 
					                                    v-bind:data-id="item.spl_id" 
					                            		v-bind:data-name="item.chinese" 
					                            		v-bind:data-title="item.title" >{{item.chinese}}</p>
				                                    <p class="p3" 
					                                    v-bind:data-id="item.spl_id" 
					                            		v-bind:data-name="item.chinese" 
					                            		v-bind:data-title="item.title" >{{item.duration2}}</p>
				                                </li>
				                            </ul>
				                        </div>
				                    </div>
				                    <div class="input04" style="padding-left:120px; height:50px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doUpdate();"></a>
				                    	<a href="javascript:;" class="a_pop02" id="closeST"></a>
				                	</div>
				                </div>
				            </div>
				        </p>
				        <p>
				        	<a href="javascript:;" class="a-img" id="ele5"><img src="images/bg22.png" alt="" /></a>
				            <div id="blk5" class="popB" style="display:none; width:550px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">同步排期</h2>
				                <div style="padding:50px 0 50px 78px;">
				                	<div class="date01">
				                    	<p>日期：</p>
				                        <p class="p_01">
				                        	<input type="text" value="" id="synchronizeDateBtn" class="Wdate layer-date-input" readonly="readonly" readonly="readonly" onclick="WdatePicker({qsEnabled:false, minDate:'%y-%M-%d', onpicked:scheduleLogsObj.handlePickerSynchronizeDate})" />
				                        </p>
				                    </div>
				                    <p class="gp03">
				                    	<span style="padding: 0;">影厅：</span>
				                    	<span style="padding: 0;" onclick="scheduleLogsObj.handleCheckAllHall(this, 2);">
				                    		<input type="checkbox" id="synAllHall" /><label for="synAllHall">全部</label>
				                    	</span>
				                    </p>
				                    <div class="ting01 syn-hall-list" id="synHallList" data-status="0" style="width: 92%;"></div>
				                    <div class="input04" style="padding-left:55px;">
				                    	<a href="javascript:;" class="a_pop01" onclick="scheduleLogsObj.doSynchronize();"></a>
				                        <a href="javascript:;" class="a_pop02" id="closeST"></a>
				                    </div>
				                </div>
				            </div>
				        </p>
				    </div>
				</div>
				<div class="waitmanage">
					<div class="wait01 content_2 lf">
				    	<ul class="waitlF lf" id="schHallWait" v-bind:title="title">
				    		<li v-for="(item, index) in hallItemsCpt" 
				    			v-bind:key="item.id" 
				    			v-bind:data-id="item.id" 
				    			v-bind:class="item.className">厅{{item.name}}</li>
				        </ul>
				        <div class="overflowX content_3">
				        	<div class="waitTime">
				            	<div class="mask">
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                    <p></p>
				                </div>
				                <div>8:00</div>
				                <div>9:00</div>
				                <div>10:00</div>
				                <div>11:00</div>
				                <div>12:00</div>
				                <div>13:00</div>
				                <div>14:00</div>
				                <div>15:00</div>
				                <div>16:00</div>
				                <div>17:00</div>
				                <div>18:00</div>
				                <div>19:00</div>
				                <div>20:00</div>
				                <div>21:00</div>
				                <div>22:00</div>
				                <div>23:00</div>
				                <div>24:00</div>
				                <div>01:00</div>
				                <div>02:00</div>
				                <div>03:00</div>
				                <div>04:00</div>
				                <div>05:00</div>
				                <div>06:00</div>
				                <div>07:00</div>
				            </div>
				            <div class="waitList01" id="waitListSch">
				            	<div class="list_B" v-for="(listb, pid) in scheduleItemsCpt" v-bind:key="listb.id">
				            		<div class="wait03 lf" 
				            			v-for="(item, cid) in listb.show" 
				            			v-bind:key="item.stuid"
				            			v-bind:data-id="item.id" 
				            			v-bind:data-pid="pid" 
				            			v-bind:data-cid="cid" 
				            			v-bind:data-hallid="item.hallId" 
				            			v-bind:data-hallname="item.hallName" 
				            			v-bind:data-name="item.name" 
				            			v-bind:data-sdtime="item.datetime"
				            			v-bind:data-etime="item.etime" 
				            			v-bind:data-showstate="item.showState" 
				            			v-bind:style="item.isSelected ? item.selectedStyleVal : item.styleVal" 
				            			v-on:click="handleClickSchBlock" 
				            			v-on:mouseenter="hanldeMouseEnter" 
				            			v-on:mouseleave="hanldeMouseleave">
				                    	<p class="over-name" v-bind:style="item.nameStyle">{{item.name}}</p>
				                    	<p style="padding: 2px 0 0; text-align: center;">
				                    		<span 
				                    			v-bind:data-id="item.id" 
				                    			v-bind:data-pid="pid" 
						            			v-bind:data-cid="cid" 
						            			v-bind:data-hallid="item.hallId" 
						            			v-bind:data-hallname="item.hallName" 
						            			v-bind:data-name="item.name" 
						            			v-bind:data-sdtime="item.datetime" 
						            			v-bind:data-etime="item.etime" 
						            			v-bind:data-showstate="item.showState" 
						            			v-bind:style="item.stimeStyle">{{item.stime}}</span>
						            		<span 
				                    			v-bind:data-id="item.id" 
				                    			v-bind:data-pid="pid" 
						            			v-bind:data-cid="cid" 
						            			v-bind:data-hallid="item.hallId" 
						            			v-bind:data-hallname="item.hallName" 
						            			v-bind:data-name="item.name" 
						            			v-bind:data-sdtime="item.datetime" 
						            			v-bind:data-etime="item.etime" 
						            			v-bind:data-showstate="item.showState" 
						            			v-bind:style="item.ptimeStyle">{{item.ptime}}</span>
				                    	</p>
				                    	<a href="javascript:;" v-show="item.hasAdver" style="top: 6px;" v-bind:style="item.adverStyle">
				                    		<img src="images/icon10.png" alt="" />
				                    	</a>
				                    	<p class="whole-name" 
				                    		v-bind:data-id="item.id" 
				                    		v-bind:data-pid="pid" 
				                    		v-bind:data-cid="cid" 
				                    		v-bind:data-hallid="item.hallId" 
						            		v-bind:data-hallname="item.hallName" 
						            		v-bind:data-name="item.name" 
						            		v-bind:data-sdtime="item.datetime" 
						            		v-bind:data-etime="item.etime" 
						            		v-bind:data-showstate="item.showState" 
				                    		v-show="item.wholeName" 
				                    		v-on:mouseleave="hanldeMouseleave">《{{item.name}}》</p>
				                    </div>
				            	</div>
				            </div>
				        </div>    
				    </div>
				    <div class="wait02 lf">
				    	<h2 class="h04">播放列表</h2>
				    	<div id="playListCnt">
					    	<h2 class="h03">
					    		<span>{{filmInfoCpt.hallName}}</span>
					    		<span style="padding:0 0 0 10%; width:64%;" v-bind:title="filmInfoCpt.filmName">{{filmInfoCpt.filmName}}</span>
					    		<span>{{filmInfoCpt.stime}}</span>
					    	</h2>
					        <div class="tab01">
					        	<ul class="list05 content_1">
					            	<li v-bind:class="item.isActive ? 'li02' : ''" v-for="(item, index) in playListItemsCpt" v-bind:key="item.cpl_uuid" v-bind:data-idx="index">
					            		<a href="javascript:;" v-bind:data-idx="index" v-on:click="handleClickPlayListItem">
					            			<span style="width:52%;" v-bind:title="item.custom_name" v-bind:data-idx="index">{{item.custom_name}}</span>
					            			<span style="width:24%;" v-bind:data-idx="index">{{item.cplStartTime}}</span>
					            			<span v-bind:data-idx="index" style="width: 20%; text-align: right;">{{item.duration2}}</span>
					            		</a>
					            		<ul v-show="item.isActive">
							                <li class="bgNo" v-for="(itemc, index2) in item.cueInfo" v-bind:key="">
							                	<a href="javascript:;">
							                		<span style="width:57%;" v-bind:title="itemc.title">{{itemc.title}}</span>
							                		<span style="width:28%;">{{itemc.cueTime}}</span>
							                	</a>
							                </li>
						            	</ul>
						            </li>
					            </ul>
					        </div>
					        <div class="p05 desc_info_box" style="height: 130px;">
					        	<div v-for="item in descInfoCpt">
					        		<p>{{item.showInfo}}</p>
					        		<div style="padding-left: 30px;">
						        		<p v-for="itemd in item.descs" v-bind:key="">{{itemd.text}}</p>
						        	</div>
					        	</div>
					        </div>
					    </div>
				        <div class="input02" style="display: none;">
				        	<a href="javascript:;" class="a-img" id="ele6"><img src="images/bg21.png" alt="" /></a>
				        	<div id="blk6" class="popB" style="display:none; width:450px; padding-bottom:20px;">
				            	<p class="rt" style="padding:16px 18px 0 0;"><a href="javascript:;" class="closeST"><img src="images/close01.png" /></a></p>
				                <h2 class="h10">查看详情</h2>
				                <div style="">详情内容</div>
				            </div>
				        </div>
				    </div>
				</div>`,
	callback: function(args) {
		console.log("here>>>>>>>>>>>>>>>>>排期-日程")
		console.log(args);
		require(args, function() {
			console.log("require ----------------- 日程")
			// 内容滚动条样式
			$(".content_2").mCustomScrollbar({
				scrollInertia:150
			});
			$(".content_3").mCustomScrollbar({
				scrollInertia:150,
				axis:"x"
			});
			
			// 初始化函数
			scheduleLogsObj.main();
		})
	}
});