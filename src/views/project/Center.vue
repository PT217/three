<template>
  <div class="center" v-if="monitorArr.length">
    <div class="content">
      <div class="box" v-for="item of monitorArr" :key="item.name">
        <!-- muted 静音播放 -->
        <video :ref="`monitor${item.name}`"></video>
        <div class="cameraBox">
          <div class="info">
            <img :src="require('../../assets/project/sxt.png')" />
            <span>摄像头名称：{{ item.name }}</span>
          </div>
        </div>

        <div class="el-icon-delete" @click="del(item)"></div>
      </div>
    </div>
    <div class="close" @click="delAll">
      <img :src="require('../../assets/project/sxtgb.png')" />
    </div>
  </div>
</template>

<script>
import flvjs from "flv.js";
import {
  dataCameraGetCameraVideo,  // 开启转码
  dataCameraOffCameraVideo,  // 关闭转码
} from "../../utils/api";
export default {
  props: {
    monitorArr: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      flvPlayerArr: [],
    };
  },

  watch: {
    monitorArr: {
      handler(newVal, olval) {
        if (newVal) {
          this.$nextTick(() => {
            this.init();
          });
        }
      },
    },
  },

  methods: {
    init() {
      if (!this.monitorArr.length) return;
      this.monitorArr.forEach(async i => {




        const name = i.name;
        let cur = this.flvPlayerArr.find(item => item.name == i.name);
        if (!cur) {
          // 获取当前的视频地址
          let res = await dataCameraGetCameraVideo({ bindId: i.bindId })

          if (res) {
            let flvPlayer = flvjs.createPlayer({
              type: "flv",
              url: res.data.data.cameraHttpUrl,
            });

            flvPlayer.attachMediaElement(
              this.$refs[`monitor${i.name}`][0]
            );

            flvPlayer.load();
            flvPlayer.play().catch((error) => {
              // console.error("Error while trying to play:", error);
            });

            this.flvPlayerArr.push({
              flvPlayer,
              name,
              bindId: i.bindId
            });
          }
        }
      });
    },

    // 单个摄像头关闭事件
    async del(item) {
      this.flvPlayerArr = this.flvPlayerArr.filter(i => {
        if (i.name == item.name) i.flvPlayer.destroy()
        return i.name != item.name
      })
      let arr = this.monitorArr.filter(i => i.name != item.name)
      // 获取摄像头的Id
      await dataCameraOffCameraVideo({ bindId: item.bindId })
      this.$emit('monitorArrFn', arr)
    },
    // 所有摄像头关闭事件
    delAll() {
      this.flvPlayerArr = this.flvPlayerArr.map(async i => {
        i.flvPlayer.destroy()
        await dataCameraOffCameraVideo({ bindId: i.bindId })
      })
      this.flvPlayerArr = []
      this.$emit('monitorArrFn', [])
    },
  },
};
</script>

<style lang="less" scoped>
.center {
  position: relative;
  left: 3%;
  top: 30px;
  width: 73vw;
  min-width: 1200px;
  background-size: 100% 100%;
  z-index: 99999;

  .content {
    display: flex;
    flex-wrap: wrap;
    height: 75vh;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #000000;
    // min-width: 1200px;

    .box {
      width: 50%;
      height: 50%;
      position: relative;
      border: 1px dashed white;

      .cameraBox {
        width: 100%;
        position: absolute;
        height: 60px;
        bottom: 0;
        background-color: #000000;
        opacity: 0.5;

        .info {
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #ffffff;
          font-size: 16px;

          img {
            width: 24px;
            height: 28px;
            margin: 0 10px;
          }
        }
      }

      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .el-icon-delete {
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translate(50%);
        display: none;
        color: #ffffff;
      }
    }

    .box:hover {
      .el-icon-delete {
        display: block;
      }
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 30px;
    color: white;
    cursor: pointer;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.74);

    img {
      width: 24px;
      height: 25px;
    }
  }
}
</style>