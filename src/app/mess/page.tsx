"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/MyFooter";
import axios from "axios";

const BACKEND = "http://localhost:5000";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MEALS = [
  { key: "breakfast", label: "Breakfast", icon: "☀️" },
  { key: "lunch", label: "Lunch", icon: "🌤️" },
  { key: "teatime", label: "Tea Time", icon: "🍵" },
  { key: "dinner", label: "Dinner", icon: "🌙" },
] as const;
type MealKey = "breakfast" | "lunch" | "teatime" | "dinner";

const DEMO_MENU: DayMenu[] = [
  { id:"demo-monday",   day:"Monday",    breakfast:["Aloo Paratha","Curd","Banana","Tea"],          lunch:["Steamed Rice","Dal Tadka","Aloo Gobi","Salad"],       teatime:["Samosa","Masala Chai"],        dinner:["Roti","Paneer Butter Masala","Jeera Rice","Gulab Jamun"],  updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-tuesday",  day:"Tuesday",   breakfast:["Poha","Boiled Egg","Milk"],                   lunch:["Rajma","Rice","Bhindi Fry","Papad"],                   teatime:["Veg Sandwich","Tea"],          dinner:["Roti","Chicken Curry","Rice","Kheer"],                     updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-wednesday",day:"Wednesday", breakfast:["Idli","Sambar","Coconut Chutney","Coffee"],   lunch:["Lemon Rice","Chana Masala","Cucumber Raita"],          teatime:["Biscuits","Tea"],              dinner:["Roti","Egg Curry","Peas Pulao","Halwa"],                   updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-thursday", day:"Thursday",  breakfast:["Upma","Peanut Chutney","Tea"],                lunch:["Rice","Sambar","Beans Poriyal","Curd"],                teatime:["Bread Pakora","Lemon Tea"],    dinner:["Roti","Mix Veg","Dal Fry","Fruit Custard"],               updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-friday",   day:"Friday",    breakfast:["Chole Bhature","Lassi"],                      lunch:["Veg Biryani","Raita","Onion Salad"],                   teatime:["Puff","Tea"],                  dinner:["Roti","Dal Makhani","Aloo Matar","Jalebi"],               updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-saturday", day:"Saturday",  breakfast:["Dosa","Sambar","Tomato Chutney"],             lunch:["Rice","Kadai Paneer","Dal","Salad"],                   teatime:["Maggie","Tea"],                dinner:["Roti","Chilli Chicken","Fried Rice","Ice Cream"],          updated_at:"2026-03-17T00:00:00.000Z" },
  { id:"demo-sunday",   day:"Sunday",    breakfast:["Puri","Aloo Sabzi","Suji Halwa","Tea"],       lunch:["Special Thali","Paneer Lababdar","Dal","Sweet"],       teatime:["French Fries","Cold Coffee"],  dinner:["Roti","Mushroom Masala","Rice","Rasmalai"],               updated_at:"2026-03-17T00:00:00.000Z" },
];

interface DayMenu {
  id: string; day: string;
  breakfast: string[]; lunch: string[]; teatime: string[]; dinner: string[];
  updated_at: string;
}
interface Complaint {
  id: string; kerboros: string; title: string; description: string;
  imageURL: string | null; status: "pending" | "resolved"; created_at: string;
}
interface UserInfo { userid: string; role: string[]; }
interface CommitteeMember {
  id: string;
  name: string;
  image: string | null;
  kerboros: string;
  designation: string[];
  room_number: string;
}

function MessCommitteeMembers() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        setLoading(true);
        const res = await axios.post<{ data: CommitteeMember[] }>(
          `${BACKEND}/api/mess/committee`,
          {},
          { withCredentials: true }
        );
        setMembers(res.data.data || []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittee();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="glass-card p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg sm:text-xl font-semibold">Mess Committee Members</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 spinner" />
        </div>
      ) : members.length === 0 ? (
        <p className="text-gray-500 text-sm">No committee members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const roles = Array.isArray(member.designation) ? member.designation : [];
            const specificRole =
              roles.find((r) => ["messCommittee", "bhmRep", "messSecy"].includes(r)) || "member";

            return (
              <div key={member.id} className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  {member.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-primary/50">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold text-sm flex items-center justify-center ring-1 ring-primary/50">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{member.name}</p>
                    <p className="text-primary text-xs capitalize">{specificRole}</p>
                    <p className="text-gray-500 text-xs">{member.kerboros}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Mess Complaints Sub-Component ──────────────────────────────────────────
function MessComplaints({ user }: { user: UserInfo | null }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [kerboros, setKerboros] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const isPrivileged = user?.role?.some((r) => ["messSecy","admin"].includes(r)) ?? false;

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: Complaint[] }>(`${BACKEND}/api/mess/all`, { withCredentials: true });
      setComplaints(res.data.data);
    } catch { setComplaints([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) { const r = new FileReader(); r.onloadend = () => setImagePreview(r.result as string); r.readAsDataURL(file); }
    else setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setFormMsg("");
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append("kerboros",kerboros); fd.append("title",title); fd.append("description",description); fd.append("image",imageFile);
        await axios.post(`${BACKEND}/api/mess`, fd, { withCredentials:true, headers:{"Content-Type":"multipart/form-data"} });
      } else {
        await axios.post(`${BACKEND}/api/mess`, { kerboros, title, description }, { withCredentials: true });
      }
      setFormMsg("Complaint submitted successfully!"); setKerboros(""); setTitle(""); setDescription(""); setImageFile(null); setImagePreview(null); setShowForm(false); fetchComplaints();
    } catch { setFormMsg("Error submitting complaint. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleResolve = async (id: string) => {
    try { await axios.put(`${BACKEND}/api/mess/resolve/${id}`, {}, { withCredentials: true }); fetchComplaints(); }
    catch { alert("Failed to resolve complaint."); }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this complaint?")) return;
    try { await axios.delete(`${BACKEND}/api/mess/${id}`, { withCredentials: true }); fetchComplaints(); }
    catch { alert("Failed to delete complaint."); }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 btn-primary">
          <span className="text-lg leading-none">{showForm ? "✕" : "+"}</span>
          {showForm ? "Cancel" : "Post Complaint"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }} className="overflow-hidden">
            <div className="glass-card p-6 mb-8">
              <h2 className="text-white text-xl font-semibold mb-5">New Mess Complaint</h2>
              {formMsg && <p className={`mb-4 text-sm ${formMsg.includes("Error") ? "text-red-400" : "text-emerald-400"}`}>{formMsg}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Your Kerboros ID</label>
                  <input type="text" value={kerboros} onChange={e => setKerboros(e.target.value)} required className="input-field" placeholder="e.g. 2301cs01" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="input-field" placeholder="Brief issue title" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="input-field resize-none" placeholder="Describe the issue…" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1.5">Image (optional)</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2.5 glass rounded-xl text-gray-300 text-sm cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/80 file:text-white file:text-xs file:cursor-pointer hover:file:bg-primary transition-all" />
                  {imagePreview && (
                    <div className="mt-3 relative h-48 rounded-xl overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-red-600/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-500">✕</button>
                    </div>
                  )}
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 spinner !border-2" />Submitting…</> : "Submit Complaint"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {formMsg && !showForm && <p className="text-center text-emerald-400 mb-6">{formMsg}</p>}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-12 h-12 spinner" /></div>
      ) : complaints.length === 0 ? (
        <div className="glass-card text-center text-gray-500 py-14">No mess complaints found.</div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07 } } }} className="space-y-4">
          {complaints.map((c) => (
            <motion.div key={c.id} variants={{ hidden:{ opacity:0, y:16 }, show:{ opacity:1, y:0 } }} className="glass-card p-5 hover:border-white/20 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-white font-semibold text-lg">{c.title}</h3>
                    <span className={c.status === "resolved" ? "badge-resolved" : "badge-pending"}>{c.status}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2 leading-relaxed">{c.description}</p>
                  <p className="text-gray-500 text-xs" suppressHydrationWarning>
                    By <span className="text-primary">{c.kerboros}</span> •{" "}
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                </div>
                {isPrivileged && (
                  <div className="flex gap-2 flex-shrink-0">
                    {c.status === "pending" && <button onClick={() => handleResolve(c.id)} className="btn-success">Resolve</button>}
                    <button onClick={() => handleDelete(c.id)} className="btn-danger">Delete</button>
                  </div>
                )}
              </div>
              {c.imageURL && (
                <div className="mt-4 relative h-56 rounded-xl overflow-hidden">
                  <Image src={c.imageURL} alt="Complaint image" fill className="object-cover" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─── Mess Menu Sub-Component ─────────────────────────────────────────────────
const MEAL_COLORS: Record<MealKey, string> = {
  breakfast: "from-amber-500/20 to-transparent",
  lunch: "from-primary/15 to-transparent",
  teatime: "from-emerald-500/15 to-transparent",
  dinner: "from-violet-500/20 to-transparent",
};

function MessMenuView({ user }: { user: UserInfo | null }) {
  const [menu, setMenu] = useState<DayMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("Monday");
  const [editMode, setEditMode] = useState(false);
  const [editDay, setEditDay] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<MealKey, string[]>>({ breakfast:[], lunch:[], teatime:[], dinner:[] });
  const [draggingItem, setDraggingItem] = useState<{ meal: MealKey; index: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const canEdit = user?.role?.some((r) => ["messSecy","admin"].includes(r)) ?? false;

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: DayMenu[] }>(`${BACKEND}/api/mess/menu`, { withCredentials: true });
      const base = res.data.data?.length ? res.data.data : DEMO_MENU;
      const sorted = [...base].sort((a,b) => DAYS.indexOf(a.day)-DAYS.indexOf(b.day));
      setMenu(sorted);
      const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      const today = daysOfWeek[new Date().getDay()];
      setActiveDay(sorted.find(d => d.day === today) ? today : sorted[0]?.day || "Monday");
    } catch {
      const sorted = [...DEMO_MENU].sort((a,b) => DAYS.indexOf(a.day)-DAYS.indexOf(b.day));
      setMenu(sorted); setActiveDay("Monday");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const startEdit = (day: string) => {
    const d = menu.find(m => m.day === day); if (!d) return;
    setEditDay(day); setEditData({ breakfast:[...d.breakfast], lunch:[...d.lunch], teatime:[...d.teatime], dinner:[...d.dinner] }); setEditMode(true);
  };
  const addItem = (meal: MealKey) => setEditData(p => ({ ...p, [meal]: [...p[meal],""] }));
  const removeItem = (meal: MealKey, idx: number) => setEditData(p => ({ ...p, [meal]: p[meal].filter((_,i) => i!==idx) }));
  const updateItem = (meal: MealKey, idx: number, value: string) => setEditData(p => { const a=[...p[meal]]; a[idx]=value; return {...p,[meal]:a}; });
  const reorderItems = (meal: MealKey, from: number, to: number) => {
    if (from===to) return;
    setEditData(p => { const n=[...p[meal]]; const [m]=n.splice(from,1); n.splice(to,0,m); return {...p,[meal]:n}; });
  };

  const handleSave = async () => {
    if (!editDay) return; setSaving(true); setSaveMsg("");
    try {
      await axios.put(`${BACKEND}/api/mess/menu/${editDay}`, {
        breakfast: editData.breakfast.filter(i=>i.trim()),
        lunch: editData.lunch.filter(i=>i.trim()),
        teatime: editData.teatime.filter(i=>i.trim()),
        dinner: editData.dinner.filter(i=>i.trim()),
      }, { withCredentials: true });
      setSaveMsg("Menu updated successfully!"); setEditMode(false); fetchMenu();
    } catch { setSaveMsg("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const w = window.open("","","width=900,height=700"); if (!w) return;
    w.document.write(`<html><head><title>Shivalik Mess Menu</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111;}h1{text-align:center;margin-bottom:20px;}table{width:100%;border-collapse:collapse;}th{background:#4f46e5;color:white;padding:10px;font-size:13px;}td{padding:8px 10px;border:1px solid #ddd;vertical-align:top;font-size:12px;}tr:nth-child(even) td{background:#f9f9f9;}.day-header td{background:#6d28d9;color:white;font-weight:bold;font-size:13px;padding:8px 10px;}</style></head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close(); w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  const activeDayData = menu.find(d => d.day === activeDay);

  if (loading) return <div className="flex justify-center py-16"><div className="w-12 h-12 spinner" /></div>;
  if (menu.length === 0) return <div className="text-center text-gray-500 py-14">No menu data found.</div>;

  return (
    <div>
      {/* Action buttons */}
      <div className="flex justify-end mb-4 gap-3">
        {canEdit && !editMode && (
          <button onClick={() => startEdit(activeDay)} className="flex items-center gap-2 px-4 py-2 glass text-primary border-primary/30 hover:bg-primary/10 rounded-xl text-sm font-medium transition-all">
            ✏️ Edit {activeDay}
          </button>
        )}
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors">
          ⬇ Download PDF
        </button>
      </div>

      {/* Day selector */}
      <div className="overflow-x-auto pb-2 mb-6">
        <div className="flex min-w-max gap-2">
          {DAYS.map(day => {
            const isActive = activeDay === day;
            return (
              <button key={day} onClick={() => { setActiveDay(day); setEditMode(false); }}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? "text-white shadow-[0_0_14px_rgba(59,130,246,0.35)]" : "text-gray-400 hover:text-white glass"}`}
              >
                {isActive && <motion.div layoutId="mess-page-day" className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10" transition={{ type:"spring", stiffness:300, damping:30 }} />}
                <span>{day.slice(0,3)}</span><span className="hidden sm:inline">{day.slice(3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit mode */}
      {editMode && editDay === activeDay ? (
        <div className="glass-card p-6">
          <h3 className="text-white text-xl font-semibold mb-2">Editing {editDay}</h3>
          <p className="text-gray-400 text-xs mb-5">Drag dish rows to reorder within each meal.</p>
          {saveMsg && <p className={`mb-4 text-sm ${saveMsg.includes("Failed") ? "text-red-400" : "text-emerald-400"}`}>{saveMsg}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {MEALS.map(({ key, label, icon }) => (
              <div key={key} className={`rounded-xl p-4 bg-gradient-to-b ${MEAL_COLORS[key]} glass border border-white/10`}>
                <h4 className="text-white font-semibold mb-3">{icon} {label}</h4>
                {editData[key].map((item, idx) => (
                  <div key={idx} draggable
                    onDragStart={() => setDraggingItem({ meal:key, index:idx })}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); if (!draggingItem || draggingItem.meal!==key) return; reorderItems(key,draggingItem.index,idx); setDraggingItem({ meal:key, index:idx }); }}
                    onDragEnd={() => setDraggingItem(null)}
                    className={`flex items-center gap-2 mb-2 rounded-lg px-1 py-0.5 transition-colors ${draggingItem?.meal===key && draggingItem.index===idx ? "bg-primary/20" : ""}`}
                  >
                    <span className="text-gray-400 cursor-grab select-none">⋮⋮</span>
                    <input type="text" value={item} onChange={e => updateItem(key,idx,e.target.value)} className="input-field !py-1.5 !text-sm flex-1" placeholder="Dish name" />
                    <button onClick={() => removeItem(key,idx)} className="text-red-400 hover:text-red-300 text-lg">✕</button>
                  </div>
                ))}
                <button onClick={() => addItem(key)} className="mt-1 text-primary hover:text-blue-300 text-sm font-medium">+ Add item</button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><div className="w-4 h-4 spinner !border-2" />Saving…</> : "Save Changes"}
            </button>
            <button onClick={() => setEditMode(false)} className="btn-ghost px-6">Cancel</button>
          </div>
        </div>
      ) : (
        activeDayData && (
          <AnimatePresence mode="wait">
            <motion.div key={activeDay} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }} className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-semibold">{activeDayData.day}</h3>
                  {activeDayData.updated_at && (
                    <p className="text-gray-500 text-xs mt-0.5" suppressHydrationWarning>
                      Updated {new Date(activeDayData.updated_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {MEALS.map(({ key, label, icon }) => (
                  <div key={key} className={`p-5 bg-gradient-to-b ${MEAL_COLORS[key]}`}>
                    <h4 className="text-primary font-semibold text-base mb-3">{icon} {label}</h4>
                    {activeDayData[key]?.length > 0 ? (
                      <ul className="space-y-1.5">
                        {activeDayData[key].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-accent mt-0.5">•</span>
                            <span className="text-gray-300 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm italic">Not set</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )
      )}

      {/* Hidden printable table */}
      <div className="hidden">
        <div ref={printRef}>
          <h1>Shivalik Hostel — Weekly Mess Menu</h1>
          <table>
            <thead><tr><th>Day</th><th>☀️ Breakfast</th><th>🌤️ Lunch</th><th>🍵 Tea Time</th><th>🌙 Dinner</th></tr></thead>
            <tbody>
              {menu.map(d => (
                <tr key={d.day}>
                  <td><strong>{d.day}</strong></td>
                  {(["breakfast","lunch","teatime","dinner"] as MealKey[]).map(m => (
                    <td key={m}>{d[m]?.join(", ") || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Mess Page ───────────────────────────────────────────────────────────
type TabType = "menu" | "complaints";

export default function MessPage() {
  const [tab, setTab] = useState<TabType>("menu");
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    axios.get<{ user: UserInfo }>(`${BACKEND}/api/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <div className="page-section">
        <div className="page-blob-blue" />
        <div className="page-blob-gold" />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7 }}
            className="text-center mb-10"
          >
            <h1 className="section-title">Mess</h1>
            <div className="section-divider" />
            <p className="section-subtitle">Weekly menu &amp; complaints for Shivalik Hostel</p>
            {user && (
              <p className="text-primary text-sm mt-3">
                Logged in as <strong>{user.userid}</strong>{" "}
                <span className="text-gray-500">({user.role?.join(", ")})</span>
              </p>
            )}
          </motion.div>

          <MessCommitteeMembers />

          {/* Tab switcher */}
          {/* <div className="flex glass rounded-2xl overflow-hidden mb-8 border border-white/10 p-1 max-w-xs mx-auto">
            {(["menu","complaints"] as TabType[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`relative flex-1 py-2.5 font-medium text-sm capitalize transition-all duration-300 rounded-xl ${tab===t ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                {tab===t && <motion.div layoutId="mess-tab" className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl -z-10" transition={{ type:"spring", stiffness:300, damping:30 }} />}
                {t === "menu" ? "🍽️ Menu" : "📋 Complaints"}
              </button>
            ))}
          </div> */}

          {/* Tab content */}
          {/* <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}>
              {tab === "menu" ? <MessMenuView user={user} /> : <MessComplaints user={user} />}
            </motion.div>
          </AnimatePresence> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
