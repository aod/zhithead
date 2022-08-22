import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import OffHandView from "./OffHand.view";

export default function HumanOffHand() {
  const globalServices = useContext(GlobalStateContext);
  const offHand = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.human.offHand
  );

  return createElement(OffHandView, {
    offHand,
  });
}
