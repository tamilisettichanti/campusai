import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Bell, BookOpen, Coffee, Search,
  CalendarCheck, MessageSquare, LogOut, Menu, X,
  Zap, Sun, Moon, ChevronRight
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", color: "#1351AA" },
  { path: "/chat", icon: MessageSquare, label: "AI Chat", color: "#1351AA" },
  { path: "/notices", icon: Bell, label: "Notices", color: "#1351AA" },
  { path: "/notes", icon: BookOpen, label: "Notes", color: "#1351AA" },
  { path: "/canteen", icon: Coffee, label: "Canteen", color: "#1351AA" },
  { path: "/lost-found", icon: Search, label: "Lost & Found", color: "#1351AA" },
  { path: "/attendance", icon: CalendarCheck, label: "Attendance", color: "#1351AA" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };

  const SidebarContent = () => (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", background: "var(--bg)",
    }}>
      {/* Logo */}
      <div style={{
        height: "60px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px",
            borderRadius: "6px", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={15} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: "14px", fontWeight: "800",
            letterSpacing: "-0.03em", color: "var(--text)",
          }}>CampusAI</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDark(!dark)}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "6px", padding: "5px 8px",
            cursor: "pointer", color: "var(--text2)",
            display: "flex", alignItems: "center",
          }}
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
        </motion.button>
      </div>

      {/* Nav Label */}
      <div style={{ padding: "20px 20px 8px" }}>
        <span style={{
          fontSize: "10px", fontWeight: "700",
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "var(--text3)",
        }}>Navigation</span>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: "none", display: "block", marginBottom: "2px" }}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 12px",
                  background: active ? "var(--accent)" : "transparent",
                  border: active
                    ? "1px solid var(--accent)"
                    : "1px solid transparent",
                  borderRadius: "8px",
                  transition: "all 0.2s ease", cursor: "pointer",
                }}
              >
                <Icon size={15}
                  color={active ? "white" : "var(--text3)"} />
                <span style={{
                  color: active ? "white" : "var(--text2)",
                  fontSize: "13px",
                  fontWeight: active ? "700" : "500",
                  flex: 1,
                }}>{label}</span>
                {active && <ChevronRight size={13} color="white" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{
        padding: "12px",
        borderTop: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          padding: "10px 12px",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "8px", marginBottom: "8px",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <div style={{
            width: "30px", height: "30px",
            borderRadius: "6px", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: "800", fontSize: "13px", flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              color: "var(--text)", fontSize: "12px", fontWeight: "700",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{user?.name}</p>
            <p style={{
              color: "var(--text3)", fontSize: "11px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{user?.branch} · Year {user?.year}</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            width: "100%", padding: "9px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px", color: "var(--danger)",
            fontSize: "12px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.08em",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            gap: "6px", transition: "all 0.2s ease",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--danger)";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "var(--danger)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--danger)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <LogOut size={13} /> Sign Out
        </motion.button>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex", height: "100vh",
      overflow: "hidden", background: "var(--bg)",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: "220px", flexShrink: 0,
        height: "100%",
        borderRight: "1px solid var(--border)",
      }} className="hide-mobile">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.5)",
            }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -220 }} animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "220px", height: "100%",
                borderRight: "1px solid var(--border)",
              }}
            >
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{
        flex: 1, display: "flex",
        flexDirection: "column", overflow: "hidden",
      }}>
        {/* Mobile Header */}
        <header className="show-mobile-flex" style={{
          height: "60px",
          borderBottom: "1px solid var(--border)",
          display: "none", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px", background: "var(--bg)",
          flexShrink: 0,
        }}>
          <button onClick={() => setMobileOpen(true)} style={{
            background: "none", border: "none",
            color: "var(--text)", cursor: "pointer",
          }}>
            <Menu size={20} />
          </button>
          <span style={{
            fontSize: "14px", fontWeight: "800",
            letterSpacing: "-0.03em", color: "var(--text)",
          }}>CampusAI</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDark(!dark)}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "6px", padding: "5px 8px",
              cursor: "pointer", color: "var(--text2)",
              display: "flex", alignItems: "center",
            }}
          >
            {dark ? <Sun size={13} /> : <Moon size={13} />}
          </motion.button>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1, overflowY: "auto",
          background: "var(--bg)",
        }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ minHeight: "100%" }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style>{`
        .hide-mobile { display: block; }
        .show-mobile-flex { display: none !important; }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
      `}</style>
    </div>
  );
}