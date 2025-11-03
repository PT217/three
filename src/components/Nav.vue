<template>
  <div class="nav">
    <div class="left">
      <div class="icon"></div>
      <div class="colorI" :class="[value.isClick ? 'colorB' : 'colorG']" v-for="(value, idx) in nav" :key="idx"
        @click="goFn(value)">
        {{ value.name }}
        <span v-show="idx != nav.length - 1">|</span>
      </div>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nav: [],
  },
  methods: {
    goFn(value) {
      this.nav.forEach((item) => {
        item.isClick = false;
      });
      value.isClick = true;
      this.$router.push({ path: value.path });
      window.scroll(0, 0);
    },
  },
  watch: {
    nav: {
      handler(newVal, oldVal) {
        this.nav.forEach((item) => {
          if (window.location.hash.replace("#", "") == item.path)
            item.isClick = true;
          else item.isClick = false;
        });
      },
      immediate: true,
      // deep: true,
    },
  },
};
</script>

<style lang='less' scoped>
.nav {
  display: flex;
  justify-content: space-between;
  height: 50px;
  min-height: 50px;
  background: #fff;
  padding: 0 24px;
  margin: 20px 0;
  box-sizing: border-box;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);

  .left {
    display: flex;
    align-items: center;

    .icon {
      width: 11px;
      height: 11px;
      background: #3d91ff;
      transform: rotate(45deg);
      transform-origin: top;
      margin: 0 7px 0 9px;
    }

    .colorI {
      color: #333;
      font-size: 16px;
      cursor: pointer;
    }

    .colorB {
      font-weight: 700;
      color: #333;
    }

    .colorG {
      color: #666;
    }

    span {
      margin: 0 10px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    padding-right: 10px;

    .el-button {
      border-radius: 0;
    }
  }
}
</style>