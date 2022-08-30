import * as THREE from 'three'

// setup canvas object
const setupCanvas = () => {
  // three object
  const scene = new THREE.Scene()
  // scene.background = new THREE.Color('#fff')

  // setup camera
  const camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.z = 5

  // setup render
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize( window.innerWidth/2, window.innerHeight/2 )
  renderer.setClearColor('#fff')

  // setup helper
  // const gridHelper = new THREE.GridHelper(10, 10)
  // scene.add(gridHelper)

  // add light
  const ambientLight = new THREE.AmbientLight(0x404040, 4)
  scene.add(ambientLight)

  return {
    scene,
    camera,
    renderer
  }
}

export default setupCanvas