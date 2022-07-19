import { useActor } from "@xstate/react";
import { useContext } from "react";
import { States } from "../state";
import { GlobalStateContext } from "./GlobalStateProvider";
import ChoosingFaceUpCards from "./phases/ChoosingFaceUpCards";
import Playing from "./phases/Playing";

export default function App() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <main className="h-screen overflow-hidden bg-zinc-800">
      {state.matches(States.choosingFaceUpCards) && <ChoosingFaceUpCards />}
      {state.matches(States.playing) && <Playing />}
    </main>
  );
}
