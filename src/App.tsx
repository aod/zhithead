import Card from "./Card";
import { createCard, Rank, Suite } from "./lib";

export default function App() {
  const deck = [
    createCard(Suite.Clubs, Rank.Num6),
    createCard(Suite.Clubs, Rank.Num9),
    createCard(Suite.Hearts, Rank.Queen),
    createCard(Suite.Hearts, Rank.King),
  ];

  return (
    <main className="grid h-screen place-items-center bg-zinc-800">
      <div className="flex gap-4">
        {deck.map((card, i) => (
          <Card card={card} key={i} />
        ))}
      </div>
    </main>
  );
}
