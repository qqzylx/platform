function success(self, msg) {
    self.$message.success(msg);
}

function error(self, err) {
    console.log(err);
    self.$message.error("内部错误！");
}

function responseError(self, response) {
    if (response && response.hasOwnProperty("success")) {
        if (response.success === 2000 || response.success === 6000) {
            self.$message.error(response.msg);
            if (response.msg.indexOf('超时') > -1 && response.msg.indexOf('请重新登录') > -1) {
                self.$router.push("/login");
            }
        } else if (response.success === 3000 && response.msg && response.msg.length < 60) {
            self.$message.error(response.msg);
        } else {
            self.$message.error("内部错误！请联系开发人员！");
        }
    }
}

function errorMsg(self, msg) {
    self.$message.error(msg);
}

function info(self, msg) {
    self.$message(msg);
}

module.exports.success = success;
module.exports.error = error;
module.exports.responseError = responseError;
module.exports.errorMsg = errorMsg;
module.exports.info = info;
