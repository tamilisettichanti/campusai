import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChat, getQuickQuestions } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Send, Zap, User, Bot, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getQuickQuestions()
      .then(r => setQuestions(r.data.questions))
      .catch(() => {});
    setMessages([{
      role: "assistant",
      content: `Hey ${user?.name?.split(" ")[0]}! 👋 I'm your CampusAI assistant. Ask me anything about notices, canteen, attendance, or lost items!`,
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = { role: "user", content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role, content: m.content
      }));
      const { data } = await sendChat({ message: msg, history });
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch (err) {
      toast.error("AI is taking a break. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true
    });

  return (
    <div style={{
      height: "calc(100vh - 60px)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Space Grotesk', sans-serif",
      background: "var(--bg)",
    }}>

      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "40px", height: "40px",
            borderRadius: "8px", background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: "10px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.2em",
              color: "var(--text3)", marginBottom: "2px",
            }}>AI ASSISTANT</div>
            <h1 style={{
              fontSize: "20px", fontWeight: "800",
              letterSpacing: "-0.03em", color: "var(--text)",
              lineHeight: 1,
            }}>CampusAI Chat</h1>
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "100px", padding: "6px 14px",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "var(--success)",
            animation: "pulse-dot 2s infinite",
          }} />
          <span style={{
            fontSize: "11px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "var(--text3)",
          }}>Online</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px 32px", display: "flex",
        flexDirection: "column", gap: "16px",
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                gap: "12px", alignItems: "flex-start",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: "32px", height: "32px",
                borderRadius: "8px", flexShrink: 0,
                background: msg.role === "user"
                  ? "var(--accent)" : "var(--bg2)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {msg.role === "user"
                  ? <User size={15} color="white" />
                  : <Bot size={15} color="var(--accent)" />
                }
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: "65%" }}>
                <div style={{
                  padding: "12px 16px",
                  background: msg.role === "user"
                    ? "var(--accent)" : "var(--card)",
                  border: msg.role === "user"
                    ? "none" : "1px solid var(--border)",
                  borderRadius: "10px",
                  color: msg.role === "user" ? "white" : "var(--text)",
                  fontSize: "14px", lineHeight: "1.6",
                  fontWeight: "400",
                }}>
                  {msg.content}
                </div>
                <div style={{
                  fontSize: "10px", color: "var(--text3)",
                  marginTop: "4px", fontWeight: "600",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
            }}
          >
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "var(--bg2)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={15} color="var(--accent)" />
            </div>
            <div style={{
              padding: "14px 18px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              display: "flex", gap: "5px", alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.8, repeat: Infinity, delay: i * 0.2
                  }}
                  style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Quick Questions ── */}
      {questions.length > 0 && messages.length <= 1 && (
        <div style={{
          padding: "0 32px 16px",
          display: "flex", flexWrap: "wrap", gap: "8px", flexShrink: 0,
        }}>
          <span style={{
            fontSize: "10px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.15em",
            color: "var(--text3)", width: "100%", marginBottom: "4px",
          }}>Try asking —</span>
          {questions.map((q, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(q)}
              style={{
                padding: "8px 14px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                color: "var(--text2)", fontSize: "12px",
                fontWeight: "500", cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text2)";
              }}
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "16px 32px", flexShrink: 0,
        background: "var(--bg)",
      }}>
        <div style={{
          display: "flex", gap: "12px", alignItems: "flex-end",
          background: "var(--bg2)",
          border: focused
            ? "1.5px solid var(--accent)"
            : "1.5px solid var(--border)",
          borderRadius: "10px",
          padding: "4px 4px 4px 16px",
          transition: "border-color 0.25s ease",
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask about canteen, notices, attendance..."
            rows={1}
            style={{
              flex: 1, background: "transparent",
              border: "none", outline: "none",
              color: "var(--text)", fontSize: "14px",
              fontFamily: "'Space Grotesk', sans-serif",
              resize: "none", padding: "10px 0",
              lineHeight: "1.5",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: "40px", height: "40px",
              background: input.trim() && !loading
                ? "var(--accent)" : "var(--bg3)",
              border: "none", borderRadius: "8px",
              display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              transition: "all 0.2s ease", flexShrink: 0,
              margin: "4px",
            }}
          >
            <Send size={16}
              color={input.trim() && !loading ? "white" : "var(--text3)"} />
          </motion.button>
        </div>
        <p style={{
          fontSize: "11px", color: "var(--text3)",
          marginTop: "8px", textAlign: "center",
          fontWeight: "500",
        }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        textarea::placeholder { color: var(--text3) !important; opacity: 0.6; }
      `}</style>
    </div>
  );
}