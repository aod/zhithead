import Pile from "../Pile";
import Switcher from "../Switcher";
import ShownHand from "../ShownHand";
import Deck from "../Deck";

export default function Playing() {
  return (
    <div className="flex h-full flex-col justify-evenly gap-14">
      <div className="flex gap-16 self-center">
        <Deck />
        <Pile />
      </div>
      <div className="space-y-14">
        <Switcher />
        <ShownHand />
      </div>
    </div>
  );
}
