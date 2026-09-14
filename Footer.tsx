import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.jpeg";
import { RED, GOLD, MUTED, FG, BORDER } from "@/theme";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Games",
    links: [
      { label: "Pokémon", to: "/browse?game=pokemon" },
      { label: "Yu-Gi-Oh!", to: "/browse?game=yugioh" },
      { label: "One Piece", to: "/browse?game=onepiece" },
      { label: "Riftbound", to: "/browse?game=riftbound" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Singles", to: "/singles" },
      { label: "Sealed Product", to: "/sealed" },
      { label: "Graded Cards", to: "/graded" },
      { label: "Sell Your Cards", to: "/sell" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Sign In", to: "/login" },
      { label: "Create Account", to: "/signup" },
      { label: "My Account", to: "/account" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="px-6 py-12" style={{ borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Blaze's Vault Cards" className="h-12 w-12 object-contain rounded-lg" />
            <div className="leading-tight">
              <div className="font-display font-black text-lg" style={{ color: RED }}>
                BLAZE'S VAULT
              </div>
              <div className="font-display font-semibold text-xs tracking-widest" style={{ color: GOLD }}>
                CARDS
              </div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            The premier destination for trading card collectors and players.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="font-display font-bold text-xs mb-4 tracking-widest" style={{ color: "#b8a898" }}>
              {col.title.toUpperCase()}
            </div>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: MUTED }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="max-w-6xl mx-auto mt-10 pt-6 flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <p className="text-xs" style={{ color: MUTED }}>
          © {new Date().getFullYear()} Blaze's Vault Cards. Not affiliated with Nintendo, Konami, Bandai, or Riftbound Games.
        </p>
        <p className="text-xs" style={{ color: MUTED }}>
          All card images are property of their respective owners.
        </p>
      </div>
    </footer>
  );
}
