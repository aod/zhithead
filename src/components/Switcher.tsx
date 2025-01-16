import { createElement } from "react";

import * as selectors from "../state/selectors";
import { offHandLen } from "../lib";
import { Player } from "../state/machines/zhithead.machine";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

import UISwitcher from "./ui/Switcher";

interface SwitcherProps {
  player: Player;
}

export default function Switcher(props: SwitcherProps) {
  const hand = GlobalStateContext.useSelector(
    selectors.getPlayerHand(props.player)
  );
  const offHand = GlobalStateContext.useSelector(
    selectors.getPlayerOffHand(props.player)
  );
  const shownHand = GlobalStateContext.useSelector(
    selectors.getPlayerShownHand(props.player)
  );

  const { send } = GlobalStateContext.useActorRef();

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
