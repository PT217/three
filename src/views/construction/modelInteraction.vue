
<template>
  <div id="three">
    <div class="instruction"></div>
    <div class="file">
      <!-- <button @click="save_removed">Save</button>
          <button @click="load_removed_from_user_file">Load</button>
          <button :disabled="revert_btn_disabled" @click="revert">Revert</button>
          <button @click="back">back</button> -->
    </div>
  </div>
</template>

<script>
import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";
import { FlyControls } from "../../utils/FlyControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { dataModelGetModelData } from "../../utils/api";

export default {
  name: "modelInteraction",
  data() {
    return {
      t0: new Date(),
      loading: "",
      // 请求数据
      schemeId: localStorage.getItem("finalSchemeId"),
      // path: "http://139.9.233.221:10000/model/2014测试.fbx",
      path: "",
      meshes: [],
      all_meshes: [],
      originalMaterials: {},
      highlightMaterial: new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      }),
      // fbx_file: "./models/H01",
      fbx_file: "",
      raycaster: new THREE.Raycaster(),
      intersects: [],
      start_capture: false,
      intersectedObject: null,
      removed_objects: [],
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        5000
      ),
      renderer: new THREE.WebGL1Renderer(),
      intersectObject: null,
      scene: new THREE.Scene(),
      light: new THREE.AmbientLight(),
      revert_btn_disabled: true,
      clock: new THREE.Clock(),
      controls: null,
      stats: Stats(),
    };
  },
  watch: {
    path: function (val) {
      this.$nextTick(() => {
        this.init();
      });
    },
  },

  beforeCreate() {
    console.log(2);
  },
  async created() {
    this.loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });

  },
  mounted() {
    console.log(888);
    this.init()
  },
  methods: {
    init() {
      this.scene.add(this.light);
      let box = document.getElementById("three");
      box.appendChild(this.stats.dom);

      this.renderer.setClearColor(new THREE.Color(0x87ceeb), 0.5);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      box.appendChild(this.renderer.domElement);

      this.controls = new FlyControls(this.camera, this.renderer.domElement);
      this.controls.dragToLook = true;
      this.controls.movementSpeed = 5;
      this.controls.rollSpeed = 1;

      window.addEventListener("resize", this.onWindowResize, false);
      window.addEventListener("mousemove", this.onMoveMove, false);
      // window.addEventListener(
      //   "keydown",
      //   (e) => {
      //     console.log(e.code);
      //     if (
      //       e.code === "ControlLeft" ||
      //       e.code === "ControlRight" ||
      //       e.code === "MetaLeft"
      //     ) {
      //       this.start_capture = true;
      //     }
      //   },
      //   false
      // );

      // window.addEventListener(
      //   "keyup",
      //   (e) => {
      //     console.log(e.code);
      //     if (
      //       e.code === "ControlLeft" ||
      //       e.code === "ControlRight" ||
      //       e.code === "MetaLeft"
      //     ) {
      //       this.start_capture = false;
      //     }
      //   },
      //   false
      // );

      // window.addEventListener(
      //   "click",
      //   (e) => {
      //     console.log(e.button);
      //     if (this.start_capture && e.button === 0) {
      //       this.intersectedObject.visible = false;
      //       this.meshes = this.meshes.filter(
      //         (o) => o.name !== this.intersectedObject.name
      //       );
      //       this.removed_objects.push(this.intersectedObject);
      //       if (this.removed_objects.length > 0) {
      //         this.revert_btn_disabled = false;
      //       }
      //       this.intersectedObject = null;
      //     }
      //   },
      //   false
      // );

      const fbxLoader = new FBXLoader();
      // fbxLoader.setResourcePath("/textures/");

      fbxLoader.load(
        '/05qinglianghua.FBX',
        (object) => {
          console.log(object);
          object.traverse((child_mesh) => {
            console.log(child_mesh);
            if (child_mesh.type == 'Mesh') {
              this.meshes.push(child_mesh);
              this.all_meshes.push(child_mesh);
              this.originalMaterials[child_mesh.name] = child_mesh.material;
            }
          });

          let bbox = new THREE.Box3().setFromObject(object);
          let center = new THREE.Vector3();
          bbox.getCenter(center);
          center.setZ(bbox.max.z * 2);
          this.camera.position.set(center.x, center.y, center.z);

          this.scene.add(object);
          fetch(this.fbx_file + ".txt")
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                return null;
              }
            })
            .then((config) => {
              if (config) {
                this.load_removed(config);
              }
            });
        },
        (xhr) => {
          let num = (xhr.loaded / xhr.total) * 100;
          this.loading.setText("模型加载中:" + num.toFixed(2) + "%");
          if (num == 100) {
            this.loading.close();
          }
        },
        (error) => {
          console.error(error);
        }
      );
      console.log(this.meshes);
      this.animate();
    },
    async load_removed(config) {
      config.forEach((name) => {
        const mesh = this.meshes.find((mesh) => mesh.name === name);
        if (mesh) {
          mesh.visible = false;
          this.removed_objects.push(mesh);
          this.meshes.splice(this.meshes.indexOf(mesh), 1);
        }
      });

      if (this.removed_objects.length > 0) {
        this.revert_btn_disabled = false;
      }
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
    onMoveMove(event) {
      this.raycaster.setFromCamera(
        {
          x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
          y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
        },
        this.camera
      );
      this.intersects = this.raycaster.intersectObjects(this.meshes, false);

      if (this.intersects.length > 0) {
        this.intersectedObject = this.intersects[0].object;
      } else {
        this.intersectedObject = null;
      }

      this.meshes.forEach((o) => {
        if (
          this.start_capture &&
          this.intersectedObject &&
          this.intersectedObject.name === o.name
        ) {
          o.material = this.highlightMaterial;
        } else {
          let material = this.originalMaterials[o.name];
          if (material) {
            o.material = material;
          }
        }
      });
    },

    // save_removed() {
    //   let removed_names = this.removed_objects.map((o) => o.name);
    //   let blob = new Blob([JSON.stringify(removed_names)]);
    //   fileSave(blob, {
    //     fileName: this.fbx_file + ".txt",
    //     extensions: [".txt"],
    //   });
    // },

    load_removed_from_user_file() {
      let input = document.createElement("input");
      input.type = "file";

      input.onchange = (e) => {
        let file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
          let config = JSON.parse(e.target.result);
          this.load_removed(config);
        };
        reader.readAsText(file, "UTF-8");
      };

      input.click();
    },

    animate() {
      requestAnimationFrame(this.animate);
      let delta = this.clock.getDelta();
      this.controls.update(delta);
      this.stats.update();

      // this.camera.lookAt(this.scene.position);
      // this.controls.autoRotate = true;
      // this.camera.rotateZ(0.01);
      // this.camera.translateY(1);
      // this.camera.translateX(1);
      // this.camera.rotateY(0.005);
      // this.camera.rotateX(0.005);
      this.render();
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },
    // 回退
    revert() {
      let last_removed_object = this.removed_objects.pop();
      last_removed_object.visible = true;
      this.meshes.push(last_removed_object);
      if (this.removed_objects.length === 0) {
        this.revert_btn_disabled = true;
      }
    },
    // 返回
    back() {
      this.$router.push({ path: "/gant" });
    },
  },
};
</script>

<style scoped>
#three {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0px;
  height: 100vh;
}

.instruction {
  position: absolute;
  width: 100%;
  top: 0px;
  left: 0px;
  z-index: 1000;
}

.instruction h4 {
  text-align: center;
  color: white;
}

.file {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1000;
}
</style>
