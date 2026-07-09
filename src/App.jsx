import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Minus, Check, ChevronDown, ChevronUp, Dumbbell, Library, X, TrendingUp, TrendingDown, RotateCcw, Trash2, Pencil } from "lucide-react";
import { loadKey, saveKey } from "./storage.js";

/* ---------------------------------------------------------------
   DEFAULT DATA
--------------------------------------------------------------- */

const EQUIPMENT = ["Barbell", "Dumbbells", "Bench", "Pull-up Bar", "Bands", "Bodyweight"];
const CATEGORIES = [
  { id: "large", label: "Large" },
  { id: "small", label: "Small" },
  { id: "sideDelt", label: "Side Delts" },
  { id: "abs", label: "Abs" },
];

const DEFAULT_EXERCISES = [
  { id: "ex_bb_bench", name: "Barbell Bench Press", equipment: "Barbell", category: "large", muscleGroup: "Chest" },
  { id: "ex_db_incline", name: "DB Incline Press", equipment: "Dumbbells", category: "large", muscleGroup: "Chest" },
  { id: "ex_pullup", name: "Pull-Ups", equipment: "Pull-up Bar", category: "large", muscleGroup: "Back" },
  { id: "ex_db_row", name: "DB Bent-Over Row", equipment: "Dumbbells", category: "large", muscleGroup: "Back" },
  { id: "ex_bb_row", name: "Barbell Row", equipment: "Barbell", category: "large", muscleGroup: "Back" },
  { id: "ex_bb_squat", name: "Barbell Back Squat", equipment: "Barbell", category: "large", muscleGroup: "Quads" },
  { id: "ex_db_lunge", name: "DB Walking Lunge", equipment: "Dumbbells", category: "large", muscleGroup: "Quads" },
  { id: "ex_bb_rdl", name: "Barbell RDL", equipment: "Barbell", category: "large", muscleGroup: "Hamstrings/Glutes" },
  { id: "ex_db_hipthrust", name: "DB Hip Thrust", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings/Glutes" },
  { id: "ex_bb_ohp", name: "Barbell Overhead Press", equipment: "Barbell", category: "small", muscleGroup: "Front Delts" },
  { id: "ex_db_curl", name: "DB Bicep Curl", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps" },
  { id: "ex_dip", name: "Bench Dips", equipment: "Bodyweight", category: "small", muscleGroup: "Triceps" },
  { id: "ex_db_skull", name: "DB Skull Crusher", equipment: "Dumbbells", category: "small", muscleGroup: "Triceps" },
  { id: "ex_band_pullapart", name: "Band Pull-Apart", equipment: "Bands", category: "small", muscleGroup: "Rear Delts" },
  { id: "ex_db_rear_fly", name: "DB Rear Delt Fly", equipment: "Dumbbells", category: "small", muscleGroup: "Rear Delts" },
  { id: "ex_db_lateral", name: "DB Lateral Raise", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts" },
  { id: "ex_band_lateral", name: "Band Lateral Raise", equipment: "Bands", category: "sideDelt", muscleGroup: "Side Delts" },
  { id: "ex_hanging_leg", name: "Hanging Leg Raise", equipment: "Pull-up Bar", category: "abs", muscleGroup: "Abs" },
  { id: "ex_plank", name: "Plank", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs" },
  { id: "ex_situp", name: "Weighted Sit-Up", equipment: "Dumbbells", category: "abs", muscleGroup: "Abs" },
  { id: "ex_pushup", name: "Push-Ups", equipment: "Bodyweight", category: "large", muscleGroup: "Chest" },
];

// 6-day full body split (Fri = rest). Weekly totals per category hit ~20 large / ~12 small / ~16 sideDelt / ~20 abs.
const DEFAULT_TEMPLATE = [
  { id: "day_mon", label: "Day 1 · Mon", exercises: [
    { exerciseId: "ex_bb_bench", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_pullup", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_bb_squat", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_hanging_leg", targetSets: 4, targetReps: 12 },
  ]},
  { id: "day_tue", label: "Day 2 · Tue", exercises: [
    { exerciseId: "ex_db_row", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_bb_rdl", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_bb_ohp", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_band_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_dip", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_plank", targetSets: 3, targetReps: 45 },
  ]},
  { id: "day_wed", label: "Day 3 · Wed", exercises: [
    { exerciseId: "ex_db_incline", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_bb_row", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_lunge", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_band_pullapart", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_situp", targetSets: 4, targetReps: 15 },
  ]},
  { id: "day_thu", label: "Day 4 · Thu", exercises: [
    { exerciseId: "ex_pushup", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_pullup", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_hipthrust", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_skull", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_hanging_leg", targetSets: 4, targetReps: 12 },
  ]},
  { id: "day_sat", label: "Day 5 · Sat", exercises: [
    { exerciseId: "ex_bb_bench", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_row", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_bb_squat", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_band_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_rear_fly", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_plank", targetSets: 3, targetReps: 45 },
  ]},
  { id: "day_sun", label: "Day 6 · Sun", exercises: [
    { exerciseId: "ex_bb_ohp", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_bb_row", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_bb_rdl", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_lateral", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_db_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_situp", targetSets: 4, targetReps: 15 },
  ]},
];

/* ---------------------------------------------------------------
   AUTO-FILL LOGIC
--------------------------------------------------------------- */

function getLastPerformance(exerciseId, allLogs) {
  const matches = [];
  for (const log of allLogs) {
    const entry = log.entries.find((e) => e.exerciseId === exerciseId);
    if (entry) matches.push({ date: log.date, sets: entry.sets });
  }
  if (matches.length === 0) return null;
  matches.sort((a, b) => new Date(b.date) - new Date(a.date));
  return matches[0];
}

function buildSessionState(dayTemplate, allLogs) {
  const state = {};
  for (const item of dayTemplate.exercises) {
    const last = getLastPerformance(item.exerciseId, allLogs);
    const sets = [];
    for (let i = 0; i < item.targetSets; i++) {
      const lastSet = last?.sets?.[i];
      sets.push({
        reps: lastSet ? lastSet.reps : item.targetReps,
        weight: lastSet ? lastSet.weight : 0,
        completed: false,
      });
    }
    state[item.exerciseId] = { sets, lastSets: last?.sets ?? null, lastDate: last?.date ?? null };
  }
  return state;
}

/* ---------------------------------------------------------------
   UI PRIMITIVES
--------------------------------------------------------------- */

function DeltaBadge({ current, last, unit }) {
  if (last === undefined || last === null || current === "" || current === null) return null;
  const diff = Number(current) - Number(last);
  if (diff === 0 || Number.isNaN(diff)) return null;
  const positive = diff > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
        positive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
      }`}
    >
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {positive ? "+" : ""}
      {diff}
      {unit}
    </span>
  );
}

function CategoryPill({ category }) {
  const map = {
    large: "bg-[#E8B33D]/15 text-[#E8B33D]",
    small: "bg-sky-500/15 text-sky-400",
    sideDelt: "bg-violet-500/15 text-violet-400",
    abs: "bg-orange-500/15 text-orange-400",
  };
  const labels = { large: "LARGE", small: "SMALL", sideDelt: "SIDE DELT", abs: "ABS" };
  return (
    <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${map[category] || "bg-white/10 text-white/60"}`}>
      {labels[category] || category?.toUpperCase()}
    </span>
  );
}

/* ---------------------------------------------------------------
   EXERCISE LIBRARY MODAL (add / edit / remove)
--------------------------------------------------------------- */

function LibraryModal({ open, onClose, library, setLibrary }) {
  const [form, setForm] = useState({ name: "", equipment: EQUIPMENT[0], category: "large", muscleGroup: "" });
  const [editingId, setEditingId] = useState(null);

  if (!open) return null;

  function resetForm() {
    setForm({ name: "", equipment: EQUIPMENT[0], category: "large", muscleGroup: "" });
    setEditingId(null);
  }

  function submit() {
    if (!form.name.trim()) return;
    if (editingId) {
      setLibrary((lib) => lib.map((ex) => (ex.id === editingId ? { ...ex, ...form } : ex)));
    } else {
      const id = "ex_custom_" + Date.now();
      setLibrary((lib) => [...lib, { id, ...form, custom: true }]);
    }
    resetForm();
  }

  function startEdit(ex) {
    setEditingId(ex.id);
    setForm({ name: ex.name, equipment: ex.equipment, category: ex.category, muscleGroup: ex.muscleGroup });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1E2027] w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-bold tracking-wide uppercase text-sm text-white flex items-center gap-2">
            <Library size={16} className="text-[#E8B33D]" /> Exercise Library
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-white/10 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Exercise name"
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
            >
              {EQUIPMENT.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <input
            value={form.muscleGroup}
            onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
            placeholder="Muscle group (e.g. Chest)"
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="flex-1 bg-[#E8B33D] text-[#14151A] font-bold text-sm rounded-lg py-2 hover:brightness-110 transition"
            >
              {editingId ? "Save Changes" : "Add Exercise"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="px-3 rounded-lg border border-white/15 text-white/60 text-sm">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-2">
          {library.map((ex) => (
            <div key={ex.id} className="flex items-center justify-between bg-[#14151A] rounded-lg px-3 py-2 border border-white/5">
              <div className="min-w-0">
                <div className="text-sm text-white font-medium truncate">{ex.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CategoryPill category={ex.category} />
                  <span className="text-[10px] text-white/40">{ex.equipment} · {ex.muscleGroup}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => startEdit(ex)} className="p-1.5 text-white/40 hover:text-white">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setLibrary((lib) => lib.filter((e) => e.id !== ex.id))}
                  className="p-1.5 text-white/40 hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SWAP / ADD EXERCISE PICKER (in-session)
--------------------------------------------------------------- */

function ExercisePicker({ open, onClose, library, onPick }) {
  const [q, setQ] = useState("");
  if (!open) return null;
  const filtered = library.filter((ex) => ex.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
      <div className="bg-[#1E2027] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[75vh] flex flex-col border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">Choose Exercise</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4 border-b border-white/10">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => { onPick(ex); onClose(); }}
              className="w-full text-left flex items-center justify-between bg-[#14151A] hover:bg-[#262933] rounded-lg px-3 py-2.5 border border-white/5 transition"
            >
              <span className="text-sm text-white">{ex.name}</span>
              <CategoryPill category={ex.category} />
            </button>
          ))}
          {filtered.length === 0 && <p className="text-center text-white/30 text-sm py-6">No matches</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   EXERCISE CARD (within a session)
--------------------------------------------------------------- */

function ExerciseCard({ item, exercise, session, updateSet, onSwap, onRemove, onAddSet }) {
  const [open, setOpen] = useState(true);
  if (!exercise) return null;
  const allDone = session.sets.length > 0 && session.sets.every((s) => s.completed);

  return (
    <div className={`rounded-xl border ${allDone ? "border-emerald-500/30" : "border-white/10"} bg-[#1E2027] overflow-hidden`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${allDone ? "bg-emerald-400" : "bg-white/20"}`} />
          <div className="min-w-0 text-left">
            <div className="text-sm font-semibold text-white truncate">{exercise.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CategoryPill category={exercise.category} />
              <span className="text-[10px] text-white/40">{exercise.equipment}</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-white/40 shrink-0" /> : <ChevronDown size={16} className="text-white/40 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-[24px_1fr_1fr_28px] gap-2 text-[10px] uppercase tracking-wider text-white/30 font-semibold px-1 mb-1.5">
            <span>#</span>
            <span>Reps</span>
            <span>Weight (kg)</span>
            <span></span>
          </div>
          <div className="space-y-2">
            {session.sets.map((set, i) => {
              const lastSet = session.lastSets?.[i];
              return (
                <div key={i} className="grid grid-cols-[24px_1fr_1fr_28px] gap-2 items-center">
                  <span className="text-xs font-mono text-white/40 text-center">{i + 1}</span>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(e) => updateSet(i, "reps", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#14151A] border border-white/10 rounded-lg px-2.5 py-2 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
                    />
                    <div className="absolute -bottom-4 left-0"><DeltaBadge current={set.reps} last={lastSet?.reps} unit="" /></div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(e) => updateSet(i, "weight", e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#14151A] border border-white/10 rounded-lg px-2.5 py-2 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
                    />
                    <div className="absolute -bottom-4 left-0"><DeltaBadge current={set.weight} last={lastSet?.weight} unit="kg" /></div>
                  </div>
                  <button
                    onClick={() => updateSet(i, "completed", !set.completed)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition ${
                      set.completed ? "bg-[#E8B33D] border-[#E8B33D] text-[#14151A]" : "border-white/15 text-transparent"
                    }`}
                  >
                    <Check size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <button onClick={onAddSet} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2 py-1">
              <Plus size={12} /> Add set
            </button>
            <button onClick={onSwap} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2 py-1 ml-auto">
              <RotateCcw size={12} /> Swap
            </button>
            <button onClick={onRemove} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-rose-400 px-2 py-1">
              <X size={12} /> Remove
            </button>
          </div>

          {session.lastDate && (
            <p className="text-[10px] text-white/30 mt-2">
              Last performed {new Date(session.lastDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------- */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [library, setLibrary] = useState(DEFAULT_EXERCISES);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [logs, setLogs] = useState([]);
  const [activeDayId, setActiveDayId] = useState(DEFAULT_TEMPLATE[0].id);
  const [session, setSession] = useState({});
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // { mode: 'swap'|'add', exerciseId }
  const [toast, setToast] = useState("");

  // initial load
  useEffect(() => {
    (async () => {
      const [lib, tmpl, storedLogs] = await Promise.all([
        loadKey("exercise-library", DEFAULT_EXERCISES),
        loadKey("workout-template", DEFAULT_TEMPLATE),
        loadKey("workout-logs", []),
      ]);
      setLibrary(lib);
      setTemplate(tmpl);
      setLogs(storedLogs);
      setLoading(false);
    })();
  }, []);

  // persist on change (skip initial load flash)
  useEffect(() => { if (!loading) saveKey("exercise-library", library); }, [library, loading]);
  useEffect(() => { if (!loading) saveKey("workout-template", template); }, [template, loading]);
  useEffect(() => { if (!loading) saveKey("workout-logs", logs); }, [logs, loading]);

  const activeDay = template.find((d) => d.id === activeDayId);

  const libraryMap = useMemo(() => Object.fromEntries(library.map((e) => [e.id, e])), [library]);

  // rebuild session (auto-fill) when day or logs change
  useEffect(() => {
    if (loading || !activeDay) return;
    setSession(buildSessionState(activeDay, logs));
  }, [activeDayId, loading, logs, template]);

  const updateSet = useCallback((exerciseId, index, field, value) => {
    setSession((prev) => {
      const ex = prev[exerciseId];
      const sets = ex.sets.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...prev, [exerciseId]: { ...ex, sets } };
    });
  }, []);

  const addSet = (exerciseId) => {
    setSession((prev) => {
      const ex = prev[exerciseId];
      const last = ex.sets[ex.sets.length - 1];
      return { ...prev, [exerciseId]: { ...ex, sets: [...ex.sets, { reps: last?.reps ?? 8, weight: last?.weight ?? 0, completed: false }] } };
    });
  };

  const removeExercise = (exerciseId) => {
    setTemplate((prev) =>
      prev.map((d) => (d.id === activeDayId ? { ...d, exercises: d.exercises.filter((e) => e.exerciseId !== exerciseId) } : d))
    );
  };

  const swapExercise = (oldId, newExercise) => {
    setTemplate((prev) =>
      prev.map((d) =>
        d.id === activeDayId
          ? { ...d, exercises: d.exercises.map((e) => (e.exerciseId === oldId ? { ...e, exerciseId: newExercise.id } : e)) }
          : d
      )
    );
  };

  const addExerciseToDay = (exercise) => {
    setTemplate((prev) =>
      prev.map((d) =>
        d.id === activeDayId ? { ...d, exercises: [...d.exercises, { exerciseId: exercise.id, targetSets: 3, targetReps: 10 }] } : d
      )
    );
  };

  const finishSession = () => {
    const entries = Object.entries(session)
      .filter(([, s]) => s.sets.some((set) => set.completed))
      .map(([exerciseId, s]) => ({
        exerciseId,
        sets: s.sets.filter((set) => set.completed).map(({ reps, weight }) => ({ reps: Number(reps) || 0, weight: Number(weight) || 0 })),
      }));
    if (entries.length === 0) {
      setToast("Log at least one completed set first");
      setTimeout(() => setToast(""), 2000);
      return;
    }
    const log = { id: "log_" + Date.now(), dayId: activeDayId, date: new Date().toISOString(), entries };
    setLogs((prev) => [...prev, log]);
    setToast("Session saved ✓");
    setTimeout(() => setToast(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14151A] flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
          <Dumbbell className="animate-pulse" size={18} /> Loading session...
        </div>
      </div>
    );
  }

  const totalSets = activeDay ? activeDay.exercises.reduce((n, e) => n + (session[e.exerciseId]?.sets.length ?? e.targetSets), 0) : 0;
  const doneSets = activeDay
    ? activeDay.exercises.reduce((n, e) => n + (session[e.exerciseId]?.sets.filter((s) => s.completed).length ?? 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#14151A] text-white font-sans pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#14151A]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Full Body · 6 Day Split</p>
              <h1 className="text-xl font-extrabold tracking-tight uppercase">Session Log</h1>
            </div>
            <button
              onClick={() => setLibraryOpen(true)}
              className="flex items-center gap-1.5 bg-[#1E2027] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:text-white"
            >
              <Library size={14} /> Library
            </button>
          </div>

          {/* Day selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
            {template.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDayId(d.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition ${
                  d.id === activeDayId ? "bg-[#E8B33D] text-[#14151A]" : "bg-[#1E2027] text-white/50 border border-white/10"
                }`}
              >
                {d.label}
              </button>
            ))}
            <div className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-transparent border border-dashed border-white/15 text-white/30">
              Fri · Rest
            </div>
          </div>

          {/* progress bar */}
          <div className="mt-3">
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-[#E8B33D] transition-all"
                style={{ width: `${totalSets ? (doneSets / totalSets) * 100 : 0}%` }}
              />
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">{doneSets}/{totalSets} sets completed</p>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="max-w-lg mx-auto px-4 pt-5 space-y-3">
        {activeDay?.exercises.map((item) => (
          <ExerciseCard
            key={item.exerciseId}
            item={item}
            exercise={libraryMap[item.exerciseId]}
            session={session[item.exerciseId] ?? { sets: [], lastSets: null, lastDate: null }}
            updateSet={(i, field, value) => updateSet(item.exerciseId, i, field, value)}
            onAddSet={() => addSet(item.exerciseId)}
            onSwap={() => setPickerTarget({ mode: "swap", exerciseId: item.exerciseId })}
            onRemove={() => removeExercise(item.exerciseId)}
          />
        ))}

        <button
          onClick={() => setPickerTarget({ mode: "add" })}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 rounded-xl py-3 text-sm text-white/50 hover:text-white hover:border-white/30 transition"
        >
          <Plus size={16} /> Add Exercise to Today
        </button>
      </div>

      {/* Finish bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#14151A]/95 backdrop-blur border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={finishSession}
            className="w-full bg-[#E8B33D] text-[#14151A] font-extrabold uppercase tracking-wide text-sm py-3.5 rounded-xl hover:brightness-110 transition"
          >
            Finish Session
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#262933] border border-white/10 text-sm text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <LibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} library={library} setLibrary={setLibrary} />

      <ExercisePicker
        open={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        library={library}
        onPick={(ex) => {
          if (pickerTarget?.mode === "swap") swapExercise(pickerTarget.exerciseId, ex);
          else addExerciseToDay(ex);
        }}
      />
    </div>
  );
}
