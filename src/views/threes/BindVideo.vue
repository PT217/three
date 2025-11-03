<template>
  <div>
    <el-select v-model="cameraId" placeholder="请选择监控头" :popper-append-to-body="false" filterable
      @change="(id) => dataCameraModelBindCamera(id)">
      <el-option v-for=" item  in  cameraArr " :key="item.cameraId" :label="item.cameraName"
        :value="item.cameraId"></el-option>
    </el-select>
  </div>
</template>

<script>
import {
  dataCameraPage,//摄像头列表查询
  dataCameraGetCameraById,//通过id查询摄像头信息
  dataCameraModelBindCamera,//模型和监控点位的绑定
} from '../../utils/api'
export default {
  props: {
    bindId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cameraId: '',
      cameraArr: [],
    };
  },
  components: {},
  created() {
    this.dataCameraPage()
  },
  mounted() { },
  watch: {
    bindId: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (newVal) {
          this.dataCameraGetCameraById()
        }
      },
      immediate: true
    }
  },
  methods: {
    async dataCameraGetCameraById() {
      const res = await dataCameraGetCameraById({
        bindId: this.bindId
      })
      if (res.data.data.cameraId) this.cameraId = res.data.data.cameraId

    },
    async dataCameraPage() {
      const res = await dataCameraPage({
        data: {
          "cameraName": ""
        },
        page: 1,
        limit: 100
      })
      console.log(res);
      if (res) this.cameraArr = res.data.data.list.map(item => ({
        cameraName: item.cameraName,
        cameraId: item.cameraId
      }))

    },
    async dataCameraModelBindCamera(cameraId) {
      console.log(this.bindId);
      // 发请求存url
      await dataCameraModelBindCamera({
        bindId: this.bindId,
        cameraId
      })
    },
  },
}
</script>

<style lang='less' scoped>
.el-select {
  width: 77% !important;
  margin: 17px;

  :deep(.el-input__inner),
  :deep(.el-select-dropdown) {
    color: white;
    background: rgba(21, 40, 58, .3);

    .el-select-dropdown__item {
      // background-color: white;
      color: white;
    }

    .el-select-dropdown__item.hover {
      background-color: skyblue;
    }
  }
}
</style>