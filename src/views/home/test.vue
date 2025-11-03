<template>
  <div>
    <div id="box" ref="box" style="position: relative;"> </div>

  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default {
  props: {},
  data() {
    return {
      src: 'startVideo2.mp4',
      mesh: null
    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      console.log(THREE);
      const box = this.$refs.box;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
      this.camera.position.z = 5;

      this.renderer = new THREE.WebGLRenderer({ antialias: true });

      this.renderer.setSize(box.clientWidth, box.clientHeight);
      box.appendChild(this.renderer.domElement);

      this.scene.add(new THREE.AmbientLight(0xffffff, 3.5));

      this.control = new OrbitControls(this.camera, this.renderer.domElement);

      this.fn()






      // 添加双击事件监听器到渲染器
      this.renderer.domElement.addEventListener('click', (event) => {
        event.preventDefault();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects(this.scene.children);

        console.log(33);

        // for (let i = 0; i < intersects.length; i++) {
        //   if (intersects[i].object === this.mesh) {
        //     // 选中mesh，改变材质以显示发光效果
        //     this.mesh.material.emissive.setHex(0xff0000); // 设置为红色发光
        //     break;
        //   } else {
        //     // 未选中mesh，移除发光效果
        //     this.mesh.material.emissive.setHex(0x000000); // 无发光
        //   }
        // }
        if (intersects.length > 0) {
          console.log(intersects[0].object.material);
          // intersects[0].object.material.forEach(material => {
          //   console.log(material.emissive);
          //   material.emissive.set(0xff0000)
          //   material.needsUpdate = true;
          // })

          intersects[0].object.material.emissive.setHex(0xff0000)
        }



      });


    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.control.update();
    },
    fn() {
      const geometry = new THREE.PlaneGeometry(10, 5);
      const material = new THREE.MeshPhongMaterial({ color: 0x555555, emissive: 0x000000 })
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh)
    },

  },
}
</script>

<style lang='less' scoped>
#box {
  width: 100vw;
  height: 100vh;
}
</style>