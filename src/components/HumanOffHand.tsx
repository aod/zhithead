import { useSelector } from "@xstate/react";
import { createElement, useContext } from "react";
import { isChoosingFaceUpCardsStor } from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import OffHand from "./ui/OffHand";

export default function HumanOffHand() {
  const { zhitheadService } = useContext(GlobalStateContext);
  const offHand = useSelector(
    zhitheadService,
    (state) => state.context.human.offHand
  );
  const isChoosingFaceUpCards = useSelector(
    zhitheadService,
    isChoosingFaceUpCardsStor
  );

  return createElement(OffHand, {
    offHand,
    disable: isChoosingFaceUpCards,
  });
}
