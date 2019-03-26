/**
* Component:user-model
* @description: 用户模块组件(原头部下方dom)
**/

define(["vue"], function(Vue) {
	// 声明子类, 用于注册组件
	var userModel = Vue.extend({
		data: function() {
			return {
				userProps: [{
					title: "未授权",
					url:"#",
					icon: "images/icon01.png"
				}, {
					title: "放映",
					url:"#",
					icon: "images/icon02_h.png"
				}, {
					title: "不可编辑",
					url:"#",
					icon: "images/icon03.png"
				}, {
					title: "中文",
					url:"#",
					icon: "images/icon04.png"
				}, {
					title: "报警",
					url:"#",
					icon: "images/icon05_h.png"
				}]
			}
		},
		props: ["name"],
		template: `<div>
						<div class="lf" id="help">
			                <!--<a href="#" class="a01">登录</a>-->
			                <a href="javascript:;" class="a01">{{name}}</a>
			                <dl>
			                    <dd class="top"><a href="#" @click="$emit(\'update-func\')">修改密码</a></dd>
			                    <!--<dd><a href="#">修改密码</a></dd>-->
			                    <dd class="bottom"><a href="#" onclick="logoutFunc()">退出</a></dd>
			                </dl>
			            </div>
			            <ul class="iconList lf">
			                <li v-for="prop in userProps" v-bind:key="prop.title">
			                	<a v-bind:href="prop.url" class="a-img">
			                		<img v-bind:src="prop.icon" v-bind:title="prop.title" />
			                	</a>
			                </li>
			            </ul>
			        </div>`
	});
	// 注册组件
	Vue.component("user-model", userModel);
	// 创建实例
	var userVM = new Vue({
		el: ".user",
		data: {
			name: "Ace king"
		},
		methods: {
			// 修改密码(组件内的自定义事件)
			updateFunc: function() {
				alert("ready update pwd...");
			}
		}
	})
});

// 退出
function logoutFunc() {
	alert("logou func")
}