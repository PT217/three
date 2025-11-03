<!--
 * @Author: your name
 * @Date: 2022-04-18 16:55:30
 * @LastEditTime: 2023-02-08 13:20:17
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 * @FilePath: /swbpm-view/src/components/Edit.vue
-->
<template>
  <div :id="eId"></div>
</template>

<script>
import E from "wangeditor";
import { uploadPhoto } from "../utils/api";
// import
export default {
  name: "Edit",
  props: {
    eId: {
      default: "",
    },
    text: {
      default: "",
    },
    disabled: {
      default: false,
    },
    onlyRead: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: "",
    };
  },

  watch: {
    disabled(newValue) {
      if (this.editor) {
        newValue ? this.editor.disable() : this.editor.enable();
      }
    },
  },
  mounted() {
    this.createEditor();
  },

  methods: {
    createEditor() {
      console.log('edit');
      let that = this;
      const editor = new E(`#${this.eId}`);
      this.editor = editor;

      editor.config.menus = this.onlyRead ? [] : ["image", "table"];


      editor.config.onchange = function (html) {
        if (html.length > 500) return that.$message('超出500字内容不会保存')
        that.$emit("Edit", {
          wordNodeName: that.eId,
          htmlText: html,
        });
      };

      // editor.config.onblur = function (html) {
      //   if (html.length < 500) {
      //     that.$emit("Edit", {
      //       wordNodeName: that.eId,
      //       htmlText: html,
      //     });
      //   }
      // };

      //是否可以插入网络图片
      editor.config.showLinkImg = false;
      //一次最多可传入几张图片
      editor.config.uploadImgMaxLength = 1;
      //自定义图片传
      editor.config.customUploadImg = async function (files, insert) {
        let formData = new FormData();
        formData.append("file", files[0]);
        formData.append("photoName", files[0].name);
        let res = await uploadPhoto(formData);
        if (res) {
          insert(res.data.data);
        }
      };
      this.editor.create();

      //回显
      if (this.text) this.editor.txt.html(this.text);
      if (this.disabled) this.editor.disable();
    },
  },
};
</script>

<style scope></style>