import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function finalizeColorTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function finalizeDataTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

// Deterministic pseudo-random helper for repeatable procedural grain
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * European Wide-Plank Rift-Cut Light Oak Flooring Texture + Roughness Map
 */
export function createLightOakPlankTextures(repeatX = 6, repeatY = 4): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const [canvas, ctx] = createCanvas(1024, 1024);
  const [rCanvas, rCtx] = createCanvas(512, 512);
  const rand = seededRandom(4021);

  // Base warm pale oak
  ctx.fillStyle = '#d8c3a5';
  ctx.fillRect(0, 0, 1024, 1024);

  rCtx.fillStyle = '#9a9a9a';
  rCtx.fillRect(0, 0, 512, 512);

  const plankRows = 8;
  const plankH = 1024 / plankRows;

  for (let row = 0; row < plankRows; row++) {
    const y0 = row * plankH;
    const joints = [0, Math.floor(260 + rand() * 220), Math.floor(640 + rand() * 240), 1024];
    const rowOffset = (row % 2) * 180;

    for (let j = 0; j < joints.length - 1; j++) {
      const xStart = (joints[j] + rowOffset) % 1024;
      const width = joints[j + 1] - joints[j];

      // Subtle per-plank tone variation
      const lightnessShift = (rand() - 0.5) * 14;
      const r = Math.min(255, Math.max(0, Math.round(218 + lightnessShift)));
      const g = Math.min(255, Math.max(0, Math.round(197 + lightnessShift * 0.9)));
      const b = Math.min(255, Math.max(0, Math.round(168 + lightnessShift * 0.8)));

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(xStart, y0, width, plankH);
      if (xStart + width > 1024) {
        ctx.fillRect(0, y0, xStart + width - 1024, plankH);
      }

      // Fine linear wood grain fibers
      for (let gLine = 0; gLine < 42; gLine++) {
        const gy = y0 + rand() * plankH;
        const alpha = 0.03 + rand() * 0.06;
        ctx.strokeStyle = rand() > 0.5 ? `rgba(145, 114, 80, ${alpha})` : `rgba(244, 232, 214, ${alpha})`;
        ctx.lineWidth = 0.8 + rand() * 1.6;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(340, gy + (rand() - 0.5) * 5, 680, gy + (rand() - 0.5) * 5, 1024, gy);
        ctx.stroke();
      }

      // Roughness variation per plank
      const roughVal = Math.round(135 + (rand() - 0.5) * 30);
      rCtx.fillStyle = `rgb(${roughVal},${roughVal},${roughVal})`;
      rCtx.fillRect((xStart / 2) | 0, (y0 / 2) | 0, (width / 2) | 0, (plankH / 2) | 0);
    }

    // Plank horizontal micro-bevel seam
    ctx.fillStyle = 'rgba(110, 86, 60, 0.36)';
    ctx.fillRect(0, y0, 1024, 2);
    rCtx.fillStyle = '#dcdcdc';
    rCtx.fillRect(0, (y0 / 2) | 0, 512, 2);
  }

  return {
    map: finalizeColorTexture(canvas, repeatX, repeatY),
    roughnessMap: finalizeDataTexture(rCanvas, repeatX, repeatY),
  };
}

/**
 * Fine Rift Oak Veneer (for cabinetry, fluted panels, furniture frames)
 */
export function createFineOakVeneerTexture(repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(8812);

  ctx.fillStyle = '#d5be9d';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 240; i++) {
    const y = rand() * 512;
    const alpha = 0.035 + rand() * 0.065;
    ctx.strokeStyle = rand() > 0.45 ? `rgba(150, 118, 82, ${alpha})` : `rgba(242, 229, 210, ${alpha})`;
    ctx.lineWidth = 0.7 + rand() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(256, y + (rand() - 0.5) * 6, 512, y);
    ctx.stroke();
  }

  return finalizeColorTexture(canvas, repeatX, repeatY);
}

/**
 * Calacatta Gold / Carrara White Veined Marble Texture (Kitchen island, countertops, feature walls)
 */
export function createCalacattaMarbleTexture(repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 1024);
  const rand = seededRandom(1907);

  // Luminous warm-white stone base
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#f9f8f6');
  grad.addColorStop(0.5, '#f4f2ee');
  grad.addColorStop(1, '#faf9f7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Soft mineral clouding
  for (let c = 0; c < 18; c++) {
    const cx = rand() * 1024;
    const cy = rand() * 1024;
    const rad = 120 + rand() * 240;
    const rg = ctx.createRadialGradient(cx, cy, 10, cx, cy, rad);
    rg.addColorStop(0, 'rgba(214, 208, 198, 0.14)');
    rg.addColorStop(1, 'rgba(248, 247, 244, 0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, 1024, 1024);
  }

  // Organic diagonal grey & warm-taupe marble veins
  for (let v = 0; v < 14; v++) {
    let vx = rand() * 1024;
    let vy = rand() * 300;
    ctx.beginPath();
    ctx.moveTo(vx, vy);

    const isGoldAccent = v % 4 === 0;
    ctx.strokeStyle = isGoldAccent
      ? `rgba(184, 158, 120, ${0.12 + rand() * 0.12})`
      : `rgba(148, 150, 156, ${0.14 + rand() * 0.18})`;
    ctx.lineWidth = isGoldAccent ? 1.2 + rand() * 2 : 1.5 + rand() * 3.8;

    for (let step = 0; step < 12; step++) {
      vx += (rand() - 0.28) * 130;
      vy += 55 + rand() * 65;
      ctx.quadraticCurveTo(
        vx + (rand() - 0.5) * 45,
        vy - 25 + (rand() - 0.5) * 30,
        vx,
        vy,
      );
    }
    ctx.stroke();
  }

  return finalizeColorTexture(canvas, repeatX, repeatY);
}

/**
 * Warm Travertine / Limestone Architectural Slab & Balcony Paver Texture
 */
export function createTravertineTexture(repeatX = 3, repeatY = 2, withTileGrid = true): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(5513);

  ctx.fillStyle = '#eae3d7';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle horizontal sedimentary striations
  for (let i = 0; i < 320; i++) {
    const y = rand() * 512;
    const len = 40 + rand() * 240;
    const x = rand() * (512 - len);
    ctx.fillStyle = rand() > 0.5 ? 'rgba(198, 187, 170, 0.22)' : 'rgba(250, 246, 240, 0.28)';
    ctx.fillRect(x, y, len, 1 + rand() * 2.5);
  }

  if (withTileGrid) {
    ctx.strokeStyle = 'rgba(165, 155, 140, 0.42)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 510, 510);
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.stroke();
  }

  return finalizeColorTexture(canvas, repeatX, repeatY);
}

/**
 * Woven Luxury Bouclé / Linen Fabric Texture (Sofas, upholstered beds, cushions, rugs)
 */
export function createBoucleFabricTexture(
  baseHex = '#f2eee8',
  weaveHex = '#dfd8cc',
  repeatX = 6,
  repeatY = 6,
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const rand = seededRandom(3391);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      if (rand() > 0.42) {
        ctx.fillStyle = weaveHex;
        ctx.globalAlpha = 0.22 + rand() * 0.28;
        ctx.fillRect(x, y, 3, 2);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.18 + rand() * 0.2;
        ctx.fillRect(x, y, 2, 3);
      }
    }
  }
  ctx.globalAlpha = 1;

  return finalizeColorTexture(canvas, repeatX, repeatY);
}

/**
 * Plush Architectural Area Rug Texture with Subtle Geometric Border
 */
export function createRugTexture(primaryHex = '#efeae2', accentHex = '#dcd3c5'): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const rand = seededRandom(7129);

  ctx.fillStyle = primaryHex;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle high-low pile lines
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.45;
  ctx.strokeRect(28, 28, 456, 456);
  ctx.strokeRect(48, 48, 416, 416);

  // Fine wool pile flecking
  for (let i = 0; i < 4500; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    ctx.fillStyle = rand() > 0.5 ? accentHex : '#faf8f5';
    ctx.globalAlpha = 0.2 + rand() * 0.25;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;

  return finalizeColorTexture(canvas, 1, 1);
}

/**
 * Studio PC Dual-Monitor Screen Wallpaper / Architectural Creative Workstation Display
 */
export function createMonitorScreenTexture(variant: 'primary' | 'secondary' = 'primary'): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 512);

  // Crisp minimalist studio dark-glass & alabaster desktop wallpaper
  const bg = ctx.createLinearGradient(0, 0, 1024, 512);
  if (variant === 'primary') {
    bg.addColorStop(0, '#0f172a');
    bg.addColorStop(0.55, '#1e293b');
    bg.addColorStop(1, '#334155');
  } else {
    bg.addColorStop(0, '#18181b');
    bg.addColorStop(1, '#27272a');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 512);

  // Abstract soft studio light ribbon on wallpaper
  const orb = ctx.createRadialGradient(540, 260, 20, 540, 260, 340);
  orb.addColorStop(0, 'rgba(226, 232, 240, 0.38)');
  orb.addColorStop(0.5, 'rgba(148, 163, 184, 0.14)');
  orb.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = orb;
  ctx.fillRect(0, 0, 1024, 512);

  // Clean 3D CAD / Studio application window frame
  ctx.fillStyle = 'rgba(24, 24, 27, 0.82)';
  ctx.fillRect(68, 44, 888, 410);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(68, 44, 888, 410);

  if (variant === 'primary') {
    // Wireframe architectural perspective grid inside viewport
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(230, 96, 540, 310);

    // Isometric cube / architectural massing model lines
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.78)';
    ctx.beginPath();
    ctx.moveTo(500, 145);
    ctx.lineTo(630, 205);
    ctx.lineTo(630, 315);
    ctx.lineTo(500, 365);
    ctx.lineTo(370, 315);
    ctx.lineTo(370, 205);
    ctx.closePath();
    ctx.stroke();

    // Left & right inspector columns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(86, 86, 126, 348);
    ctx.fillRect(788, 86, 150, 348);
  } else {
    // Clean code / node timeline bars
    const colors = ['#93c5fd', '#e2e8f0', '#cbd5e1', '#fcd34d', '#a5f3fc'];
    for (let row = 0; row < 14; row++) {
      ctx.fillStyle = colors[row % colors.length];
      ctx.globalAlpha = 0.55;
      ctx.fillRect(110 + (row % 3) * 28, 82 + row * 24, 140 + ((row * 67) % 380), 8);
    }
    ctx.globalAlpha = 1;
  }

  // Bottom dock bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(392, 474, 240, 22);

  return finalizeColorTexture(canvas, 1, 1);
}

/**
 * Large 85" OLED Television Ambient Gallery Artwork Display
 */
export function createTVAmbientGalleryTexture(theme: 'dune' | 'horizon' = 'dune'): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(1024, 576);

  const grad = ctx.createLinearGradient(0, 0, 1024, 576);
  if (theme === 'dune') {
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(0.45, '#44403c');
    grad.addColorStop(0.8, '#a8a29e');
    grad.addColorStop(1, '#e7e5e4');
  } else {
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#334155');
    grad.addColorStop(0.82, '#cbd5e1');
    grad.addColorStop(1, '#f1f5f9');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 576);

  // Minimalist warm architectural sun/arch silhouette (Samsung Frame / OLED Gallery Mode style)
  ctx.fillStyle = theme === 'dune' ? 'rgba(245, 238, 226, 0.22)' : 'rgba(254, 243, 199, 0.25)';
  ctx.beginPath();
  ctx.arc(680, 230, 135, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme === 'dune' ? '#292524' : '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.quadraticCurveTo(340, 310, 680, 395);
  ctx.quadraticCurveTo(870, 440, 1024, 370);
  ctx.lineTo(1024, 576);
  ctx.lineTo(0, 576);
  ctx.closePath();
  ctx.fill();

  return finalizeColorTexture(canvas, 1, 1);
}

/**
 * Minimalist Framed Wall Art Canvas Texture (Plaster / Line Art)
 */
export function createMinimalistArtTexture(variant: 1 | 2 | 3): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 640);

  ctx.fillStyle = '#f6f3ee';
  ctx.fillRect(0, 0, 512, 640);

  if (variant === 1) {
    // Sculptural warm beige & taupe arches
    ctx.fillStyle = '#e5ddd0';
    ctx.beginPath();
    ctx.arc(256, 360, 150, Math.PI, 0);
    ctx.lineTo(406, 540);
    ctx.lineTo(106, 540);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#8c7d6b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 260, 95, 0, Math.PI * 2);
    ctx.stroke();
  } else if (variant === 2) {
    // Plaster relief concentric curves
    ctx.strokeStyle = '#d6cec2';
    for (let r = 50; r <= 210; r += 26) {
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(256, 320, r, -Math.PI * 0.8, Math.PI * 0.35);
      ctx.stroke();
    }
  } else {
    // Charcoal & warm stone geometric balance
    ctx.fillStyle = '#ded6c8';
    ctx.fillRect(92, 110, 210, 290);
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.arc(315, 390, 88, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#57534e';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(120, 150, 272, 350);
  }

  return finalizeColorTexture(canvas, 1, 1);
}
