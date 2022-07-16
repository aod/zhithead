import { useActor } from "@xstate/react";
import { useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import Hand from "./Hand";
import OffHand from "./OffHand";

export default function ShownHand() {
  const globalServices = useContext(GlobalStateContext);
  const [state] = useActor(globalServices.zhitheadService);

  return state.context.shownHand === "hand" ? <Hand /> : <OffHand />;
}
