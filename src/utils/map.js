import * as THREE from 'three';
import * as d3 from 'd3';
import Orbitcontrols from 'three-orbitcontrols';

const chunkSize = 4;

const color = d3.scaleLinear().domain([0, 0.6]).range([d3.rgb(0, 255, 0), d3.rgb(255, 0, 0)]);
const defaultColor = new THREE.Color('skyblue');

export const transferArrayBufferToVect = (arrBuffer) => {
  const floatArr = new Float32Array(arrBuffer);
  const arr = [];
  for (let i = 0; i < floatArr.length - 1; i += chunkSize) {
    const z = floatArr[i];
    const x = floatArr[i + 1];
    const y = floatArr[i + 2];
    // const w = ((x ** 2) + (y ** 2) + (z ** 2)) ** 0.5;
    const vect = {
      x, y, z,
    };
    arr.push(vect);
  }
  return arr;
};

export const generateGeometry = () => {
  return new THREE.Geometry();
};

export const pushDataToGeometry = (geometry, data) => {
  const vertices = data.map(d => new THREE.Vector3(d.x, d.y, d.z));
  const colors = Array(data.length).fill(defaultColor);
  geometry.vertices = geometry.vertices.concat(vertices);
  geometry.colors = geometry.colors.concat(colors);
  // data.forEach((d) => {
  //   geometry.vertices.push(new THREE.Vector3(d.x, d.y, d.z));
  //   geometry.colors.push(defaultColor);
  // });
};

export const generatePointCloud = (geometry) => {
  // console.log(data);
  const pointMaterial = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: THREE.VertexColors });
  const pointCloud = new THREE.Points(geometry, pointMaterial);
  return pointCloud;
};

export const generateScene = () => {
  const scene = new THREE.Scene();
  const SCREEN_WIDTH = window.innerWidth;
  const SCREEN_HEIGHT = window.innerHeight;
  // camera attributes
  const VIEW_ANGLE = 45;
  const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
  const NEAR = 1;
  const FAR = 10000;

  // set up camera
  const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(0, 100, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera);

  // the camera defaults to position (0,0,0)
  // so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
  const axes = new THREE.AxesHelper(50);
  scene.add(axes);

  // const grid = new THREE.GridHelper(100, 100, 1);
  // scene.add(grid);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

  // target position
  // const box = new THREE.Box3();
  // box.setFromCenterAndSize(new THREE.Vector3(5, -1, -2.5), new THREE.Vector3(2, 2, 5));
  // const helper = new THREE.Box3Helper(box, 0xffff00);
  // scene.add(helper);

  const orbitControls = new Orbitcontrols(camera, renderer.domElement);
  const object = {
    scene,
    camera,
    renderer,
    orbitControls,
  };
  window.THREE = THREE;
  window.q = object;
  return object;
};
