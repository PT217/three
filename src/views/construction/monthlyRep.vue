
<template>
  <div class="monthlyRep">
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click.prevent="back()">返回</el-button>
      </template>
    </Nav>
    <Tab :title="title" :tabShow="false" :pageShow="false">
      <el-form ref="monthlyRepForm" :model="monthlyRepForm" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="projectName" label="工程名称:">
              <el-input disabled type="text" v-model="monthlyRepForm.projectName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="projectNum" label="工程期数:">
              <el-input type="text" v-model="monthlyRepForm.projectNum" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="startTime" label="开始时间:">
              <el-date-picker v-model="monthlyRepForm.startTime" type="date" placeholder="选择日期" align="left"
                :disabled="status == '查看'">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="endTime" label="结束时间:">
              <el-date-picker v-model="monthlyRepForm.endTime" type="date" placeholder="选择日期" align="left"
                :disabled="status == '查看'">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="comName" label="施工单位:">
              <el-input type="text" v-model="monthlyRepForm.comName" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="preparers" label="编制人:">
              <el-input type="text" v-model="monthlyRepForm.preparers" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="approver" label="批准:">
              <el-input type="text" v-model="monthlyRepForm.approver" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="reviewer" label="审核:">
              <el-input type="text" v-model="monthlyRepForm.reviewer" :disabled="status == '查看'" :maxlength="10"
                show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 富文本 -->
        <el-form-item prop="constructionStatusMonth" label="本月施工情况:">
          <Edit eId="constructionStatusMonth" ref="constructionStatusMonth" :text="monthlyRepForm.constructionStatusMonth"
            :disabled="status == '查看'" @Edit="editor"></Edit>
        </el-form-item>

        <el-form-item prop="qualityAndSafety" label="安全情况:">
          <Edit eId="qualityAndSafety" ref="qualityAndSafety" :text="monthlyRepForm.qualityAndSafety"
            :disabled="status == '查看'" @Edit="editor">
          </Edit>
        </el-form-item>

        <el-form-item prop="designChanges" label="设计变更情况:">
          <Edit eId="designChanges" ref="designChanges" :text="monthlyRepForm.designChanges" :disabled="status == '查看'"
            @Edit="editor">
          </Edit>
        </el-form-item>
        <el-form-item prop="constructionPlannedNextMonth" label="下月施工计划:">
          <Edit eId="constructionPlannedNextMonth" ref="constructionPlannedNextMonth"
            :text="monthlyRepForm.constructionPlannedNextMonth" :disabled="status == '查看'" @Edit="editor">
          </Edit>
        </el-form-item>
        <el-form-item class="monthlyRepQ" prop="unresolvedIssue" label="目前需要协调的问题:">
          <Edit eId="unresolvedIssue" ref="unresolvedIssue" :text="monthlyRepForm.unresolvedIssue"
            :disabled="status == '查看'" @Edit="editor">
          </Edit>
        </el-form-item>

        <el-form-item prop="approvalOpinion" label="审批意见:"
          v-if="monthlyRepForm.approvalStatus == '审批通过' || monthlyRepForm.approvalStatus == '审批未通过' || isApproval">
          <Edit eId="approvalOpinion" ref="approvalOpinion" onlyRead :text="monthlyRepForm.approvalOpinion" @Edit="editor"
            :disabled="status == '查看' && !isApproval">
          </Edit>
        </el-form-item>



        <el-form-item>
          <div v-if="!(status == '查看') || isApproval">
            <div v-if="$store.state.account && isApproval" class="monthlyRepApproval">
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
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Edit from "../../components/Edit.vue";
import { monthlyAddMonthly, monthlyUpdateMonthly } from "../../utils/api";
import moment from "moment";
export default {
  name: "monthlyRep",
  props: [""],

  data() {
    return {
      flag: false,
      title: "施工月报",
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
          name: "施工月报",
          path: "/monthlyRep",
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
      monthlyRepForm: {
        conductId: "",
        projectName: "",
        projectNum: "",
        startTime: "",
        endTime: "",
        comName: "",
        preparers: "",
        constructionStatusMonth: "",
        qualityAndSafety: "",
        designChanges: "",
        constructionPlannedNextMonth: "",
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
    if (JSON.parse(localStorage.getItem('monthlyRep'))) {
      this.monthlyRepForm = JSON.parse(localStorage.getItem('monthlyRep'))
      // 本月施工情况
      this.monthlyRepForm.constructionStatusMonth += " "
      // 安全情况
      this.monthlyRepForm.qualityAndSafety += " "
      // 设计变更情况:
      this.monthlyRepForm.designChanges += " "
      // 下月施工计划
      this.monthlyRepForm.constructionPlannedNextMonth += " "
      // 目前需要协调的问题
      this.monthlyRepForm.unresolvedIssue += " "
      this.monthlyRepForm.approvalOpinion += " "

      console.log(this.monthlyRepForm);
      this.flag = true;
    } else {
      this.flag = false;
    }
    this.monthlyRepForm.conductId = localStorage.getItem("finalSchemeId");
    this.monthlyRepForm.projectName = localStorage.getItem("projectName");
  },
  methods: {
    editor(data) {
      this.monthlyRepForm[data.wordNodeName] = data.htmlText;
    },
    submit(approvalStatus) {


      this.$refs.monthlyRepForm.validate(async (vali) => {
        if (vali) {
          this.monthlyRepForm.startTime = moment(
            this.monthlyRepForm.startTime
          ).format("YYYY-MM-DD");
          this.monthlyRepForm.endTime = moment(
            this.monthlyRepForm.endTime
          ).format("YYYY-MM-DD");
          if (this.monthlyRepForm.startTime > this.monthlyRepForm.endTime) return this.$message({
            offset: 170,
            duration: "1000",
            message: "开始时间不能晚于结束时间",
            type: "error",
          });
          if (!this.flag) {
            const res = await monthlyAddMonthly(this.monthlyRepForm);
            setTimeout(() => {
              this.back()
            }, 1100);
          } else {
            if (approvalStatus) {
              this.monthlyRepForm.approvalOpinion = this.$refs.approvalOpinion.editor.txt.html()
              const res = await monthlyUpdateMonthly({ ...this.monthlyRepForm, approvalStatus });
              setTimeout(() => {
                this.$router.push({ name: "gant", params: { data: "wait" } });
              }, 1100);
            } else {
              const res = await monthlyUpdateMonthly(this.monthlyRepForm);
              setTimeout(() => {
                this.back()
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
      this.$router.push({ name: "gant", params: { data: "monthlyRep" } });
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

.monthlyRep :deep(.el-form) {
  width: 92% !important;
  margin: auto;
}

.monthlyRep :deep(.monthlyRepQ .el-form-item__label) {
  text-align: left;
}

.monthlyRepApproval {
  display: flex;
  justify-content: center;
}
</style>