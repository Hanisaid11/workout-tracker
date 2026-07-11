import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Minus, Check, ChevronDown, ChevronUp, Dumbbell, Library, X, TrendingUp, TrendingDown, RotateCcw, Trash2, Pencil, Languages, Settings } from "lucide-react";
import { loadKey, saveKey } from "./storage.js";
import { t, localizedName, localizedMuscleGroup, localizedDayLabel } from "./i18n.js";
import { ExerciseIcon, getMuscleStyle } from "./exerciseIcons.jsx";

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

// Weekday helpers for the configurable schedule (JS getDay convention: 0=Sun..6=Sat)
const WEEKDAY_ORDER_FROM_SAT = [6, 0, 1, 2, 3, 4, 5]; // Sat, Sun, Mon, Tue, Wed, Thu, Fri
const WEEKDAY_NAMES_EN = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
const WEEKDAY_NAMES_AR = { 0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت" };
const ORDINAL_EN = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];
const ORDINAL_AR = ["اليوم الأول", "اليوم الثاني", "اليوم الثالث", "اليوم الرابع", "اليوم الخامس", "اليوم السادس"];
const DEFAULT_DAY_SETTINGS = { count: 6, restWeekday: 5 }; // 5 = Friday

function getTrainingWeekdays(daySettings) {
  const order = WEEKDAY_ORDER_FROM_SAT.filter((d) => d !== daySettings.restWeekday);
  return order.slice(0, daySettings.count);
}

function getDayLabel(index, weekday, lang) {
  const ordinal = (lang === "ar" ? ORDINAL_AR : ORDINAL_EN)[index] || `${lang === "ar" ? "اليوم" : "Day"} ${index + 1}`;
  const weekdayName = (lang === "ar" ? WEEKDAY_NAMES_AR : WEEKDAY_NAMES_EN)[weekday];
  return `${ordinal} · ${weekdayName}`;
}

const DEFAULT_EXERCISES = [
  // Chest
  { id: "ex_bb_bench", name: "Barbell Bench Press", nameAr: "ضغط البار الأفقي", equipment: "Barbell", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_db_bench", name: "DB Flat Bench Press", nameAr: "ضغط الدمبل الأفقي", equipment: "Dumbbells", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_db_incline", name: "DB Incline Press", nameAr: "ضغط الدمبل المائل", equipment: "Dumbbells", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_bb_close_grip_bench", name: "Close-Grip Bench Press", nameAr: "ضغط البار بقبضة ضيقة", equipment: "Barbell", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_pushup", name: "Push-Ups", nameAr: "تمرين الضغط الأرضي", equipment: "Bodyweight", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_diamond_pushup", name: "Diamond Push-Ups", nameAr: "الضغط الماسي", equipment: "Bodyweight", category: "small", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_decline_pushup", name: "Decline Push-Ups", nameAr: "الضغط المنحدر", equipment: "Bench", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },

  // Back
  { id: "ex_pullup", name: "Pull-Ups", nameAr: "العقلة", equipment: "Pull-up Bar", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_chinup", name: "Chin-Ups", nameAr: "العقلة بقبضة معكوسة", equipment: "Pull-up Bar", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_db_row", name: "DB Bent-Over Row", nameAr: "التجديف بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_bb_row", name: "Barbell Row", nameAr: "التجديف بالبار", equipment: "Barbell", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_band_row", name: "Band Seated Row", nameAr: "التجديف الجالس بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_renegade_row", name: "DB Renegade Row", nameAr: "تجديف الدمبل في وضعية الضغط", equipment: "Dumbbells", category: "small", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_bb_shrug", name: "Barbell Shrug", nameAr: "رفع الكتفين بالبار", equipment: "Barbell", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_superman", name: "Superman Hold", nameAr: "تمرين السوبرمان", equipment: "Bodyweight", category: "small", muscleGroup: "Back", muscleGroupAr: "الظهر" },

  // Legs
  { id: "ex_bb_squat", name: "Barbell Back Squat", nameAr: "القرفصاء بالبار", equipment: "Barbell", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_bb_front_squat", name: "Barbell Front Squat", nameAr: "القرفصاء الأمامية بالبار", equipment: "Barbell", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_goblet_squat", name: "DB Goblet Squat", nameAr: "قرفصاء الكأس بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_band_squat", name: "Band Squat", nameAr: "القرفصاء بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_lunge", name: "DB Walking Lunge", nameAr: "الاندفاع الأمامي المتحرك بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_reverse_lunge", name: "DB Reverse Lunge", nameAr: "الاندفاع الخلفي بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_stepup", name: "DB Box Step-Up", nameAr: "الصعود على المقعد بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_bb_rdl", name: "Barbell RDL", nameAr: "الرفع الميت الروماني بالبار", equipment: "Barbell", category: "large", muscleGroup: "Hamstrings/Glutes", muscleGroupAr: "الفخذ الخلفي والأرداف" },
  { id: "ex_db_rdl_single", name: "Single-Leg DB RDL", nameAr: "الرفع الميت الروماني بالدمبل على رجل واحدة", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings/Glutes", muscleGroupAr: "الفخذ الخلفي والأرداف" },
  { id: "ex_band_good_morning", name: "Band Good Morning", nameAr: "تمرين الانحناء الصباحي بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Hamstrings/Glutes", muscleGroupAr: "الفخذ الخلفي والأرداف" },
  { id: "ex_db_hipthrust", name: "DB Hip Thrust", nameAr: "دفع الحوض بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings/Glutes", muscleGroupAr: "الفخذ الخلفي والأرداف" },
  { id: "ex_glute_bridge", name: "Bodyweight Glute Bridge", nameAr: "جسر الأرداف بوزن الجسم", equipment: "Bodyweight", category: "small", muscleGroup: "Hamstrings/Glutes", muscleGroupAr: "الفخذ الخلفي والأرداف" },
  { id: "ex_db_calf_raise", name: "DB Calf Raise", nameAr: "رفع السمانة بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Calves", muscleGroupAr: "السمانة" },

  // Shoulders (front / overhead)
  { id: "ex_bb_ohp", name: "Barbell Overhead Press", nameAr: "الضغط العلوي بالبار", equipment: "Barbell", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },
  { id: "ex_db_arnold_press", name: "DB Arnold Press", nameAr: "ضغط أرنولد بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },
  { id: "ex_pike_pushup", name: "Pike Push-Up", nameAr: "ضغط الحمامة", equipment: "Bodyweight", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },

  // Arms
  { id: "ex_db_curl", name: "DB Bicep Curl", nameAr: "تجعيد العضلة ذات الرأسين بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_db_hammer_curl", name: "DB Hammer Curl", nameAr: "تجعيد المطرقة بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_band_curl", name: "Band Bicep Curl", nameAr: "تجعيد الذراع بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_dip", name: "Bench Dips", nameAr: "ثني الذراعين على المقعد", equipment: "Bodyweight", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_db_skull", name: "DB Skull Crusher", nameAr: "كسارة الجماجم بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_db_overhead_tricep", name: "DB Overhead Triceps Extension", nameAr: "مد الذراع العلوي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_band_tricep_pushdown", name: "Band Triceps Pushdown", nameAr: "دفع الذراع لأسفل بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },

  // Rear delts
  { id: "ex_band_pullapart", name: "Band Pull-Apart", nameAr: "شدّ الحبل المطاطي للخلف", equipment: "Bands", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },
  { id: "ex_db_rear_fly", name: "DB Rear Delt Fly", nameAr: "طيران الكتف الخلفي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },
  { id: "ex_band_facepull", name: "Band Face Pull", nameAr: "السحب نحو الوجه بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },

  // Side delts
  { id: "ex_db_lateral", name: "DB Lateral Raise", nameAr: "الرفع الجانبي بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },
  { id: "ex_band_lateral", name: "Band Lateral Raise", nameAr: "الرفع الجانبي بالحبل المطاطي", equipment: "Bands", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },

  // Abs
  { id: "ex_hanging_leg", name: "Hanging Leg Raise", nameAr: "رفع الأرجل معلقًا", equipment: "Pull-up Bar", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_plank", name: "Plank", nameAr: "تمرين البلانك", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_side_plank", name: "Side Plank", nameAr: "البلانك الجانبي", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_situp", name: "Weighted Sit-Up", nameAr: "تمرين الجلوس بثقل إضافي", equipment: "Dumbbells", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_bicycle_crunch", name: "Bicycle Crunch", nameAr: "تمرين البطن الدرّاجة", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_russian_twist", name: "Russian Twist", nameAr: "الالتفاف الروسي", equipment: "Dumbbells", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_mountain_climber", name: "Mountain Climbers", nameAr: "تسلّق الجبل", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
];

// 6-day full body split — week starts Saturday, Friday is the rest day.
// Equipment priority: Dumbbells / Pull-up Bar / Bands first, Barbell used sparingly.
// Weekly totals per category land near ~20 large / ~12 small / ~16 sideDelt / ~20 abs.
const DEFAULT_TEMPLATE = [
  { id: "day_sat", label: "Day 1 · Sat", labelAr: "اليوم الأول · السبت", exercises: [
    { exerciseId: "ex_db_incline", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_pullup", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_goblet_squat", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_hanging_leg", targetSets: 4, targetReps: 12 },
  ]},
  { id: "day_sun", label: "Day 2 · Sun", labelAr: "اليوم الثاني · الأحد", exercises: [
    { exerciseId: "ex_db_row", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_bb_rdl", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_arnold_press", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_band_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_dip", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_plank", targetSets: 3, targetReps: 45 },
  ]},
  { id: "day_mon", label: "Day 3 · Mon", labelAr: "اليوم الثالث · الاثنين", exercises: [
    { exerciseId: "ex_db_bench", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_chinup", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_lunge", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_band_pullapart", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_situp", targetSets: 4, targetReps: 15 },
  ]},
  { id: "day_tue", label: "Day 4 · Tue", labelAr: "اليوم الرابع · الثلاثاء", exercises: [
    { exerciseId: "ex_pushup", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_pullup", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_hipthrust", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_band_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_skull", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_hanging_leg", targetSets: 4, targetReps: 12 },
  ]},
  { id: "day_wed", label: "Day 5 · Wed", labelAr: "اليوم الخامس · الأربعاء", exercises: [
    { exerciseId: "ex_db_incline", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_band_row", targetSets: 4, targetReps: 12 },
    { exerciseId: "ex_db_reverse_lunge", targetSets: 3, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_rear_fly", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_plank", targetSets: 3, targetReps: 45 },
  ]},
  { id: "day_thu", label: "Day 6 · Thu", labelAr: "اليوم السادس · الخميس", exercises: [
    { exerciseId: "ex_db_arnold_press", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_chinup", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_rdl_single", targetSets: 3, targetReps: 8 },
    { exerciseId: "ex_db_lateral", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_db_hammer_curl", targetSets: 2, targetReps: 12 },
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

function CategoryPill({ category, lang = "en" }) {
  const map = {
    large: "bg-[#E8B33D]/15 text-[#E8B33D]",
    small: "bg-sky-500/15 text-sky-400",
    sideDelt: "bg-violet-500/15 text-violet-400",
    abs: "bg-orange-500/15 text-orange-400",
  };
  const labels = {
    large: t(lang, "categoryLarge"),
    small: t(lang, "categorySmall"),
    sideDelt: t(lang, "categorySideDelt"),
    abs: t(lang, "categoryAbs"),
  };
  return (
    <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${map[category] || "bg-white/10 text-white/60"}`}>
      {labels[category] || category?.toUpperCase()}
    </span>
  );
}

/* ---------------------------------------------------------------
   EXERCISE LIBRARY MODAL (add / edit / remove)
--------------------------------------------------------------- */

function LibraryModal({ open, onClose, library, setLibrary, lang }) {
  const [form, setForm] = useState({ name: "", nameAr: "", equipment: EQUIPMENT[0], category: "large", muscleGroup: "", muscleGroupAr: "" });
  const [editingId, setEditingId] = useState(null);

  if (!open) return null;

  function resetForm() {
    setForm({ name: "", nameAr: "", equipment: EQUIPMENT[0], category: "large", muscleGroup: "", muscleGroupAr: "" });
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
    setForm({
      name: ex.name,
      nameAr: ex.nameAr || "",
      equipment: ex.equipment,
      category: ex.category,
      muscleGroup: ex.muscleGroup,
      muscleGroupAr: ex.muscleGroupAr || "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1E2027] w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-bold tracking-wide uppercase text-sm text-white flex items-center gap-2">
            <Library size={16} className="text-[#E8B33D]" /> {t(lang, "exerciseLibrary")}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 border-b border-white/10 space-y-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t(lang, "exerciseName")}
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
          <input
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            placeholder={t(lang, "exerciseNameAr")}
            dir="rtl"
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
            placeholder={t(lang, "muscleGroupPlaceholder")}
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="flex-1 bg-[#E8B33D] text-[#14151A] font-bold text-sm rounded-lg py-2 hover:brightness-110 transition"
            >
              {editingId ? t(lang, "saveChanges") : t(lang, "addExercise")}
            </button>
            {editingId && (
              <button onClick={resetForm} className="px-3 rounded-lg border border-white/15 text-white/60 text-sm">
                {t(lang, "cancel")}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-2">
          {library.map((ex) => {
            const style = getMuscleStyle(ex.muscleGroup);
            return (
              <div key={ex.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 border ${style.bg} ${style.border}`}>
                <ExerciseIcon exerciseId={ex.id} category={ex.category} muscleGroup={ex.muscleGroup} className="w-9 h-9" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white font-medium truncate">{localizedName(ex, lang)}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CategoryPill category={ex.category} lang={lang} />
                    <span className="text-[10px] text-white/40">{ex.equipment} · {localizedMuscleGroup(ex, lang)}</span>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SWAP / ADD EXERCISE PICKER (in-session)
--------------------------------------------------------------- */

/* ---------------------------------------------------------------
   SETTINGS MODAL (training days per week + rest day)
--------------------------------------------------------------- */

function SettingsModal({ open, onClose, daySettings, setDaySettings, lang }) {
  if (!open) return null;
  const weekdayNames = lang === "ar" ? WEEKDAY_NAMES_AR : WEEKDAY_NAMES_EN;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#1E2027] w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-bold tracking-wide uppercase text-sm text-white flex items-center gap-2">
            <Settings size={16} className="text-[#E8B33D]" /> {t(lang, "settings")}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="text-xs text-white/50 font-semibold block mb-2">{t(lang, "trainingDaysLabel")}</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setDaySettings((d) => ({ ...d, count: n }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${
                    daySettings.count === n
                      ? "bg-[#E8B33D] border-[#E8B33D] text-[#14151A]"
                      : "border-white/10 text-white/60"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-white/50 font-semibold block mb-2">{t(lang, "restDayLabel")}</label>
            <select
              value={daySettings.restWeekday}
              onChange={(e) => setDaySettings((d) => ({ ...d, restWeekday: Number(e.target.value) }))}
              className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((wd) => (
                <option key={wd} value={wd}>{weekdayNames[wd]}</option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-white/30 leading-relaxed">{t(lang, "settingsHint")}</p>
        </div>
      </div>
    </div>
  );
}

function ExercisePicker({ open, onClose, library, onPick, lang }) {
  const [q, setQ] = useState("");
  if (!open) return null;
  const filtered = library.filter(
    (ex) => ex.name.toLowerCase().includes(q.toLowerCase()) || (ex.nameAr || "").includes(q)
  );
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
      <div className="bg-[#1E2027] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[75vh] flex flex-col border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white">{t(lang, "chooseExercise")}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4 border-b border-white/10">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t(lang, "search")}
            className="w-full bg-[#14151A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#E8B33D]"
          />
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
          {filtered.map((ex) => {
            const style = getMuscleStyle(ex.muscleGroup);
            return (
              <button
                key={ex.id}
                onClick={() => { onPick(ex); onClose(); }}
                className={`w-full text-left flex items-center gap-3 rounded-lg px-3 py-2.5 border transition hover:brightness-125 ${style.bg} ${style.border}`}
              >
                <ExerciseIcon exerciseId={ex.id} category={ex.category} muscleGroup={ex.muscleGroup} className="w-9 h-9" />
                <span className="text-sm text-white flex-1">{localizedName(ex, lang)}</span>
                <CategoryPill category={ex.category} lang={lang} />
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-white/30 text-sm py-6">{t(lang, "noMatches")}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   EXERCISE CARD (within a session)
--------------------------------------------------------------- */

function ExerciseCard({ item, exercise, session, updateSet, onSwap, onRemove, onAddSet, lang }) {
  const [open, setOpen] = useState(true);
  if (!exercise) return null;
  const allDone = session.sets.length > 0 && session.sets.every((s) => s.completed);
  const style = getMuscleStyle(exercise.muscleGroup);

  return (
    <div className={`rounded-xl border ${allDone ? "border-emerald-500/40" : style.border} ${style.bg} overflow-hidden`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <ExerciseIcon exerciseId={exercise.id} category={exercise.category} muscleGroup={exercise.muscleGroup} className="w-12 h-12" />
          <div className={`w-2 h-2 rounded-full shrink-0 ${allDone ? "bg-emerald-400" : "bg-white/20"}`} />
          <div className="min-w-0 text-left">
            <div className="text-sm font-semibold text-white truncate">{localizedName(exercise, lang)}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CategoryPill category={exercise.category} lang={lang} />
              <span className="text-[10px] text-white/40">{exercise.equipment}</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-white/40 shrink-0" /> : <ChevronDown size={16} className="text-white/40 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-[24px_1fr_1fr_28px] gap-2 text-[10px] uppercase tracking-wider text-white/30 font-semibold px-1 mb-1.5">
            <span>{t(lang, "hash")}</span>
            <span>{t(lang, "reps")}</span>
            <span>{t(lang, "weight")}</span>
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
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition ${
                      set.completed
                        ? "bg-[#E8B33D] border-[#E8B33D] text-[#14151A]"
                        : "bg-white/[0.04] border-white/25 text-transparent"
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
              <Plus size={12} /> {t(lang, "addSet")}
            </button>
            <button onClick={onSwap} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2 py-1 ml-auto">
              <RotateCcw size={12} /> {t(lang, "swap")}
            </button>
            <button onClick={onRemove} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-rose-400 px-2 py-1">
              <X size={12} /> {t(lang, "remove")}
            </button>
          </div>

          {session.lastDate && (
            <p className="text-[10px] text-white/30 mt-2">
              {t(lang, "lastPerformed")} {new Date(session.lastDate).toLocaleDateString(lang === "ar" ? "ar-EG" : undefined, { month: "short", day: "numeric" })}
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // { mode: 'swap'|'add', exerciseId }
  const [toast, setToast] = useState("");
  const [lang, setLang] = useState("en");
  const [daySettings, setDaySettings] = useState(DEFAULT_DAY_SETTINGS);

  // initial load
  useEffect(() => {
    (async () => {
      const [lib, tmpl, storedLogs, storedLang, storedDaySettings] = await Promise.all([
        loadKey("exercise-library", DEFAULT_EXERCISES),
        loadKey("workout-template", DEFAULT_TEMPLATE),
        loadKey("workout-logs", []),
        loadKey("language", "en"),
        loadKey("day-settings", DEFAULT_DAY_SETTINGS),
      ]);
      setLibrary(lib);
      setTemplate(tmpl);
      setLogs(storedLogs);
      setLang(storedLang);
      setDaySettings(storedDaySettings);
      setLoading(false);
    })();
  }, []);

  // persist on change (skip initial load flash)
  useEffect(() => { if (!loading) saveKey("exercise-library", library); }, [library, loading]);
  useEffect(() => { if (!loading) saveKey("workout-template", template); }, [template, loading]);
  useEffect(() => { if (!loading) saveKey("workout-logs", logs); }, [logs, loading]);
  useEffect(() => { if (!loading) saveKey("language", lang); }, [lang, loading]);
  useEffect(() => { if (!loading) saveKey("day-settings", daySettings); }, [daySettings, loading]);

  // flip document direction for Arabic
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  // visible training days derived from settings (truncate/reorder the 6 base day templates)
  const visibleDays = useMemo(() => {
    const weekdays = getTrainingWeekdays(daySettings);
    return template.slice(0, daySettings.count).map((d, i) => ({
      ...d,
      weekday: weekdays[i],
      computedLabel: getDayLabel(i, weekdays[i], "en"),
      computedLabelAr: getDayLabel(i, weekdays[i], "ar"),
    }));
  }, [template, daySettings]);

  // keep the active day valid if the day count shrinks
  useEffect(() => {
    if (loading) return;
    if (!visibleDays.find((d) => d.id === activeDayId) && visibleDays.length > 0) {
      setActiveDayId(visibleDays[0].id);
    }
  }, [visibleDays, activeDayId, loading]);

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
      setToast(t(lang, "logAtLeastOneSet"));
      setTimeout(() => setToast(""), 2000);
      return;
    }
    const log = { id: "log_" + Date.now(), dayId: activeDayId, date: new Date().toISOString(), entries };
    setLogs((prev) => [...prev, log]);
    setToast(t(lang, "sessionSaved"));
    setTimeout(() => setToast(""), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14151A] flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
          <Dumbbell className="animate-pulse" size={18} /> {t(lang, "loadingSession")}
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
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">{t(lang, "appEyebrow")}</p>
              <h1 className="text-xl font-extrabold tracking-tight uppercase">{t(lang, "appTitle")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
                className="flex items-center gap-1.5 bg-[#1E2027] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:text-white"
                title="EN / AR"
              >
                <Languages size={14} /> {lang === "en" ? "AR" : "EN"}
              </button>
              <button
                onClick={() => setLibraryOpen(true)}
                className="flex items-center gap-1.5 bg-[#1E2027] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:text-white"
              >
                <Library size={14} /> {t(lang, "library")}
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-1.5 bg-[#1E2027] border border-white/10 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/70 hover:text-white"
                title={t(lang, "settings")}
              >
                <Settings size={14} />
              </button>
            </div>
          </div>

          {/* Day selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
            {visibleDays.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDayId(d.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition ${
                  d.id === activeDayId ? "bg-[#E8B33D] text-[#14151A]" : "bg-[#1E2027] text-white/50 border border-white/10"
                }`}
              >
                {lang === "ar" ? d.computedLabelAr : d.computedLabel}
              </button>
            ))}
            <div className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-transparent border border-dashed border-white/15 text-white/30">
              {(lang === "ar" ? WEEKDAY_NAMES_AR : WEEKDAY_NAMES_EN)[daySettings.restWeekday]} · {lang === "ar" ? "راحة" : "Rest"}
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
            <p className="text-[10px] text-white/40 mt-1 font-mono">{doneSets}/{totalSets} {t(lang, "setsCompleted")}</p>
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
            lang={lang}
          />
        ))}

        <button
          onClick={() => setPickerTarget({ mode: "add" })}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 rounded-xl py-3 text-sm text-white/50 hover:text-white hover:border-white/30 transition"
        >
          <Plus size={16} /> {t(lang, "addExerciseToday")}
        </button>
      </div>

      {/* Finish bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#14151A]/95 backdrop-blur border-t border-white/10 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={finishSession}
            className="w-full bg-[#E8B33D] text-[#14151A] font-extrabold uppercase tracking-wide text-sm py-3.5 rounded-xl hover:brightness-110 transition"
          >
            {t(lang, "finishSession")}
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#262933] border border-white/10 text-sm text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <LibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} library={library} setLibrary={setLibrary} lang={lang} />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        daySettings={daySettings}
        setDaySettings={setDaySettings}
        lang={lang}
      />

      <ExercisePicker
        open={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        library={library}
        lang={lang}
        onPick={(ex) => {
          if (pickerTarget?.mode === "swap") swapExercise(pickerTarget.exerciseId, ex);
          else addExerciseToDay(ex);
        }}
      />
    </div>
  );
}
