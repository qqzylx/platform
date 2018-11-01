<template>
    <!-- 弹出框 -->
    <el-dialog class="box" :title="title" :visible="dialogVisible" :width="width" @close="closeClick">
        <template v-if="!$slots.body">
            <div class="delete-content">\{{content}}</div>
            <div v-if="subContent" class="delete-sub">\{{subContent}}</div>
        </template>
        <slot v-if="$slots.body" name="body"></slot>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelClick">\{{cancelStr}}</el-button>
                <el-button size="small" class="dialog-ok-btn" type="primary" @click="okClick">\{{okStr}}</el-button>
            </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "ByDialog",
        props: {
            width: {
                type: String,
                default: "30%"
            },
            okStr: {
                type: String,
                default: "确 定"
            },
            cancelStr: {
                type: String,
                default: "取 消"
            },
            title: {
                type: String,
                default: "删除"
            },
            visible: {
                type: Boolean,
                default: false
            },
            content: {
                type: String
            },
            subContent: {
                type: String
            }
        },
        computed: {
            dialogVisible: function () {
                return this.visible;
            }
        },
        methods: {
            okClick() {
                this.$emit("ok");
            },
            cancelClick() {
                this.$emit("cancel");
            },
            closeClick() {
                this.$emit("close");
            }
        }
    }
</script>

<style scoped>
    .dialog-footer{
        display: flex;
        justify-content: center;
        padding-bottom: 50px;
    }
    .delete-content {
        color: #272727;
        font-weight: bold;
        font-size: 18px;
        width: 100%;
        text-align: center;
    }
    .delete-sub {
        color: #272727;
        font-size: 14px;
        width: 100%;
        text-align: center;
        margin-top: 10px;
    }
    .dialog-ok-btn {
        margin-left: 50px;
    }
    >>>.el-dialog__header{
        height: 60px;
        padding:0 0 0 15px;
    }
    >>>.el-dialog__title{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: right;
        line-height: 60px;
    }
    >>>.el-dialog__headerbtn{
        font-size: 28px;
        line-height: 60px;
        top:0;
        right:15px;
    }
</style>
