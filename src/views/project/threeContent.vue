<template>
  <div>
    <div id="threeContainer" ref="three">
      <!-- css2d-info -->
      <div id="unique-2d-info" style="display: none;">
        <div class="header-box">
          <div class="kw-name-box">
            <div v-if="clickIsEditer">
              <el-input type="text" maxlength="10" v-model="clickObjData.explain" size="mini"
                placeholder="未命名"></el-input>
              <div class="btn" v-if="editor" @click="css2dTabHandlerFn(clickObjData, '保存')">&nbsp;保存&nbsp;</div>
            </div>
            <div v-else>
              {{ clickObjData.explain ? clickObjData.explain : "未命名" }}
              <div class="btn" v-if="editor" @click="css2dTabHandlerFn(clickObjData, '编辑')">&nbsp;编辑&nbsp;</div>
            </div>
          </div>
          <div class="kw-add-icon" v-if="editor" @click="css2dTabHandlerFn(null, '新增')">+</div>
        </div>

        <div class="kw-content">

          <div class="bind-list" v-for="(item, index) in clickContentData" :key="index">
            <div class="bind-list-content">{{ item.knowledgeName }}</div>
            <div class="bind-list-tools">
              <span @click="css2dTabHandlerFn(item, '查看')">查看</span>
              &nbsp;
              <span v-if="editor" @click="css2dTabHandlerFn(item, '解绑')">解绑</span>
            </div>

          </div>
        </div>
        <div class="kw-footer">
          <el-row v-if="clickContentData.length == 0 && editor">
            <el-button type="danger" size="mini" @click="css2dTabHandlerFn(null, '删除')">删除</el-button>
          </el-row>
          <el-row>
            <el-button size="mini" @click="css2dTabHandlerFn(null, '关闭')">关闭</el-button>
          </el-row>
        </div>
      </div>
    </div>


    <el-dialog :visible.sync="visible" top="30vh" :before-close="resetFn" width="30%">
      <template slot="title">
        <div class="title_content">
          <div class="title_icon"></div>
          <div>
            {{ title }}
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit">确 定</el-button>
      </span>

      <div class="dialog-content">
        <span v-if="title == '删除'">
          是否需要删除图标?
        </span>
        <span v-else>
          确认解绑该信息，解绑后不可恢复！
        </span>
      </div>
    </el-dialog>


    <!-- 绑定知识库弹框 -->
    <el-drawer v-if="drawer" :visible.sync="drawer" :before-close="bindBackFn" size="74%">
      <template slot="title">
        <div class="title_content">
          <div class="title_icon"></div>
          <div>
            <span>标题：{{ clickObjData.explain ? clickObjData.explain : "未命名" }}</span>
          </div>
        </div>
      </template>

      <div class="bind-box">

        <div class="bind-left">
          <div class="bind-left-first">
            <div class="header">知识分类</div>
            <el-radio-group class="group" v-model="request.data.classifyId" size="mini" @input="requestFn">
              <el-radio-button v-for=" item  in   knowledgeList  " :label="item.classifyId" :key="item.classifyId">
                {{ item.classifyName }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <div class="header">知识标签</div>
            <el-checkbox-group class="group" v-model="request.data.tagIdList" size="mini" @input="requestFn">
              <el-checkbox-button v-for=" item  in   tagList  " :label="item.tagId" :key="item.tagId">
                {{ item.tagName }}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>

        <div class="bind-right">
          <el-form inline>
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-input placeholder="请输入关键字搜索" size="mini" v-model="request.data.knowledgeName"
                    class="input-with-select">
                    <span slot="suffix" class="el-icon-search el-input__icon" @click="requestFn('reset')"></span>
                    <!-- <el-button slot="append" icon="el-icon-search" @click="requestFn('reset')"></el-button> -->
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <Tab :showTitle="false" :tabShow="false" :request="request" @pageChange="pageChange" @limitChange="limitChange">
            <template slot="select">

            </template>


            <div class="container">
              <div class="info">
                <div class="box" v-for="item in  publishArr   " :key="item.knowledgeId">
                  <div class="content">

                    <div class="head">
                      <span>标题名称：
                        <span v-html="searchValueFn(item.knowledgeName)" />
                      </span>
                    </div>

                    <div class="center">

                      <div class="classify">知识分类：
                        <span v-html="searchValueFn(item.classifyName)" />
                      </div>
                      <div>知识标签：
                        <el-tag v-for="( tag, tagIndex  ) in item.tagIdList" :key="tagIndex" size="mini" effect="dark"
                          style="margin-right: 5px;">{{ tagMap.get(tag) }}</el-tag>
                      </div>
                      <div>最新更新时间：{{ item.updateTime ? item.updateTime : item.createTime }}</div>
                      <div>更新人：{{ item.creatorName }}</div>
                    </div>

                    <div class="desc">
                      <div class="bottom" v-html="searchValueFn(item.knowledgeExplain)" />
                      <div class="btn">
                        <el-row>
                          <el-button type="primary" size="mini" @click="kwDrawerFn('查看', item)">查看</el-button>
                          <el-button :class="bindFn(item) ? 'ybd—bth' : ''" :disabled="bindFn(item)"
                            :type="bindFn(item) ? 'info' : 'primary'" size="mini" @click="kwDrawerFn('绑定', item)">{{
                              bindFn(item) ? '已绑定' : '绑定' }}</el-button>
                        </el-row>
                      </div>
                    </div>

                  </div>


                </div>

              </div>

            </div>
          </Tab>

        </div>
      </div>

      <div class="bind_btn">
        <el-button size="mini" type="primary" @click="bindBackFn">关 闭</el-button>
      </div>

    </el-drawer>



    <!-- 查看知识库详情弹框 -->
    <KnowledgeInfo ref="kwdm" :kwData="kwData" />
    <div id="stats" ref="stats"></div>
  </div>
</template>

<script>
import {
  dataKnowledgeModelBindBind,
  dataKnowledgeModelBindUpdate,
  dataKnowledgeModelBindKnowledgeBind,
  dataKnowledgeModelBindDeleteBind,
  dataKnowledgeModelBindGetBindKnowledge,
  dataKnowledgeModelBindDelete,
  // 知识库查看相关↓
  dataKnowledgePage as requestFn,// 分页查询
  dataKnowledgeClassifyGetNameList,//分类
  dataKnowledgeTagGetTagList,//标签
} from '../../utils/api'
import * as THREE from 'three'
// import { FlyControls } from "../../utils/FlyControls";
import { PointerLockControls } from "../../utils/PointerLockControls";
import { getTransformControls, setEscapeKeyCall } from "../../utils/transformControls";
import { FBXLoader } from "three/addons/loaders/FBXLoader";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import Stats from "three/examples/jsm/libs/stats.module";

import Tab from '../../components/Tab.vue'
import KnowledgeInfo from '../../components/KnowledgeInfo.vue'
export default {
  components: {
    Tab,
    KnowledgeInfo,
  },

  data() {
    return {

      tempSelectVal: null,
      kwData: {},
      // 知识分类
      knowledgeList: [],
      // 知识标签
      tagList: [],
      tagMap: null,
      publishArr: [],
      request: {

        data: {
          classifyId: null, //分类id
          classifyList: [],
          tagIdList: [],//标签id
          knowledgeName: "",//知识名称
          knowledgeStatus: null, // 7 查询已发布知识 null为未发布
        },

        page: 1,
        limit: 5,
        total: 5
      },

      clickObjData: {},
      clickContentData: [],
      clickIsEditer: false,

      visible: false,
      drawer: false,
      title: "",
      modalData: {},

      // 当前摄像头
      obj: {},
      tooltip: {},
      // 存放精灵图信息的数组
      spriteArr: [],
      // 当前场景中有效摄像头数组
      cameraList: [],
      // 当前场景中有效设备数组
      deviceList: [],
      // 光柱数组
      objects: [],
      // 发出的射线
      raycaster: new THREE.Raycaster(),
      // 与射线相交的对象数组
      intersects: [],
      // 当前与射线相交数组的第0项
      intersectedObject: null,
      //****************** */
      rayObjects: [],
      rayLine: null,
      //************************* */

      // 鼠标xy坐标
      pointer: new THREE.Vector2(),

      // 场景
      scene: new THREE.Scene(),
      // 相机
      camera: "",
      // 渲染器
      renderer: new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        logarithmicDepthBuffer: true,
      }),
      // css2d 渲染器
      css2DRenderer: new CSS2DRenderer(),


      clock: new THREE.Clock(),
      controls: null,
      transformControls: null,
      defaultColor: new THREE.Color(0x87CEEB),
      clickedColor: new THREE.Color(0xFF0000),

      animationFrameId: "",

      sceneWarnArr: [],

      stats: Stats(),

    };
  },

  props: {
    cameraArr: {
      type: Array,
      default: () => []
    },
    deviceArr: {
      type: Array,
      default: () => []
    },
    warnArr: {
      type: Array,
      default: () => []
    },
    editor: {
      type: Boolean,
      default: false
    },
    iconData: {
      type: Array,
      default: () => []
    },
    css2dData: {
      type: Array,
      default: () => []
    }
  },


  created() {
    this.loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    console.log(333);
  },

  beforeDestroy() {

    let that = this
    cancelAnimationFrame(this.animationFrameId);
    this.camera = null
    this.scene.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        // 如果是网格对象，销毁其几何体和材质
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(function (material) {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
        that.scene.remove(object);
      }

      // 从场景中移除对象


    });
    console.log('xiao');
    this.scene = null;
    // this.renderer.domElement.ownerDocument.exitPointerLock();
    this.renderer.dispose();
    this.controls.dispose();
    if (this.transformControls) this.transformControls.dispose();
  },


  watch: {
    cameraArr: {
      handler(newVal, oldVal) {
        if (newVal.length > 0) this.init()
      }
    },
    warnArr: {
      handler(newVal, oldVal) {
        if (newVal.length > 0) this.showAllWarn()
      }
    },
  },

  methods: {

    init() {

      if (!this.cameraArr.length) return
      // 相机初始化
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.three.clientWidth / this.$refs.three.clientHeight,
        1,
        200000
      )
      console.log('init');
      this.camera.position.set(30, 40, 50)
      // this.camera.position.z = 5

      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 2);
      this.scene.add(ambientLight);

      // 添加方向光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 选择合适的颜色和强
      directionalLight.position.set(50, 500, 50); // 设置光源位置
      directionalLight.target.position.set(0, 0, 0); // 设置光源目标位置
      this.scene.add(directionalLight);
      this.scene.add(directionalLight.target);

      // 构建场景天空
      const path = 'white'
      this.scene.background = new THREE.CubeTextureLoader().load([
        `images/${path}/front.jpg`,
        `images/${path}/back.jpg`,
        `images/${path}/top.jpg`,
        `images/${path}/bottom.jpg`,
        `images/${path}/left.jpg`,
        `images/${path}/right.jpg`,
      ]);

      // // 创建带有网格的辅助坐标系
      // const gridHelper = new THREE.GridHelper(500, 500);
      // // 网格辅助坐标系的大小和分割数
      // this.scene.add(gridHelper);

      // // 创建辅助坐标系
      // const axesHelper = new THREE.AxesHelper(500);
      // // 参数表示辅助坐标系的大小
      // this.scene.add(axesHelper);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        logarithmicDepthBuffer: true,
      })

      this.renderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight);
      this.$refs.three.appendChild(this.renderer.domElement);
      this.$refs.stats.appendChild(this.stats.dom);

      this.css2DRenderer = new CSS2DRenderer();
      // this.css2DRenderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight);
      this.css2DRenderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight);
      // 设置绝对定位，防止与renderer组合产生滚动条
      this.css2DRenderer.domElement.style.position = 'absolute';
      this.css2DRenderer.domElement.style.top = '0px';
      // 允许鼠标点击事件穿透到canvas层
      this.css2DRenderer.domElement.style.pointerEvents = 'none'
      this.$refs.three.appendChild(this.css2DRenderer.domElement);

      // 添加控制器
      this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
      // this.controls.dragToLook = true;
      // this.controls.movementSpeed = 10;
      // this.controls.rollSpeed = 2;

      // 添加事件
      window.addEventListener("resize", this.onWindowResize, false);
      this.renderer.setPixelRatio(window.devicePixelRatio)


      // 导入模型 /models/05/maps/  /models/05/05.FBX
      // 小模型开发测试用，需搭配spriteFn中的return使用  /models/dev/maps/ /models/dev/FBX/building.fbx
      const fbxLoader = new FBXLoader();
      fbxLoader.setResourcePath("/models/05/");
      fbxLoader.load(
        '/models/05/05.FBX',
        (object) => {

          this.cameraList = this.cameraArr.map(cameraItem => {
            let temp = object.children.find(modelItme => cameraItem.cameraName == modelItme.name)
            if (temp) {
              return {
                position: temp.position,
                cameraName: temp.name,
                cameraId: cameraItem.cameraId,
                cameraHttpUrl: cameraItem.cameraHttpUrl,
                isClick: false
              }
            }
          })

          this.deviceList = this.deviceArr.map(diviceItem => {
            let temp = object.children.find(modelItem => diviceItem.equipmentName == modelItem.name)
            if (temp) {
              return {
                ...temp,
                deviceName: temp.name,
                devicePosotion: [temp.position.x, temp.position.y, temp.position.z],
              }
            }
          })


          const exportedRotation = new THREE.Euler(0, 0, 0);
          object.rotation.copy(exportedRotation);
          object.position.set(0, 0, 0);
          this.scene.add(object);
          this.rayObjects.push(object)

          // 创建精灵网格
          this.spriteFn()
          this.showAllWarn()
          // 回显css2d数据
          this.showCss2dFn()
          this.animate();
        },
        (xhr) => {
          let num = (xhr.loaded / xhr.total) * 100;
          this.loading.setText("模型加载中:" + num.toFixed(2) + "%");
          if (num == 100) {
            this.loading.setText("模型载入...");
          }
        },
      );

      if (this.editor) {
        this.initEditor()
      }

      // 创建鼠标点击的射线对象
      // 创建一个表示射线的材质
      // const rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      // // 初始时射线的起点和终点都为原点
      // const rayGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      // this.rayLine = new THREE.Line(rayGeometry, rayMaterial);
      // this.scene.add(this.rayLine);

    },

    initEditor() {
      //变换控制器
      this.transformControls = getTransformControls(this.camera, this.renderer, () => {
        console.log("删除（隐藏）模型的回调");
      })
      // 事件
      setEscapeKeyCall((obj) => this.saveCss2dToBackground(obj))
      this.scene.add(this.transformControls)

      document.addEventListener('keydown', function (event) {
        // 检查是否按下了Ctrl键
        var ctrlKeyPressed = event.ctrlKey;

        // 检查是否按下了鼠标左键
        var leftMouseButtonClicked = event.button === 0;

        // 如果按下了Ctrl键并且点击了鼠标左键，则执行相应的操作
        if (ctrlKeyPressed && leftMouseButtonClicked) {
          // 执行你的操作
          console.log('Ctrl键 + 鼠标左键组合键被触发');
        }
      });

      // 拖拽区域检测
      let dragOver = document.getElementById('threeContainer')
      dragOver.addEventListener(
        "dragover",
        (event) => {
          // 检测是否可以放置
          this.canAddCheck(event)
        },
        false,
      );

      // 放置事件
      dragOver.addEventListener("drop", (event) => {
        // 阻止默认行为（会作为某些元素的链接打开）
        event.preventDefault();

        let iconName = event.dataTransfer.getData('addItem')
        if (!iconName) {
          console.log("拖拽未传入iconName");
          return
        }

        this.pointer = this.getRealPoint(event)
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.rayObjects, true);

        if (intersects.length > 0) {

          // 获取相交的模型
          const intersectedModel = intersects[0].object;

          // 新增css2d
          this.addElementFn(iconName, intersectedModel)

          // // 创建一个新的模型，例如一个立方体
          // const rollOverGeo = new THREE.BoxGeometry(10, 10, 10);
          // let rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
          // let newModel = new THREE.Mesh(rollOverGeo, rollOverMaterial);

          // // 设置新模型的位置为相交模型的顶部
          // newModel.position.copy(intersectedModelWorldPos);
          // newModel.position.y += intersectedModelSize.y / 2 + 5; // 5 是新模型的高度的一半

          // // 将新模型添加到场景中
          // this.scene.add(newModel);
        }
      });

    },

    // 封装 this.transformControls.attach,增加更换对象时的保存
    customAttach(obj) {
      let old = this.transformControls.object
      if (old && (old.id != obj.id)) {
        // 控制对象更换 保存旧对象
        this.saveCss2dToBackground(old)
      }
      this.transformControls.attach(obj)
    },

    // 摄像头精灵图
    spriteFn() {
      this.loading.setText("载入完成");
      setTimeout(() => {
        this.loading.close();
      }, 1000)

      // return
      this.cameraList.forEach(item => {
        const textureLoader = new THREE.TextureLoader();
        const spriteTexture = textureLoader.load('images/jlt.png'); // 替换为你的 Sprite 图片路径

        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteTexture });
        spriteMaterial.color = new THREE.Color(0x87ceeb)
        const sprite = new THREE.Sprite(spriteMaterial);

        // sprite.o
        sprite.scale.set(2, 2, 2)
        sprite.position.set(item.position.x, item.position.y, item.position.z); // 替换为你想要的位置坐标d

        this.scene.add(sprite);
        this.spriteArr.push({ ...sprite, ...item })
      });
      this.createEvent()
    },

    // 精灵图点击
    createEvent() {
      this.$refs.three.addEventListener('click', (e) => {
        var mouse = new THREE.Vector2();

        const rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        // 创建射线从相机位置投射到鼠标位置
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        // 检测射线与场景中的对象相交
        let intersects = raycaster.intersectObjects(this.scene.children);
        console.log(intersects);
        if (intersects.length > 0) {
          let intersectedObject = intersects[0].object;
          if (intersectedObject.type == 'Sprite') {
            let temp = this.spriteArr.find(item => item.uuid == intersectedObject.uuid)
            console.log(temp);
            console.log(intersectedObject.uuid);
            temp.isClick = !temp.isClick


            if (temp.isClick) {
              this.obj = temp
              // 平移
              // this.transition(itemInfo.item.position)
              this.$emit('callback', temp)
            } else {
              this.$emit('del', temp.cameraId)
            }
            temp.material.color = temp.isClick ? this.clickedColor : this.defaultColor
          }
        }
      })
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

    // 清空光柱
    clearObjects() {
      if (this.objects.length > 0) {
        this.scene.remove(this.objects[0])
        this.objects = []
      }
    },

    // 平移到目标(球)
    transition(item) {
      // cameraPosition 是当前相机的位置
      const cameraPosition = this.camera.position.clone();
      // targetPosition 是目标位置
      const targetPosition = new THREE.Vector3(item.position.x, item.position.y, item.position.z);
      // 定义期望距离
      const targetDistance = 5;

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

    // 三维转二维
    /*   toScreenPosition(obj) {
        const vector = obj.clone(); // 创建一个新的THREE.Vector3对象
        vector.project(this.camera);
        const widthHalf = this.$refs.threeContainer.offsetWidth / 2;
        const heightHalf = this.$refs.threeContainer.offsetHeight / 2;
  
        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;
  
        return vector;
      }, */

    // 显示告警
    showAllWarn() {

      this.sceneWarnArr.forEach(item => {
        this.scene.remove(item.sprite)
        this.scene.remove(item.textSprite)
      })

      this.sceneWarnArr = []


      this.warnArr.forEach((item, i) => {

        const canvas = document.createElement('canvas');
        const dpi = window.devicePixelRatio || 1; // 获取设备像素比例
        canvas.width = 256 * dpi; // 设置画布宽度，考虑像素比例
        canvas.height = 128 * dpi; // 设置画布高度，考虑像素比例
        const context = canvas.getContext('2d');

        // 设置Canvas的实际显示大小
        canvas.style.width = '256px';
        canvas.style.height = '128px';

        const textLines = [
          '警告' + i + 1,
          `相机名称/地点: 厂房` + i,
          `告警值: 0.32737` + i,
          `告警类型: 未带安全帽` + i,
          `处理状态: 未处理` + i,
          `预警时间: 2023-05-06 17:05:2` + i,
        ];
        // 将Canvas的绘图表面尺寸调整为像素比例
        context.scale(dpi, dpi);

        // 文本内容


        // 字体大小和行高
        const fontSize = 16;
        const lineHeight = 16; // 行高足够容纳字体大小

        // 绘制多行文本
        context.font = `${fontSize}px Han Sans CN`;
        context.fillStyle = 'white';

        for (let i = 0; i < textLines.length; i++) {
          const line = textLines[i];
          const y = 30 + i * lineHeight; // 垂直位置
          context.fillText(line, 17, y)
        }

        // 将Canvas元素转换为Texture
        const canvasTexture = new THREE.CanvasTexture(canvas);
        // 创建Sprite显示背景图像
        const spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load('images/xxk.png') });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(4, 2, 2);
        sprite.visible = false
        sprite.position.set(item.position.x, item.position.y, item.position.z)
        this.scene.add(sprite);

        // 将CanvasTexture应用到Sprite上
        const textSpriteMaterial = new THREE.SpriteMaterial({ map: canvasTexture });
        const textSprite = new THREE.Sprite(textSpriteMaterial);
        textSprite.scale.set(4, 2, 2);
        textSprite.visible = false
        textSprite.position.set(item.position.x, item.position.y, item.position.z)
        this.scene.add(textSprite);

        this.sceneWarnArr.push({
          cameraName: item.cameraName,
          sprite,
          textSprite
        })

        console.log(this.sceneWarnArr);
      })
    },


    // 告警
    warnFn(warn) {

      console.log(warn.cameraName);
      console.log(this.sceneWarnArr);
      let temp = this.sceneWarnArr.find(item => item.cameraName == warn.cameraName)

      console.log(temp);
      console.log(warn.show);
      if (!warn.show) {
        this.transition(warn)
        temp.sprite.visible = true;
        // 在需要的时候将Sprite隐藏
        temp.textSprite.visible = true;
      } else {
        temp.sprite.visible = false;
        // 在需要的时候将Sprite隐藏
        temp.textSprite.visible = false;
      }
      warn.show = !warn.show
    },

    // 添加css2d元素
    addElementFn(name, target) {

      // 获取相交模型的世界坐标
      const modelWorldPos = new THREE.Vector3();
      target.getWorldPosition(modelWorldPos);

      // 获取相交模型的长宽高
      const box3 = new THREE.Box3().setFromObject(target);
      const modelSize = new THREE.Vector3();
      box3.getSize(modelSize);

      let offsetHeight = modelSize.y / 2 + 3
      let positionArry = modelWorldPos.toArray()
      positionArry[1] += offsetHeight;

      // 查找flag类型
      let temp = this.iconData.find(item => item.icon === name)
      let flag = temp.flag

      let metadata = {
        flag: flag
      }

      let obj = this.createCss2d(name, metadata, positionArry)
      this.customAttach(obj)
    },

    createCss2d(iconName, metadata, position, rotation) {

      // console.log("metadata:", metadata);

      let addElement = document.createElement('div')
      addElement.style.width = '60px'
      addElement.style.height = '60px'
      addElement.style.backgroundColor = 'transparent'
      addElement.style.background = `url(${require(`@/assets/project/${iconName}`)})`
      addElement.style.backgroundRepeat = 'no-repeat'
      addElement.style.backgroundSize = 'cover'
      addElement.style.pointerEvents = 'auto'; // 允许鼠标事件穿透

      const css2d = new CSS2DObject(addElement);
      css2d.center.set(0.5, 0.5);
      css2d.layers.set(0);

      if (position) {
        let tempPosition = new THREE.Vector3()
        tempPosition.fromArray(position)
        css2d.position.copy(tempPosition)
      }
      if (rotation) {
        let euler = new THREE.Euler()
        euler.fromArray(rotation)
        css2d.rotation.copy(euler)
      }

      // // 创建坐标系辅助对象
      // var localAxes = new THREE.AxesHelper(50);
      // // 将坐标系辅助对象作为立方体的子对象
      // css2d.add(localAxes); 

      this.scene.add(css2d)

      css2d.userData.css2dMetadata = metadata
      css2d.userData.css2dMetadata.elementId = css2d.id
      // 设置id
      addElement.id = css2d.id

      //双击事件
      addElement.addEventListener("dblclick", (event) => {

        let mb = this.scene.getObjectById(event.target.id * 1)
        if (!(mb.userData?.css2dMetadata?.bindId)) {
          this.$message("请先保存图标信息后再查看详细")
          return
        }

        // 知识库图标
        if (mb.userData?.css2dMetadata?.flag == 1) {
          //清除
          this.clickIsEditer = false
          this.clickObjData = {}
          this.clickContentData = []

          let infoCss = this.scene.getObjectByName('unique-2d-info')
          if (!infoCss) {
            const infoCss2d = new CSS2DObject(document.getElementById('unique-2d-info'));
            infoCss2d.name = 'unique-2d-info'
            infoCss2d.position.set(0, 10, 0)
            infoCss2d.center.set(0.5, 0.5);
            infoCss2d.layers.set(0);

            // // 创建坐标系辅助对象
            // var localAxes = new THREE.AxesHelper(10);
            // // 将坐标系辅助对象作为立方体的子对象
            // infoCss2d.add(localAxes); 

            // mb.add(infoCss2d)
            infoCss = infoCss2d
          }

          // 赋值
          this.getBindKnowledges(mb.userData.css2dMetadata.bindId)
            .then(() => {
              this.clickObjData = mb.userData.css2dMetadata
              infoCss.visible = true
              mb.add(infoCss)
            })
        }
        // 摄像头图标 
        else if (mb.userData?.css2dMetadata?.flag == 2) {
          console.log("摄像头双击逻辑待完成");
        }

      })


      //单击事件
      addElement.addEventListener("click", (event) => {
        // ctrl + 鼠标点击
        if (event.ctrlKey) {
          let mb = this.scene.getObjectById(event.target.id * 1)
          this.customAttach(mb)
        }
      })

      return css2d;
    },

    showCss2dFn() {

      let iconMap = new Map()
      this.iconData.forEach(item => {
        iconMap.set(item.flag, item)
      })

      this.css2dData.forEach(item => {

        let iconObj = iconMap.get(item.flag)
        let position = item.positionList
        let rotation = item.rotateList

        this.createCss2d(iconObj.icon, item, position, rotation)
      })
    },

    // 保存css2d到后台
    saveCss2dToBackground(obj) {


      console.log(obj);
      if (obj && obj.isCSS2DObject && obj.userData.css2dMetadata) {

        // 更新坐标参数
        let css2dMetadata = obj.userData.css2dMetadata
        css2dMetadata.positionList = obj.position.toArray()
        css2dMetadata.rotateList = obj.rotation.toArray().slice(0, 3) //[x,y,z,order]只保留x,y,z
        css2dMetadata.flag ??= 0 // 0为非图标，flag无值则逻辑错误
        css2dMetadata.scenarioId ??= 1 //默认值暂时全是1当假数据

        // 保存请求
        // console.log("保存参数：", css2dMetadata);
        if (css2dMetadata.bindId) {
          // 更新
          this.updateKw(css2dMetadata)
        } else {
          // 新增
          this.addKw(css2dMetadata)
        }
        obj.userData.css2dMetadata = css2dMetadata
      }

    },

    css2dTabHandlerFn(row, title) {

      switch (title) {
        case "新增":
          this.openDrawer()
          break;
        case "编辑":
          this.clickIsEditer = true
          break;
        case "保存": {
          // 发送请求
          this.saveCss2dToBackground(this.scene.getObjectById(row.elementId))
          // 切换状态
          this.clickIsEditer = false
        }
          break;
        case "查看":
          this.kwData = row
          this.$refs.kwdm.drawer = true
          break;
        case "解绑":
          this.modalData = row;
          this.title = "确认解绑"
          this.visible = true
          break;
        case "删除":
          this.title = "删除"
          this.visible = true
          break;
        case "关闭": {
          let infoCss = this.scene.getObjectByName('unique-2d-info')
          infoCss.visible = false
        }
          break;
        default: {
          console.log("未匹配");
        }
      }

      // console.log("row:", row);
      // console.log("title:", title);
    },

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);
      // let delta = this.clock.getDelta();
      // this.controls.update(delta);

      if (this.controls.isLocked) {
        if (this.transformControls) {
          this.transformControls.enabled = false
        }
      } else {
        if (this.transformControls) {
          this.transformControls.enabled = true
        }
      }

      this.controls._update()
      this.stats.update();
      this.render();
    },

    onWindowResize() {
      if (!this.$refs.three) return
      this.camera.aspect = this.$refs.three.clientWidth / this.$refs.three.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight);
      this.css2DRenderer.setSize(this.$refs.three.clientWidth, this.$refs.three.clientHeight);

      this.render();
    },

    render() {
      this.renderer.render(this.scene, this.camera);
      this.css2DRenderer.render(this.scene, this.camera);
    },

    /**
     * 获取鼠标在three场景中真实的坐标
     * @param {*} event 监控事件中的event
     */
    getRealPoint(event) {
      // 获取鼠标事件在窗口内的坐标
      const windowX = event.clientX;
      const windowY = event.clientY;
      // 获取 canvas 相对于窗口的位置
      const canvasRect = this.renderer.domElement.getBoundingClientRect();

      // 计算鼠标事件在 canvas 内的相对坐标
      const mouseX = (windowX - canvasRect.left) / canvasRect.width * 2 - 1;
      const mouseY = -((windowY - canvasRect.top) / canvasRect.height) * 2 + 1;

      let point = new THREE.Vector2();
      point.set(mouseX, mouseY);
      return point
    },

    /**
     * 检测css2d是否可以放置
     * @param {*} event 
     */
    canAddCheck(event) {
      this.pointer = this.getRealPoint(event)
      this.raycaster.setFromCamera(this.pointer, this.camera);

      // //**********辅助查看射线 */
      // this.rayLine.geometry.attributes.position.setXYZ(0, this.raycaster.ray.origin.x, this.raycaster.ray.origin.y, this.raycaster.ray.origin.z);
      // this.rayLine.geometry.attributes.position.setXYZ(1, this.raycaster.ray.origin.x + this.raycaster.ray.direction.x * 1000, this.raycaster.ray.origin.y + this.raycaster.ray.direction.y * 1000, this.raycaster.ray.origin.z + this.raycaster.ray.direction.z * 1000);
      // this.rayLine.geometry.attributes.position.needsUpdate = true;
      // //********************结束 */

      const intersects = this.raycaster.intersectObjects(this.rayObjects, true);

      if (intersects.length > 0) {
        // 可以放置
        event.preventDefault();
      }

    },

    resetFn() {
      this.title = ""
      this.modalData = {}

      this.visible = false
    },
    bindBackFn() {

      // 清除数据
      this.request = {
        data: {
          classifyId: null, //分类id
          classifyList: [],
          tagIdList: [],//标签id
          knowledgeName: "",//知识名称
          knowledgeStatus: null, // 7 查询已发布知识 null为未发布
        },
        page: 1,
        limit: 5,
        total: 5
      },

        this.drawer = false
    },
    submit() {
      switch (this.title) {
        case "删除":
          this.deleteIcon();
          break;
        case "确认解绑":
          this.unbindKw();
          break;
        default:
      }
    },
    openDrawer() {
      Promise.all(
        [
          this.dataKnowledgeTagGetTagList(), //标签,
          this.dataKnowledgeClassifyGetNameList() //分类
        ]
      ).then((res) => {
        this.drawer = true
        if (this.knowledgeList.length > 0) {
          this.request.data.classifyId = this.knowledgeList[0].classifyId
        }
        // this.requestFn()
      })
    },
    /**
     * 选中绑定知识库页面
     */
    kwDrawerFn(title, row) {
      switch (title) {
        case "查看":
          this.kwData = row
          this.$refs.kwdm.drawer = true
          break;
        case "绑定":
          this.bindKw(row)
          break;
        default:

      }

    },

    async addKw(param) {
      let { data } = await dataKnowledgeModelBindBind(param)
      // 绑定id
      param.bindId = data.data
    },
    async updateKw(param) {
      let res = await dataKnowledgeModelBindUpdate(param)
    },

    async getBindKnowledges(bindId) {
      let { data } = await dataKnowledgeModelBindGetBindKnowledge({ bindId: bindId })
      if (data.code == 200) {
        this.clickContentData = data.data?.filter(item => item)
      } else {
      }
    },
    async deleteIcon() {
      let res = await dataKnowledgeModelBindDelete({ bindId: this.clickObjData.bindId })

      // 场景转存info框 并移除当前图标
      let awaitDeleteObj = this.scene.getObjectById(this.clickObjData.elementId)
      let css2dInfo = awaitDeleteObj.getObjectByName('unique-2d-info')
      css2dInfo.visible = false
      this.scene.add(css2dInfo)
      this.scene.remove(awaitDeleteObj)

      // 解除控制器选中
      this.transformControls?.detach()

      // 关闭弹框
      this.resetFn()
    },
    async unbindKw() {
      await dataKnowledgeModelBindDeleteBind({
        bindId: this.clickObjData.bindId,
        knowledgeId: this.modalData.knowledgeId
      })
      //重新请求绑定列表
      this.getBindKnowledges(this.clickObjData.bindId)
      // 关闭弹框
      this.resetFn()
    },
    async bindKw(row) {
      let param = {
        bindId: this.clickObjData.bindId,
        knowledgeIdList: [row.knowledgeId]
      }
      let res = await dataKnowledgeModelBindKnowledgeBind(param)
      // this.bindBackFn()
      this.getBindKnowledges(param.bindId)
    },

    // 特殊处理
    tempRequestFn(e) {



      return
      if (this.request.data.classifyId == 0) {
        this.requestFn()
      }

      this.requestFn()
      console.log("触发:", this.request.data.classifyId);

    },


    // 获取表格数据
    async requestFn(reset) {

      if (reset) {
        this.request.page = 1
      }
      this.request.data.knowledgeStatus = -1
      const res = await requestFn(this.request)
      if (res) {
        this.publishArr = res.data.data.list
        this.request.limit = res.data.data.pageSize;
        this.request.page = res.data.data.pageNum;
        this.request.total = res.data.data.total;
      }

    },
    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    // 搜索标红
    searchValueFn(text) {
      if (!this.request.data.knowledgeName) return text
      return text.replace(
        new RegExp(this.request.data.knowledgeName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi'), (match) => `<span class="light">${match}</span>`)
    },


    bindFn(item) {
      let temp = this.clickContentData.find(i => i.knowledgeId == item.knowledgeId) ? true : false
      return temp
    }
  },
};
</script>

<style lang="less" scoped>
#threeContainer {
  position: absolute;
  width: 100%;
  height: calc(100vh - 200px) !important;
  left: 0;
  top: 200px;
  background: #000;

  div {
    right: 0;
  }
}


#unique-2d-info {
  width: 300px;
  height: 160px;
  background: url("@/assets/project/xxk.png") center no-repeat;
  background-size: 100% 100%;
  pointer-events: auto;
  padding: 5px 15px;
  // border: 1px solid gold;

  // 重置位置，防止转成css2d位置有偏移
  position: absolute;
  left: 0px;

  display: flex;
  flex-direction: column;

  z-index: 99998;

  .header-box {
    margin-top: 5px;
    height: 20px;
    color: #fff;
    text-align: center;
    // border: 1px solid green;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;



    .kw-name-box {
      >div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-family: MiSans-Regular;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 20px;
        // border: 1px solid blue;


        :deep(.el-input__inner) {
          background-color: transparent;
          height: 20px;
          font-size: 16px;
          font-family: MiSans-Regular;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 20px;
          width: 150px;
          border: 0px;

        }


        .btn {
          height: 20px;
          width: 60px;
          margin-left: 10px;

          background-color: RGB(32, 117, 229);
          font-size: 12px;
          font-family: MiSans-Regular;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 20px;
          text-align: center;
        }

      }

    }

    .kw-add-icon {
      width: 20px;
      height: 20px;
      border: 1px solid #fff;
      border-radius: 45%;
      margin-right: 10px;
      text-align: center;
      line-height: 20px;
      font-size: 20px;
    }
  }

  .kw-content {
    flex: 3;
    // border: 1px solid red;
    overflow-y: auto;

    .bind-list {
      margin: 5px 0;
      height: 20px;
      width: 100%;
      background-color: #387CD7;
      opacity: 0.9;

      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;

      .bind-list-content {
        line-height: 20px;

        font-size: 14px;
        font-family: MiSans-Regular;
        font-weight: 400;
        color: #FFFFFF;
      }

      .bind-list-tools {
        margin-right: 10px;
        line-height: 20px;
        font-size: 14px;
        font-family: MiSans-Regular;
        font-weight: 400;
        color: #FFFFFF;
      }

    }
  }

  .kw-footer {
    flex: 1;
    display: flex;
    width: 80%;
    justify-content: space-around;
    padding: 5px 0;
    margin: 0 auto;
    // display: flex;
    // justify-content: center;
    // align-content: center;
  }
}

.title_content {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;

  .title_icon {
    width: 4px;
    height: auto;
    background: #0143CE;
    margin-right: 10px;
  }

  div:last-child {

    font-size: 18px;
    font-family: MiSans-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 18px;

  }

}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.dialog-content {
  text-align: center;
  font-size: 16px;
  font-family: MiSans-Regular;
  font-weight: 400;
  color: #333333;
  line-height: 16px;
}



.bind-box {
  width: 100%;
  height: 85vh;
  display: flex;

  // border: 1px solid black;

  .bind-left {
    flex: 1;
    width: 100%;
    height: 85vh;
    background: #F6F6F6;

    display: flex;

    .header {
      width: 68px;
      height: 30px;

      background: #4466EE;
      border-radius: 2px 2px 2px 2px;

      text-align: center;
      font-size: 14px;
      font-family: MiSans-Regular;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;

    }

    >div {
      flex: 1;
      width: 100%;
      margin-left: 22px;
      margin-top: 16px;
      overflow-y: auto;

      .group {
        margin-top: 16px;
        display: flex;
        flex-direction: column;

        :deep(.el-radio-button__inner) {
          padding: 7px 0;
          background: none;
          border: none;
        }

        :deep(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
          color: #fff;
          background-color: #46e;
          border-color: #46e;
          box-shadow: -1px 0 0 0 #46e;
        }

        :deep(.el-radio-button--mini .el-radio-button__inner) {
          font-size: 14px;
          font-family: MiSans-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
        }

        :deep(.el-checkbox-button__inner) {
          margin: 2px 0;
          padding: 7px 0;
          background: none;
          border: none;
        }

        :deep(.el-checkbox-button.is-checked .el-checkbox-button__inner) {
          color: #fff;
          background-color: #46e;
          border-color: #46e;
          box-shadow: -1px 0 0 0 #46e;
        }

        :deep(.el-checkbox-button--mini .el-checkbox-button__inner) {
          font-size: 14px;
          font-family: MiSans-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 14px;
        }
      }

    }

    .bind-left-first {
      border-right: 1px solid #E9E9E9;
    }

    // border: 1px solid gold;

  }

  .bind-right {
    flex: 3;
    width: 100%;
    height: 85vh;
    // border: 1px solid aquamarine;


    :deep(.el-form-item) {
      width: 100%;
      display: flex;
      justify-content: center;

      .el-form-item__content {
        width: 80%;
      }
    }

    :deep(.Tab) {
      height: 100%;
    }

    .container {
      // padding: 0 16px;
      height: 83%;
      // background-color: forestgreen;

      .info {
        height: 100%;
        overflow: auto;


        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 120px;
          margin-bottom: 11px;
          background-color: #f6f6f6;
          cursor: pointer;

          .content {
            width: 100%;
            font-size: 12px;
            color: #666;
            padding: 12px;


            .head {
              font-size: 18px;
              font-family: MiSans-Regular;
              font-weight: 400;
              color: #333333;
              line-height: 18px;




              :deep(.light) {
                // background-color: red !important;
                color: red;
              }
            }

            .center {
              margin-top: 10px;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;

              // border: 1px solid black;

              >div {
                flex: 2;
                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #666666;
                line-height: 18px;
              }

              div:first-child {
                flex: 3;
              }

              div:nth-child(n+3) {
                // background-color: #387CD7;

                font-size: 12px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
              }

              .classify {
                :deep(.light) {
                  // background-color: red !important;
                  color: red;
                }
              }

              div {
                margin-right: 20px;
              }
            }

            .desc {
              margin-top: 10px;
              height: 36px;
              display: flex;
              align-items: center;

              .bottom {
                flex: 7;
                height: 36px;
                overflow: auto;
                // border: 1px solid red;

                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                color: #999999;
                line-height: 18px;



                :deep(.light) {
                  // background-color: red !important;
                  color: red;
                }
              }
            }

            .btn {
              flex: 2;
              height: 36px;
              display: flex;
              justify-content: flex-start;
              align-items: center;


              :deep(.el-button--mini) {

                width: 68px;

                font-size: 14px;
                font-family: MiSans-Regular;
                font-weight: 400;
                line-height: 14px;
              }

              // border: 1px solid red;

              .ybd—bth {
                color: #999999;
              }

              :deep(.el-button--info.is-disabled) {
                background: #DEDEDE;
              }


              .el-button {
                border-radius: 0;
              }
            }

          }

          .status {
            min-width: 100px;
            font-size: 12px;
            color: #EE4444;
          }



        }
      }
    }

  }
}

.bind_btn {
  width: 100%;
  height: 5vh;
  // border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fps {
  left: auto !important;

}

.ms {
  left: auto !important;
  right: 80px;
}

.mb {
  left: auto !important;
  right: 160px;
}

:deep(.element) {
  width: 50px;
  height: 40px;
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center !important;
  line-height: normal;
  display: block;
  cursor: default;
}


:deep(.element):hover {
  box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

:deep(.element) .number {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

:deep(.element) .symbol {
  position: absolute;
  top: 40px;
  left: 0px;
  right: 0px;
  font-size: 15px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

:deep(.element) .details {
  position: absolute;
  bottom: 15px;
  left: 0px;
  right: 0px;
  font-size: 12px;
  color: rgba(127, 255, 255, 0.75);
}

:deep(.hidden) {
  display: none;
}

#stats {
  :deep(div) {
    position: absolute !important;
    top: 153px !important;
    // top: 200px !important;
    left: 200px !important;
  }

}
</style>
