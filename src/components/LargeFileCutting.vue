<template>
  <div class="myUpload">
    <!-- 进度显示 -->
    <div class="progress">
      <el-progress type="circle" :percentage="percent" :status="status"></el-progress>
      <i class="el-icon-close" @click="stop"></i>
    </div>
    <div>
      <el-upload action="#" :limit="1" :accept="accept" ref="upload" :auto-upload="false" :before-remove="removeFile"
        :on-change="handleChange">
        <el-button type="text">点击上传</el-button>
      </el-upload>
      <input type="hidden" v-model="inputFile" />
    </div>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import axios from "axios";
import { http } from "../utils/request";

export default {
  props: {
    inputFile: {
      default: "",
    },
    accept: {
      default: "",
    },
    url: {
      default: "",
    },
  },
  data() {
    return {
      // 关闭上传标识
      cancelFlag: false,
      // 切片总数
      totals: 0,
      // 进度条数值
      percent: 0,
      // 进度条颜色状态
      status: null,
      // 切割份数的数值
      percentCount: 0,
      // 切片数组
      chunkList: [],
      // 文件名
      fileName: "",
      // md5哈希值
      hash: "",
      // 取消请求
      source: null,
    };
  },
  methods: {
    async handleChange(file) {
      if (!file) return;
      // 限制文件大小
      console.log(file.size);
      console.log(file.size > 500 * 1024 * 1024);
      if (file.size > 500 * 1024 * 1024) return this.$message({
        offset: 170,
        duration: "1000",
        message: "文件大小不能超过500M",
        type: "error",
      });
      console.log(file);
      this.percent = 0;
      this.percentCount = 0;
      // 清空切片数组
      this.chunkList = [];
      this.cancelFlag = false;
      // 获取文件并转成 ArrayBuffer 对象
      const fileObj = file.raw;
      this.fileName = fileObj.name;
      let buffer;
      try {
        buffer = await this.fileToBuffer(fileObj);
      } catch (e) {
        console.log(e);
      }

      console.log(fileObj.size);
      // 将文件按固定大小（5M）进行切片，注意此处同时声明了多个常量
      const chunkSize = 1024 * 1024 * 0.5;
      // 计算总共多个切片
      this.totals = Math.ceil(fileObj.size / chunkSize);
      // 文件后缀名
      const suffix = file.name.split(".").pop();
      // 根据文件内容生成 hash 值
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      this.hash = spark.end();
      // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
      let curChunk = 0; // 切片时的初始位置
      for (let i = 0; i < this.totals; i++) {
        const item = {
          // 文件名规则按照 hash_1.jpg 命名
          chunk: fileObj.slice(curChunk, curChunk + chunkSize),
          fileName: `${this.hash}_${i}.${suffix}`,
        };
        curChunk += chunkSize;
        this.chunkList.push(item);
      }

      console.log(this.chunkList);

      // return
      this.uploadFileChunks(this.chunkList);
    },

    async uploadFileChunks(list) {
      if (list.length === 0) {
        //所有任务完成,合并切片
        this.complete();
        this.cancelFlag = true;
        this.source = null;
        console.log("上传完成");
        return;
      }
      let pool = []; //并发池
      let max = 3; //最大并发量
      let finish = 0; //完成的数量
      let failList = []; //失败的列表
      for (let i = 0; i < list.length; i++) {
        this.source = axios.CancelToken.source();
        let item = list[i];
        let formData = new FormData();
        formData.append("chunk", item.chunk);
        formData.append("filename", item.fileName);
        // 上传切片
        let task = axios({
          method: "POST",
          url: http + this.url,
          data: formData,
          cancelToken: this.source.token,
          headers: { token: localStorage.getItem("token") },
        });

        console.log(task);

        task
          .then(() => {
            //请求结束后将该Promise任务从并发池中移除
            let index = pool.findIndex((t) => t === task);
            pool.splice(index);
          })
          .catch(() => {
            console.log(222);
            failList.push(item);
          })
          .finally(() => {
            console.log(333);
            finish++;
            this.percent = Number(((finish / this.totals) * 100).toFixed());
            if (this.cancelFlag) return;
            //所有请求都请求完成
            if (finish === list.length) {
              this.cancelFlag = true;
              this.uploadFileChunks(failList);
            }
          });
        pool.push(task);
        if (pool.length === max) {
          //每当并发池跑完一个任务，就再塞入一个任务
          await Promise.race(pool);
        }
      }
    },

    // 按下取消按钮
    stop() {
      console.log(4);
      if (this.source) {
        console.log(5);
        this.source.cancel("取消上传");
        this.cancelFlag = true;
      }
    },
    // 文件移除
    removeFile() {
      if (this.cancelFlag) {
        this.clear();
        return true;
      }
      return false;
    },
    // 弹框清除
    clear() {
      this.percent = 0;
      this.cancelFlag = true;
      this.$refs["upload"].clearFiles();
      this.$emit("complete", {
        hash: "",
        fileName: "",
      });
    },
    // 切片上传完成之后
    complete() {
      this.$emit("complete", {
        hash: this.hash,
        fileName: this.fileName,
      });
      this.cancelFlag = true;
      this.source = null;
    },
    // 将 File 对象转为 ArrayBuffer
    fileToBuffer(file) {
      return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => {
          resolve(e.target.result);
        };
        fr.readAsArrayBuffer(file);
        fr.onerror = () => {
          reject(new Error("转换文件格式发生错误"));
        };
      });
    },
  },
};
</script>

<style lang='less' scoped>
.myUpload {
  padding: 20px;
  display: flex;
  align-items: center;

  & div {
    margin-right: 20px;
  }

  .progress {
    position: relative;

    .el-icon-close {
      position: absolute;
      cursor: pointer;
    }
  }
}
</style>
