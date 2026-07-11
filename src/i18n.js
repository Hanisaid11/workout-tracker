export const STRINGS = {
  en: {
    appEyebrow: "Full Body · 6 Day Split",
    appTitle: "Session Log",
    library: "Library",
    friRest: "Fri · Rest",
    setsCompleted: "sets completed",
    hash: "#",
    reps: "Reps",
    weight: "Weight (kg)",
    addSet: "Add set",
    swap: "Swap",
    remove: "Remove",
    lastPerformed: "Last performed",
    addExerciseToday: "Add Exercise to Today",
    finishSession: "Finish Session",
    logAtLeastOneSet: "Log at least one completed set first",
    sessionSaved: "Session saved ✓",
    loadingSession: "Loading session...",
    exerciseLibrary: "Exercise Library",
    exerciseName: "Exercise name",
    exerciseNameAr: "Exercise name (Arabic) — optional",
    muscleGroupPlaceholder: "Muscle group (e.g. Chest)",
    saveChanges: "Save Changes",
    addExercise: "Add Exercise",
    cancel: "Cancel",
    chooseExercise: "Choose Exercise",
    search: "Search...",
    noMatches: "No matches",
    categoryLarge: "LARGE",
    categorySmall: "SMALL",
    categorySideDelt: "SIDE DELT",
    categoryAbs: "ABS",
    settings: "Settings",
    trainingDaysLabel: "Training days per week",
    restDayLabel: "Rest day",
    settingsHint: "Changes apply to the day tabs above. Your logged history stays exactly as it was.",
  },
  ar: {
    appEyebrow: "تمرين كامل الجسم · برنامج ستة أيام",
    appTitle: "سجلّ التمرين",
    library: "المكتبة",
    friRest: "الجمعة · يوم راحة",
    setsCompleted: "مجموعة مكتملة",
    hash: "#",
    reps: "التكرارات",
    weight: "الوزن (كجم)",
    addSet: "إضافة مجموعة",
    swap: "استبدال",
    remove: "إزالة",
    lastPerformed: "آخر أداء",
    addExerciseToday: "إضافة تمرين لهذا اليوم",
    finishSession: "إنهاء الحصة",
    logAtLeastOneSet: "يُرجى تسجيل مجموعة واحدة مكتملة على الأقل",
    sessionSaved: "تم حفظ الحصة بنجاح",
    loadingSession: "جارٍ تحميل الحصة...",
    exerciseLibrary: "مكتبة التمارين",
    exerciseName: "اسم التمرين",
    exerciseNameAr: "اسم التمرين (بالعربية) — اختياري",
    muscleGroupPlaceholder: "العضلة المستهدفة (مثال: الصدر)",
    saveChanges: "حفظ التعديلات",
    addExercise: "إضافة تمرين",
    cancel: "إلغاء",
    chooseExercise: "اختيار تمرين",
    search: "بحث...",
    noMatches: "لا توجد نتائج",
    categoryLarge: "عضلات كبيرة",
    categorySmall: "عضلات صغيرة",
    categorySideDelt: "الكتف الجانبي",
    categoryAbs: "البطن",
    settings: "الإعدادات",
    trainingDaysLabel: "عدد أيام التمرين في الأسبوع",
    restDayLabel: "يوم الراحة",
    settingsHint: "يتم تطبيق التغييرات على أيام التمرين أعلاه، وسجلّ التمارين المحفوظ سابقًا يبقى كما هو.",
  },
};

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
}

// Pick the localized exercise name / muscle group, falling back to English.
export function localizedName(exercise, lang) {
  if (!exercise) return "";
  if (lang === "ar" && exercise.nameAr) return exercise.nameAr;
  return exercise.name;
}

export function localizedMuscleGroup(exercise, lang) {
  if (!exercise) return "";
  if (lang === "ar" && exercise.muscleGroupAr) return exercise.muscleGroupAr;
  return exercise.muscleGroup;
}

export function localizedDayLabel(day, lang) {
  if (lang === "ar" && day.labelAr) return day.labelAr;
  return day.label;
}
