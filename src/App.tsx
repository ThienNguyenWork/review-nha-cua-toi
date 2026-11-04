import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ApartmentScene } from './components/apartment/ApartmentScene';
import { CameraController, CameraTelemetry } from './components/camera/CameraController';
import { CutawayPanel } from './components/ui/CutawayPanel';
import { FloorPlanMinimap } from './components/ui/FloorPlanMinimap';
import { KeyboardGuide } from './components/ui/KeyboardGuide';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { NavigationPanel } from './components/ui/NavigationPanel';
import { InspectionAngle, ObjectInformation } from './components/ui/ObjectInformation';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { TopBar } from './components/ui/TopBar';
import { DOLLHOUSE_CAMERA, getRoomById, ROOM_DESTINATIONS } from './data/rooms';
import {
  CameraMode,
  CameraTransitionRequest,
  CutawayConfig,
  FurnitureItemInfo,
  LightingMood,
  QualityLevel,
  RoomId,
  ViewExperience,
} from './types/apartment';
import { getQualityConfig, isSoftwareGl } from './utils/webglDetect';

const FULL_ARCHITECTURE: CutawayConfig = {
  showCeiling: true,
  showExteriorWalls: true,
  showInteriorWalls: true,
};

export default function App() {
  const [activeRoom, setActiveRoom] = useState<RoomId>('studio');
  const [cameraMode, setCameraMode] = useState<CameraMode>(CameraMode.FreeFly);
  const [viewExperience, setViewExperience] = useState<ViewExperience>('interior');
  const [cutaway, setCutaway] = useState<CutawayConfig>(FULL_ARCHITECTURE);
  const [showCutawayPanel, setShowCutawayPanel] = useState(false);

  const [quality, setQuality] = useState<QualityLevel>(QualityLevel.High);
  const [lightingMood, setLightingMood] = useState<LightingMood>('daylight');

  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItemInfo | null>(null);
  const [orbitTarget, setOrbitTarget] = useState<[number, number, number]>([-6.35, 1.18, -3.85]);
  const [transition, setTransition] = useState<CameraTransitionRequest | null>(null);

  const [uiHidden, setUiHidden] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [collisionEnabled, setCollisionEnabled] = useState(true);
  const [allowSpaceFlyUp, setAllowSpaceFlyUp] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const transitionCounter = useRef(1);
  const telemetryRef = useRef<CameraTelemetry>({
    x: -3.25,
    y: 2.05,
    z: -0.85,
    yaw: -2.4,
  });

  const qConfig = useMemo(() => getQualityConfig(quality), [quality]);

  // Navigate smoothly to any of the 7 room destinations
  const handleSelectRoom = useCallback(
    (roomId: RoomId, overrideMode?: CameraMode) => {
      const dest = getRoomById(roomId);
      setActiveRoom(roomId);
      setSelectedFurniture(null);

      // Selecting Full Apartment Overview gives elevated architectural framing;
      // Selecting any specific room enters Interior View with full walls restored (unless user is explicitly in Cutaway)
      if (roomId === 'overview') {
        setViewExperience('dollhouse');
        setShowCutawayPanel(false);
        const targetMode = CameraMode.Orbit;
        setCameraMode(targetMode);
        setOrbitTarget(dest.cameraTarget);
        transitionCounter.current += 1;
        setTransition({
          id: transitionCounter.current,
          position: dest.cameraPosition,
          target: dest.cameraTarget,
          switchMode: targetMode,
        });
        return;
      }

      if (viewExperience === 'dollhouse') {
        setViewExperience('interior');
      }

      const effectiveMode =
        overrideMode ??
        (cameraMode === CameraMode.Orbit ? CameraMode.FreeFly : cameraMode);

      if (effectiveMode !== cameraMode) {
        setCameraMode(effectiveMode);
      }

      const pos =
        effectiveMode === CameraMode.Walk ? dest.walkPosition : dest.cameraPosition;
      const tgt =
        effectiveMode === CameraMode.Walk ? dest.walkTarget : dest.cameraTarget;

      setOrbitTarget(tgt);
      transitionCounter.current += 1;
      setTransition({
        id: transitionCounter.current,
        position: pos,
        target: tgt,
        switchMode: effectiveMode,
      });
    },
    [cameraMode, viewExperience],
  );

  // Switch between Special Viewing Experiences: Interior | Dollhouse | Cutaway
  const handleChangeViewExperience = useCallback(
    (nextView: ViewExperience) => {
      if (nextView === 'interior') {
        setViewExperience('interior');
        setCutaway(FULL_ARCHITECTURE);
        setShowCutawayPanel(false);
        const indoorRoom: RoomId = activeRoom === 'overview' ? 'living' : activeRoom;
        const dest = getRoomById(indoorRoom);
        setActiveRoom(indoorRoom);
        const nextMode =
          cameraMode === CameraMode.Orbit ? CameraMode.FreeFly : cameraMode;
        setCameraMode(nextMode);
        const pos =
          nextMode === CameraMode.Walk ? dest.walkPosition : dest.cameraPosition;
        const tgt =
          nextMode === CameraMode.Walk ? dest.walkTarget : dest.cameraTarget;
        setOrbitTarget(tgt);
        transitionCounter.current += 1;
        setTransition({
          id: transitionCounter.current,
          position: pos,
          target: tgt,
          switchMode: nextMode,
        });
        return;
      }

      if (nextView === 'dollhouse') {
        setViewExperience('dollhouse');
        setShowCutawayPanel(false);
        setSelectedFurniture(null);
        setCameraMode(CameraMode.Orbit);
        setOrbitTarget(DOLLHOUSE_CAMERA.target);
        transitionCounter.current += 1;
        setTransition({
          id: transitionCounter.current,
          position: DOLLHOUSE_CAMERA.position,
          target: DOLLHOUSE_CAMERA.target,
          switchMode: CameraMode.Orbit,
        });
        return;
      }

      // Cutaway View: toggle popover if already in Cutaway, otherwise enter Cutaway cleanly
      if (viewExperience === 'cutaway') {
        setShowCutawayPanel((prev) => !prev);
        return;
      }

      setViewExperience('cutaway');
      setShowCutawayPanel(true);
      setCutaway((prev) => {
        if (prev.showCeiling && prev.showExteriorWalls && prev.showInteriorWalls) {
          return {
            showCeiling: false,
            showExteriorWalls: false,
            showInteriorWalls: true,
          };
        }
        return prev;
      });
      setCameraMode(CameraMode.Orbit);
      const cutTarget: [number, number, number] = [0.0, 0.7, 0.0];
      const cutPos: [number, number, number] = [10.8, 9.2, 12.6];
      setOrbitTarget(cutTarget);
      transitionCounter.current += 1;
      setTransition({
        id: transitionCounter.current,
        position: cutPos,
        target: cutTarget,
        switchMode: CameraMode.Orbit,
      });
    },
    [activeRoom, cameraMode, viewExperience],
  );

  const handleRestoreFullArchitecture = useCallback(() => {
    setCutaway(FULL_ARCHITECTURE);
  }, []);

  // Switch camera mode with smart target calibration
  const handleChangeCameraMode = useCallback(
    (nextMode: CameraMode) => {
      setCameraMode(nextMode);
      if (nextMode === CameraMode.Walk) {
        setViewExperience('interior');
        setCutaway(FULL_ARCHITECTURE);
        setShowCutawayPanel(false);
        const walkRoom: RoomId = activeRoom === 'overview' ? 'living' : activeRoom;
        handleSelectRoom(walkRoom, CameraMode.Walk);
      } else if (nextMode === CameraMode.Orbit) {
        if (selectedFurniture) {
          setOrbitTarget(selectedFurniture.focusTarget);
        } else {
          const room = getRoomById(activeRoom);
          setOrbitTarget(room.cameraTarget);
        }
      }
    },
    [activeRoom, handleSelectRoom, selectedFurniture],
  );

  // Reset camera smoothly to active room's calibrated framing
  const handleResetCamera = useCallback(() => {
    setSelectedFurniture(null);
    if (viewExperience === 'dollhouse') {
      handleChangeViewExperience('dollhouse');
    } else {
      handleSelectRoom(activeRoom);
    }
  }, [activeRoom, handleChangeViewExperience, handleSelectRoom, viewExperience]);

  // Mode C — Orbit / Object Inspection: smoothly move camera toward clicked object and focus Orbit on it
  const focusCameraOnFurniture = useCallback(
    (item: FurnitureItemInfo, angle: InspectionAngle = 'default') => {
      setSelectedFurniture(item);
      setActiveRoom(item.room);
      if (viewExperience === 'dollhouse') {
        setViewExperience('interior');
      }
      setCameraMode(CameraMode.Orbit);
      setOrbitTarget(item.focusTarget);

      const ox = item.orbitOffset[0];
      const oy = item.orbitOffset[1];
      const oz = item.orbitOffset[2];
      const horizDist = Math.max(0.75, Math.hypot(ox, oz));
      const signZ = oz >= 0 ? 1 : -1;
      const signX = ox >= 0 ? 1 : -1;

      let offset: [number, number, number] = [ox, oy, oz];
      if (angle === 'front') {
        if (Math.abs(oz) >= Math.abs(ox)) {
          offset = [0, Math.max(0.18, oy * 0.65), signZ * horizDist * 0.92];
        } else {
          offset = [signX * horizDist * 0.92, Math.max(0.18, oy * 0.65), 0];
        }
      } else if (angle === 'side') {
        if (Math.abs(oz) >= Math.abs(ox)) {
          offset = [
            (signX || 1) * horizDist * 0.95,
            Math.max(0.2, oy * 0.7),
            signZ * horizDist * 0.25,
          ];
        } else {
          offset = [
            signX * horizDist * 0.25,
            Math.max(0.2, oy * 0.7),
            (signZ || 1) * horizDist * 0.95,
          ];
        }
      } else if (angle === 'top') {
        offset = [
          ox * 0.35,
          Math.min(1.65, Math.max(0.95, horizDist * 0.85)),
          oz * 0.35,
        ];
      }

      const camPos: [number, number, number] = [
        item.focusTarget[0] + offset[0],
        item.focusTarget[1] + offset[1],
        item.focusTarget[2] + offset[2],
      ];

      transitionCounter.current += 1;
      setTransition({
        id: transitionCounter.current,
        position: camPos,
        target: item.focusTarget,
        switchMode: CameraMode.Orbit,
      });
    },
    [viewExperience],
  );

  const handleSelectFurniture = useCallback(
    (item: FurnitureItemInfo | null) => {
      if (!item) {
        setSelectedFurniture(null);
        return;
      }
      focusCameraOnFurniture(item, 'default');
    },
    [focusCameraOnFurniture],
  );

  const handleReturnFromObject = useCallback(() => {
    const roomToRestore = selectedFurniture?.room ?? activeRoom;
    setSelectedFurniture(null);
    handleSelectRoom(roomToRestore, CameraMode.FreeFly);
  }, [activeRoom, handleSelectRoom, selectedFurniture]);

  const handleTransitionComplete = useCallback((nextMode?: CameraMode) => {
    if (nextMode) {
      setCameraMode(nextMode);
    }
  }, []);

  // Fullscreen toggle with safe iframe fallback
  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setUiHidden((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Global keyboard shortcuts (1-7 rooms, H hide UI, R reset view, M minimap, Escape close)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key >= '1' && e.key <= '7') {
        const idx = Number(e.key) - 1;
        const targetRoom = ROOM_DESTINATIONS[idx];
        if (targetRoom) {
          handleSelectRoom(targetRoom.id);
        }
      } else if (e.code === 'KeyH') {
        setUiHidden((prev) => !prev);
      } else if (e.code === 'KeyR') {
        handleResetCamera();
      } else if (e.code === 'KeyM') {
        setShowMinimap((prev) => !prev);
      } else if (e.code === 'Escape') {
        setSelectedFurniture(null);
        setShowSettings(false);
        setShowCutawayPanel(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleResetCamera, handleSelectRoom]);

  const currentRoomObj = getRoomById(activeRoom);

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950">
      <LoadingScreen sceneReady={sceneReady} />

      {/* Isolated Full-Viewport 3D WebGL Canvas */}
      <div className="absolute inset-0 w-full h-full">
        {contextLost ? (
          <div className="flex flex-col items-center justify-center w-full h-full bg-zinc-950 text-zinc-200 p-6 text-center">
            <h2 className="font-display text-lg font-semibold mb-2">
              WebGL Context Paused
            </h2>
            <p className="text-xs text-zinc-400 max-w-md mb-4">
              Graphics hardware context was interrupted. Click below to reinitialize the 3D apartment scene.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-amber-200 text-zinc-950 text-xs font-semibold cursor-pointer"
            >
              Reload 3D Viewport
            </button>
          </div>
        ) : (
          <Canvas
            shadows={qConfig.shadows}
            dpr={qConfig.dpr}
            camera={{
              fov: 54,
              near: 0.08,
              far: 180,
              position: [-3.25, 2.05, -0.85],
            }}
            gl={{
              antialias: qConfig.antialias,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.06,
            }}
            onCreated={({ gl, camera }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              if (qConfig.shadows && !isSoftwareGl) {
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
              }
              camera.lookAt(-6.35, 1.18, -3.85);

              const canvasEl = gl.domElement;
              canvasEl.addEventListener('webglcontextlost', (ev) => {
                ev.preventDefault();
                setContextLost(true);
              });
              canvasEl.addEventListener('webglcontextrestored', () => {
                setContextLost(false);
              });

              setSceneReady(true);
            }}
          >
            <CameraController
              mode={cameraMode}
              transition={transition}
              orbitTarget={orbitTarget}
              collisionEnabled={collisionEnabled}
              allowSpaceFlyUp={allowSpaceFlyUp}
              telemetryRef={telemetryRef}
              onTransitionComplete={handleTransitionComplete}
            />

            <ApartmentScene
              quality={quality}
              lightingMood={lightingMood}
              viewExperience={viewExperience}
              cutaway={cutaway}
              selectedId={selectedFurniture?.id ?? null}
              onSelectFurniture={handleSelectFurniture}
              onFocusFurniture={(item) => focusCameraOnFurniture(item, 'default')}
              onSelectRoomFromDollhouse={(roomId) => handleSelectRoom(roomId)}
            />
          </Canvas>
        )}
      </div>

      {/* Semantic Architectural UI Overlay Layer */}
      <TopBar
        activeRoom={activeRoom}
        onSelectRoom={(r) => handleSelectRoom(r)}
        uiHidden={uiHidden}
        onToggleUiHidden={() => setUiHidden((prev) => !prev)}
      />

      {!uiHidden && (
        <>
          {/* Subtle Top-Right Active Room Architectural Context Label */}
          <div className="fixed top-17 right-6 z-20 hidden lg:flex flex-col items-end pointer-events-none text-right">
            <div className="flex items-center gap-1.5 text-xs text-zinc-900 bg-white/88 px-3 py-1.5 rounded-lg border border-black/8 shadow-sm">
              <span className="font-semibold">
                {viewExperience === 'dollhouse'
                  ? 'Dollhouse Overview'
                  : viewExperience === 'cutaway'
                    ? 'Cutaway Inspection'
                    : currentRoomObj.label}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {viewExperience === 'dollhouse' ? '234.0' : currentRoomObj.areaSqm} m²
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-600">
                {viewExperience === 'dollhouse'
                  ? 'Click any room pin to dive inside'
                  : currentRoomObj.subtitle}
              </span>
            </div>
          </div>

          <FloorPlanMinimap
            open={showMinimap}
            activeRoom={activeRoom}
            telemetryRef={telemetryRef}
            onSelectRoom={(r) => handleSelectRoom(r)}
            onClose={() => setShowMinimap(false)}
          />

          <KeyboardGuide
            open={showGuide && !dockCollapsed}
            mode={cameraMode}
            onClose={() => setShowGuide(false)}
          />

          <CutawayPanel
            open={showCutawayPanel && viewExperience === 'cutaway'}
            cutaway={cutaway}
            onChangeCutaway={setCutaway}
            onRestoreFull={handleRestoreFullArchitecture}
            onClose={() => setShowCutawayPanel(false)}
          />

          <SettingsPanel
            open={showSettings}
            onClose={() => setShowSettings(false)}
            quality={quality}
            onChangeQuality={setQuality}
            lightingMood={lightingMood}
            onChangeLightingMood={setLightingMood}
            collisionEnabled={collisionEnabled}
            onToggleCollision={() => setCollisionEnabled((prev) => !prev)}
            allowSpaceFlyUp={allowSpaceFlyUp}
            onToggleAllowSpaceFlyUp={() => setAllowSpaceFlyUp((prev) => !prev)}
          />

          <ObjectInformation
            item={selectedFurniture}
            onClose={() => setSelectedFurniture(null)}
            onReturnToRoom={handleReturnFromObject}
            onInspectAngle={focusCameraOnFurniture}
          />

          <NavigationPanel
            activeRoom={activeRoom}
            onSelectRoom={(r) => handleSelectRoom(r)}
            cameraMode={cameraMode}
            onChangeCameraMode={handleChangeCameraMode}
            viewExperience={viewExperience}
            onChangeViewExperience={handleChangeViewExperience}
            onResetCamera={handleResetCamera}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            showGuide={showGuide}
            onToggleGuide={() => setShowGuide((prev) => !prev)}
            showMinimap={showMinimap}
            onToggleMinimap={() => setShowMinimap((prev) => !prev)}
            showSettings={showSettings}
            onToggleSettings={() => setShowSettings((prev) => !prev)}
            dockCollapsed={dockCollapsed}
            onToggleDockCollapsed={() => setDockCollapsed((prev) => !prev)}
          />
        </>
      )}
    </div>
  );
}
