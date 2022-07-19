import Pile from "../Pile";
import Switcher from "../Switcher";
import ShownHand from "../ShownHand";

export default function Playing() {
  return (
    <div className="flex h-full flex-col justify-end gap-24 pb-10">
      <Pile />
      <div className="space-y-8">
        <ShownHand />
        <Switcher />
      </div>
    </div>
  );
}
