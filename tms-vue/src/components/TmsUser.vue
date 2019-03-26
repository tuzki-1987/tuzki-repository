<template>
    <div class="user">
    <div class="lf" id="help">
        <a href="javascript:;" class="a01" id="eleLogin" @click="showLogin">登录</a>
        <div id="loginBox" class="login_pop" style="display:none; width:440px; height:640px;">
            <p class="login_p rt">
                <a href="javascript:;" class="closeST" @click="hideLogin">
                    <img src="static/images/close03.png" alt="" />
                </a>
            </p>
            <h2 class="h12">TMS管理系统</h2>
            <div class="logoB"><a href="#">logo</a></div>
            <ul class="listB05">
                <li>
                    <input type="text" placeholder="Name" class="text_login" />
                    <img src="static/images/login01.png" alt="" />
                </li>
                <li>
                    <input type="password" placeholder="Password" class="text_login" />
                    <img src="static/images/login02.png" alt="" />
                </li>
            </ul>
            <div class="input03">
                <a href="javascript:;" class="login">登录</a>
            </div>
        </div>
        <!--<a href="#" class="a01">Ace king</a>
        <dl>
            <dd class="top"><a href="#">修改密码</a></dd>
            <dd class="bottom"><a href="#">退出</a></dd>
        </dl>-->
    </div>
    <ul class="iconList lf">
        <li><a href="javascript:;"><img src="static/images/icon01.png" title="未授权" /></a></li>
        <li><a href="javascript:;"><img src="static/images/icon02_h.png" title="放映" /></a></li>
        <li><a href="javascript:;"><img src="static/images/icon03.png" title="不可编辑" /></a></li>
        <li><a href="javascript:;"><img src="static/images/icon04.png" title="中文" /></a></li>
        <li><a href="javascript:;"><img src="static/images/icon05_h.png" title="报警" /></a></li>
    </ul>
</div>
</template>

<script>
import $ from 'jquery'
import '../../static/js/jquery.blockUI.js'
export default {
    name: 'TmsUser',
    data() {
        return {}
    },
    created() {
        console.log('tms-user')
    },
    methods: {
        // 显示登录框
        showLogin() {
            $.blockUI({ message: $('#loginBox') })
        },
        // 隐藏登录框
        hideLogin() {
            $.unblockUI()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
