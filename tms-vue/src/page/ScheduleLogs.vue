<template>
    <div class="page-container">
        <div class="date">
            <a href="javascript:;" class="a04 lf posit">
                <span class="date-picker">
                    <el-date-picker
                      v-model="chooseDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      @change="doChooseDate" />
                </span>
                <img src="static/images/date01.png" class="date-picker-img" />
            </a>
            <ul class="list04 lf">
                <li v-for="(item, index) in dateItems" :key="item.value" :data-value="item.value" :data-idx="index" :class="{'current06': index == curDateTab}" @click="handleClickQuickDate">{{item.date}} {{item.week}}</li>
            </ul>
            <div class="lf" style="width:15%; padding:8px 0 0 5%;">
                <div class="btn-inline pdrt-8">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkImportSch')">
                        <img src="static/images/bg11.png" alt="" />
                    </a>
                    <div id="blkImportSch" class="popB" style="display:none; width:450px; padding-bottom:20px;">
                        <p class="rt" style="padding:16px 18px 0 0;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">导入排期</h2>
                        <div style="padding:50px 0 50px 78px;">
                            <div class="date01">
                                <p>日期：</p>
                                <p class="p_01 posit">
                                    <span>{{importDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="importDate"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期" />
                                    </span>
                                </p>
                            </div>
                            <div class="input04" style="padding-left:20px;">
                                <a href="javascript:;" class="a_pop01" @click="doImport"></a>
                                <a href="javascript:;" class="a_pop02" @click="closeBlockUI"></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-inline">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkDistributeSch')">
                        <img src="static/images/bg12.png" alt="" />
                    </a>
                    <div id="blkDistributeSch" class="popB" style="display:none; width:450px; padding-bottom:20px;">
                        <p class="rt" style="padding:16px 18px 0 0;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">下发排期</h2>
                        <div style="padding:50px 0 50px 78px;">
                            <div class="date01">
                                <p>日期：</p>
                                <p class="p_01 posit">
                                    <span>{{distributeDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="distributeDate"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期" />
                                    </span>
                                </p>
                            </div>
                            <div class="input04" style="padding-left:20px;">
                                <a href="javascript:;" class="a_pop01" @click="doDistribute"></a>
                                <a href="javascript:;" class="a_pop02" id="closeST" @click="closeBlockUI"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rt" style="width:32%; padding-top:8px;">
                <div class="btn-inline pdrt-3">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkCopySch')">
                        <img src="static/images/bg13.png" alt="" />
                    </a>
                    <div id="blkCopySch" class="popB" style="display:none; width:550px; padding-bottom:20px;">
                        <p class="rt" style="padding:16px 18px 0 0;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">复制排期</h2>
                        <div style="padding:40px 0 50px 78px;">
                            <!--开始-->
                            <div class="date01">
                                <p>以下排期：</p>
                                <p class="p_01 posit">
                                    <span>{{copyFromDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="copyFromDate"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期" />
                                    </span>
                                </p>
                            </div>
                            <div class="date01">
                                <p class="lf">原厅：</p>
                                <div id="divselect" class="divselect01 add02">
                                    <cite>{{copyFromHallLabel}}</cite>
                                    <span class="date-picker date-picker-ipt" style="width: 142px;">
                                        <el-select size="small" v-model="copyFromHall" placeholder="请选择厅">
                                            <el-option v-for="item in hallSelects"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </span>
                                </div>
                            </div>
                            <div class="date01">
                                <p>复制到：</p>
                                <p class="p_01 posit">
                                    <span>{{copyToDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="copyToDate"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期" />
                                    </span>
                                </p>
                            </div>
                            <div class="date01" style="padding-bottom: 8px;">
                                <p>目标厅：</p>
                                <p><el-checkbox :indeterminate="isIndeterminate" v-model="hallCheckAll" @change="handleHallCheckAllChange">全部厅</el-checkbox></p>
                            </div>
                            <div class="ting01 hall-list-bar">
                                <tms-scroll>
                                    <el-checkbox-group v-model="checkedHalls" @change="handleCheckedHallChange">
                                        <el-checkbox v-for="item in hallChecks"
                                            :key="item.label"
                                            :label="item.value"
                                            class="hall-check">{{item.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </tms-scroll>
                            </div>
                            <!--结束-->
                            <div class="input04" style="padding-left:58px;">
                                <a href="javascript:;" class="a_pop01" @click="doCopy"></a>
                                <a href="javascript:;" class="a_pop02" @click="closeBlockUI"></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-inline pdrt-3">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkDeleteSch', 'delete')">
                        <img src="static/images/a_03.png" alt="" />
                    </a>
                    <div id="blkDeleteSch" class="popB" style="display:none; width:450px; padding-bottom:20px;">
                        <p class="rt" style="padding:16px 18px 0 0;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">删除排期</h2>
                        <div style="padding:50px 0 50px 0">
                            <p class="p_02">确定要删除全部排期吗？</p>
                            <div class="input04" style="padding-left:93px;">
                                <a href="javascript:;" class="a_pop01" @click="doDelete"></a>
                                <a href="javascript:;" class="a_pop02" @click="closeBlockUI"></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-inline pdrt-3">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkEditSch', 'editoper')">
                        <img src="static/images/bg13_02.png" alt="" />
                    </a>
                    <div class="backdrop" :class="{'backdrop-show': blkEditSchShow}"></div>
                    <div id="blkEditSch" class="popB blk-edit-sch" :class="{'blk-edit-sch-show': blkEditSchShow}">
                        <p class="rt" style="padding:16px 18px 0 0; float: right;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI('editoper')">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">{{editLayerTitle}}</h2>
                        <div style="padding:50px 0 30px 36px;">
                            <div class="divse01">
                                <p class="lf">影厅：</p>
                                <div id="divselect" class="divselect01 add02">
                                    <cite>{{editHallName}}</cite>
                                    <span class="date-picker date-picker-ipt" style="width: 142px;">
                                        <el-select size="small" v-model="editHall" placeholder="请选择厅" @change="handleEditHallChange">
                                            <el-option v-for="item in hallSelects2"
                                                data-name='item.label'
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"></el-option>
                                        </el-select>
                                    </span>
                                </div>
                            </div>
                            <div class="date01">
                                <p>开始时间：</p>
                                <p class="p_01 posit">
                                    <span>{{editSchStartDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="editSchStartDate"
                                          type="datetime"
                                          value-format="yyyy-MM-dd HH:mm:ss"
                                          placeholder="选择开始时间"
                                          :default-time="defaultTimeS" />
                                    </span>
                                </p>
                            </div>
                            <div class="date01">
                                <p style="width:60px;">SPL：</p>
                                <p style="width:250px;">
                                    <input type="text" v-model="splName" class="text05" readonly="readonly" />
                                </p>
                                <p>
                                    <a href="javascript:;" class="a-img" @click="showSPLforInsert">
                                        <img src="static/images/bg23.png" />
                                    </a>
                                </p>
                            </div>
                            <div class="box04">
                                <div class="search">
                                    <div class="textB01 lf add04" style="width: 80%;">
                                        <input type="text" v-model="splNameKeyWord" placeholder="SPL名称" class="text02" />
                                    </div>
                                    <a href="javascript:;" class="a-img" style="display: none;">
                                        <img src="static/images/bg16_01.png" alt="" />
                                    </a>
                                </div>
                                <div class="overflow01">
                                    <tms-scroll>
                                        <ul>
                                            <li v-if="splIsEdit">
                                                <p style="width: 99%; text-align: center;">点击"选择SPL"获取</p>
                                            </li>
                                            <li v-else v-for="(item, index) in splListItemsCmp"
                                                :key="item.spl_id"
                                                :data-id="item.spl_id"
                                                :data-name="item.chinese"
                                                :data-title="item.title"
                                                :title="item.chinese"
                                                @click.capture="handleClickSPL">
                                                <p class="p1"
                                                    :data-id="item.spl_id"
                                                    :data-name="item.chinese"
                                                    :data-title="item.title" >{{index*1 + 1}}</p>
                                                <p class="p2"
                                                    :data-id="item.spl_id"
                                                    :data-name="item.chinese"
                                                    :data-title="item.title" >{{item.chinese}}</p>
                                                <p class="p3"
                                                    :data-id="item.spl_id"
                                                    :data-name="item.chinese"
                                                    :data-title="item.title" >{{item.duration2}}</p>
                                            </li>
                                        </ul>
                                    </tms-scroll>
                                </div>
                            </div>
                            <div class="input04" style="padding-left:120px; height:50px;">
                                <a href="javascript:;" class="a_pop01" @click="doUpdate"></a>
                                <a href="javascript:;" class="a_pop02" @click="closeBlockUI('editoper')"></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-inline">
                    <a href="javascript:;" class="a-img" @click="openBlockUI('#blkSyncSch')">
                        <img src="static/images/bg22.png" alt="" />
                    </a>
                    <div id="blkSyncSch" class="popB" style="display:none; width:550px; padding-bottom:20px;">
                        <p class="rt" style="padding:16px 18px 0 0;">
                            <a href="javascript:;" class="closeST" @click="closeBlockUI">
                                <img src="static/images/close01.png" />
                            </a>
                        </p>
                        <h2 class="h10">同步排期</h2>
                        <div style="padding:50px 0 50px 78px;">
                            <div class="date01">
                                <p>日期：</p>
                                <p class="p_01 posit">
                                    <span>{{synchronizeDate}}</span>
                                    <span class="date-picker date-picker-ipt">
                                        <el-date-picker
                                          size="small"
                                          v-model="synchronizeDate"
                                          type="date"
                                          value-format="yyyy-MM-dd"
                                          placeholder="选择日期" />
                                    </span>
                                </p>
                            </div>
                            <div class="date01" style="padding-bottom: 8px;">
                                <p>影厅：</p>
                                <p><el-checkbox :indeterminate="isIndeterminate2" v-model="hallCheckAll2" @change="handleHallCheckAllChange2">全部厅</el-checkbox></p>
                            </div>
                            <div class="ting01 hall-list-bar">
                                <tms-scroll>
                                    <el-checkbox-group v-model="checkedHalls2" @change="handleCheckedHallChange2">
                                        <el-checkbox v-for="item in hallChecks2"
                                            :key="item.label"
                                            :label="item.value"
                                            class="hall-check">{{item.label}}</el-checkbox>
                                    </el-checkbox-group>
                                </tms-scroll>
                            </div>
                            <div class="input04" style="padding-left:55px;">
                                <a href="javascript:;" class="a_pop01" @click="doSynchronize"></a>
                                <a href="javascript:;" class="a_pop02" @click="closeBlockUI"></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="waitmanage">
            <div class="wait01 content_2 lf">
                <tms-scroll :ops="content2Ops">
                    <ul class="waitlF lf">
                        <li v-for="item in hallItems"
                            :key="item.id"
                            :data-id="item.id"
                            :class="item.className">厅{{item.name}}</li>
                    </ul>
                    <div class="overflowX content_3">
                        <tms-scroll :ops="content3Ops">
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
                            <div class="waitList01">
                                <div class="list_B" v-for="(listb, pid) in scheduleItems" :key="listb.id">
                                    <div class="wait03 lf"
                                        v-for="(item, cid) in listb.show"
                                        :key="item.stuid"
                                        :data-id="item.id"
                                        :data-pid="pid"
                                        :data-cid="cid"
                                        :data-hallid="item.hallId"
                                        :data-hallname="item.hallName"
                                        :data-name="item.name"
                                        :data-sdtime="item.datetime"
                                        :data-etime="item.etime"
                                        :data-showstate="item.showState"
                                        :style="item.isSelected ? item.selectedStyleVal : item.styleVal"
                                        @click="handleClickSchBlock"
                                        @mouseenter="hanldeMouseEnter"
                                        @mouseleave="hanldeMouseleave">
                                        <p class="over-name" :data-id="item.id"
                                            :data-pid="pid"
                                            :data-cid="cid"
                                            :data-hallid="item.hallId"
                                            :data-hallname="item.hallName"
                                            :data-name="item.name"
                                            :data-sdtime="item.datetime"
                                            :data-etime="item.etime"
                                            :data-showstate="item.showState"
                                            :style="item.nameStyle">{{item.name}}</p>
                                        <p :data-id="item.id"
                                            :data-pid="pid"
                                            :data-cid="cid"
                                            :data-hallid="item.hallId"
                                            :data-hallname="item.hallName"
                                            :data-name="item.name"
                                            :data-sdtime="item.datetime"
                                            :data-etime="item.etime"
                                            :data-showstate="item.showState"
                                            style="padding: 2px 0 0; text-align: center;">
                                            <span :data-id="item.id"
                                                :data-pid="pid"
                                                :data-cid="cid"
                                                :data-hallid="item.hallId"
                                                :data-hallname="item.hallName"
                                                :data-name="item.name"
                                                :data-sdtime="item.datetime"
                                                :data-etime="item.etime"
                                                :data-showstate="item.showState"
                                                :style="item.stimeStyle">{{item.stime}}</span>
                                            <span :data-id="item.id"
                                                :data-pid="pid"
                                                :data-cid="cid"
                                                :data-hallid="item.hallId"
                                                :data-hallname="item.hallName"
                                                :data-name="item.name"
                                                :data-sdtime="item.datetime"
                                                :data-etime="item.etime"
                                                :data-showstate="item.showState"
                                                :style="item.ptimeStyle">{{item.ptime}}</span>
                                        </p>
                                        <a href="javascript:;" v-show="item.hasAdver" style="top: 6px;" :style="item.adverStyle">
                                            <img src="static/images/icon10.png" alt="" />
                                        </a>
                                        <p class="whole-name"
                                            :data-id="item.id"
                                            :data-pid="pid"
                                            :data-cid="cid"
                                            :data-hallid="item.hallId"
                                            :data-hallname="item.hallName"
                                            :data-name="item.name"
                                            :data-sdtime="item.datetime"
                                            :data-etime="item.etime"
                                            :data-showstate="item.showState"
                                            v-show="item.wholeName"
                                            @mouseleave="hanldeMouseleave">《{{item.name}}》</p>
                                    </div>
                                </div>
                            </div>
                        </tms-scroll>
                    </div>
                </tms-scroll>
            </div>
            <div class="wait02 lf">
                <h2 class="h04">播放列表</h2>
                <h2 class="h03">
                    <span>{{playListVueData.filmInfo.hallName}}</span>
                    <span style="padding:0 0 0 10%; width:66%;">{{playListVueData.filmInfo.filmName}}</span>
                    <span>{{playListVueData.filmInfo.stime}}</span>
                </h2>
                <div class="tab01">
                    <ul class="list05 content_1">
                        <tms-scroll>
                            <li v-for="(item, index) in playListVueData.playListItems" :key="item.cpl_uuid" :data-idx="index" :class="item.isActive ? 'li02' : ''">
                                <a href="javascript:;" :data-idx="index" @click="handleClickPlayListItem">
                                    <span style="width:52%;" :title="item.custom_name" :data-idx="index">{{item.custom_name}}</span>
                                    <span style="width:24%;" :data-idx="index">{{item.cplStartTime}}</span>
                                    <span :data-idx="index" style="width: 20%; text-align: right;">{{item.duration2}}</span>
                                </a>
                                <ul v-show="item.isActive">
                                    <li class="bgNo" v-for="itemc in item.cueInfo" :key="itemc.cue_code">
                                        <a href="javascript:;">
                                            <span style="width:57%;" :title="itemc.title">{{itemc.title}}</span>
                                            <span style="width:28%;">{{itemc.cueTime}}</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </tms-scroll>
                    </ul>
                </div>
                <div class="p05 desc_info_box" style="height: 130px;">
                    <div v-for="item in playListVueData.descInfo" :key="item.st_id">
                        <p>{{item.showInfo}}</p>
                        <div style="padding-left: 30px;">
                            <p v-for="itemd in item.descs" :key="itemd.text">{{itemd.text}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import tools from '../utils/globalTools.js'
export default {
    name: 'ScheduleLogs',
    data() {
        return {
            loadOps: {
                lock: true,
                background: 'rgba(255, 255, 255, .5)'
            },
            // 父容器禁止水平滚动
            content2Ops: {
                scrollPanel: {
                    scrollingX: false
                }
            },
            content3Ops: {
                vuescroll: {
                    // 不能使用默认值percent, 否则会出现原生滚动条
                    sizeStrategy: 'number'
                }
            },
            // 区分"新增/编辑"(编辑:选中某一个排期块时)
            operFlag: {
                isEdit: false // 当前是否是编辑操作(默认新增)
            },
            blkEditSchShow: false, // 控制 编辑排期层 显示/隐藏
            defaultTimeS: '10:00:00',
            scheduleEmpty: null, // 排期是否为空
            curDate: tools.getNowDate(),
            curDateTab: 0,
            chooseDate: '',
            hallids: [], // 影厅id集合
            hallSelects: [], // 厅列表-下拉框
            hallSelects2: [], // 厅列表-下拉框
            hallChecks: [], // 厅列表 - 复选框
            hallChecks2: [], // 厅列表 - 复选框
            checkedHalls: [], // 选中的厅
            hallCheckAll: false,
            isIndeterminate: true,
            dateItems: [],
            hallItems: null, // 排期厅数据
            scheduleItems: null, // 排期数据
            importDate: '',
            distributeDate: '',
            copyFromDate: '',
            copyFromHall: '',
            copyToDate: '',
            editLayerTitle: '',
            editHallName: '请选择厅',
            editHall: '',
            editSchStartDate: '',
            splIsEdit: true, // 默认新增(控制spl列表显示)
            splName: '',
            splNameKeyWord: '',
            splListItems: null,
            synchronizeDate: '',
            hallCheckAll2: false,
            isIndeterminate2: true,
            checkedHalls2: [], // 选中的厅
            // 第一场排期的影片信息
            firstSchInfo: {
                showId: null,
                hallName: null,
                filmName: null,
                stime: null
            },
            // 播放列表的影片信息
            playSchInfo: {
                showId: null,
                hallName: null,
                filmName: null,
                stime: null
            },
            // 播放列表区域数据
            playListVueData: {
                filmInfo: {
                    hallName: null,
                    filmName: null,
                    stime: null
                },
                descInfo: null,
                playListItems: null
            },
            // 点击排期块数据
            schBlockData: {
                showId: null,
                showState: null
            },
            // spl列表点击数据
            splClickData: {
                id: null,
                name: null
            },
            scheduleDistriOps: {
                url: 'ajaxes/sendShow.php',
                params: {}
            },
            scheduleShowOps: {
                url: 'ajaxes/show.php',
                params: {}
            },
            splListOps: {
                url: 'ajaxes/spl.php',
                params: {}
            },
            deviceOps: {
                url: 'ajaxes/hall.php',
                params: {}
            }
        }
    },
    computed: {
        copyFromHallLabel() {
            let label = '请选择厅'
            if (this.copyFromHall) {
                if (this.copyFromHall !== 'all') label = this.copyFromHall + '厅'
                else label = '所有厅'
            }
            return label
        },
        // SPL列表:搜索SPL(新增/编辑排期)
        splListItemsCmp() {
            let keyWords = this.splNameKeyWord
            let result = null
            if (keyWords === '') result = this.splListItems
            else {
                let lists = this.splListItems
                result = {}
                for (let i in lists) {
                    if (lists[i].chinese.indexOf(keyWords) !== -1) result[i] = lists[i]
                }
            }
            return result
        }
    },
    created() {
        // 更改store状态
        this.$store.commit('upateRoute', this.$route)
        console.log('更改store状态 - 排期 - 日程 - 7')
    },
    mounted() {
        console.log('current route ::: ', this.$route)
        this.initQuickDate()
        this.showScheduleList()
        this.getHallInfo()
    },
    methods: {
        // 关闭浮层
        closeBlockUI() {
            let args = arguments
            if (args.length === 1 && args[0] === 'editoper') this.blkEditSchShow = false
            else $.unblockUI()
            this.resetFunc()
        },
        // 显示浮层
        openBlockUI(idSelector) {
            let args = arguments
            if (args.length === 2) {
                let args2 = args[1]
                // 删除排期
                if (args2 === 'delete') {
                    console.log('schedule isSelected [delete] : ' + this.operFlag.isEdit)
                    console.log('schedule end-time [delete] : ' + this.operFlag.endtime)
                    let scheEndtime = null
                    let nowTime = tools.getNowTime()
                    if (this.scheduleEmpty) {
                        this.$message('当前暂无排期')
                        return
                    }
                    if (this.operFlag.isEdit) {
                        scheEndtime = this.operFlag.endtime
                        if (scheEndtime < nowTime) {
                            this.$message({
                                message: '已结束的单场排期不可删除',
                                type: 'warning'
                            })
                        }
                        console.log('scheEndtime : ' + scheEndtime)
                        console.log('nowTime : ' + nowTime)
                        console.log('scheEndtime > nowTime ----------- ' + (scheEndtime > nowTime))
                    }
                }
                // 编辑排期
                if (args2 === 'editoper') {
                    console.log('schedule isSelected [edit] : ' + this.operFlag.isEdit)
                    console.log('schedule end-time [edit] : ' + this.operFlag.endtime)
                    let scheEndtime = null
                    let nowTime = tools.getNowTime().split(':')
                    if (this.operFlag.isEdit) {
                        scheEndtime = this.operFlag.endtime
                        if (scheEndtime < nowTime) {
                            this.$message({
                                message: '已结束的排期不可编辑',
                                type: 'warning'
                            })
                            return
                        }
                        console.log('scheEndtime : ' + scheEndtime)
                        console.log('nowTime : ' + nowTime)
                        console.log('scheEndtime > nowTime ----------- ' + (scheEndtime > nowTime))
                    }
                    this.loadEditData()
                    this.getSplList()
                }
            }
            if (args.length === 2 && args[1] === 'editoper') this.blkEditSchShow = true
            else $.blockUI({ message: $(idSelector) })
        },
        // 开始加载动画
        startLoad() {
            this.$loading(this.loadOps)
        },
        // 结束加载动画
        closeLoad(flag) {
            if (flag) {
                setTimeout(() => {
                    this.$loading().close()
                }, 500)
            } else this.$loading().close()
        },
        // 初始化速选日期列表
        initQuickDate() {
            let result = tools.getDateWeekArr(null, 3)
            this.dateItems = result
        },
        // 更新速选日期列表
        updateQuickDates(chooseDate) {
            let dateWeek = tools.getDateWeekArr(chooseDate, 3)
            this.dateItems = dateWeek
        },
        // 按速选日期显示排期
        handleClickQuickDate(evt) {
            let value = evt.target.dataset.value
            let idx = evt.target.dataset.idx
            this.curDate = value
            this.curDateTab = idx
            // 加载排期
            this.showScheduleList()
        },
        // 选择日期
        doChooseDate() {
            let date = this.chooseDate
            console.log('date : ' + date)
            this.curDate = date
            this.curDateTab = 0
            this.updateQuickDates(date)
            this.showScheduleList()
        },
        // 排期列表
        showScheduleList() {
            this.startLoad()
            let options = this.scheduleShowOps
            this.scheduleItems = []
            // 接口参数
            options.params = {
                act: 'listShow',
                showDate: this.curDate
            }
            this.scheduleEmpty = true // 排期默认为空
            this.$http.post(options.url, options.params).then(res => {
                console.log('排期列表 +++++++++++++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    // this.$message({
                    //     message: tools.handleSuccessStatusError(res),
                    //     type: 'warning'
                    // })
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.hallItems = this.getHallFromSchedule(res.data.data) // 排期影厅数据
                    this.scheduleItems = this.getHallSchedule(res.data.data) // 排期数据
                    // this.$nextTick(() => {
                    //     console.log('next tick')
                    //     this.scheduleItems = sches
                    // })
                    // 排期为空
                    if (this.scheduleEmpty) {
                        this.$message('所选日期暂无排期')
                        // 清空右侧播放列表
                        this.playListVueData.filmInfo.showId = null
                        this.playListVueData.filmInfo.hallName = null
                        this.playListVueData.filmInfo.filmName = null
                        this.playListVueData.filmInfo.stime = null
                        this.playListVueData.descInfo = null
                        this.playListVueData.playListItems = null
                    } else this.doScheduleDetail(this.scheduleEmpty) // 显示右侧播放列表
                }
                this.closeLoad(true)
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 获取排期影厅
        getHallFromSchedule(datas) {
            let msg = tools.valideDataType(datas, 'object') // 校验数据类型
            if (msg !== '') {
                this.$message.error(msg)
                throw new Error(msg)
            }
            console.log('------------------- 获取排期影厅 -------------------')
            let size = datas.length
            let className = ''
            let tempObj = {}
            let result = []
            for (let i = 0; i < size; i++) {
                tempObj = datas[i]
                switch (tempObj.hallState) {
                    case 0:
                        className = 'color_blue'
                        break
                    case 1:
                        className = 'color_yellow'
                        break
                    case 2:
                        className = 'color_red'
                        break
                    default:
                        className = ''
                        break
                }
                result.push({
                    id: tempObj.hall_id,
                    name: tempObj.hall_name,
                    className: className
                })
            }
            return result
        },
        // 获取排期数据
        getHallSchedule(datas) {
            let msg = tools.valideDataType(datas, 'object') // 校验数据类型
            if (msg !== '') {
                this.$message.error(msg)
                throw new Error(msg)
            }
            console.log('------------------- 获取排期数据 -------------------')
            let size = datas.length
            let hallId = null
            let hallName = null
            let hasAdver = false
            let styleVal = ''
            let selectedStyleVal = 'background-color: rgb(235, 150, 29); ' // 选中时的样式
            let adverStyle = ''
            let nameStyle = ''
            let stimeStyle = ''
            let ptimeStyle = ''
            let showId = null
            let showState = null
            let splState = null
            let width = 0
            let tempShow = []
            let playShow = []
            let showSize = 0
            let tempObj = {}
            let showSch = []
            let result = []
            for (let i = 0; i < size; i++) {
                // 无排期
                if (!datas[i].show || datas[i].show.length === '') {
                    result.push({'show': []})
                    continue
                }
                this.scheduleEmpty = false // 有排期
                playShow = playShow.length === 0 ? datas[i].show : playShow
                hallId = datas[i].hall_id
                hallName = datas[i].hall_name
                tempShow = datas[i].show
                showSize = tempShow.length
                showSch = []
                // 遍历厅的排期
                for (let j = 0; j < showSize; j++) {
                    styleVal = ''
                    tempObj = tempShow[j]
                    showId = tempObj.st_id
                    showState = tempObj.show_state * 1
                    splState = tempObj.splState
                    width = tempObj.f_width
                    switch (showState) {
                        case 1:
                            styleVal = 'background-color:#1db2eb; '
                            break
                        case 2:
                            styleVal = 'background-color:#f44a48; '
                            break
                    }
                    // 是否有广告
                    switch (splState) {
                        case 1:
                            hasAdver = false // 只有正片, 没有广告
                            break
                        case 2:
                            hasAdver = true // 排期有正片也有广告
                            break
                        case 3:
                            hasAdver = true // 只有广告
                            break
                    }
                    // 色块宽度
                    if (width >= 70) {
                        adverStyle = ''
                        nameStyle = ''
                        stimeStyle = ''
                        ptimeStyle = ''
                    }
                    if (width >= 35 && width < 70) {
                        adverStyle = ''
                        nameStyle = ' display: none;'
                        stimeStyle = ''
                        ptimeStyle = ' display: none;'
                    }
                    if (width < 35) {
                        adverStyle = ''
                        nameStyle = ' display: none;'
                        stimeStyle = ' display: none;'
                        ptimeStyle = ' display: none;'
                    }
                    styleVal += 'width: ' + tempObj.f_width + 'px; left: ' + tempObj.left_set + 'px;'
                    selectedStyleVal += 'width: ' + tempObj.f_width + 'px; left: ' + tempObj.left_set + 'px;'
                    showSch.push({
                        id: tempObj.st_id,
                        name: tempObj.show_name, // 影片名
                        stuid: tempObj.st_uuid,
                        splid: tempObj.spl_uuid,
                        date: tempObj.belong_date, // 日期
                        stime: tempObj.start_time_d, // 开始时间
                        ptime: '(' + tempObj.p_time_d + ')', // 正片开始时间
                        etime: tempObj.belong_date + ' ' + tempObj.end_time_d + ':00', // 结束时间
                        datetime: tempObj.belong_date + ' ' + tempObj.start_time_d + ':00',
                        duration: tempObj.duration,
                        showState: tempObj.show_state,
                        playState: tempObj.play_state,
                        hallId: hallId,
                        hallName: hallName,
                        hasAdver: hasAdver,
                        wholeName: false,
                        isSelected: false,
                        styleVal: styleVal,
                        adverStyle: adverStyle,
                        nameStyle: nameStyle,
                        stimeStyle: stimeStyle,
                        ptimeStyle: ptimeStyle,
                        selectedStyleVal: selectedStyleVal
                    })
                }
                result.push({'show': showSch})
                // 保存第一场排期的信息
                if (!this.firstSchInfo.showId && playShow.length !== 0) {
                    this.firstSchInfo.showId = showId
                    this.firstSchInfo.hallName = hallName + '厅'
                    this.firstSchInfo.filmName = playShow[0].show_name
                    this.firstSchInfo.stime = playShow[0].start_time_d
                    this.playSchInfo.showId = showId
                    this.playSchInfo.hallName = hallName + '厅'
                    this.playSchInfo.filmName = playShow[0].show_name
                    this.playSchInfo.stime = playShow[0].start_time_d
                }
            }
            return result
        },
        // 排期详情
        doScheduleDetail(flag) {
            console.log('排期详情 : ' + flag)
            let options = this.scheduleShowOps
            // 非编辑时默认显示第一场排期信息
            let infos = !this.operFlag.isEdit ? this.firstSchInfo : this.playSchInfo
            let showId = infos.showId
            let stime
            if (this.playSchInfo.stime.split(':').length === 3) {
                stime = this.playSchInfo.stime.slice(0, 5)
                this.playSchInfo.stime = stime
            }
            // 更新数据
            this.playListVueData.filmInfo = infos
            // 接口参数
            options.params = {
                act: 'detailsShow',
                showId: showId
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('排期详情 >>>>>>>>>>>>>> : ', res)
                if (res.data.status === 'error') {
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    let descInfos = res.data.data.excptInfo
                    let playItems = res.data.data.splInfo
                    let len = playItems.length
                    let duration = 0
                    let duration2 = 0
                    let isActive = false
                    for (let i = 0; i < len; i++) {
                        isActive = i === 0
                        duration = playItems[i].duration * 1
                        // 时间单位转换(转为分钟)
                        if (duration < 60)duration2 = duration + '″'
                        if (duration === 60)duration2 = '1′'
                        if (duration > 60) {
                            // 1小时
                            if (duration === 3600)duration2 = '60′'
                            else {
                                if (duration % 60 === 0)duration2 = Math.floor(duration / 60) + '′'
                                else duration2 = Math.floor(duration / 60) + '′' + duration % 60 + '″'
                            }
                        }
                        // 列表展开状态
                        playItems[i].isActive = isActive
                        playItems[i].duration2 = duration2
                    }
                    // 描述信息
                    for (let s = 0, len2 = descInfos.length; s < len2; s++) {
                        descInfos[s].descs = [] // 添加异常信息
                        switch (descInfos[s].show_state * 1) {
                            case 0:
                                descInfos[s].showInfo = '排期未下发'
                                break
                            case 1:
                                descInfos[s].showInfo = '排期已经正常下发'
                                break
                            case 2:
                                let excptInfo2 = descInfos[s].excptInfo
                                let len3 = excptInfo2.length
                                for (let j = 0; j < len3; j++) {
                                    descInfos[s].descs.push({
                                        text: excptInfo2[j].description
                                    })
                                }
                                descInfos[s].showInfo = '排期下发失败'
                                break
                        }
                    }
                    // 更新Vue实例数据
                    this.playListVueData.descInfo = descInfos
                    this.playListVueData.playListItems = playItems
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 点击播放列表某一记录
        handleClickPlayListItem(evt) {
            let idx = evt.target.dataset.idx * 1
            let lists = this.playListVueData.playListItems
            let len = lists.length
            let isActive = false
            console.log('当前点击的是第 ' + (idx + 1) + ' 项')
            console.log(lists)
            for (let i = 0; i < len; i++) {
                isActive = i === idx
                lists[i].isActive = isActive
            }
            this.playListVueData.playListItems = lists // 更新Vue实例数据
        },
        // 导入排期
        doImport() {
            let options = this.scheduleShowOps
            let importDate = this.importDate
            if (importDate === '') {
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                })
                return
            }
            this.startLoad()
            // 接口参数
            options.params = {
                act: 'importShow',
                importDate: importDate
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI()
                    this.closeLoad(true)
                    this.resetFunc()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 下发排期
        doDistribute() {
            let options = this.scheduleDistriOps
            let distributeDate = this.distributeDate
            if (distributeDate === '') {
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                })
                return
            }
            // 接口参数
            options.params = {
                act: 'sendShow',
                showDate: distributeDate
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.$message({
                        message: tools.handleSuccessStatusError(res),
                        type: 'warning'
                    })
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI()
                    this.closeLoad(true)
                    this.resetFunc()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 复制排期
        doCopy() {
            let options = this.scheduleShowOps
            let fromDate = this.copyFromDate
            let fromHall = this.copyFromHall
            let toDate = this.copyToDate
            let toHall = this.checkedHalls
            console.log('from date : ', fromDate)
            console.log('from hall : ', fromHall)
            console.log('to date : ', toDate)
            console.log('to hall : ', toHall)
            if (fromDate === '') {
                this.$message({
                    message: '请选择源日期',
                    type: 'warning'
                })
                return
            }
            if (fromHall === '') {
                this.$message({
                    message: '请选择源厅',
                    type: 'warning'
                })
                return
            }
            if (toDate === '') {
                this.$message({
                    message: '请选择目标日期',
                    type: 'warning'
                })
                return
            }
            if (toHall.length === 0) {
                this.$message({
                    message: '请选择目标厅',
                    type: 'warning'
                })
                return
            }
            this.startLoad()
            // 接口参数
            options.params = {
                act: 'copyShow',
                fromHall: fromHall,
                toHall: JSON.stringify(toHall),
                fromDate: fromDate,
                toDate: toDate
            }
            console.log('options : ', options)
            this.$http.post(options.url, options.params).then(res => {
                console.log('复制排期 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI()
                    this.closeLoad(true)
                    this.resetFunc()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 删除排期
        doDelete() {
            let options = this.scheduleShowOps
            let showId = this.schBlockData.showId
            this.startLoad()
            // 接口参数
            options.params = {
                act: 'delShow',
                showId: showId,
                delDate: null,
                isAll: 0
            }
            if (!showId) {
                options.params.delDate = this.curDate
                options.params.isAll = 1
            } else {
                options.params.delDate = null
                options.params.isAll = 0
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('删除排期 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI()
                    this.closeLoad(true)
                    this.resetFunc('update')
                    this.showScheduleList()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 编辑排期(新增/修改)
        doUpdate() {
            let options = this.scheduleShowOps
            let isEdit = this.operFlag.isEdit
            let hallId = this.editHall
            let stime = this.editSchStartDate
            let splId = this.splClickData.id
            let splName = this.splClickData.name
            let showId = this.schBlockData.showId
            let showState = this.schBlockData.showState
            if (hallId === '') {
                this.$message({
                    message: '请选择影厅',
                    type: 'warning'
                })
                return
            }
            if (stime === '') {
                this.$message({
                    message: '请选择开始时间',
                    type: 'warning'
                })
                return
            }
            if (!splId || !splName) {
                this.$message({
                    message: '请选择选择一个SPL',
                    type: 'warning'
                })
                return
            }
            console.log('is edit : ', isEdit)
            console.log('is edit : ', hallId)
            console.log('start time : ', stime)
            console.log('splId : ', splId)
            console.log('splName : ', splName)
            console.log('showId : ', showId)
            console.log('showState : ', showState)
            this.startLoad()
            // 准备参数
            if (!isEdit) {
                console.log('---------------------- 新增排期 ----------------------')
                // 接口参数
                options.params = {
                    act: 'newShow',
                    hallId: hallId,
                    startTime: stime,
                    splId: splId,
                    splName: splName
                }
            } else {
                console.log('---------------------- 编辑排期 ----------------------')
                // 接口参数
                options.params = {
                    act: 'editShow',
                    hallId: hallId,
                    startTime: stime,
                    splId: splId,
                    splName: splName,
                    showId: showId,
                    showState: showState
                }
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('编辑排期 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI('editoper')
                    this.closeLoad(true)
                    this.resetFunc('update')
                    this.showScheduleList()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 同步排期
        doSynchronize() {
            let options = this.scheduleShowOps
            let synDate = this.synchronizeDate
            let synHalls = this.checkedHalls2
            console.log('syn date : ', synDate)
            console.log('syn halls : ', synHalls)
            if (synDate === '') {
                this.$message({
                    message: '请选择日期',
                    type: 'warning'
                })
                return
            }
            if (synHalls.length === 0) {
                this.$message({
                    message: '请选择影厅',
                    type: 'warning'
                })
                return
            }
            this.startLoad()
            // 接口参数
            options.params = {
                act: 'synShow',
                syncDate: synDate,
                hallIdArr: JSON.stringify(synHalls)
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('同步排期 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.closeLoad()
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    this.$message({
                        message: res.data.data,
                        type: 'success'
                    })
                    this.closeBlockUI()
                    this.closeLoad(true)
                    this.resetFunc()
                }
            }).catch(error => {
                this.closeLoad()
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 点击排期块
        handleClickSchBlock(evt) {
            let target = evt.target.dataset
            let scheduleItems = this.scheduleItems
            let pid = target.pid
            let cid = target.cid
            let hallId = target.hallid
            let hallName = target.hallname
            let filmName = target.name
            let sdtime = target.sdtime
            let etime = target.etime
            let isSelected = scheduleItems[pid].show[cid].isSelected
            let showId = target.id
            let showState = target.showstate
            console.log('parent index : ', pid)
            console.log('children index : ', cid)
            console.log('hall id : ', hallId)
            console.log('hall name : ', hallName)
            console.log('film name : ', filmName)
            console.log('show id : ', showId)
            console.log('show state : ', showState)
            console.log('start date-time : ', sdtime)
            console.log('end date-time : ', etime)
            // Vue数据驱动
            for (let i = 0, len = scheduleItems.length; i < len; i++) {
                let tempShow = scheduleItems[i].show
                let tempShowLen = tempShow.length
                // 将所有排期全部置为false
                for (let j = 0; j < tempShowLen; j++) {
                    scheduleItems[i].show[j].isSelected = false
                }
            }
            scheduleItems[pid].show[cid].isSelected = !isSelected
            console.log('排期块是否选中 : ' + scheduleItems[pid].show[cid].isSelected)
            if (scheduleItems[pid].show[cid].isSelected) {
                this.$message('已选中排期，可进行编辑')
                this.operFlag.isEdit = true
                this.operFlag.hallId = hallId
                this.operFlag.hallName = hallName
                this.operFlag.datetime = sdtime
                this.operFlag.endtime = etime
                this.schBlockData.showId = showId
                this.schBlockData.showState = showState
                this.playSchInfo.showId = showId
                this.playSchInfo.hallName = hallName + '厅'
                this.playSchInfo.filmName = filmName
                this.playSchInfo.stime = sdtime.split(' ')[1]
            } else {
                // 重置
                this.operFlag.isEdit = false
                this.schBlockData.showId = null
                this.schBlockData.showState = null
            }
            // 显示排期详情
            this.doScheduleDetail()
        },
        // 鼠标进入排期块(显示)
        hanldeMouseEnter(evt) {
            let pid = evt.target.dataset.pid
            let cid = evt.target.dataset.cid
            this.scheduleItems[pid].show[cid].wholeName = true
        },
        // 鼠标离开排期块(隐藏)
        hanldeMouseleave(evt) {
            let pid = evt.target.dataset.pid
            let cid = evt.target.dataset.cid
            this.scheduleItems[pid].show[cid].wholeName = false
        },
        // 获取SPL列表
        getSplList() {
            let options = this.splListOps
            let searchArr = [{'splName': ''}]
            // 接口参数
            options.params = {
                act: 'listSpl',
                searchArr: JSON.stringify(searchArr),
                pageNum: '',
                pageCode: ''
            }
            this.$http.post(options.url, options.params).then(res => {
                console.log('获取SPL列表 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.$message.error(tools.handleSuccessStatusError(res))
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    let datas = res.data.data.spl || []
                    // let len = datas ? Object.keys(datas).length : 0
                    let duration = 0
                    let duration2 = 0
                    for (let i in datas) {
                        duration = datas[i].totalDuration * 1
                        // 时间单位转换(转为分钟)
                        if (duration < 60) duration2 = duration + '″'
                        if (duration === 60) duration2 = '1′'
                        if (duration > 60) {
                            // 1小时
                            if (duration === 3600) duration2 = '60′'
                            else {
                                if (duration % 60 === 0) duration2 = Math.floor(duration / 60) + '′'
                                else duration2 = Math.floor(duration / 60) + '′' + duration % 60 + '″'
                            }
                        }
                        datas[i].duration2 = duration2
                    }
                    this.splListItems = datas
                    this.splIsEdit = !this.operFlag.isEdit
                }
            }).catch(error => {
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 点击"选择SPL"按钮
        showSPLforInsert() {
            console.log('显示SPL列表')
            this.splIsEdit = false
        },
        // 点击SPL列表
        handleClickSPL(evt) {
            let dtst = evt.target.dataset
            let id = dtst.id
            let name = dtst.name
            console.log('id : ' + id)
            console.log('name : ' + name)
            this.splName = name
            this.splClickData.id = id
            this.splClickData.name = name
        },
        // 影厅基础信息
        getHallInfo() {
            let options = this.deviceOps
            options.params = {
                act: 'listHall',
                hallID: null
            }
            this.$http.post(options.url, options.params).then(res => {
                // console.log('影厅基础信息 ++++++++++++++++ : ', res)
                if (res.data.status === 'error') {
                    this.$message({
                        message: tools.handleSuccessStatusError(res),
                        type: 'warning'
                    })
                    return
                }
                if (res.status === 200 && res.data.status === 'ok') {
                    // console.log('影厅数据 : ', res)
                    let datas = res.data.data
                    let hallids = []
                    let checks = []
                    let selects = [{
                        value: 'all',
                        label: '所有厅'
                    }]
                    let selects2 = []
                    for (let i in datas) {
                        hallids.push(datas[i].hall_id)
                        checks.push({
                            value: datas[i].hall_id,
                            label: datas[i].hall_name + '厅'
                        })
                        selects.push({
                            value: datas[i].hall_id,
                            label: datas[i].hall_name + '厅'
                        })
                        selects2.push({
                            value: datas[i].hall_id,
                            label: datas[i].hall_name + '厅'
                        })
                    }
                    this.hallids = hallids
                    this.hallChecks = checks
                    this.hallChecks2 = checks
                    this.hallSelects = selects
                    this.hallSelects2 = selects2
                }
            }).catch(error => {
                this.$message.error(tools.handleFailStatusError(error))
            })
        },
        // 全部厅(复制排期)
        handleHallCheckAllChange(val) {
            this.checkedHalls = val ? this.hallids : []
            this.isIndeterminate = false
        },
        // 全部厅(同步排期)
        handleHallCheckAllChange2(val) {
            this.checkedHalls2 = val ? this.hallids : []
            this.isIndeterminate2 = false
        },
        // 监控影厅选择(复制排期)
        handleCheckedHallChange(value) {
            let checkedCount = value.length
            this.hallCheckAll = checkedCount === this.hallChecks.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.hallChecks.length
        },
        // 监控影厅选择(同步排期)
        handleCheckedHallChange2(value) {
            let checkedCount = value.length
            this.hallCheckAll2 = checkedCount === this.hallChecks2.length
            this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.hallChecks2.length
        },
        // 影厅选择 - 编辑/新增排期
        handleEditHallChange(val) {
            console.log('val : ', val)
            this.editHallName = val + '厅'
        },
        // 加载编辑数据项
        loadEditData() {
            console.log('---------------------- 加载编辑数据项 ----------------------')
            let operData = this.operFlag
            console.log('operData : ', operData)
            if (operData.isEdit) { // 编辑
                this.editLayerTitle = '编辑排期'
                this.editHallName = operData.hallName + '厅'
                this.editHall = operData.hallId
                this.editSchStartDate = operData.datetime
            } else { // 新增
                this.editLayerTitle = '新增排期'
                this.editHallName = '请选择厅'
                this.editHall = ''
                this.editSchStartDate = ''
                this.defaultTimeS = '10:00:00'
            }
        },
        // 重置数据
        resetFunc(param) {
            this.importDate = ''
            this.distributeDate = ''
            this.copyFromDate = ''
            this.copyFromHall = ''
            this.copyToDate = ''
            this.checkedHalls = []
            this.hallCheckAll = false
            this.isIndeterminate = true
            this.editLayerTitle = ''
            this.editHallName = '请选择厅'
            this.editHall = ''
            this.editSchStartDate = ''
            this.splName = ''
            this.splNameKeyWord = ''
            this.synchronizeDate = ''
            this.hallCheckAll2 = false
            this.isIndeterminate2 = true
            this.checkedHalls2 = []
            if (param && param === 'update') {
                // 重置
                this.operFlag.isEdit = false
                // 点击排期块数据
                this.schBlockData.showId = null
                this.schBlockData.showState = null
            }
            // spl列表点击数据
            this.splClickData.id = null
            this.splClickData.name = null
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../static/css/waitmanage.css';
.posit{
    position: relative;
}
.btn-inline{
    display: inline-block;
}
.pdrt-8{
    padding-right: 8%;
}
.pdrt-3{
    padding-right: 3%;
}
.hall-list-bar{
    height: 70px;
    width: 88%;
}
.hall-check{
    margin-left: 0!important;
    width: 15%;
    padding-left: 5%;
    color: #fff;
    font-size: 14px;
    line-height: 35px;
}
.list05 li{
    width: 85%;
}
.wait01{
    padding: 15px 10px 10px 2.5%;
}
.date-picker{
    height: 20px;
    width: 22px;
    display: block;
    overflow: hidden;
    position: relative;
    z-index: 2;
    opacity: 0;
}
.date-picker-img{
    position: absolute;
    top: 0;
    z-index: 1;
}
.date-picker-ipt{
    width: 160px;
    height: 32px;
    position: absolute;
    top: 0;
}
.backdrop{
    // display: none;
    z-index: -1;
    border: none;
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background-color: rgb(0, 0, 0);
    position: fixed;
    opacity: 0;
    transition: opacity .5s;
}
.backdrop-show{
    z-index: 1000;
    // display: block;
    opacity: .6;
}
.blk-edit-sch{
    // display: none;
    width:535px;
    z-index: -1;
    position: fixed;
    top: 10%;
    left: 50%;
    margin-left: -268px;
    opacity: 0;
    transition: opacity .5s;
}
.blk-edit-sch-show{
    z-index: 1001;
    // display: block;
    opacity: 1;
}
</style>
