import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.jpeg";
import { RED, GOLD, MUTED, FG, BORDER } from "@/theme";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { label: "Browse", to: "/browse" },
  { label: "Singles", to: "/singles" },
  { label: "Graded Cards", to: "/graded" },
  { label: "Sealed Product", to: "/sealed" },
  { label: "Sell", to: "/sell" },
  { label: "About Us", to: "/about" },
];

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(8,8,8,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <Link to="/" className="flex items-center gap-3">
        <img src={logoImg} alt="Blaze's Vault Cards" className="h-12 w-12 object-contain rounded-lg" />
        <div className="leading-tight">
          <div className="font-display font-black text-xl tracking-wide leading-none" style={{ color: RED }}>
            BLAZE'S VAULT
          </div>
          <div className="font-display font-semibold text-xs tracking-widest" style={{ color: GOLD }}>
            CARDS
          </div>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className="text-sm font-medium transition-colors duration-200"
            style={({ isActive }) => ({ color: isActive ? FG : MUTED })}
          >
            {item.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className="text-sm font-semibold transition-colors duration-200"
            style={({ isActive }) => ({ color: isActive ? GOLD : "#f87171" })}
          >
            Admin
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://instagram.com/blazevaultcards"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
          style={{ color: MUTED }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://discord.gg/qKZhGbNq5"
          target="_blank"
          rel="noreferrer"
          aria-label="Discord"
          className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
          style={{ color: MUTED }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.132 18.11a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </a>

        {user ? (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/account"
              className="text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200"
              style={{ color: "#b8a898", border: `1px solid ${BORDER}` }}
            >
              {profile?.full_name?.split(" ")[0] || "Account"}
            </Link>
            <button
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
              className="text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200"
              style={{ color: MUTED, border: `1px solid ${BORDER}` }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{ color: "#b8a898", border: `1px solid ${BORDER}` }}
          >
            Sign In
          </Link>
        )}

        <Link
          to="/cart"
          className="relative text-sm px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:brightness-110"
          style={{
            background: `linear-gradient(135deg, ${RED}, #7a0f0f)`,
            color: "#fff",
            boxShadow: `0 0 16px rgba(196,26,26,0.4)`,
          }}
        >
          Cart
          {count > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: GOLD, color: BG_TEXT }}
            >
              {count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

const BG_TEXT = "#080808";
