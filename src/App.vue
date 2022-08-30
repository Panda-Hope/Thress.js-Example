<template>
  <div class="animate-page">
    <Canvas></Canvas>
    <div class="coordinate" v-if="coordinate.length">Current coordinate: x: {{ coordinate[0] }}, y: {{ coordinate[1] }}</div>
    <div class="file-box">Selected Image: {{ selectedFile }}</div>

    <div class="action-box">
      <el-upload
          accept=".png, .jpg, .jpeg, .gif"
          :on-change="onFileUpload"
          :show-file-list="false"
          :auto-upload="false"
          :limit="1">
        <el-button type="primary">Add Image</el-button>
      </el-upload>
      <el-button type="danger" @click="delSelectedFile">Delete Image</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, provide } from 'vue'
import { ElMessage } from 'element-plus'
import * as THREE from 'three'
import { uploadImage, deleteImage } from './components/Canvas/setupAction'
import Canvas from './components/Canvas/index.vue'

// change file name
const selectedFile = shallowRef('none')
const selectedMesh = shallowRef<THREE.Mesh | null>(null)

const changeSelectedFile = (name: string) => selectedFile.value = name
provide('changeSelectedFile', changeSelectedFile)
const changeSelectedMesh = (mesh: THREE.Mesh) => selectedMesh.value = mesh
provide('changeSelectedMesh', changeSelectedMesh)

const delSelectedFile = () => {
  if (!selectedMesh.value) return
  deleteImage(selectedMesh.value)
  changeSelectedFile('')
}

// image coordinate
const showCoordinate = shallowRef(false)
const coordinate = shallowRef<[number, number] | []>([])

const changeCoordinate = (vector: any) => coordinate.value = vector
provide('changeCoordinate', changeCoordinate)

// upload file
let limit = 1
const onFileUpload = (file: any) => {
  if (limit > 4) {
    ElMessage.error('max 4 image')
  }
  const imageURL = URL.createObjectURL(file.raw)
  uploadImage(imageURL)
}
</script>

<style lang="scss">
.animate-page {
  position: relative;
  padding-top: 10vh;
  width: 100vw;
  height: 100vh;
  background: #fff;

  .file-box, .coordinate {
    margin-top: 20px;
    text-align: center;
    color: var(--el-color-primary);
  }

  .action-box {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    text-align: center;
  }
}
</style>