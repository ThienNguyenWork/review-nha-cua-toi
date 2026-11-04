import * as THREE from 'three';
import {
  createBoucleFabricTexture,
  createCalacattaMarbleTexture,
  createFineOakVeneerTexture,
  createLightOakPlankTextures,
  createMinimalistArtTexture,
  createMonitorScreenTexture,
  createRugTexture,
  createTravertineTexture,
  createTVAmbientGalleryTexture,
} from './proceduralTextures';
import { isSoftwareGl } from './webglDetect';

export interface ApartmentMaterialLibrary {
  // Architectural surfaces
  pureWhiteWall: THREE.MeshStandardMaterial;
  warmWhiteWall: THREE.MeshStandardMaterial;
  ceilingMatte: THREE.MeshStandardMaterial;
  oakFloor: THREE.MeshStandardMaterial;
  oakVeneer: THREE.MeshStandardMaterial;
  darkWalnutAccent: THREE.MeshStandardMaterial;
  calacattaMarble: THREE.MeshPhysicalMaterial;
  travertineStone: THREE.MeshStandardMaterial;
  balconyTravertine: THREE.MeshStandardMaterial;

  // Furniture finishes
  matteWhiteLacquer: THREE.MeshPhysicalMaterial;
  satinWhiteAluminum: THREE.MeshStandardMaterial;
  brushedSteel: THREE.MeshStandardMaterial;
  champagneBrass: THREE.MeshStandardMaterial;
  matteBlackMetal: THREE.MeshStandardMaterial;
  chromeMetal: THREE.MeshStandardMaterial;

  // Textiles
  ivoryBoucle: THREE.MeshStandardMaterial;
  warmBeigeFabric: THREE.MeshStandardMaterial;
  crispWhiteLinen: THREE.MeshStandardMaterial;
  lightGrayFelt: THREE.MeshStandardMaterial;
  sheerCurtain: THREE.MeshStandardMaterial;
  livingRug: THREE.MeshStandardMaterial;
  bedroomRug: THREE.MeshStandardMaterial;

  // Glass & Electronics
  architecturalGlass: THREE.MeshPhysicalMaterial;
  temperedCaseGlass: THREE.MeshPhysicalMaterial;
  frostedFlutedGlass: THREE.MeshPhysicalMaterial;
  blackCeramicGlass: THREE.MeshPhysicalMaterial;
  pcScreenPrimary: THREE.MeshStandardMaterial;
  pcScreenSecondary: THREE.MeshStandardMaterial;
  tvScreenStudio: THREE.MeshStandardMaterial;
  tvScreenLiving: THREE.MeshStandardMaterial;

  // Botanicals & Lighting
  foliageOlive: THREE.MeshStandardMaterial;
  foliageDeepGreen: THREE.MeshStandardMaterial;
  soilDark: THREE.MeshStandardMaterial;
  warmLedEmissive: THREE.MeshStandardMaterial;
  coolRgbIceEmissive: THREE.MeshStandardMaterial;
  softVioletRgbEmissive: THREE.MeshStandardMaterial;

  // Framed Artwork
  artCanvas1: THREE.MeshStandardMaterial;
  artCanvas2: THREE.MeshStandardMaterial;
  artCanvas3: THREE.MeshStandardMaterial;
}

let cachedLibrary: ApartmentMaterialLibrary | null = null;

export function getApartmentMaterials(): ApartmentMaterialLibrary {
  if (cachedLibrary) return cachedLibrary;

  const oakPlanks = createLightOakPlankTextures(7, 5);
  const fineOak = createFineOakVeneerTexture(1, 1);
  const marbleTex = createCalacattaMarbleTexture(1.5, 1.5);
  const travertineWallTex = createTravertineTexture(2, 2, false);
  const travertineFloorTex = createTravertineTexture(5, 2, true);
  const ivoryBoucleTex = createBoucleFabricTexture('#f5f2ec', '#e5dfd4', 8, 8);
  const beigeBoucleTex = createBoucleFabricTexture('#e6ddd0', '#d2c6b4', 6, 6);
  const whiteLinenTex = createBoucleFabricTexture('#fbfaf8', '#efede8', 10, 10);
  const livingRugTex = createRugTexture('#f0ebe3', '#ddd5c7');
  const bedroomRugTex = createRugTexture('#f5f2ed', '#e4ded4');

  const pcTex1 = createMonitorScreenTexture('primary');
  const pcTex2 = createMonitorScreenTexture('secondary');
  const tvStudioTex = createTVAmbientGalleryTexture('horizon');
  const tvLivingTex = createTVAmbientGalleryTexture('dune');

  const art1 = createMinimalistArtTexture(1);
  const art2 = createMinimalistArtTexture(2);
  const art3 = createMinimalistArtTexture(3);

  cachedLibrary = {
    pureWhiteWall: new THREE.MeshStandardMaterial({
      color: '#f8f8f6',
      roughness: 0.86,
      metalness: 0.0,
    }),
    warmWhiteWall: new THREE.MeshStandardMaterial({
      color: '#f2efe9',
      roughness: 0.84,
      metalness: 0.0,
    }),
    ceilingMatte: new THREE.MeshStandardMaterial({
      color: '#fcfcfb',
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.FrontSide, // Enables clean bird's-eye architectural cutaway from above Y = 3.1m
    }),
    oakFloor: new THREE.MeshStandardMaterial({
      map: oakPlanks.map,
      roughnessMap: oakPlanks.roughnessMap,
      roughness: 0.52,
      metalness: 0.02,
      envMapIntensity: 0.75,
    }),
    oakVeneer: new THREE.MeshStandardMaterial({
      map: fineOak,
      roughness: 0.48,
      metalness: 0.03,
      envMapIntensity: 0.7,
    }),
    darkWalnutAccent: new THREE.MeshStandardMaterial({
      color: '#5c4938',
      roughness: 0.45,
      metalness: 0.05,
    }),
    calacattaMarble: new THREE.MeshPhysicalMaterial({
      map: marbleTex,
      roughness: 0.16,
      metalness: 0.02,
      clearcoat: isSoftwareGl ? 0 : 0.65,
      clearcoatRoughness: 0.14,
      envMapIntensity: 1.0,
    }),
    travertineStone: new THREE.MeshStandardMaterial({
      map: travertineWallTex,
      roughness: 0.68,
      metalness: 0.02,
    }),
    balconyTravertine: new THREE.MeshStandardMaterial({
      map: travertineFloorTex,
      roughness: 0.65,
      metalness: 0.02,
    }),

    matteWhiteLacquer: new THREE.MeshPhysicalMaterial({
      color: '#f9f9fb',
      roughness: 0.24,
      metalness: 0.03,
      clearcoat: isSoftwareGl ? 0 : 0.35,
      clearcoatRoughness: 0.22,
      envMapIntensity: 0.9,
    }),
    satinWhiteAluminum: new THREE.MeshStandardMaterial({
      color: '#f3f4f6',
      roughness: 0.28,
      metalness: 0.55,
      envMapIntensity: 1.1,
    }),
    brushedSteel: new THREE.MeshStandardMaterial({
      color: '#d4d7dc',
      roughness: 0.24,
      metalness: 0.88,
      envMapIntensity: 1.25,
    }),
    champagneBrass: new THREE.MeshStandardMaterial({
      color: '#cbb28c',
      roughness: 0.26,
      metalness: 0.85,
      envMapIntensity: 1.2,
    }),
    matteBlackMetal: new THREE.MeshStandardMaterial({
      color: '#1e1f22',
      roughness: 0.38,
      metalness: 0.72,
    }),
    chromeMetal: new THREE.MeshStandardMaterial({
      color: '#eef2f6',
      roughness: 0.08,
      metalness: 0.96,
      envMapIntensity: 1.4,
    }),

    ivoryBoucle: new THREE.MeshStandardMaterial({
      map: ivoryBoucleTex,
      roughness: 0.88,
      metalness: 0.0,
    }),
    warmBeigeFabric: new THREE.MeshStandardMaterial({
      map: beigeBoucleTex,
      roughness: 0.85,
      metalness: 0.0,
    }),
    crispWhiteLinen: new THREE.MeshStandardMaterial({
      map: whiteLinenTex,
      roughness: 0.82,
      metalness: 0.0,
    }),
    lightGrayFelt: new THREE.MeshStandardMaterial({
      color: '#dcdfe4',
      roughness: 0.92,
      metalness: 0.0,
    }),
    sheerCurtain: new THREE.MeshStandardMaterial({
      color: '#faf8f5',
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    livingRug: new THREE.MeshStandardMaterial({
      map: livingRugTex,
      roughness: 0.94,
      metalness: 0.0,
    }),
    bedroomRug: new THREE.MeshStandardMaterial({
      map: bedroomRugTex,
      roughness: 0.93,
      metalness: 0.0,
    }),

    architecturalGlass: new THREE.MeshPhysicalMaterial({
      color: '#e8f1f5',
      roughness: 0.05,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.22 : 1.0,
      ior: 1.52,
      thickness: 0.08,
      envMapIntensity: 1.35,
      depthWrite: false,
    }),
    temperedCaseGlass: new THREE.MeshPhysicalMaterial({
      color: '#eef6ff',
      roughness: 0.04,
      metalness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.24 : 1.0,
      ior: 1.5,
      thickness: 0.04,
      envMapIntensity: 1.4,
      depthWrite: false,
    }),
    frostedFlutedGlass: new THREE.MeshPhysicalMaterial({
      color: '#eef2f5',
      roughness: 0.34,
      metalness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.68,
      transparent: true,
      opacity: isSoftwareGl ? 0.58 : 1.0,
      ior: 1.48,
      thickness: 0.06,
      depthWrite: false,
    }),
    blackCeramicGlass: new THREE.MeshPhysicalMaterial({
      color: '#111317',
      roughness: 0.08,
      metalness: 0.15,
      clearcoat: isSoftwareGl ? 0 : 0.9,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.3,
    }),
    pcScreenPrimary: new THREE.MeshStandardMaterial({
      map: pcTex1,
      emissiveMap: pcTex1,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.62,
      roughness: 0.18,
      metalness: 0.05,
    }),
    pcScreenSecondary: new THREE.MeshStandardMaterial({
      map: pcTex2,
      emissiveMap: pcTex2,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.55,
      roughness: 0.18,
      metalness: 0.05,
    }),
    tvScreenStudio: new THREE.MeshStandardMaterial({
      map: tvStudioTex,
      emissiveMap: tvStudioTex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.08,
    }),
    tvScreenLiving: new THREE.MeshStandardMaterial({
      map: tvLivingTex,
      emissiveMap: tvLivingTex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.08,
    }),

    foliageOlive: new THREE.MeshStandardMaterial({
      color: '#6b7f63',
      roughness: 0.68,
      metalness: 0.02,
    }),
    foliageDeepGreen: new THREE.MeshStandardMaterial({
      color: '#435d3e',
      roughness: 0.6,
      metalness: 0.02,
    }),
    soilDark: new THREE.MeshStandardMaterial({
      color: '#3b322b',
      roughness: 0.95,
      metalness: 0.0,
    }),
    warmLedEmissive: new THREE.MeshStandardMaterial({
      color: '#fff6e5',
      emissive: new THREE.Color('#ffdfad'),
      emissiveIntensity: 1.85,
      roughness: 0.25,
    }),
    coolRgbIceEmissive: new THREE.MeshStandardMaterial({
      color: '#e0f7ff',
      emissive: new THREE.Color('#7dd3fc'),
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
    softVioletRgbEmissive: new THREE.MeshStandardMaterial({
      color: '#f3e8ff',
      emissive: new THREE.Color('#c4b5fd'),
      emissiveIntensity: 1.9,
      roughness: 0.2,
    }),

    artCanvas1: new THREE.MeshStandardMaterial({
      map: art1,
      roughness: 0.78,
      metalness: 0.0,
    }),
    artCanvas2: new THREE.MeshStandardMaterial({
      map: art2,
      roughness: 0.78,
      metalness: 0.0,
    }),
    artCanvas3: new THREE.MeshStandardMaterial({
      map: art3,
      roughness: 0.78,
      metalness: 0.0,
    }),
  };

  return cachedLibrary;
}
