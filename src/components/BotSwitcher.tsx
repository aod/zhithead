import { createElement, useContext } from "react";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "./GlobalStateProvider";
import SwitcherView from "./Switcher.view";

export default function BotSwitcher() {
  const { zhitheadService } = useContext(GlobalStateContext);

  const hand = useSelector(zhitheadService, (state) => state.context.bot.hand);
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.bot.offHand
  );
  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand.bot
  );

  const { send } = zhitheadService;

  return createElement(SwitcherView, {
    handCount: hand.length,
    offHandCount: offHand.faceDown.length + offHand.faceUp.length,
    shownHand: shownHand,
    onSwitch: (shownHand) =>
      send({ type: "SET_SHOWN_HAND", shownHand, player: "bot" }),
    flipped: true,
  });
}
