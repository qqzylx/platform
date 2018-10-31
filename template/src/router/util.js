function supportH5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] != null;
    } catch(e) {
        return false;
    }
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function checkPermission(roleList, pathToCheck) {
    if (isArray(pathToCheck)) {
        let valid = false;
        for (let i = 0; i < pathToCheck.length; i++) {
            if (roleList.indexOf(pathToCheck[i]) > -1) {
                valid = true;
                break;
            }
        }
        return valid;
    } else {
        return roleList.indexOf(pathToCheck) > -1;
    }
}

module.exports.supportH5Storage = supportH5Storage;
module.exports.isArray = isArray;
module.exports.checkPermission = checkPermission;
