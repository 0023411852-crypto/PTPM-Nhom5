"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { css } from "styled-system/css";

export default function Home() {
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);

  const [slogan, setSlogan] = useState("Hạ tầng Cloud mạnh mẽ cho mọi ý tưởng.");
  const [featuredPlans, setFeaturedPlans] = useState<any[]>([]);
  const [activePromotions, setActivePromotions] = useState<any[]>([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/SiteSettings/public")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const found = data.find((x: any) => x.key === 'Slogan');
          if (found) setSlogan(found.value);
        }
      })
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [plansRes, promotionsRes, newsRes] = await Promise.all([
          fetch("/api/ServicePlans?PageNumber=1&PageSize=3"),
          fetch("/api/Promotions?PageNumber=1&PageSize=3&onlyActive=true"),
          fetch("/api/NewsArticles?onlyPublished=true&pageNumber=1&pageSize=3")
        ]);
        if (plansRes.ok) {
          const data = await plansRes.json();
          setFeaturedPlans((data.data || []).filter((plan: any) => plan.isActive).slice(0, 3));
        }
        if (promotionsRes.ok) {
          const data = await promotionsRes.json();
          setActivePromotions((data.data || []).slice(0, 3));
        }
        if (newsRes.ok) {
          const data = await newsRes.json();
          setLatestNews((data.data || []).slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load homepage data", error);
      }
    };
    loadHomepageData();
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
      <main className={css({ paddingTop: "16" })}>
        <section className={css({
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        })}>
          <div className={css({
            position: "absolute",
            inset: "0",
            width: "full",
            height: "full",
            opacity: "0.2",
            pointerEvents: "none",
          })} style={{ display: "block" }}>
            <canvas ref={shaderCanvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
          </div>

          <div className={css({
            maxWidth: "container-max",
            marginX: "auto",
            paddingX: "gutter",
            width: "full",
            display: "grid",
            gridTemplateColumns: { base: "1", lg: "2" },
            gap: "2xl",
            position: "relative",
            zIndex: "10",
          })}>
            <div className={css({
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "lg",
              paddingY: "2xl",
            })}>
              <div className={css({
                display: "inline-flex",
                alignItems: "center",
                gap: "2",
                paddingX: "3",
                paddingY: "1",
                borderRadius: "full",
                backgroundColor: "surface-container-high",
                border: "1px solid",
                borderColor: "outline-variant",
                width: "fit",
              })}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "primary" }}>rocket_launch</span>
                <span className={css({
                  fontSize: "label-caps",
                  fontWeight: "label-caps",
                  color: "on-surface",
                })}>Khuyến mãi lên đến 30%</span>
              </div>
              <h1 className={css({
                fontSize: "display-lg",
                color: "on-background",
                whiteSpace: "pre-wrap",
              })}>
                {slogan}
              </h1>
              <p className={css({
                fontSize: "body-lg",
                color: "on-surface-variant",
                maxWidth: "36rem",
              })}>
                Triển khai VPS, Hosting, Domain và các giải pháp Cloud trên nền tảng hạ tầng ổn định, bảo mật và sẵn
                sàng mở rộng.
              </p>
              <div className={css({
                display: "flex",
                flexWrap: "wrap",
                gap: "md",
                marginTop: "sm",
              })}>
                <Link href="/pricing" className={css({
                  backgroundColor: "primary",
                  color: "white",
                  fontSize: "label-caps",
                  fontWeight: "label-caps",
                  paddingX: "6",
                  paddingY: "3",
                  borderRadius: "lg",
                  _hover: { backgroundColor: "primary-container" },
                  transition: "colors",
                  boxShadow: "sm",
                  _active: { scale: "0.95" },
                  display: "flex",
                  alignItems: "center",
                  gap: "2",
                })}>
                  Bắt đầu ngay
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                </Link>
                <Link href="/services" className={css({
                  backgroundColor: "surface-container-lowest",
                  color: "primary",
                  border: "1px solid",
                  borderColor: "outline-variant",
                  fontSize: "label-caps",
                  fontWeight: "label-caps",
                  paddingX: "6",
                  paddingY: "3",
                  borderRadius: "lg",
                  _hover: { borderColor: "primary" },
                  transition: "colors",
                  _active: { scale: "0.95" },
                  display: "inline-flex",
                  alignItems: "center",
                })}>
                  Khám phá dịch vụ
                </Link>
              </div>
              <div className={css({
                display: "flex",
                alignItems: "center",
                gap: "xl",
                marginTop: "lg",
                paddingTop: "lg",
                borderTop: "1px solid",
                borderColor: "outline-variant",
              })}>
                <div>
                  <p className={css({ fontSize: "headline-md", color: "on-background" })}>99.9%</p>
                  <p className={css({ fontSize: "label-caps", fontWeight: "label-caps", color: "on-surface-variant" })}>Uptime SLA</p>
                </div>
                <div>
                  <p className={css({ fontSize: "headline-md", color: "on-background" })}>24/7</p>
                  <p className={css({ fontSize: "label-caps", fontWeight: "label-caps", color: "on-surface-variant" })}>Support</p>
                </div>
                <div>
                  <p className={css({ fontSize: "headline-md", color: "on-background" })}>10Gbps</p>
                  <p className={css({ fontSize: "label-caps", fontWeight: "label-caps", color: "on-surface-variant" })}>Network</p>
                </div>
              </div>
            </div>

            <div className={css({
              position: "relative",
              height: { base: "400px", lg: "600px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}>
              <div className={css({
                position: "absolute",
                inset: "0",
                background: "linear-gradient(to top right, surface-tint/10, transparent)",
                borderRadius: "full",
                blur: "3xl",
              })}></div>
              <div ref={threeContainerRef} className={css({
                width: "full",
                height: "full",
                position: "relative",
                zIndex: "10",
              })} style={{ display: "block" }}></div>
            </div>
          </div>
        </section>

        <section className={css({
          paddingY: "2xl",
          paddingX: "gutter",
          backgroundColor: "background",
        })}>
          <div className={css({
            maxWidth: "container-max",
            marginX: "auto",
          })}>
            <div className={css({
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "md",
              marginBottom: "lg",
            })}>
              <div>
                <p className={css({
                  fontSize: "label-caps",
                  fontWeight: "label-caps",
                  color: "primary",
                })}>Dịch vụ nổi bật</p>
                <h2 className={css({
                  fontSize: "headline-lg",
                  color: "on-background",
                })}>Gói Cloud được quan tâm</h2>
              </div>
              <Link href="/pricing" className={css({
                color: "primary",
                fontSize: "body-sm",
                fontWeight: "semibold",
                _hover: { textDecoration: "underline" },
              })}>Xem bảng giá</Link>
            </div>
            {featuredPlans.length > 0 ? (
              <div className={css({
                display: "grid",
                gridTemplateColumns: { base: "1", md: "3" },
                gap: "lg",
              })}>
                {featuredPlans.map((plan) => (
                  <Link href="/pricing" key={plan.id} className={css({ display: "block", group: true, height: "full" })}>
                    <article className={css({
                      backgroundColor: "surface",
                      borderRadius: "xl",
                      border: "1px solid",
                      borderColor: "outline-variant",
                      padding: "lg",
                      boxShadow: "sm",
                      _groupHover: { borderColor: "primary", boxShadow: "md" },
                      transition: "all",
                      display: "flex",
                      flexDirection: "column",
                      height: "full",
                    })}>
                      <p className={css({
                        fontSize: "label-caps",
                        fontWeight: "label-caps",
                        color: "primary",
                      })}>{plan.category?.name || "Cloud"}</p>
                      <h3 className={css({
                        fontSize: "headline-md",
                        color: "on-surface",
                        marginTop: "sm",
                        _groupHover: { color: "primary" },
                        transition: "colors",
                      })}>{plan.name}</h3>
                      <p className={css({
                        fontSize: "body-sm",
                        color: "on-surface-variant",
                        marginTop: "sm",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        flexGrow: "1",
                      })}>{plan.description}</p>
                      <div className={css({
                        marginTop: "lg",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        borderTop: "1px solid",
                        borderColor: "outline-variant/50",
                        paddingTop: "md",
                      })}>
                        <div>
                            <p className={css({
                              fontSize: "body-sm",
                              color: "on-surface-variant",
                              marginBottom: "1",
                            })}>Giá từ</p>
                            <p className={css({
                              fontSize: "headline-sm",
                              color: "on-surface",
                            })}>{plan.prices?.[0]?.price?.toLocaleString("vi-VN") || "Liên hệ"} đ</p>
                        </div>
                        <span className="material-symbols-outlined" style={{
                          color: "primary",
                          backgroundColor: "primary-container/50",
                          borderRadius: "full",
                          padding: "8px",
                        }}>arrow_forward</span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : <p className={css({ color: "on-surface-variant" })}>Chưa có gói dịch vụ nổi bật.</p>}
          </div>
        </section>

        <section className={css({
          paddingY: "2xl",
          paddingX: "gutter",
          backgroundColor: "surface-container-lowest",
        })}>
          <div className={css({
            maxWidth: "container-max",
            marginX: "auto",
            display: "grid",
            gridTemplateColumns: { base: "1", lg: "2" },
            gap: "lg",
          })}>
            <div className={css({
              backgroundColor: "primary-container/30",
              borderRadius: "xl",
              padding: "lg",
              border: "1px solid",
              borderColor: "primary/20",
            })}>
              <p className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
                color: "primary",
              })}>Khuyến mãi đang chạy</p>
              <div className={css({
                marginTop: "md",
                display: "flex",
                flexDirection: "column",
                gap: "md",
              })}>
                {activePromotions.length > 0 ? activePromotions.map((promotion) => (
                  <div key={promotion.id} className={css({
                    backgroundColor: "surface",
                    borderRadius: "lg",
                    padding: "md",
                    border: "1px solid",
                    borderColor: "outline-variant",
                  })}>
                    <div className={css({
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "md",
                    })}>
                      <h3 className={css({
                        fontSize: "headline-sm",
                        color: "on-surface",
                      })}>{promotion.title}</h3>
                      <span className={css({
                        color: "primary",
                        fontWeight: "semibold",
                        whiteSpace: "nowrap",
                      })}>-{promotion.discountPercentage}%</span>
                    </div>
                    <p className={css({
                      fontSize: "body-sm",
                      color: "on-surface-variant",
                      marginTop: "xs",
                    })}>{promotion.description}</p>
                  </div>
                )) : <p className={css({ color: "on-surface-variant" })}>Hiện chưa có chương trình khuyến mãi.</p>}
              </div>
            </div>
            <div className={css({
              backgroundColor: "surface",
              borderRadius: "xl",
              padding: "lg",
              border: "1px solid",
              borderColor: "outline-variant",
            })}>
              <div className={css({
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "md",
              })}>
                <div>
                  <p className={css({
                    fontSize: "label-caps",
                    fontWeight: "label-caps",
                    color: "primary",
                  })}>Tin tức mới nhất</p>
                  <h2 className={css({
                    fontSize: "headline-md",
                    color: "on-surface",
                  })}>CloudNova Insights</h2>
                </div>
                <Link href="/news" className={css({
                  color: "primary",
                  fontSize: "body-sm",
                  fontWeight: "semibold",
                  _hover: { textDecoration: "underline" },
                })}>Xem tất cả</Link>
              </div>
              <div className={css({
                marginTop: "md",
                display: "flex",
                flexDirection: "column",
                gap: "md",
              })}>
                {latestNews.length > 0 ? latestNews.map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`} className={css({
                    display: "block",
                    borderBottom: "1px solid",
                    borderColor: "outline-variant",
                    paddingBottom: "md",
                    _last: { border: "0", paddingBottom: "0" },
                    _hover: { color: "primary" },
                  })}>
                    <p className={css({
                      fontSize: "label-caps",
                      fontWeight: "label-caps",
                      color: "secondary",
                    })}>{article.category || "Tin tức"}</p>
                    <h3 className={css({
                      fontSize: "body-md",
                      fontWeight: "semibold",
                      color: "on-surface",
                      marginTop: "xs",
                    })}>{article.title}</h3>
                    <p className={css({
                      fontSize: "body-sm",
                      color: "on-surface-variant",
                      marginTop: "xs",
                    })}>{new Date(article.createdAt).toLocaleDateString("vi-VN")}</p>
                  </Link>
                )) : <p className={css({ color: "on-surface-variant" })}>Chưa có bài viết mới.</p>}
              </div>
            </div>
          </div>
        </section>

        <section className={css({
          paddingY: "xl",
          backgroundColor: "surface-container-lowest",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "outline-variant",
        })}>
          <div className={css({
            maxWidth: "container-max",
            marginX: "auto",
            paddingX: "gutter",
            display: "flex",
            flexDirection: { base: "column", md: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: { base: "xl", md: "3xl" },
            opacity: "0.6",
          })}>
            <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>verified</span>
              <span className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
              })}>99.9% SLA</span>
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>monitoring</span>
              <span className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
              })}>24/7 Monitoring</span>
            </div>
            <div className={css({ display: "flex", alignItems: "center", gap: "2" })}>
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>security</span>
              <span className={css({
                fontSize: "label-caps",
                fontWeight: "label-caps",
              })}>Secure Infrastructure</span>
            </div>
          </div>
        </section>
      </main>

      </>
  );
}
