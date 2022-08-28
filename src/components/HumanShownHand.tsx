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

  // TODO: Is this the correct way to access services?
  const human = useSelector(zhitheadService, (state) => state.children.human);
  const { send } = human;

  return createElement(ShownHandView, {
    shownHand: shownHand,
    hand: {
      hand,
      onCardClick: (card) => send({ type: "CHOOSE_CARD", card }),
    },
    offHand: { offHand },
  });
}
