import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import OffHand from "./ui/OffHand";

export default function HumanOffHand() {
  const globalServices = useContext(GlobalStateContext);
  const offHand = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.human.offHand
  );

  return createElement(OffHand, {
    offHand,
  });
}
