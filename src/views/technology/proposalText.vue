<template>
  <div class="proposalText">
    <Nav :nav="nav">
      <template slot="right">
        <img class="wasteIcon" src="../../assets/common/fs.png" @click="visible = true, requestFn()" />
        <el-button type="primary" size="mini" @click.prevent="exportProposalText()">导出</el-button>
        <el-button type="primary" size="mini" @click.prevent="handleBack()">返回</el-button>
      </template>
    </Nav>
    <div class="pagebox" v-if="rightArr && nextPage == page + 1" v-for="(data, page) in list" :key="page">
      <EditText v-for="item in data" :key="item.eId" :id="item.eId + 1" :eId="item.eId" :title="item.title"
        :text="textList[item.text]" :onlyRead="leader ? false : rightArr.includes(item.eId) ? true : false"
        @child-event="savaRichTexttoArray">
        <template slot="ButtonSlot" v-if="item.text == 'content_scheme'">
          <el-button type="primary" size="mini" @click.prevent="editContentScheme()">编辑内容及方案</el-button>
        </template>
      </EditText>

      <div class="bottom">
        <el-button class="nextPage" @click="handlePrePage">上一步</el-button>
        <el-button class="nextPage" type="primary" @click="handleNextPage(page + 1)">下一步</el-button>
      </div>
    </div>

    <Dialog :visible="visible" @show="show" @submit="submit" :showBtn="false" width="90%">
      <Tab ref="tab" title="特性调查数据信息" :tableData="tableData" :headerList="headerList" :request="request"
        @pageChange="pageChange" @limitChange="limitChange" :loading="loading">
        <template slot="expand">
          <el-table-column type="expand" width="1">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="所属系统:">
                  <span>{{ props.row.belongSys }}</span>
                </el-form-item>

                <el-form-item label="废物类别:">
                  <span>{{ props.row.wasteCategory }}</span>
                </el-form-item>

                <el-form-item label="设备功能:">
                  <span>{{ props.row.deviceFunction }}</span>
                </el-form-item>

                <el-form-item label="材质:">
                  <span>{{ props.row.materials }}</span>
                </el-form-item>

                <el-form-item label="数量:">
                  <span>{{ props.row.nums }}</span>
                </el-form-item>

                <el-form-item label="重量:">
                  <span>{{ props.row.weight }} {{ props.row.weightUnit }}</span>
                </el-form-item>

                <el-form-item label="余量:">
                  <span v-if="props.row.margin">{{ props.row.margin }} {{ props.row.marginUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>

                <el-form-item label="外表面积:">
                  <span v-if="props.row.outsideArea">{{ props.row.outsideArea }} {{ props.row.outsideAreaUnit }}
                  </span>
                  <span v-else>无</span>
                </el-form-item>

                <el-form-item label="内表面积:">
                  <span v-if="props.row.innerArea">{{ props.row.innerArea }} {{ props.row.innerAreaUnit }}
                  </span>
                  <span v-else>无</span>
                </el-form-item>

                <el-form-item label="长度:">
                  <span v-if="props.row.length">{{ props.row.length }} {{ props.row.lengthUnit }}
                  </span>
                  <span v-else>无</span>
                </el-form-item>

                <el-form-item label="废物来源:">
                  <span>{{ props.row.wasteFrom }} </span>
                </el-form-item>
                <el-form-item label="放置状态:">
                  <span>{{ props.row.placingState }} </span>
                </el-form-item>
                <el-form-item label="接触介质:">
                  <span>{{ props.row.contactMedium }} </span>
                </el-form-item>
                <el-form-item label="介质来源:">
                  <span>{{ props.row.mediumSource }} </span>
                </el-form-item>
                <el-form-item label="α射线计量:">
                  <span v-if="props.row.alphaRays">{{ props.row.alphaRays }} {{ props.row.alphaUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item label="β射线计量:">
                  <span v-if="props.row.alphaRays">{{ props.row.alphaRays }} {{ props.row.betaUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item label="γ射线计量:">
                  <span v-if="props.row.gammaRays">{{ props.row.gammaRays }} {{ props.row.gammaUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item label="锶同位素辐射计量:">
                  <span v-if="props.row.srRadiation">{{ props.row.srRadiation }}
                    {{ props.row.srRadiationUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item label="铯放射性元素辐射计量:">
                  <span v-if="props.row.csRadiation">{{ props.row.csRadiation }}
                    {{ props.row.csRadiationUnit }}</span>
                  <span v-else>无</span>
                </el-form-item>

                <el-form-item label="备注:">
                  <span>{{ props.row.comment }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </template>

        <template slot="column">
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="toogleExpand(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Tab>
    </Dialog>
  </div>
</template>

<script>
import {
  techProposal_contentFindById,
  techProposal_contentUpdateProjectProposalContent,
  FindDecomEngineerStructIdByProposalId,
  exportExportProjectProposal,
  // 查询不可编辑的文档标题
  prjProjectWriteGetUnableAllowTitle,
  // 查询顶部表格
  techCharacterFindByBuildId as requestFn,


  prjProjectGetLeaderFlagAndRole
} from "../../utils/api";
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab";
import Dialog from "../../components/Dialog.vue";
import EditText from "../../components/EditText.vue";

export default {
  components: {
    Tab,
    Nav,
    Dialog,
    EditText,
  },
  data() {
    return {
      nav: [
        {
          name: "技术管理",
          path: "/technology",
          isClick: false,
        },
        {
          name: "项目建议书",
          path: "/proposal",
          isClick: false,
        },
        {
          name: "编写文档",
          path: "/proposalText",
          isClick: false,
        },
      ],
      textList: {},
      nextPage: 1,
      richTextData: [],
      webGLUrl: "",
      list: [
        // 1
        [
          {
            title: "（一）项目名称及概况",
            eId: "project_name_condition",
            text: "projectNameCondition",
          },
        ],
        // 2
        [
          {
            title: "（二）项目概述",
            eId: "project_summarize",
            text: "projectSummarize",
          },
          {
            title: "项目背景",
            eId: "project_background",
            text: "projectBackground",
          },
          {
            title: "编写依据",
            eId: "write_gist",
            text: "writeGist",
          },
          {
            title: "项目必要性",
            eId: "project_necessity",
            text: "projectNecessity",
          },
          {
            title: "国内外现状",
            eId: "status_home_abroad",
            text: "statusHomeAbroad",
          },
          {
            title: "项目进展情况",
            eId: "project_progress",
            text: "projectProgress",
          },
          {
            title: "现状",
            eId: "current_situation",
            text: "currentSituation",
          },
          {
            title: "退役整治范围、内容及目标",
            eId: "regulation_scope",
            text: "regulationScope",
          },
          {
            title: "方案简介",
            eId: "project_introduction",
            text: "projectIntroduction",
          },
          {
            title: "主要技术指标",
            eId: "technical_index",
            text: "technicalIndex",
          },
        ],
        // 3
        [
          {
            title: "（三）厂址概括",
            eId: "factory_profile",
            text: "factoryProfile",
          },
          {
            title: "厂址自然条件",
            eId: "factory_natural_conditions",
            text: "factoryNaturalConditions",
          },
          {
            title: "厂址社会环境",
            eId: "factory_social_environment",
            text: "factorySocialEnvironment",
          },
        ],
        // 4
        [
          {
            title: "（四）设施描述",
            eId: "equipment_description",
            text: "equipmentDescription",
          },
          {
            title: "设施简介",
            eId: "equipment_introduction",
            text: "equipmentIntroduction",
          },
          {
            title: "运行历史",
            eId: "running_history",
            text: "runningHistory",
          },
          {
            title: "现状及源项",
            eId: "current_situation_source",
            text: "currentSituationSource",
          },
        ],
        // 5
        [
          {
            title: "（五）总体思路及条件分析",
            eId: "idea_analyse",
            text: "ideaAnalyse",
          },
        ],
        // 6
        [
          {
            title: "（六）管理限制",
            eId: "control_limit",
            text: "controlLimit",
          },
        ],
        // 7
        [
          {
            title: "（七）技术路线",
            eId: "technical_route",
            text: "technicalRoute",
          },
          {
            title: "目标",
            eId: "target",
            text: "target",
          },
          {
            title: "方案设计原则及依据",
            eId: "scheme_design_basis",
            text: "schemeDesignBasis",
          },
          {
            title: "内容及方案",
            eId: "content_scheme",
            text: "contentScheme",
          },
          {
            title: "废物管理",
            eId: "waste_manager",
            text: "wasteManager",
          },
          {
            title: "辐射防护与核临界安全",
            eId: "protection_safety",
            text: "protectionSafety",
          },
          {
            title: "工业安全",
            eId: "Industrial_safety",
            text: "IndustrialSafety",
          },
          {
            title: "事故应急",
            eId: "accident_emergency",
            text: "accidentEmergency",
          },
        ],
        // 8
        [
          {
            title: "（八）环境影响评估",
            eId: "environmental_assessment",
            text: "environmentalAssessment",
          },
        ],
        // 9
        [
          {
            title: "（九）质量保证措施",
            eId: "quality_control_measure",
            text: "qualityControlMeasure",
          },
        ],
        // 10
        [
          {
            title: "（十）项目周期及初步进度安排",
            eId: "project_period_progress",
            text: "projectPeriodProgress",
          },
        ],
        // 11
        [
          {
            title: "（十一）项目管理",
            eId: "project_manager",
            text: "projectManager",
          },
        ],
        // 12
        [
          {
            title: "（十二）招投标情况",
            eId: "bidding_situation",
            text: "biddingSituation",
          },
        ],
        // 13
        [
          {
            title: "（十三）投资估算和资金来源",
            eId: "investment_funds",
            text: "investmentFunds",
          },
        ],
        // 14
        [
          {
            title: "（十四）结论及需说明的问题",
            eId: "conclusions_questions",
            text: "conclusionsQuestions",
          },
        ],
        // 15
        [
          {
            title: "（十五）附图、附表及附件",
            eId: "annexed_table",
            text: "annexedTable",
          },
        ],
      ],
      rightArr: null,

      // 弹框
      loading: true,

      visible: false,
      tableData: [],
      headerList: {
        "buildVo.areaName": "片区名称",
        "buildVo.buildName": "设施名称",
        wasteName: "特性调查数据名称",
        roomNumber: "房间号",
        deviceTag: "设备位号",
        creatorName: "创建人",
        createTime: "创建时间",
      },
      request: {
        data: null,
        page: 1,
        limit: 5,
      },
      leader: false
    };
  },
  created() {

    this.prjProjectWriteGetUnableAllowTitle();
    if (this.$route.params.data == "editRoadmap") {
      this.nextPage = 7;
    }
    this.techProposal_contentFindById();
  },
  mounted() {
    if (this.$route.params.data == "editRoadmap") {
      //跳转到指定位置
      //查找锚点id
      let toElement = document.getElementById("content_scheme1");
      //锚点存在跳转
      toElement.scrollIntoView();
    }
  },
  beforeDestroy() {
    this.leader = false
    localStorage.removeItem("buildId");
    localStorage.removeItem("proposalName");
  },
  methods: {

    async prjProjectGetLeaderFlagAndRole() {

      const { data } = await prjProjectGetLeaderFlagAndRole({ projectId: localStorage.getItem('projectId') })
      console.log(data);
      if (data) this.leader = data.data.role ? true : data.data.leader ? true : false

    },
    // 查询不可编辑的文档标题
    async prjProjectWriteGetUnableAllowTitle() {
      const res1 = await prjProjectWriteGetUnableAllowTitle({
        wordName: "项目建议书",
        projectId: localStorage.getItem("projectId"),
      });


      const res2 = await prjProjectGetLeaderFlagAndRole({ projectId: localStorage.getItem('projectId') })

      if (res1) this.rightArr = res1.data.data;
      if (res2) this.leader = res2.data.data.role ? true : res2.data.data.leader ? true : false




    },




    // 获取项目建议书的富文本内容
    async techProposal_contentFindById() {
      const res = await techProposal_contentFindById({
        projectProposalId: localStorage.getItem("conductId"),
      });
      if (res) this.textList = Object.fromEntries(
        Object.entries(res.data.data).map(([key, value]) => [key, value ? value + " " : ""])
      )
    },

    // 保存富文本内容
    savaRichTexttoArray(e) {
      if (this.richTextData.length !== 0) {
        let isTrue = this.richTextData.find(
          (item) => item.wordNodeName === e.wordNodeName
        );
        if (!isTrue) {
          this.richTextData.push(e);
        } else {
          this.richTextData = this.richTextData.map((item, index) => {
            if (item.wordNodeName === e.wordNodeName) {
              return {
                ...item,
                htmlText: e.htmlText,
              };
            } else {
              return item;
            }
          });
        }
      } else {
        this.richTextData.push(e);
      }
    },
    // 切换上一页
    handlePrePage() {
      this.nextPage -= 1;
      if (this.nextPage < 1) {
        this.$router.push({ path: "/proposal" });
      }
      this.techProposal_contentFindById();
      window.scroll(0, 0);
      let h = document.getElementsByClassName("pagebox")[0];
      h.scrollTop = 0;
    },
    // 切换下一页并上传富文本内容至数据库
    handleNextPage(page) {
      this.nextPage += 1;
      this.submit(this.richTextData);
      if (page == this.list.length) {
        this.$router.push({
          path: "/proposal",
        });
      }
      window.scroll(0, 0);
      let h = document.getElementsByClassName("pagebox")[0];
      h.scrollTop = 0;
    },
    async submit(textData) {
      console.log(textData);
      const res = await techProposal_contentUpdateProjectProposalContent(
        textData
      );
    },


    //打开废物table模态框
    openWasteModal() {
      console.log("你打开了wasteModal");
      this.isShowWasteModal = true;
      this.buildId = localStorage.getItem("buildId");
      console.log("233传入id为：", this.buildId);
    },

    closeWasteModal() {
      console.log("你关闭了wasteModal");
      this.isShowWasteModal = false;
    },

    // 导出
    async exportProposalText() {
      exportExportProjectProposal(
        {
          projectProposalId: localStorage.getItem("conductId"),
        },
        { responseType: "blob" }
      ).then((res) => {
        if (!res.data) return;
        const blob = new Blob([res.data], { type: "application/msword" });

        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = localStorage.getItem("proposalName");
          elink.style.display = "none";
          console.log(URL.createObjectURL(blob));
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, localStorage.getItem("proposalName"));
        }
      });
    },
    // 返回
    handleBack() {
      this.$router.push({ path: "/proposal" });
    },

    //跳转到设计页面编写 内容和及方案
    async editContentScheme() {
      const res = await FindDecomEngineerStructIdByProposalId({
        proposalId: localStorage.getItem("conductId"),
      });
      if (res) {
        localStorage.setItem("structureId", res.data.data);
      }

      this.$router.push({
        name: "flowChart",
        params: {
          data: "roadmap",
        },
      });
    },

    show() {
      this.visible = !this.visible;
    },

    async requestFn() {
      this.request.data = localStorage.getItem("buildId");
      let res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },

    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    toogleExpand(row) {
      let $table = this.$refs.tab.$refs.table;
      this.tableData.map((item) => {
        if (row.wasteId != item.wasteId) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },

  },
};
</script>

<style lang='less' scoped>
.proposalText {
  .wasteIcon {
    width: 20px;
    margin: 0 20px;
    color: #409eff;
    cursor: pointer;
  }


  .pagebox {
    height: calc(100% - 90px);
    overflow: auto;

    :deep(.w-e-text-container) {
      z-index: 0 !important;
    }

    :deep(.w-e-toolbar) {
      z-index: 1 !important;
    }

    .bottom {
      position: fixed;
      right: 50px;
      bottom: 50px;
      z-index: 2 !important;
    }
  }

  :deep(.el-table__expand-icon .el-icon-arrow-right) {
    display: none;
  }
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  padding-left: 1%;
  margin-bottom: 0;
  width: 27%;
}
</style>