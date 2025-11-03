<template>
  <div class="sceneEdit">
    <SceneHeader />
    <SceneMenus />
    <SceneMain />
  </div>
</template>

<script>
import SceneHeader from '../threes/SceneHeader.vue'
import SceneMenus from '../threes/SceneMenus.vue'
import SceneMain from '../threes/SceneMain.vue'
export default {
  props: {},
  data() {
    return {};
  },
  components: {
    SceneHeader,
    SceneMenus,
    SceneMain
  },
  created() { },
  mounted() { },
  methods: {
  }
}
</script>

<style lang='less' scoped>
.sceneEdit {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh !important;
}
</style>