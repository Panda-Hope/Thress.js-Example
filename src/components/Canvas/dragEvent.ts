import * as THREE from 'three'

const plane = new THREE.Plane()
const raycaster = new THREE.Raycaster()

const pointer = new THREE.Vector2()
const offset = new THREE.Vector3()
const intersection = new THREE.Vector3()
const worldPosition = new THREE.Vector3()
const inverseMatrix = new THREE.Matrix4()

class DragControls extends THREE.EventDispatcher {
  enabled = true

  transformGroup = false
  
  constructor( objects: any, camera: THREE.Camera, domElement: HTMLCanvasElement ) {
    super()

    domElement.style.touchAction = 'none' // disable touch scroll

    let selected: any = null
    let hovered: any = null

    const intersections: any[] = []
    const scope: any = this

    function activate() {
      domElement.addEventListener( 'pointermove', onPointerMove )
      domElement.addEventListener( 'pointerdown', onPointerDown )
      domElement.addEventListener( 'pointerup', onPointerCancel )
      domElement.addEventListener( 'pointerleave', onPointerCancel )
    }

    function deactivate() {
      domElement.removeEventListener( 'pointermove', onPointerMove )
      domElement.removeEventListener( 'pointerdown', onPointerDown )
      domElement.removeEventListener( 'pointerup', onPointerCancel )
      domElement.removeEventListener( 'pointerleave', onPointerCancel )

      domElement.style.cursor = ''
    }

    function onPointerMove(event: PointerEvent) {
      if ( scope.enabled === false ) return

      updatePointer( event )
      raycaster.setFromCamera( pointer, camera )

      if (selected) {
        if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
          selected.position.copy( intersection.sub( offset ).applyMatrix4( inverseMatrix ) )
        }

        scope.dispatchEvent( { type: 'drag', object: selected } )
        return
      }

      // hover support
      if ( event.pointerType === 'mouse' || event.pointerType === 'pen' ) {
        intersections.length = 0

        raycaster.setFromCamera( pointer, camera )
        raycaster.intersectObjects( objects, true, intersections )

        if ( intersections.length > 0 ) {

          const object = intersections[ 0 ].object

          plane.setFromNormalAndCoplanarPoint( camera.getWorldDirection( plane.normal ), worldPosition.setFromMatrixPosition( object.matrixWorld ) )

          if ( hovered !== object && hovered !== null ) {

            scope.dispatchEvent( { type: 'hoveroff', object: hovered } )

            domElement.style.cursor = 'auto'
            hovered = null

          }

          if ( hovered !== object ) {
            scope.dispatchEvent( { type: 'hoveron', object: object } )

            domElement.style.cursor = 'pointer'
            hovered = object

          }

        } else {
          if ( hovered !== null ) {
            scope.dispatchEvent( { type: 'hoveroff', object: hovered } )

            domElement.style.cursor = 'auto'
            hovered = null

          }
        }
      }
    }

    function onPointerDown( event: PointerEvent ) {
      if ( scope.enabled === false ) return
      updatePointer( event )

      intersections.length = 0

      raycaster.setFromCamera( pointer, camera )
      raycaster.intersectObjects( objects, true, intersections )

      if ( intersections.length > 0 ) {
        selected = ( scope.transformGroup === true ) ? objects[ 0 ] : intersections[ 0 ].object
        plane.setFromNormalAndCoplanarPoint( camera.getWorldDirection( plane.normal ), worldPosition.setFromMatrixPosition( selected.matrixWorld ) )

        if ( raycaster.ray.intersectPlane( plane, intersection ) ) {
          inverseMatrix.copy( selected.parent.matrixWorld ).invert()
          offset.copy( intersection ).sub( worldPosition.setFromMatrixPosition( selected.matrixWorld ) )
        }

        domElement.style.cursor = 'move'
        scope.dispatchEvent( { type: 'dragstart', object: selected } )
      }
    }

    function onPointerCancel() {
      if ( scope.enabled === false ) return

      if ( selected ) {
        scope.dispatchEvent( { type: 'dragend', object: selected } )
        selected = null
      }

      domElement.style.cursor = hovered ? 'pointer' : 'auto'
    }

    function updatePointer( event: PointerEvent ) {
      pointer.x = ( event.offsetX / (window.innerWidth / 2) ) * 2 - 1
      pointer.y = - ( event.offsetY / (window.innerHeight / 2) ) * 2 + 1
    }

    activate()
  }
}

export default DragControls
