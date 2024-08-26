"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls, STLLoader } from "three/examples/jsm/Addons.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

function setup(
  containerElement: HTMLElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  if (containerElement.children.length > 0) {
    return;
  }

  scene.background = new THREE.Color("white");
  renderer.setSize(window.innerWidth, window.innerHeight);
  new OrbitControls(camera, renderer.domElement);
  containerElement.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 20);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(0, -20, -20);
  scene.add(light2);

  const animate = () => {
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);
}

async function readStreamToArrayBuffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const arrayBuffer = new Uint8Array(chunks.reduce((acc, val) => acc.concat(Array.from(val)), []));
  return arrayBuffer.buffer;
}

export function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function start() {
      if (!isMounted) return;

      const url =
        "https://linkio-dev-bucket.s3.sa-east-1.amazonaws.com/orders/667add660c806be4e1b0f0fe/upperjaw_ff1990d4-1544-4208-84e7-aac74e669c22.stl";
      const res = await fetch(`/api/3d-model?url=${url}`);
      const arrayBuffer = await readStreamToArrayBuffer(res.body!);

      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);
      const material = new THREE.MeshLambertMaterial({ color: "gray" });
      const object = new THREE.Mesh(geometry, material);

      // Exportar para GLTF
      const exporter = new GLTFExporter();
      exporter.parse(
        object,
        (gltf) => {
          const gltfLoader = new GLTFLoader();
          const blob = new Blob([JSON.stringify(gltf)], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          // Carregar e renderizar o modelo GLTF
          gltfLoader.load(url, (gltfScene) => {
            scene.add(gltfScene.scene);
          });
        },
        (err) => console.log(err),
      );

      const box = new THREE.Box3().setFromObject(object);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });

      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(center.x, center.y, maxDim * 1.5);
      camera.lookAt(center);

      setup(containerRef.current!, camera, renderer);
    }

    start();

    return () => {
      isMounted = false;
      scene.clear();
    };
  }, []);

  return <section ref={containerRef} />;
}
