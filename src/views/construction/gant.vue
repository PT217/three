<template>
  <div class="container">
    <Nav :nav="nav"></Nav>
    <Tab :title="title" :tabShow="false" :pageShow="false">
      <Gantt style="height: 77%" v-if="forceRefresh" :tasks="tasks" @handle="handle" @handleVideo="handleVideo"></Gantt>
    </Tab>
    <div class="bottom">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in list" :key="item.label" :label="item.label" :name="item.name">
          <el-badge v-if="index == 4" slot="label" :value="waitLength">代办</el-badge>

          <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading" ref="multipleSelection" :show-header="true" style="width: 100%"
            @selection-change="selectArray" :row-key="getRowKeys">
            <!-- journal -->
            <template v-if="activeName == 'journal' && journalValue">
              <el-table-column width="28" type="selection" :reserve-selection="true">
              </el-table-column>
              <el-table-column label="施工日志" align="left" width="300">
                <template slot-scope="scope">
                  {{ scope.row.dailyName }}
                </template>
              </el-table-column>

              <el-table-column label="创建人" align="left">
                <template slot-scope="scope">
                  {{ scope.row.creator.accountName }}
                </template>
              </el-table-column>

              <el-table-column label="状态" align="left">
                <template slot-scope="scope">
                  {{ scope.row.approvalStatus }}
                </template>
              </el-table-column>

              <el-table-column label="创建时间" align="left">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.approvalStatus != '待提交'" type="primary" size="mini"
                    @click.stop="viewFn(scope)">查看</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="changeStatus(scope)">提交</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="getRecord(scope)">编辑</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交' || $store.state.account" type="danger" size="mini"
                    @click.stop="del(scope)">删除</el-button>
                </template>
              </el-table-column>
            </template>

            <!--  weekly-->
            <template v-if="activeName == 'weekly' && weeklyValue">
              <el-table-column width="28" type="selection" :reserve-selection="true">
              </el-table-column>

              <el-table-column label="施工周报" align="left" width="300">
                <template slot-scope="scope">
                  {{ scope.row.weeklyName }}
                </template>
              </el-table-column>

              <el-table-column label="创建人" align="left">
                <template slot-scope="scope">
                  {{ scope.row.creator.accountName }}
                </template>
              </el-table-column>

              <el-table-column label="状态" align="left">
                <template slot-scope="scope">
                  {{ scope.row.approvalStatus }}
                </template>
              </el-table-column>

              <el-table-column label="创建时间" align="left">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>


              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.approvalStatus != '待提交'" type="primary" size="mini"
                    @click.stop="viewFn(scope)">查看</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="changeStatus(scope)">提交</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="getRecord(scope)">编辑</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交' || $store.state.account" type="danger" size="mini"
                    @click.stop="del(scope)">删除</el-button>
                </template>
              </el-table-column>
            </template>

            <!--  monthlyRep-->
            <template v-if="activeName == 'monthlyRep' && monthlyRepValue">
              <el-table-column width="28" type="selection" :reserve-selection="true">
              </el-table-column>
              <el-table-column label="施工月报" align="left" width="300">
                <template slot-scope="scope">
                  {{ scope.row.monthlyName }}
                </template>
              </el-table-column>

              <el-table-column label="创建人" align="left">
                <template slot-scope="scope">
                  {{ scope.row.creator.accountName }}
                </template>
              </el-table-column>

              <el-table-column label="状态" align="left">
                <template slot-scope="scope">
                  {{ scope.row.approvalStatus }}
                </template>
              </el-table-column>

              <el-table-column label="创建时间" align="left">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.approvalStatus != '待提交'" type="primary" size="mini"
                    @click.stop="viewFn(scope)">查看</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="changeStatus(scope)">提交</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="getRecord(scope)">编辑</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交' || $store.state.account" type="danger" size="mini"
                    @click.stop="del(scope)">删除</el-button>
                </template>
              </el-table-column>
            </template>

            <!-- photoArchives -->
            <template v-if="activeName == 'photoArchives' && photoArchivesValue">
              <el-table-column width="28" type="selection" :reserve-selection="true">
              </el-table-column>

              <el-table-column label="施工项" align="left" width="300">
                <template slot-scope="scope">
                  {{ scope.row.itemName }}
                </template>
              </el-table-column>

              <el-table-column label="创建人" align="left">
                <template slot-scope="scope">
                  {{ scope.row.accountName }}
                </template>
              </el-table-column>

              <el-table-column label="状态" align="left">
                <template slot-scope="scope">
                  {{ scope.row.approvalStatus }}
                </template>
              </el-table-column>

              <el-table-column label="创建时间" align="left">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>


              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.approvalStatus != '待提交'" type="primary" size="mini"
                    @click.stop="viewFn(scope)">查看</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="changeStatus(scope)">提交</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交'" type="primary" size="mini"
                    @click.stop="getRecord(scope)">编辑</el-button>
                  <el-button v-if="scope.row.approvalStatus == '待提交' || $store.state.account" type="danger" size="mini"
                    @click.stop="del(scope)">删除</el-button>
                </template>
              </el-table-column>
            </template>



            <!-- 待办 -->
            <template v-if="activeName == 'wait' && waitValue">
              <!-- <el-table-column width="28" type="selection" :reserve-selection="true">
              </el-table-column> -->

              <el-table-column label="资料名称" width="300" align="left">
                <template slot-scope="scope">
                  {{
                    scope.row.logType == '施工日报' ? scope.row.dailyName
                    : scope.row.logType == '施工周报' ? scope.row.weeklyName
                      : scope.row.logType == '施工月报' ? scope.row.monthlyName
                        : scope.row.itemName
                  }}
                </template>
              </el-table-column>

              <el-table-column label="资料类型" align="left">
                <template slot-scope="scope">
                  {{ scope.row.logType }}
                </template>
              </el-table-column>

              <el-table-column label="创建人" align="left">
                <template slot-scope="scope">
                  {{ scope.row.logType == '照片归档' ? scope.row.accountName : scope.row.creator?.accountName }}
                </template>
              </el-table-column>

              <el-table-column label="状态" align="left">
                <template slot-scope="scope">
                  {{ scope.row.approvalStatus }}
                </template>
              </el-table-column>

              <el-table-column label="创建时间" align="left">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>

              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button v-if="$store.state.account && (scope.row.approvalStatus == '待审批')" type="primary" size="mini"
                    @click.stop="approvalFn(scope)">审批</el-button>
                  <div v-else>
                    <el-button type="primary" size="mini" @click.stop="viewFn(scope)">
                      查看</el-button>
                    <el-button type="primary" size="mini" @click.stop="changeStatus(scope)">
                      取回</el-button>
                  </div>

                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 按钮 -->
      <div v-if="activeNameShow" class="btnBox">
        <el-input v-model="value" type="primary" size="mini" placeholder="请输入施工名" clearable @input="inputSelect">
        </el-input>

        <el-button type="primary" size="mini" @click="handleSelectButton">搜索</el-button>

        <!-- v-has="{ action: activeName }" -->
        <el-button type="primary" size="mini" @click="addButton" :disabled="activeName == 'wait'">新增</el-button>
        <el-button type="primary" size="mini" @click="printButton"
          :disabled="multipleSelection.length == 0 ? true : false">导出</el-button>
      </div>
    </div>
    <Dialog :visible="dialogVisible" :title="dialogTitle" @show="showDialog" @submit="editInfo">
      <el-form ref="form" :model="form" :rules="rules" label-width="117px">
        <!-- 工作内容-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作内容:">
              <el-input v-model="form.workContext" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际时间:" prop="timeValue">
              <el-date-picker v-model="form.timeValue" type="daterange" range-separator="至" start-placeholder="开始时间"
                end-placeholder="结束时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工艺明细:">
          <Edit eId="Edit" v-if="forceRefresh" ref="Edit" :text="form.note" :disabled="true"></Edit>
        </el-form-item>
      </el-form>
    </Dialog>

    <el-dialog :visible.sync="videoDialogVisible" :title="videoTitle" :before-close="closeVideo">
      <div v-if="src">
        <video id="playVideo" :src="src" controls autoplay muted width="100%" height="100%">
          <source :src="src" type="video/mp4" />
        </video>
      </div>
    </el-dialog>
    <!-- 编辑图片档案列表 -->
    <Dialog class="photoListDialog" title="编辑图片档案列表" :visible="photoListVisible" @show="showPhotoListVisible"
      @submit="photoListSubmit">
      <el-select v-model="photoListModelValue" placeholder="请选择" default-first-option multiple filterable clearable>
        <div class="option">
          <el-option v-for="item in photoList" :key="item.id" :label="item.workContext" :value="item.id">
          </el-option>
        </div>
      </el-select>
    </Dialog>
    <!-- 删除 -->
    <Dialog :visible="handleDelectVisble" :title="delectTitle" @show="delectDialog" @submit="delectInfoDialog">
      你确定要删除吗？</Dialog>
  </div>
</template>
 
<script>
import Gantt from "../../components/Gantt.vue";
import Edit from "../../components/Edit.vue";
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab";
import Dialog from "../../components/Dialog.vue";
import { gantt } from "dhtmlx-gantt";
import moment from "moment";
import {
  finalSchemeGetGantt,
  finalSchemeUpdateProcessActualTime,
  dailyDailyPage,
  weeklyGetWeekLogPage,
  monthlyGetMonthlyPage,
  photoRecordFindItemList,
  dayDeleteDayLog,
  weeklyDeleteWeekly,
  monthlyDeleteMonthly,
  nodeGetSchemeAllNode,
  photoRecordUpdateNodeInfo,
  techItemGetConductPhoto,
  photoRecordDeleteNode, //照片墙gant列表删除


  // 状态提交
  dailyUpdateDaily,
  weeklyUpdateWeekly,
  monthlyUpdateMonthly,

  backLogUpdateConductContentStatus,


  constBack_logPage,//待办

  // 打印
  dailyExport,
  weeklyExport,
  monthlyExport,
  constPhoto_recordExport2zip,
} from "../../utils/api";
export default {
  name: "gant",
  components: {
    Gantt,
    Dialog,
    Edit,
    Nav,
    Tab,
  },
  inject: ["reload"],
  created() {

    console.log(this.$store.state.account);
    if (this.$route.params.data) {
      this.activeName = this.$route.params.data;
    }
    this.form.conductId = localStorage.getItem("finalSchemeId");
    this.vo.data.conductId = localStorage.getItem("finalSchemeId");
    this.vo.data.conductId = localStorage.getItem("finalSchemeId");
    this.title =
      localStorage.getItem("areaName") +
      "-" +
      localStorage.getItem("projectName");
    this.finalSchemeGetGantt();
    this.handleClick();
    this.waitFn()
    console.log(this.activeName);
    console.log(91111);
  },

  beforeRouteUpdadte(to, from, next) {
    console.log(to);
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name == "journal" ||
      to.name == "weekly" ||
      to.name == "monthlyRep"
    ) {
      var sPos = gantt.getScrollState();
      localStorage.setItem("sPos", JSON.stringify(sPos));
      next();
    } else {
      localStorage.removeItem("sPos");
      console.log("离开gant");
      next();
    }
  },
  // 监听
  watch: {
    $route(to, from) {
      console.log(4);
      let refresh = (to.params && to.params.refresh) || false;
      console.log(refresh);
      if (refresh) {
        console.log("强刷");
        this.reload();
      }
    },
  },
  // 返回鲜活页面时的事件处理
  activated() {
    this.vo.page = 1;
    if (this.$route.params.data == "journal") {
      this.forceRefresh = false;
      this.activeName = "journal";
      this.journal();
      this.$nextTick(() => {
        this.forceRefresh = true;
        this.$refs.multipleSelection[0].clearSelection();
      });
    }
    if (this.$route.params.data == "weekly") {
      this.forceRefresh = false;
      this.activeName = "weekly";
      this.weekly();
      this.$nextTick(() => {
        this.forceRefresh = true;
        this.$refs.multipleSelection[1].clearSelection();
      });
    }
    if (this.$route.params.data == "monthlyRep") {
      this.forceRefresh = false;
      this.activeName = "monthlyRep";
      this.monthlyRep();
      this.$nextTick(() => {
        this.forceRefresh = true;
        this.$refs.multipleSelection[2].clearSelection();
      });
    }
    if (this.$route.params.data == "photoArchives") {
      this.forceRefresh = false;
      this.activeName = "photoArchives";
      this.photoArchives();
      this.$nextTick(() => {
        console.log(888);

        this.forceRefresh = true;
        this.$refs.multipleSelection[3].clearSelection();
      });
    }

    if (this.$route.params.data == "wait") {
      this.forceRefresh = false;
      this.activeName = "wait";
      this.wait();
      this.$nextTick(() => {
        console.log(888);
        this.forceRefresh = true;
        this.$refs.multipleSelection[4].clearSelection();
      });
    }
  },
  data() {
    return {
      activeNameShow: true,
      // 强刷标识
      reloadFlag: false,
      value: "",
      title: "月度工作计划与实际完成进度对比表",
      forceRefresh: true,
      activeName: "journal",
      list: [
        {
          label: "施工日志",
          name: "journal",
        },
        {
          label: "施工周报",
          name: "weekly",
        },
        {
          label: "施工月报",
          name: "monthlyRep",
        },
        {
          label: "照片档案",
          name: "photoArchives",
        },
        {
          label: "待办",
          name: "wait",
        },
      ],
      // 日周月报分页请求
      vo: {
        data: {

          dailyName: "",
          weeklyName: "",
          monthlyName: "",
          itemName: "",
          backLogName: "",

          conductId: "",
          conductId: ""
        },
        page: "1",
        limit: "50",
      },


      pages: {
        page: 1,
        limit: 10,
        total: 0,
      },
      tableData: [],




      loading: true,
      nav: [
        {
          name: "施工管理",
          path: "/construction",
          isClick: false,
        },
        {
          name: "施工进度",
          path: "/proSchedule",
          isClick: false,
        },
        {
          name: "进度完成对比表",
          path: "/gant",
          isClick: false,
        },
      ],
      tasks: {
        data: [],
        // 脱线
      },

      //修改实际时间模态框数据
      dialogVisible: false,
      dialogTitle: "",
      form: {
        conductId: "",
        id: "",
        workContext: "",
        timeValue: "",
        note: "",
      },
      rules: {
        timeValue: [
          {
            type: "array",
            required: true,
            trigger: "blur",
            message: "请选择日期区间",
            fields: {
              //tpye类型试情况而定,所以如果返回的是date就改成date
              0: { type: "string", required: true, message: "请选择开始日期" },
              1: { type: "string", required: true, message: "请选择结束日期" },
            },
          },
        ],
      },
      // photoListVisible
      photoListVisible: false,
      photoList: [],
      photoListModelValue: [],
      // 视频模态框
      videoDialogVisible: false,
      videoTitle: "",
      src: "",
      // 复选框
      multipleSelection: [],
      // 删除模态框
      handleDelectVisble: false,
      delectTitle: "删除确认",
      // 删除内容
      delectValue: "",
      journalValue: true,
      weeklyValue: true,
      monthlyRepValue: true,
      photoArchivesValue: true,
      waitValue: true,

      // 代办长度
      waitLength: 0
    };
  },
  methods: {
    // 获取gantt数据
    async finalSchemeGetGantt() {
      console.log(this.tasks.data);
      let res = await finalSchemeGetGantt({
        finalSchemeId: this.form.conductId,
      });


      console.log(res);

      if (res) {



        res.data.data.processDetail.forEach((item, i) => {
          item.forEach((tItem, index) => {
            if (index == 1) {
              let temp = {
                id: item[0].itemId,
                text: tItem.startDate + "~" + tItem.endDate,
                start_date: tItem.startDate,
                end_date: moment(tItem.endDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD"),
                video: "播放视频",
                videoPath: item[0].multimediaVo,
                name: item[0].itemName || "未定义" + i,
                note: item[0].note,
                flag: "计划时间",
                time: "计划时间",
                showName: item[0].itemName || "未定义" + i,
                title:
                  item[0].itemTreeVo.itemTreeVo.itemTreeVo.catelogName +
                  "-" +
                  item[0].itemTreeVo.itemTreeVo.catelogName +
                  "-" +
                  item[0].itemTreeVo.catelogName +
                  ":" +
                  item[0].itemName,
              };
              if (tItem.startDate == null) {
                temp.text = "";
                temp.start_date = "";
                temp.end_date = "";
              }
              this.tasks.data.push(temp);
              return;
            }
            if (index == 2) {
              let temp = {
                id: item[0].itemId + 1,
                text: tItem.startDate + "~" + tItem.endDate,
                start_date: tItem.startDate,
                end_date: moment(tItem.endDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD"),
                flag: "实际时间",
                time: "实际时间",
                videoPath: item[0].multimediaVo,
                showName: item[0].itemName || "未定义" + i,
              };
              if (tItem.startDate == null) {
                temp.text = "";
                temp.start_date = moment(new Date()).format("YYYY-MM-DD");
                temp.end_date = moment(new Date()).format("YYYY-MM-DD");
                temp["status"] = true;
              }
              this.tasks.data.push(temp);
              return;
            }
          });
        });
        console.log(this.tasks.data);
      }
    },
    // 获取日报数据
    async journal() {
      this.journalValue = false;
      console.log(3);
      const res = await dailyDailyPage(this.vo);
      if (res) {
        this.tableData = res.data.data.list;
        this.pages.limit = res.data.data.pageSize;
        this.pages.page = res.data.data.pageNum;
        this.pages.total = res.data.data.total;
        this.$nextTick(() => {
          this.journalValue = true;
        });
      }
      this.loading = false;
    },
    // 获取周报数据
    async weekly() {
      this.weeklyValue = false;
      const res = await weeklyGetWeekLogPage(this.vo);

      if (res) {
        this.tableData = res.data.data.list;
        this.pages.limit = res.data.data.pageSize;
        this.pages.page = res.data.data.pageNum;
        this.pages.total = res.data.data.total;

        this.$nextTick(() => {
          this.weeklyValue = true;
          this.loading = false;
        });
      }
    },
    // 获取月报数据
    async monthlyRep() {
      this.monthlyRepValue = false;
      const res = await monthlyGetMonthlyPage(this.vo);
      if (res) {
        this.tableData = res.data.data.list;
        this.pages.limit = res.data.data.pageSize;
        this.pages.page = res.data.data.pageNum;
        this.pages.total = res.data.data.total;
        this.$nextTick(() => {
          this.monthlyRepValue = true;
          this.loading = false;
        });
      }
    },
    // 获取照片墙数据
    async photoArchives() {
      this.photoArchivesValue = false;
      const res = await photoRecordFindItemList(this.vo);
      if (res) {
        this.tableData = res.data.data.list;
        this.pages.limit = res.data.data.pageSize;
        this.pages.page = res.data.data.pageNum;
        this.pages.total = res.data.data.total;
        this.$nextTick(() => {
          console.log(9999);
          this.photoArchivesValue = true;
          this.loading = false;
        });
      }
    },

    // 获取待办列表
    async wait() {
      this.waitValue = false;
      const res = await constBack_logPage(this.vo);
      if (res) {
        this.tableData = res.data.data.list;
        this.waitLength = res.data.data.list.length;
        this.pages.limit = res.data.data.pageSize;
        this.pages.page = res.data.data.pageNum;
        this.pages.total = res.data.data.total;
        this.$nextTick(() => {
          console.log(9999);
          this.waitValue = true;
          this.loading = false;
        });
      }
    },

    // 获取待办长度
    async waitFn() {
      const res = await constBack_logPage({
        data: {
          backLogName: "",
          conductId: localStorage.getItem("finalSchemeId"),
          conductId: localStorage.getItem("finalSchemeId")
        },
        page: "1",
        limit: "1000",
      })
      this.waitLength = res ? res.data.data.list.length : 0
    },
    // 修改实际时间模态框显示内容
    handle(id) {
      this.form.id = id;
      console.log(id);
      this.tasks.data.forEach((item) => {
        if (item.id == id && item.video == "播放视频") {
          this.dialogTitle = item.title;
          this.dialogVisible = true;
          // this.$nextTick(() => {
          console.log(item.name);
          if (item.name.indexOf("未定义") != -1) {
            this.$message({
              offset: 170,
              duration: "1000",
              message: "施工项名称未定义，不能修改实际时间",
              type: "error",
            });
            return;
          }
          this.form.workContext = item.name;
          this.$set(this.form, "note", item.note);
          console.log(item.id);
          this.tasks.data.forEach((tItem) => {
            if (tItem.id == id + 1) {
              if (tItem.text == "") {
                this.$set(this.form, "timeValue", ["", ""]);
              } else {
                this.$set(this.form, "timeValue", [
                  moment(tItem.start_date).format("YYYY-MM-DD"),
                  moment(
                    moment(tItem.end_date).subtract(1, "days").toDate()
                  ).format("YYYY-MM-DD"),
                ]);
              }
            }
          });
          // });
        }
      });
    },
    // 切换模态框状态
    showDialog() {
      this.dialogVisible = !this.dialogVisible;
    },
    // 表单校验及保存
    editInfo() {
      console.log(this.form);
      this.$refs.form.validate((vali) => {
        if (vali) {
          this.tasks.data.forEach(async (item, index) => {
            if (item.id == this.form.id + 1 && item.flag == "实际时间") {
              this.$set(item, "start_date", this.form.timeValue[0]);
              this.$set(item, "end_date", this.form.timeValue[1]);
              var sPos = gantt.getScrollState();
              localStorage.setItem("sPos", JSON.stringify(sPos));
              let res = await finalSchemeUpdateProcessActualTime({
                conductId: this.form.conductId,
                itemId: this.form.id,
                actualStart: this.form.timeValue[0],
                actualEnd: this.form.timeValue[1],
              });
              this.showDialog();
              this.reload();
            }
          });
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

    // 切换日报/月报
    handleClick(tab) {
      this.activeNameShow = false;
      if (tab && tab.name) {
        this.value = "";
        this.handleSelectButton('reset');
        this.vo.page = 1;
        this.loading = true;
        this.$refs.multipleSelection[tab.index].clearSelection();
        this.multipleSelection = [];
      }
      this[this.activeName]();
      this.$nextTick(() => {
        this.activeNameShow = true;
      });
    },
    // 新增按钮
    addButton() {
      localStorage.setItem('status', '新增')
      localStorage.setItem('isApproval', JSON.stringify(false))
      localStorage.setItem(`${this.activeName}`, null)
      this.$router.push({ path: "/" + this.activeName });
    },
    //编辑图片列表
    async editPhotoList() {
      let res = await techItemGetConductPhoto({
        schemeId: this.form.conductId,
      });
      if (res) {
        this.photoListModelValue = res.data.data;
      }
      const res2 = await nodeGetSchemeAllNode({
        schemeId: this.form.conductId,
      });

      if (res2) {
        this.photoList = res2.data.data;
        this.showPhotoListVisible();
      }
    },
    showPhotoListVisible() {
      this.photoListVisible = !this.photoListVisible;
    },
    // 图片列表提交
    async photoListSubmit() {
      let photoListUpdate = this.photoListModelValue.map((item) => ({
        conductId: this.form.conductId,
        itemId: item,
        photoFlag: 1,
      }));

      const res = await photoRecordUpdateNodeInfo(photoListUpdate);
      this.vo.page = 1;
      this.photoArchives();
      this.showPhotoListVisible();
    },
    // 查看按钮
    viewFn(scope) {
      console.log(scope);
      if (scope.row.logType && scope.row.approvalStatus == '审批未通过') {
        localStorage.setItem('isApproval', JSON.stringify(false))
        localStorage.setItem('status', '查看')
        switch (scope.row.logType) {
          case '施工日报':
            this.$router.push({ name: 'journal' });
            localStorage.setItem('journal', JSON.stringify(scope.row))
            break;
          case '施工周报':
            this.$router.push({ name: 'weekly' });
            localStorage.setItem('weekly', JSON.stringify(scope.row))
            break;
          case '施工月报':
            this.$router.push({ name: 'monthlyRep' });
            localStorage.setItem('monthlyRep', JSON.stringify(scope.row))
            break;
          case '照片归档':
            console.log(777);
            this.$router.push({ name: 'photoArchives' });
            localStorage.setItem('photoArchives', JSON.stringify(scope.row))
            break;
        }
        localStorage.setItem('backWait', JSON.stringify(true))
      } else {
        this.$router.push({
          name: this.activeName,
        });
        localStorage.setItem('isApproval', JSON.stringify(false))
        localStorage.setItem('status', '查看')
        localStorage.setItem(`${this.activeName}`, JSON.stringify(scope.row))
      }
    },
    // 提交
    async changeStatus(scope) {


      console.log(scope.row);
      let res
      if (scope.row.logType) {
        switch (scope.row.logType) {
          case '施工日报':
            res = await dailyUpdateDaily({ ...scope.row, approvalStatus: '待提交' })
            break;
          case '施工周报':
            res = await weeklyUpdateWeekly({ ...scope.row, approvalStatus: '待提交' })
            break;
          case '施工月报':
            res = await monthlyUpdateMonthly({ ...scope.row, approvalStatus: '待提交' })
            break;
          case '照片归档':
            res = await backLogUpdateConductContentStatus({ ...scope.row, approvalStatus: '待提交' })
            break;
        }
      } else {
        switch (this.activeName) {
          case 'journal':
            res = await dailyUpdateDaily({ ...scope.row, approvalStatus: '待审批' })
            break;
          case 'weekly':
            res = await weeklyUpdateWeekly({ ...scope.row, approvalStatus: '待审批' })
            break;
          case 'monthlyRep':
            res = await monthlyUpdateMonthly({ ...scope.row, approvalStatus: '待审批' })
            break;
          case 'photoArchives':
            res = await backLogUpdateConductContentStatus({ ...scope.row, approvalStatus: '待审批', approvalOpinion: "" })
            break;
        }
      }
      this[this.activeName]();
    },

    // 编辑按钮
    getRecord(scope) {
      localStorage.setItem('status', '编辑')
      localStorage.setItem('isApproval', JSON.stringify(false))
      console.log(scope.row);

      this.$router.push({ name: this.activeName });
      localStorage.setItem(`${this.activeName}`, JSON.stringify(scope.row))
    },
    // 导出按钮
    async printButton() {
      if (this.activeName == "journal") {
        let arr = this.multipleSelection.map((item) => item.dailyId);
        dailyExport(arr, { responseType: "blob" }).then((res) => {
          if (!res) return
          localStorage.setItem("name", "施工日报" + res.headers.filename);
          this.print(res, arr.length);
        });
      } else if (this.activeName == "photoArchives") {
        let arr = this.multipleSelection.map((item) => ({
          structureId: item.conductId,
          itemId: item.itemId,
        }));

        constPhoto_recordExport2zip(arr, { responseType: "blob" }).then(
          (res) => {
            if (!res) return
            localStorage.setItem(
              "name",
              "施工过程图片资料" + res.headers.filename
            );
            this.print(res, arr.length);
          }
        );
      } else if (this.activeName == "weekly") {
        let arr = this.multipleSelection.map((item) => item.weeklyId);

        weeklyExport(arr, { responseType: "blob" }).then((res) => {
          if (!res) return
          localStorage.setItem("name", "施工周报" + res.headers.filename);
          this.print(res, arr.length);
        });
      } else {
        let arr = this.multipleSelection.map((item) => item.monthlyId);
        monthlyExport(arr, { responseType: "blob" }).then((res) => {
          if (!res) return
          localStorage.setItem("name", "施工月报" + res.headers.filename);
          this.print(res, arr.length);
        });
      }
    },
    //导出内容
    print(res, maxLength) {
      console.log(res);
      console.log(maxLength);
      if (maxLength == 1 && this.activeName !== "photoArchives") {
        const blob = new Blob([res.data], {
          type: "application/msword",
        });
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          let fileName = localStorage.getItem("name");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      } else {
        const blob = new Blob([res.data]);
        console.log(localStorage.getItem("name"));
        // debugger;
        const filename = localStorage.getItem("name");
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.download = filename;
        downloadElement.href = href;
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放blob对象
      }
    },
    // 删除按钮
    del(scope) {
      if (this.activeName == "journal") {
        this.delectValue = scope.row.dailyId;
      }
      if (this.activeName == "weekly") {
        this.delectValue = scope.row.weeklyId;
      }
      if (this.activeName == "monthlyRep") {
        this.delectValue = scope.row.monthlyId;
      }
      if (this.activeName == "photoArchives") {
        this.delectValue = {
          conductId: scope.row.conductId,
          itemId: scope.row.itemId,
        };
      }
      this.delectDialog();
    },
    // 删除模态框
    delectDialog() {
      this.handleDelectVisble = !this.handleDelectVisble;
    },
    // 确认删除
    async delectInfoDialog() {
      let res
      if (this.activeName == "journal") {

        console.log(this.delectValue);
        res = await dayDeleteDayLog({ dailyId: this.delectValue });
      }

      if (this.activeName == "weekly") {
        res = await weeklyDeleteWeekly({
          weeklyId: this.delectValue,
        });
      }
      if (this.activeName == "monthlyRep") {
        res = await monthlyDeleteMonthly({
          monthlyId: this.delectValue,
        });
      }

      if (this.activeName == "photoArchives") {
        res = await photoRecordDeleteNode(this.delectValue);
      }
      this.delectDialog();
      this.handleClick();
    },
    inputSelect(e) {
      if (e == "") {
        this.handleSelectButton();
      }
    },
    handleSelectButton(reset) {
      console.log(reset);
      this.vo.data.dailyName = ""
      this.vo.data.weeklyName = "";
      this.vo.data.monthlyName = "";
      this.vo.data.itemName = "";
      this.vo.data.backLogName = ""
      if (this.activeName == "journal") this.vo.data.dailyName = this.value
      if (this.activeName == "weekly") this.vo.data.weeklyName = this.value
      if (this.activeName == "monthlyRep") this.vo.data.monthlyName = this.value
      if (this.activeName == "photoArchives") this.vo.data.itemName = this.value
      if (this.activeName == "wait") this.vo.data.backLogName = this.value
      if (reset == 'reset') return
      this.handleClick();
    },

    //分页数量
    handleSizeChange(val) {
      this.vo.limit = val;
      this.handleClick();
    },
    //分页当前页数
    handleCurrentChange(val) {
      this.vo.page = val;
      this.handleClick();
    },
    // 关闭视频模态框
    closeVideo() {
      const closeVi = document.getElementById("playVideo");
      if (closeVi) {
        closeVi.pause();
      }
      this.videoDialogVisible = false;
    },
    // 视频文件内容
    handleVideo(videoId) {
      this.src = "";

      console.log(this.tasks.data);
      this.tasks.data.some((item) => {
        console.log(item.id);
        if (item.id == videoId && item.videoPath == null) {
          console.log(this);
          this.$message({
            offset: 170,
            message: "没有视频资源",
            type: "error",
            duration: "5000",
          });
          return true
        }
        if (item.id == videoId && item.videoPath != null) {
          this.src = item.videoPath.path;
          this.videoTitle = item.videoPath.fileName;
          setTimeout(() => {
            let vi = document.getElementById("playVideo");
            vi.currentTime = 0;
          });
          this.videoDialogVisible = true;
        }
      });
    },
    // 多选打印数据
    selectArray(arr) {
      this.multipleSelection = arr;
    },
    //绑定多选值
    getRowKeys(row) {
      if (this.activeName == "journal") return row.dailyId;
      if (this.activeName == "monthlyRep") return row.monthlyId;
      if (this.activeName == "weekly") return row.monthlyId;
      if (this.activeName == "photoArchives") return row.itemId;
    },
    // 模型交互
    goThree() {
      this.$router.push({ path: "/modelInteraction" });
    },


    approvalFn(scope) {
      console.log(22);

      console.log(scope.row);
      switch (scope.row.logType) {
        case '施工日报':
          this.$router.push({ name: 'journal' });
          localStorage.setItem('journal', JSON.stringify(scope.row))
          break;
        case '施工周报':
          this.$router.push({ name: 'weekly' });
          localStorage.setItem('weekly', JSON.stringify(scope.row))
          break;
        case '施工月报':
          this.$router.push({ name: 'monthlyRep' });
          localStorage.setItem('monthlyRep', JSON.stringify(scope.row))
          break;
        case '照片归档':
          this.$router.push({ name: 'photoArchives' });
          localStorage.setItem('photoArchives', JSON.stringify(scope.row))
          break;
      }

      localStorage.setItem('isApproval', JSON.stringify(true))
      localStorage.setItem('status', '查看')

    }
  },
};
</script>
<style lang="less"  scoped>
.container :deep(.gantt_task_progress_drag) {
  display: none !important;
}

.Tab :deep(.gantt_scale_cell.gantt_last_cell),
.Tab :deep(.gantt_scale_cell),
.Tab :deep(.gantt_grid_head_cell),
.Tab :deep(.gantt_task_vscroll) {
  background-color: #f6f6f6;
}



.Tab :deep(.gantt_task_row .gantt_task_cell) {
  border-right: 1px solid #ebebeb;
}

.Tab :deep(.gantt_grid_head_cell) {
  border-right: 1px solid #cecece !important;
}


.container>.Tab {
  height: 50%;
  margin-bottom: 20px;
}

.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-right: 106px;
}

.box>div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  width: 30%;
}

.left>span:nth-of-type(1) {
  white-space: wrap;
}

.el-icon-time,
.el-icon-user {
  margin-right: 5px;
}

.bottom {
  position: relative;
  height: calc(50% - 70px);
  background-color: #fff;
  padding: 0 17px;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);

  .el-tabs {

    :deep(.is-top),
    :deep(.has-gutter) {
      color: #333333;
    }
  }

  .btnBox {
    position: absolute;
    right: 35px;
    top: 5px;

    .el-input {
      width: 120px;
      margin-right: 10px;
    }
  }

  .el-table {

    :deep(th.el-table__cell.is-leaf) {
      border-right: 0;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      background-color: #F6F6F6;
    }

    :deep(.cell) {
      padding-left: 0px !important;
    }
  }

  .el-button {
    border-radius: 0;
  }

  :deep(.el-input__inner) {
    border-radius: 0;
  }

  :deep(.el-table__body-wrapper) {
    height: 165px !important;
    overflow-y: auto;
  }

  :deep(.el-table .el-table__cell) {
    padding: 2px 0;
  }

  :deep(.el-table .cell) {
    padding-left: 0px !important;
  }
}

/* 分页模块 */

.container :deep(.gantt_tree_content>.proname),
.container :deep(.gantt_tree_content>.el-icon-video-play) {
  color: #2c6feb;
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
  line-height: 26px;
  text-overflow: ellipsis;
}

.container :deep(.gantt_tree_content>.proname) {
  width: 208px;
}

.container :deep(.plan) {
  background: linear-gradient(270deg, #09d3bc 0%, #5fda7c 100%) !important;
}

.container :deep(.actual) {
  background: linear-gradient(90deg, #3d91ff 0%, #2c6feb 100%) !important;
}

.container:deep(.status) {
  display: none !important;
}

.container:deep( ::-webkit-scrollbar) {
  height: 5px !important;
}

.container :deep(#Edit) {
  cursor: no-drop;
}

.container :deep(.gantt_task_content) {
  cursor: default !important;
  height: 100%;
}

.container :deep(.gantt_grid_data .gantt_row.gantt_selected),
.container :deep(.gantt_task_row.gantt_selected .gantt_task_cell),
.container :deep(.gantt_grid_data .gantt_row:hover) {
  background-color: #e4e7ec !important;
}

.container :deep(.gantt_task_row.gantt_selected .gantt_task_cell) {
  border-right-color: #e4e7ec !important;
}

/* dialog */
.photoListDialog :deep(.el-select) {
  width: 100%;
}

:deep(.el-badge) {
  vertical-align: baseline !important;
}

:deep(.el-badge__content.is-fixed) {
  top: 10px;
  right: 7px;
}

:deep(.gantt_grid_data .gantt_cell) {
  color: #666 !important;
  font-size: 14px;
  padding: 0;

}

:deep(.gantt_grid_head_cell),
:deep(.gantt_scale_cell) {
  font-weight: 700;
  font-size: 16px;
  color: #333 !important;
  // text-align: left;
}



:deep(.gantt_container) {
  font-family: MiSans-Regular;
}

:deep(.gantt-error) {
  display: none;
}

:deep(.gantt_tooltip .showName) {
  width: 180px;
  white-space: pre-wrap;
}
</style>


