'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls, STLLoader } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

function setup(containerElement: HTMLElement) {
  if (containerElement.children.length > 0) {
    return;
  }

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  scene.background = new THREE.Color('black');

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(1500, 600);
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

export function Scene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let loader = new STLLoader();

    loader.load('/upperjaw.stl', (model) => {
      const object = new THREE.Mesh(
        model,
        new THREE.MeshLambertMaterial({ color: 'red' })
      );

      scene.add(object);

      setup(containerRef.current!);
    });
  }, []);

  return <div ref={containerRef} />;
}
