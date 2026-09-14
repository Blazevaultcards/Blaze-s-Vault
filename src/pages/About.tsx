import { FG, MUTED, GOLD, RED } from "@/theme";

export default function About() {
  return (
    <div className="page-fade px-6 pt-28 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-4xl mb-6" style={{ color: FG }}>
          ABOUT <span className="holo-text">BLAZE'S VAULT</span>
        </h1>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#b8a898" }}>
          <p>
            Blaze's Vault Cards is an independent trading card shop dealing in Pokémon, Yu-Gi-Oh!,
            One Piece, and Riftbound — singles, sealed product, and graded cards.
          </p>
          <p>
            Every card is checked for condition and authenticity before it's listed, and every order
            ships fast, padded, and tracked.
          </p>
          <p>
            Follow along and join the community on{" "}
            <a href="https://instagram.com/blazevaultcards" target="_blank" rel="noreferrer" style={{ color: GOLD }}>
              Instagram
            </a>{" "}
            and{" "}
            <a href="https://discord.gg/qKZhGbNq5" target="_blank" rel="noreferrer" style={{ color: RED }}>
              Discord
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
