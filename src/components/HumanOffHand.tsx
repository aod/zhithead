import { createElement } from "react";

import * as selectors from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";

import OffHand from "./ui/OffHand";

export default function HumanOffHand() {
  const offHand = GlobalStateContext.useSelector(
    selectors.getPlayerOffHand("human")
  );
  const isChoosingFaceUpCards = GlobalStateContext.useSelector(
    selectors.isChoosingFaceUpCards
  );

  return createElement(OffHand, {
    offHand,
    disable: isChoosingFaceUpCards,
  });
}
