<template>
    <div style="display: flex">
        <div class="sidebar">
            <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#27B9E8"
                     text-color="#ffffff" active-text-color="#20a0ff" unique-opened router>
                <template v-for="item in items">
                    <template v-if="item.subs">
                        <el-submenu :index="item.index" :key="item.index">
                            <template slot="title">
                                <img class="icon" :src="item.icon"/><span slot="title">\{{ item.title }}</span>
                            </template>
                            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                                \{{ subItem.title }}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.index" :key="item.index">
                            <img class="icon" :src="item.icon"/><span slot="title">\{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </div>
        <div id="version" :class="vCollapse ? 'version-collapse' : 'version-not-collapse'">{{ version }}</div>
    </div>
</template>

<script>
    import bus from '../common/bus';
    import * as Storage from "../../utils/storage";
    import fullMenu from './menu';

    function supportH5Storage() {
        try {
            return 'localStorage' in window && window['localStorage'] != null;
        } catch(e) {
            return false;
        }
    }

    let roleList = [];
    bus.$on('user_role_list', list => {
        roleList = list;
    });

    const defaultItems = [
        {
            icon: 'static/img/home.png',
            index: 'dashboard',
            title: '系统首页'
        }
    ];

    export default {
        data() {
            return {
                collapse: false,
                vCollapse: false,
                items: defaultItems
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                if(msg) {
                    setTimeout(() => {
                        this.vCollapse = msg;
                    }, 500);
                } else {
                    this.vCollapse = msg;
                }
            });
            try {
              // TODO: use below line to do permission control
              // this.items = this.getMenu();
              this.items = fullMenu;
            } catch (e) {
                // ignore, if exception catch, use default items to ensure page show
                console.log("build sidebar items error: ", e);
            }
        },
        methods: {
            getRoleList() {
                if (!roleList || roleList.length === 0) {
                    if (supportH5Storage()) {
                        roleList = JSON.parse(Storage.getUrlList());
                    } else {
                        //TODO: request to get url list
                    }
                }
            },
            loopRoleList(roleList) {
                let map = {};
                if (roleList) {
                    roleList.forEach(item => {
                        map[item] = "1";
                    });
                }
                return map;
            },
            filterMenu(menu, map) {
                for (let i = menu.length - 1; i >= 0; i--) {
                    let item = menu[i];
                    // 首先过滤子节点
                    if (item.hasOwnProperty('subs') && item.subs.length > 0) {
                        item.subs = this.filterArray(item.subs, map);
                    }
                    // 其次过滤第一级
                    if (map[item.index] !== '1') {
                        if (item.hasOwnProperty('subs')) {
                            if (item.subs.length === 0) {
                                menu.splice(i, 1);
                            }
                        } else {
                            menu.splice(i, 1);
                        }
                    }
                }
                return menu;
            },
            filterArray(arr, map) {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (map[arr[i].index] !== "1") {
                        arr.splice(i, 1);
                    }
                }
                return arr;
            },
            getMenu() {
                this.getRoleList();
                let map = this.loopRoleList(roleList);
                let m = JSON.parse(JSON.stringify(fullMenu));
                return this.filterMenu(m, map);
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        border-top:1px solid #ffffff;
        left: 0;
        top: 70px;
        bottom: 30px;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
    .icon {
        height: 22px;
        width: 22px;
        margin-right: 13px;
    }
    .version-collapse {
        width: 64px;
    }
    .version-not-collapse {
        width: 250px;
    }
    #version{
        border-right: solid 1px #e6e6e6;
        display: block;
        position: absolute;
        left: 0;
        bottom:0;
        color: #fff;
        font-size: 12px;
        height: 30px;
        text-align: center;
        background: #27B9E8;
    }
</style>
