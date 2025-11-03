<template>
  <div class="box">
    <div class="head">
      <div>
        <img style="vertical-align: middle; margin: 0 10px" src="../assets/common/lb.png" />
        <span style="font-weight: bold; font-size: 14px">{{ title }}</span>
      </div>
      <div class="head_button">
        <slot name="ButtonSlot"></slot>
      </div>
    </div>
    <div :id="eId" :class="onlyRead ? 'cursor-not-allowed' : 'cursor-default'"></div>
  </div>
</template>

<script>
import E from "wangeditor";
import { uploadPhoto } from "../utils/api";
export default {
  props: {
    title: {
      default: "",
    },
    eId: {
      default: "",
    },
    text: {
      default: "",
    },
    //禁用编辑器，只读模式
    onlyRead: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: "",
      imgsrc: [],
    };
  },
  watch: {
    text: {
      handler(newVal, oldVal) {
        console.log(newVal);
        if (this.editor) this.editor.txt.html(newVal);
      },

    }
  },
  mounted() {
    this.createEditor();
  },
  methods: {
    createEditor() {

      let that = this;
      const editor = new E(`#${this.eId}`);
      this.editor = editor;

      //需要的菜单
      editor.config.menus = this.onlyRead ? [] : ["image", "table"];
      //失去焦点
      editor.config.onchange = function (html) {
        console.log(html);
        if (that.imgsrc.length !== 0) {
          let nowImgs = that.getSrc(html);
          let merge = that.imgsrc.concat(nowImgs).filter(function (v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
          });
          // console.log(merge);
          for (let x in merge) {
            let colds = merge[x];
          }
          that.imgsrc = nowImgs;
        }
        if (!that.onlyRead) {
          console.log('000');
          if (html.length > 500) return that.$message('超出500字内容不会保存')
          that.$emit("child-event", {
            conductId: parseInt(localStorage.getItem("conductId")),
            wordNodeName: that.eId,
            htmlText: html,
          });
        }
      };
      //是否可以插入网络图片
      editor.config.showLinkImg = false;
      //一次最多可传入几张图片
      editor.config.uploadPhotoMaxLength = 1;
      //自定义图片传

      editor.config.customUploadImg = async function (files, insert) {
        let formData = new FormData();
        formData.append("file", files[0]);
        formData.append("photoName", files[0].name);
        let res = await uploadPhoto(formData);
        if (res) {
          insert(res.data.data);
        }
        console.log(that.editor.txt.html());
        that.imgsrc = that.getSrc(that.editor.txt.html());
      };
      this.editor.create();
      //回显
      if (this.text) this.editor.txt.html(this.text);
      //编辑器只读设置
      if (this.onlyRead) this.editor.disable();
    },
    // 取出区域内所有img的src
    getSrc(html) {
      var imgReg = /<img.*?(?:>|\/>)/gi;
      // 匹配src属性
      var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
      var arr = html.match(imgReg);
      let imgs = [];
      if (arr) {
        for (let i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg)[1];
          imgs.push(src);
        }
      }
      return imgs;
    },
  },
};
</script>

<style scoped>
.box {
  background-color: #fff;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
}

.head_button {
  margin-right: 10px;
}

.head_button>button {
  min-width: 82px;
  height: 30px;
  background: rgba(255, 255, 255, 0.39);
  border: 1px solid #409eff;
  color: #409eff;
  font-size: 14px;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.cursor-default {
  cursor: default;
}
</style>