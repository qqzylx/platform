const baseUrl = "/orgnization-api";

const urls = {
    login: `${baseUrl}/login/getUserInfo`,
    updatePwd: `${baseUrl}/platformUser/editPwd`,
};

export default {
    install: function(Vue, Option) {
        Object.defineProperty(Vue.prototype, "$urls", { value: urls });
    }
};
