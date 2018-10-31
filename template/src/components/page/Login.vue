<template>
    <div class="login-box">
        <div class="login-top">
            <div style="display: flex; align-items: center;">
                <img class="login-log" src="static/img/login_logo.png"/>
                <div class="logo-content"></div>
            </div>
            <div class='login-title'>
                <div id="left-line"></div>
                <span id="title-content">白药大健康 - {{ chineseName }}</span>
                <div id="right-line"></div>
            </div>

        </div>
        <div class="login-bottom">
            <div class="form-title">
                <span>登录中心</span>
            </div>
            <div class="form-cntr market_out">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <el-form-item class="login-form" prop="username">
                        <el-input v-model="ruleForm.username" class="login_input" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item class="login-form" prop="password">
                        <el-input type="password" class="login_input" placeholder="请输入登录密码" v-model="ruleForm.password"
                                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import * as Storage from "../../utils/storage";
    import bus from "../common/bus";

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: "请输入用户名", trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: "请输入密码", trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.post(this.$urls.login, {
                            "loginName": this.ruleForm.username,
                            "password": this.ruleForm.password,
                            "platformType": "1"
                        }).then(res => {
                            localStorage.setItem('ms_username', this.ruleForm.username);
                            localStorage.setItem('by_username', res.userName);
                            Storage.setOrgId(res.orgId);
                            Storage.setOrgName(res.orgName);
                            let urlList = res.UserInfoList
                                .map(d => d.frontFuncUrl)
                                .filter(d => d !== "")
                                .filter((item, idx, arr) => {
                                    return idx === arr.indexOf(item);
                                });
                            bus.$emit("user_role_list", urlList);
                            this.$router.push('/');
                        });
                    } else {
                        console.log(`error submit ${formName}!`);
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-box{
        height: 100vh;
        background-image: url("../../assets/login_bg.jpg");
        background-size: cover;
    }
    input.el-input__inner {
        border: none;
    }
    .login-log {
        width: 57px;
        height: 64px;
        margin: 10px auto;
    }


    .login-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        font-size: 24px;
        color: #fff;
        margin-top: 50px;
    }

    .logo-content {
        font-size: 24px;
        color: #fff;
    }

    .form-title {
        margin-top: 49px;
        width: 450px;
        height: 70px;
        color: #ffffff;
        font-size: 22px;
        background: #0EA3D3;
        margin-left: auto;
        margin-right: auto;
        padding: 0px 30px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    .form-cntr {
        width: 450px;
        min-width: 450px;
        margin-left: auto;
        margin-right: auto;
        padding: 44px 30px;
        background: rgba(255,255,255,.85);
        box-sizing: border-box;

    }

    #title-content {
        min-width: 300px;
        width: 300px;
        text-align: center;
    }

    #left-line {
        background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: -o-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(rgba(255, 255, 255, 1)));
        margin-right: 56px;
        height: 1px;
        width: 40%;
    }

    #right-line {
        background: -webkit-linear-gradient(right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: linear-gradient(right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: -o-linear-gradient(right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        background: -webkit-gradient(linear, right top, left top, from(rgba(255, 255, 255, 0)), to(rgba(255, 255, 255, 1)));
        margin-left: 56px;
        height: 1px;
        width: 40%;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        margin-top: 24px;
        width: 100%;
        height: 48px;
        font-size: 20px;
        background-color: #27B9E8;
    }
</style>
