<template>
  <div ref="gantt"></div>
</template>
 
<script>
import { gantt } from "dhtmlx-gantt";
export default {
  name: "gantt",
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] };
      },
    },
  },
  data() {
    return {
      status: true,
      flag: false,
    };
  },
  watch: {
    "tasks.data": {
      handler(newVal, oldVal) {
        this.flag = false;
        console.log("新");
        if (newVal) {
          this.$nextTick(() => {
            this.init();
          });
          this.r();
        }
      },
      immediate: true,
    },
  },
  mounted() { },
  beforeDestroy() { },
  methods: {
    init() {
      let this_ = this;
      gantt.config.xml_date = "%Y-%m-%d";
      gantt.config.scale_height = 40; //设置时间刻度的高度和网格的标题
      // ]; //指定第二个时间刻度
      gantt.config.scales = [
        { unit: "year", step: 1, format: "%Y" },
        // { unit: "month", step: 1, format: "%n" },
        // { unit: "day", step: 1, format: "%d" },
      ];
      gantt.config.min_column_width = 25;

      // 设置行高
      gantt.config.row_height = 26;
      //左侧是否自适应
      // gantt.config.autofit = true;
      //左侧宽
      // gantt.config.grid_width = 400;
      //取消连线
      gantt.config.drag_links = false;
      gantt.config.drag_resize = false;
      gantt.config.drag_move = false;

      gantt.config.preserve_scroll = false;

      gantt.config.open_tree_initially = true;

      //左侧显示列名
      gantt.config.columns = [
        // {
        //   label: "任务名称",
        //   // width: 150,
        //   // align: "left",
        //   name: 'name',
        //   template: this.name,
        //   tree: true
        // },
        // {
        //   name: "fz",
        //   label: "负责人",
        // },
        // {
        //   name: "flag",
        //   label: "时间",
        // },
        {
          name: "name",
          label: "施工项",
          width: 100,
          align: "left",
          tree: true,


          template: this.name
        },
        {
          name: "fz",
          width: 100,
          align: "left",
          label: "负责人",
        },

        {
          name: "flag",
          width: 100,
          label: "时间",
          align: "left",
        },
        // { name: "time", label: "时间", width: "70", align: "center" },
      ]




      gantt.init(this.$refs.gantt);
      gantt.parse(this.$props.tasks);

      gantt.plugins({
        tooltip: true,
        undo: true,
      });

      var events = [];

      events.push(
        gantt.attachEvent("onTaskDblClick", function (id, e) {
          alert("You've just double clicked an item with id=" + id);
        }),
      );

      // detach all saved events
      while (events.length) gantt.detachEvent(events.pop());

      gantt.attachEvent("onLightbox", function (task_id) {
        console.log(4);
        document.querySelector(".gantt_save_btn_set").click();
      });
      gantt.attachEvent("onTaskDblClick", function (id, e) {
        console.log(3);
        if (e.target.classList.value == "el-icon-video-play") {
          this_.$emit("handleVideo", id);
        } else {
          this_.tasks.data.forEach((element) => {
            if (element.name == e.target.innerHTML && element.id == id) {
              this_.$emit("handle", id);
            }
          });
        }
      });

      gantt.templates.task_class = function (start, end, task) {




        if (task.text == 'build' && task.status) return "status"
        if (task.flag == "计划时间") {
          if (task.status) return "plan status"
          return "plan";
        }
        if (task.flag == "实际时间") {
          if (task.status) return "actual status"
          return "actual";
        }

        // if (task.flag == "计划时间" && task.status) {
        //   return "plan status"
        // }
        // if (task.flag == "实际时间" && task.status) {
        //   console.log(4);
        //   return "actual status"
        // }
      };
      // console.log(gantt.templates);
      gantt.templates.tooltip_text = function (start, end, task) {
        if (!task.flag) return (
          `<b>设施名称:</b>` +
          task.name
        )
        return (
          `<b>状态名称:</b>` +
          task.name +
          `<div class="showName"><b>${task.flag}:</b>${task.text}</div>`
        );
      };


      gantt.attachEvent("onClear", function () {
        gantt.refreshData();
      });
      window.addEventListener("mousemove", function (e) {
        var borders = {
          left: gantt.$container.parentNode.offsetLeft,
          right:
            gantt.$container.parentNode.offsetLeft +
            gantt.$container.clientWidth,
          top: gantt.$container.parentNode.offsetTop,
          bottom:
            gantt.$container.parentNode.offsetTop +
            gantt.$container.clientHeight,
        };

        if (
          e.clientX <= borders.left ||
          e.clientX >= borders.right ||
          e.clientY <= borders.top ||
          e.clientY >= borders.bottom
        ) {
          gantt.ext.tooltips.tooltip.hide();
        }
      });

      if (
        localStorage.getItem("sPos") &&
        JSON.parse(localStorage.getItem("sPos")).y != 0
      ) {
        gantt.scrollTo(
          JSON.parse(localStorage.getItem("sPos")).x,
          JSON.parse(localStorage.getItem("sPos")).y
        );
      }
    },
    proname(task) {
      if (task.flag == "计划时间") {
        if (gantt.getTask(task.id + 1).status) {
          return `<div>${task.name}</div>`;
        }
        return `<div class="proname">${task.name}</div>`;
      }
    },
    video(task) {
      if (task.flag == "计划时间") {
        return `<span class="el-icon-video-play"></span>`;
      }
    },
    name(task) {
      if (task.flag == "实际时间") {
        return
      }
      return task.name
    },


    r() {
      gantt.clearAll();
    },
  },
};
</script>
 
<style scoped>
@import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

.el-date-editor--daterange.el-input__inner {
  width: 100%;
}
</style>
