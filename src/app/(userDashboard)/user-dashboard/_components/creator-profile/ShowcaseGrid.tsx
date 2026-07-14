/* Pokemon card back showcase — placeholder until real card data is wired up. */

const cardNames = [
  "Charizard",
  "Pikachu",
  "Lugia",
  "Gengar",
  "Mewtwo",
  "Blastoise",
  "Venusaur",
  "Snorlax",
];

function PokemonCardBack({ name }: { name: string }) {
  return (
    <div
      title={name}
      className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl border border-violet-500/30 bg-linear-to-b from-[#1a1065] to-[#0d0839]"
    >
      {/* Classic pokemon card back pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex h-4/5 w-4/5 items-center justify-center rounded-lg border-2 border-yellow-400/60 bg-linear-to-br from-blue-900 to-blue-950">
          {/* Inner decorative border */}
          <div className="absolute inset-2 rounded-md border border-yellow-400/30" />
          {/* Pokeball design */}
          <div className="relative h-16 w-16">
            {/* Top half */}
            <div className="absolute top-0 h-1/2 w-full rounded-t-full bg-red-600" />
            {/* Bottom half */}
            <div className="absolute bottom-0 h-1/2 w-full rounded-b-full bg-white/90" />
            {/* Middle band */}
            <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-black/60" />
            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black/50 bg-white" />
            <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
      {cardNames.map((name) => (
        <PokemonCardBack key={name} name={name} />
      ))}
    </div>
  );
}
