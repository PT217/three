<template>
  <div class="menuBox" id="menus">
    <div class="menuList">
      <div class="menu" :class="{ active: componentName === menu.component }" v-for="menu in menuList"
        :key="menu.component" @click="handlerMenuClick(menu)">
        <img :src="require(`@/assets/data/${menu.icon}.png`)" />
        <span>{{ menu.label }}</span>
      </div>
    </div>

    <Transition name="el-zoom-in-center">
      <keep-alive>
        <component :is="componentName"></component>
      </keep-alive>
    </Transition>


  </div>
</template>

<script >
export default {
  components: {
    IconMenu: () => import("./IconMenu.vue"),
    ModelMenu: () => import("./ModelMenu.vue"),
    SkyMenu: () => import("./SkyMenu.vue")
  },
  data() {
    return {
      componentName: "ModelMenu",
      menuList: [
        {
          icon: "menus-icon1",
          label: "模型库",
          component: "ModelMenu",
        },
        {
          icon: "menus-icon2",
          label: "图标库",
          component: "IconMenu",
        },

        {
          icon: "menus-icon2",
          label: "天空盒",
          component: "SkyMenu",
        },
        // {
        //   icon: "menus-icon2",
        //   label: "设备",
        //   component: "设备",
        // },
        // {
        //   icon: "menus-icon2",
        //   label: "后期",
        //   component: "后期",
        // },
        // {
        //   icon: "menus-icon2",
        //   label: "测试",
        //   component: "测试",
        // },
        // {
        //   icon: "menus-icon2",
        //   label: "环境",
        //   component: "环境",
        // },
        // {
        //   icon: "menus-icon2",
        //   label: "灯光",
        //   component: "灯光",
        // }
      ],
    }
  },
  methods: {
    handlerMenuClick(menu) {
      this.componentName = this.componentName == menu.component ? "" : menu.component
      this.show = !this.show
    },
  },
}
</script>

<style lang="less" scoped>
.menuBox {
  position: absolute;
  top: 80px;
  // min-width: 110px;
  height: calc(100vh - 80px);
  padding-top: 40px;
  background: url("@/assets/data/menus-bg.png") center no-repeat;
  background-size: 100% 100%;
  transition: left 1s;
  display: flex;
  z-index: 2;

  .menuList {
    height: 100%;
    width: 100%;
    min-width: 110px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .menu {
      width: 100%;
      height: 32px;
      margin-bottom: 20px;
      background: url("@/assets/data/but-normal.png") center no-repeat;
      background-size: 100% 100%;

      &:hover {
        background: url("@/assets/data/but-hover.png") center no-repeat;
        background-size: 100% 100%;
      }

      &.active {
        background: url("@/assets/data/but-hover.png") center no-repeat;
        background-size: 100% 100%;
      }

      display: flex;
      // justify-content: space-between;
      align-items: center;

      img {
        width: 14px;
        height: 16px;
        // margin-right: 3px;
        margin: 9px 8px 7px 17px;
      }

      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}
</style>
