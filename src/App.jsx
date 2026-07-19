import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Plus, Minus, Check, ChevronDown, ChevronUp, Dumbbell, Library, X, TrendingUp, TrendingDown, RotateCcw, Trash2, Pencil, Languages, Settings, Info } from "lucide-react";
import { loadKey, saveKey } from "./storage.js";
import { t, localizedName, localizedMuscleGroup, localizedDayLabel } from "./i18n.js";
import { ExerciseIcon, getMuscleStyle, EXERCISE_ICON_MAP } from "./exerciseIcons.jsx";
import { getInstructions } from "./exerciseInstructions.js";

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
  { id: "ex_superman", name: "Superman Hold", nameAr: "تمرين السوبرمان", equipment: "Bodyweight", category: "small", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },

  // Legs
  { id: "ex_bb_squat", name: "Barbell Back Squat", nameAr: "القرفصاء بالبار", equipment: "Barbell", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_bb_front_squat", name: "Barbell Front Squat", nameAr: "القرفصاء الأمامية بالبار", equipment: "Barbell", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_goblet_squat", name: "DB Goblet Squat", nameAr: "قرفصاء الكأس بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_band_squat", name: "Band Squat", nameAr: "القرفصاء بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_lunge", name: "DB Walking Lunge", nameAr: "الاندفاع الأمامي المتحرك بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_reverse_lunge", name: "DB Reverse Lunge", nameAr: "الاندفاع الخلفي بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_stepup", name: "DB Box Step-Up", nameAr: "الصعود على المقعد بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_bb_rdl", name: "Barbell RDL", nameAr: "الرفع الميت الروماني بالبار", equipment: "Barbell", category: "large", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_db_rdl_single", name: "Single-Leg DB RDL", nameAr: "الرفع الميت الروماني بالدمبل على رجل واحدة", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_band_good_morning", name: "Band Good Morning", nameAr: "تمرين الانحناء الصباحي بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },
  { id: "ex_db_hipthrust", name: "DB Hip Thrust", nameAr: "دفع الحوض بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_glute_bridge", name: "Bodyweight Glute Bridge", nameAr: "جسر الأرداف بوزن الجسم", equipment: "Bodyweight", category: "small", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
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
  { id: "ex_reverse_crunch", name: "Reverse Crunch", nameAr: "تمرين البطن العكسي", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_vup", name: "V-Up", nameAr: "تمرين الطية", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_flutter_kicks", name: "Flutter Kicks", nameAr: "ركلات الرفرفة", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_dead_bug", name: "Dead Bug", nameAr: "تمرين الحشرة الميتة", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_hollow_hold", name: "Hollow Body Hold", nameAr: "تمرين الجسم المجوف", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_band_pallof", name: "Band Pallof Press", nameAr: "ضغط بالوف بالحبل المطاطي", equipment: "Bands", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_toe_touch", name: "Toe Touches", nameAr: "لمس أصابع القدم", equipment: "Bodyweight", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_side_bend", name: "DB Side Bend", nameAr: "الانحناء الجانبي بالدمبل", equipment: "Dumbbells", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },
  { id: "ex_db_situp_incline", name: "Incline Bench Sit-Up", nameAr: "تمرين الجلوس على مقعد مائل", equipment: "Bench", category: "abs", muscleGroup: "Abs", muscleGroupAr: "البطن" },

  // more Chest
  { id: "ex_db_flat_fly", name: "DB Flat Fly", nameAr: "فتح الصدر بالدمبل مستلقيًا", equipment: "Dumbbells", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_db_incline_fly", name: "DB Incline Fly", nameAr: "فتح الصدر المائل بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_band_chest_press", name: "Band Chest Press", nameAr: "ضغط الصدر بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_wide_pushup", name: "Wide Push-Up", nameAr: "ضغط بقبضة واسعة", equipment: "Bodyweight", category: "small", muscleGroup: "Chest", muscleGroupAr: "الصدر" },
  { id: "ex_archer_pushup", name: "Archer Push-Up", nameAr: "ضغط الرامي", equipment: "Bodyweight", category: "small", muscleGroup: "Chest", muscleGroupAr: "الصدر" },

  // more Back
  { id: "ex_db_single_arm_row", name: "Single-Arm DB Row", nameAr: "التجديف بالدمبل بذراع واحدة", equipment: "Dumbbells", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_band_lat_pulldown", name: "Band Lat Pulldown", nameAr: "السحب العلوي بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_db_pullover", name: "DB Pullover", nameAr: "السحب فوق الرأس بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_inverted_row", name: "Inverted Row", nameAr: "التجديف المقلوب", equipment: "Pull-up Bar", category: "large", muscleGroup: "Back", muscleGroupAr: "الظهر" },
  { id: "ex_band_straight_arm_pulldown", name: "Band Straight-Arm Pulldown", nameAr: "السحب بذراع مستقيمة بالحبل", equipment: "Bands", category: "small", muscleGroup: "Back", muscleGroupAr: "الظهر" },

  // more Quads
  { id: "ex_bb_sumo_squat", name: "Barbell Sumo Squat", nameAr: "قرفصاء السومو بالبار", equipment: "Barbell", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_sumo_squat", name: "DB Sumo Squat", nameAr: "قرفصاء السومو بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_cossack_squat", name: "Cossack Squat", nameAr: "قرفصاء القوزاق", equipment: "Bodyweight", category: "small", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_wall_sit", name: "Wall Sit", nameAr: "الجلوس على الحائط", equipment: "Bodyweight", category: "small", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_jump_squat", name: "Jump Squat", nameAr: "قفزة القرفصاء", equipment: "Bodyweight", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_curtsy_lunge", name: "DB Curtsy Lunge", nameAr: "اندفاع الانحناء بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_lateral_lunge", name: "DB Lateral Lunge", nameAr: "الاندفاع الجانبي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_band_leg_extension", name: "Band Leg Extension", nameAr: "بسط الساق بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },

  // more Hamstrings/Glutes
  { id: "ex_db_sumo_deadlift", name: "DB Sumo Deadlift", nameAr: "الرفع الميت سومو بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_bb_deadlift", name: "Barbell Deadlift", nameAr: "الرفع الميت بالبار", equipment: "Barbell", category: "large", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },
  { id: "ex_band_pull_through", name: "Band Pull-Through", nameAr: "السحب بين الرجلين بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_single_leg_glute_bridge", name: "Single-Leg Glute Bridge", nameAr: "جسر الأرداف برجل واحدة", equipment: "Bodyweight", category: "small", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_db_step_down", name: "DB Step-Down", nameAr: "النزول عن المقعد بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_reverse_hyper", name: "Bench Reverse Hyperextension", nameAr: "مد الظهر العكسي على المقعد", equipment: "Bench", category: "small", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },

  // more Calves
  { id: "ex_bw_calf_raise", name: "Bodyweight Calf Raise", nameAr: "رفع السمانة بوزن الجسم", equipment: "Bodyweight", category: "small", muscleGroup: "Calves", muscleGroupAr: "السمانة" },
  { id: "ex_single_leg_calf_raise", name: "Single-Leg Calf Raise", nameAr: "رفع السمانة برجل واحدة", equipment: "Bodyweight", category: "small", muscleGroup: "Calves", muscleGroupAr: "السمانة" },
  { id: "ex_seated_db_calf_raise", name: "Seated DB Calf Raise", nameAr: "رفع السمانة الجالس بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Calves", muscleGroupAr: "السمانة" },

  // more Front Delts
  { id: "ex_db_seated_press", name: "DB Seated Shoulder Press", nameAr: "ضغط الكتف الجالس بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },
  { id: "ex_band_shoulder_press", name: "Band Shoulder Press", nameAr: "ضغط الكتف بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },
  { id: "ex_db_single_arm_press", name: "Single-Arm DB Press", nameAr: "ضغط الكتف بذراع واحدة بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },
  { id: "ex_db_front_raise", name: "DB Front Raise", nameAr: "الرفع الأمامي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Front Delts", muscleGroupAr: "الكتف الأمامي" },

  // more Side Delts
  { id: "ex_db_seated_lateral", name: "Seated DB Lateral Raise", nameAr: "الرفع الجانبي الجالس بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },
  { id: "ex_db_leaning_lateral", name: "Leaning DB Lateral Raise", nameAr: "الرفع الجانبي بالانحناء بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },
  { id: "ex_band_overhead_lateral", name: "Band Overhead Lateral Raise", nameAr: "الرفع الجانبي العلوي بالحبل المطاطي", equipment: "Bands", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },

  // more Rear Delts
  { id: "ex_bench_reverse_fly", name: "Bench-Supported Reverse Fly", nameAr: "طيران الكتف الخلفي على المقعد", equipment: "Bench", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },
  { id: "ex_band_reverse_fly_standing", name: "Standing Band Reverse Fly", nameAr: "طيران الكتف الخلفي واقفًا بالحبل", equipment: "Bands", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },

  // more Biceps
  { id: "ex_db_concentration_curl", name: "DB Concentration Curl", nameAr: "تجعيد التركيز بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_db_incline_curl", name: "DB Incline Curl", nameAr: "تجعيد الذراع المائل بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_db_zottman_curl", name: "DB Zottman Curl", nameAr: "تجعيد زوتمان بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_bench_preacher_curl", name: "Bench Preacher Curl", nameAr: "تجعيد الواعظ على المقعد", equipment: "Bench", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },
  { id: "ex_bb_curl", name: "Barbell Bicep Curl", nameAr: "تجعيد الذراع بالبار", equipment: "Barbell", category: "small", muscleGroup: "Biceps", muscleGroupAr: "العضلة ذات الرأسين" },

  // more Triceps
  { id: "ex_db_kickback", name: "DB Triceps Kickback", nameAr: "ركل الذراع الخلفي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_close_grip_pushup", name: "Close-Grip Push-Up", nameAr: "ضغط أرضي بقبضة ضيقة", equipment: "Bodyweight", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_band_overhead_ext", name: "Band Overhead Triceps Extension", nameAr: "مد الذراع العلوي بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },
  { id: "ex_bench_dip_weighted", name: "Weighted Bench Dip", nameAr: "غطس المقعد بثقل إضافي", equipment: "Dumbbells", category: "small", muscleGroup: "Triceps", muscleGroupAr: "العضلة ثلاثية الرؤوس" },

  // more Traps
  { id: "ex_db_shrug", name: "DB Shrug", nameAr: "رفع الكتفين بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_band_shrug", name: "Band Shrug", nameAr: "رفع الكتفين بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },

  // Full Body / functional
  { id: "ex_burpee", name: "Burpee", nameAr: "تمرين البيربي", equipment: "Bodyweight", category: "large", muscleGroup: "Full Body", muscleGroupAr: "كامل الجسم" },
  { id: "ex_bear_crawl", name: "Bear Crawl", nameAr: "زحف الدب", equipment: "Bodyweight", category: "small", muscleGroup: "Full Body", muscleGroupAr: "كامل الجسم" },
  { id: "ex_farmers_carry", name: "DB Farmer's Carry", nameAr: "حمل المزارع بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Full Body", muscleGroupAr: "كامل الجسم" },
  { id: "ex_db_thruster", name: "DB Thruster", nameAr: "تمرين الدفع الأمامي بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Full Body", muscleGroupAr: "كامل الجسم" },

  // Hamstrings
  { id: "ex_db_stiff_leg_deadlift", name: "DB Stiff-Leg Deadlift", nameAr: "الرفع الميت بالأرجل الممدودة بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_db_single_leg_deadlift", name: "Single-Leg DB Deadlift", nameAr: "الرفع الميت بالدمبل على رجل واحدة", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_nordic_curl", name: "Nordic Hamstring Curl", nameAr: "تمرين نوردك لعضلة الفخذ الخلفي", equipment: "Bodyweight", category: "small", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_band_hamstring_curl", name: "Band Lying Hamstring Curl", nameAr: "ثني الركبة بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },
  { id: "ex_db_good_morning", name: "DB Good Morning", nameAr: "تمرين الانحناء الصباحي بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Hamstrings", muscleGroupAr: "الفخذ الخلفي" },

  // Glutes
  { id: "ex_donkey_kick", name: "Donkey Kick", nameAr: "ركلة الحمار", equipment: "Bodyweight", category: "small", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },
  { id: "ex_fire_hydrant", name: "Fire Hydrant", nameAr: "تمرين حنفية الحريق", equipment: "Bodyweight", category: "small", muscleGroup: "Glutes", muscleGroupAr: "الأرداف" },

  // Lower Back
  { id: "ex_bird_dog", name: "Bird Dog", nameAr: "تمرين الكلب الطائر", equipment: "Bodyweight", category: "small", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },
  { id: "ex_band_deadlift", name: "Band Deadlift", nameAr: "الرفع الميت بالحبل المطاطي", equipment: "Bands", category: "large", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },
  { id: "ex_db_deadlift", name: "DB Deadlift", nameAr: "الرفع الميت بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },
  { id: "ex_prone_cobra", name: "Prone Cobra Hold", nameAr: "تمرين الكوبرا الأرضي", equipment: "Bodyweight", category: "small", muscleGroup: "Lower Back", muscleGroupAr: "أسفل الظهر" },

  // Side Delts
  { id: "ex_db_y_raise", name: "DB Y-Raise", nameAr: "رفع Y بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },
  { id: "ex_db_partial_lateral", name: "DB Partial Lateral Raise", nameAr: "الرفع الجانبي الجزئي بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },
  { id: "ex_db_crossbody_lateral", name: "Cross-Body DB Lateral Raise", nameAr: "الرفع الجانبي المتقاطع بالدمبل", equipment: "Dumbbells", category: "sideDelt", muscleGroup: "Side Delts", muscleGroupAr: "الكتف الجانبي" },

  // Rear Delts
  { id: "ex_db_seated_reverse_fly", name: "Seated DB Reverse Fly", nameAr: "طيران الكتف الخلفي الجالس بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },
  { id: "ex_band_w_raise", name: "Band W-Raise", nameAr: "رفع W بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },
  { id: "ex_db_prone_y_raise", name: "DB Prone Y-Raise", nameAr: "رفع Y على المقعد بالدمبل", equipment: "Bench", category: "small", muscleGroup: "Rear Delts", muscleGroupAr: "الكتف الخلفي" },

  // Traps
  { id: "ex_db_upright_row", name: "DB Upright Row", nameAr: "السحب العمودي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_band_upright_row", name: "Band Upright Row", nameAr: "السحب العمودي بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_db_farmer_shrug_walk", name: "Farmer's Carry Shrug Walk", nameAr: "المشي مع رفع الكتفين بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_bb_upright_row", name: "Barbell Upright Row", nameAr: "السحب العمودي بالبار", equipment: "Barbell", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },
  { id: "ex_db_incline_shrug", name: "Incline Bench DB Shrug", nameAr: "رفع الكتفين على مقعد مائل بالدمبل", equipment: "Bench", category: "small", muscleGroup: "Traps", muscleGroupAr: "العضلة شبه المنحرفة" },

  // Forearms
  { id: "ex_db_wrist_curl", name: "DB Wrist Curl", nameAr: "ثني المعصم بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_db_reverse_wrist_curl", name: "DB Reverse Wrist Curl", nameAr: "ثني المعصم العكسي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_db_reverse_curl", name: "DB Reverse Curl", nameAr: "تجعيد الذراع العكسي بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_band_wrist_curl", name: "Band Wrist Curl", nameAr: "ثني المعصم بالحبل المطاطي", equipment: "Bands", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_farmers_carry_forearm", name: "DB Farmer's Carry (Grip Focus)", nameAr: "حمل المزارع لتقوية قبضة اليد", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_dead_hang", name: "Dead Hang", nameAr: "التعلّق من العقلة", equipment: "Pull-up Bar", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_db_wrist_roller", name: "DB Wrist Roller", nameAr: "لفّ المعصم بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },
  { id: "ex_db_hammer_hold", name: "DB Static Hammer Hold", nameAr: "ثبات إمساك المطرقة بالدمبل", equipment: "Dumbbells", category: "small", muscleGroup: "Forearms", muscleGroupAr: "الساعد" },

  // Legs — Bulgarian split squat family (requested emphasis)
  { id: "ex_db_bulgarian_split_squat", name: "DB Bulgarian Split Squat", nameAr: "سكوات بلغاري بالدمبل", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
  { id: "ex_db_suitcase_squat", name: "DB Suitcase Squat", nameAr: "سكوات الحقيبة بالدمبل على الجانبين", equipment: "Dumbbells", category: "large", muscleGroup: "Quads", muscleGroupAr: "الفخذ الأمامي" },
];

// Alternating Group A / Group B split — week starts Saturday, Friday is the rest day.
// Group A (Sat, Mon, Wed): chest + side delts + forearm at max intensity; back/legs/abs kept light.
// Group B (Sun, Tue, Thu): back + legs + abs at max intensity; chest/side delts kept light.
// Forearm appears on 2 days per group (Sat, Mon / Sun, Tue) = 8 sets/week total.
// Front Delts, Rear Delts, Biceps, Triceps, Traps, Lower Back stay flat at 2 sets/day = 12/week each,
// distributed evenly across all 6 days regardless of group. No muscle exceeds 4 sets in a single day.
// Weekly totals: Chest 18 · Back 18 · Legs(Quads) 18 · Side Delts 15 · Abs 15 · Forearm 8 · rest 12 each.
const DEFAULT_TEMPLATE = [
  { id: "day_sat", label: "Day 1 · Sat (Group A)", labelAr: "اليوم الأول · السبت (مجموعة أ)", exercises: [
    { exerciseId: "ex_db_bench", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_wrist_curl", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_pullup", targetSets: 2, targetReps: 8 },
    { exerciseId: "ex_db_bulgarian_split_squat", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_plank", targetSets: 1, targetReps: 45 },
    { exerciseId: "ex_db_arnold_press", targetSets: 2, targetReps: 8 },
    { exerciseId: "ex_db_rear_fly", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_skull", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_shrug", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_superman", targetSets: 2, targetReps: 20 },
  ]},
  { id: "day_sun", label: "Day 2 · Sun (Group B)", labelAr: "اليوم الثاني · الأحد (مجموعة ب)", exercises: [
    { exerciseId: "ex_pullup", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_bulgarian_split_squat", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_situp", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_band_lateral", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_incline", targetSets: 2, targetReps: 8 },
    { exerciseId: "ex_db_reverse_curl", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_single_arm_press", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_band_facepull", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_incline_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_overhead_tricep", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_upright_row", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_deadlift", targetSets: 2, targetReps: 10 },
  ]},
  { id: "day_mon", label: "Day 3 · Mon (Group A)", labelAr: "اليوم الثالث · الاثنين (مجموعة أ)", exercises: [
    { exerciseId: "ex_db_incline", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_db_reverse_wrist_curl", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_row", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_db_suitcase_squat", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_plank", targetSets: 1, targetReps: 45 },
    { exerciseId: "ex_db_front_raise", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_band_pullapart", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_hammer_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_kickback", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_band_shrug", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_bird_dog", targetSets: 2, targetReps: 12 },
  ]},
  { id: "day_tue", label: "Day 4 · Tue (Group B)", labelAr: "اليوم الرابع · الثلاثاء (مجموعة ب)", exercises: [
    { exerciseId: "ex_db_row", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_db_suitcase_squat", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_reverse_crunch", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_band_lateral", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_bench", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_dead_hang", targetSets: 2, targetReps: 20 },
    { exerciseId: "ex_band_shoulder_press", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_band_w_raise", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_zottman_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_band_overhead_ext", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_farmer_shrug_walk", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_band_deadlift", targetSets: 2, targetReps: 10 },
  ]},
  { id: "day_wed", label: "Day 5 · Wed (Group A)", labelAr: "اليوم الخامس · الأربعاء (مجموعة أ)", exercises: [
    { exerciseId: "ex_db_bench", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_db_lateral", targetSets: 3, targetReps: 15 },
    { exerciseId: "ex_chinup", targetSets: 2, targetReps: 8 },
    { exerciseId: "ex_db_bulgarian_split_squat", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_plank", targetSets: 1, targetReps: 45 },
    { exerciseId: "ex_db_seated_press", targetSets: 2, targetReps: 10 },
    { exerciseId: "ex_bench_reverse_fly", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_concentration_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_dip", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_incline_shrug", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_prone_cobra", targetSets: 2, targetReps: 20 },
  ]},
  { id: "day_thu", label: "Day 6 · Thu (Group B)", labelAr: "اليوم السادس · الخميس (مجموعة ب)", exercises: [
    { exerciseId: "ex_chinup", targetSets: 4, targetReps: 8 },
    { exerciseId: "ex_db_curtsy_lunge", targetSets: 4, targetReps: 10 },
    { exerciseId: "ex_vup", targetSets: 4, targetReps: 15 },
    { exerciseId: "ex_band_lateral", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_incline", targetSets: 2, targetReps: 8 },
    { exerciseId: "ex_pike_pushup", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_db_seated_reverse_fly", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_curl", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_close_grip_pushup", targetSets: 2, targetReps: 15 },
    { exerciseId: "ex_db_shrug", targetSets: 2, targetReps: 12 },
    { exerciseId: "ex_reverse_hyper", targetSets: 2, targetReps: 12 },
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

function ExerciseCard({ item, exercise, session, updateSet, onSwap, onRemove, onAddSet, onRemoveSet, onMoveUp, onMoveDown, isFirst, isLast, lang }) {
  const [open, setOpen] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);
  if (!exercise) return null;
  const allDone = session.sets.length > 0 && session.sets.every((s) => s.completed);
  const style = getMuscleStyle(exercise.muscleGroup);
  const patternKey = EXERCISE_ICON_MAP[exercise.id];
  const steps = getInstructions(patternKey, lang);

  return (
    <div className={`rounded-xl border ${allDone ? "border-emerald-500/40" : style.border} ${style.bg} overflow-hidden`}>
      <div className="w-full flex items-center justify-between px-4 py-3">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-3 min-w-0 flex-1 text-left">
          <ExerciseIcon exerciseId={exercise.id} category={exercise.category} muscleGroup={exercise.muscleGroup} className="w-12 h-12" />
          <div className={`w-2 h-2 rounded-full shrink-0 ${allDone ? "bg-emerald-400" : "bg-white/20"}`} />
          <div className="min-w-0 text-left">
            <div className="text-sm font-semibold text-white truncate">{localizedName(exercise, lang)}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded ${style.chip} ${style.text}`}>
                {localizedMuscleGroup(exercise, lang)}
              </span>
              <span className="text-[10px] text-white/40">{exercise.equipment}</span>
            </div>
          </div>
          {open ? <ChevronUp size={16} className="text-white/30 shrink-0 ml-1" /> : <ChevronDown size={16} className="text-white/30 shrink-0 ml-1" />}
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`p-1.5 rounded ${isFirst ? "text-white/15" : "text-white/40 hover:text-white"}`}
            title={t(lang, "moveUp")}
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`p-1.5 rounded ${isLast ? "text-white/15" : "text-white/40 hover:text-white"}`}
            title={t(lang, "moveDown")}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

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
            <button
              onClick={onRemoveSet}
              disabled={session.sets.length <= 1}
              className={`flex items-center gap-1 text-[11px] px-2 py-1 ${
                session.sets.length <= 1 ? "text-white/15" : "text-white/50 hover:text-white"
              }`}
            >
              <Minus size={12} /> {t(lang, "removeSet")}
            </button>
            <button onClick={onSwap} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white px-2 py-1 ml-auto">
              <RotateCcw size={12} /> {t(lang, "swap")}
            </button>
            <button onClick={onRemove} className="flex items-center gap-1 text-[11px] text-white/50 hover:text-rose-400 px-2 py-1">
              <X size={12} /> {t(lang, "remove")}
            </button>
          </div>

          {steps.length > 0 && (
            <button
              onClick={() => setShowHowTo((s) => !s)}
              className="flex items-center gap-1 text-[11px] font-semibold mt-1 px-2 py-1 text-white/60 hover:text-white"
            >
              <Info size={12} /> {t(lang, "howTo")}
              {showHowTo ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {showHowTo && steps.length > 0 && (
            <ol className="mt-1 space-y-1.5 px-2">
              {steps.map((step, i) => (
                <li key={i} className="text-[11px] text-white/60 leading-relaxed flex gap-2">
                  <span className={`shrink-0 font-mono font-bold ${style.text}`}>{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

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

  // on first load only, open the tab matching today's actual weekday (if it's a training day)
  const didInitToday = useRef(false);
  useEffect(() => {
    if (loading || didInitToday.current || visibleDays.length === 0) return;
    const todayWeekday = new Date().getDay(); // 0=Sun..6=Sat
    const match = visibleDays.find((d) => d.weekday === todayWeekday);
    if (match) setActiveDayId(match.id);
    didInitToday.current = true;
  }, [loading, visibleDays]);

  const activeDay = template.find((d) => d.id === activeDayId);
  const activeDayIndex = visibleDays.findIndex((d) => d.id === activeDayId);
  const isGroupA = activeDayIndex % 2 === 0;

  const libraryMap = useMemo(() => Object.fromEntries(library.map((e) => [e.id, e])), [library]);

  // signature of *which* exercises are in today's session (order-independent) —
  // used so reordering exercises doesn't wipe in-progress typed values
  const activeDayExerciseSignature = useMemo(
    () => (activeDay ? activeDay.exercises.map((e) => e.exerciseId).slice().sort().join(",") : ""),
    [activeDay]
  );

  // rebuild session (auto-fill) when day, logs, or the set of exercises changes
  useEffect(() => {
    if (loading || !activeDay) return;
    setSession(buildSessionState(activeDay, logs));
  }, [activeDayId, loading, logs, activeDayExerciseSignature]);

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

  const removeSet = (exerciseId) => {
    setSession((prev) => {
      const ex = prev[exerciseId];
      if (!ex || ex.sets.length <= 1) return prev;
      return { ...prev, [exerciseId]: { ...ex, sets: ex.sets.slice(0, -1) } };
    });
  };

  const moveExercise = (exerciseId, direction) => {
    setTemplate((prev) =>
      prev.map((d) => {
        if (d.id !== activeDayId) return d;
        const idx = d.exercises.findIndex((e) => e.exerciseId === exerciseId);
        const swapIdx = idx + direction;
        if (idx === -1 || swapIdx < 0 || swapIdx >= d.exercises.length) return d;
        const next = [...d.exercises];
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return { ...d, exercises: next };
      })
    );
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

          {activeDayIndex >= 0 && (
            <p className={`text-[10px] font-bold tracking-wide mt-2 ${isGroupA ? "text-[#E8B33D]" : "text-emerald-400"}`}>
              {t(lang, isGroupA ? "groupAFocus" : "groupBFocus")}
            </p>
          )}
        </div>
      </div>

      {/* Exercise list */}
      <div className="max-w-lg mx-auto px-4 pt-5 space-y-3">
        {activeDay?.exercises.map((item, idx) => (
          <ExerciseCard
            key={item.exerciseId}
            item={item}
            exercise={libraryMap[item.exerciseId]}
            session={session[item.exerciseId] ?? { sets: [], lastSets: null, lastDate: null }}
            updateSet={(i, field, value) => updateSet(item.exerciseId, i, field, value)}
            onAddSet={() => addSet(item.exerciseId)}
            onRemoveSet={() => removeSet(item.exerciseId)}
            onMoveUp={() => moveExercise(item.exerciseId, -1)}
            onMoveDown={() => moveExercise(item.exerciseId, 1)}
            isFirst={idx === 0}
            isLast={idx === activeDay.exercises.length - 1}
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
