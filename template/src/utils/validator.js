const Validator = {
    /*手机号字符串校验，返回true/false*/
    isPhone(str) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        return reg.test(str)
    },
    istelephone(str){
        const reg = /^0\d{2,3}-?\d{7,8}$/
        return reg.test(str)
    },
    /*获取elem手机规则校验器*/
    getPhoneValidator() {
        var validPhone = (rule, value, callback) => {
            if (!Validator.isPhone(value)) {
                callback(new Error('请输入正确的11位手机号码'))
            } else {
                callback()
            }
        }
        return validPhone
    },
    getPhoneOrTel(){
        var validPhoneOrTel = (rule, value, callback) => {
             if (value && value !=="" && !Validator.isPhone(value) && !Validator.istelephone(value)) {
                callback(new Error('请输入正确的手机号或固定电话'))
            } else {
                callback()
            }
        }
        return validPhoneOrTel
    },
    getIdCard() {
        var validIdCard=(rule, value, callback)=>{
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(!value){
                callback()
            }else if(!reg.test(value)){
                callback(new Error('身份证号不合规，请重新输入'))
            }else{
                callback()
            }
        }
        return validIdCard

    },
    getspecharsValidator() {
        var specharsValidator = (rule, value, callback) => {
            let regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
                regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if (regEn.test(value) || regCn.test(value)) {
                callback(new Error('只能输入汉字、字母、数字'))
            } else {

                callback()
            }
        }
        return specharsValidator
    },
    checkTextSpace(){
        var spaceValidator = (rule, value, callback) => {
            let reg = /(^\s+)|(\s+$)/g;
            if (reg.test(value)) {
                callback(new Error('输入内容包含空格，请重新输入!'))
            } else {

                callback()
            }
        }
        return spaceValidator
    }
}

// 对Validator的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
    install: function (Vue, Option) {
        Object.defineProperty(Vue.prototype, "$valid", {value: Validator});
    }
};
