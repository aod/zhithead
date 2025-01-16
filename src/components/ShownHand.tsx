import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import * as selectors from "../state/selectors";
import { GlobalStateContext } from "./providers/GlobalStateProvider";
import { canPlay } from "../lib";
import { Player } from "../state/machines/zhithead.machine";

import Hand from "./ui/Hand";
import OffHand from "./ui/OffHand";

interface ShownHandProps {
  player: Player;
}

export default function ShownHand(props: ShownHandProps) {
  const isPlaying = GlobalStateContext.useSelector(selectors.isPlaying);
  const isChoosingFaceUpCards = GlobalStateContext.useSelector(
    selectors.isChoosingFaceUpCards
  );
  const shownHand = GlobalStateContext.useSelector(
    selectors.getShownHand(props.player)
  );
  const hand = GlobalStateContext.useSelector(selectors.getHand(props.player));
  const offHand = GlobalStateContext.useSelector(
    selectors.getOffHand(props.player)
  );
  const pile = GlobalStateContext.useSelector(selectors.getPile);
  const human = GlobalStateContext.useSelector(selectors.getHumanActor);
  const flipped = props.player === "bot";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={shownHand}
        className={clsx(
          "absolute h-card-height w-full",
          shownHand === "hand" && (flipped ? "-top-5" : "-bottom-2.5"),
          shownHand === "offhand" && (flipped ? "top-20" : "bottom-20")
        )}
      >
        {shownHand === "hand" && (
          <Hand
            enablePlaySameRanks={props.player === "human" && isPlaying}
            hand={hand}
            onCardClick={(card, _, n) => {
              if (props.player === "human") {
                human?.send({ type: "CHOOSE_CARD", card, n });
              }
            }}
            grayOut={
              props.player === "bot"
                ? undefined
                : (card) => !canPlay(card, pile)
            }
            flipped={flipped}
            hideCards={props.player === "bot"}
          />
        )}
        {shownHand === "offhand" && (
          <OffHand
            disable={props.player === "human" && isChoosingFaceUpCards}
            flipped={flipped}
            offHand={offHand}
            onCardPositionedClick={(card, _, n) => {
              if (props.player === "human") {
                human?.send({ type: "CHOOSE_CARD", card, n });
              }
            }}
            grayOutFaceUpCard={(card) => !!hand.length || !canPlay(card, pile)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
