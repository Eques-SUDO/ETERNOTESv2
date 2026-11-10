/**
 * EternotesLogo3D  -  the Eternotes mark in 3D (no text)
 * ------------------------------------------------------------
 * The E is a flat 2D shape in the 3D scene; the golden staff ribbon, the two
 * notes and the star are real 3D. Outlines were traced from the original logo.
 *
 * Install:  npm i three          (works with three r128 and newer)
 * Use:      import EternotesLogo3D from "./EternotesLogo3D";
 *           <EternotesLogo3D height={420} />
 *
 * Props: height (number|string, default 420), interactive (default true),
 *        className, style
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const DATA = {"E":[[-0.824,1.63],[-0.812,1.618],[-0.764,1.618],[-0.709,1.606],[-0.606,1.558],[-0.558,1.503],[-0.533,1.43],[-0.533,1.248],[-0.551,1.242],[-0.552,-0.867],[-0.473,-0.867],[-0.467,-0.873],[-0.467,-0.933],[-0.388,-0.958],[0.097,-1.145],[0.388,-1.279],[0.503,-1.345],[0.63,-1.436],[0.758,-1.564],[0.794,-1.624],[0.818,-1.636],[0.8,-1.521],[0.794,-1.273],[0.788,-1.267],[0.794,-1.054],[0.818,-0.842],[0.812,-0.836],[0.8,-0.842],[0.782,-0.909],[0.709,-1.036],[0.63,-1.109],[0.588,-1.133],[0.521,-1.151],[0.418,-1.151],[0.279,-1.121],[-0.121,-0.982],[-0.2,-0.946],[-0.242,-0.903],[-0.255,-0.855],[-0.255,0.133],[-0.267,0.139],[-0.267,0.764],[-0.255,0.776],[-0.255,1.509],[-0.236,1.564],[-0.212,1.588],[-0.188,1.594],[0.236,1.594],[0.242,1.588],[0.37,1.582],[0.485,1.552],[0.612,1.485],[0.703,1.4],[0.746,1.339],[0.794,1.236],[0.8,1.2],[0.812,1.188],[0.818,1.194],[0.812,1.218],[0.812,1.63]],"wedge":[[-0.976,-0.558],[-0.964,-0.576],[-0.958,-0.606],[-0.921,-0.667],[-0.836,-0.758],[-0.764,-0.806],[-0.624,-0.873],[-0.588,-0.873],[-0.588,-0.812],[-0.594,-0.806],[-0.685,-0.776],[-0.8,-0.715],[-0.897,-0.642]],"star":[[0.067,2.358],[0.067,2.321],[0.061,2.315],[0.054,2.267],[0.042,2.23],[0.012,2.176],[-0.03,2.133],[-0.097,2.097],[-0.158,2.079],[-0.194,2.079],[-0.206,2.073],[-0.145,2.067],[-0.085,2.049],[-0.018,2.006],[0.036,1.933],[0.061,1.861],[0.067,1.8],[0.073,1.8],[0.079,1.873],[0.097,1.909],[0.097,1.921],[0.133,1.982],[0.158,2.006],[0.212,2.042],[0.285,2.067],[0.345,2.073],[0.333,2.079],[0.297,2.079],[0.218,2.103],[0.176,2.127],[0.115,2.188],[0.085,2.261],[0.079,2.309],[0.073,2.315],[0.073,2.358]],"stem1":[[0.406,1.285],[0.4,1.224],[0.37,1.164],[0.37,1.121],[0.388,1.152],[0.406,1.145],[0.406,0.364],[0.442,0.364],[0.448,0.382],[0.448,0.558],[0.442,0.564],[0.442,0.594],[0.448,0.6],[0.448,0.873],[0.455,0.879],[0.473,0.873],[0.521,0.77],[0.552,0.661],[0.545,0.57],[0.497,0.455],[0.515,0.467],[0.552,0.515],[0.582,0.588],[0.588,0.733],[0.552,0.861],[0.497,0.982],[0.461,1.091],[0.448,1.152],[0.448,1.279],[0.442,1.285]],"P":[631.1347,558.2612,206.1052,100.3074,-0.2698,35.424,0.0001,0.0004,0.0004],"ivs":[[[2.199,5.14],[5.332,8.234]],[[2.23,5.118],[5.293,8.273]],[[2.753,5.083],[5.262,8.303]],[[0.367,1.872],[2.531,4.756],[5.105,6.318]]],"tail":[[600.5,416.0],[606.5,413.0],[612.5,410.0],[618.5,406.5],[624.5,403.0],[630.5,399.3],[636.5,395.3],[642.5,391.3],[648.5,387.0],[654.5,382.0],[660.5,376.5],[666.6,369.5],[670.4,363.0],[674,352],[678,340],[680,333]]};

function createEternotesMark(THREE, stage, D, options) {
  options = options || {};
  const interactive = options.interactive !== false;
  const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const modern = parseInt(THREE.REVISION, 10) >= 152;
  const S = 165, CX = 615, CY = 545;
  const sx = (p) => (p - CX) / S, sy = (p) => (CY - p) / S;
  const col = (h) => { const c = new THREE.Color(h); if (!modern) c.convertSRGBToLinear(); return c; };

  /* ---------- renderer / camera ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 100);
  let zBase = 14.5;

  /* ---------- studio reflections for the gold (built in code) ---------- */
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.BoxGeometry(24, 24, 24),
    new THREE.MeshBasicMaterial({ color: col(0xb98d55), side: THREE.BackSide })));
  const panel = (w, h, x, y, z, c, i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: col(c).multiplyScalar(i), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); envScene.add(m);
  };
  panel(14, 4, 0, 9, 7, 0xfff1d6, 6);
  panel(3, 12, -9, 1, 5, 0xffe7bd, 5);
  panel(3, 12, 9, 1, 5, 0xffe7bd, 5);
  panel(10, 3, 0, -8, 6, 0xffd9a0, 2.5);
  panel(8, 10, 0, 2, -10, 0x2a170a, 1);
  panel(2, 12, -4, 0, 10, 0x1a0d05, 1);
  panel(2, 12, 4.5, 0, 10, 0x1a0d05, 1);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(envScene, 0.03).texture;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xfff0d8, modern ? 2.4 : 0.8);
  key.position.set(2, 4, 8); scene.add(key);
  const glint = new THREE.PointLight(0xffe2b0, modern ? 30 : 1.4, 14);
  scene.add(glint);

  const gold = (c, r, extra) => new THREE.MeshStandardMaterial(Object.assign(
    { color: col(c), metalness: 1, roughness: r, envMapIntensity: 1.25 }, extra || {}));

  /* ---------- scene graph ---------- */
  const mark = new THREE.Group(), floater = new THREE.Group(), art = new THREE.Group();
  art.position.set(-0.152, -0.273, 0);
  mark.add(floater); floater.add(art); scene.add(mark);

  const shape = (pts) => {
    const s = new THREE.Shape();
    pts.forEach((p, i) => (i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])));
    s.closePath(); return s;
  };
  const extrude = (pts, depth, bevel) => {
    const g = new THREE.ExtrudeGeometry(shape(pts), { depth, bevelEnabled: true, bevelThickness: bevel,
      bevelSize: bevel * 0.6, bevelSegments: 3, curveSegments: 12 });
    g.translate(0, 0, -depth / 2); return g;
  };

  /* ---------- the flat 2D E (traced from the logo) ---------- */
  const eMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide,
    toneMapped: false, transparent: true, opacity: reduce ? 1 : 0 });
  const flat = (pts) => {
    const g = new THREE.ShapeGeometry(shape(pts), 16);
    const p = g.attributes.position, c = [], top = col(0x5b3926), bot = col(0x4a2c1c), q = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      q.copy(bot).lerp(top, THREE.MathUtils.clamp((p.getY(i) + 1.7) / 3.4, 0, 1)); c.push(q.r, q.g, q.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3)); return g;
  };
  art.add(new THREE.Mesh(flat(D.E), eMat), new THREE.Mesh(flat(D.wedge), eMat));

  /* ---------- ribbon: a golden band wound round the E ---------- */
  const P = D.P, DZ = 0.62, cT = Math.cos(P[4]), sT = Math.sin(P[4]);
  const ring = (s, t) => {
    const h = P[5] + P[6] * Math.cos(t) + P[7] * Math.sin(t);
    const u = P[2] * Math.cos(t) + P[8] * s * Math.sin(t), v = P[3] * Math.sin(t) + s * h;
    return [P[0] + u * cT - v * sT, P[1] + u * sT + v * cT];
  };
  const pt = (s, t) => { const q = ring(s, t); return new THREE.Vector3(sx(q[0]), sy(q[1]), -DZ * Math.sin(t)); };

  const tube = (pts, r) => {
    const curve = new THREE.CatmullRomCurve3(pts), n = Math.max(24, pts.length * 2), RS = 8;
    const g = new THREE.TubeGeometry(curve, n, r, RS, false), pos = g.attributes.position, cc = [];
    const a = col(0xb4803a), b = col(0xf0cb82), q = new THREE.Color();
    for (let i = 0; i <= n; i++) {
      const u = i / n, c = curve.getPointAt(u), k = Math.min(1, 0.15 + Math.min(u, 1 - u) * 9);
      q.copy(a).lerp(b, THREE.MathUtils.clamp((c.x + 1.6) / 3.2, 0, 1));
      for (let j = 0; j <= RS; j++) {
        const idx = i * (RS + 1) + j;
        pos.setXYZ(idx, c.x + (pos.getX(idx) - c.x) * k, c.y + (pos.getY(idx) - c.y) * k, c.z + (pos.getZ(idx) - c.z) * k);
        cc.push(q.r, q.g, q.b);
      }
    }
    pos.needsUpdate = true; g.computeVertexNormals();
    g.setAttribute("color", new THREE.Float32BufferAttribute(cc, 3)); return g;
  };

  const lineMat = gold(0xffffff, 0.22, { vertexColors: true });
  const lines = [];
  [-1, -1 / 3, 1 / 3, 1].forEach((s, i) => {
    D.ivs[i].forEach((iv) => {
      const pts = []; let cut = false;
      for (let t = iv[0]; t <= iv[1]; t += 0.02) {
        const q = ring(s, t);
        if (i === 0 && Math.sin(t) < 0 && q[0] > 598) {
          if (pts.length) { cut = true; break; }
          continue; /* interval starts inside the hidden region - skip leading points */
        }
        pts.push(pt(s, t));
      }
      if (cut) { /* outer line sweeps up into the note's stem, as in the logo */
        const z = pts[pts.length - 1].z;
        D.tail.forEach((q) => pts.push(new THREE.Vector3(sx(q[0]), sy(q[1]), z)));
      }
      if (pts.length < 3) return;
      const g = tube(pts, 0.0125), m = new THREE.Mesh(g, lineMat);
      art.add(m); lines.push({ g, total: g.index.count, i });
    });
  });

  /* invisible depth-only strip: the band passes in front of the E's stem and hides it */
  (() => {
    const pos = [], idx = []; let n = 0;
    for (let t = Math.PI; t <= 2 * Math.PI; t += 0.01) {
      const q = ring(0, t); if (q[0] < 494 || q[0] > 602) continue;
      const a = ring(-1.25, t), b = ring(1.25, t), z = -DZ * Math.sin(t) - 0.07;
      pos.push(sx(a[0]), sy(a[1]), z, sx(b[0]), sy(b[1]), z);
      if (n > 0) { const k = n * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); } n++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = -1; art.add(m);
  })();

  /* ---------- notes ---------- */
  const ellipsoid = (a, b, c, rot, mat) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), mat);
    m.scale.set(a, b, c); m.rotation.z = rot; return m;
  };
  // upper note (inside the ring)
  const h1 = [sx(654.6), sy(523.3)];
  const note1 = new THREE.Group(); note1.position.set(h1[0], h1[1], 0.62);
  note1.add(ellipsoid(0.2567, 0.1487, 0.13, 0.675, gold(0xc8913f, 0.2)));
  const sg1 = extrude(D.stem1, 0.05, 0.014); sg1.translate(-h1[0], -h1[1], 0);
  note1.add(new THREE.Mesh(sg1, gold(0xc8913f, 0.2)));
  art.add(note1);
  // lower note (hangs from the E's stem; stem fades from E brown to gold)
  const h2 = [sx(497.6), sy(815.5)];
  const note2 = new THREE.Group(); note2.position.set(h2[0], h2[1], 0.14);
  note2.add(ellipsoid(0.2346, 0.1466, 0.12, 0.524, gold(0xe3b26a, 0.2)));
  const x0 = sx(527), x1 = sx(533), y0 = sy(688), y1 = sy(805);
  const sg2 = extrude([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 0.05, 0.01);
  sg2.translate(-h2[0], -h2[1], 0);
  { const p = sg2.attributes.position, c = [], top = col(0x5a3d2b), bot = col(0xeab870), q = new THREE.Color();
    const ya = y0 - h2[1], yb = y1 - h2[1];
    for (let i = 0; i < p.count; i++) {
      let f = THREE.MathUtils.clamp((ya - p.getY(i)) / (ya - yb), 0, 1);
      f = THREE.MathUtils.clamp((f - 0.08) / 0.6, 0, 1); f = f * f * (3 - 2 * f);
      q.copy(top).lerp(bot, f); c.push(q.r, q.g, q.b);
    }
    sg2.setAttribute("color", new THREE.Float32BufferAttribute(c, 3)); }
  note2.add(new THREE.Mesh(sg2, gold(0xffffff, 0.2, { vertexColors: true })));
  art.add(note2);

  /* ---------- star + halo ---------- */
  let minX = 9, maxX = -9, minY = 9, maxY = -9;
  D.star.forEach((p) => { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
  const scx = (minX + maxX) / 2, scy = (minY + maxY) / 2;
  const star = new THREE.Group(); star.position.set(scx, scy, 0.25);
  star.add(new THREE.Mesh(extrude(D.star.map((p) => [p[0] - scx, p[1] - scy]), 0.06, 0.02), gold(0xf0c070, 0.16)));
  art.add(star);

  const tex = (stops) => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach((s) => g.addColorStop(s[0], s[1]));
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace; else t.encoding = THREE.sRGBEncoding;
    return t;
  };
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex([[0, "rgba(255,208,128,0.85)"], [0.35, "rgba(240,186,100,0.3)"], [1, "rgba(240,186,100,0)"]]),
    transparent: true, depthWrite: false, opacity: 0.4 }));
  halo.scale.set(1.7, 1.7, 1); halo.position.set(scx, scy, 0.1); art.add(halo);

  /* ---------- gold dust ---------- */
  const dp = [];
  for (let i = 0; i < 70; i++) dp.push((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5.4, (Math.random() - 0.5) * 2.4);
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.055, color: col(0xd9a54f), transparent: true, opacity: 0,
    depthWrite: false, map: tex([[0, "rgba(255,255,255,1)"], [0.5, "rgba(255,255,255,0.6)"], [1, "rgba(255,255,255,0)"]]) });
  const dust = new THREE.Points(dg, dustMat); mark.add(dust);

  /* ---------- sizing + pointer ---------- */
  const resize = () => {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; zBase = 14.5 * Math.max(1, 0.85 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(stage); else window.addEventListener("resize", resize);
  resize();

  let px = 0, py = 0;
  const onMove = (e) => {
    if (!interactive) return;
    const r = stage.getBoundingClientRect();
    px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
  };
  window.addEventListener("pointermove", onMove);

  /* ---------- animation: one slow reveal, then a gentle idle ---------- */
  const clock = new THREE.Clock();
  const seg = (t, a, d) => Math.min(1, Math.max(0, (t - a) / d));
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const back = (x) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  let raf = 0, eOpaque = reduce;

  const frame = () => {
    const t = clock.getElapsedTime(), I = reduce ? 99 : t;
    const intro = easeOut(seg(I, 0, 2.8));

    if (!eOpaque) { eMat.opacity = easeOut(seg(I, 0, 1.1)); if (eMat.opacity >= 1) { eMat.transparent = false; eMat.needsUpdate = true; eOpaque = true; } }
    lines.forEach((L) => { L.g.setDrawRange(0, Math.floor(L.total * easeOut(seg(I, 0.3 + 0.12 * L.i, 1.8)) / 3) * 3); });
    note1.scale.setScalar(Math.max(1e-4, back(seg(I, 1.3, 0.8))));
    note2.scale.setScalar(Math.max(1e-4, back(seg(I, 1.6, 0.8))));
    const sp = back(seg(I, 1.9, 0.9));
    star.scale.setScalar(Math.max(1e-4, sp) * (1 + (reduce ? 0 : Math.sin(t * 2.4) * 0.07)));
    star.rotation.y = reduce ? 0 : Math.sin(t * 0.9) * 0.7 + (1 - easeOut(seg(I, 1.9, 1.4))) * 6.28;
    halo.material.opacity = (0.3 + (reduce ? 0 : 0.14 * Math.sin(t * 2.4))) * seg(I, 2.0, 0.8);
    dustMat.opacity = 0.65 * seg(I, 2.2, 1.2);
    dust.rotation.y = reduce ? 0 : t * 0.04;
    dust.position.y = reduce ? 0 : Math.sin(t * 0.5) * 0.06;

    const ty = (interactive ? px * 0.42 : 0) + (reduce ? 0 : Math.sin(t * 0.45) * 0.14) + (1 - intro) * 0.8;
    const tx = (interactive ? py * 0.22 : 0) + (reduce ? 0 : Math.sin(t * 0.37) * 0.03);
    mark.rotation.y += (ty - mark.rotation.y) * 0.06;
    mark.rotation.x += (tx - mark.rotation.x) * 0.06;
    floater.position.y = reduce ? 0 : Math.sin(t * 1.2) * 0.05;
    camera.position.set(0, 0, zBase * (1 + 0.14 * (1 - intro)));
    glint.position.set(px * 4, -py * 3 + 1.5, 5);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  frame();

  return function dispose() {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    if (ro) ro.disconnect(); else window.removeEventListener("resize", resize);
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  };
}


export default function EternotesLogo3D({ height = 420, interactive = true, className, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    return createEternotesMark(THREE, ref.current, DATA, { interactive });
  }, [interactive]);
  return <div ref={ref} className={className} style={{ width: "100%", height, ...style }} />;
}
