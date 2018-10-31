import Vue from 'vue'
import Router from 'vue-router'
import * as Storage from "../utils/storage";
import pathMap from './map';
import {supportH5Storage, checkPermission} from './util';
import bus from "../components/common/bus";

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children: [
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {title: '系统首页'}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

let roleList = [];
bus.$on("user_role_list", function (list) {
    Storage.setUrlList(JSON.stringify(list));
    roleList = list;
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/403' || to.path === '/404') {
        next();
    } else {
        let pathToCheck = to.path;
        if (pathMap.hasOwnProperty(pathToCheck)) {
            pathToCheck = pathMap[pathToCheck];
        }
        if (roleList.length > 0) {
            checkPermission(roleList, pathToCheck) ? next() : next('/403');
        } else {
            if (supportH5Storage()) {
                if (Storage.getUrlList()) {
                    roleList = JSON.parse(Storage.getUrlList());
                } else {
                    next('/login');
                }
                if (!roleList || roleList.length === 0) {
                    next('/login');
                } else {
                    checkPermission(roleList, pathToCheck) ? next() : next('/403');
                }
            }  else {
                // TODO: request url list
                next();
            }
        }
    }
});

export default router;
