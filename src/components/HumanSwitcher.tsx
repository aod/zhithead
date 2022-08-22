import { createElement, useContext } from "react";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "./GlobalStateProvider";
import SwitcherView from "./Switcher.view";

export default function HumanSwitcher() {
  const { zhitheadService } = useContext(GlobalStateContext);

  const hand = useSelector(
    zhitheadService,
    (state) => state.context.human.hand
  );
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.human.offHand
  );
  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand.human
  );

  const { send } = zhitheadService;

  return createElement(SwitcherView, {
    handCount: hand.length,
    offHandCount: offHand.faceDown.length + offHand.faceUp.length,
    shownHand: shownHand,
    onSwitch: (shownHand) =>
      send({ type: "SET_SHOWN_HAND", shownHand, player: "human" }),
  });
}
