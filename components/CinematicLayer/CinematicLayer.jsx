"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * CinematicLayer
 * A transparent, GPU-driven bokeh field rendered behind the hero content.
 *
 * Design intent: warm orange + white motes with a few cool monitor-blue
 * accents, drifting on slow sine waves like dust in a projector beam.
 *
 * Performance notes:
 *  - All floating motion lives in the vertex shader, driven by a single
 *    `uTime` uniform. No per-frame CPU loops over the geometry.
 *  - Additive blending + soft radial alpha gives the dreamy bloom for free.
 *  - rAF pauses when the tab is hidden; everything is disposed on unmount.
 *  - Respects prefers-reduced-motion (renders one static frame, no loop).
 */
export default function CinematicLayer({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---- Build the particle field --------------------------------------
    const COUNT = width < 720 ? 200 : 420;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);

    const warm = new THREE.Color(0xff7a2f);
    const warmSoft = new THREE.Color(0xffb070);
    const white = new THREE.Color(0xfff3e6);
    const blue = new THREE.Color(0x6f9bff);

    for (let i = 0; i < COUNT; i++) {
      // Spread through a wide, deep volume so parallax reads as depth.
      positions[i * 3 + 0] = (Math.random() - 0.5) * 46;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 6;

      // Palette: mostly warm, a sprinkle of white sparks, rare blue motes.
      const roll = Math.random();
      let c;
      if (roll > 0.92) c = blue;
      else if (roll > 0.66) c = white;
      else if (roll > 0.4) c = warmSoft;
      else c = warm;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Big soft bokeh in front, tiny sparks far away.
      scales[i] = Math.pow(Math.random(), 2.2) * 60 + 6;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uSize;
        attribute vec3 aColor;
        attribute float aScale;
        attribute float aPhase;
        attribute float aSpeed;
        varying vec3 vColor;

        void main() {
          vColor = aColor;
          vec3 p = position;
          // Slow, dreamy sine-wave drift on every axis.
          p.y += sin(uTime * aSpeed + aPhase) * 1.4;
          p.x += cos(uTime * aSpeed * 0.8 + aPhase) * 1.0;
          p.z += sin(uTime * aSpeed * 0.5 + aPhase) * 0.6;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aScale * uSize * (1.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        void main() {
          // Soft circular falloff -> blurred bokeh, no texture needed.
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          alpha = pow(alpha, 1.9);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse parallax -------------------------------------------------
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // ---- Render loop ----------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const renderFrame = () => {
      material.uniforms.uTime.value += clock.getDelta() * 0.6;

      // Ease the camera toward the pointer for a gentle parallax.
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      camera.position.x = current.x * 2.4;
      camera.position.y = -current.y * 1.6;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    if (prefersReduced) {
      // One composed static frame, no animation.
      clock.getDelta();
      renderFrame();
    } else {
      loop();
    }

    // Pause work when the tab is not visible.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!prefersReduced && !running) {
        running = true;
        clock.getDelta(); // drop the elapsed gap so motion stays smooth
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---- Resize ---------------------------------------------------------
    const onResize = () => {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (prefersReduced) renderFrame();
    };
    window.addEventListener("resize", onResize);

    // ---- Cleanup --------------------------------------------------------
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
