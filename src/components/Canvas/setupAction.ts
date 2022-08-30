import { inject } from 'vue'
import * as THREE from 'three'
import DragEvent from './dragEvent'
import Cat from '../../assets/cat.jpeg'
import Dog from '../../assets/dog.png'

interface ActionProps {
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.Renderer
}

export let uploadImage: (image: string) => void
export let deleteImage: (mesh: THREE.Mesh) => void

// setup animation action
const setupAction = ({ scene, camera, renderer } : ActionProps) => {
  // switch file name inject
  const changeSelectedFile = inject<any>('changeSelectedFile')
  const changeSelectedMesh = inject<any>('changeSelectedMesh')
  const changeCoordinate = inject<any>('changeCoordinate')

  // image click effect
  const pointer = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()

  let clicked = false
  let inserted: any

  const onMouseClick = (event: MouseEvent) => {
    clicked = true
    pointer.x = ( event.offsetX / (window.innerWidth / 2) ) * 2 - 1
    pointer.y = - ( event.offsetY / (window.innerHeight / 2) ) * 2 + 1
    raycaster.setFromCamera( pointer, camera )
  }
  // add click effect
  renderer.domElement.addEventListener('click', onMouseClick)

  const onMouseClickEffect = () => {
    if (!clicked) return

    const intersects = raycaster.intersectObjects( scene.children, true )

    if (intersects.length) {
      const [intersect] = intersects as any
      intersect.object.material.color.set(new THREE.Color('gray'))

      const filename = intersect.object.material.map.source.data.currentSrc.split('/').pop()
      changeSelectedFile(filename)
      changeSelectedMesh(intersect.object)

      if (!inserted) {
        inserted = intersects[0].object
      } else {
        if (intersect.object !== inserted) {
          inserted.material.color.set(0xffffff)
          inserted = intersect.object
        }
      }
    }

    renderer.render( scene, camera)
    clicked = false
  }

  // add image
  const pos = new THREE.Vector3(-8, 0, 0)
  const addImage = (image: string) => {
    const geometry = new THREE.PlaneGeometry(4, 4)
    const loader = new THREE.TextureLoader()

    loader.load(image, (img) => {
      const material = new THREE.MeshLambertMaterial({map: img})
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(pos.x, pos.y, pos.z)
      pos.x += 5

      scene.add(mesh)

      // start drag
      const position = new THREE.Vector3()
      const drag = new DragEvent([mesh], camera, renderer.domElement)
      drag.addEventListener('drag', (mesh) => {
        const coordinate = position.setFromMatrixPosition(mesh.object.matrixWorld)
        changeCoordinate([coordinate.x.toFixed(2), coordinate.y.toFixed(2)])
      })
      drag.addEventListener('dragend', (mesh) => {
        changeCoordinate([])
      })
    })
  }

  // delete image
  const delImage = (mesh: THREE.Mesh) => {
    pos.x -= 5
    scene.remove(mesh)
  }

  // export high function
  uploadImage = addImage
  deleteImage = delImage
  
  // addImage(Dog)
  // addImage(Cat)

  // support drag and drop
  return {
    addImage,
    onMouseClickEffect
  }
}

export default setupAction