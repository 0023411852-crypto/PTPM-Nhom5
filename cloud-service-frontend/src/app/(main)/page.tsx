"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Home() {
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  const [slogan, setSlogan] = useState("Hạ tầng Cloud mạnh mẽ cho mọi ý tưởng.");

  useEffect(() => {
    fetch("http://localhost:5154/api/SiteSettings/public")
      .then(res => res.json())
      .then(data => {
        const found = data.find((x: any) => x.key === 'Slogan');
        if (found) setSlogan(found.value);
      })
      .catch(e => console.error(e));
  }, []);

  // WebGL Shader Animation (from STITCH_SHADER_START:ANIMATION_3)
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;
    const glContext = gl as WebGLRenderingContext;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Simplex noise function
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.wwww) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 m = u_mouse / u_resolution;
    
    // Background color (Dark Navy)
    vec3 color = vec3(0.039, 0.098, 0.184); 
    
    // Animated cloud-like noise
    float n = snoise(uv * 3.0 + u_time * 0.1);
    n += 0.5 * snoise(uv * 6.0 - u_time * 0.15);
    
    // Primary Blue highlights
    vec3 accent = vec3(0.0, 0.38, 1.0); // CloudNova Blue
    float glow = smoothstep(0.4, 0.6, n);
    
    color = mix(color, accent, glow * 0.15);
    
    // Subtle grid pattern
    vec2 grid = fract(uv * 40.0);
    float line = step(0.98, grid.x) + step(0.98, grid.y);
    color += line * 0.02;
    
    // Mouse interaction glow
    float dist = distance(uv, m);
    color += accent * (1.0 - smoothstep(0.0, 0.3, dist)) * 0.1;

    gl_FragColor = vec4(color, 1.0);
}`;
    function cs(type: number, src: string) {
      const s = glContext.createShader(type);
      if (!s) return null;
      glContext.shaderSource(s, src);
      glContext.compileShader(s);
      return s;
    }
    const prog = glContext.createProgram();
    if (!prog) return;
    const vShader = cs(glContext.VERTEX_SHADER, vs);
    const fShader = cs(glContext.FRAGMENT_SHADER, fs);
    if (vShader) glContext.attachShader(prog, vShader);
    if (fShader) glContext.attachShader(prog, fShader);
    glContext.linkProgram(prog);
    glContext.useProgram(prog);

    const buf = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buf);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glContext.STATIC_DRAW);
    
    const pos = glContext.getAttribLocation(prog, "a_position");
    glContext.enableVertexAttribArray(pos);
    glContext.vertexAttribPointer(pos, 2, glContext.FLOAT, false, 0, 0);
    
    const uTime = glContext.getUniformLocation(prog, "u_time");
    const uRes = glContext.getUniformLocation(prog, "u_resolution");
    const uMouse = glContext.getUniformLocation(prog, "u_mouse");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    function render(t: number) {
      if (!canvas) return;
      if (typeof ResizeObserver === "undefined") syncSize();
      glContext.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) glContext.uniform1f(uTime, t * 0.001);
      if (uRes) glContext.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) glContext.uniform2f(uMouse, mouse.x, mouse.y);
      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }
    render(0);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Three.js Animation (from STITCH_THREEJS_START:ANIMATION_4)
  useEffect(() => {
    const container = threeContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x0061ff, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0061ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const innerCoreGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const innerCoreMat = new THREE.MeshPhongMaterial({
      color: 0x0061ff,
      emissive: 0x002d72,
      shininess: 100,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    group.add(innerCore);

    const nodeCount = 8;
    const nodes: any[] = [];
    const nodeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const nodeMat = new THREE.MeshPhongMaterial({ color: 0xffffff });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 2.5;
      node.position.x = Math.cos(angle) * radius;
      node.position.y = Math.sin(angle) * radius;
      node.position.z = (Math.random() - 0.5) * 2;
      group.add(node);
      nodes.push({
        mesh: node,
        speed: 0.005 + Math.random() * 0.01,
        angle: angle,
        radius: radius,
      });
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x0061ff, transparent: true, opacity: 0.3 });
    const lines: THREE.Line[] = [];

    function updateLines() {
      lines.forEach((l) => scene.remove(l));
      lines.length = 0;

      nodes.forEach((node) => {
        const points = [new THREE.Vector3(0, 0, 0), node.mesh.position];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMat);
        scene.add(line);
        lines.push(line);
      });
    }

    let animationId: number;
    function animate() {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      core.rotation.y += 0.005;
      core.rotation.z += 0.003;
      innerCore.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      nodes.forEach((n) => {
        n.angle += n.speed;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.y = Math.sin(n.angle) * n.radius;
        n.mesh.rotation.x += 0.02;
        n.mesh.rotation.y += 0.02;
      });

      updateLines();

      group.rotation.y = Math.sin(time * 0.5) * 0.2;
      group.rotation.x = Math.cos(time * 0.3) * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <main className="pt-16">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ display: "block" }}>
            <canvas ref={shaderCanvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
          </div>

          <div className="max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 lg:grid-cols-2 gap-2xl relative z-10">
            <div className="flex flex-col justify-center gap-lg py-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant w-fit">
                <span className="material-symbols-outlined text-[16px] text-primary">rocket_launch</span>
                <span className="font-label-caps text-label-caps text-on-surface">Khuyến mãi lên đến 30%</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-on-background whitespace-pre-wrap">
                {slogan}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[36rem]">
                Triển khai VPS, Hosting, Domain và các giải pháp Cloud trên nền tảng hạ tầng ổn định, bảo mật và sẵn
                sàng mở rộng.
              </p>
              <div className="flex flex-wrap gap-md mt-sm">
                <Link href="/pricing" className="bg-primary text-white font-label-caps text-label-caps px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 flex items-center gap-2">
                  Bắt đầu ngay
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link href="/services" className="bg-surface-container-lowest text-primary border border-outline-variant font-label-caps text-label-caps px-6 py-3 rounded-lg hover:border-primary transition-colors active:scale-95 inline-flex items-center">
                  Khám phá dịch vụ
                </Link>
              </div>
              <div className="flex items-center gap-xl mt-lg pt-lg border-t border-outline-variant">
                <div>
                  <p className="font-headline-md text-headline-md text-on-background">99.9%</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Uptime SLA</p>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-on-background">24/7</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Support</p>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-on-background">10Gbps</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">Network</p>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-tint/10 to-transparent rounded-full blur-3xl"></div>
              <div ref={threeContainerRef} className="w-full h-full relative z-10" style={{ display: "block" }}></div>
            </div>
          </div>
        </section>

        <section className="py-xl bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-center items-center gap-xl md:gap-3xl opacity-60">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]">verified</span>
              <span className="font-label-caps text-label-caps">99.9% SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]">monitoring</span>
              <span className="font-label-caps text-label-caps">24/7 Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[32px]">security</span>
              <span className="font-label-caps text-label-caps">Secure Infrastructure</span>
            </div>
          </div>
        </section>
      </main>

      </>
  );
}
