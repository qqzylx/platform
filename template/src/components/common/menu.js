/*
menu规则：
    1. 一级菜单，必须包含icon，index，title三个字段
    2. 二级菜单必须包含index，title
    3. index字段必须以 / 开头
* */
const menu = [
    {
        icon: 'static/img/home.png',
        index: '/dashboard',
        title: '系统首页'
    },
];

export default menu;
