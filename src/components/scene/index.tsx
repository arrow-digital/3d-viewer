'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls, STLLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

function setup(containerElement: HTMLElement) {
  if (containerElement.children.length > 0) {
    return;
  }

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  scene.background = new THREE.Color('white');

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  new OrbitControls(camera, renderer.domElement);
  containerElement.appendChild(renderer.domElement);

  let light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 0, 10);
  scene.add(light);

  let light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(0, 0, -10);
  scene.add(light2);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

async function readStreamToArrayBuffer(stream: ReadableStream) {
  const reader = stream.getReader();
  const chunks = [];

  let done = false;
  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = streamDone;
  }

  const arrayBuffer = new Uint8Array(chunks.reduce((acc, val) => acc.concat(Array.from(val)), []));
  return arrayBuffer.buffer;
}

export function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();
  const modelUrl = params.get('url');

  useEffect(() => {
    async function start() {
      const url = modelUrl
        ? modelUrl
        : 'https://linkio-dev-bucket.s3.sa-east-1.amazonaws.com/orders/667add660c806be4e1b0f0fe/upperjaw_ff1990d4-1544-4208-84e7-aac74e669c22.stl';

      const res = await fetch(`/api/3d-model?url=${url}`);
      const arrayBuffer = await readStreamToArrayBuffer(res.body!);

      const loader = new STLLoader();

      const geometry = loader.parse(arrayBuffer);
      const material = new THREE.MeshLambertMaterial({ color: 'red' });
      const object = new THREE.Mesh(geometry, material);

      scene.add(object);
      setup(containerRef.current!);
    }

    start();
  }, [modelUrl]);

  return <div ref={containerRef} />;
}
