<template>
  <div id="app1">
    <el-button class="buttonStyle" style="position: absolute; right: 55px; top: 80px" @click="handleBack">返回</el-button>
  </div>
</template>
<!-- 2 -->
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
export default {
  data() {
    return {
      camera: new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        20000
      ),
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        precision: "highp",
      }),
      controls: null,
      modelPath: "",
    };
  },
  created() {
    this.modelPath = this.$route.query.path;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log("fbx文件", this.modelPath);
      let container = document.getElementById("app1");
      this.camera.position.set(30, 50, 300);


      var grid = new THREE.GridHelper(2000, 50, 0x000000, 0x000000);
      grid.material.opacity = 0.2;
      grid.material.transparent = true;
      this.scene.add(grid);

      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 0, 0);
      this.controls.update();

      let light = new THREE.HemisphereLight(0xffffff, 0x444444);
      light.position.set(0, 200, 0);
      this.scene.add(light);

      let light2 = new THREE.DirectionalLight(0xffffff);
      light2.position.set(0, 200, 100);
      this.scene.add(light2);

      let fbxLoader = new FBXLoader();
      fbxLoader.load(`${this.modelPath}`, (object) => this.scene.add(object));
      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
    },

    handleBack() {
      this.$router.push({ path: "/model" });
    },
  },
};
</script>
<style scoped>
#app1 {
  height: calc(100vh - 50px);
  width: 100%;
}

.buttonStyle {
  min-width: 82px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #409eff;
  border-radius: 6px;
  color: #409eff;
  font-size: 14px;
  padding: 0;
}
</style>