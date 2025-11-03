<template>
  <div class="x6-vue-wrap">
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
      <div class="fr">
        <span class="saveState">提示:若需保存记录,请在关闭模态框之前保存数据</span>
        <span class="item" @click.stop="toolbarFUN('save')" title="示例:保存图形化数据至localStorage">保存并返回</span>
        <span class="item" @click.stop="toolbarFUN('close')">取消并返回</span>
      </div>

      <span class="item">
        <el-tooltip effect="dark" placement="bottom">
          <div slot="content" class="tip">
            <p>1.Ctrl+Z：快捷撤销</p>
            <p>2.Ctrl+X：快捷剪切</p>
            <p>3.Ctrl+C：快捷复制</p>
            <p>4.Ctrl+V：快捷粘贴</p>
            <p>5.Delete | Backspace：快捷删除</p>
            <p>6.Shift+鼠标左键：可以拖动画布</p>
            <p>7.单击节点可调整尺寸大小</p>
            <p>8.支持双击图形节点修改内容</p>
            <p>9.鼠标移动至节点可触发节点连接桩显示</p>
            <p>10.支持鼠标按住拖动框选节点及单击选中节点</p>
            <p>11.Ctrl+鼠标滚轮：可以放大缩小画布</p>
          </div>
          <span class="tips">使用说明</span>
        </el-tooltip>
      </span>
    </div>
    <div id="content" class="content">
      <div id="stencil" class="shapes"></div>
      <div id="container" class="x6-graph"></div>
      <div id="form">
        <el-form :model="formState">
          <el-form-item label="修改节点内容" v-show="formState.labelText !== null">
            <el-input v-model="formState.labelText" @change="onNameChange" />
          </el-form-item>
        </el-form>
      </div>
      <!-- <div id="minimap" class="minimap"></div> -->
    </div>
  </div>
</template>

<script>
import { Graph, Addon, DataUri, Vector, Shape, Cell } from "@antv/x6";
export default {
  props: {
    editValue: "",
  },
  data() {
    return {
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
      formState: {
        labelText: null,
      },
    };
  },
  watch: {
    editValue: {
      handler() {
        if (this.editValue && this.editValue.flushContent) {
          this.renderDataFUN();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    const graph = this.initX6FUN();
    this.initRegisterNodeFUN(graph);
    this.initStencilFUN(graph);
    this.initEventFUN(graph);
    this.initKeyboardFUN(graph);
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
        scroller: {
          // enabled: true,
        },
        // 画布拖拽平移
        panning: {
          enabled: true,
          eventTypes: ["leftMouseDown", "rightMouseDown", "mouseWheel"],
          modifiers: "shift",
        },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true, // 是否将鼠标位置作为中心缩放，默认为 true。
          modifiers: "ctrl",
          minScale: 0.1,
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

        // minimap: {
        //   enabled: true,
        //   container: document.getElementById("minimap"),
        //   width: 198,
        //   height: 198,
        //   padding: 10,
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
    // 配置左边数据结构
    initStencilFUN(graph) {
      this.stencil = new Addon.Stencil({
        title: "流程图",
        target: graph,
        stencilGraphWidth: 200,
        stencilGraphHeight: 390,
        layoutOptions: {
          columns: 1,
          columnWidth: 200,
          rowHeight: 70,
          // marginY: 10,
        },
      });
      const r1 = graph.createNode({
        shape: "custom-rect",
        label: "开始",
        attrs: {
          body: {
            rx: 20,
            ry: 26,
          },
        },
      });
      const r2 = graph.createNode({
        shape: "custom-rect",
        label: "过程",
      });
      //  泳道
      // const r3 = graph.createNode({
      //   shape: "text",
      //   text: "泳道",
      // });
      const r4 = graph.createNode({
        shape: "custom-polygon",
        attrs: {
          body: {
            refPoints: "0,10 10,0 20,10 10,20",
          },
        },
        label: "决策",
      });
      const r5 = graph.createNode({
        shape: "custom-polygon",
        attrs: {
          body: {
            refPoints: "10,0 40,0 30,20 0,20",
          },
        },
        label: "数据",
      });
      const r6 = graph.createNode({
        shape: "custom-circle",
        label: "连接",
      });

      const stencilContainer = document.querySelector("#stencil");
      if (stencilContainer) {
        stencilContainer.appendChild(this.stencil.container);
      }
      this.stencil.load([r1, r2, r4, r5, r6]);
      // this.stencil.load([r1, r2, r3, r4, r5, r6]);
    },
    // 注册节点
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
      // 泳道
      Graph.registerNode(
        "text",
        {
          inherit: "text-block",
          width: 66,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "transparent",
              // rx: 20,
              // ry: 20,
            },
            text: {
              fontSize: 12,
              fill: "#262626",
            },
            contenteditable: "true",
          },
          ports: { ...ports },
        },
        true
      );
      Graph.registerNode(
        "custom-rect",
        {
          inherit: "rect",
          width: 66,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "transparent",
            },
            text: {
              'font-family': 'MiSans-Regular',
              fontSize: 12,
              fill: "#262626",
            },
          },
          ports: { ...ports },
        },
        true
      );

      Graph.registerNode(
        "custom-polygon",
        {
          inherit: "polygon",
          width: 66,
          height: 36,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "transparent",
            },
            text: {
              'font-family': 'MiSans-Regular',
              fontSize: 12,
              fill: "#262626",
            },
          },
          ports: {
            ...ports,
          },
        },
        true
      );

      Graph.registerNode(
        "custom-circle",
        {
          inherit: "circle",
          width: 45,
          height: 45,
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: "#5F95FF",
              fill: "transparent",
            },

            text: {
              'font-family': 'MiSans-Regular',
              fontSize: 12,
              // fill: "#262626",
            },
          },
          ports: { ...ports },
        },
        true
      );
    },
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
        if (cells.length) {
          graph.removeCells(cells);
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
      const container = document.getElementById("container");
      graph.on("cell:dblclick", ({ cell, view }) => {
        console.log(cell);
        this.curCel?.attr("body/stroke", "#5F95FF");
        this.curCel = cell;
        this.curCel?.attr("body/stroke", "red");
        let labelText = null;
        console.log(cell.getAttrs());
        if (cell.getAttrs()?.text?.text)
          labelText = cell.getAttrs()?.text?.text;
        if (cell.getAttrs()?.label?.text)
          labelText = cell.getAttrs()?.label?.text;
        this.formState.labelText = labelText;
      });

      graph.on("node:mouseenter", (ev) => {
        // console.log(ev);
        // console.log(ev.cell.port.ports.length);
        if (ev.cell.port.ports.length == 0) {
          console.log(ev.cell.getZIndex());
          console.log(ev.cell.setZIndex(0));
          console.log(ev.cell.toFront());
          ev.cell.toBack();
        }
        this.togglePorts(container, true);
      });

      graph.on("node:mouseleave", () => {
        this.togglePorts(container, false);
      });

      graph.on("edge:change:*", ({ options }) => {
        if (options.toolId) {
          this.togglePorts(container, true);
        }
      });

      graph.on("edge:connected", ({ isNew, edge }) => {
        // 非新建的边
        if (!isNew) {
          this.togglePorts(container, false);
        }
      });

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

      graph.on("edge:mouseleave", ({ cell }) => {
        cell.removeTools();
      });

      graph.on("blank:click", () => {
        this.curCel?.attr("body/stroke", "#5F95FF");
        this.togglePorts(container, false);
        let edges = graph.getEdges();
        if (edges.length > 0) {
          edges.forEach((e) => {
            e.removeTools();
          });
        }
      });
    },
    // 修改节点内容
    onNameChange() {
      this.curCel?.attr("label/text", this.formState.labelText);
    },
    // 按钮点击事件
    toolbarFUN(type) {
      switch (type) {
        case "zoomAdd":
          {
            if (this.isBigFUN(this.zoomSize.max, this.zoomSize.current)) {
              this.zoomSize.current += 0.1;
              this.graph.zoomTo(this.zoomSize.current);
            }
          }
          break;
        case "zoomReduce":
          {
            if (this.isBigFUN(this.zoomSize.current, this.zoomSize.min)) {
              this.zoomSize.current -= 0.1;
              this.graph.zoomTo(this.zoomSize.current);
            }
          }
          break;
        case "clear":
          {
            this.graph.clearCells();
          }
          break;
        case "undo":
          {
            this.graph.history.undo();
          }
          break;
        case "redo":
          {
            this.graph.history.redo();
          }
          break;
        case "save":
          {
            const json = this.graph.toJSON();
            if (json.cells.length > 0) {
              this.graph.toPNG((img) => {
                const data = JSON.stringify(json);
                this.$emit("handle", { data, img, graph: this.graph });
              });
            }
            if (json.cells.length == 0) this.$message({
              offset: 170,
              duration: "1000",
              message: '您还未拖拽模块',
              type: "warning",
            });


          }
          break;
        case "png": {
          this.graph.toPNG((dataUri) => {
            console.log(dataUri);
            DataUri.downloadDataUri(dataUri, "chart.png");
          });
        }
        //   break;
        case "close":
          {
            this.graph.clearCells();
            this.$emit("closeDialog");
          }
          break;
      }
    },
    // 加载之前的数据
    renderDataFUN() {
      const data = JSON.parse(this.editValue.flushContent);
      if (data && this.graph.fromJSON) {
        this.graph.fromJSON(data);
      }
    },
    // 画布自适应
    autoSizeFUN(graph) {
      const resizeFn = () => {
        const content = document.getElementById("content");
        let width = content.offsetWidth;
        let height = content.offsetHeight;
        graph.resize(width, height);
      };
      window.addEventListener("resize", resizeFn);
    },
    // 比较大小
    isBigFUN(num1, num2) {
      return num1 - num2 > 0.0001;
    },
  },
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
  height: 100%;
  position: absolute;
  top: 0px;
  overflow-y: hidden;
  background-color: #fff !important;

  .toolbar {
    display: flex;
    align-items: center;
    margin-left: 8px;
    font-size: 12px;
    height: 40px;
    background-color: #fafbfc;
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

    div.fr {
      position: absolute;
      right: 5px;
    }
  }

  .content {
    display: flex;
    flex-flow: row;
    height: calc(100% - 41px);
    position: relative;

    .shapes {
      position: relative;
      width: 220px;
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
          font-family: MiSans-Regular;

          .x6-graph {
            overflow: auto;
          }
        }

        .x6-widget-stencil-title {
          background-color: #fff;
          text-align: center;
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
      right: 11%;
      bottom: 70px;
      width: 200px;
      height: 200px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fafbfc;
    }
  }

  @media screen and (max-height: 350px) {
    .minimap {
      visibility: hidden;
    }
  }
}

// resizing
:deep(.x6-widget-transform) {
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

:deep(.x6-widget-transform-resize) {
  border-radius: 0 !important;
}

// selection
:deep(.x6-widget-selection-inner) {
  border: 1px solid #239edd;
}

:deep(.x6-widget-selection-box) {
  opacity: 0;
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

:deep(.x6-widget-minimap-viewport) {
  width: 130px !important;
  height: 90px !important;
}

.x6-widget-stencil,
.x6-widget-stencil-content {
  position: initial !important;
}

:deep(.x6-widget-stencil.collapsable>.x6-widget-stencil-content) {
  top: 0px;
}

:deep(#form) {
  position: absolute;
  right: 20px;
  width: 200px;
  height: 90px;
}

.saveState {
  // position: absolute;
  // right: 90px;
  color: red;
}

.tip {
  font-family: MiSans-Regular;
}

.tips {
  color: red;
  cursor: pointer;
}

:deep(.x6-cell div) {
  display: block !important;
  padding-top: 8px !important;
}
</style>
