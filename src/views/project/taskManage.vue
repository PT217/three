<template>
  <div class="content">
    <Nav :nav="nav"></Nav>

    <div class="taskDataShow">
      <div class="top-title">
        <div class="title-icon"></div>&nbsp; <span>项目任务管理</span>
      </div>
      <div class="prjSelect">
        <el-select v-model="request.data.projectId" filterable placeholder="请选择项目" size="mini" @change="mainPrjChangeFn">
          <el-option v-for="item in prjDataArr" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            <el-tooltip effect="dark" :content="item.projectName" placement="bottom">
              <div class="option-content">{{ item.projectName }}</div>
            </el-tooltip>
          </el-option>
        </el-select>
      </div>

      <div class="task-data-body">
        <TaskDataShow :height="347" :taskTabData="threeDays[0].taskVOList"
          @showThreeDayDetail="(row) => addOrUpdateOrDelete('查看', row)">
          <template slot="title">
            <span>昨日任务情况</span>
            <span class="right-title-text">完成情况:
              <div class="circle-icon icon-color-overdue"></div>
              超期 &nbsp;&nbsp;
              <div class="circle-icon icon-color-finish"></div>
              完成
            </span>
          </template>
          <template slot="content">
            <div class="cr">
              <span>任务下达总数:{{ threeDays[0].taskTotalNum }}</span>
            </div>
            <div>
              <el-progress type="circle" :percentage="parseInt(yesterdayOverdueNum)" :width="163" :stroke-width="12"
                :color="circleColor.overdue" :format="(e) => overdueFn(e, 0)"></el-progress>
            </div>
            <div>
              <el-progress type="circle" :percentage="parseInt(yesterdayFinishNum)" :stroke-width="10"
                :color="circleColor.finish" :format="(e) => finishFn(e, 0)"></el-progress>
            </div>
          </template>
        </TaskDataShow>
        <TaskDataShow :height="347" :taskTabData="threeDays[1].taskVOList"
          @showThreeDayDetail="(row) => addOrUpdateOrDelete('查看', row)">
          <template slot="title">
            <span>今日任务情况</span>
            <span class="right-title-text">完成情况:
              <div class="circle-icon icon-color-finish"></div>
              完成 &nbsp;&nbsp;
              <div class="circle-icon icon-color-undone"></div>
              未完成
            </span>
          </template>
          <template slot="content">
            <div class="cr">
              <span>任务下达总数:{{ threeDays[1].taskTotalNum }}</span>
            </div>
            <div>
              <el-progress type="circle" :percentage="parseInt(toDayFinishNum)" :width="163" :stroke-width="12"
                :color="circleColor.finish" :format="(e) => finishFn(e, 1)"></el-progress>
            </div>
            <div>
              <el-progress type="circle" :percentage="parseInt(toDayUndoneNum)" :stroke-width="10"
                :color="circleColor.undone" :format="(e) => undoneFn(e, 1)"></el-progress>
            </div>
          </template>
        </TaskDataShow>
        <TaskDataShow :height="347" :taskTabData="threeDays[2].taskVOList"
          @showThreeDayDetail="(row) => addOrUpdateOrDelete('查看', row)">
          <template slot="title">
            <div style="height: 29px;">明日任务情况</div>
          </template>
          <template slot="content">
            <div style="height: 163px;">
              <div class="cr">
                <span>任务下达总数:{{ threeDays[2].taskTotalNum }}</span>
              </div>
            </div>
          </template>
        </TaskDataShow>
      </div>
    </div>





    <Tab class="customTab" :height="'220px'" :tableData="tableData" :showTitle="false" :leftSearch="true"
      :headerList="headerList" :request="request" @pageChange="pageChange" @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item label="">
            <el-input placeholder="请输入任务名称/任务完成人" v-model="request.data.queryParam" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="addBtn">
        <el-form inline>
          <el-form-item>
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="expand">
        <el-table-column label="序号" width="88px" align="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="500px" align="left">
          <template slot-scope="scope">
            <!-- 未完成的今日及以后 -->
            <el-button
              v-if="(scope.row.taskStatus == '未完成' || (scope.row.taskStatus == '已超期') || (scope.row.taskStatus == '未下发'))"
              size="mini" type="primary" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <!-- 创建后可查看 -->
            <el-button size="mini" type="primary" @click="addOrUpdateOrDelete('查看', scope.row)">查看</el-button>
            <!-- 创建后未下发   v-if="$store.state.account == '超级管理员'" -->
            <el-button v-if="(scope.row.taskStatus == '未下发') && (isLeader || isAdmin)" size="mini" type="primary"
              @click="addOrUpdateOrDelete('下发任务', scope.row)">下发任务</el-button>
            <!-- 任务状态开始后且完成前  v-if="$store.state.account == '超级管理员'"   -->
            <el-button
              v-if="!((scope.row.taskStatus == '未下发') || (scope.row.taskStatus == '已完成')) && (isLeader || isAdmin)"
              size="mini" type="primary" @click="addOrUpdateOrDelete('转派任务', scope.row)">转派任务</el-button>
            <!-- 任务所属人且任务开始后 -->
            <el-button v-if="(scope.row.taskStatus == '未完成') || (scope.row.taskStatus == '已超期')" size="mini"
              type="primary" @click="addOrUpdateOrDelete('完成任务', scope.row)">完成任务</el-button>
            <!-- 任务状态不在进行中即可 -->
            <el-button v-if="(scope.row.taskStatus == '未下发') || (scope.row.taskStatus == '已完成')" type="danger" size="mini"
              @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="pagination">
        <el-pagination background @current-change="pageChange" @size-change="limitChange" :current-page="request.page"
          :page-size="request.limit" :total="request.total" :page-sizes="[5, 10, 20, 30, 40, 50, 100, 150, 200]"
          layout="total,sizes,prev,pager,next"></el-pagination>
      </template>
    </Tab>

    <!-- 查看编辑转派完成模态框 -->
    <Dialog :visible="taskDetailVisible" @show="() => {
      resetFn();
      taskDetailVisible = !taskDetailVisible
    }" :showBtn="title != '查看'" :title="taskDetail.taskName" @submit="submit" width="65%">


      <el-form ref="readForm" :model="form" :rules="title == '编辑' ? readRules : {}" :inline-message="true"
        label-width="88px" class="readForm">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="buildId" label="设施名称">
              <el-select size="mini" :disabled="true" filterable v-model="form.buildId"
                @change="(value) => dialogSelectChangeFn(value, 'buildId')" placeholder="请选择设施">
                <el-option v-for="(item, index) in formSelectArr.ndpls" :key="item.buildId" :value="item.buildId"
                  :label="item.buildName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="projectId" label="项目名称">
              <el-select size="mini" :disabled="true" filterable v-model="form.projectId"
                @change="(value) => dialogSelectChangeFn(value, 'projectId')" placeholder="选择项目前请先选择设施">
                <el-option v-for="(item, index) in formSelectArr.projects" :key="item.projectId" :value="item.projectId"
                  :label="item.projectName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="taskMemberIdList" label="任务完成人">
              <el-select v-model="form.taskMemberIdList" size="mini" :disabled="true" multiple @change="change"
                placeholder="选择任务完成人前请先选择项目">
                <el-option v-for="(item, index) in formSelectArr.taskMembers" :key="item.staffId" :value="item.staffId"
                  :label="(item.staffName) + (item.phoneNum ? '  ' + item.phoneNum : '')"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="taskEndDate" label="任务时间">
              <el-date-picker v-model="form.taskEndDate" type="date" size="mini" :disabled="title != '编辑'"
                placeholder="选择日期" align="left" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width:100%"
                :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="taskPublishContent" label="任务描述">
              <el-input type="textarea" size="mini" :autosize="{ minRows: 5, maxRows: 8 }" :disabled="title != '编辑'"
                placeholder="请输入任务内容，1000字以内" v-model="form.taskPublishContent" show-word-limit :maxlength="1000">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="12" :offset="2">
          <div v-if="title == '查看' || title == '完成任务' || title == '转派任务'">
            <div v-for="(item, index) in form.taskPublishFileList">
              <el-link type="primary" icon="el-icon-paperclip" @click="myDownload(item.url, item.name)">
                {{ item.name }}
              </el-link>
            </div>
          </div>
          <div v-else>
            <el-upload ref="readUpload" size="mini" action="/file/dual" :limit="50"
              :http-request="(e) => uploadFile(e, 'read')" :on-remove="onRemoveFileFn" :before-upload="beforeUpload"
              :file-list="form.taskPublishFileList">
              <div slot="tip" class="el-upload__tip">上传相关附件
                <a href="#" @click.prevent="$refs.uploadBtn.click()">上传</a>
                {{ uploadText }}
              </div>
              <div slot="trigger" ref="uploadBtn" :v-show="false"></div>
            </el-upload>
          </div>
        </el-col>
      </el-row>
      <br />
      <hr />
      <br />
      <el-row :gutter="20" v-if="title != '完成任务'">
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
                    <!-- <span>处置时间：2021年6-27至2022-06-27</span> -->
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


                    <div class="complete">
                      <div class="task">任务完成情况：</div>
                      <div class="description">{{ taskDetail.taskFinishContent }}</div>
                    </div>

                  </template>
                  <template slot="ohter">
                    <!-- 附件区域 -->
                    <div v-for="(item, index) in taskDetail.taskFinishFileList">
                      <el-link type="primary" icon="el-icon-paperclip" @click="myDownload(item.url, item.name)">
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


      <el-row :gutter="20" v-if="title == '转派任务'">
        <el-col :span="12">
          <el-form inline>
            <el-form-item label="转派任务完成人">
              <el-select v-model="taskMemberIdList" multiple :multiple-limit="5" filterable placeholder="请选择任务完成人"
                size="mini">
                <el-option v-for="(item, index) in formSelectArr.taskMembers" :key="item.staffId" :value="item.staffId"
                  :label="(item.staffName) + (item.phoneNum ? '  ' + item.phoneNum : '')"
                  :disabled="item.staffId == banSelf"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <div v-if="title == '完成任务'">
        <el-form ref="finishForm" :model="finishForm" :rules="finishRules" label-position="top">
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-form-item prop="taskIssue " label="任务中遇到的问题">
                <el-input type="textarea" size="mini" :autosize="{ minRows: 5, maxRows: 8 }" maxlength="600"
                  show-word-limit placeholder="请输入任务里遇到的问题" v-model="finishForm.taskIssue">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :offset="0">
              <el-form-item prop="taskFinishContent" label="任务完成情况">
                <el-input type="textarea" size="mini" :autosize="{ minRows: 5, maxRows: 8 }" maxlength="600"
                  show-word-limit placeholder="请输入任务完成情况" v-model="finishForm.taskFinishContent">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-upload size="mini" ref="finishUpload" action="/file/dual" :limit="50"
          :http-request="(e) => uploadFile(e, 'finishFile')"
          :on-remove="(f, flist) => onRemoveFileFn(f, flist, 'finishFile')" :file-list="finishForm.taskFinishFileList"
          :before-upload="beforeUpload">
          <div slot="tip" class="el-upload__tip">上传相关附件
            <a href="#" @click.prevent="$refs.uploadBtn2.click()">上传</a>
            {{ uploadText }}
          </div>
          <div slot="trigger" ref="uploadBtn2" :v-show="false"></div>
        </el-upload>
      </div>
    </Dialog>

    <!-- 新增下发删除模态 -->
    <Dialog :title="title" :visible="visible" @submit="submit" @show="show">
      <div v-if="title == '删除'">确认删除该任务，删除后不可恢复!</div>
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="buildId" label="设施名称">
              <el-select size="small" :disabled="title == '下发任务'" filterable v-model="form.buildId"
                @change="(value) => dialogSelectChangeFn(value, 'buildId')" placeholder="请选择设施">
                <el-option v-for="(item, index) in formSelectArr.ndpls" :key="item.buildId" :value="item.buildId"
                  :label="item.buildName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="projectId" label="项目名称">
              <el-select size="small" :disabled="title == '下发任务'" filterable v-model="form.projectId"
                @change="(value) => dialogSelectChangeFn(value, 'projectId')" placeholder="选择项目前请先选择设施">
                <el-option v-for="(item, index) in formSelectArr.projects" :key="item.projectId" :value="item.projectId"
                  :label="item.projectName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="taskName" label="任务名称">
              <el-input size="small" v-model="form.taskName" show-word-limit maxlength="10"
                :disabled="title == '下发任务'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="taskEndDate" label="任务时间">
              <el-date-picker v-model="form.taskEndDate" type="date" placeholder="选择日期" size="small" align="left"
                style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="taskMemberIdList" label="任务完成人">
              <el-select v-model="form.taskMemberIdList" :multiple="true" filterable @change="change" size="small"
                :multiple-limit="5" :disabled="((title == '新增') && (!isAdminTemp) && (!isLeaderTemp))"
                :placeholder="title == '下发任务' ? '请选择任务完成人' : '选择任务完成人前请先选择项目'">
                <el-option v-for="(item, index) in formSelectArr.taskMembers" :key="item.staffId" :value="item.staffId"
                  :label="(item.staffName) + (item.phoneNum ? '  ' + item.phoneNum : '')"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0" v-if="title == '新增'">
            <el-form-item prop="taskStatus" label="自动下发">
              <el-switch v-model="form.taskStatus" :disabled="((title == '新增') && (!isAdminTemp) && (!isLeaderTemp))"
                active-color="#13ce66" active-value="0" inactive-value="-1">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="taskPublishContent" label="任务描述">
              <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 8 }" size="small" :disabled="title == '下发任务'"
                placeholder="请输入任务内容，1000字以内" v-model="form.taskPublishContent" show-word-limit :maxlength="1000">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="">
              <div v-if="title == '下发任务'">
                <div v-for="(item, index) in form.taskPublishFileList">
                  <el-link type="primary" icon="el-icon-paperclip" @click="myDownload(item.url, item.name)">
                    {{ item.name }}
                  </el-link>
                </div>
              </div>
              <div v-else>
                <el-upload class="upload-demo" size="mini" ref="upload" action="/file/dual" :http-request="uploadFile"
                  :limit="50" :on-remove="onRemoveFileFn" :file-list="form.taskPublishFileList"
                  :before-upload="beforeUpload">
                  <div slot="tip" class="el-upload__tip" v-if="title != '下发任务'">上传相关附件
                    <a href="#" @click.prevent="$refs.uploadBtn.click()">上传</a>
                    {{ uploadText }}
                  </div>
                  <div slot="trigger" ref="uploadBtn" :v-show="false"></div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>




  </div>
</template>

<script>
import {
  // 任务管理 查询一个项目下的任务列表
  prjTaskGetList as requestFn,
  // 任务管理 查询分配到个人的项目列表
  taskGetHaveTaskProjectList,
  // 任务管理 获取三日任务
  prjTaskGetTridTask,
  // 任务管理 查询一个任务的详情
  prjTaskGetDetails,
  // 任务管理 完成任务接口
  prjTaskFinishTask,
  // 任务管理 新增任务
  prjTaskAddTask as add,
  prjTaskUpdateTask as update,
  // 任务管理 任务文件上传
  prjTaskUploadTaskFile,
  // 任务管理 下发任务
  prjTaskPublishTask,
  // 任务管理 转派任务
  prjTaskTransferTask,
  // 任务管理 删除任务
  prjTaskDelTask,
  // 查询所有设施
  prjTaskGetPublishBuildList,
  // 查询设施下的项目
  prjTaskGetPublishProjectList,
  // 查询任务完成人可选池
  prjProjectStaffGetStaffListByProjectId as getAllTaskMember,
  prjProjectGetLeaderFlagAndRole as getLeaderFlag,

} from "../../utils/api";
import TaskDataShow from "@/components/TaskDataShow.vue"
import TaskFlowNode from "@/components/TaskFlowNode.vue"
import { mixins } from "../../mixin";
export default {
  mixins: [mixins],
  components: {
    TaskDataShow,
    TaskFlowNode,
  },
  data() {
    var validateTaskDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('任务时间不能为空'));
      } else {
        let temp = value.replace(/\-/g, '/')
        let realDate = Date.parse(temp)
        let today = Date.parse(new Date().toLocaleDateString())
        console.log("realDate:", realDate);
        console.log("today:", today);

        if (realDate < today) {
          console.log("zsss");
          callback(new Error('任务时间需要大于等于今天'));
        } else {
          callback();
        }
      }
    };
    return {
      // 使用变量 方便改上传文件大小描述
      uploadText: '（支持文件：word文档、excel文档、pdf文档，上传文件不超过50M）',
      fileSizelimit: 50,
      title: "新增",
      visible: false,
      taskDetailVisible: false,
      // 三日任务数据
      threeDays: [
        {
          "taskTotalNum": 0,
          "taskUndoneNum": 0,
          "taskFinishNum": 0,
          "taskVOList": null
        },
        {
          "taskTotalNum": 0,
          "taskUndoneNum": 0,
          "taskFinishNum": 0,
          "taskVOList": null
        },
        {
          "taskTotalNum": 0,
          "taskUndoneNum": 0,
          "taskFinishNum": 0,
          "taskVOList": null
        }
      ],
      // 任务列表
      tableData: [],
      // 所有项目列表
      prjDataArr: [],

      // 任务详情数据
      taskDetail: {},

      circleColor: {
        overdue: "#EE5044",
        finish: "#4466EE",
        undone: "#FA803F"
      },
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
        {
          name: "任务管理",
          path: "/taskManage",
          isClick: false,
        },
      ],
      headerList: {
        buildName: "设施名称",
        projectName: "项目名称",
        taskName: "任务名称",
        taskMemberName: "任务完成人",
        taskEndDate: "任务时间",
        taskStatus: "任务状态",
        creator: "创建人",
      },
      request: {
        data: {
          projectId: null, //项目id，不传或null查全部
          queryParam: "" //可填任务名称或人员名称
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      // 项目任务 data模型
      form: {
        buildId: "",
        projectId: "",
        taskName: "",
        taskMemberIdList: "",
        taskEndDate: "",
        taskPublishContent: "",
        taskPublishFileList: [],
        taskStatus: 0,
      },

      finishForm: {
        taskId: '', //任务id
        taskFinishContent: "", //任务发布内容
        taskIssue: "", //遇到的问题
        taskFinishFileList: []
      },
      formSelectArr: {
        ndpls: [],
        projects: [],
        taskMembers: []
      },
      // 用于任务转派人员
      taskMemberIdList: [],
      taskId: '',
      banSelf: '',
      userId: null,
      isLeader: false,
      isAdmin: false,
      // 临时数据 模态框下拉判断是否是下拉项目的leader
      isLeaderTemp: false,
      isAdminTemp: false,


      rules: {
        buildId: [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        projectId: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
        ],
        taskEndDate: [
          { required: true, message: "任务时间不能为空", trigger: "blur" },
          { validator: validateTaskDate, trigger: "blur" },
        ],
        taskPublishContent: [
          { required: true, message: "任务内容不能为空", trigger: "blur" },
        ],
      },

      finishRules: {
        taskFinishContent: [{
          required: true, message: "任务完成情况不能为空", trigger: "blur"
        },]
      },

      readRules: {
        taskEndDate: [
          { required: true, message: "任务时间不能为空", trigger: "change" },
          { validator: validateTaskDate, trigger: "blur" },
        ],
      },

      pickerOptions: {
        disabledDate(time) {
          let daySart = new Date(new Date(new Date().toLocaleDateString()).getTime())
          return time.getTime() < daySart;
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
            picker.$emit('pick', date);
          }
        }]
      },



      color: {

      }
    }
  },
  created() {
    this.userId = this.$store.getters.userInfo?.staffId
    // console.log("userinfo:",this.$store.getters.userInfo);
    this.getAllProjectData()
  },
  computed: {

    // 今日未完成
    toDayUndoneNum() {
      if (this.threeDays[1].taskTotalNum == 0) {
        return 0
      } else {
        const result = (100 * this.threeDays[1]?.taskUndoneNum) / (this.threeDays[1].taskTotalNum)
        return result
      }
    },
    // 今日完成
    toDayFinishNum() {
      if (this.threeDays[1].taskTotalNum == 0) {
        return 0
      } else {
        const result = (100 * this.threeDays[1]?.taskFinishNum) / (this.threeDays[1].taskTotalNum)
        return result
      }
    },
    // 昨日超期
    yesterdayOverdueNum() {
      if (this.threeDays[0].taskTotalNum == 0) {
        return 0
      } else {
        const result = (100 * this.threeDays[0]?.taskUndoneNum) / (this.threeDays[0].taskTotalNum)
        return result
      }
    },
    // 昨日完成
    yesterdayFinishNum() {
      if (this.threeDays[0].taskTotalNum == 0) {
        return 0
      } else {
        const result = (100 * this.threeDays[0]?.taskFinishNum) / (this.threeDays[0].taskTotalNum)
        return result
      }
    }
  },
  methods: {

    beforeUpload(file) {
      const result = file.size / 1024 / 1024 < this.fileSizelimit
      if (!result) {

        this.$message({
          offset: 170,
          duration: "1000",
          message: `文件不能超过${this.fileSizelimit}MB!`,
          type: "error",
        })


      }
      return result;
    },


    overdueFn(percentage, index) {
      let ext = "已超期" + "\n\n" + this.threeDays[index].taskUndoneNum + "\n\n"
      return ext + percentage + "%"

    },
    undoneFn(percentage, index) {
      let ext = "未完成" + "\n\n" + this.threeDays[index].taskUndoneNum + "\n\n"
      return ext + percentage + "%"
    },
    finishFn(percentage, index) {
      let ext = "已完成" + "\n\n" + this.threeDays[index].taskFinishNum + "\n\n"
      return ext + percentage + "%"
    },
    /**
     * 项目切换 页面查看的数据重新获取
     */
    mainPrjChangeFn(v) {
      this.request.projectId = v
      // 重新获取数据
      this.getPageData()
    },
    /**
     * 新增编辑的模态下拉
     */
    dialogSelectChangeFn(value, selectName) {
      console.log("value:", value);
      console.log("name:", selectName);

      if (selectName == 'buildId') {
        // 改变项目下拉框的值
        console.log("设施下拉");
        // 清空
        this.formSelectArr.projects = []
        this.form.projectId = ''
        this.formSelectArr.taskMembers = []
        this.form.taskMemberIdList = []
        // 获取
        this.getProjectByBuildId(value)

      } else if (selectName == 'projectId') {
        // 改变任务完成人下拉框的值
        console.log("项目下拉");
        this.formSelectArr.taskMembers = []
        this.form.taskMemberIdList = []
        this.getAllTaskMember(value)
        this.getLeaderFlag(value)
      } else {
        console.log("无效的change事件");
      }
    },

    /**
     * 获取所有设施
     */
    async prjBuildGetList() {
      const res = await prjTaskGetPublishBuildList()
      if (res) {
        this.formSelectArr.ndpls = res.data.data
      }
    },

    /**
     * 获取设施下的项目
     */
    async getProjectByBuildId(buildId) {
      const res = await prjTaskGetPublishProjectList({ buildId: buildId })
      if (res) {
        this.formSelectArr.projects = res.data.data
      }
    },

    /**
     * 查询该项目可选人员
     */
    async getAllTaskMember(projectId) {
      const res = await getAllTaskMember({ projectId: projectId })
      if (res) {
        this.formSelectArr.taskMembers = res.data.data
      }

    },

    /**
     * 获取当前用户下的所有项目
     */
    async getAllProjectData() {
      const res = await taskGetHaveTaskProjectList()
      if (res) {
        this.prjDataArr = res.data.data
        if (!this.request.data.projectId) {
          this.request.data.projectId = this.prjDataArr.length ? this.prjDataArr[0].projectId : undefined;
        }
        this.getPageData()
      }
    },


    /**
     * 获取页面数据
     * 
     * 底部任务完成情况 + 三日任务数据
     */
    getPageData() {
      // 获取当前项目leader标识
      this.getLeaderFlag()
      // 获取table数据
      this.requestFn()

      // 获取三日任务
      this.getThreeDaysData()
    },

    /**
     * 获取用户是否是该项目的负责人
     */
    async getLeaderFlag(value) {

      // temp临时
      if (value) {
        const res = await getLeaderFlag({
          projectId: value
        })
        if (res) {
          this.isLeaderTemp = (res.data.data.leader == 1)
          this.isAdminTemp = res.data.data.role

          // 不是项目负责人 且 不是管理员 即普通成员
          if (!this.isAdminTemp && !this.isLeaderTemp) {
            this.form.taskMemberIdList.push(this.userId)
          }
        }

      } else {
        const res = await getLeaderFlag({
          projectId: this.request.data.projectId
        })

        if (res) {
          this.isLeader = (res.data.data.leader == 1)
          this.isAdmin = res.data.data.role
        }
      }
    },



    /** 获取三日任务 */
    async getThreeDaysData() {
      const res = await prjTaskGetTridTask({ projectId: this.request.data.projectId })
      if (res) {
        this.threeDays = res.data.data
        this.threeDays[0].taskVOList = this.statusMapper(this.threeDays[0].taskVOList)
        this.threeDays[1].taskVOList = this.statusMapper(this.threeDays[1].taskVOList)
        this.threeDays[2].taskVOList = this.statusMapper(this.threeDays[2].taskVOList)

      }
    },

    async addOrUpdateOrDelete(title, row) {
      this.title = title;
      console.log("title:", title);
      if (title == "查看" || title == '转派任务' || title == '编辑' || title == '完成任务') {
        //获取数据
        this.resetFn()
        this.taskId = row.taskId
        this.prjTaskGetDetails(row.taskId, row, title)
        //打开查看模态
        this.taskDetailVisible = true
        return
      }

      if (title == "新增") {
        this.resetFn()
        this.prjBuildGetList()
      }
      if (title == "下发任务") {
        this.resetFn()
        this.taskId = row.taskId
        this.prjTaskGetDetails(row.taskId, row)
      }
      if (title == "删除") {
        this.taskId = row.taskId
      }
      this.show();
    },

    /**
     * 文件移除事件
     */
    onRemoveFileFn(file, fileList, fnName) {
      // 发起移除网络请求
      // 同步文件列表
      if (fnName == 'finishFile') {
        this.finishForm.taskFinishFileList = fileList
      } else {
        this.form.taskPublishFileList = fileList
      }
    },

    change() {
      //强制渲染
      this.$forceUpdate()
    },

    async submit() {


      switch (this.title) {
        case "转派任务":
          // 调用转派接口
          prjTaskTransferTask({
            "taskId": this.taskId, //任务id
            "taskMemberIdList": this.taskMemberIdList
          }).then((data) => this.readrResponseFn(data));
          break;
        case "编辑":
          this.$refs["readForm"].validate(async (valid) => {
            if (valid) {
              update({
                "taskId": this.taskId, //任务id
                "taskEndDate": this.form.taskEndDate, //任务截止日期
                "taskPublishContent": this.form.taskPublishContent, //任务发布内容
                "taskPublishFileList": this.form.taskPublishFileList
              }).then((data) => this.readrResponseFn(data))
            } else {
              this.formErrorFn();
            }
          })
          break;
        case "删除":
          prjTaskDelTask({ taskId: this.taskId }).then((data) => {
            this.visible = false
            this.getPageData()
          })
          break;
        case "下发任务":
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              prjTaskPublishTask({
                "taskId": this.taskId, //任务id
                "taskMemberIdList": this.form.taskMemberIdList,
                "taskEndDate": this.form.taskEndDate //任务截止时间，必传
              }).then((data) => {
                this.visible = false

                this.getPageData()
              });
            } else this.formErrorFn();
          })
          break;
        case "完成任务":
          this.$refs["finishForm"].validate(async (valid) => {
            if (valid) {
              console.log("form:", this.finishForm);
              this.finishForm.taskId = this.taskId
              prjTaskFinishTask(this.finishForm).then((data) => this.readrResponseFn(data));
            } else this.formErrorFn();
          })
          break;
        default:
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") add(this.form).then((res) => {
                this.visible = false
                this.getPageData()
              })


            } else this.formErrorFn();
          });
      }
    },

    showData() {
      console.log("form:", this.form);
      console.log("select:", this.formSelectArr);
      console.log("taskMemberIdList:", this.taskMemberIdList);

    },

    show() {
      if (this.visible) this.resetFn()
      this.visible = !this.visible;
    },


    responseFn(data) {
      this.show()
      // this.form.taskPublishFileList = []
      this.resetFn()
      this.getAllProjectData()

    },

    readrResponseFn(data) {
      this.taskDetailVisible = false
      // this.form.taskPublishFileList = []
      this.resetFn()
      this.getAllProjectData()
    },

    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);
      this.statusMapper(res.data.data.list)



    },
    resetFn() {
      this.form = {
        buildId: "",
        projectId: "",
        taskName: "",
        taskMemberIdList: "",
        taskEndDate: "",
        taskPublishContent: "",
        taskPublishFileList: [],
        banSelf: '',
        taskStatus: -1,
      }

      this.formSelectArr = {
        ndpls: [],
        projects: [],
        taskMembers: []
      }
      this.taskMemberIdList = []
      this.taskId = ''

      this.finishForm = {
        taskId: '', //任务id
        taskFinishContent: "", //任务发布内容
        taskIssue: "", //遇到的问题
        taskFinishFileList: []
      },
        this.taskFinishContent = {};
      this.$refs["readForm"]?.resetFields();
      this.$refs["finishForm"]?.resetFields();
      this.$refs["form"]?.resetFields();
    },

    /**
     * taskStatus 映射
     * data: 任务数组，元素需要存在 taskStatus 属性
     */
    statusMapper(data) {
      let converData = data?.map(item => {
        const status = item.taskStatus
        let text = '无数据'
        switch (status) {
          case 0: text = '未完成'; break;
          case 1: text = '已完成'; break;
          case 2: text = '已超期'; break;
          case -1: text = "未下发"; break;
          default: console.log("任务状态无法映射,status:", status);
        }
        item.taskStatus = text;
        return item
      })
      return converData
    },

    /**
     * 任务详情
     */
    async prjTaskGetDetails(taskId, row, title) {
      const res = await prjTaskGetDetails({ taskId: taskId })
      if (res) {
        this.taskDetail = res.data.data
        // 回显
        this.form = res.data.data
        this.form.buildId = row.buildId
        this.form.projectId = row.projectId
        this.form.taskMemberIdList = []
        if (res.data.data.taskMember) {
          this.form.taskMemberIdList.push(res.data.data.taskMember)
        }
        if (title == '转派任务') {
          this.banSelf = this.taskDetail.taskMember
        }
        // 下拉框数据
        this.prjBuildGetList()
        this.getProjectByBuildId(row.buildId)
        this.getAllTaskMember(row.projectId)
      }
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

    /**
     * 附件上传
     */
    uploadFile(e, name) {
      var formData = new FormData();
      formData.append("file", e.file)
      prjTaskUploadTaskFile(formData).then(res => {
        if (res) {
          if (name == 'finishFile') {
            this.finishForm.taskFinishFileList.push(res.data.data)
          } else {
            this.form.taskPublishFileList.push(res.data.data)
          }
        } else {
          // 去除失败的文件
          const files = e.file
          let uid = files.uid // 关键作用代码，去除文件列表失败文件
          let upload = null
          if (name == 'finishFile') {
            upload = this.$refs.finishUpload
          } else if (name == 'read') {
            upload = this.$refs.readUpload
          } else {
            upload = this.$refs.upload
          }
          let idx = upload.uploadFiles.findIndex(item => item.uid === uid) // 关键作用代码，去除文件列表失败文件（uploadFiles为el-upload中的ref值）
          console.log(idx, "=======", upload.uploadFiles);
          upload.uploadFiles.splice(idx, 1) // 关键作用代码，去除文件列表失败文件
        }
      })

    }
  },
}
</script>

<style lang="less" scoped>
.top-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;

  span {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 2px;
    color: #333333;
    line-height: 0px;
  }

  .title-icon {
    width: 4px;
    height: 16px;
    background: #0143CE;
    margin-left: 17px;
  }

}

.prjSelect {
  margin: 5px 0px 5px 17px;
  width: 200px;
}

.taskDataShow {
  height: calc(60% - 90px);
  background-color: #FFFFFF;
  // border: 1px solid black;

  .task-data-body {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 17px;

    // border: 1px solid green;
  }

}

.right-title-text {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
}

.circle-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;

}

.icon-color-overdue {
  border: 3px solid #EE5044;
  // background-color: #EE5044;
}

.icon-color-finish {
  border: 3px solid #4466EE;
  // background-color: #4466EE;
}

.icon-color-undone {
  border: 3px solid #FA803F;
  // background-color: #FA803F;
}

.cr {
  line-height: 136px;
  text-align: center;
  width: 136px;
  height: 136px;
  border-radius: 50%;
  background: linear-gradient(180deg, #4466EE 0%, #7BD2FF 100%);
  opacity: 1;

  span {
    white-space: pre;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 24px;
  }
}

.customTab {
  height: calc(40%);
  overflow: hidden;
}

::v-deep .el-progress__text {
  white-space: pre;
}

::v-deep .Tab .el-table {
  margin-top: 0px;
}

:deep(.el-table .el-table__cell) {
  padding: 2px 0;
}

:deep(.el-table .cell) {
  padding-left: 0px !important;
}

.readForm {
  .el-form-item {
    margin-bottom: 2px;
  }
}

.option-content {
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  /* 隐藏溢出内容 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  max-width: 100px;
  /* 适当设置最大宽度 */
}


.complete {
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 100%;

  .task {
    width: 10%;
    min-width: 114px;
  }

  .description {
    width: 90%;
    line-height: 25px;
    overflow: auto;
  }
}
</style>