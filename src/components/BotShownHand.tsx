import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import ShownHandView from "./ShownHand.view";

export default function BotShownHand() {
  const { zhitheadService } = useContext(GlobalStateContext);

  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand.bot
  );
  const hand = useSelector(zhitheadService, (state) => state.context.bot.hand);
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.bot.offHand
  );

  return createElement(ShownHandView, {
    shownHand: shownHand,
    hand: {
      hand,
      flipped: true,
      hideCards: true,
    },
    offHand: { offHand, flipped: true },
    flipped: true,
  });
}
