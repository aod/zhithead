import Pile from "../Pile";
import Switcher from "../Switcher";
import ShownHand from "../ShownHand";
import Deck from "../Deck";

export default function Playing() {
  return (
    <div className="flex h-full flex-col items-center justify-end gap-14 pb-10">
      <div className="flex gap-16">
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
