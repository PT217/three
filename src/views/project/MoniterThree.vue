<template>
  <div>
    <div id="box" ref="box"></div>
    <div id="iconInfo" ref="iconInfo" v-show="showIconInfo">
      <IconInfo ref="IconInfo" :iconId="iconId" />
    </div>

    <video v-if="videoArr.length" v-for="item in videoArr" :key="item.iconData.bindId"
      :src="require(`../../assets/video/${src}`)" :ref="`video${item.iconData.bindId}`" style="display: none;"
      controls></video>
  </div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { PointerLockControls } from "../../utils/PointerLockControls";
import IconInfo from './IconInfo.vue'
import flvjs from 'flv.js';

// 后期处理效果
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

import {
  dataCameraGetCameraVideo,  // 开启转码
  dataCameraOffCameraVideo,  // 关闭转码
} from "../../utils/api"
export default {

  props: {
    lightName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      scene: new THREE.Scene(),
      camera: null,   // 设置透视摄像机
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      control: null,


      //后期处理
      composer: null,
      renderPass: null,
      outlinePass: null,
      effectFXAA: null,

      // 定时器
      timer: null,
      isDoubleClick: false,



      // 射线交叉数组
      sceneRaycasterArr: [],
      sceneVideoRaycasterArr: [],


      // 场景数据
      sceneData: {},
      showIconInfo: false,
      iconId: 0,

      // 清除
      animationFrameId: null,


      src: 'startVideo2.mp4',

      videoArr: []
    };
  },
  components: {
    IconInfo
  },

  created() {
    // this.loading = this.$loading({
    //   lock: true,
    //   text: "Loading",
    //   spinner: "el-icon-loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.clear()
  },

  watch: {
    lightName(newVal, oldVal) {
      if (newVal) {
        const target = this.scene.getObjectByName(newVal);
        this.transition(target);
        this.targetModelLight(target);
      } else {
        this.targetModelLight(null);
      }
    },
  },
  methods: {

    // 初始化
    init() {
      this.box = document.getElementById("box");
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.box.clientWidth / this.$refs.box.clientHeight,
        1,
        200000
      )

      let path = this.$store.state.skyValue


      this.scene.background = new THREE.CubeTextureLoader().load([
        `images/${path}/front.jpg`,
        `images/${path}/back.jpg`,
        `images/${path}/top.jpg`,
        `images/${path}/bottom.jpg`,
        `images/${path}/left.jpg`,
        `images/${path}/right.jpg`,
      ]);

      // 创建一个土色地面
      const groundGeometry = new THREE.PlaneGeometry(800, 800); // 地面大小
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xd2b48c }); // 土色材质
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2; // 使地面朝上
      ground.position.y = -0.1  //避免地面与模型的草地重合而闪烁

      this.scene.add(new THREE.AmbientLight(0xffffff, 3.5));

      this.meshGroup = new THREE.Group();
      this.meshGroup.name = 'meshGroup'
      this.scene.add(this.meshGroup)

      this.sceneData = JSON.parse(localStorage.getItem('sceneData'))

      let map = new Map(JSON.parse(this.sceneData.json))

      console.log(map);
      if (map.size) {


        map.forEach((value, key) => {
          value.map(item => {
            if (item.iconData) {
              this.spriteFn(item.iconData, item)
              if (item.iconData.type == 'sxb') {
                this.videoArr.push(item)
                console.log(4);
              }
            } else {
              const fbxLoader = new FBXLoader();
              fbxLoader.load(
                item.url,
                (object) => {
                  object.name = item.name
                  object.url = item.url
                  object.rotation.copy(item.rotation);
                  object.position.copy(item.position)
                  object.scale.copy(item.scale)
                  this.meshGroup.add(object);
                })
            }
          })
        });
      }

      if (this.videoArr.length) this.videoInit()
      this.camera.position.set(100, 200, 300)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
      this.scene.add(this.camera)

      this.listerFn()
      this.animate();
      // 后期处理
      this.postprocessingInit();

    },

    // 监听
    listerFn() {
      let that = this
      // 渲染器
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight);
      this.box.appendChild(this.renderer.domElement);

      // 控制器
      this.control = new PointerLockControls(this.camera, this.renderer.domElement);
      // 监听
      window.addEventListener("resize", () => {
        this.camera.aspect = this.$refs.box.clientWidth / this.$refs.box.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight);
        this.render();
      }, false);



      this.$refs.box.addEventListener('contextmenu', (e) => {
        if (e.button == 2) {
          this.showIconInfo = false
        }
      })

      // this.$refs.box.addEventListener('click', (e) => {
      //   clearTimeout(this.timer);
      //   this.timer = setTimeout(() => {
      //     if (!this.isDoubleClick) {
      //       let intersects = this.fn(e)
      //       if (intersects.length > 0) {
      //         this.showIconInfo = false
      //       }
      //     }
      //     this.isDoubleClick = false;
      //   }, 270);

      // });

      this.$refs.box.addEventListener('dblclick', (e) => {
        e.preventDefault();
        // this.isDoubleClick = true;
        let intersects = this.fn(e)
        console.log(intersects[0].object.type);
        if (intersects.length > 0 && intersects[0].object.type === 'Sprite') {
          this.sprite = intersects[0].object
          console.log(this.sprite);
          console.log(this.sprite.bindId);
          if (this.sprite.visible && this.sprite.bindId) {
            const video = this.$refs[`video${this.sprite.bindId}`][0]
            if (video.paused) {
              this.sprite.material.color.set("#ffffff")
              video.play()
            } else {
              this.sprite.material.color.set("#ff0000")
              video.pause()
            }
            return
          }

          if (this.sprite.iconData.type == 'sxb') {
            this.showIconInfo = false
            this.videoShow()
            return
          }

          if (this.sprite.iconData.type == 'zsb') {
            this.iconId = intersects[0].object.iconData.bindId
            this.showIconInfo = true
          }
        }
      });
    },


    // 创建图标
    spriteFn(item, object, boolean) {
      const textureLoader = new THREE.TextureLoader();
      const spriteMaterial = new THREE.SpriteMaterial({ map: textureLoader.load(`images/${item.icon}.png`) });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 20, 20)
      sprite.name = object.name
      sprite.material.color.set('#ffffff')
      sprite.iconData = item
      sprite.position.copy(object.position)
      this.meshGroup.add(sprite)

    },
    videoInit() {
      console.log(3);
      this.$nextTick(() => {
        this.videoArr.map(item => {
          const texture = new THREE.VideoTexture(this.$refs[`video${item.iconData.bindId}`][0]);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const material = new THREE.SpriteMaterial({ map: texture });
          let sprite = new THREE.Sprite(material);
          sprite.visible = false
          sprite.name = item.name + 'video'
          sprite.bindId = item.iconData.bindId
          sprite.position.set(item.position.x + 30, item.position.y, item.position.z)
          sprite.scale.set(40, 30, 1)
          this.meshGroup.add(sprite)
        })
      })
    },
    async videoShow() {
      let sprite = this.scene.getObjectByName(this.sprite.name + 'video')
      // 显示
      console.log(sprite.visible);
      if (sprite.visible) {
        this.$refs[`video${sprite.bindId}`][0].pause()
        sprite.flvPlayer.destroy()
        // 关闭转码
        await dataCameraOffCameraVideo({ bindId: sprite.bindId })
      } else {
        let res = await dataCameraGetCameraVideo({ bindId: sprite.bindId })
        if (res) {
          let flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: res.data.data.cameraHttpUrl,
          });
          sprite.flvPlayer = flvPlayer
          flvPlayer.attachMediaElement(this.$refs[`video${sprite.bindId}`][0]);
          flvPlayer.load();
          flvPlayer.play().catch(error => {
            // console.error('Error while trying to play:', error);
          });
          sprite.material.color.set("#ffffff")
          this.transition(sprite)
        }
      }
      sprite.visible = !sprite.visible
    },
    // 2d实时三维
    updateScrollableDivPosition() {
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(this.sprite.matrixWorld);
      vector.project(this.camera);

      const rect = this.$refs.box.getBoundingClientRect();
      const offsetY = rect.top; // 获取顶部偏移量

      const x = ((vector.x * 0.5) + 0.5) * this.renderer.domElement.clientWidth;
      let y = -((vector.y * 0.5) - 0.5) * this.renderer.domElement.clientHeight;
      y += offsetY
      this.$refs.iconInfo.style.left = `${x}px`;
      this.$refs.iconInfo.style.top = `${y}px`;
    },

    // 变化射线控制
    fn(e) {
      let intersects = []
      var mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      // 创建射线从相机位置投射到鼠标位置
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      intersects = raycaster.intersectObjects(this.meshGroup.children);
      return intersects
    },



    // 动画
    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.control._update()
      this.render()
      if (this.showIconInfo) this.updateScrollableDivPosition()
    },

    // 渲染
    render() {
      // this.renderer.render(this.scene, this.camera);
      this.composer?.render();
    },

    clear() {
      console.log('清');
      cancelAnimationFrame(this.animationFrameId);
      this.scene = null;
      this.camera = null
      this.renderer.dispose();
      this.control.dispose();
      localStorage.removeItem('sceneData')
    },


    // 平移到目标(球)
    transition(item) {
      console.log(item);
      // cameraPosition 是当前相机的位置
      const cameraPosition = this.camera.position.clone();
      // targetPosition 是目标位置
      const targetPosition = item.position
      // 定义期望距离
      const targetDistance = 100;

      const startTime = Date.now();

      const update = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        // 过渡0.5秒（可以根据需求调整）
        const t = Math.min(elapsedTime / 500, 1); // 计算过渡的进度（范围在 0 到 1 之间）

        // 计算相机到目标的方向向量
        const direction = new THREE.Vector3().copy(targetPosition).sub(cameraPosition).normalize();
        // 计算新的相机位置，确保相机与目标的距离不超过期望距离
        const newPosition = new THREE.Vector3().copy(targetPosition).sub(direction.multiplyScalar(targetDistance));

        // 使用球面插值平滑过渡相机位置
        const smoothPosition = new THREE.Vector3().copy(cameraPosition).lerp(newPosition, t);
        this.camera.lookAt(targetPosition);
        // 设置相机位置
        this.camera.position.copy(smoothPosition);

        if (t < 1) {
          // 如果过渡还未完成，继续更新
          requestAnimationFrame(update);
        }
      };

      // 启动过渡更新
      requestAnimationFrame(update);
    },



    // 清空光柱
    clearObjects() {
      if (this.objects.length > 0) {
        this.scene.remove(this.objects[0])
        this.objects = []
      }
    },

    // 设备点击
    deviceFn(item) {
      this.clearObjects()
      this.transition(item)
      const radius = 0.5; // 圆锥的底面半径
      const height = 1000; // 圆锥的高度
      const segments = 20; // 圆锥的分段数
      const geometry = new THREE.ConeGeometry(radius, height, segments);

      const material = new THREE.MeshStandardMaterial({
        color: 0x0000ff, // 青色（蓝绿色）
        emissive: 0x0000ff, // 发光颜色c
        emissiveIntensity: 1, // 发光强度
        metalness: 1, // 金属感
        roughness: 0.2, // 反射效果的粗糙程度
        transparent: true, // 设置材质为半透明
        opacity: 0.5, // 设置材质的透明度（0为完全透明，1为完全不透明）
      }); // 绿色
      const cone = new THREE.Mesh(geometry, material);
      cone.position.set(item.position.x, item.position.y + 500, item.position.z);
      this.objects.push(cone);
      this.scene.add(cone)

    },

    targetModelLight(targetModel) {
      // 关闭高亮逻辑待完善
      //添加高亮
      this.outlinePass.selectedObjects = targetModel ? [targetModel] : [];
    },

    //后期处理初始化
    postprocessingInit() {
      // 效果生成器，接管场景渲染管道
      this.composer = new EffectComposer(this.renderer);

      // 创建渲染管道
      this.renderPass = new RenderPass(this.scene, this.camera);
      // 为生成器添加渲染管道
      this.composer.addPass(this.renderPass);

      this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
      );
      this.composer.addPass(this.outlinePass);

      this.outlinePass.visibleEdgeColor = new THREE.Color(255, 0, 0);
      this.outlinePass.hiddenEdgeColor = new THREE.Color(255, 255, 255);

      const outputPass = new OutputPass();
      this.composer.addPass(outputPass);

      this.effectFXAA = new ShaderPass(FXAAShader);
      this.effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      this.composer.addPass(this.effectFXAA);
    },

  },
}
</script>

<style lang='less' scoped>
#box {
  width: 100vw;
  height: calc(100vh - 200px) !important;
  position: absolute;
}

.btn {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 70px;
  right: 10px;
}


#iconInfo {
  position: absolute;
  width: 270px;
  height: 243px;
  border: 1px solid skyblue;
  top: 0;
  left: 0;
}
</style>