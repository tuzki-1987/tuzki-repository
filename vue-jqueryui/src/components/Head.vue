<template>
    <div>
        <div class="head">
            <div class="time timediv lf">
                <p class="p01">{{time}}</p>
                <p>{{date}}</p>
                <p>{{day}}</p>
            </div>
            <div class="titlediv lf">
                <span>{{titleTxt}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import tools from '../utils/globalTools.js'
export default {
    name: 'Head',
    props: ['titleTxt'],
    data() {
        return {
            time: tools.getNowTime(),
            date: tools.getNowDate(),
            day: tools.getNowDay()
        }
    },
    created() {
        this.getTime()
    },
    methods: {
        // 实时刷新当前时间
        getTime() {
            let _this = this
            setInterval(function() {
                _this.time = tools.getNowTime()
                // 每天0点刷新日期和周
                if (_this.time.split(':')[0] === '00') {
                    _this.date = tools.getNowDate()
                    _this.day = tools.getNowDay()
                }
            }, 1000)
        }
    }
}
</script>
<style scoped>
.timediv{
    width: 30%;
}
.titlediv{
    width: 69%;
    text-align: center;
}
.titlediv span{
    font-size: 22px;
    color: #fff;
    line-height: 50px;
    letter-spacing: 2px;
}
</style>
