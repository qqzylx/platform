const gulp = require("gulp");
const fs = require("fs");

function readFile(path) {
    console.log(`read file: ${path}...`);
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            resolve(fs.readFileSync(path).toString());
        } else {
            reject(new Error("File not exist"));
        }
    });
}

function extractData(content) {
    console.log("extract data...");
    return new Promise((resolve, reject) => {
        try {
            // 先去掉空格和换行
            content = content.replace(/(\r\n)|(\n)/g, "");
            // 匹配数组数据
            let reg = /([\[].+[\]])/;
            let mat = reg.exec(content);
            resolve(mat[0]);
        } catch (e) {
            reject(e);
        }
    });
}

function evalData(content) {
    return new Promise((resolve, reject) => {
        try {
            resolve(eval(content));
        } catch (e) {
            reject(e);
        }
    });
}

function generateByMenu() {
    let menuFile = "src/components/common/menu.js";
    readFile(menuFile)
        .then(extractData)
        .then(evalData)
        .then(d => {
            generateRoleManage(d);
            return d;
        })
        .then(d => d.forEach(item => {
            console.log("loop menu item...");
            generateFilesForItem(item);
        }))
        .then(() => {
            writePage();
            writeRouter();
        })
        .catch(console.error);
}

function generateFilesForItem(item) {
    generatePage(item);
    generateRouter(item);
}

const page_queue = [];
function generatePage(item) {
    console.log("generate page file list...");
    let path = getPagePath(item);
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    if (item.hasOwnProperty('subs') && item.subs.length > 0) {
        item.subs.forEach(sub => {
            let subFileName = getPageName(sub);
            let subFile = `${subFileName}.vue`;
            let subFull = `${path}/${subFile}`;
            if (!fs.existsSync(subFull)) {
                page_queue.push({
                    path: subFull,
                    name: subFileName
                });
            }
        });
    } else {
        let fileName = getPageName(item);
        let file = `${fileName}.vue`;
        let fullPath = `${path}/${file}`;
        if (!fs.existsSync(fullPath)) {
            page_queue.push({
                path: fullPath,
                name: fileName
            });
        }
    }
}
const router_queue = [];
function generateRouter(item) {
    console.log("generate router...");
    let path = getRouterPath(item);
    if (item.hasOwnProperty('subs') && item.subs.length > 0) {
        item.subs.forEach(sub => {
            let subFileName = getPageName(sub);
            let subFile = `${subFileName}.vue`;
            let subFull = `${path}/${subFile}`;
            router_queue.push({
                path: subFull,
                item: sub
            });
        });
    } else {
        let fileName = getPageName(item);
        let file = `${fileName}.vue`;
        let fullPath = `${path}/${file}`;
        router_queue.push({
            path: fullPath,
            item: item
        });
    }
}

const roleOutputPath = './role-output.txt';
function generateRoleManage(items) {
    console.log("write role manage option list...");
    let arr = items.map(d => {
        let tmp = {};
        tmp.label = d.title;
        tmp.funcId = 0;
        if (d.hasOwnProperty("subs") && d.subs.length > 0) {
            let children = [];
            d.subs.forEach(sub => {
               children.push({
                   label: sub.title,
                   funcId: 0
               })
            });
            tmp.children = children;
        }
        return tmp;
    });
    fs.writeFile(roleOutputPath, JSON.stringify(arr), (err) => {
        err && console.error(err);
    });
}

const routerPath = './src/router/index.js';
// sample should same with the item in router/index.js
const sample = "\n" +
    "                {\n" +
    "                    path: '/dashboard',\n" +
    "                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),\n" +
    "                    meta: {title: '系统首页'}\n" +
    "                },";
function writeRouter() {
    console.log("write router...");
    // generate the route string to add
    let str = router_queue.
        map(route => {
            return sample.replace("/dashboard", route.item.index)
                .replace("../components/page/Dashboard.vue", route.path)
                .replace("系统首页", route.item.title);
        })
        .join("");

    readFile(routerPath)
        .then(content => {
            let regStart = /children[:]\s*[\[]((\r\n)|(\n)|.)+[\]]/;
            let subContent = content.substr(content.search(regStart) + "children: [".length);
            let regEnd = /((\r\n)|(\n))\s*[\]]((\r\n)|(\n))(\s*)/;
            let endIdx = subContent.search(regEnd);
            let tmp = "";
            do {
                tmp = subContent.substr(0, endIdx);
                endIdx++;
            } while(tmp.substr(tmp.length - 1) === ']');

            return content.replace(tmp, str);
        })
        .then(d => {
            fs.writeFile(routerPath, d, (err) => {
                err && console.error(err);
            });
        })
        .catch(console.error);
}

function writePage() {
    console.log("write page...");
    let template = getPageTemplate();
    page_queue.forEach(page => {
        let content = template.replace(/fileName/g, page.name);
        fs.writeFile(page.path, content, (err) => {
            err && console.error(err);
        });
    });
}

const pageTemplatePath = './resource/PageTemplate.vue';
function getPageTemplate() {
    return fs.readFileSync(pageTemplatePath).toString();
}

const baseRouterPath = '../components/page';
function getRouterPath(item) {
    let folder = getFolderName(item);
    return [baseRouterPath, folder].join('/');
}

const basePagePath = './src/components/page';
function getPagePath(item) {
    let folder = getFolderName(item);
    return [basePagePath, folder].join('/');
}

let folderNameIdx = 1;
function getFolderName(item) {
    // icon名作为文件夹名
    try {
        let icon = item.icon;
        let start = icon.lastIndexOf("/");
        let end = icon.lastIndexOf(".");
        return icon.substr(start + 1, end - start - 1);
    } catch (e) {
        let name = `page${folderNameIdx}`;
        folderNameIdx++;
        return name;
    }
}

let fileNameIdx = 1;
function getPageName(item) {
    //  index 首字母大写/后面的内容作为文件名
    try {
        let index = item.index;
        let name = index.substr(1);
        name = name.slice(0, 1).toUpperCase() + name.substr(1);
        return name;
    } catch (e) {
        let name = `page${fileNameIdx}`;
        fileNameIdx++;
        return name;
    }
}

function clear() {
    if (fs.existsSync(roleOutputPath)) {
        fs.unlink(roleOutputPath, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("clear success");
            }
        });
    }
}

gulp.task("clear", clear);

gulp.task('default', generateByMenu);
