<template>
  <div>
    <div id="box" ref="box"></div>
    <div id="iconInfo" ref="iconInfo" v-show="showIconInfo">

      <BindKnow v-if="type == 'zsb'" :bindId="bindId" :showIconInfo="showIconInfo" />

      <BindVideo v-if="type == 'sxb'" :bindId="bindId" />
    </div>

    <video :src="require(`../../assets/video/${src}`)" :ref="`video`" style="display: none;" controls></video>


  </div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { PointerLockControls } from "../../utils/PointerLockControls";

import {
  dataKnowledgeModelBindGetBindKnowledge,// 获取绑定的知识列表
  dataKnowledgeModelBindBind,//新增图标
  dataKnowledgeModelBindDelete,//删除图标
  dataSceneScenarioUpdateScenarioJson,//保存场景
} from '../../utils/api'
export default {
  data() {
    return {
      scene: new THREE.Scene(),
      camera: null,   // 设置透视摄像机
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      control: null,

      // 变化控制
      transformControls: null,
      transformControlNum: 0,

      // 定时器
      timer: null,
      isDoubleClick: false,

      // 射线交叉数组
      sceneRaycasterArr: [],
      sceneVideoRaycasterArr: [],

      // 图标绑定控制
      showIconInfo: false,
      bindId: 0,

      // 场景数据
      sceneEditData: {},

      // 清除
      animationFrameId: null,

      src: 'startVideo2.mp4',
      videoSprite: null,
      videoArr: [
        {
          id: 1,
          src: 'startVideo2.mp4'
        },
        {
          id: 2,
          src: 'startVideo2.mp4'
        },
      ],

      cameraBindId: '',
      cameraId: '',
      cameraArr: [
        {
          cameraName: '摄像头1',
          cameraId: 1
        },
        {
          cameraName: '摄像头2',
          cameraId: 2
        },
      ],

      type: null,

      // 类别名
      map: new Map()
    };
  },
  components: {
    BindKnow: () => import('../threes/BindKnow.vue'),
    BindVideo: () => import('../threes/BindVideo.vue')
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
    console.log(9999999);
    this.clear()
  },

  watch: {
    '$store.state.skyValue': {
      handler(newVal, oldVal) {
        this.scene.background = new THREE.CubeTextureLoader().load([
          `images/${newVal}/front.jpg`,
          `images/${newVal}/back.jpg`,
          `images/${newVal}/top.jpg`,
          `images/${newVal}/bottom.jpg`,
          `images/${newVal}/left.jpg`,
          `images/${newVal}/right.jpg`,
        ]);
      }
    }
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
      this.scene.add(ground);

      this.scene.add(new THREE.AmbientLight(0xffffff, 3.5));
      this.sceneEditData = JSON.parse(localStorage.getItem('sceneEditData'))
      console.log(this.sceneEditData);


      this.meshGroup = new THREE.Group();
      this.meshGroup.name = 'meshGroup'
      this.scene.add(this.meshGroup)



      console.log(JSON.parse(this.sceneEditData.json));
      let map = new Map(JSON.parse(this.sceneEditData.json))
      console.log(map);
      // return

      console.log(map.size);

      if (map.size) {
        map.forEach((value, key) => {
          this.map.set(key, [])
          value.map(item => {
            this.map.get(key).push(item.name)
            if (item.iconData) {
              this.spriteFn(item.iconData, item)
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


      // console.log(ObjectArr);
      // if (ObjectArr) {
      //   ObjectArr.map(item => {
      //     if (item.iconData) {
      //       this.spriteFn(item.iconData, item)
      //     } else {
      //       const fbxLoader = new FBXLoader();
      //       fbxLoader.load(
      //         `models / ${ item.url }`,
      //         (object) => {
      //           object.name = item.name
      //           object.url = item.url
      //           object.rotation.copy(item.rotation);
      //           object.position.copy(item.position)
      //           object.scale.copy(item.scale)
      //           this.meshGroup.add(object);
      //         })
      //     }
      //   })
      // }



      this.camera.position.set(100, 200, 300)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
      this.scene.add(this.camera)

      this.listerFn()
      this.dragFn()
      this.animate();

      // this.videoInit()

    },


    // 监听
    listerFn() {
      let that = this
      // 渲染器
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight);
      this.box.appendChild(this.renderer.domElement);
      // 控制器
      this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
      this.scene.add(this.transformControls);
      this.control = new PointerLockControls(this.camera, this.renderer.domElement);
      // 监听
      window.addEventListener("resize", () => {
        this.camera.aspect = this.$refs.box.clientWidth / this.$refs.box.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight);
        this.render();
      }, false);
      window.addEventListener('keydown', (e) => {
        if (e.key == 'Backspace') {
          this.deleteFn()
        }
        if (e.key == 'Escape') {
          this.showIconInfo = false
          this.transformControls.enabled = false
          this.transformControls.detach()
        }
        if (e.key == ' ') {
          this.transformControlNum++
          if (this.transformControlNum == 1) that.transformControls.setMode('scale');
          if (this.transformControlNum == 2) that.transformControls.setMode('rotate');
          if (this.transformControlNum == 3) {
            this.transformControlNum = 0
            that.transformControls.setMode('translate');
          }
        }
      });

      this.$refs.box.addEventListener('contextmenu', (e) => {
        if (e.button == 2) {
          this.showIconInfo = false
          this.transformControls.enabled = false
          this.transformControls.detach()
        }
      })



      this.$refs.box.addEventListener('click', (e) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (!this.isDoubleClick) {
            if (this.transformControls.object) return
            let intersects = this.fn(e)
            console.log(intersects);
            if (intersects.length > 0) {

              console.log(intersects[0].object);
              // 找到被击中对象的父组
              let parentGroup = intersects[0].object.parent;
              while (parentGroup && !(parentGroup instanceof THREE.Group)) {
                parentGroup = parentGroup.parent;
              }

              if (intersects[0].object.type == 'Sprite' || parentGroup) {
                // 将 TransformControls 附加到父组

                this.showIconInfo = false
                this.transformControls.enabled = true
                this.transformControls.setMode('translate');
                this.transformControls.attach(intersects[0].object.type == 'Sprite' ? intersects[0].object : parentGroup);
              }
            }
          }
          this.isDoubleClick = false;
        }, 270);

      });

      this.$refs.box.addEventListener('dblclick', (e) => {
        e.preventDefault();
        if (this.transformControls.object) return
        this.isDoubleClick = true;
        //if (this.videoSprite.visible && this.videoFn(e)) return
        console.log('shuang');
        let intersects = this.fn(e)
        if (intersects.length > 0 && intersects[0].object.type === 'Sprite') {
          console.log('图');
          console.log(intersects[0].object.iconData.type);
          this.sprite = intersects[0].object




          this.type = intersects[0].object.iconData.type
          console.log(this.type);
          this.bindId = intersects[0].object.iconData.bindId
          this.showIconInfo = true
          // this.bindId = intersects[0].object.iconData.bindId
          // if (this.sprite.iconData.type == 'camera') {

          //   this.type = iconData.type

          //   // this.videoId =
          //   console.log();
          //   // this.showCameraInfo = true
          //   this.cameraBindId = intersects[0].object.iconData.bindId
          //   // this.videoShow()
          // }

          // if (this.sprite.iconData.type == 'know') {
          //   this.bindId = intersects[0].object.iconData.bindId
          //   this.showIconInfo = true
          // }
        }
      });


      this.transformControls.addEventListener('change', (e) => {


        console.log(this.transformControls.object);
        if (!this.transformControls.enabled && !this.transformControls.object) {
          console.log('保存场景坐标');
          // 保存场景
          this.saveFn()
        }
      })
    },

    // 拖拽
    dragFn() {
      this.box.addEventListener(
        "dragover",
        (event) => {
          event.preventDefault();
        },
      );
      this.box.addEventListener("drop", async (e) => {
        e.preventDefault();
        if (this.transformControls.object) return
        if (e.dataTransfer.getData('icon')) {
          this.iconFn(e)
        }

        if (e.dataTransfer.getData('model')) {
          this.modelFn(e)
        }
      })
    },

    async iconFn(e) {
      let iconData = JSON.parse(e.dataTransfer.getData('icon'))
      let intersects = []
      var mouse = new THREE.Vector2();
      const rect = this.renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      // 创建射线从相机位置投射到鼠标位置
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);

      intersects = raycaster.intersectObjects(this.meshGroup.children);
      if (intersects.length > 0) {
        const res = await dataKnowledgeModelBindBind({
          scenarioId: this.sceneEditData.scenarioId,
          type: iconData.type
        })

        console.log(intersects[0].object);
        console.log(res);
        if (res.data.data) {
          this.spriteFn({
            ...iconData,
            bindId: res.data.data
          }, intersects[0].object, true)
        } else {
          this.$message.error('新增失败')
        }
      }
    },

    modelFn(e) {
      let modelData = JSON.parse(e.dataTransfer.getData('model'))
      console.log(modelData);

      // const url = modelData.url

      // 获取鼠标在屏幕上的位置
      const x = e.clientX;
      const y = e.clientY;

      // 将屏幕坐标转换为NDC坐标
      const rect = this.renderer.domElement.getBoundingClientRect();
      const ndcX = ((x - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((y - rect.top) / rect.height) * 2 + 1;

      // 创建一个射线投射器
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);

      // 假设你有一个平面或已知深度，你想要在这个位置放置物体
      // 例如，一个与y轴平行的平面，我们可以找到射线与该平面的交点
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      this.modelInit(modelData, target)
    },
    // 模型加载

    modelInit(modelData, position) {
      const fbxLoader = new FBXLoader();
      fbxLoader.load(

        modelData.url,
        (object) => {
          if (!this.map.get(modelData.name)) this.map.set(modelData.name, [])
          object.name = modelData.name + (this.map.get(modelData.name).length + 1)
          this.map.get(modelData.name).push(object.name)

          object.url = modelData.url
          object.rotation.copy(new THREE.Euler(0, 0, 0));
          object.position.copy(position)



          this.meshGroup.add(object);
          // object.children.slice().forEach(child => {
          //   // 获取子对象的世界位置和旋转
          //   const worldPosition = new THREE.Vector3();
          //   const worldQuaternion = new THREE.Quaternion();
          //   child.getWorldPosition(worldPosition);
          //   child.getWorldQuaternion(worldQuaternion);
          //   // 将子对象添加到meshGroup

          //   child.name = `${ child.name } - ${ this.meshGroup.children.length }`
          //   this.meshGroup.add(child);

          //   // 根据之前的世界坐标和旋转调整位置和方向
          //   child.position.copy(worldPosition);
          //   child.quaternion.copy(worldQuaternion);
          // });
          // this.scene.remove(object)


          // this.sceneRaycasterArr = this.meshGroup.children
          console.log(this.scene);
          this.saveFn()

          // console.log(this.meshGroup);
          // console.log(this.scene);



          // console.log(this.scene.children);

          // object

          // let transformsArr = JSON.parse(this.sceneEditData.json)

          // 可交射线
          // this.sceneRaycasterArr = object.children
          // if (transformsArr) {
          //   transformsArr.forEach((item) => {
          //     if (item.iconData) {
          //       this.spriteFn(item.iconData, item)
          //     }
          //     const object = this.scene.getObjectByName(item.name);
          //     // console.log(object);
          //     if (object) {
          //       object.position.copy(item.position);
          //       object.rotation.copy(item.rotation);
          //       object.scale.copy(item.scale);
          //     }
          //   });
          // }
        },
        // (xhr) => {
        //   let num = (xhr.loaded / xhr.total) * 100;
        //   this.loading.setText("模型加载中:" + num.toFixed(2) + "%");
        //   if (num == 100) {
        //     this.loading.setText("模型载入...");
        //     setTimeout(() => {
        //       this.loading.close();
        //     }, 1000)
        //   }
        // },
      );
    },




    // 创建图标
    spriteFn(item, object, boolean) {
      const textureLoader = new THREE.TextureLoader();
      const spriteMaterial = new THREE.SpriteMaterial({ map: textureLoader.load(`images/${item.icon}.png`) });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(20, 20, 20)
      sprite.material.color.set('#ffffff')
      sprite.iconData = item

      if (boolean) {
        if (!this.map.get(item.name)) this.map.set(item.name, [])
        sprite.name = item.name + (this.map.get(item.name).length + 1)
        this.map.get(item.name).push(sprite.name)
      } else {
        sprite.name = object.name
      }
      sprite.position.copy(object.position)
      this.meshGroup.add(sprite)

      if (boolean) {
        this.transformControls.enabled = true
        this.transformControls.attach(sprite);
      }
    },

    videoInit() {
      const texture = new THREE.VideoTexture(this.$refs.video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.SpriteMaterial({ map: texture });
      this.videoSprite = new THREE.Sprite(material);
      this.videoSprite.visible = false
      this.videoSprite.name = 'videoSprite'
      this.videoSprite.scale.set(40, 30, 1)
      this.scene.add(this.videoSprite)
      this.sceneVideoRaycasterArr.push(this.videoSprite)
    },

    // 测试video
    videoShow() {
      // 显示
      if (this.videoSprite.visible) {
        this.sprite.material.color.set("#ffffff")
        this.$refs.video.pause()
      } else {
        this.sprite.material.color.set("#ff0000")
        this.videoSprite.position.set(this.sprite.position.x + 30, this.sprite.position.y, this.sprite.position.z)
      }
      this.videoSprite.visible = !this.videoSprite.visible
    },

    videoFn(e) {
      let intersects = this.fn(e, true)
      if (intersects.length > 0 && intersects[0].object.name === 'videoSprite') {
        const video = this.$refs.video;
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
        return true
      }
    },

    // 删除事件
    async deleteFn() {
      if (!this.transformControls.object) return
      // 如果是图标
      if (this.transformControls.object.iconData) {
        const res1 = await dataKnowledgeModelBindGetBindKnowledge({ bindId: this.transformControls.object.iconData.bindId })
        console.log(res1);
        if (res1?.data.data.arr.length) {
          this.$message.error('绑定知识不为空不能删除图标')
          return
        } else {
          const res2 = await dataKnowledgeModelBindDelete({
            bindId: this.transformControls.object.iconData.bindId
          })

          console.log('删除');
          if (res2.data.data != 'ok') return

          this.scene.traverse(item => {
            if (item.type == 'Group') {
              item.remove(this.transformControls.object)
            }
          })
          // 清除控制
          this.transformControls.enabled = false
          this.transformControls.detach();
        }
      } else {
        let name = ''
        this.map.forEach((value, key) => {
          if (value.includes(this.transformControls.object.name)) {
            name = value[value.length - 1]
            value.pop()
          }
        })
        let object = this.scene.getObjectByName(name)
        object.name = this.transformControls.object.name
        this.meshGroup.remove(this.transformControls.object);
        this.transformControls.enabled = false
        this.transformControls.detach();
      }
    },

    // 保存场景坐标
    async saveFn() {
      let map = new Map()

      this.map.forEach((value, key) => {
        map.set(key, [])
        value.map(item => {
          console.log(value);
          console.log(item);
          let object = this.scene.getObjectByName(item)
          console.log(object);
          if (object.iconData) {
            map.get(key).push({
              iconData: object.iconData,
              name: object.name,
              position: object.position.clone(),
              rotation: object.rotation.clone(),
              scale: object.scale.clone(),
            })
          } else {
            map.get(key).push({
              name: object.name,
              position: object.position.clone(),
              rotation: object.rotation.clone(),
              scale: object.scale.clone(),
              url: object.url
            })
          }
        })
      })
      // this.sceneEditData.json = JSON.stringify(Array.from(map.entries()))
      // localStorage.setItem('sceneEditData', JSON.stringify(this.sceneEditData))

      // return
      let res = await dataSceneScenarioUpdateScenarioJson({
        scenarioId: this.sceneEditData.scenarioId,
        json: JSON.stringify(Array.from(map.entries()))
      })
      console.log(res);
      if (res.data.data == 'ok'); {
        this.sceneEditData.json = JSON.stringify(Array.from(map.entries()))
        localStorage.setItem('sceneEditData', JSON.stringify(this.sceneEditData))
      }
    },

    // 2d实时三维
    updateScrollableDivPosition() {
      const vector = new THREE.Vector3();
      vector.setFromMatrixPosition(this.sprite.matrixWorld);
      vector.project(this.camera);
      const x = ((vector.x * 0.5) + 0.5) * this.renderer.domElement.clientWidth;
      const y = -((vector.y * 0.5) - 0.5) * this.renderer.domElement.clientHeight;
      this.$refs.iconInfo.style.left = `${x}px`;
      this.$refs.iconInfo.style.top = `${y}px`;
    },

    // 变化射线控制
    fn(e, arr) {
      console.log(e);
      console.log(this.meshGroup.children);
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
      this.renderer.render(this.scene, this.camera);
    },

    clear() {
      console.log('清');
      cancelAnimationFrame(this.animationFrameId);
      this.scene = null;
      this.camera = null
      this.renderer.dispose();
      this.control.dispose();
      this.transformControls.dispose()
      localStorage.removeItem('sceneEditData')
    }

  },
}
</script>

<style lang='less' scoped>
#box {
  width: 100vw;
  height: 100vh;
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
