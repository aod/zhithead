import { useActor } from "@xstate/react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { States } from "../state/machines/zhithead.machine";
import Deck from "./Deck";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import HumanOffHand from "./HumanOffHand";
import Pile from "./Pile";
import ShownHand from "./ShownHand";
import Switcher from "./Switcher";

export default function App() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <main className="grid h-screen grid-rows-3 overflow-hidden bg-zinc-800">
      <div className="relative">
        {state.matches(States.playing) && (
          <>
            <ShownHand player="bot" />
            <div className="absolute top-2 z-10 mx-auto w-full">
              <Switcher player="bot" />
            </div>
          </>
        )}
      </div>

      {state.matches(States.choosingFaceUpCards) && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className="m-auto"
        >
          <HumanOffHand />
        </motion.div>
      )}
      {state.matches(States.playing) && (
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
        {state.matches(States.playing) && (
          <div className="absolute bottom-2 z-10 mx-auto w-full">
            <Switcher player="human" />
          </div>
        )}
        <ShownHand player="human" />
      </div>
    </main>
  );
}
