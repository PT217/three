<template>
  <div class="journal">
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click.prevent="back()">返回</el-button>
      </template>
    </Nav>

    <Tab title="施工日志" :tabShow="false" :pageShow="false">
      <el-form ref="journalForm" :model="journalForm" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="time" label="日期:">
              <el-date-picker v-model="journalForm.time" :disabled="status == '查看'" type="date" placeholder="选择日期"
                align="left">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="workSite" label="施工部位:" class="workSite">
              <el-select v-model="journalForm.itemId" placeholder="请选择" default-first-option filterable clearable
                :disabled="status == '查看'">
                <div class="option">
                  <el-option v-for="item in workmanship" :key="item.id" :label="item.workContext" :value="item.id">
                  </el-option>
                </div>
              </el-select>
              <el-input class="workSiteInput" type="text" v-model="journalForm.workSite" maxlength="10" show-word-limit
                :disabled="status == '查看'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="morningWeather" label="上午气象:">
              <el-input type="text" v-model="journalForm.morningWeather" maxlength="10" show-word-limit
                :disabled="status == '查看'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="afternoonWeather" label="下午气象:">
              <el-input type="text" v-model="journalForm.afternoonWeather" maxlength="10" show-word-limit
                :disabled="status == '查看'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="averageTemp" label="平均气温:">
              <el-input type="text" v-model="journalForm.averageTemp" maxlength="10" show-word-limit
                :disabled="status == '查看'"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="attendance" label="出勤人数:">
              <el-input type="text" v-model="journalForm.attendance" maxlength="10" show-word-limit
                :disabled="status == '查看'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="surveyorsList" label="测量人员:">
              <el-select v-model="journalForm.surveyorsList" placeholder="请选择" default-first-option multiple filterable
                clearable remote :remote-method="filterMethod" :loading="selectLoading" loading-text="请求数据"
                @visible-change="visibleChange" :disabled="status == '查看'">
                <div class="option">
                  <el-option v-for="item in staffList" :key="item.staffId" :label="item.staffName" :value="item.staffId">
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="recorderList" label="记录员:">
              <el-select v-model="journalForm.recorderList" placeholder="请选择" default-first-option multiple filterable
                clearable remote :remote-method="filterMethod" :loading="selectLoading" loading-text="请求数据"
                @visible-change="visibleChange" :disabled="status == '查看'">
                <div class="option">
                  <el-option v-for="(item, i) in staffList" :key="item.staffId + `${i}`" :label="item.staffName"
                    :value="item.staffId">
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item prop="operationOwnerList" label="操作负责人:">
              <el-select v-model="journalForm.operationOwnerList" placeholder="请选择" default-first-option multiple
                filterable clearable remote :remote-method="filterMethod" :loading="selectLoading" loading-text="请求数据"
                @visible-change="visibleChange" :disabled="status == '查看'">
                <div class="option">
                  <el-option v-for="(item, i) in staffList" :key="item.staffId + `${2 * i}`" :label="item.staffName"
                    :value="item.staffId">
                  </el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 富文本 -->
        <el-form-item prop="workDetail" label="施工内容:">
          <Edit eId="workDetail" ref="workDetail" :text="journalForm.workDetail" @Edit="editor"
            :disabled="status == '查看'"></Edit>
        </el-form-item>

        <el-form-item prop="approvalOpinion" label="审批意见:"
          v-if="journalForm.approvalStatus == '审批通过' || journalForm.approvalStatus == '审批未通过' || isApproval">
          <Edit eId="approvalOpinion" onlyRead :text="journalForm.approvalOpinion" @Edit="editor" ref="approvalOpinion"
            :disabled="status == '查看' && !isApproval">
          </Edit>
        </el-form-item>

        <el-form-item>
          <div v-if="!(status == '查看') || isApproval">
            <div v-if="$store.state.account && isApproval" class="journalApproval">
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
import Tab from "../../components/Tab";
import Edit from "../../components/Edit.vue";
import {
  dailyAddDaily,
  dailyUpdateDaily,
  staffManageFindstaff,
  nodeGetSchemeAllNode,
} from "../../utils/api";
import moment from "moment";
export default {
  name: "journal",
  props: [""],

  data() {
    return {
      // 判断是新增还是修改
      flag: false,

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
          name: "施工日志",
          path: "/journal",
          isClick: false,
        },
      ],
      rules: {
        time: [
          {
            required: true,
            message: "请选择作业时间",
          },
        ],
        workSite: [
          {
            required: true,
            message: "作业地点不能为空",
          },
        ],
        attendance: [
          {
            required: true,
            message: "出勤人数不能为空",
          },
        ],
        recorderList: [
          {
            required: true,
            message: "记录员不能为空",
          },
        ],
        operationOwnerList: [
          {
            required: true,
            message: "操作负责人不能为空",
          },
        ],
        surveyorsList: [
          {
            required: true,
            message: "测量人员不能为空",
          },
        ],
        workDetail: [
          {
            required: true,
            message: "施工内容不能为空",
          },
        ],
      },
      title: "",

      proPerManageData: {
        data: {
          staffName: "",
          fkDepartId: "",
          job: "",
          staffFlag: 1,
        },
        page: 1,
        limit: 200,
      },
      staffList: [],
      //工艺下拉列表
      workmanship: [],
      // 查询
      selectLoading: false,


      journalForm: {
        conductId: "",
        time: "",
        workSite: "",
        morningWeather: "",
        afternoonWeather: "",
        averageTemp: "",
        attendance: "",
        recorderList: [],
        operationOwnerList: [],
        surveyorsList: [],
        workDetail: "",
        itemId: "",
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
    if (JSON.parse(localStorage.getItem('journal'))) {
      this.journalForm = JSON.parse(localStorage.getItem('journal'))

      console.log(this.journalForm);

      this.journalForm.workDetail += " "
      this.journalForm.approvalOpinion += " "
      console.log(this.journalForm);
      this.journalForm.recorderList = this.journalForm.recorderList.map(
        (item) => {
          return Number(item.accountId);
        }
      );
      this.journalForm.operationOwnerList =
        this.journalForm.operationOwnerList.map((item) => {
          return Number(item.accountId);
        });
      this.journalForm.surveyorsList = this.journalForm.surveyorsList.map(
        (item) => {
          return Number(item.accountId);
        }
      );
      console.log(this.journalForm);
      this.flag = true;
    } else {
      this.flag = false;
    }
    this.journalForm.conductId = localStorage.getItem("finalSchemeId");
    this.journalForm.projectName = localStorage.getItem("projectName");
    this.staffManageFindstaff();
    this.nodeGetSchemeAllNode();
  },
  methods: {
    editor(data) {
      console.log(data);
      this.journalForm[data.wordNodeName] = data.htmlText;
    },
    // 获取项目人员列表
    async staffManageFindstaff() {
      let res = await staffManageFindstaff(this.proPerManageData);
      if (res) {
        this.staffList = res.data.data.list.map((item) => {
          return {
            ...item,
            staffId: Number(item.staffId),
          };
        });
        this.proPerManageData.page = res.data.data.pageNum;
        this.proPerManageData.limit = res.data.data.pageSize;
        this.proPerManageData.total = res.data.data.total;
        this.selectLoading = false;
        console.log(this.staffList);
      }
    },
    //
    filterMethod(val) {
      console.log(val);
      this.selectLoading = true;
      this.proPerManageData.page = 1;
      this.proPerManageData.data.staffName = val;
      this.staffManageFindstaff();
    },
    // 下拉单选工艺
    async nodeGetSchemeAllNode() {
      const res = await nodeGetSchemeAllNode({
        schemeId: this.journalForm.conductId,
      });

      console.log(this.journalForm);
      console.log(res);

      console.log(this.journalForm.itemId);
      if (res) this.workmanship = res.data.data;

    },
    proPerManageDataCurrentChange(val) {
      // console.log(val);
      this.proPerManageData.page = val;
      this.staffManageFindstaff();
    },
    // 部门分页当前数量改变
    proPerManageDataSizeChange(val) {
      console.log(val);
      this.proPerManageData.limit = val;
      this.staffManageFindstaff();
    },
    visibleChange(val) {
      console.log(val);
      if (val) {
        this.proPerManageData.data.staffName = "";
        this.proPerManageData.page = 1;
        this.staffManageFindstaff();
      }
    },

    // 保存
    submit(approvalStatus) {
      this.$refs.journalForm.validate(async (vali) => {
        if (vali) {
          this.journalForm.recorderList = this.journalForm.recorderList.map(
            (item) => ({ accountId: item })
          );
          this.journalForm.operationOwnerList =
            this.journalForm.operationOwnerList.map((item) => ({
              accountId: item,
            }));
          this.journalForm.surveyorsList = this.journalForm.surveyorsList.map(
            (item) => ({ accountId: item })
          );
          this.journalForm.time = moment(this.journalForm.time).format(
            "YYYY-MM-DD"
          );
          if (!this.flag) {
            const res = await dailyAddDaily(this.journalForm);
            setTimeout(() => {
              this.back();
            }, 1100);
          } else {

            if (approvalStatus) {
              this.journalForm.approvalOpinion = this.$refs.approvalOpinion.editor.txt.html()

              const res = await dailyUpdateDaily({ ...this.journalForm, approvalStatus });
              setTimeout(() => {
                this.$router.push({ name: "gant", params: { data: "wait" } });
              }, 1100);
            } else {
              const res = await dailyUpdateDaily(this.journalForm);
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
      this.$router.push({ name: "gant", params: { data: "journal" } });
    },
  },

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

.journal :deep(.el-form) {
  width: 92% !important;
  margin: auto;
}

.journal :deep(.el-select) {
  width: 100%;
}

.option {
  height: 200px;
}

.pagin {
  height: 35px;
}

.workSite {
  position: relative;
}

.workSite :deep(.workSiteInput) {
  position: absolute;
  width: 50%;
  left: 50%;
}

.workSite :deep(.workSiteInput .el-input__inner) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.journalApproval {
  display: flex;
  justify-content: center;
}
</style>