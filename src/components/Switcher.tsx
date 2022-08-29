import { createElement, useContext } from "react";
import { useSelector } from "@xstate/react";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import UISwitcher from "./ui/Switcher";
import { offHandLen } from "../lib";
import { Player } from "../state/machines/zhithead.machine";

interface SwitcherProps {
  player: Player;
}

export default function Switcher(props: SwitcherProps) {
  const { zhitheadService } = useContext(GlobalStateContext);

  const hand = useSelector(
    zhitheadService,
    (state) => state.context[props.player].hand
  );
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context[props.player].offHand
  );
  const shownHand = useSelector(
    zhitheadService,
    (state) => state.context.shownHand[props.player]
  );

  const { send } = zhitheadService;

  return createElement(UISwitcher, {
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
        player: props.player,
      }),
    position: props.player === "human" ? "bottom" : "top",
  });
}
