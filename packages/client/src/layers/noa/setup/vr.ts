import * as BABYLON from "@babylonjs/core";
import { Engine } from "noa-engine";

// Credit to Gustavo_Font, code from https://forum.babylonjs.com/t/walking-on-webxr/27903/3 and https://playground.babylonjs.com/#ACSDWY
export const createOculusVRScene = async function (engine: Engine, startPosition: BABYLON.Vector3) {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene: BABYLON.Scene = engine.rendering.getScene();
  const canvas = engine.container.canvas;
  const canvasElement = document.getElementById("noa-canvas") as HTMLCanvasElement;
  console.log("CANVAS TYPES AND THINGS", canvas, canvasElement, canvas == canvasElement, typeof canvas);
  // This creates and positions a free camera (non-mesh)
  // const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const camera = engine.rendering._camera;
  const posdx = 0;
  const posdz = 0;
  const posix = 0;
  const posiz = 0;
  const sentido = "";
  const sentido2 = "";

  // This targets the camera to scene origin
  //   camera.setTarget(BABYLON.Vector3.Zero());
  // This attaches the camera to the canvas
  //   camera.attachControl(canvas, true);

  // TODO: These next 4 lines of code should be deleted

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;
  // Our built-in 'sphere' shape.
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;
  // Our built-in 'ground' shape.

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
  if (1 == 1 || navigator.userAgent.indexOf("OculusBrowser") !== -1) {
    const xr = await scene.createDefaultXRExperienceAsync({
      floorMeshes: [ground],
      disableTeleportation: true,
      //teleportationEnabled:true,
      inputOptions: {
        forceInputProfile: "oculus-touch-v2",
        //disableControllerAnimation: true,
        //doNotLoadControllerMeshes : true,
        //maxPointerDistance: 1,
      },
    });

    // const featureManager = xr.baseExperience.featuresManager;
    // const teleportation = featureManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
    //   forceHandedness: "right",
    //   xrInput: xr.input,
    //   floorMeshes: [ground],
    // });
    // xr.input.xrCamera.setTransformationFromNonVRCamera(camera);
    let observer: any;
    let observer2: any;
    const speed = 0.01;
    let positiond: BABYLON.Vector3;
    // let eje = "";
    // xr.input.onControllerAddedObservable.add((controller: any) => {
    //   const isXR = true;
    //   //right hand
    //   if (controller.inputSource.handedness === "right") {
    //     controller.onMotionControllerInitObservable.add((motionController: any) => {
    //       //main trigger
    //       controller.motionController?.getMainComponent().onButtonStateChangedObservable.add((component: any) => {
    //         if (component.changes.pressed) {
    //           if (component.pressed) {
    //             observer = scene.onBeforeRenderObservable.add(() => {
    //               positiond = controller.pointer.position;
    //               const angles = controller.grip?.rotationQuaternion?.toEulerAngles();
    //               const giro = BABYLON.Tools.ToDegrees(angles?.y || 0);
    //               let deltaz = positiond.z - posdz;
    //               const deltax = positiond.x - posdx;
    //               if ((giro >= -45 && giro <= 45) || giro >= 135 || giro <= -135) {
    //                 eje = "z";
    //                 if (deltaz >= 0.001 || deltaz <= -0.001) {
    //                   if (positiond.z >= posdz) {
    //                     sentido = "adelante";
    //                   } else {
    //                     sentido = "atras";
    //                   }
    //                 } else {
    //                   sentido = "quieto";
    //                 }
    //               } else {
    //                 eje = "x";
    //                 if (deltax >= 0.001 || deltax <= -0.001) {
    //                   if (positiond.x >= posdx) {
    //                     sentido = "adelante";
    //                   } else {
    //                     sentido = "atras";
    //                   }
    //                 } else {
    //                   sentido = "quieto";
    //                 }
    //                 deltaz = deltax;
    //               }
    //               if (sentido + sentido2 == "adelanteatras" || sentido + sentido2 == "atrasadelante") {
    //                 if (deltaz < 0) {
    //                   deltaz = deltaz * -1;
    //                 }
    //                 if (deltaz > 0.0015) {
    //                   deltaz = 0.0015;
    //                 }

    //                 const matrix = new BABYLON.Matrix();
    //                 const deviceRotationQuaternion = xr.input.xrCamera.rotationQuaternion;
    //                 BABYLON.Matrix.FromQuaternionToRef(deviceRotationQuaternion, matrix);
    //                 const move = new BABYLON.Vector3(0, 0, (4 + deltaz * 100) * speed);
    //                 const addPos = BABYLON.Vector3.TransformCoordinates(move, matrix);
    //                 addPos.y = 0;
    //                 xr.input.xrCamera.cameraDirection.addInPlace(addPos);
    //                 sentido = "quieto";
    //                 sentido2 = "quieto";
    //               }

    //               positiond = controller.pointer.position;
    //               posdx = positiond.x;
    //               posdz = positiond.z;
    //             });
    //           } else {
    //             sentido = "";
    //             if (observer) {
    //               scene.onBeforeRenderObservable.remove(observer);
    //               observer = null;
    //             }
    //           }
    //         }
    //       });
    //     });
    //   }

    //   //left hand
    //   if (controller.inputSource.handedness === "left") {
    //     controller.onMotionControllerInitObservable.add((motionController: any) => {
    //       //detect left joystick for walk
    //       const joystickComponent = motionController.getComponent("xr-standard-thumbstick");
    //       joystickComponent.onAxisValueChangedObservable.add((values: any) => {
    //         if (values.x < -0.9 || values.x > 0.9) {
    //           let rotationAngle = Math.PI / 64;
    //           if (values.x <= 0) {
    //             rotationAngle = -rotationAngle;
    //           }
    //           const eulerAngles = BABYLON.Quaternion.FromEulerAngles(0, rotationAngle, 0);
    //           xr.input.xrCamera.rotationQuaternion.multiplyInPlace(eulerAngles);
    //         }
    //         if (values.y < -0.9 || values.y > 0.9) {
    //           const matrix = new BABYLON.Matrix();
    //           const deviceRotationQuaternion = xr.input.xrCamera.rotationQuaternion;
    //           BABYLON.Matrix.FromQuaternionToRef(deviceRotationQuaternion, matrix);
    //           const move = new BABYLON.Vector3(values.x * speed, 0, -values.y * speed);
    //           const addPos = BABYLON.Vector3.TransformCoordinates(move, matrix);
    //           addPos.y = 0;
    //           xr.input.xrCamera.cameraDirection.addInPlace(addPos);
    //         }
    //       });

    //       //main trigger
    //       controller.motionController?.getMainComponent().onButtonStateChangedObservable.add((component: any) => {
    //         if (component.changes.pressed) {
    //           if (component.pressed) {
    //             observer2 = scene.onBeforeRenderObservable.add(() => {
    //               const position = controller.grip ? controller.grip.position : controller.pointer.position;
    //               const anglei = controller.grip?.rotationQuaternion?.toEulerAngles();
    //               const giroi = BABYLON.Tools.ToDegrees(anglei?.y || 0);
    //               const deltaix = position.x - posix;
    //               const deltaiz = position.z - posiz;
    //               if (eje == "z") {
    //                 if (deltaiz >= 0.001 || deltaiz <= -0.001) {
    //                   if (position.z >= posiz) {
    //                     sentido2 = "adelante";
    //                   } else {
    //                     sentido2 = "atras";
    //                   }
    //                 } else {
    //                   sentido2 = "quieto";
    //                 }
    //               } else {
    //                 if (deltaix >= 0.001 || deltaix <= -0.001) {
    //                   if (position.x >= posix) {
    //                     sentido2 = "adelante";
    //                   } else {
    //                     sentido2 = "atras";
    //                   }
    //                 } else {
    //                   sentido2 = "quieto";
    //                 }
    //               }

    //               posix = position.x;
    //               posiz = position.z;
    //             });
    //           } else {
    //             sentido2 = "";
    //             if (observer2) {
    //               scene.onBeforeRenderObservable.remove(observer2);
    //               observer2 = null;
    //             }
    //           }
    //         }
    //       });
    //     });
    //   }
    // });
  }

  return scene;
};
