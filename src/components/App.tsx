import { useSelector } from "@xstate/react";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Deck from "./Deck";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import HumanOffHand from "./HumanOffHand";
import Pile from "./Pile";
import ShownHand from "./ShownHand";
import Switcher from "./Switcher";
import {
  isChoosingFaceUpCardsStor,
  isGameOverStor,
  isPlayingStor,
} from "../state/selectors";
import SortButton from "./SortButton";
import ResultOverlay from "./ResultOverlay";
import TitleScreenOverlay from "./TitleScreenOverlay";

export default function App() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const isPlaying = useSelector(zhitheadService, isPlayingStor);
  const isChoosingFaceUpCards = useSelector(
    zhitheadService,
    isChoosingFaceUpCardsStor
  );
  const isGameOver = useSelector(zhitheadService, isGameOverStor);

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main
      className="relative grid grid-rows-3 overflow-hidden bg-gradient-to-r from-black via-emerald-800 to-black"
      style={{ height: windowHeight }}
    >
      <AnimatePresence>
        {isGameOver && <ResultOverlay />}
        {!hasStarted && (
          <TitleScreenOverlay onPlay={() => setHasStarted(true)} />
        )}
      </AnimatePresence>

      <div className="relative">
        {(isPlaying || isGameOver) && (
          <>
            <ShownHand player="bot" />
            <AnimatePresence>
              {isPlaying && (
                <div className="absolute top-2 z-10 mx-auto w-full">
                  <Switcher player="bot" />
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {isChoosingFaceUpCards && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="m-auto"
        >
          <HumanOffHand />
        </motion.div>
      )}
      {!isChoosingFaceUpCards && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="flex h-full items-center justify-center gap-12"
        >
          <Deck />
          <Pile />
        </motion.div>
      )}

      <div className="relative pt-4">
        <AnimatePresence>
          {isPlaying && (
            <div className="absolute -left-6 bottom-2 z-10 mx-auto flex w-full items-center justify-center gap-4">
              <SortButton />
              <Switcher player="human" />
            </div>
          )}
        </AnimatePresence>
        <ShownHand player="human" />
      </div>
    </main>
  );
}
