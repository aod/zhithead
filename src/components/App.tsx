import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import * as selectors from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

import Deck from "./Deck";
import HumanOffHand from "./HumanOffHand";
import Pile from "./Pile";
import ShownHand from "./ShownHand";
import Switcher from "./Switcher";
import SortButton from "./SortButton";
import ResultOverlay from "./ResultOverlay";
import TitleScreenOverlay from "./TitleScreenOverlay";

export default function App() {
  const isPlaying = GlobalStateContext.useSelector(selectors.isPlaying);
  const isChoosingFaceUpCards = GlobalStateContext.useSelector(
    selectors.isChoosingFaceUpCards
  );
  const isGameOver = GlobalStateContext.useSelector(selectors.isGameOver);

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
