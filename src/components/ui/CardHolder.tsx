import { PropsWithChildren } from "react";

export default function CardHolder(props: PropsWithChildren) {
  return (
    <div className="relative box-content flex h-card-height w-card-width justify-center rounded-xl border border-dashed border-zinc-600 p-0.5 md:border-2">
      {props.children}
    </div>
  );
}
