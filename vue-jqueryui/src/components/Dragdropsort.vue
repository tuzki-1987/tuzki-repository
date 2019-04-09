<template>
	<div class="page-container">
		<div class="content02">
			<!-- 广告计划列表 -->
			<div v-loading="adverListLoading" element-loading-background="rgba(0, 0, 0, 0.5)" class="contentB03 lf" id="adverListTbl" style="width:30%; margin-right:1%;">
                <h2 class="h03">广告计划列表</h2>
                <table cellpadding="0" cellspacing="0" class="table02">
                    <tr>
                        <th width="8%">
                            <el-checkbox v-model="adverListAll" @change="handleSltAll" />
                        </th>
                        <th width="50%">计划名称</th>
                        <th width="35%">创建时间</th>
                    </tr>
                    <tr v-for="item in adverListItems" :key="item.slice_id">
                        <td>
                            <el-checkbox v-model="item.isChecked" :data-id="item.slice_id" style="vertical-align: middle;"></el-checkbox>
                        </td>
                        <td class="td-over">
                            <div class="td-over" style="cursor: default;">{{item.slice_name}}</div>
                        </td>
                        <td>{{item.create_time}}</td>
                    </tr>
                </table>
                <el-pagination background layout="prev, pager, next" :page-size="pageNum" :total="adverListItemTotal" class="rt page-mg" @current-change="handleAdverPageChange"></el-pagination>
            </div>
			<!-- 广告计划编辑区 -->
			<div v-loading="adverEditLoading" element-loading-background="rgba(0, 0, 0, 0.5)" class="contentB03 lf" style="width:30%; margin-right:1%;">
                <h2 class="h03">广告计划编辑区</h2>
                <div class="box04 content_1" id="adverEditAreaDrag">
                    <!-- <tms-scroll> 开启滚动会导致拖拽删除失效 -->
                        <!-- 测试jquery.mCustomScrollbar.concat.min及原生滚动条: 同样对(右侧)拖拽有影响 -->
                        <!-- 建议并使用的方案: 限制可存放条数->最多不能超过15条 -->
                        <div v-for="(item, i) in cplInfoItems" :key="item.slice_sn" class="box_03 left-item" :data-idx="i+1" :data-spliceid="item.slice_id" :data-uuid="item.cpl_uuid">
                            <h2 class="h05">
                                <span class="h05-addms" :class="item.isActive ? 'h05-minus' : 'h05-add'" :data-idx="item.idx" :data-status="0"></span>
                                <span class="name00 name02">{{item.custom_name}}</span>
                                <span class="span01">
                                    <a href="javascript:;" class="a-img" :data-idx="item.idx" :data-pidx="i+1">
                                        <img src="../assets/images/icon14.png" alt="" :data-idx="item.idx"  :data-pidx="i+1"/>
                                    </a>
                                </span>
                                <ul v-show="item.isActive" class="list04 icon-list-ul">
                                    <li v-if="item.hallStr"><img src="../assets/images/icon12_05.png" alt="" /> 跟厅</li>
                                    <li v-if="item.followStr"><img src="../assets/images/icon12_07.png" alt="" /> 跟片</li>
                                    <li v-if="item.timesStr"><img src="../assets/images/icon12_06.png" alt="" /> 指定时间段</li>
                                </ul>
                            </h2>
                        </div>
                    <!-- </tms-scroll> -->
                </div>
                <div class="input03">
                    <a href="javascript:;" class="a_05" @click="recoverAdverEditArea"></a>
                    <a href="javascript:;" class="a_04" @click="saveAdverEditArea"></a>
                </div>
            </div>
			<!-- cpl&素材列表 -->
			<div v-loading="cplmatListLoading" element-loading-text="加载中......" element-loading-background="rgba(0, 0, 0, 0.5)" class="contentB03 lf" id="cplmatBox" style="width:38%;">
                <ul class="title04">
                    <li :class="{'hover02': cplmatType === 'cpl'}" @click="tabCPLMAT('cpl', 'load')">
                        <a href="javascript:;">CPL</a>
                    </li>
                </ul>
                <div class="search">
                    <div class="textB01 lf" v-if="cplmatType === 'cpl'">
                        <input type="text" v-model="keywords" placeholder="CPL名称" class="text02" key="cpl-name" />
                    </div>
                    <a href="javascript:;" :data-type="cplmatType">
                        <img src="../assets/images/bg16.png" alt="" />
                    </a>
                </div>
                <div class="cplmat-container" id="cplmatListTbl">
                    <ul class="cplmat-head" v-if="cplmatType === 'cpl'">
                        <li class="w45">影片名称</li>
                        <li class="w40 td-pd02">中文名称</li>
                        <li class="w15">时长</li>
                    </ul>
                    <ul class="cplmat-list" v-if="cplmatType === 'cpl'">
                        <li v-for="item in cplmatListItems" :key="item.cpl_uuid" :data-id="item.cpl_uuid" class="tr-cursor right-item">
                            <div class="w45 td-over" :title="item.title">{{item.title}}</div>
                            <div class="w40 td-over td-pd01" :title="item.custom_name">{{item.custom_name}}</div>
                            <div class="w15 td-over">{{item.duration2}}</div>
                        </li>
                    </ul>
                </div>
                <el-pagination background layout="prev, pager, next" :page-size="pageNum" :total="cplmatListItemTotal" class="rt" @current-change="handleCplmatPageChange"></el-pagination>
            </div>
			<div class="clear"></div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery'
require('webpack-jquery-ui')
require('webpack-jquery-ui/css')
import adverListData from '../assets/resource/adverList.json'
import cplListData from '../assets/resource/cplList.json'
export default {
	name: 'Dragdropsort',
	data() {
		return {
			loadOps: {
                lock: true,
                background: 'rgba(0, 0, 0, .5)'
            },
            pageCode: 1, // 当前页号
            pageCode2: 1, // 当前页号
            pageNum: 13, // 当前页显示的数据条数
            adverListLoading: false, // 控制加载动画-广告计划列表
            adverListItemTotal: 0, // 广告计划列表总数
            adverListItems: null,
            adverListAll: false,
            cplmatType: 'cpl',
            keywords: '',
            cplmatListLoading: false, // 控制加载动画-cpl&素材列表
            cplmatListItems: null, // cpl&素材列表
            cplmatListItemTotal: 0,
            adverEditLoading: false, // 广告计划编辑区-控制加载动画
            cplInfoItems: null, // 编辑区列表数据
            // 新建/编辑广告计划数据(显示(默认/切换)时需初始化; 拖拽(新增/删除)时需更改; 设置窗口-确认时需更改)
            updateAdverPlanData: null,
            curSetAdverIndex: null, // 当前设置的广告计划的索引序号
		}
	},
	mounted() {
		this.showAdverPlanList()
        this.tabCPLMAT('cpl')
	},
	methods: {
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
        // 广告计划列表
        showAdverPlanList() {
            this.startLoad()
            let res = adverListData
            console.log('广告计划列表 +++++++++++++++++++++++++++ : ', res)
            if (res.status === 'error') {
                this.closeLoad()
                // this.$message({
                //     message: tools.handleSuccessStatusError(res),
                //     type: 'warning'
                // })
                this.$message.error('error info')
                return
            }
            if (res.status === 'ok') {
                let datas = res.data || []
                console.log('datas >>>>>>>>>>>>>>>>>>> : ', datas)
                let len = datas.length
                let count = parseInt(res.recordTotal)
                for (let i = 0; i < len; i++) {
                    datas[i].isChecked = false
                }
                this.adverListItems = datas
                this.adverListItemTotal = count
                // 加载编辑区内容
                this.showAdverEditArea(0)
                // 监听编辑区拖拽
                this.handleAdverListDrop()
            }
            this.closeLoad(true)
        },
        // 广告计划列表 - 分页
        handleAdverPageChange(val) {
            this.pageCode = val
            this.showAdverPlanList()
        },
        // 广告计划列表 - 拖拽放置(删除编辑数据)
        handleAdverListDrop() {
            let _this = this
            // 在计划列表区域[移除]编辑数据
            $('#adverListTbl').droppable({
                accept: '.left-item',
                tolerance: 'intersect',
                drop: function(event, ui) {
                    // 当编辑数据放置在计划列表区域上, 达到tolerance条件时, 触发。需设置 accept
                    console.log('计划列表区域 +++ 放置后 ---------------------- 移除 编辑数据')
                    _this.handleUpdateAdverEditData()
                    _this.$message('记得点击下方的【保存】按钮')
                }
            })
        },
        // 广告计划列表 - 选中所有
        handleSltAll(val) {
            console.log('广告计划列表 - 选中所有 : ', val)
            let isAll = val
            let datas = this.adverListItems
            let len = datas.length
            if (isAll) {
                for (let i = 0; i < len; i++) {
                    datas[i].isChecked = true
                }
            } else {
                for (let i = 0; i < len; i++) {
                    datas[i].isChecked = false
                }
            }
            this.adverListItems = datas
        },
        // CPL和素材 - 选项卡
        tabCPLMAT(tab) {
            let load = arguments[1]
            this.cplmatType = tab
            this.pageCode2 = 1
            this.keywords = ''
            this.cplmatListItems = null
            this.cplmatListItemTotal = 0
            if (load && load === 'load') this.cplmatListLoading = true
            this.showCPLMATlist(tab, load)
        },
        // CPL和素材列表
        showCPLMATlist(tab) {
            let args = arguments
            let res = cplListData
            console.log('CPL和素材列表 +++++++++++++++++++++++++++ : ', res)
            if (res.data.status === 'error') {
                if (args.length === 2 && args[1] === 'load') this.cplmatListLoading = false
                // this.$message({
                //     message: tools.handleSuccessStatusError(res),
                //     type: 'warning'
                // })
                this.$message.error('error info')
                return
            }
            if (res.status === 'ok') {
                let datas = res.data || []
                let len = datas.length
                let count = parseInt(res.recordTotal)
                let duration = 0
                let duration2 = 0
                for (let i = 0; i < len; i++) {
                    duration = datas[i].duration * 1
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
                this.cplmatListItems = datas
                this.cplmatListItemTotal = count
                // 开启拖拽
                this.handleRightDrag()
            }
            if (args.length === 2 && args[1] === 'load') this.cplmatListLoading = false
        },
        // CPL和素材列表 - 分页
        handleCplmatPageChange(val) {
            this.cplmatListLoading = true
            let tab = this.cplmatType
            this.pageCode2 = val
            this.showCPLMATlist(tab, 'load')
        },
        // CPL/素材区 - 拖拽
        handleRightDrag() {
            let _this = this
            // 一定要延迟, 否则jqueryUI-widgets不会工作
            setTimeout(function() {
                // 开启拖拽
                $('.right-item').draggable({
                    appendTo: '#adverEditAreaDrag',
                    cursor: 'move',
                    helper: 'clone',
                    opacity: 0.8,
                    revert: 'invalid',
                    start(event, ui) {
                        console.log('+++++++++++++++++++ CPL/素材区 拖拽 +++++++++++++++++++')
                        // console.log(ui)
                        let tab = _this.cplmatType
                        // 设置helper样式
                        ui.helper[0].style.background = '#000422'
                        ui.helper[0].style.border = '1px solid #9193a7'
                        ui.helper[0].style.color = '#fff'
                        ui.helper[0].style.width = '360px'
                        ui.helper[0].style.height = '30px'
                        ui.helper[0].style.lineHeight = '30px'
                        if (tab === 'cpl') {
                            // 设置内部子节点样式
                            ui.helper[0].children[0].style.display = 'inline-block'
                            ui.helper[0].children[1].style.display = 'inline-block'
                            ui.helper[0].children[2].style.display = 'inline-block'
                            ui.helper[0].children[0].style.width = '156px'
                            ui.helper[0].children[0].style.whiteSpace = 'nowrap'
                            ui.helper[0].children[0].style.overflow = 'hidden'
                            ui.helper[0].children[0].style.textOverflow = 'ellipsis'
                            ui.helper[0].children[1].style.width = '135px'
                            ui.helper[0].children[1].style.whiteSpace = 'nowrap'
                            ui.helper[0].children[1].style.overflow = 'hidden'
                            ui.helper[0].children[1].style.textOverflow = 'ellipsis'
                            ui.helper[0].children[2].style.width = '48px'
                            ui.helper[0].children[2].style.whiteSpace = 'nowrap'
                            ui.helper[0].children[2].style.overflow = 'hidden'
                            ui.helper[0].children[2].style.textOverflow = 'ellipsis'
                        }
                        if (tab === 'mat') {
                            console.log('设置素材helper')
                            // 设置内部子节点样式
                            ui.helper[0].children[0].style.display = 'inline-block'
                            ui.helper[0].children[1].style.display = 'inline-block'
                            ui.helper[0].children[0].style.width = '301px'
                            ui.helper[0].children[0].style.whiteSpace = 'nowrap'
                            ui.helper[0].children[0].style.overflow = 'hidden'
                            ui.helper[0].children[0].style.textOverflow = 'ellipsis'
                            ui.helper[0].children[1].style.width = '48px'
                            ui.helper[0].children[1].style.whiteSpace = 'nowrap'
                            ui.helper[0].children[1].style.overflow = 'hidden'
                            ui.helper[0].children[1].style.textOverflow = 'ellipsis'
                        }
                    }
                })
                // 在CPL/素材区域[移除]编辑数据
                $('#cplmatBox').droppable({
                    accept: '.left-item',
                    tolerance: 'intersect',
                    drop(event, ui) {
                        // 当编辑数据放置在CPL/素材区域上, 达到tolerance条件时, 触发
                        console.log('CPL/素材区域 +++ 放置后 ---------------------- 移除 编辑数据')
                        _this.handleUpdateAdverEditData()
                        _this.$message('记得点击下方的【保存】按钮')
                    }
                })
            }, 100)
        },
        // 监控拖拽放置/移除时的编辑数据更新
        handleUpdateAdverEditData(datas, oper) {
            console.log('监控拖拽放置/移除时的编辑数据更新')
            if (oper === 'new') {
                if (arguments.length !== 2 || (typeof datas !== 'object')) {
                    throw new Error('参数或类型错误')
                }
                // 预先更新顺序号
                for (let i in this.updateAdverPlanData) {
                    this.updateAdverPlanData[i].splice(1, 1, (i * 1 + 2))
                }
                this.updateAdverPlanData.splice(0, 0, datas) // 插入到数据列首
                console.log('update adver plandata ++++++ NEW : ', this.updateAdverPlanData)
            } else {
                let idx = this.curSetAdverIndex - 1
                console.log('idx : ', idx)
                this.cplInfoItems.splice(idx, 1) // 删除列表项(注意是否有对象间直接引用)
                this.updateAdverPlanData.splice(idx, 1) // 删除指定数据
                // 更新顺序号
                for (let i in this.updateAdverPlanData) {
                    this.updateAdverPlanData[i].splice(1, 1, (i * 1 + 1))
                }
                console.log('cplInfoItems ++++++ DEL : ', this.cplInfoItems)
                console.log('update adver plandata ++++++ del : ', this.updateAdverPlanData)
            }
            // console.log('here &&&&&&&&&&&&&&&&&&&&&& : ', this.adverListItems)
        },
        // 广告计划编辑区 - 数据列表
        showAdverEditArea(idx) {
            let datas = this.adverListItems
            let cplInfo = datas ? datas[idx].cplInfo : null
            let newLen = 0
            let strategyInfo
            
            this.updateAdverPlanData = [] // 初始化编辑区数据
            if (cplInfo) {
                // console.log('cplInfo.length --------------- : ', cplInfo.length)
                let newCplInfo = [] // cplInfo副本
                for (let i = 0, len = cplInfo.length; i < len; i++) {
                    let hallStr = false
                    let timesStr = false
                    let followStr = false
                    let tempData = []
                    let tempSetData = []
                    newLen = this.updateAdverPlanData.length
                    strategyInfo = cplInfo[i].strategyInfo ? cplInfo[i].strategyInfo : null
                    if (strategyInfo) {
                        if (strategyInfo.hall_id_str) {
                            hallStr = true
                            tempSetData.splice(1, 0, strategyInfo.hall_id_str)
                        } else {
                            tempSetData.splice(1, 0, null)
                        }
                        if (strategyInfo.con_uuid_str) {
                            followStr = true
                            tempSetData.splice(2, 0, strategyInfo.con_uuid_str)
                        } else {
                            tempSetData.splice(2, 0, null)
                        }
                        if (strategyInfo.time_period) {
                            timesStr = true
                            tempSetData.splice(0, 0, strategyInfo.time_period)
                        } else {
                            tempSetData.splice(0, 0, null)
                        }
                    }
                    cplInfo[i].hallStr = hallStr
                    cplInfo[i].followStr = followStr
                    cplInfo[i].timesStr = timesStr
                    cplInfo[i].isActive = false
                    cplInfo[i].idx = i // 记录源数据的索引号
                    newCplInfo[i] = cplInfo[i] // 避免直接使用cplInfo: 对象间直接引用, 由于其他操作, 导致(原始)数据篡改
                    // 初始化编辑时保存所需的数据
                    tempData.splice(0, 0, newCplInfo[i].cpl_uuid) // 广告的UUID
                    tempData.splice(1, 0, (i + 1)) // 广告的顺序号(初始为遍历顺序+1。拖拽时更新)
                    tempData.splice(2, 0, tempSetData) // 广告的设置数据
                    this.updateAdverPlanData.splice(newLen, 0, tempData) // 初始保存所有
                }
                console.log('----------------------- 编辑区数据 --------------------------')
                console.log(this.updateAdverPlanData)
                this.cplInfoItems = newCplInfo
            }
            // 开启拖拽
            this.handleLeftDrag()
        },
        // 广告计划编辑区 - 拖拽
        handleLeftDrag() {
            let _this = this
            setTimeout(function() {
                // 开启排序
                $('#adverEditAreaDrag').sortable({
                    items: '> div',
                    helper: 'clone',
                    opacity: 0.8,
                    revert: true,
                    start(event, ui) {
                        console.log('+++++++++++++++++++++ 排序开始 +++++++++++++++++++++')
                        // console.log(ui)
                        let idx = ui.item[0].dataset.idx * 1
                        console.log('当前拖动的是 : ' + idx)
                        ui.helper[0].children[0].style.background = '#232956' // 设置helper样式
                        ui.placeholder[0].style.height = '40px' // 设置占位符高度
                        _this.curSetAdverIndex = idx // 当前拖动的item的索引
                    },
                    stop(event, ui) {
                        console.log('+++++++++++++++++++++ 排序停止 +++++++++++++++++++++')
                        // console.log(ui);
                        ui.item[0].children[0].style.background = 'none'
                        _this.curSetAdverIndex = null
                    },
                    sort(event, ui) {
                        console.log('start sort')
                    }
                })
                // 在编辑区上[放置]CPL/素材
                $('#adverEditAreaDrag').droppable({
                    accept: '.right-item',
                    activeClass: 'drag-active',
                    tolerance: 'intersect',
                    drop(event, ui) {
                        // 当CPL/素材被放置在编辑区上, 达到tolerance条件时, 触发
                        console.log('+++++++++++++++++++ 放置 CPL/素材，已有数据长度 : ', _this.cplInfoItems.length)
                        // console.log(ui)
                        if (_this.cplInfoItems.length === 15) {
                            _this.$message({
                                message: '可编辑数据已达上限，最多15条',
                                type: 'warning'
                            })
                            return
                        }
                        let tab = _this.cplmatType
                        let adveruuid = ui.helper[0].dataset.id
                        let name = tab === 'cpl' ? ui.helper[0].children[1].innerText : ui.helper[0].children[0].innerText
                        let cplInfoItem = {}
                        console.log('tab : ' + tab)
                        console.log('adver uuid : ' + adveruuid)
                        console.log('custom_name : ' + name)
                        // 构造新数据
                        cplInfoItem.slice_sn = '1'
                        cplInfoItem.cpl_uuid = ''
                        cplInfoItem.custom_name = name
                        cplInfoItem.hallStr = false
                        cplInfoItem.followStr = false
                        cplInfoItem.timesStr = false
                        cplInfoItem.isActive = false
                        cplInfoItem.idx = -1 // 将新数据的索引号设为-1
                        // 预先更新slice_sn
                        for (let s in _this.cplInfoItems) {
                            let sliceid = _this.cplInfoItems[s].slice_sn * 1
                            _this.cplInfoItems[s].slice_sn = sliceid + 1 + ''
                        }
                        _this.cplInfoItems.unshift(cplInfoItem) // 更新数据:将数据插到开头
                        console.log('cplInfoItem : ', cplInfoItem)
                        console.log('cplInfoItems : ', _this.cplInfoItems)
                        // 更新新数据
                        _this.handleUpdateAdverEditData([adveruuid, 1, null], 'new')
                        _this.$message('记得点击下方的【保存】按钮')
                    },
                    out(event, ui) {
                        console.log('out ---------------------- from 编辑区')
                    }
                })
            }, 100)
        },
        // 广告计划编辑区 - 保存
        saveAdverEditArea() {
            console.log(this.updateAdverPlanData)
            this.$message({
                message: '保存成功',
                type: 'success'
            })
        },
        // 广告计划编辑区 - 恢复
        recoverAdverEditArea() {
            console.log('recover adver-edit-data')
            let planLists = this.adverListItems
            let idx = 0
            let cplInfo = planLists ? planLists[idx].cplInfo : null
            console.log('cur index : ' + idx)
            // 非新建
            this.showAdverEditArea(idx)
            console.log('++++++++++++++++++++++++++ 恢复之后 ++++++++++++++++++++++++++')
            console.log(this.updateAdverPlanData)
            this.$message({
                message: '已恢复',
                type: 'success'
            })
        },
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/css/content2.css';
.el-table::before{
    background-color: transparent;
}
.posit{
    position: relative;
}
.rt{
    text-align: center;
}
.mgb0{
    margin-bottom: 0;
}
.page-mg{
    margin: 10px auto;
}
.time-select{
    width: 120px!important;
}
.time-picker{
    background-color: #151935;
    border: 1px solid #3f476b;
}
.hall-check{
    margin-left: 0!important;
    width: 15%;
    padding-left: 5%;
    color: #fff;
    font-size: 14px;
    line-height: 35px;
}
.load-txt{
    text-align: center;
    color: #409EFF;
    clear: both;
    margin-top: 20px;
}
</style>
