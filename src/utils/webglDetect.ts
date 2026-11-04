import { QualityLevel } from '../types/apartment';

export const isSoftwareGl: boolean = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

export interface QualityConfig {
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  antialias: boolean;
  enableTransmission: boolean;
  enableAreaLights: boolean;
  envIntensityMultiplier: number;
}

export function getQualityConfig(level: QualityLevel): QualityConfig {
  if (isSoftwareGl) {
    // Respect software WebGL budget while keeping identical scene geometry and lighting balance
    return {
      dpr: [1, 1],
      shadows: false,
      shadowMapSize: 512,
      antialias: false,
      enableTransmission: false,
      enableAreaLights: false,
      envIntensityMultiplier: 1.0,
    };
  }

  switch (level) {
    case QualityLevel.Low:
      return {
        dpr: [0.85, 1.0],
        shadows: false,
        shadowMapSize: 512,
        antialias: false,
        enableTransmission: false,
        enableAreaLights: false,
        envIntensityMultiplier: 0.95,
      };
    case QualityLevel.Medium:
      return {
        dpr: [1, 1.25],
        shadows: true,
        shadowMapSize: 1024,
        antialias: true,
        enableTransmission: false,
        enableAreaLights: false,
        envIntensityMultiplier: 1.0,
      };
    case QualityLevel.High:
      return {
        dpr: [1, 1.75],
        shadows: true,
        shadowMapSize: 2048,
        antialias: true,
        enableTransmission: true,
        enableAreaLights: true,
        envIntensityMultiplier: 1.05,
      };
    case QualityLevel.Ultra:
      return {
        dpr: [1.25, 2.0],
        shadows: true,
        shadowMapSize: 4096,
        antialias: true,
        enableTransmission: true,
        enableAreaLights: true,
        envIntensityMultiplier: 1.12,
      };
  }
}
