import { useActor } from "@xstate/react";
import { useContext } from "react";
import { States } from "../state";
import Deck from "./Deck";
import { GlobalStateContext } from "./GlobalStateProvider";
import OffHand from "./OffHand";
import Pile from "./Pile";
import ShownHand from "./ShownHand";
import Switcher from "./Switcher";

export default function App() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <main className="h-screen overflow-hidden bg-zinc-800">
      <div className="h-full">
        <div className="flex h-full items-center justify-center gap-12">
          {state.matches(States.choosingFaceUpCards) && <OffHand />}
          {state.matches(States.playing) && (
            <>
              <Deck />
              <Pile />
            </>
          )}
        </div>
        <div className="relative bottom-[calc(var(--card-height)*0.85)]">
          {state.matches(States.playing) && (
            <div className="absolute -top-16 mx-auto w-full">
              <Switcher />
            </div>
          )}
          <ShownHand />
        </div>
      </div>
    </main>
  );
}
