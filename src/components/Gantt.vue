<!--
 * @Author: your name
 * @Date: 2022-04-15 13:41:36
 * @LastEditTime: 2023-02-03 10:15:56
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /swbpm-view/src/components/gantt.vue
-->
<!--  -->
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
      isTaskDblClickHandled: false
    };
  },
  watch: {
    "tasks.data": {
      handler(newVal, oldVal) {
        this.flag = false;
        console.log("新");
        if (newVal) {
          this.$nextTick(() => {

            console.log(this.tasks.data);
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
      gantt.config.scale_height = 51; //设置时间刻度的高度和网格的标题
      // ];
      //指定第二个时间刻度
      gantt.config.scales = [
        { unit: "year", step: 1, format: "%Y" },
        { unit: "month", step: 1, format: "%n" },
        { unit: "day", step: 1, format: "%d" },
      ];

      // gantt.config.scales = [
      //   { unit: "year", step: 1, format: "%Y" },
      //   // { unit: "month", step: 1, format: "%n" },
      //   // { unit: "day", step: 1, format: "%d" },
      // ];
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
      //左侧显示列名
      gantt.config.columns = [
        {
          name: "name",
          label: "施工项",
          width: 100,
          align: "left",
          template: this.proname,
        },
        {
          name: "video",
          label: "视频",
          width: 100,
          align: "left",
          template: this.video,
        },
        {
          name: "time",
          label: "时间",
          width: 100,
          align: "left",
        },
      ];
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
        })
      );

      // detach all saved events
      while (events.length) gantt.detachEvent(events.pop());

      gantt.attachEvent("onLightbox", function (task_id) {
        document.querySelector(".gantt_save_btn_set").click();
      });
      gantt.attachEvent("onTaskDblClick", function (id, e) {
        if (e.target.classList.value == "el-icon-video-play") {
          // this_.$emit("handleVideo", id);

          if (!this_.isTaskDblClickHandled) {
            this_.isTaskDblClickHandled = true;
            this_.$emit("handleVideo", id);
            setTimeout(function () {
              this_.isTaskDblClickHandled = false;
            }, 1000); // 1秒内不允许再次触发
          }
        } else {
          this_.tasks.data.forEach((element) => {
            if (element.name == e.target.innerHTML && element.id == id) {
              this_.$emit("handle", id);
            }
          });
        }
      });

      gantt.templates.task_class = function (start, end, task) {
        if (task.flag == "计划时间") {
          return "plan";
        }
        if (task.flag == "实际时间" && task.status) {
          return "status";
        }
        if (task.flag == "实际时间") {
          return "actual";
        }
      };
      // console.log(gantt.templates);
      gantt.templates.tooltip_text = function (start, end, task) {
        return (
          `<b>${task.flag}:</b>` +
          task.text +
          `<div class="showName"><b>模块名称:</b>${task.showName}</div>`
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
        console.log(gantt.getTask(task.id + 1));
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
