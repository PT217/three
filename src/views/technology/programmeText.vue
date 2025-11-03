<template>
  <div class="programmeText">
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
  exportGetWordInfo,
  exportExport2Word,
  //编辑代实施富文本内容
  exportSaveHtmlInfo,
  // 查询不可编辑的文档标题
  prjProjectWriteGetUnableAllowTitle,
  // 查询顶部表格
  techCharacterFindByBuildId as requestFn,

  prjProjectGetLeaderFlagAndRole
} from "../../utils/api";
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab";
import Dialog from "../../components/Dialog";
import EditText from "../../components/EditText.vue";

export default {
  components: {
    Nav,
    Tab,
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
          name: "代实施方案",
          path: "/programme",
          isClick: false,
        },
        {
          name: "编写文档",
          path: "/programmeText",
          isClick: false,
        },
      ],
      textList: {},
      nextPage: 1,
      richTextData: [],
      rightArr: null,
      list: [
        // 1
        [
          {
            title: "（一）总论",
            eId: "general_info",
            text: "generalInfo",
          },
          {
            title: "项目概述",
            eId: "project_overview",
            text: "projectOverview",
          },
          {
            title: "编制依据",
            eId: "basis_for_preparation",
            text: "basisForPreparation",
          },

          {
            title: "设计原则",
            eId: "design_principles",
            text: "designPrinciples",
          },
          {
            title: "范围及内容",
            eId: "scope_and_content",
            text: "scopeAndContent",
          },
          {
            title: "主要原材料及动力消耗",
            eId: "main_raw_materials_and_power_consumption",
            text: "mainRawMaterialsAndPowerConsumption",
          },
          {
            title: "费用及资金来源",
            eId: "fees_and_sources_of_funding",
            text: "feesAndSourcesOfFunding",
          },
        ],
        // 2
        [
          {
            title: "（二）厂址、设施及环境现状",
            eId: "site_facilities_and_environmental_status",
            text: "siteFacilitiesAndEnvironmentalStatus",
          },
          {
            title: "厂址现状",
            eId: "site_status",
            text: "siteStatus",
          },
          {
            title: "厂址现状-自然环境",
            eId: "natural_info",
            text: "naturalInfo",
          },
          {
            title: "厂址现状-社会环境",
            eId: "social_environment",
            text: "socialEnvironment",
          },
          {
            title: "设施及环境现状",
            eId: "facilities_and_environmental_status",
            text: "facilitiesAndEnvironmentalStatus",
          },
          {
            title: "主要运行史",
            eId: "major_operational_history",
            text: "majorOperationalHistory",
          },
          {
            title: "放射性源项",
            eId: "radioactive_source_item",
            text: "radioactiveSourceItem",
          },
          {
            title: "非放射性有毒有害物质",
            eId: "non_radioactive_toxic_and_harmful_substances",
            text: "nonRadioactiveToxicAndHarmfulSubstances",
          },
          {
            title: "相关配套设施及条件",
            eId: "relevant_supporting_facilities_and_conditions",
            text: "relevantSupportingFacilitiesAndConditions",
          },
          {
            title: "现状综合评价",
            eId: "comprehensive_evaluation_of_the_current_situation",
            text: "comprehensiveEvaluationOfTheCurrentSituation",
          },
        ],
        // 3
        [
          {
            title: "（三）管理限制",
            eId: "manage_restrictions",
            text: "manageRestrictions",
          },
        ],
        // 4
        [
          {
            title: "（四）实施方案",
            eId: "implementation_info",
            text: "implementationInfo",
          },
          {
            title: "总体方案",
            eId: "overall_scenario",
            text: "overallScenario",
          },
          {
            title: "前期工作准备",
            eId: "preparation_for_pre_work",
            text: "preparationForPreWork",
          },
          {
            title: "具体实施方案",
            eId: "specific_implementation_plans",
            text: "specificImplementationPlans",
          },
          {
            title: "具体实施方案-放射性物料排空和废物的回收清理",
            eId: "emptying_of_radioactive_materials",
            text: "emptyingOfRadioactiveMaterials",
          },
          {
            title: "具体实施方案-清洗去污",
            eId: "cleaning_and_decontamination",
            text: "cleaningAndDecontamination",
          },
          {
            title: "具体实施方案-拆除（解体）",
            eId: "disintegrate",
            text: "disintegrate",
          },
          {
            title: "具体实施方案-建（构）筑物拆除",
            eId: "dismantle",
            text: "dismantle",
          },
          {
            title: "具体实施方案-监护封存",
            eId: "guardianship_seals",
            text: "guardianshipSeals",
          },
          {
            title: "具体实施方案-环境整治",
            eId: "environmental_remediation",
            text: "environmentalRemediation",
          },
          {
            title: "具体实施方案-人流物流",
            eId: "people_flow_logistics",
            text: "peopleFlowLogistics",
          },
          {
            title: "综态特性调查",
            eId: "com_characteristics_investigation",
            text: "comCharacteristicsInvestigation",
          },
          {
            title: "综态特性调查-调查范围",
            eId: "scope_of_survey",
            text: "scopeOfSurvey",
          },
          {
            title: "综态特性调查-调查报告大纲",
            eId: "outline_of_investigation_report",
            text: "outlineOfInvestigationReport",
          },
          {
            title: "相关专业设计",
            eId: "related_professional_design",
            text: "relatedProfessionalDesign",
          },
          {
            title: "相关专业设计-总图、运输",
            eId: "general_drawing_transportation",
            text: "generalDrawingTransportation",
          },
          {
            title: "相关专业设计-建筑",
            eId: "building",
            text: "building",
          },
          {
            title: "相关专业设计-结构",
            eId: "structure",
            text: "structure",
          },
          {
            title: "相关专业设计-给水、排水",
            eId: "water_supply_drainage",
            text: "waterSupplyDrainage",
          },
          {
            title: "相关专业设计-采暖、通风和空气调节",
            eId: "heating_ventilation_air_conditioning",
            text: "heatingVentilationAirConditioning",
          },
          {
            title: "相关专业设计-电气",
            eId: "electric",
            text: "electric",
          },
          {
            title: "相关专业设计-弱电",
            eId: "weak",
            text: "weak",
          },
          {
            title: "相关专业设计-辐射监测",
            eId: "radiation_monitoring",
            text: "radiationMonitoring",
          },
          {
            title: "相关专业设计-设备",
            eId: "equipment",
            text: "equipment",
          },
          {
            title: "厂址清理及恢复",
            eId: "site_cleanup_restoration",
            text: "siteCleanupRestoration",
          },
          {
            title: "厂址开放",
            eId: "site_open",
            text: "siteOpen",
          },
        ],
        // 5
        [
          {
            title: "（五）废物管理",
            eId: "waste_management",
            text: "wasteManagement",
          },
          {
            title: "废物管理概述",
            eId: "overview_of_waste_management",
            text: "overviewOfWasteManagement",
          },
          {
            title: "放射性气体废物",
            eId: "radioactive_gas_waste",
            text: "radioactiveGasWaste",
          },
          {
            title: "放射性液体废物",
            eId: "radioactive_liquid_waste",
            text: "radioactiveLiquidWaste",
          },
          {
            title: "固体废物",
            eId: "solid_waste",
            text: "solidWaste",
          },
        ],
        // 6
        [
          {
            title: "（六）职业安全卫生",
            eId: "occupational_safety_health",
            text: "occupationalSafetyHealth",
          },
          {
            title: "辐射安全与核临界安全",
            eId: "radiation_safety_nuclear_critical_safety",
            text: "radiationSafetyNuclearCriticalSafety",
          },
          {
            title: "辐射安全与核临界安全-安全概述",
            eId: "security_overview",
            text: "securityOverview",
          },
          {
            title: "辐射安全与核临界安全-职业照射控制",
            eId: "occupational_irradiation_control",
            text: "occupationalIrradiationControl",
          },
          {
            title: "辐射安全与核临界安全-主要辐射防护措施",
            eId: "main_radiation_protection_measures",
            text: "mainRadiationProtectionMeasures",
          },
          {
            title: "辐射安全与核临界安全-核临界安全措施",
            eId: "nuclear_critical_safety_measures",
            text: "nuclearCriticalSafetyMeasures",
          },
          {
            title: "工业安全",
            eId: "industrial_safety",
            text: "industrialSafety",
          },
          {
            title: "工业安全-防火",
            eId: "fire_proof",
            text: "fireProof",
          },
          {
            title: "工业安全-防电伤",
            eId: "prevent_electrical_injuries",
            text: "preventElectricalInjuries",
          },
          {
            title: "工业安全-防噪音",
            eId: "noise_proof",
            text: "noiseProof",
          },
          {
            title: "工业安全-防机械及其他伤害",
            eId: "protection_against_mechanical_other_injuries",
            text: "protectionAgainstMechanicalOtherInjuries",
          },
        ],
        // 7
        [
          {
            title: "（七）事故应急",
            eId: "accident_response",
            text: "accidentResponse",
          },
        ],
        // 8
        [
          {
            title: "（八）安全分析及环境影响评价",
            eId: "safety_analysis_environmental_impact_assessment",
            text: "safetyAnalysisEnvironmentalImpactAssessment",
          },
        ],
        // 9
        [
          {
            title: "（九）质量保证措施",
            eId: "quality_assurance_measures",
            text: "qualityAssuranceMeasures",
          },
        ],
        // 10
        [
          {
            title: "（十）组织机构与项目管理",
            eId: "organizational_project_management",
            text: "organizationalProjectManagement",
          },
          {
            title: "组织机构及人员编制",
            eId: "organizational_structure_staffing",
            text: "organizationalStructureStaffing",
          },
          {
            title: "组织机构及人员编制-组织机构",
            eId: "organizational_structure",
            text: "organizationalStructure",
          },
          {
            title: "组织机构及人员编制-人员编制",
            eId: "staffing",
            text: "staffing",
          },
          {
            title: "进度",
            eId: "project_progress",
            text: "projectProgress",
          },
        ],
        // 11
        [
          {
            title: "（十一）工程招投标方案",
            eId: "project_bidding_scheme",
            text: "projectBiddingScheme",
          },
        ],
        // 12
        [
          {
            title: "（十二）投资预算和资金来源",
            eId: "investment_budgets_funding_sources",
            text: "investmentBudgetsFundingSources",
          },
          {
            title: "投资情况",
            eId: "investment_situation",
            text: "investmentSituation",
          },
          {
            title: "编制依据",
            eId: "invest_basis_preparation",
            text: "investBasisPreparation",
          },
          {
            title: "编制方法",
            eId: "invest_preparation_methodology",
            text: "investPreparationMethodology",
          },
          {
            title: "工程投资",
            eId: "engineering_investment",
            text: "engineeringInvestment",
          },
          {
            title: "其他说明",
            eId: "additional_instructions",
            text: "additionalInstructions",
          },
        ],
        // 13
        [
          {
            title: "（十三）附表、附图和附件",
            eId: "annex",
            text: "annex",
          },
        ],
      ],

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
    this.exportGetWordInfo();
  },
  mounted() { },
  beforeDestroy() {
    this.leader = false
    localStorage.removeItem("buildId");
  },
  methods: {
    // 查询不可编辑的文档标题
    async prjProjectWriteGetUnableAllowTitle() {
      const res1 = await prjProjectWriteGetUnableAllowTitle({
        wordName: "代实施方案",
        projectId: localStorage.getItem("projectId"),
      });
      const res2 = await prjProjectGetLeaderFlagAndRole({ projectId: localStorage.getItem('projectId') })

      if (res1) this.rightArr = res1.data.data;
      if (res2) this.leader = res2.data.data.role ? true : res2.data.data.leader ? true : false
    },
    // 获取富文本内容
    async exportGetWordInfo() {
      let res = await exportGetWordInfo({
        conductId: localStorage.getItem("conductId"),
      });

      if (res) this.textList = Object.fromEntries(
        Object.entries(res.data.data).map(([key, value]) => [key, value ? value + " " : " "])
      )
    },
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
    handlePrePage() {
      this.nextPage -= 1;
      if (this.nextPage < 1) {
        this.$router.push({ path: "/programme" });
      }

      this.exportGetWordInfo();
      window.scroll(0, 0);
      let h = document.getElementsByClassName("pagebox")[0];
      h.scrollTop = 0;
    },
    handleNextPage(page) {
      this.nextPage += 1;
      this.submit(this.richTextData);
      if (page == this.list.length) {
        this.$router.push({
          path: "/programme",
        });
      }
      window.scroll(0, 0);
      let h = document.getElementsByClassName("pagebox")[0];
      h.scrollTop = 0;
    },

    // 导出
    async exportProposalText() {
      exportExport2Word(
        { conductId: localStorage.getItem("conductId") },
        {
          responseType: "blob",
        }
      ).then((res) => {
        if (!res) return;
        const blob = new Blob([res.data], { type: "application/msword" });
        // const fileName = `${localStorage.getItem("name")}.doc`;

        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = decodeURI(res.headers.filename);
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

    // 按钮跳转
    handleBack() {
      this.$router.push({ path: "/programme" });
    },

    async submit(textData) {
      const res = await exportSaveHtmlInfo(textData);
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
.programmeText {
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
