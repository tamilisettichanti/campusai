import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotes, uploadNote, downloadNote, rateNote } from "../utils/api";
import {
  BookOpen, Upload, Search, Download,
  Star, X, Plus, Tag, FileText
} from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [focused, setFocused] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const fetchNotes = async () => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const { data } = await getNotes(params);
      setNotes(data);
    } catch { toast.error("Failed to load notes"); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a file!"); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("unit", unit);
      formData.append("description", description);
      formData.append("file", file);
      await uploadNote(formData);
      toast.success("Notes uploaded! AI generated tags 🤖");
      setShowForm(false);
      setTitle(""); setSubject(""); setUnit("");
      setDescription(""); setFile(null);
      fetchNotes();
    } catch { toast.error("Upload failed"); }
    finally { setSubmitting(false); }
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadNote(id);
      toast.success("Download started!");
    } catch { toast.error("Download failed"); }
  };

  const handleRate = async (id, rating) => {
    try {
      await rateNote(id, { rating });
      toast.success("Rated!");
      fetchNotes();
    } catch {}
  };

  const fieldWrap = (name) => ({
    borderRadius: "10px",
    border: focused === name
      ? "2px solid var(--accent)" : "1.5px solid var(--border)",
    background: focused === name ? "var(--accent-bg)" : "var(--bg2)",
    transition: "all 0.25s ease", overflow: "hidden",
    marginBottom: "12px",
  });

  const inputStyle = {
    width: "100%", padding: "8px 16px 14px",
    background: "transparent", border: "none",
    outline: "none", fontSize: "14px",
    fontWeight: "600", color: "var(--text)",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const labelStyle = (name) => ({
    display: "block", fontSize: "10px", fontWeight: "700",
    textTransform: "uppercase", letterSpacing: "0.15em",
    color: focused === name ? "var(--accent)" : "var(--text3)",
    padding: "10px 16px 2px", transition: "color 0.25s ease",
  });

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "28px 32px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
      }}>
        <div>
          <p style={{
            fontSize: "10px", fontWeight: "700",
            textTransform: "uppercase", letterSpacing: "0.2em",
            color: "var(--text3)", marginBottom: "6px",
          }}>STUDY RESOURCES</p>
          <h1 style={{
            fontSize: "32px", fontWeight: "900",
            letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1,
          }}>Notes Hub</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "var(--bg2)",
            border: focused === "search"
              ? "2px solid var(--accent)" : "1.5px solid var(--border)",
            borderRadius: "8px", padding: "8px 14px",
            transition: "all 0.25s ease",
          }}>
            <Search size={14} color="var(--text3)" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setFocused("search")}
              onBlur={() => setFocused("")}
              style={{
                background: "transparent", border: "none",
                outline: "none", fontSize: "13px",
                fontWeight: "500", color: "var(--text)",
                fontFamily: "'Space Grotesk', sans-serif",
                width: "180px",
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", background: "var(--accent)",
              border: "none", borderRadius: "8px", color: "white",
              fontSize: "12px", fontWeight: "700",
              textTransform: "uppercase", letterSpacing: "0.1em",
              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
            }}>
            <Upload size={14} /> Upload Notes
          </motion.button>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center",
              justifyContent: "center", padding: "24px",
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", maxWidth: "520px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "16px", overflow: "hidden",
                maxHeight: "90vh", overflowY: "auto",
              }}
            >
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                position: "sticky", top: 0,
                background: "var(--bg)", zIndex: 1,
              }}>
                <div>
                  <p style={{
                    fontSize: "10px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.2em",
                    color: "var(--text3)",
                  }}>AI WILL TAG AUTOMATICALLY</p>
                  <h3 style={{
                    fontSize: "18px", fontWeight: "800",
                    letterSpacing: "-0.03em", color: "var(--text)",
                  }}>Upload Notes</h3>
                </div>
                <button onClick={() => setShowForm(false)}
                  style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderRadius: "8px", padding: "6px",
                    cursor: "pointer", color: "var(--text2)",
                    display: "flex", alignItems: "center",
                  }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpload} style={{ padding: "24px" }}>
                <div style={fieldWrap("ntitle")}>
                  <label style={labelStyle("ntitle")}>Title</label>
                  <input type="text" placeholder="e.g. Unit 3 - Trees & Graphs"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onFocus={() => setFocused("ntitle")}
                    onBlur={() => setFocused("")}
                    required style={inputStyle} />
                </div>

                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
                }}>
                  <div style={fieldWrap("nsubject")}>
                    <label style={labelStyle("nsubject")}>Subject</label>
                    <input type="text" placeholder="Data Structures"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      onFocus={() => setFocused("nsubject")}
                      onBlur={() => setFocused("")}
                      required style={inputStyle} />
                  </div>
                  <div style={fieldWrap("nunit")}>
                    <label style={labelStyle("nunit")}>Unit</label>
                    <input type="text" placeholder="Unit 3"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      onFocus={() => setFocused("nunit")}
                      onBlur={() => setFocused("")}
                      style={inputStyle} />
                  </div>
                </div>

                <div style={fieldWrap("ndesc")}>
                  <label style={labelStyle("ndesc")}>Description</label>
                  <textarea placeholder="Brief description of the notes..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onFocus={() => setFocused("ndesc")}
                    onBlur={() => setFocused("")}
                    rows={3}
                    style={{ ...inputStyle, resize: "none", lineHeight: "1.5" }} />
                </div>

                {/* File Upload */}
                <input
                  ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={e => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: file
                      ? "2px solid var(--accent)"
                      : "2px dashed var(--border)",
                    borderRadius: "10px", padding: "24px",
                    textAlign: "center", cursor: "pointer",
                    background: file ? "var(--accent-bg)" : "transparent",
                    transition: "all 0.25s ease",
                    marginBottom: "16px",
                  }}
                >
                  <FileText size={24} color={file ? "var(--accent)" : "var(--text3)"}
                    style={{ margin: "0 auto 8px" }} />
                  <p style={{
                    fontSize: "13px", fontWeight: "600",
                    color: file ? "var(--accent)" : "var(--text3)",
                  }}>
                    {file ? file.name : "Click to upload PDF, DOC, PPT"}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "4px" }}>
                    Max 10MB
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  style={{
                    width: "100%", padding: "14px",
                    background: submitting ? "var(--text3)" : "var(--accent)",
                    border: "none", borderRadius: "10px",
                    color: "white", fontSize: "13px",
                    fontWeight: "700", textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                  }}>
                  {submitting ? "UPLOADING..." : <><Upload size={15} /> UPLOAD NOTES</>}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div style={{ padding: "28px 32px" }}>
        {loading ? (
          <div style={{
            display: "flex", justifyContent: "center", padding: "60px 0",
          }}>
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: "36px", height: "36px",
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent)", borderRadius: "50%",
              }} />
          </div>
        ) : notes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              textAlign: "center", padding: "80px 24px",
              border: "1px solid var(--border)", borderRadius: "12px",
            }}>
            <BookOpen size={32} color="var(--text3)"
              style={{ margin: "0 auto 16px" }} />
            <p style={{
              color: "var(--text3)", fontWeight: "700",
              fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              {searchQuery ? "No notes found" : "No Notes Yet"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {notes.map((note, i) => (
              <motion.div key={note._id} variants={fadeUp}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px", overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
                whileHover={{
                  y: -2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }}
              >
                {/* Card Header */}
                <div style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "flex-start",
                  gap: "12px",
                }}>
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "8px",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0,
                  }}>
                    <FileText size={17} color="var(--accent)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: "14px", fontWeight: "800",
                      letterSpacing: "-0.02em", color: "var(--text)",
                      marginBottom: "3px", overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{note.title}</h3>
                    <p style={{
                      fontSize: "12px", color: "var(--text3)",
                      fontWeight: "600",
                    }}>
                      {note.subject}
                      {note.unit ? ` · ${note.unit}` : ""}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {note.aiTags?.length > 0 && (
                  <div style={{
                    padding: "12px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex", flexWrap: "wrap", gap: "6px",
                  }}>
                    {note.aiTags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        padding: "2px 8px",
                        background: "var(--accent-bg)",
                        border: "1px solid var(--accent-border)",
                        borderRadius: "4px",
                        color: "var(--accent)",
                        fontSize: "10px", fontWeight: "700",
                        letterSpacing: "0.05em",
                      }}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  padding: "12px 18px",
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  {/* Stats */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                  }}>
                    <span style={{
                      fontSize: "11px", color: "var(--text3)",
                      fontWeight: "600", display: "flex",
                      alignItems: "center", gap: "4px",
                    }}>
                      <Download size={11} /> {note.downloads || 0}
                    </span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "3px",
                    }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s}
                          onClick={() => handleRate(note._id, s)}
                          style={{
                            background: "none", border: "none",
                            cursor: "pointer", padding: "1px",
                            color: s <= (note.avgRating || 0)
                              ? "var(--accent)" : "var(--border)",
                            fontSize: "12px", lineHeight: 1,
                          }}>★</button>
                      ))}
                    </div>
                  </div>

                  {/* Download Button */}
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`http://localhost:5000${note.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownload(note._id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 12px",
                      background: "var(--accent)",
                      border: "none", borderRadius: "6px",
                      color: "white", fontSize: "11px",
                      fontWeight: "700", textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      textDecoration: "none", transition: "all 0.2s ease",
                    }}>
                    <Download size={12} /> Get
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: var(--text3) !important; opacity: 0.5;
        }
      `}</style>
    </div>
  );
}