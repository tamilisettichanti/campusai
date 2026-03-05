import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowRight, Sun, Moon, Zap,
  GraduationCap, BookOpen, Settings, UtensilsCrossed
} from "lucide-react";
import toast from "react-hot-toast";

const roles = [
  { val: "student", icon: GraduationCap, label: "Student" },
  { val: "faculty", icon: BookOpen, label: "Faculty" },
  { val: "admin", icon: Settings, label: "Admin" },
  { val: "canteen", icon: UtensilsCrossed, label: "Canteen" },
];

const branches = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];
const years = [1, 2, 3, 4];

export default function Register() {
  const { register } = useAuth();
  const { dark, setDark } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [role, setRole] = useState("student");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState(1);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, rollNumber, role, branch, year });
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap = (name) => ({
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)"
      : "1.5px solid var(--border)",
    background: focused === name ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease",
    overflow: "hidden",
    marginBottom: "14px",
  });

  const inputStyle = {
    width: "100%",
    padding: "8px 16px 14px",
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--text)",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const labelStyle = (name) => ({
    display: "block",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: focused === name ? "var(--accent)" : "var(--text3)",
    padding: "10px 16px 2px",
    transition: "color 0.25s ease",
  });

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>

      {/* Top Bar */}
      <header style={{
        height: "60px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky", top: 0,
        background: "var(--bg)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "6px",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={15} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: "15px", fontWeight: "800",
            letterSpacing: "-0.03em", color: "var(--text)",
          }}>CampusAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setDark(!dark)}
            style={{
              background: "var(--bg2)",
              border: "1.5px solid var(--border)",
              borderRadius: "8px", padding: "7px 10px",
              cursor: "pointer", color: "var(--text2)",
              display: "flex", alignItems: "center",
              transition: "all 0.25s ease",
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>
          <Link to="/login" style={{
            fontSize: "12px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "var(--text3)", textDecoration: "none",
          }}>Sign In →</Link>
        </div>
      </header>

      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "48px 40px",
      }}>

        {/* Page Header */}
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ marginBottom: "48px" }}
        >
          <motion.div variants={fadeUp} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "100px", padding: "5px 14px", marginBottom: "20px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "var(--accent)", animation: "pulse-dot 2s infinite",
            }} />
            <span style={{
              fontSize: "11px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.15em",
              color: "var(--accent)",
            }}>New Account</span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: "900", letterSpacing: "-0.04em",
            lineHeight: "0.9", color: "var(--text)",
            marginBottom: "16px",
          }}>
            JOIN THE <span style={{ color: "var(--accent)" }}>GRID.</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{
            fontSize: "15px", color: "var(--text2)", maxWidth: "480px",
          }}>
            Create your account and access your college OS.
            Built for students, by students.
          </motion.p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >

            {/* Name */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("name")}>
                <label style={labelStyle("name")}>Full Name</label>
                <input
                  type="text" placeholder="Ravi Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  required style={inputStyle}
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("email")}>
                <label style={labelStyle("email")}>Email Address</label>
                <input
                  type="email" placeholder="you@college.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  required style={inputStyle}
                />
              </div>
            </motion.div>

            {/* Roll Number */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("roll")}>
                <label style={labelStyle("roll")}>Roll Number</label>
                <input
                  type="text" placeholder="21CSE045"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  onFocus={() => setFocused("roll")}
                  onBlur={() => setFocused("")}
                  style={inputStyle}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("password")}>
                <label style={labelStyle("password")}>Password</label>
                <input
                  type="password" placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required style={inputStyle}
                />
              </div>
            </motion.div>

            {/* Branch */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("branch")}>
                <label style={labelStyle("branch")}>Branch</label>
                <select
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  onFocus={() => setFocused("branch")}
                  onBlur={() => setFocused("")}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Year */}
            <motion.div variants={fadeUp}>
              <div style={fieldWrap("year")}>
                <label style={labelStyle("year")}>Year</label>
                <select
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  onFocus={() => setFocused("year")}
                  onBlur={() => setFocused("")}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {years.map(y => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Role Selector */}
            <motion.div variants={fadeUp} style={{ gridColumn: "1 / -1" }}>
              <p style={{
                fontSize: "11px", fontWeight: "700",
                textTransform: "uppercase", letterSpacing: "0.15em",
                color: "var(--text3)", marginBottom: "12px",
              }}>I AM A —</p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
              }}>
                {roles.map(r => {
                  const Icon = r.icon;
                  const active = role === r.val;
                  return (
                    <motion.button
                      key={r.val}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole(r.val)}
                      style={{
                        padding: "16px 12px",
                        background: active
                          ? "var(--accent)" : "var(--bg2)",
                        border: active
                          ? "2px solid var(--accent)"
                          : "1.5px solid var(--border)",
                        borderRadius: "10px",
                        color: active ? "white" : "var(--text2)",
                        fontSize: "12px", fontWeight: "700",
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        cursor: "pointer", transition: "all 0.25s ease",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <Icon size={18}
                        color={active ? "white" : "var(--text3)"} />
                      {r.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              style={{
                gridColumn: "1 / -1",
                borderTop: "1px solid var(--border)",
                paddingTop: "24px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "16px",
              }}
            >
              <p style={{ fontSize: "14px", color: "var(--text3)" }}>
                Already registered?{" "}
                <Link to="/login" style={{
                  color: "var(--accent)", fontWeight: "700",
                  textDecoration: "none",
                }}>Sign in →</Link>
              </p>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  padding: "15px 40px",
                  background: loading ? "var(--text3)" : "var(--accent)",
                  border: "none", borderRadius: "10px",
                  color: "white", fontSize: "13px",
                  fontWeight: "700", textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.25s ease",
                  fontFamily: "'Space Grotesk', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {loading
                  ? <><span style={{
                      width: "14px", height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "white", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                      display: "inline-block",
                    }} /> CREATING...</>
                  : <>CREATE ACCOUNT <ArrowRight size={15} /></>
                }
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: var(--text3) !important; opacity: 0.5; }
        select option { background: var(--bg2); color: var(--text); }
        @media (max-width: 900px) {
          .register-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .register-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}