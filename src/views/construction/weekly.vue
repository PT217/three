
<template>
  <div class="weekly">
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click.prevent="back()">返回</el-button>
      </template>
    </Nav>

    <Tab :title="title" :tabShow="false" :pageShow="false">
      <el-form ref="weeklyForm" :model="weeklyForm" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="projectName" label="工程名称:">
              <el-input disabled type="text" v-model="weeklyForm.projectName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="projectNum" label="工程期数:">
              <el-input type="text" v-model="weeklyForm.projectNum" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="startTime" label="开始时间:">
              <el-date-picker v-model="weeklyForm.startTime" type="date" placeholder="选择日期" align="left"
                :disabled="status == '查看'">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="endTime" label="结束时间:">
              <el-date-picker v-model="weeklyForm.endTime" type="date" placeholder="选择日期" align="left"
                :disabled="status == '查看'">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="comName" label="施工单位:">
              <el-input type="text" v-model="weeklyForm.comName" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="preparers" label="编制人:">
              <el-input type="text" v-model="weeklyForm.preparers" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="approver" label="批准:">
              <el-input type="text" v-model="weeklyForm.approver" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="reviewer" label="审核:">
              <el-input type="text" v-model="weeklyForm.reviewer" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 富文本 -->
        <el-form-item prop="constructionStatusWeek" label="本周施工情况:">
          <Edit eId="constructionStatusWeek" ref="constructionStatusWeek" :text="weeklyForm.constructionStatusWeek"
            @Edit="editor" :disabled="status == '查看'"></Edit>
        </el-form-item>

        <el-form-item prop="qualityAndSafety" label="安全情况:">
          <Edit eId="qualityAndSafety" ref="qualityAndSafety" :text="weeklyForm.qualityAndSafety" @Edit="editor"
            :disabled="status == '查看'">
          </Edit>
        </el-form-item>

        <el-form-item prop="designChanges" label="设计变更情况:">
          <Edit eId="designChanges" ref="designChanges" :text="weeklyForm.designChanges" @Edit="editor"
            :disabled="status == '查看'">
          </Edit>
        </el-form-item>

        <el-form-item prop="constructionPlannedNextWeek" label="下周施工计划:">
          <Edit eId="constructionPlannedNextWeek" ref="constructionPlannedNextWeek"
            :text="weeklyForm.constructionPlannedNextWeek" @Edit="editor" :disabled="status == '查看'">
          </Edit>
        </el-form-item>

        <el-form-item class="weeklyQ" prop="unresolvedIssue" label="目前需要协调的问题:">
          <Edit eId="unresolvedIssue" ref="unresolvedIssue" :text="weeklyForm.unresolvedIssue" @Edit="editor"
            :disabled="status == '查看'">
          </Edit>
        </el-form-item>

        <el-form-item prop="approvalOpinion" label="审核意见:"
          v-if="weeklyForm.approvalStatus == '审批通过' || weeklyForm.approvalStatus == '审批未通过' || isApproval">
          <Edit eId="approvalOpinion" onlyRead :text="weeklyForm.approvalOpinion" @Edit="editor" ref="approvalOpinion"
            :disabled="status == '查看' && !isApproval">
          </Edit>
        </el-form-item>

        <el-form-item>
          <div v-if="!(status == '查看') || isApproval">
            <div v-if="$store.state.account && isApproval" class="weeklyApproval">
              <el-button type="primary" @click="submit('审批通过')">通过</el-button>
              <el-button type="danger" @click="submit('审批未通过')">不通过</el-button>
            </div>
            <el-button v-else type="primary" @click="submit()">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
import Edit from "../../components/Edit.vue";
import { weeklyAddWeekly, weeklyUpdateWeekly } from "../../utils/api";
import moment from "moment";
export default {
  name: "weekly",
  props: [""],

  data() {
    return {
      flag: false,
      title: "施工周报",
      nav: [
        {
          name: "施工管理",
          path: "/construction",
          isClick: false,
        },
        {
          name: "项目进度管理",
          path: "/proSchedule",
          isClick: false,
        },
        {
          name: "进度完成对比表",
          path: "/gant",
          isClick: false,
        },
        {
          name: "施工周报",
          path: "/weekly",
          isClick: false,
        },
      ],
      rules: {
        projectName: [
          {
            required: true,
            message: "工程名称不能为空",
          },
        ],
        projectNum: [
          {
            required: true,
            message: "工程期数不能为空",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
          },
        ],
        comName: [
          {
            required: true,
            message: "公司名称不能为空",
          },
        ],
        preparers: [
          {
            required: true,
            message: "编制人不能为空",
          },
        ],
      },
      weeklyForm: {
        conductId: "",
        projectName: "",
        projectNum: "",
        startTime: "",
        endTime: "",
        comName: "",
        preparers: "",
        constructionStatusWeek: "",
        qualityAndSafety: "",
        designChanges: "",
        constructionPlannedNextWeek: "",
        unresolvedIssue: "",
        approver: "",
        reviewer: "",

        // 审批状态
        approvalStatus: "",
        // 审批意见
        approvalOpinion: ""
      },


      // 状态
      status: localStorage.getItem('status'),
      // 是否为审批页面
      isApproval: JSON.parse(localStorage.getItem('isApproval')),
    };
  },
  components: {
    Nav,
    Tab,
    Edit,
  },

  created() {
    if (JSON.parse(localStorage.getItem('weekly'))) {
      this.weeklyForm = JSON.parse(localStorage.getItem('weekly'))


      // 本周施工情况
      this.weeklyForm.constructionStatusWeek += " "
      // 安全情况
      this.weeklyForm.qualityAndSafety += " "
      this.weeklyForm.designChanges += " "
      // 下周施工计划
      this.weeklyForm.constructionPlannedNextWeek += " "
      // 目前需要协调的问题
      this.weeklyForm.unresolvedIssue += " "
      this.weeklyForm.approvalOpinion += " "
      this.flag = true;
    } else {
      this.flag = false;
    }
    this.weeklyForm.conductId = localStorage.getItem("finalSchemeId");
    this.weeklyForm.projectName = localStorage.getItem("projectName");
  },

  beforeDestroy() {
    console.log('zoul');
  },
  methods: {
    editor(data) {
      this.weeklyForm[data.wordNodeName] = data.htmlText;
    },
    submit(approvalStatus) {

      this.$refs.weeklyForm.validate(async (vali) => {
        if (vali) {
          this.weeklyForm.startTime = moment(
            this.weeklyForm.startTime
          ).format("YYYY-MM-DD");
          this.weeklyForm.endTime = moment(
            this.weeklyForm.endTime
          ).format("YYYY-MM-DD");
          if (this.weeklyForm.startTime > this.weeklyForm.endTime) return this.$message({
            offset: 170,
            duration: "1000",
            message: "开始时间不能晚于结束时间",
            type: "error",
          });


          if (!this.flag) {
            const res = await weeklyAddWeekly(this.weeklyForm);

            setTimeout(() => {
              this.back()
            }, 1100);
          } else {
            if (approvalStatus) {
              this.weeklyForm.approvalOpinion = this.$refs.approvalOpinion.editor.txt.html()
              const res = await weeklyUpdateWeekly({ ...this.weeklyForm, approvalStatus });
              setTimeout(() => {
                this.$router.push({ name: "gant", params: { data: "wait" } });
              }, 1100);
              return;
            } else {
              const res = await weeklyUpdateWeekly(this.weeklyForm);
              setTimeout(() => {
                this.back();
              }, 1100);
            }

          }
        } else {
          this.$message({
            offset: 170,
            duration: "1000",
            message: "未通过校验，请按表单中的提示修改",
            type: "warning",
          });
        }
      });
    },
    // 返回
    back() {
      if (JSON.parse(localStorage.getItem('backWait'))) {
        this.$router.push({ name: "gant", params: { data: "wait" } });
        localStorage.removeItem('backWait')
        return
      }
      this.$router.push({ name: "gant", params: { data: "weekly" } });
    },
  },
  watch: {},
};
</script>

<style scoped>
.el-date-editor {
  width: 100%;
}

.Tab :deep(.w-e-toolbar) {
  z-index: 1 !important;
}

.Tab :deep(.w-e-text-container) {
  z-index: 0 !important;
}

.weekly :deep(.el-form) {
  width: 92% !important;
  margin: auto;
}

.weekly :deep(.weeklyQ .el-form-item__label) {
  text-align: left;
}

.weeklyApproval {
  display: flex;
  justify-content: center;
}
</style>
