const orgIdKey = "org_id";
const orgNameKey = "org_name";
const roleListKey = "user_role_list";

function setItem(key, val) {
    try {
        localStorage.setItem(key, val ? val : "");
    } catch (e) {
        localStorage.clear();
        localStorage.setItem(key, val);
    }
}

function getItem(key) {
    let val = localStorage.getItem(key);
    return val ? val : "";
}

function removeItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        setItem(key, "");
    }
}

function setOrgId(val) {
    setItem(orgIdKey, val);
}

function getOrgId() {
    return getItem(orgIdKey);
}

function removeOrgId() {
    removeItem(orgIdKey);
}

function getUrlList() {
    return getItem(roleListKey);
}

function setUrlList(val) {
    setItem(roleListKey, val);
}

function removeUrlList() {
    removeItem(roleListKey);
}

function getOrgName() {
    return getItem(orgNameKey);
}
function setOrgName(val) {
   setItem(orgNameKey, val);
}
function removeOrgName() {
    removeItem(orgNameKey);
}

module.exports = {
    setOrgId,
    getOrgId,
    removeOrgId,
    getUrlList,
    setUrlList,
    removeUrlList,
    getOrgName,
    setOrgName,
    removeOrgName,
};
