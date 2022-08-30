<template>
  <div class="canvas-page" ref="canvasRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import setupCanvas from './setupCanvas'
import setupAction from './setupAction'

const canvasRef = ref<HTMLDivElement | null>(null)

const {
  scene,
  camera,
  renderer
} = setupCanvas()

const {
  onMouseClickEffect
} = setupAction({ scene, camera, renderer })

// render loop
const animate = () => {
  onMouseClickEffect()

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

// start render
onMounted(() => {
  canvasRef.value?.appendChild(renderer.domElement)
  animate()
})
</script>

<style lang="scss">
.canvas-page {
  margin: 0 auto;
  width: 50%;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
}
</style>