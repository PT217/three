<template>
  <div class="x6-vue-wrap">
    <!-- 顶部菜单栏 -->
    <div class="toolbar">
      <span class="rate"> {{ parseInt(zoomSize.current * 100) }}% </span>
      <span class="v-line"></span>
      <span class="item" @click.stop="toolbarFUN('zoomAdd')" title="放缩比例+10%">放大</span>
      <span class="item" @click.stop="toolbarFUN('zoomReduce')" title="放缩比例-10%">缩小</span>
      <span class="v-line"></span>
      <span class="item" @click.stop="toolbarFUN('clear')" title="清空整个画布">清空</span>
      <span class="v-line"></span>
      <span class="item" @click.stop="toolbarFUN('undo')">撤销</span>
      <span class="item" @click.stop="toolbarFUN('redo')">重做</span>

      <span class="v-line"></span>
      <span class="item" @click.stop="toolbarFUN('png')" title="下载图片">下载图片</span>

      <span class="v-line"></span>
      <span class="item" @click.stop="toolbarFUN('save')">保存数据</span>

      <span class="item">
        <el-tooltip effect="dark" placement="bottom">
          <div slot="content">
            <p>1.Ctrl+Z：快捷撤销</p>
            <p>2.Ctrl+X：快捷剪切</p>
            <p>3.Ctrl+C：快捷复制</p>
            <p>4.Ctrl+V：快捷粘贴</p>
            <p>5.Delete | Backspace：快捷删除</p>
            <p>6.Shift+鼠标左键：可以拖动画布</p>
            <p>7.单击节点可调整尺寸大小</p>
            <p>8.支持双击模块节点修改内容</p>
            <p>9.鼠标移动至节点可触发节点连接桩显示</p>
            <p>10.支持鼠标按住拖动框选节点及单击选中节点</p>
            <p>11.支持鼠标移入泳道修改泳道名称,限制名称9个字符</p>
            <p>12.Ctrl+鼠标滚轮：可以放大缩小画布</p>
          </div>
          <span class="tips">使用说明</span>
        </el-tooltip>
      </span>
    </div>
    <!-- 容器 -->
    <div id="content" class="content">
      <div id="stencil" class="shapes"></div>
      <div id="container" class="x6-graph"></div>
      <!-- <div id="minimap" class="minimap"></div> -->
    </div>
    <!-- 弹框 -->
    <Dialog :visible="x6Visible" :title="(x6Title = isFirst ? '模块详细内容' : '新增费用')" @show="x6Show" @submit="x6Submit"
      width="90%">
      <el-form v-if="isFirst" id="form" ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="修改节点内容:" v-show="form.workContext !== null" prop="workContext">
              <el-input maxlength="15" show-word-limit v-model="form.workContext" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频:">
              <el-select v-model="form.fkMultiId.multiId" placeholder="请选择视频" filterable clearable default-first-option>
                <div class="videoOptions">
                  <el-option v-for="(item, index) in videoList" :key="index" :label="item.fileName"
                    :value="item.multiId"></el-option>
                </div>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="时间:" prop="timeValue">
              <el-date-picker v-model="form.timeValue" type="daterange" range-separator="至" align="left"
                start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工艺简述:">
              <el-input type="textarea" maxlength="50" show-word-limit v-model="form.processDescription"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工艺明细:" prop="note">
              <Edit ref="note" id="note" eId="note" :text="form.note" @Edit="handleEditText"></Edit>
            </el-form-item>
          </el-col>

          <el-col :span="7">
            <el-form-item class="search">
              <el-col :span="20">
                <el-input size="mini" clearable @input="clearInputValue" v-model="searchValue"
                  placeholder="请输入费用名称"></el-input></el-col>
              <el-col :span="4">
                <el-button size="mini" type="primary" @click="activeHandleSearch">搜索</el-button>
              </el-col>

            </el-form-item>
          </el-col>

          <el-col :span="17">
            <el-form-item label-width="17px">
              <el-button size="mini" type="primary" @click="activeHandleClick">新增</el-button>

              <el-tooltip effect="dark" content="费用单价*数量*辐射场计算系数" placement="bottom">
                <el-tag size="small" type="success" style="margin:0 10px;">人工费计算规则</el-tag>
              </el-tooltip>
              <el-tooltip effect="dark" content="费用单价*数量*(1+国内运杂费%+设备安装费%)" placement="bottom">
                <el-tag size="small" type="warning">设备费计算规则</el-tag>
              </el-tooltip>

            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="费用:">
              <el-table :data="form.payList" :max-height="maxHeight" class="firstTab">
                <el-table-column v-for="(tableValue, tableKey, index) in newTableArrHeaderList" :key="index"
                  :label="tableValue" :prop="tableKey" align="left">
                  <template slot-scope="scope">
                    <el-form-item v-if="tableKey == 'amount'" :error="errorMsg">
                      <el-input maxlength="7" show-word-limit v-model.trim="scope.row.amount"
                        oninput="if (value < 0) value = 0;" @input="numBlur(scope)"></el-input>
                    </el-form-item>
                    <div v-else>{{ scope.row[tableKey] }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="left">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="newTableArrDel(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form v-else :model="form" :inline="true">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <el-input size="mini" clearable @input="basicCostFindCostAndParamClear" v-model="activeArrReq.data.costName"
                placeholder="请输入费用名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="dataParamCostPage('搜索')">搜索</el-button>
            </el-form-item>
          </el-col>

          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="辐射场系数:" v-show="activeArrReq.data.costGroupId == '4'" prop="paramCode">
                  <el-select v-model="form.paramCode" placeholder="选择系数" @change="paramChange">
                    <el-option v-for="item in paramList" :key="item.paramCode" :label="item.note"
                      :value="item.paramCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-show="activeArrReq.data.costGroupId == '4'" label="是否为外包工程:">
                  <el-checkbox v-model="form.epibolyFlag" :false-label="0" :true-label="1"
                    @change="handleCheckChange($event)"></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-tabs v-model="activeArrReq.data.costGroupId" @tab-click="activeHandleClick">
              <el-tab-pane v-for="(item, index) in costList" :key="item.costGroupName" :label="item.costGroupName"
                :name="item.costGroupId + ''">
                <!-- 表格 -->
                <el-table ref="arrTable" :data="activeArr" v-loading="activeLoading" element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading" style="width: 100%" @selection-change="activeSelectArray"
                  :row-key="(row) => row.costId">
                  <el-table-column width="28" type="selection" :selectable="handleSelectable" reserve-selection>
                  </el-table-column>
                  <el-table-column v-for="(
                      activeValue, activeKey, activeIndex
                    ) in activeArrHeaderList" :key="activeIndex" :label="activeValue" :prop="activeKey" align="left">
                  </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="tablePagination">
                  <el-pagination background :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                    layout="total,sizes,prev,pager,next" @size-change="activeHandleSizeChange"
                    @current-change="activeHandleCurrentChange" :current-page="activeArrReq.page"
                    :page-size="activeArrReq.limit" :total="activeArrReq.total"></el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import {
  // 树形结构目录
  techItem_treeGetTree,
  // 视频列表
  dataMultimediaPage,
  // 所有费用分类
  dataParamCost_groupList,
  // 通过分类id获取费用
  dataParamCostPage,
  // 获取辐射场系数
  dataReportQuery,
  // 通过ID获取模块详细信息
  techItemGetItem,
  // 查询流程图信息
  techStructure_flushGetStructureFlush,
  // 保存流程图信息
  techStructure_flushSave,
  // 保存单个模块信息
  techItemAdd,
} from "../utils/api";
import { Graph, Addon, DataUri, Vector, Shape } from "@antv/x6";
import Edit from "../components/Edit.vue";
import Dialog from "../components/Dialog.vue";
export default {
  name: "x6",
  components: {
    Edit,
    Dialog,
  },
  data() {
    return {
      // 方案id
      structureId: localStorage.getItem(
        "structureId"
      ),
      // 流程图内容
      structureFlushContext: "",
      graph: Graph,
      stencil: Addon.Stencil,
      zoomSize: {
        min: 0.1,
        max: 2.0,
        current: 1.0,
      },
      curCel: null,
      color: {
        none: "none",
        black: "#000",
        white: "#fff",
        ports: "#31d0c6",
      },
      keyboard: {
        ctrl: false,
      },
      // 树状结构目录
      treeList: [],
      // 视频列表
      videoList: [],
      videoReq: {
        data: {
          fileName: "",
        },
        page: 1,
        limit: 1000,
      },
      // 所有费用分类
      costList: [],
      // 通过id获取费用分类
      activeArrReq: {
        data: {
          costGroupId: "1",
          costName: "",
        },
        page: 1,
        limit: 10,
        total: 10,
      },
      // 辐射场系数数据
      paramList: [],

      // 修改模块内容
      form: {
        // workContext: null,
        fkMultiId: {
          multiId: "",
        },
        fkItemId: {
          id: "",
        },
      },
      // 数量错误
      errorMsg: "",

      rules: {
        // 内容
        workContext: [
          { required: true, message: "工作内容不能为空", trigger: "blur" },
        ],
        // 时间
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
      // 弹框状态
      x6Visible: false,
      x6Title: "",
      // 泳道
      itemName: "",
      // 弹框状态判断
      isFirst: true,

      // 第一层分类的表头
      newTableArrHeaderList: {
        payName: "费用名称",
        costGroupName: "费用分类",
        specModels: "规格型号/增长比率",
        costUnit: "单位",
        payPrice: "单价",
        amount: "数量",
        payTotal: "合计",
        comment: "备注",
      },
      // 第一层最大高度
      maxHeight: "500px",
      // 当前的分类数组数据
      activeArr: [],
      // 第二层分类的表头
      activeArrHeaderList: {
        costName: "费用名称",
        specModels: "规格型号/增长比率",
        price: "单价",
        costUnit: "单位",
        comment: "备注",
      },
      // 新分类
      testArr: [[], [], [], [], [], [], []],
      // 切换分类时的状态
      activeLoading: true,
      // 搜素内容
      searchValue: "",
      searchArr: [],


      // 时间默认值
      // timeValue: []
    };
  },
  created() {
    // 获取视频列表
    this.dataMultimediaPage();
    // 获取树状列表
    this.techItem_treeGetTree();
    // 获取所有的费用分类
    this.dataParamCost_groupList();
    // 获取辐射场系数
    this.dataReportQuery();
  },
  mounted() {
    const graph = this.initX6FUN();
    this.initRegisterNodeFUN();
    this.initEventFUN(graph);
    this.initKeyboardFUN(graph);
    this.renderDataFUN();
    this.autoSizeFUN(graph);
  },
  methods: {
    // 初始化x6 graph图表并配置参数
    initX6FUN() {
      const container = document.getElementById("container");

      const graph = new Graph({
        container: container,
        width: container.offsetWidth,
        height: container.offsetHeight,
        // 缩放节点
        resizing: true,
        // 键盘快捷键
        keyboard: true,
        // 剪切板
        clipboard: true,
        // 对齐线
        snapline: true,
        // 旋转节点
        rotating: true,
        // 点选/框选
        selecting: {
          enabled: true,
          rubberband: true,
          showNodeSelectionBox: true,
          // 是否显示边的选择框
          showEdgeSelectionBox: true,
        },
        // 网格
        // grid: {
        //   size: 10,
        //   visible: true,
        //   type: "doubleMesh",
        //   args: [
        //     {
        //       color: "#E7E8EA",
        //       thickness: 1,
        //     },
        //     {
        //       color: "#CBCED3",
        //       thickness: 1,
        //       factor: 5,
        //     },
        //   ],
        // },

        // 画布拖拽平移
        panning: {
          enabled: true,
          eventTypes: ["leftMouseDown", "rightMouseDown", "mouseWheel"],
          modifiers: "shift",
          // modifiers: "ctrl",
        },
        // 鼠标滚轮的默认行为是滚动页面
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: false, // 是否将鼠标位置作为中心缩放，默认为 true。
          modifiers: "ctrl",
          minScale: 0.5,
          maxScale: 2,
        },
        // 高亮选项
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              padding: 12,
              attrs: {
                "stroke-width": 10,
                stroke: this.color.ports,
                opacity: 0.3,
                fill: this.color.white,
              },
            },
          },
        },
        // 连线选项
        connecting: {
          // 连线的过程中距离节点或者连接桩 20px 时会触发自动吸附
          snap: {
            radius: 20,
          },
          // 是否允许在相同的起始节点和终止之间创建多条边
          allowMulti: false,
          // 是否允许连接到画布空白位置的点
          allowBlank: false,
          // 是否允许创建循环连线
          allowLoop: false,
          // 是否允许边链接到节点
          allowNode: false,
          // 是否允许边链接到链接桩
          allowPort: true,
          // 拖动边时，是否高亮显示所有可用的连接桩或节点
          highlight: true,
          // 路由将边的路径点 vertices 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点
          router: {
            name: "manhattan",
          },
          // 连接器将起点、路由返回的点、终点加工为 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 normal
          connector: {
            name: "rounded",
            args: {
              radius: 8,
            },
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: "#A2B1C3",
                  strokeWidth: 2,
                  targetMarker: {
                    name: "block",
                    width: 12,
                    height: 8,
                  },
                },
              },
              zIndex: 0,
            });
          },
          validateConnection({ sourceMagnet, targetMagnet }) {
            return !!targetMagnet;
          },
        },

        // 撤销/重做
        history: {
          enabled: true,
          beforeAddCommand(event, args) {
            // 忽略节点和边tool的历史变更
            if (args.key === "tools" || args.key === "zIndex") {
              return false;
            }
            if (args.key === undefined && graph.isEdge(args.cell)) {
              args.cell.removeTools();
            }
          },
        },
        scroller: {
          enabled: false,
        },
        // minimap: {
        //   enabled: true,
        //   container: document.getElementById("minimap"),
        //   width: 198,
        //   height: 198,
        //   padding: 10,
        //   scalable: false,
        //   graphOptions: {
        //     async: true,
        //     createCellView(cell) {
        //       // 在小地图中不渲染边
        //       if (cell.isEdge()) {
        //         return null;
        //       }
        //     },
        //   },
        // },
      });
      this.graph = graph;
      return graph;
    },

    // 获取树状结构
    async techItem_treeGetTree() {
      let res = await techItem_treeGetTree();
      if (res.status == 200) {
        res.data.data.map((item) => {
          item["groups"] = [];
          item.children.map((i) => {
            item.groups.push({
              children: i.children,
              name: i.id,
              title: i.catelogName,
              collapsed: true,
              graphHeight: i.children.length * 35,
            });
          });
          this.treeList.push(item);

          console.log(this.treeList);
        });
        this.initStencilFUN(this.treeList, this.graph);
      }
    },

    // 获取视频列表
    async dataMultimediaPage() {
      const res = await dataMultimediaPage(this.videoReq);
      if (res) {
        this.videoList = res.data.data.list;
      }
    },

    // 获取所有费用分类数据
    async dataParamCost_groupList() {
      const res = await dataParamCost_groupList();
      if (res) this.costList = res.data.data
    },

    // 获取辐射场系数
    async dataReportQuery() {
      const res = await dataReportQuery();
      if (res) {
        this.paramList = res.data.data;
      }
    },

    // 通过id获取分类数据
    async dataParamCostPage(state) {
      if (state) {
        this.activeArrReq.page = 1;
      }
      this.activeLoading = true;
      const res = await dataParamCostPage({
        ...this.activeArrReq, data: {
          costGroupId: Number(this.activeArrReq.data.costGroupId),
          costName: this.activeArrReq.data.costName,
        }
      });
      if (res) {
        this.activeArr = res.data.data.list;
        this.activeArrReq.page = res.data.data.pageNum;
        this.activeArrReq.limit = res.data.data.pageSize;
        this.activeArrReq.total = res.data.data.total;
        // 处理是否打勾
        this.activeLoading = false;
        this.isFirst = false;
        this.$nextTick(() => {
          this.searchArr.map((newTableArrItem) => {
            this.activeArr.map((activeArrItem) => {
              if (
                newTableArrItem.payId.costId == activeArrItem.costId
              ) {
                this.$refs.arrTable[
                  this.activeArrReq.data.costGroupId - 1
                ].toggleRowSelection(activeArrItem, true);
              }
            });
          });
        });
      }
    },

    // 配置左边数据结构
    initStencilFUN(data, graph) {
      if (this.treeList.length != 0) {
        this.stencil = new Addon.Stencil({
          title: "泳道节点",
          target: graph,
          stencilGraphWidth: 200,
          stencilGraphHeight: 40,
          layoutOptions: {
            columns: 1,
            columnWidth: 180,
            rowHeight: 30,
          },
        });
        const r = graph.createNode({
          shape: "process",
          width: 180,
          height: 25,
          text: "泳道",
        });
        const stencilContainer = document.querySelector("#stencil");
        if (stencilContainer) {
          stencilContainer.appendChild(this.stencil.container);
        }
        this.stencil.load([r]);

        data.forEach((item, index) => {
          this.stencil = new Addon.Stencil({
            title: `${index + 1}.${item.catelogName}`,
            target: graph,
            stencilGraphWidth: 200,
            stencilGraphHeight: 100,
            layoutOptions: {
              columns: 1,
              columnWidth: 180,
              rowHeight: 30,
            },
            collapsable: true,

            groups: item.groups,
          });

          const stencilContainer = document.querySelector("#stencil");

          if (stencilContainer) {
            stencilContainer.appendChild(this.stencil.container);
          }
          item.groups.map((i) => {
            const data = i.children.map((child) =>
              graph.createNode({
                width: 180,
                height: 25,
                shape: "text",
                text: child.catelogName,
                attrs: {
                  body: {
                    strokeWidth: 1,
                    stroke: "#5F95FF",
                    fill: "transparent",
                    rx: 4,
                    ry: 4,
                  },
                  text: {
                    fontSize: 12,
                    fill: "#262626",
                  },
                },
                data: child,
              })
            );
            this.stencil.load(data, `${i.name}`);
          });
        });
      }
    },

    // 配置链接桩的参数并注册节点
    initRegisterNodeFUN() {
      const ports = {
        groups: {
          top: {
            position: "top",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#5F95FF",
                strokeWidth: 1,
                fill: "#fff",
                style: {
                  visibility: "hidden",
                },
              },
            },
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#5F95FF",
                strokeWidth: 1,
                fill: "#fff",
                style: {
                  visibility: "hidden",
                },
              },
            },
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#5F95FF",
                strokeWidth: 1,
                fill: "#fff",
                style: {
                  visibility: "hidden",
                },
              },
            },
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#5F95FF",
                strokeWidth: 1,
                fill: "#fff",
                style: {
                  visibility: "hidden",
                },
              },
            },
          },
        },
        items: [
          {
            group: "top",
          },
          {
            group: "right",
          },
          {
            group: "bottom",
          },
          {
            group: "left",
          },
        ],
      };
      Graph.registerNode(
        "text",
        {
          inherit: "text-block",
          ports: { ...ports },
        },
        true
      );
      Graph.registerNode(
        "process",
        {
          inherit: "text-block",
          attrs: {
            label: {
              contenteditable: "true",
            },
            body: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "transparent",
              rx: 4,
              ry: 4,
            },
            text: {
              fontSize: 12,
              fill: "#262626",
            },
          },
        },
        true
      );
    },

    // 链接桩显示与隐藏处理
    togglePorts(container, show) {
      const ports = container.querySelectorAll(".x6-port-body");
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? "visible" : "hidden";
      }
    },

    //键盘事件
    initKeyboardFUN(graph) {
      graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.copy(cells);
        }
        return false;
      });
      graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = graph.getSelectedCells();
        if (cells.length) {
          graph.cut(cells);
        }
        return false;
      });
      graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!graph.isClipboardEmpty()) {
          const cells = graph.paste({ offset: 50 });
          graph.cleanSelection();
        }
        return false;
      });
      graph.bindKey(["Delete", "Backspace"], () => {
        const cells = graph.getSelectedCells();
        console.log(cells);
        if (cells.length) {
          graph.removeCells(cells);
          this.toolbarFUN("save");
        }
      });
      graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (graph.history.canUndo()) {
          graph.history.undo();
        }
        return false;
      });
      graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
        if (graph.history.canRedo()) {
          graph.history.redo();
        }
        return false;
      });
      graph.bindKey(["meta+a", "ctrl+a"], () => {
        const nodes = graph.getNodes();
        if (nodes) {
          graph.select(nodes);
        }
      });
    },

    //监听事件
    initEventFUN(graph) {
      // 获取容器
      const container = document.getElementById("container");
      // 双击显示弹框
      graph.on("cell:dblclick", async ({ cell, view }) => {

        if (cell.port.ports.length) {
          // this.curCel?.attr("body/stroke", "#5F95FF");
          this.curCel = cell;
          // this.curCel?.attr("body/stroke", "#FFD700");
          let workContext = null;
          // return
          if (cell.getAttrs()?.text?.text) {
            return (workContext = cell.getAttrs()?.text?.text);
          }
          if (cell.getAttrs()?.label?.text) {
            workContext = cell.getAttrs()?.label?.text;
          }
          const res = await techItemGetItem({
            itemId: cell.id,
            structureId: this.structureId,
          });

          console.log(this.form.note);
          console.log(res);
          if (res) {
            console.log(res.data.data);

            this.form = res.data.data;
            // this.form.note = '9999'
            // this.form.note = this.form.note ? this.form.note + " " : " "
            console.log(this.form.note);
            if (res.data.data.fkMultiId == null) {
              this.form.fkMultiId = {
                multiId: "",
              };
            }
            this.paramList.forEach((item) => {
              if (this.form.paramCode == item.paramCode) {
                this.form["coefficient"] = item.payCoefficient;
              }
            });
            this.$set(this.form, "timeValue", [
              this.form.startTime,
              this.form.endTime,
            ]);
          } else {

            this.form = {
              workContext: workContext,
              fkMultiId: {
                multiId: "",
              },
              fkItemId: {
                id: cell.data.id,
              },
              id: cell.id,
              epibolyFlag: 0,
              timeValue: [],
              payList: [],
              coefficient: "200%",
              paramCode: "R01",
              note: ""
            };

          }
          this.$nextTick(() => {
            this.$refs.note.editor.txt.html(this.form.note)
          })
          this.testArr = [];
          this.searchArr = this.form.payList;
          this.activeArrReq.data.costGroupId = "1";
          this.x6Show();
        }
      });
      // 泳道编辑
      graph.on("node:mouseenter", (ev) => {
        if (ev.cell.port.ports.length == 0) {
          const process = ev.view.container.querySelector("div");

          process.classList.add("process");
          if (process) {
            process.focus();
            process.addEventListener("input", () => {
              onInput();
            });
            const onInput = () => {
              if (process.innerHTML.length < 10) {
                this.itemName = process.innerHTML;
                ev.cell.attr("label/text", this.itemName);
              } else {
                process.innerHTML = this.itemName;
                this.$message({
                  offset: 170,
                  duration: "1000",
                  message: "最大输入9个字符",
                  type: "error",
                });
                ev.cell.attr("label/text", this.itemName);
              }
            };
            process.removeEventListener("input", onInput);
          }
          ev.cell.toBack();
        }
        this.togglePorts(container, true);
      });
      // 鼠标移除链接桩隐藏
      graph.on("node:mouseleave", () => {
        this.togglePorts(container, false);
      });
      // 连线改变
      graph.on("edge:change:*", ({ options }) => {
        if (options.toolId) {
          this.togglePorts(container, true);
        }
      });
      // 连线
      graph.on("edge:connected", ({ isNew, edge }) => {
        // 非新建的边
        if (!isNew) {
          this.togglePorts(container, false);
        }
      });
      // 连线移入
      graph.on("edge:mouseenter", ({ cell }) => {
        let tools = [
          {
            name: "source-arrowhead",
            args: {
              tagName: "rect",
              attrs: {
                fill: this.color.black,
                stroke: this.color.none,
                y: -1,
                width: 11,
                height: 2,
              },
            },
          },
          {
            name: "target-arrowhead",
            args: {
              attrs: {
                "stroke-width": 1,
                fill: this.color.ports,
                d: "M -12 -8 3 0 -12 8 -9 0 Z",
              },
            },
          },
        ];
        if (this.keyboard.ctrl) {
          tools.push({
            name: "vertices",
          });
        }
        cell.addTools(tools);
      });
      // 连线移出
      graph.on("edge:mouseleave", ({ cell }) => {
        cell.removeTools();
      });

      graph.on("blank:click", () => {
        // this.curCel?.attr("body/stroke", "#5F95FF");
        this.togglePorts(container, false);
        let edges = graph.getEdges();
        if (edges.length > 0) {
          edges.forEach((e) => {
            e.removeTools();
          });
        }
      });
    },

    // 按钮点击事件
    async toolbarFUN(type) {
      switch (type) {
        // 放大
        case "zoomAdd":
          {
            if (this.isBigFUN(this.zoomSize.max, this.zoomSize.current)) {
              this.zoomSize.current += 0.1;
              this.graph.zoomTo(this.zoomSize.current);
            }
          }
          break;
        // 缩小
        case "zoomReduce":
          {
            if (this.isBigFUN(this.zoomSize.current, this.zoomSize.min)) {
              this.zoomSize.current -= 0.1;
              this.graph.zoomTo(this.zoomSize.current);
            }
          }
          break;
        // 清空
        case "clear":
          {
            this.graph.clearCells();
          }
          break;
        // 撤销
        case "undo":
          {
            this.graph.history.undo();
          }
          break;
        // 重做
        case "redo":
          {
            this.graph.history.redo();
          }
          break;
        // 保存流程数据
        case "save":
          {
            const json = this.graph.toJSON();
            this.graph.toPNG(async (png) => {
              const res =
                await techStructure_flushSave(
                  {
                    structureId: this.structureId,
                    structureFlushContext:
                      JSON.stringify(json),
                    structPhoto: png,
                  }
                );
              this.x6Visible = false;
            });
          }
          break;
        // 导出图片
        case "png":
          {
            this.graph.toPNG((png) => {
              DataUri.downloadDataUri(png, "chart.png");
            });
          }
          break;
      }
    },

    // 加载之前的数据
    async renderDataFUN() {
      const res =
        await techStructure_flushGetStructureFlush(
          {
            structureId: this.structureId,
          }
        );

      console.log(res);
      if (res) this.graph.fromJSON(JSON.parse(res.data.data));
    },

    // 画布自适应
    autoSizeFUN(graph) {
      const resizeFn = () => {
        const content = document.getElementById("content");
        if (content) {
          let width = content.offsetWidth;
          let height = content.offsetHeight;
          graph.resize(width, height);
        }
      };
      window.addEventListener("resize", resizeFn);
    },

    // 比较大小
    isBigFUN(num1, num2) {
      return num1 - num2 > 0.0001;
    },

    //弹框状态
    x6Show() {
      if (this.x6Visible && this.isFirst == false) {
        this.isFirst = true;
        this.x6Visible = false;
      }
      this.x6Visible = !this.x6Visible;
    },

    // 弹框开始的禁用处理
    handleSelectable(row) {
      return !this.searchArr.some(
        (item) => item.payId.costId === row.costId
      );
    },

    // 切换分类列表及打勾处理
    activeHandleClick(e) {
      console.log(this.form);
      this.searchValue = "";
      this.activeArrReq.data.costName = "";
      if (e && e.name) {
        this.activeArrReq.page = 1;
      }
      this.dataParamCostPage();
    },

    // 选中的分类数据
    activeSelectArray(arr) {
      this.testArr[this.activeArrReq.data.costGroupId] = arr;
    },

    // 切换条数
    activeHandleSizeChange(limit) {
      this.activeArrReq.limit = limit;
      this.activeHandleClick();
    },

    // 切换页码
    activeHandleCurrentChange(page) {
      this.activeArrReq.page = page;
      this.activeHandleClick();
    },

    // 第一层数据删除
    newTableArrDel(row) {
      this.form.payList = this.form.payList.filter(
        (item) => item.payId.costId !== row.payId.costId
      );
      this.searchArr = this.form.payList
    },

    // 外包按钮
    handleCheckChange(val) {
      this.form.epibolyFlag = val == true ? 1 : 0;
    },

    // 人工费系数变更
    paramChange(e) {
      this.paramList.find((item) => {
        if (item.paramCode == e) {
          this.form.coefficient = item.payCoefficient;
          this.form.paramCode = item.paramCode;
        }
      });
      // 系数变更之后对人工费项的费用进行处理
      this.form.payList.map((item) => {
        if (item.costGroupName == "人工费") {
          item.payTotal = (
            item.payPrice *
            item.amount *
            (Number(this.form.coefficient.replace("%", "")) / 100)
          ).toFixed(2);
        }
      });
    },

    // 数量改变计算总价
    numBlur(scope) {
      console.log(scope);
      this.errorMsg = "";
      const re =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      let value = scope.row.amount;
      if (value == "") {
        this.errorMsg = "";
      } else if (!re.test(value)) {
        return (this.errorMsg = "请输入正确格式");
      }
      if (scope.row.costGroupName == "人工费") {

        console.log(this.form.coefficient);
        scope.row.payTotal = (
          scope.row.payPrice *
          Number(value) *
          (Number(this.form.coefficient.replace("%", "")) / 100)
        ).toFixed(2);
      } else if (scope.row.costGroupName == "设备费") {
        scope.row.payTotal = (scope.row.payPrice *
          Number(value) *
          (
            (
              Number(scope.row.coefficientList[0].replace("%", ""))
              +
              (scope.row.coefficientList[1] ? Number(scope.row.coefficientList[1].replace("%", "")) : 0)
              +
              100
            )
            / 100
          )
        ).toFixed(2);
      }
      else {
        scope.row.payTotal = (scope.row.payPrice * Number(value)).toFixed(2);
      }
    },

    // 弹框结束的数据处理
    x6Submit() {
      if (this.isFirst) {
        this.$refs.form.validate(async (valid) => {
          // this.form.note = this.$refs.note.editor.txt.html()

          console.log(this.form.note);
          // return
          if (valid) {
            this.form.payList = this.searchArr
            this.form["startTime"] = this.form.timeValue[0];
            this.form["endTime"] = this.form.timeValue[1];
            this.form["structureId"] = this.structureId;
            console.log(this.form);
            // return
            const res = await techItemAdd(this.form);
            // if (res) {
            this.curCel?.attr("label/text", this.form.workContext);
            // this.curCel?.attr("body/stroke", "#5F95FF");
            this.toolbarFUN("save");
            // }
          } else {
            this.$message({
              offset: 170,
              message: '未通过校验，请按表单中的提示修改',
              type: "warning",
              duration: "1000",
            });
          }
        });
      } else {
        let newArr = [];
        this.testArr.forEach((item) => {
          newArr = newArr.concat(item);
        });
        newArr = this.searchArr.concat(newArr);
        let map = new Map();
        newArr = newArr.filter(
          (item) => !map.has(item.costId) && map.set(item.costId)
        );
        this.form.payList = newArr.map((item) => {
          let temp = {
            payName: item.costName,
            payId: {
              costId: item.costId,
            },
            specModels: item.specModels,
            costUnit: item.costUnit,
            comment: item.comment,
            costId: item.costId,
          };
          if (
            (item.costGroup && item.costGroup.costGroupName == "人工费") ||
            item.costGroupName == "人工费"
          ) {
            if (item.amount) {
              temp["costGroupName"] = item.costGroupName;
              temp["payName"] = item.payName;
              temp["amount"] = item.amount;
              temp["payPrice"] = item.payPrice;
              temp["payTotal"] = (
                item.payPrice *
                item.amount *
                (Number(this.form.coefficient.replace("%", "")) / 100)
              ).toFixed(2);
            } else {
              temp["amount"] = 1;
              temp["costGroupName"] = item.costGroup.costGroupName;
              temp["payPrice"] = item.price;
              temp["payTotal"] = (
                item.price *
                (Number(this.form.coefficient.replace("%", "")) / 100)
              ).toFixed(2);
            }
          }
          else if ((item.costGroup && item.costGroup.costGroupName == "设备费") ||
            item.costGroupName == "设备费") {
            console.log(item);
            if (item.amount) {
              temp["costGroupName"] = item.costGroupName;
              temp["payName"] = item.payName;
              temp["amount"] = item.amount;
              temp["payPrice"] = item.payPrice;
              temp['coefficientList'] = item.coefficientList
              temp["payTotal"] = (
                item.payPrice *
                item.amount *
                (
                  (
                    Number(item.coefficientList[0].replace("%", ""))
                    +
                    (item.coefficientList[1] ? Number(item.coefficientList[1].replace("%", "")) : 0)
                    +
                    100
                  )
                  / 100
                )
              ).toFixed(2);
            } else {
              temp["amount"] = 1;
              temp["costGroupName"] = item.costGroup.costGroupName;
              temp["payPrice"] = item.price;
              temp['coefficientList'] = item.paramVoList.map(item => item.coefficient)
              temp["payTotal"] = (
                item.price *
                (
                  (
                    Number(item.paramVoList[0].coefficient.replace("%", ""))
                    +
                    (item.paramVoList[1] ? Number(item.paramVoList[1].coefficient.replace("%", "")) : 0)
                    +
                    100
                  )
                  / 100
                )
              ).toFixed(2);
            }
          }





          else {
            console.log(item.payPrice);
            console.log(item.amount);
            console.log(typeof (item.payPrice * item.amount));
            if (item.amount) {
              temp["costGroupName"] = item.costGroupName;
              temp["payName"] = item.payName;
              temp["amount"] = item.amount;
              temp["payPrice"] = item.payPrice;
              temp["payTotal"] = (item.payPrice * item.amount).toFixed(2);
            } else {
              temp["costGroupName"] = item.costGroup.costGroupName;
              temp["amount"] = 1;
              temp["payPrice"] = item.price;
              temp["payTotal"] = item.price.toFixed(2);
            }
          }
          return temp;
        });
        this.searchArr = this.form.payList;
        this.isFirst = true;
      }
      this.searchValue = "";
      this.activeArrReq.data.costName = "";
    },
    // 清空
    clearInputValue(e) {
      console.log(e);
      if (!e) {
        this.activeHandleSearch();
      }
    },
    // 第二层清空
    basicCostFindCostAndParamClear(e) {
      if (!e) {
        this.dataParamCostPage("搜索");
      }
    },
    // 搜素
    activeHandleSearch() {
      this.form.payList = this.searchArr.filter(
        (item) =>
          item.payName.toLowerCase().indexOf(this.searchValue.toLowerCase()) !=
          -1
      );
    },

    // 获取富文本内容
    handleEditText(e) {
      this.form.note = e.htmlText;
    },

    // let map=new Map()
    // arr = arr.filter((a) => !map.has(a.id) && map.set(a.id))
  },

  // watch: {
  //   form: {
  //     handler(newValue, oldValue) {
  //       this.timeValue = newValue.timeValue
  //     },
  //     deep: true
  //   }
  // }
};
</script>

<style lang="less" scoped>
.x6-widget-snapline-vertical {
  border-right: 1px solid #bcbabd !important;
}

.x6-widget-snapline-horizontal {
  border-bottom: 1px solid #bcbabd !important;
}

.x6-vue-wrap {
  width: 100%;
  height: 100% !important;
  position: absolute;
  top: 0;
  overflow-y: hidden;
  background-color: #fff !important;

  .toolbar {
    display: flex;
    align-items: center;
    margin-left: 8px;
    font-size: 12px;
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #dfe3e8;
    user-select: none;

    span.v-line {
      display: inline-block;
      height: 16px;
      margin: 0 4px;
      width: 1px;
      background-color: #bcbcbc;
    }

    span.rate {
      display: inline-block;
      width: 34px;
      text-align: center;
      color: grey;
    }

    span.item {
      cursor: pointer;
      padding: 2px 8px;

      &:hover {
        background-color: #e0e0e0;
        border-radius: 5px;
      }
    }
  }

  .content {
    display: flex;
    flex-flow: row;
    // justify-content: space-between;
    height: calc(100% - 41px);
    position: relative;

    .shapes {
      position: relative;
      width: 200px;
      border-right: 1px solid #dfe3e8;
      overflow: auto;

      :deep(.x6-widget-stencil) {
        // height: 100% !important;
        position: relative;
        margin-bottom: 10px;
        background-color: #fff;

        // position: relative;
        .x6-widget-stencil-content {
          position: relative;

          .x6-graph {
            overflow: auto;
          }

          .x6-widget-stencil-group-title {
            background-color: #fff;
          }
        }

        .x6-widget-stencil-title {
          background-color: #fff;
        }
      }
    }

    #container {
      height: 100%;
      flex: 1;
      box-sizing: border-box;
    }

    .minimap {
      position: fixed;
      right: 30px;
      bottom: 30px;
      width: 200px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fafbfc;
    }
  }

  // @media screen and (max-height: 350px) {
  //   .minimap {
  //     visibility: hidden;
  //   }
  // }
}

.x6-widget-stencil {
  background-color: #fff;

  .x6-widget-stencil-title {
    background-color: #fff;
  }
}

// resizing
.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0;
  border: 1px solid #239edd;

  >div {
    border: 1px solid #239edd;
  }

  >div:hover {
    background-color: #3dafe4;
  }

  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
  }
}

.x6-widget-transform-resize {
  border-radius: 0;
}

// selection
.x6-widget-selection-inner {
  border: 1px solid #239edd;
}

.x6-widget-selection-box {
  opacity: 1;
  border: 1px dashed #239edd;
}

// snapline
.x6-widget-snapline-vertical {
  border-right-color: #239edd;
}

.x6-widget-snapline-horizontal {
  border-bottom-color: #239edd;
}

// minimap
:deep(.x6-widget-minimap-viewport),
.x6-widget-minimap-viewport-zoom {
  border: 2px solid #3371dd;
}

// :deep(.x6-widget-minimap-viewport {
//   min-width: 130px !important;
//   min-height: 90px !important;
// }
.x6-widget-stencil,
.x6-widget-stencil-content {
  position: initial !important;
}

:deep(.x6-widget-stencil.collapsable>.x6-widget-stencil-content) {
  top: 0px;
}

:deep(#stencil .x6-cell div) {
  line-height: 25px !important;
  display: block !important;
  overflow: hidden !important;
  // background-color: red !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

// 时间与视频选择框
:deep(#form .el-date-editor),
:deep(#form .el-select) {
  width: 100%;
}

// 富文本
:deep(#form .w-e-text-container) {
  height: 130px !important;
}

:deep(#form .w-e-full-screen-editor .w-e-text-container) {
  height: 100% !important;
}

:deep(#form .el-form-item__content) {
  cursor: pointer;
}

:deep(.form .el-form-item) {
  margin-bottom: 0px;
}

:deep(#form .el-form-item__error) {
  top: 24px;
  left: 20px;
}

:deep(#form .firstTab tbody tr td:nth-child(4)) {
  min-width: 200px;
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

:deep(.process) {
  display: block !important;
  position: initial !important;
}

.tips {
  color: red;
}

// :deep( .el-table__header .has-gutter tr .el-table-column--selection .cell .el-checkbox::after {
//   content: " 全选";
// }

// 按钮
.x6-vue-wrap :deep(.search .el-input) {
  width: 95%;
}

.x6-vue-wrap :deep(.el-dialog) {
  min-width: 1000px;

  .tablePagination {
    display: flex;
    height: 50px;
    justify-content: flex-end;
    align-items: flex-end;
  }
}
</style>
