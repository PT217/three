<template>
    <el-dialog title="提示" :visible.sync="visible" :width="width" :before-close="handleClose">

        <template slot="title">
            <el-tag type="success" size="mini" v-if="taskDetail.taskStatus == 1">已完成</el-tag>
            <el-tag type="danger" size="mini" v-else-if="taskDetail.taskStatus == 2">已超期</el-tag>
            <el-tag type="info" size="mini" v-else-if="taskDetail.taskStatus == -1">未下发</el-tag>
            <el-tag type="warning" size="mini" v-else>未完成</el-tag>
            &nbsp; {{ taskDetail.taskName }}
        </template>

        <el-form ref="readForm" :model="taskDetail" label-width="88px">
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="buildName" label="设施名称">
                        <el-input size="mini" :disabled="true" v-model="taskDetail.buildName">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="projectName" label="项目名称">
                        <el-input size="mini" :disabled="true" v-model="taskDetail.projectName">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop="taskMemberName" label="任务完成人">
                        <el-input size="mini" :disabled="true" v-model="taskDetail.taskMemberName">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="taskEndDate" label="任务时间">
                        <el-date-picker v-model="taskDetail.taskEndDate" type="date" size="mini" :disabled="true"
                            style="width:100%" placeholder="选择日期" align="left" format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop="taskPublishContent" size="mini" label="任务描述">
                        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8 }" :disabled="true"
                            placeholder="请输入任务内容，600字以内" v-model="taskDetail.taskPublishContent">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row>
            <el-col :span="12" :offset="2">
                <div v-for="(item, index) in taskDetail.taskPublishFileList">
                    <el-link type="primary" icon="el-icon-paperclip" @click="myDownload(item.url, item.name)">
                        {{ item.name }}
                    </el-link>
                </div>
            </el-col>
        </el-row>
        <br />
        <hr />
        <br />
        <el-row :gutter="20">
            <el-col :span="24">
                <div class="block">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in taskDetail.taskEventList" :key="index" color="#0bbd87">
                            <TaskFlowNode :showOhter="false">
                                <template slot="title">
                                    <div v-if="item.taskEventFlag == '1'">创建任务</div>
                                    <div v-else-if="item.taskEventFlag == '2'">转派任务</div>
                                    <div v-else-if="item.taskEventFlag == '3'">下发任务</div>
                                    <div v-else-if="item.taskEventFlag == '4'">完成任务</div>
                                    <div>操作人：{{ item.taskEventPublish }}</div>
                                    <div>操作时间：{{ item.taskEventDate }}</div>
                                </template>
                                <template slot="content">
                                    任务完成人：{{ item.taskEventMember }}
                                </template>
                            </TaskFlowNode>
                        </el-timeline-item>

                        <!-- 后端接口数据原因，完成任务需要单独回显 -->
                        <el-timeline-item color="#0bbd87" v-if="taskDetail.taskFinishContent?.length > 0">
                            <TaskFlowNode :showOhter="taskDetail.taskFinishFileList?.length > 0">
                                <template slot="title">
                                    <div> 任务完成情况</div>
                                    <div>操作人：{{ taskDetail.taskMemberName }}</div>
                                    <div>操作时间：{{ taskDetail.taskFinishDate }}</div>
                                </template>
                                <template slot="content">
                                    <span>任务完成情况：{{ taskDetail.taskFinishContent }}</span>
                                </template>
                                <template slot="ohter">
                                    <!-- 附件区域 -->
                                    <div v-for="(item, index) in taskDetail.taskFinishFileList">
                                        <el-link type="primary" icon="el-icon-paperclip"
                                            @click="myDownload(item.url, item.name)">
                                            {{ item.name }}
                                        </el-link>
                                    </div>
                                </template>
                            </TaskFlowNode>
                        </el-timeline-item>
                        <el-timeline-item color="#FA803F" v-else>
                            <span>任务完成情况</span>
                        </el-timeline-item>
                        <el-timeline-item :color="taskDetail.taskStatus == 1 ? '#0bbd87' : '#FA803F'">
                            <span>任务完成</span>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-col>
        </el-row>

        <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="visible = false">确 定</el-button>
        </span> -->
    </el-dialog>
</template>

<script>
import TaskFlowNode from "@/components/TaskFlowNode.vue"
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        width: {
            type: String / Number,
            default: '30%'
        },
        taskDetail: {
            type: Object,
            default: () => { }
        },
    },
    components: {
        TaskFlowNode,
    },
    data() {
        return {
        }
    },
    methods: {
        handleClose() {
            this.$emit('taskInfoClose', false)
        },
        /**
 * 文件下载方法
 */
        myDownload(url, name) {
            this.downLoadFile(url)
        },
        downLoadFile(url) {
            let fileName = url.slice(url.lastIndexOf('/') + 1); // 这里是通过从后端获取到的 url  地址中截出来原本的文件名
            fetch(url)
                .then((res) => res.blob())
                .then((blob) => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    // 下载文件的名称及文件类型后缀
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    //在资源下载完成后 清除 占用的缓存资源
                    window.URL.revokeObjectURL(link.href);
                    document.body.removeChild(link);
                });
        },
    },

}
</script>

<style lang="less" scoped>
.el-form-item {
    margin-bottom: 2px;
}
</style>
