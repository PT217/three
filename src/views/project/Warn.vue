<template>
  <div class="warn">
    <div class="top" v-show="warnArr.length > 0"></div>

    <div class="content" v-show="warnArr.length > 0">
      <div class="title">
        <div>相机名称</div>
        <div>告警类型</div>
        <div>告警值</div>
        <div>处理状态</div>
        <div>预警时间</div>
        <div>操作</div>
      </div>
      <div v-for="(item, index) of warnArr" :key="index" :class="index % 2 ? 'row' : 'row blue'">
        <div>{{ item.cameraName }} </div>
        <div>{{ item.alarmType }} </div>
        <div>{{ item.alarmContent }} </div>
        <div>{{ item.processState }} </div>
        <div>{{ item.alarmDate }} </div>
        <div class="see" @click="warnFn(item)">
          {{ item.show ? '隐藏' : '查看' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    warnArr: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {};
  },
  components: {},
  created() {

    console.log(this.warnArr);
  },
  mounted() { },
  methods: {
    warnFn(item) {
      // item.show = !item.show
      this.$emit('warnFn', item)
    },
    // 获取警告信息
    async dataCameraFindAlarmList() {

      this.warnArr = this.flag ? [
        {
          position: {
            x: -1,
            y: 10,
            z: 20,
          },
          cameraName: '05罐区北外景',
          alarmType: '告警类型1',
          alarmContent: '告警值1',
          processState: '未处理1',
          alarmDate: '2023-05-06 17:05:21',
          alarmContent: '告警值1',
          show: false
        },
        {
          position: {
            x: 10,
            y: 20,
            z: 30,
          },
          cameraName: '05罐区南外景',
          alarmType: '告警类型2',
          alarmContent: '告警值2',
          processState: '未处理2',
          alarmDate: '2023-05-06 17:05:22',
          alarmContent: '告警值2',
          show: false
        }
      ] : [
        {
          position: {
            x: 20,
            y: 20,
            z: 20,
          },
          cameraName: '05罐区北外景',
          alarmType: '告警类型3',
          alarmContent: '告警值3',
          processState: '未处理3',
          alarmDate: '2023-05-06 17:05:23',
          alarmContent: '告警值3',
          show: false
        },
      ]
      this.flag = !this.flag

      this.threeWarnArr = this.warnArr

      return

      const res = await dataCameraFindAlarmList({
        pageNum: 0,
        pageSize: 1000,
        // processState: "0"
      })


      // console.log(res);
      if (res) {

        let arr = res.data.data.map((item, index) => ({
          ...item, show: false, position: {
            x: item.cameraLocation.abscissa,
            y: item.cameraLocation.ordinate,
            z: item.cameraLocation.height
          }
        }))





        // if (this.warnArr.length) this.warnArr = this.warnArr.map((item, index) => ((item.alarmContent == arr[index].alarmContent) && (item.alarmType == arr[index].alarmType) ? item : { ...item, show: false }))
        // else this.warnArr = arr
        // this.threeWarnArr = this.warnArr


        // console.log(this.warnArr);
      }
    },

  },
}
</script>

<style lang='less' scoped>
.warn {
  width: 400px;
  // padding: 5px;
  position: fixed;
  right: 0;
  top: 660px;
  background-size: 100% 100%;
  z-index: 99999;

  .top {
    height: 40px;
    background-image: url('../../assets/project/jgxx.png');
    background-size: 100% 100%;
  }

  .content {
    color: white;
    height: 280px;
    overflow: auto;

    .title,
    .row {
      display: flex;
      height: 40px;
      align-items: center;
      opacity: 0.8;
      background-color: #354560;

      >div {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
      }

      >div:nth-child(1) {
        width: 21%;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-left: 10px;
      }

      >div:nth-child(2) {
        width: 20%;
      }

      >div:nth-child(3) {
        width: 13%;
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
      }

      >div:nth-child(4) {
        width: 15%;
      }

      >div:nth-child(5) {
        width: 20%;
      }

      >div:nth-child(6) {
        width: 14%;
      }
    }

    .blue {
      background-color: #0B1124;
    }

    .see {
      color: #00FFFC;
      cursor: pointer;
    }

    .gray {
      pointer-events: none;
      opacity: 0.3;
    }
  }

}
</style>