import { useSelector } from "@xstate/react";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Deck from "./Deck";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import HumanOffHand from "./HumanOffHand";
import Pile from "./Pile";
import ShownHand from "./ShownHand";
import Switcher from "./Switcher";
import { isChoosingFaceUpCardsStor, isPlayingStor } from "../state/selectors";
import SortButton from "./SortButton";

export default function App() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const isPlaying = useSelector(zhitheadService, isPlayingStor);
  const isChoosingFaceUpCards = useSelector(
    zhitheadService,
    isChoosingFaceUpCardsStor
  );

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main
      className="grid grid-rows-3 overflow-hidden bg-zinc-800"
      style={{ height: windowHeight }}
    >
      <div className="relative">
        {isPlaying && (
          <>
            <ShownHand player="bot" />
            <div className="absolute top-2 z-10 mx-auto w-full">
              <Switcher player="bot" />
            </div>
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
      {isPlaying && (
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
        {isPlaying && (
          <div className="absolute -left-6 bottom-2 z-10 mx-auto flex w-full items-center justify-center gap-4">
            <SortButton />
            <Switcher player="human" />
          </div>
        )}
        <ShownHand player="human" />
      </div>
    </main>
  );
}
