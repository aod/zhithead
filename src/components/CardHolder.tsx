import { PropsWithChildren } from "react";

export default function CardHolder(props: PropsWithChildren) {
  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border-2 border-dashed border-zinc-600 p-0.5">
      {props.children}
    </div>
  );
}
