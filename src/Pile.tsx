import Card from "./Card";

export default function Pile() {
  return (
    <div className="flex justify-center">
      <div className="relative aspect-auto rounded-xl border-4 border-dashed border-zinc-600">
        <div className="invisible">
          <Card flipped />
        </div>
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <span className="select-none text-4xl font-bold tracking-wider text-zinc-600">
            PILE
          </span>
        </div>
      </div>
    </div>
  );
}
