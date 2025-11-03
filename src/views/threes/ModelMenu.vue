<template>
    <div class="box">
        <div class="header">
            <div class="labelwrap">
                <p>模型库</p>
                <img src="@/assets/data/titleActive.png" alt="" />
            </div>
        </div>
        <div class="content">
            <div v-for="item in modelList" class="child" :key="item.name">
                <div :ref="item.name" :draggable="draggable"></div>
                <div>{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { dataModelPage } from '../../utils/api'

export default {
    data() {
        return {
            modelList: [
            ],
            draggable: false
        }
    },

    // beforeMount() {
    //     this.dataModelPage()
    // },

    async mounted() {
        await this.dataModelPage()
        this.modelInit()
    },
    methods: {
        async dataModelPage() {
            const res = await dataModelPage({
                data: {
                    factoryName: "",
                    buildName: "",
                    modelName: "",
                },
                page: 1,
                limit: 100,
            })
            if (res) {
                this.modelList = res.data.data.list.map(item => ({
                    name: item.modelName,
                    url: item.path
                }))

            }
        },
        modelInit() {
            console.log(this.modelList);
            this.modelList.map(item => {
                console.log(item.url);
                const scene = new THREE.Scene()
                scene.add(new THREE.AmbientLight(0xffffff, 5));
                const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)

                const renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                })
                console.log(item.name);
                console.log(this.$refs[`${item.name}`]);

                renderer.setSize(this.$refs[`${item.name}`][0].clientWidth, this.$refs[`${item.name}`][0].clientHeight);

                const controls = new OrbitControls(camera, renderer.domElement);

                controls.mouseButtons = {
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.NONE // 禁用右键
                };

                camera.position.set(30, 50, 300)

                this.$refs[`${item.name}`][0].appendChild(renderer.domElement);

                const loader = new FBXLoader()

                loader.load(item.url, fbx => {

                    scene.add(fbx)
                    this.animate(renderer, scene, camera)
                })

                this.$refs[`${item.name}`][0].addEventListener('dblclick', (e) => {
                    this.draggable = !this.draggable
                })
                this.$refs[item.name][0].addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('model', JSON.stringify(item));
                });
            })


        },

        animate(renderer, scene, camera) {
            this.render(renderer, scene, camera)
            requestAnimationFrame(() => this.animate(renderer, scene, camera));

        },
        // 渲染
        render(renderer, scene, camera) {
            renderer.render(scene, camera);
        },
    },

}
</script>

<style lang="less" scoped>
.box {
    height: 100%;
    // width: 400px;
    min-width: 367px;
    min-height: 400px;
    z-index: 2;
    position: relative;

    .header {
        background: url("@/assets/data/modelHeaderBG.png") center no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 40px;
        position: absolute;
        top: -40px;
        // border: 1px solid black;


        .labelwrap {
            // border: 1px solid black;
            position: absolute;
            left: 93px;
            height: 100%;
            // top: 13px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            // text-align: center;

            p {
                // border: 1px solid black;
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #ffffff;
                // margin-top: -5px;
                // margin-bottom: 5px;
            }

            img {
                width: 29px;
                height: 6px;
                position: relative;
                left: 0;
                right: 0;
                margin: 0px auto;
            }
        }
    }
}

.content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow: auto;
    background-color: #0c1d3c;



    .child {
        // background-color: transparent;
        margin-left: 1px;
        margin-top: 1px;
        width: 180px;
        height: 200px;
        background-color: #324870;

        >div:nth-child(1) {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 180px;
            height: 180px;
            background-color: #314D78;
        }

        >div:nth-child(2) {
            position: relative;
            height: 20px;
            text-align: center;
            line-height: 20px;
            font-family: sans-serif;
            font-size: large;
            color: white;
            background-color: #23385A;
            font-size: 14px;
        }

    }
}
</style>