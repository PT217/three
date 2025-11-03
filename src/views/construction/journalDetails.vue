<template>
  <div class="details">
    <Nav :nav="nav"></Nav>
    <el-descriptions title="施工日志详情">
      <el-descriptions-item label="施工日志名称">1</el-descriptions-item>
      <el-descriptions-item label="创建用户">{{}}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{}}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="基本信息">
      <el-descriptions-item label="日期">1</el-descriptions-item>
      <el-descriptions-item label="平均气温">{{}}</el-descriptions-item>
      <el-descriptions-item label="上午气温">{{}}</el-descriptions-item>
      <el-descriptions-item label="下午气温">{{}}</el-descriptions-item>
      <el-descriptions-item label="施工部位">{{}}</el-descriptions-item>
      <el-descriptions-item label="出勤人数">{{}}</el-descriptions-item>
      <el-descriptions-item label="测量人员">{{}}</el-descriptions-item>
      <el-descriptions-item label="记录员">{{}}</el-descriptions-item>
      <el-descriptions-item label="操作负责人">{{}}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions>
      <el-descriptions-item label="施 工 情 况">{{}}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
export default {
  name: "",
  props: [""],
  data() {
    return {
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
          name: "日志详情",
          path: "/journalDetails",
          isClick: false,
        },
      ],
    };
  },
  components: {
    Nav,
  },
  computed: {},
  beforeMount() { },
  mounted() { },
  methods: {},
  watch: {},
};
</script>

<style lang='less' scoped>
.details {
  .el-descriptions {
    background-color: white;
    padding: 20px 40px;

    :deep(.el-descriptions__body) {
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 20px;
    }

    :deep(.el-descriptions__body:nth-of-type(1)) {
      border-bottom: 0;
    }
  }
}
</style>