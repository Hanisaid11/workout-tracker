import React from "react";

/* Minimalist line-art pictograms — one per movement pattern.
   Kept intentionally simple/schematic (not anatomical) so they read
   clearly at small sizes and carry no copyright/likeness concerns. */

const wrap = (children) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    {children}
  </svg>
);

const Icons = {
  benchPress: () =>
    wrap(
      <>
        <line x1="6" y1="32" x2="34" y2="32" />
        <circle cx="10" cy="24" r="3.2" />
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
        <circle cx="20" cy="16" r="3.2" />
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
        <circle cx="24" cy="16" r="3.2" />
        <path d="M15 9 L24 19 L33 9" />
        <path d="M24 19 L24 30" />
        <path d="M24 30 L18 40" />
        <path d="M24 30 L30 40" />
      </>
    ),
  row: () =>
    wrap(
      <>
        <circle cx="12" cy="14" r="3.2" />
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
        <circle cx="24" cy="10" r="3.2" />
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
        <circle cx="20" cy="10" r="3.2" />
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
        <circle cx="12" cy="16" r="3.2" />
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
        <circle cx="8" cy="26" r="3.2" />
        <path d="M9 29 L20 34" />
        <path d="M20 34 L34 22" />
        <path d="M20 34 L24 40" />
        <path d="M24 40 L34 40" />
      </>
    ),
  overheadPress: () =>
    wrap(
      <>
        <circle cx="24" cy="10" r="3.2" />
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
        <circle cx="24" cy="8" r="3.2" />
        <line x1="24" y1="11" x2="24" y2="28" />
        <path d="M24 28 L18 40" />
        <path d="M24 28 L30 40" />
        <path d="M24 15 L32 15 L28 6" />
        <circle cx="27" cy="5" r="2.6" />
      </>
    ),
  dip: () =>
    wrap(
      <>
        <line x1="10" y1="10" x2="10" y2="30" />
        <line x1="38" y1="10" x2="38" y2="30" />
        <circle cx="24" cy="14" r="3.2" />
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
        <circle cx="10" cy="26" r="3.2" />
        <path d="M13 29 L22 34" />
        <path d="M22 34 L20 22" />
        <path d="M20 22 L28 22" />
        <line x1="16" y1="18" x2="32" y2="18" />
      </>
    ),
  rearFly: () =>
    wrap(
      <>
        <circle cx="14" cy="14" r="3.2" />
        <path d="M15 17 L26 24" />
        <path d="M26 24 L20 40" />
        <path d="M20 22 L8 16" />
        <path d="M20 22 L34 30" />
      </>
    ),
  lateralRaise: () =>
    wrap(
      <>
        <circle cx="24" cy="8" r="3.2" />
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
        <circle cx="24" cy="14" r="3.2" />
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
        <circle cx="38" cy="14" r="3.2" />
        <line x1="10" y1="34" x2="6" y2="26" />
        <line x1="20" y1="27" x2="20" y2="36" />
      </>
    ),
  sitUp: () =>
    wrap(
      <>
        <line x1="6" y1="34" x2="26" y2="34" />
        <circle cx="30" cy="26" r="3.2" />
        <path d="M27 28 L18 32" />
        <path d="M18 32 L18 24 L26 20" />
        <path d="M18 32 L10 28" />
      </>
    ),
  pushUp: () =>
    wrap(
      <>
        <line x1="6" y1="30" x2="38" y2="18" />
        <circle cx="38" cy="14" r="3.2" />
        <line x1="12" y1="32" x2="16" y2="24" />
        <line x1="26" y1="24" x2="30" y2="16" />
      </>
    ),
};

// exercise id -> pictogram key
export const EXERCISE_ICON_MAP = {
  ex_bb_bench: "benchPress",
  ex_db_incline: "inclinePress",
  ex_pullup: "pullUp",
  ex_db_row: "row",
  ex_bb_row: "row",
  ex_bb_squat: "squat",
  ex_db_lunge: "lunge",
  ex_bb_rdl: "hinge",
  ex_db_hipthrust: "hipThrust",
  ex_bb_ohp: "overheadPress",
  ex_db_curl: "curl",
  ex_dip: "dip",
  ex_db_skull: "skullCrusher",
  ex_band_pullapart: "rearFly",
  ex_db_rear_fly: "rearFly",
  ex_db_lateral: "lateralRaise",
  ex_band_lateral: "lateralRaise",
  ex_hanging_leg: "hangingLegRaise",
  ex_plank: "plank",
  ex_situp: "sitUp",
  ex_pushup: "pushUp",
};

export function ExerciseIcon({ exerciseId, category, className }) {
  const key = EXERCISE_ICON_MAP[exerciseId];
  const Icon = Icons[key];
  const tint = {
    large: "text-[#E8B33D]",
    small: "text-sky-400",
    sideDelt: "text-violet-400",
    abs: "text-orange-400",
  }[category] || "text-white/60";

  return (
    <div className={`${className || "w-10 h-10"} ${tint} shrink-0`}>
      {Icon ? Icon() : wrap(<circle cx="24" cy="24" r="14" />)}
    </div>
  );
}
