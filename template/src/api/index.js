
import axios from "axios";
import qs from "qs";
import { Message, Loading } from "element-ui";
import router from "../router";

let loading;

const Axios = axios.create({
    baseURL: "/", // 因为我本地做了反向代理
    timeout: 10000,
    responseType: "json",
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
});

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
    config => {
        // 在发送请求之前做某件事
        if (config.method === "post") {
            if(!config.notLoading){
                loading = Loading.service({
                    lock: true,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
            }
            if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=utf-8') {
                // 序列化
                config.data = qs.stringify(config.data);
            }
        }
        return config;
    },
    error => {
        Message({
            //  饿了么的消息弹窗组件,类似toast
            showClose: true,
            message: error,
            type: "error.data.error.message"
        });
        return Promise.reject(error.data.error.message);
    }
);

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
    res => {
        loading && loading.close();
        //对响应数据做些事
        if (res.data && res.data.success !== 1000) {
            if (res.data.success === 2000) {
                Message({
                    //  饿了么的消息弹窗组件,类似toast
                    showClose: true,
                    message: res.data.msg,
                    type: "error"
                });
            } else if (res.data.success === 3000) {
                Message({
                    showClose: true,
                    message: "内部错误,请联系平台开发人员",
                    type: "error"
                });
            } else if (res.data.success === 6000) {
                if (res.data.msg.indexOf('请重新登录') > -1) {
                    Message({
                        showClose: true,
                        message: "登录状态过期，请重新登录",
                        type: "error"
                    });
                    router.push("/login");
                }
            }
            return Promise.reject(res.data);
        }
        return Promise.resolve(res.data);
    },
    error => {
        loading && loading.close();
        Message({
            showClose: true,
            message: "内部错误,请联系平台开发人员",
            type: "error"
        });

        return Promise.reject(error);
    }
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
    install: function(Vue, Option) {
        Object.defineProperty(Vue.prototype, "$api", { value: Axios });
    }
};
