import { useSnapshot } from "valtio";
import Hand from "./Hand";
import { StateKind } from "./lib";
import OffHand from "./OffHand";
import { store } from "./store";
import Switcher from "./Switcher";

export default function Player() {
  const snap = useSnapshot(store);

  return (
    <div className="flex flex-col gap-8 pb-10">
      {snap.game.state.kind === StateKind.ChoosingOffHandFaceUpCards && (
        <OffHand />
      )}

      {snap.game.state.kind === StateKind.ChoosingOffHandFaceUpCards ||
      (snap.game.state.kind === StateKind.Playing &&
        snap.shownHand === "hand") ? (
        <Hand />
      ) : (
        <OffHand />
      )}

      {snap.game.state.kind === StateKind.Playing && <Switcher />}
    </div>
  );
}
