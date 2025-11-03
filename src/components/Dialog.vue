<!--
 * @Author: your name
 * @Date: 2022-03-10 20:42:16
 * @LastEditTime: 2022-10-26 16:41:23
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /swbpm-view/src/components/dialog.vue
-->
<template>
  <el-dialog :visible.sync="visible" :title="title" :width="width" :before-close="show" :close-on-click-modal="false">
    <!-- <template slot="title">
      <div>
        {{ title }}
      </div>
      <slot name="titleValue"></slot>
    </template> -->

    <slot></slot>
    <div v-if="showBtn" class="showBtn">
      <el-button size="small" @click="show" :disabled="disabled">取消</el-button>
      <el-button size="small" type="primary" @click="submit" :disabled="disabled">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: "",
    title: "",
    width: "",
    showBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    show() {
      this.disabled = true;
      this.$emit("show");
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
    submit() {
      this.disabled = true;
      this.$emit("submit", this.title);
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
    },
  },
};
</script>

<style lang="less">
.showBtn {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>