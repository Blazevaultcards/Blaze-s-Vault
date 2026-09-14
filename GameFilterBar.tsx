import { GAMES } from "@/theme";
import type { GameId } from "@/types";

export default function GameFilterBar({
  active,
  onChange,
}: {
  active: GameId | "all";
  onChange: (id: GameId | "all") => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-8 flex-wrap">
      {GAMES.map((g) => (
        <button
          key={g.id}
          onClick={() => onChange(g.id)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          style={
            active === g.id
              ? {
                  background: "rgba(196,26,26,0.18)",
                  border: `1px solid rgba(196,26,26,0.55)`,
                  color: "#f87171",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#6b5a4a",
                }
          }
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
