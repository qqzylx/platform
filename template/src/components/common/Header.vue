<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <img class="logo-img" src="static/img/logo.png"/>
            <span id="platform">白药大健康 - {{ chineseName }}</span>
            <span id="pharmacy-name">{{pharmacyName}}</span>
        </div>
        <div class="header-right">
            <div id="right-top">
                <div class="right-item">{{dateStr}}</div>
                <div class="right-item margin-left">{{dayStr}}</div>
            </div>
            <div id="right-bottom">
                <div class="right-item">{{welcome}}</div>
                <div class="right-item margin-left pointer" @click="handleModifyPassword">修改密码</div>
                <div class="right-item margin-left pointer" @click="handleLogout">安全退出</div>
            </div>

            <by-dialog :visible="changePwdVisible" width="30%" title="修改密码"
                @cancel="handlePwdCancel" @close="handlePwdCancel" @ok="handlePwdOk">
                <el-form slot="body" ref="passwordForm" :rules="passwordRules" :model="passwordForm" label-position="left">
                    <el-form-item ref="oldPwd" prop="oldPwd" label="旧密码：">
                        <el-input class="password-input" type="password" v-model="passwordForm.oldPwd" placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item ref="newPwd" prop="newPwd" label="新密码：">
                        <el-input class="password-input" type="password" v-model="passwordForm.newPwd" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item ref="confirmPwd" prop="confirmPwd" label="确认密码：">
                        <el-input class="password-input" type="password" v-model="passwordForm.confirmPwd" placeholder="请再次输入新密码"></el-input>
                    </el-form-item>
                </el-form>
            </by-dialog>
        </div>
    </div>
</template>
<script>
    import bus from '../common/bus';
    import * as Storage from "../../utils/storage";
    import ByDialog from "./ByDialog";
    import * as Message from '@/utils/message';

    export default {
        components: {ByDialog},
        data() {
            return {
                changePwdVisible: false,
                passwordForm: {
                    oldPwd: "",
                    newPwd: "",
                    confirmPwd: ""
                },
                passwordRules: {
                    oldPwd: [
                        { required: true, message: "密码输入不能为空", trigger: "blur" }
                    ],
                    newPwd: [
                        { required: true, message: "密码输入不能为空", trigger: "blur" },
                        { validator: this.validatePassword, trigger: 'blur'}
                    ],
                    confirmPwd: [
                        { required: true, message: "密码输入不能为空", trigger: "blur" },
                        { validator: this.validatePassword, trigger: 'blur'},
                        { validator: this.validateSame, trigger: 'blur'}
                    ]
                },
                dateStr: "2018年7月12日 12:00:00",
                dayStr: "星期四",
                collapse: false,
                fullscreen: false,
                name: '',
                message: 2
            }
        },
        computed: {
            welcome() {
                let user = localStorage.getItem('by_username');
                return `欢迎${user}`;
            },
            username() {
                let username = localStorage.getItem('ms_username');
                return username ? username : this.name;
            },
            pharmacyName() {
                return `（${Storage.getOrgName()}）`;
            }
        },
        methods: {
            validatePassword(rule, value, callback) {
                if (value.length < 6 || value.length > 12) {
                    callback(new Error("密码长度必须在6-12位"));
                } else {
                    let reg1 = new RegExp(/^[0-9A-Za-z]+$/);
                    if (!reg1.test(value)) {
                        callback(new Error("密码只能包换字母和数字"));
                    } else {
                        callback();
                    }
                }
            },
            validateSame(rule, value, callback) {
                if (this.passwordForm.newPwd !== this.passwordForm.confirmPwd) {
                    callback(new Error("两次密码输入不一致"));
                } else {
                    callback();
                }
            },
            handlePwdCancel() {
                this.changePwdVisible = false;
                this.$refs.oldPwd && this.$refs.oldPwd.resetField();
                this.$refs.newPwd && this.$refs.newPwd.resetField();
                this.$refs.confirmPwd && this.$refs.confirmPwd.resetField();
            },
            handlePwdOk() {
                this.$refs['passwordForm'].validate((valid) => {
                    if (valid) {
                        this.changePwdRequest();
                    } else {
                        console.log(`error submit passwordForm!`);
                        return false;
                    }
                });
            },
            changePwdRequest() {
                let obj = {
                    oldPwd: this.passwordForm.oldPwd,
                    newPwd: this.passwordForm.newPwd,
                    confirmPwd: this.passwordForm.confirmPwd
                };
                this.$api.post(this.$urls.updatePwd, obj)
                    .then(() => {
                        Message.success(this, "恭喜您，密码修改成功！");
                        this.changePwdVisible = false;
                    });
            },
            getTime() {
                const date = new Date();  //创建对象
                const y = this.zeroFormatter(date.getFullYear());     //获取年份
                const m = this.zeroFormatter(date.getMonth() + 1);   //获取月份  返回0-11
                const d = this.zeroFormatter(date.getDate()); // 获取日
                const w = date.getDay();   //获取星期几  返回0-6   (0=星期天)
                this.dayStr = '星期' + '日一二三四五六'.charAt(w); //星期几
                const h = this.zeroFormatter(date.getHours());  //时
                const minute = this.zeroFormatter(date.getMinutes()); //分
                const s = this.zeroFormatter(date.getSeconds()); //秒
                this.dateStr = `${y}年${m}月${d}日 ${h}:${minute}:${s}`;
            },
            zeroFormatter(val) {
                return val < 10 ? '0' + val : val;
            },
            handleLogout() {
                localStorage.removeItem('ms_username');
                localStorage.removeItem('by_username');
                Storage.removeOrgId();
                Storage.removeOrgName();
                Storage.removeUrlList();
                this.$router.push('/login');
            },
            handleModifyPassword() {
                this.passwordForm = {
                    oldPwd: "",
                        newPwd: "",
                        confirmPwd: ""
                };
                this.changePwdVisible = true;
                this.$refs.oldPwd && this.$refs.oldPwd.resetField();
                this.$refs.newPwd && this.$refs.newPwd.resetField();
                this.$refs.confirmPwd && this.$refs.confirmPwd.resetField();
            },
            // 侧边栏折叠
            collapseChage() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            }
        },
        mounted() {
            if (document.body.clientWidth < 1500) {
                this.collapseChage();
            }
            setInterval(this.getTime, 1000);
        },
        beforeMount() {
            this.getTime();
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn {
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .logo-img {
        width: 40px;
        height: 45px;
    }
    #platform {
        margin-left: 10px;
        font-size: 20px;
    }
    #pharmacy-name {
        margin-left: 10px;
        font-size: 14px;
    }
    .header .logo {
        float: left;
        width: 250px;
        line-height: 70px;
    }

    .header-right {
        float: right;
        padding-right: 20px;
        font-size: 12px;
        color: #F4F4F4;
        height: 100%;
    }

    #right-top {
        height: 40%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }

    #right-bottom {
        display: flex;
        height: 50%;
        align-items: flex-start;
        justify-content: flex-end;
        margin-top: 10px;
    }

    .pointer {
        cursor: pointer;
    }

    .right-item {
        display: flex;
        align-items: center;
    }

    .margin-left {
        margin-left: 12px;
    }

    .btn-bell .el-icon-bell {
        color: #fff;
    }

    .user-avator img {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .el-dropdown-link {
        color: #fff;
        cursor: pointer;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
