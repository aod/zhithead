import { useActor } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import Hand from "./Hand";
import OffHand from "./OffHand";
import Pile from "./Pile";
import Switcher from "./Switcher";

export default function Player() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {state.matches("choosingFaceUpCards") && <OffHand />}

      {state.matches("playing") && <Pile />}

      {state.matches("choosingFaceUpCards") ||
      (state.matches("playing") && state.context.shownHand === "hand") ? (
        <Hand />
      ) : (
        <OffHand />
      )}

      {state.matches("playing") && <Switcher />}
    </div>
  );
}
