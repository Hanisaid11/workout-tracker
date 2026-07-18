import React from "react";

/* Minimalist line-art pictograms — one per movement pattern.
   Kept intentionally simple/schematic (not anatomical) so they read
   clearly at small sizes and carry no copyright/likeness concerns. */

const wrap = (children) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    {children}
  </svg>
);

const Icons = {
  benchPress: () =>
    wrap(
      <>
        <line x1="6" y1="32" x2="34" y2="32" />
        <circle cx="10" cy="24" r="3.4" fill="currentColor" />
        <path d="M13 27 L20 32" />
        <path d="M20 32 L20 40" />
        <path d="M20 32 L28 32" />
        <line x1="16" y1="18" x2="34" y2="18" />
        <line x1="16" y1="14" x2="16" y2="22" />
        <line x1="34" y1="14" x2="34" y2="22" />
        <path d="M20 32 L18 18" />
      </>
    ),
  inclinePress: () =>
    wrap(
      <>
        <line x1="6" y1="34" x2="22" y2="20" />
        <circle cx="20" cy="16" r="3.4" fill="currentColor" />
        <path d="M22 20 L20 30 L20 40" />
        <path d="M20 26 L30 12" />
        <line x1="24" y1="8" x2="38" y2="8" />
        <line x1="24" y1="4" x2="24" y2="12" />
        <line x1="38" y1="4" x2="38" y2="12" />
      </>
    ),
  pullUp: () =>
    wrap(
      <>
        <line x1="8" y1="8" x2="40" y2="8" />
        <circle cx="24" cy="16" r="3.4" fill="currentColor" />
        <path d="M15 9 L24 19 L33 9" />
        <path d="M24 19 L24 30" />
        <path d="M24 30 L18 40" />
        <path d="M24 30 L30 40" />
      </>
    ),
  row: () =>
    wrap(
      <>
        <circle cx="12" cy="14" r="3.4" fill="currentColor" />
        <path d="M13 17 L20 26" />
        <path d="M20 26 L34 30" />
        <path d="M20 26 L16 40" />
        <path d="M20 26 L26 40" />
        <path d="M20 20 L30 16" />
        <line x1="30" y1="12" x2="30" y2="20" />
      </>
    ),
  squat: () =>
    wrap(
      <>
        <circle cx="24" cy="10" r="3.4" fill="currentColor" />
        <line x1="14" y1="13" x2="34" y2="13" />
        <line x1="14" y1="9" x2="14" y2="17" />
        <line x1="34" y1="9" x2="34" y2="17" />
        <path d="M24 13 L24 24" />
        <path d="M24 24 L14 30 L14 40" />
        <path d="M24 24 L34 30 L34 40" />
      </>
    ),
  lunge: () =>
    wrap(
      <>
        <circle cx="20" cy="10" r="3.4" fill="currentColor" />
        <path d="M20 13 L22 26" />
        <path d="M22 26 L12 40" />
        <path d="M22 26 L34 34 L30 42" />
        <path d="M22 18 L14 24" />
        <path d="M22 18 L32 22" />
      </>
    ),
  hinge: () =>
    wrap(
      <>
        <circle cx="12" cy="16" r="3.4" fill="currentColor" />
        <path d="M13 19 L26 26" />
        <path d="M26 26 L20 40" />
        <path d="M26 26 L36 34" />
        <path d="M18 22 L28 12" />
        <line x1="28" y1="8" x2="40" y2="8" />
        <line x1="28" y1="4" x2="28" y2="12" />
        <line x1="40" y1="4" x2="40" y2="12" />
      </>
    ),
  hipThrust: () =>
    wrap(
      <>
        <line x1="4" y1="34" x2="16" y2="34" />
        <circle cx="8" cy="26" r="3.4" fill="currentColor" />
        <path d="M9 29 L20 34" />
        <path d="M20 34 L34 22" />
        <path d="M20 34 L24 40" />
        <path d="M24 40 L34 40" />
      </>
    ),
  overheadPress: () =>
    wrap(
      <>
        <circle cx="24" cy="10" r="3.4" fill="currentColor" />
        <line x1="24" y1="13" x2="24" y2="30" />
        <path d="M24 30 L18 40" />
        <path d="M24 30 L30 40" />
        <path d="M24 16 L14 6" />
        <path d="M24 16 L34 6" />
        <line x1="10" y1="6" x2="18" y2="6" />
        <line x1="30" y1="6" x2="38" y2="6" />
      </>
    ),
  curl: () =>
    wrap(
      <>
        <circle cx="24" cy="8" r="3.4" fill="currentColor" />
        <line x1="24" y1="11" x2="24" y2="28" />
        <path d="M24 28 L18 40" />
        <path d="M24 28 L30 40" />
        <path d="M24 15 L32 15 L28 6" />
        <circle cx="27" cy="5" r="2.8" fill="currentColor" />
      </>
    ),
  dip: () =>
    wrap(
      <>
        <line x1="10" y1="10" x2="10" y2="30" />
        <line x1="38" y1="10" x2="38" y2="30" />
        <circle cx="24" cy="14" r="3.4" fill="currentColor" />
        <path d="M24 17 L20 26" />
        <path d="M20 26 L10 20" />
        <path d="M20 26 L38 20" />
        <path d="M20 26 L18 40" />
        <path d="M20 26 L26 40" />
      </>
    ),
  skullCrusher: () =>
    wrap(
      <>
        <line x1="6" y1="34" x2="34" y2="34" />
        <circle cx="10" cy="26" r="3.4" fill="currentColor" />
        <path d="M13 29 L22 34" />
        <path d="M22 34 L20 22" />
        <path d="M20 22 L28 22" />
        <line x1="16" y1="18" x2="32" y2="18" />
      </>
    ),
  rearFly: () =>
    wrap(
      <>
        <circle cx="14" cy="14" r="3.4" fill="currentColor" />
        <path d="M15 17 L26 24" />
        <path d="M26 24 L20 40" />
        <path d="M20 22 L8 16" />
        <path d="M20 22 L34 30" />
      </>
    ),
  lateralRaise: () =>
    wrap(
      <>
        <circle cx="24" cy="8" r="3.4" fill="currentColor" />
        <line x1="24" y1="11" x2="24" y2="28" />
        <path d="M24 28 L18 40" />
        <path d="M24 28 L30 40" />
        <line x1="24" y1="17" x2="8" y2="14" />
        <line x1="24" y1="17" x2="40" y2="14" />
      </>
    ),
  hangingLegRaise: () =>
    wrap(
      <>
        <line x1="8" y1="8" x2="40" y2="8" />
        <circle cx="24" cy="14" r="3.4" fill="currentColor" />
        <path d="M20 9 L24 17 L28 9" />
        <path d="M24 17 L24 26" />
        <path d="M24 26 L16 20" />
        <path d="M24 26 L32 20" />
      </>
    ),
  plank: () =>
    wrap(
      <>
        <line x1="6" y1="30" x2="38" y2="18" />
        <circle cx="38" cy="14" r="3.4" fill="currentColor" />
        <line x1="10" y1="34" x2="6" y2="26" />
        <line x1="20" y1="27" x2="20" y2="36" />
      </>
    ),
  sitUp: () =>
    wrap(
      <>
        <line x1="6" y1="34" x2="26" y2="34" />
        <circle cx="30" cy="26" r="3.4" fill="currentColor" />
        <path d="M27 28 L18 32" />
        <path d="M18 32 L18 24 L26 20" />
        <path d="M18 32 L10 28" />
      </>
    ),
  pushUp: () =>
    wrap(
      <>
        <line x1="6" y1="30" x2="38" y2="18" />
        <circle cx="38" cy="14" r="3.4" fill="currentColor" />
        <line x1="12" y1="32" x2="16" y2="24" />
        <line x1="26" y1="24" x2="30" y2="16" />
      </>
    ),
  calfRaise: () =>
    wrap(
      <>
        <circle cx="24" cy="10" r="3.4" fill="currentColor" />
        <path d="M24 13 L24 26" />
        <path d="M24 26 L18 36" />
        <path d="M24 26 L30 36" />
        <line x1="16" y1="40" x2="22" y2="40" />
        <line x1="28" y1="40" x2="34" y2="40" />
      </>
    ),
  shrug: () =>
    wrap(
      <>
        <circle cx="24" cy="9" r="3.4" fill="currentColor" />
        <path d="M14 20 L24 14 L34 20" />
        <path d="M24 14 L24 30" />
        <path d="M24 30 L18 40" />
        <path d="M24 30 L30 40" />
        <line x1="12" y1="22" x2="12" y2="30" />
        <line x1="36" y1="22" x2="36" y2="30" />
      </>
    ),
  superman: () =>
    wrap(
      <>
        <line x1="10" y1="24" x2="34" y2="24" />
        <circle cx="38" cy="20" r="3.4" fill="currentColor" />
        <path d="M10 24 L4 18" />
        <path d="M18 22 L12 16" />
      </>
    ),
  twist: () =>
    wrap(
      <>
        <line x1="12" y1="36" x2="24" y2="36" />
        <circle cx="24" cy="14" r="3.4" fill="currentColor" />
        <path d="M24 17 L20 32" />
        <path d="M20 22 L10 18" />
        <path d="M20 22 L30 26" />
      </>
    ),
};

// canonical (English) muscle group -> accent color, used regardless of UI language
// same palette, as card-background / border / icon-chip tint classes
const MUSCLE_STYLE = {
  Chest: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/25", chip: "bg-rose-500/15" },
  Back: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", chip: "bg-emerald-500/15" },
  Quads: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25", chip: "bg-amber-500/15" },
  Hamstrings: { text: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/25", chip: "bg-lime-500/15" },
  Glutes: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/25", chip: "bg-red-500/15" },
  "Lower Back": { text: "text-stone-400", bg: "bg-stone-500/10", border: "border-stone-500/25", chip: "bg-stone-500/15" },
  Calves: { text: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/25", chip: "bg-teal-500/15" },
  "Front Delts": { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/25", chip: "bg-sky-500/15" },
  "Side Delts": { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/25", chip: "bg-violet-500/15" },
  "Rear Delts": { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/25", chip: "bg-cyan-500/15" },
  Biceps: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/25", chip: "bg-indigo-500/15" },
  Triceps: { text: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/25", chip: "bg-fuchsia-500/15" },
  Traps: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/25", chip: "bg-pink-500/15" },
  Forearms: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/25", chip: "bg-blue-500/15" },
  Abs: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/25", chip: "bg-orange-500/15" },
  "Full Body": { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/25", chip: "bg-yellow-500/15" },
};

const FALLBACK_STYLE = { text: "text-white/60", bg: "bg-[#1E2027]", border: "border-white/10", chip: "bg-white/10" };

export function getMuscleStyle(muscleGroup) {
  return MUSCLE_STYLE[muscleGroup] || FALLBACK_STYLE;
}

// exercise id -> pictogram key
export const EXERCISE_ICON_MAP = {
  ex_bb_bench: "benchPress",
  ex_db_bench: "benchPress",
  ex_db_incline: "inclinePress",
  ex_pullup: "pullUp",
  ex_chinup: "pullUp",
  ex_db_row: "row",
  ex_bb_row: "row",
  ex_band_row: "row",
  ex_renegade_row: "row",
  ex_bb_squat: "squat",
  ex_db_goblet_squat: "squat",
  ex_bb_front_squat: "squat",
  ex_band_squat: "squat",
  ex_db_lunge: "lunge",
  ex_db_reverse_lunge: "lunge",
  ex_db_stepup: "lunge",
  ex_bb_rdl: "hinge",
  ex_db_rdl_single: "hinge",
  ex_band_good_morning: "hinge",
  ex_db_hipthrust: "hipThrust",
  ex_glute_bridge: "hipThrust",
  ex_bb_ohp: "overheadPress",
  ex_db_arnold_press: "overheadPress",
  ex_pike_pushup: "overheadPress",
  ex_bb_close_grip_bench: "benchPress",
  ex_diamond_pushup: "pushUp",
  ex_decline_pushup: "pushUp",
  ex_db_curl: "curl",
  ex_db_hammer_curl: "curl",
  ex_band_curl: "curl",
  ex_dip: "dip",
  ex_db_skull: "skullCrusher",
  ex_band_tricep_pushdown: "skullCrusher",
  ex_db_overhead_tricep: "skullCrusher",
  ex_band_pullapart: "rearFly",
  ex_db_rear_fly: "rearFly",
  ex_band_facepull: "rearFly",
  ex_db_lateral: "lateralRaise",
  ex_band_lateral: "lateralRaise",
  ex_hanging_leg: "hangingLegRaise",
  ex_plank: "plank",
  ex_side_plank: "plank",
  ex_mountain_climber: "plank",
  ex_situp: "sitUp",
  ex_bicycle_crunch: "sitUp",
  ex_russian_twist: "twist",
  ex_pushup: "pushUp",
  ex_db_calf_raise: "calfRaise",
  ex_bb_shrug: "shrug",
  ex_superman: "superman",

  // abs additions
  ex_reverse_crunch: "sitUp",
  ex_vup: "sitUp",
  ex_flutter_kicks: "plank",
  ex_dead_bug: "plank",
  ex_hollow_hold: "plank",
  ex_band_pallof: "twist",
  ex_toe_touch: "sitUp",
  ex_side_bend: "twist",
  ex_db_situp_incline: "sitUp",

  // chest additions
  ex_db_flat_fly: "benchPress",
  ex_db_incline_fly: "inclinePress",
  ex_band_chest_press: "benchPress",
  ex_wide_pushup: "pushUp",
  ex_archer_pushup: "pushUp",

  // back additions
  ex_db_single_arm_row: "row",
  ex_band_lat_pulldown: "pullUp",
  ex_db_pullover: "row",
  ex_inverted_row: "row",
  ex_band_straight_arm_pulldown: "rearFly",

  // quad additions
  ex_bb_sumo_squat: "squat",
  ex_db_sumo_squat: "squat",
  ex_cossack_squat: "lunge",
  ex_wall_sit: "squat",
  ex_jump_squat: "squat",
  ex_db_curtsy_lunge: "lunge",
  ex_db_lateral_lunge: "lunge",
  ex_band_leg_extension: "squat",

  // hamstrings/glutes additions
  ex_db_sumo_deadlift: "hinge",
  ex_bb_deadlift: "hinge",
  ex_band_pull_through: "hinge",
  ex_single_leg_glute_bridge: "hipThrust",
  ex_db_step_down: "lunge",
  ex_reverse_hyper: "hinge",

  // calves additions
  ex_bw_calf_raise: "calfRaise",
  ex_single_leg_calf_raise: "calfRaise",
  ex_seated_db_calf_raise: "calfRaise",

  // front delt additions
  ex_db_seated_press: "overheadPress",
  ex_band_shoulder_press: "overheadPress",
  ex_db_single_arm_press: "overheadPress",
  ex_db_front_raise: "lateralRaise",

  // side delt additions
  ex_db_seated_lateral: "lateralRaise",
  ex_db_leaning_lateral: "lateralRaise",
  ex_band_overhead_lateral: "lateralRaise",

  // rear delt additions
  ex_bench_reverse_fly: "rearFly",
  ex_band_reverse_fly_standing: "rearFly",

  // biceps additions
  ex_db_concentration_curl: "curl",
  ex_db_incline_curl: "curl",
  ex_db_zottman_curl: "curl",
  ex_bench_preacher_curl: "curl",
  ex_bb_curl: "curl",

  // triceps additions
  ex_db_kickback: "skullCrusher",
  ex_close_grip_pushup: "pushUp",
  ex_band_overhead_ext: "skullCrusher",
  ex_bench_dip_weighted: "dip",

  // traps additions
  ex_db_shrug: "shrug",
  ex_band_shrug: "shrug",

  // full body / functional
  ex_burpee: "pushUp",
  ex_bear_crawl: "plank",
  ex_farmers_carry: "shrug",
  ex_db_thruster: "overheadPress",

  // Hamstrings
  ex_db_stiff_leg_deadlift: "hinge",
  ex_db_single_leg_deadlift: "hinge",
  ex_nordic_curl: "hinge",
  ex_band_hamstring_curl: "hinge",
  ex_db_good_morning: "hinge",

  // Glutes
  ex_donkey_kick: "hipThrust",
  ex_fire_hydrant: "hipThrust",

  // Lower Back
  ex_bird_dog: "superman",
  ex_band_deadlift: "hinge",
  ex_db_deadlift: "hinge",
  ex_prone_cobra: "superman",

  // Side Delts
  ex_db_y_raise: "lateralRaise",
  ex_db_partial_lateral: "lateralRaise",
  ex_db_crossbody_lateral: "lateralRaise",

  // Rear Delts
  ex_db_seated_reverse_fly: "rearFly",
  ex_band_w_raise: "rearFly",
  ex_db_prone_y_raise: "rearFly",

  // Traps
  ex_db_upright_row: "shrug",
  ex_band_upright_row: "shrug",
  ex_db_farmer_shrug_walk: "shrug",
  ex_bb_upright_row: "shrug",
  ex_db_incline_shrug: "shrug",

  // Forearms
  ex_db_wrist_curl: "curl",
  ex_db_reverse_wrist_curl: "curl",
  ex_db_reverse_curl: "curl",
  ex_band_wrist_curl: "curl",
  ex_farmers_carry_forearm: "shrug",
  ex_dead_hang: "pullUp",
  ex_db_wrist_roller: "curl",
  ex_db_hammer_hold: "curl",

  // Legs
  ex_db_bulgarian_split_squat: "lunge",
  ex_db_suitcase_squat: "squat",
};

export function ExerciseIcon({ exerciseId, category, muscleGroup, className, chip = true }) {
  const key = EXERCISE_ICON_MAP[exerciseId];
  const Icon = Icons[key];
  const style = MUSCLE_STYLE[muscleGroup] || {
    text:
      {
        large: "text-[#E8B33D]",
        small: "text-sky-400",
        sideDelt: "text-violet-400",
        abs: "text-orange-400",
      }[category] || "text-white/60",
    chip: "bg-white/10",
  };

  const icon = Icon ? Icon() : wrap(<circle cx="24" cy="24" r="14" />);

  if (!chip) {
    return <div className={`${className || "w-10 h-10"} ${style.text} shrink-0`}>{icon}</div>;
  }

  return (
    <div className={`${className || "w-10 h-10"} ${style.chip} ${style.text} shrink-0 rounded-xl p-1.5 flex items-center justify-center`}>
      {icon}
    </div>
  );
}
