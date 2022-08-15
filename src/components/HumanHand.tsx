import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import HandView from "./Hand.view";

export default function HumanHand() {
  const globalServices = useContext(GlobalStateContext);
  const hand = useSelector(
    globalServices.zhitheadService,
    (state) => state.context.human.hand
  );
  const { send } = globalServices.zhitheadService;

  return createElement(HandView, {
    hand,
    onCardClick: (index) => send({ type: "PLAY_CARD", index }),
  });
}
