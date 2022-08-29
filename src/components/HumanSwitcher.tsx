import { createElement, useContext } from "react";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import Switcher from "./ui/Switcher";
import { offHandLen } from "../lib";

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

  return createElement(Switcher, {
    left: ["Hand", hand.length],
    right: [
      "Off-Hand",
      offHandLen(offHand.faceDown) + offHandLen(offHand.faceUp),
    ],
    state: shownHand === "hand" ? "left" : "right",
    onSwitch: (val) =>
      send({
        type: "SET_SHOWN_HAND",
        shownHand: val === "left" ? "hand" : "offhand",
        player: "human",
      }),
    position: "bottom",
  });
}
