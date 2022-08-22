import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import ShownHandView from "./ShownHand.view";

export default function HumanShownHand() {
  const { zhitheadService } = useContext(GlobalStateContext);

  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand.human
  );
  const hand = useSelector(
    zhitheadService,
    (state) => state.context.human.hand
  );
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.human.offHand
  );

  const { send } = zhitheadService;

  return createElement(ShownHandView, {
    shownHand: shownHand,
    hand: { hand, onCardClick: (index) => send({ type: "PLAY_CARD", index }) },
    offHand: { offHand },
  });
}
