<template>
    <div class="box" :style="`height:${height}px`">
        <div class="title">
            <slot name="title"></slot>
        </div>

        <div class="content">
            <slot name="content"></slot>
        </div>

        <Tab class="tabClass" :tableData="taskTabData" :showTitle="false" :pageShow="false" :headerList="taskHeaderList">
            <template slot="column">
                <el-table-column label="操作" width="90px" align="left">
                    <template slot-scope="scope">
                        <a @click="showDetail(scope.row)" class="readDetail" href="#">查看</a>
                    </template>
                </el-table-column>
            </template>
        </Tab>
    </div>
</template>

<script>
import { mixins } from "@/mixin/index";
export default {
    mixins: [mixins],
    props: {
        height: {
            type: Number,
            default: 50
        },
        taskTabData: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            taskHeaderList: {
                taskName: "任务名称",
                taskMemberName: "任务完成人",
                taskStatus: "任务状态"
            },
        }
    },
    methods: {
        requestFn() { },
        showDetail(row) {
            this.$emit('showThreeDayDetail', row)
        },
    },
}
</script>

<style lang="less" scoped>
.box {
    width: calc(30%);
    background: #FFFFFF;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #DDDDDD;
}

.title {
    padding-top: 14px;
    padding-bottom: 14px;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
}

.content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;
}

.tabClass {
    height: 120px;
    // margin-top: 20px;
}

.readDetail {
    color: #4466EE;

}
</style>