import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';

interface LoadingScreenProps {
  sceneReady: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ sceneReady }) => {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(18);

  useEffect(() => {
    if (!sceneReady) {
      const id = window.setInterval(() => {
        setDisplayProgress((prev) => Math.min(92, prev + 14));
      }, 90);
      return () => window.clearInterval(id);
    }

    if (!active && sceneReady) {
      setDisplayProgress(100);
      const timer = window.setTimeout(() => {
        setVisible(false);
      }, 280);
      return () => window.clearTimeout(timer);
    }
  }, [active, sceneReady]);

  const effectivePct = active ? Math.max(displayProgress, Math.round(progress)) : displayProgress;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 px-6"
        >
          <div className="w-full max-w-sm space-y-5 text-center">
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-400">
                Interactive 3D Architectural Visualization
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
                Lumière Residence
              </h1>
            </div>

            {/* Clean Hairline Progress Bar */}
            <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-amber-200 transition-all duration-200"
                style={{ width: `${effectivePct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Synthesizing PBR Surfaces & Studio Lighting</span>
              <span className="font-mono tabular-nums text-zinc-200">
                {effectivePct}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
