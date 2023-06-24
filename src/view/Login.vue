<template>
	<div class="login-view"  >
			<el-form :model="loginForm"  status-icon :rules="rules" ref="loginForm"
               label-width="80px" class="web-ruleForm" @keyup.enter.native="submitForm('loginForm')">
				<div class="login-brand">欢迎登陆</div>
				<el-form-item label="用户名" prop="userName">
					<el-input type="userName" v-model="loginForm.userName" placeholder="请输入用户名" autocomplete="off"></el-input>

				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="loginForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
          <el-button title="匿名登录～" class="anonymousLoginButton" @click="anonymousLogin()">
            <i class="class-anonymous-button-icon"></i>
            <b>匿名登录</b>
          </el-button>
				</el-form-item>

        <div style="line-height: 40px;">
          <span class="el-form-item__label">其他方式登录：</span>
          <a class="login-link" title="Gitee" @click="oauth2LoginHandler('GITEE')">
            <i class="operate-icon icon-gitee" />
          </a>
          <a class="login-link" title="Github" @click="oauth2LoginHandler('GITHUB')">
            <i class="operate-icon icon-github" />
          </a>

          <i class="register">
            <router-link to="/register">注册</router-link>
          </i>
        </div>

<!--				<div >-->
<!--					-->
<!--				</div>-->
			</el-form>
			
	</div>
</template>

<script>

import FingerprintJS from '@fingerprintjs/fingerprintjs'

	export default {
		name: "login",
		data() {
			var checkUsername = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('请输入用户名'));
				}
				callback();
			};
			var checkPassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				}
				callback();

			};
			return {
				loginForm: {
					userName: '',
					password: ''
				},
				rules: {
					userName: [{
						validator: checkUsername,
						trigger: 'blur'
					}],
					password: [{
						validator: checkPassword,
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
      anonymousLogin(){
        FingerprintJS.load().then(fp => {
              // The FingerprintJS agent is ready.
              // Get a visitor identifier when you'd like to.
              fp.get().then(result => {
                // This is the visitor identifier:
                const visitorId = result.visitorId;
                this.$http({
                  url: "/anonymousLogin",
                  method: 'post',
                  data: {
                    "anonymouId":visitorId
                  }
                }).then((data) => {
                      this.successLogin(data);
                    }).catch((err) => {
                  this.$message.error("服务异常!",err);
                });
              });
        });
      },
      oauth2LoginHandler(type){
        this.$http({
          url: "/connect/login/web/"+type,
          method: 'get',
        }).then((data) => {
          window.open(data,"_self");
        }).catch((err) => {
          this.$message.error("服务异常!",err);
        });
      },
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$http({
								url: "/login",
								method: 'post',
								data: this.loginForm
							})
							.then((data) => {
								this.successLogin(data);
							}).catch((err) => {
              this.$message.error("服务异常!",err);
            });

					}
				});
			},
      successLogin(data){
        // 保存密码到cookie(不安全)
        this.setCookie('username',this.loginForm.userName);
        // 保存token
        sessionStorage.setItem("accessToken",data.accessToken);
        sessionStorage.setItem("refreshToken",data.refreshToken);
        this.$store.commit("pullMessageList");
        this.$message.success("登陆成功");
        this.$router.push("/home/chat");
      },
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// 获取cookie、
			getCookie(name) {
				let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
				let arr = document.cookie.match(reg)
			    if (arr){
					 return unescape(arr[2]);
				}
			    return '';
			 },
			  // 设置cookie,增加到vue实例方便全局调用
			 setCookie (name, value, expiredays) {
			    var exdate = new Date();
			    exdate.setDate(exdate.getDate() + expiredays);
			    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
			  },
			  // 删除cookie
			  delCookie (name) {
			    var exp = new Date();
			    exp.setTime(exp.getTime() - 1);
			    var cval = this.getCookie(name);
			    if (cval != null){
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
				}
			  }
		},
		mounted() {
      var usernameCache = this.getCookie("username");
      if(usernameCache!=null & usernameCache.trim()!==''){
        this.loginForm.userName =usernameCache;
      }
		},
	}
</script>

<style scoped lang="scss">
	.login-view {

		position: relative;
		display: flex;
		justify-content: space-around;
		width: 100%;
		height: 100%;
    background-image: url(~@/assets/images/b3.jpg);
		background-size: cover;
		
		.web-ruleForm {
			height: 340px;
      width: 380px;
			padding: 20px;
			margin-top: 150px ;
			background: rgba(255,255,255,.75);
			box-shadow: 0px 0px  1px #ccc;
			border-radius: 5px;
			overflow: hidden;
	
			
			.login-brand {
				line-height: 50px;
				margin: 30px 0 40px 0;
				font-size: 22px;
				font-weight: 600;
				letter-spacing: 2px;
				text-transform: uppercase;
				text-align: center;
			}
			
			.register {
        position: relative;
        float: right;
        flex-direction: row-reverse;
        line-height: 40px;
			}
      .anonymousLoginButton{
        background-color: #eeeeee;
        color: #0eaefafa;
        vertical-align:middle;
        &:hover {
          background-color: #4a414ad9;
        }
      }
      .class-anonymous-button-icon{
        vertical-align:middle;
        display: inline-block;
        width: 15px;
        height: 15px;
        margin-right: 10px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url('~@/assets/icons/2.svg');
      }
		}
	}

  .operate-icon {
    display: inline-block;
    width: 28px;
    height: 28px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-right: 20px;
    vertical-align:middle;
    cursor:pointer;
  }
  .icon-github {
    background-image: url('~@/assets/icons/github.png');
  }
  .icon-gitee {
    background-image: url('~@/assets/icons/gitee.png');
  }
	
</style>
