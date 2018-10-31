import {log, error} from './log.js';
import * as msg from './message';
import ImageCompressor from 'image-compressor.js';
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function submitForm(formName, callback) {
    this.$refs[formName].validate((valid) => {
        if (valid) {
            callback();
        } else {
            console.log(`error submit ${formName}!`);
            return false;
        }
    });
}
function uploadImg(self,e,cb) {
    new ImageCompressor(e.file, {
        convertSize: 500000,
        maxWidth: 800,
        success(result) {
            const formData = new FormData();
            formData.append('updateFile', result, result.name);
            self.$api.post(self.$urls.uploadImg, formData, {
                headers: {
                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryZzNqBadsfadsfxWLV"
                },
                notLoading:true
            }).then((res) => {
                cb(res)
            });
        },
        error(e) {
            console.log(e);
        },
    });
}

export default function install(Vue, options) {
    Vue.prototype.isArray = isArray;
    Vue.prototype.deepCopy = deepCopy;
    Vue.prototype.log = log;
    Vue.prototype.error = error;
    Vue.prototype.msg = msg;
    Vue.prototype.submitForm = submitForm;
    Vue.prototype.uploadImg = uploadImg;
}
