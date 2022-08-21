import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { GlobalStateContext } from "./GlobalStateProvider";
import HandView from "./Hand.view";

export default function BotHand() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const hand = useSelector(zhitheadService, (state) => state.context.bot.hand);

  return createElement(HandView, {
    hand,
    hideCards: true,
    flipped: true,
  });
}
