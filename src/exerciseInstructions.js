// Step-by-step instructions keyed by movement pattern (same keys used in
// exerciseIcons.js EXERCISE_ICON_MAP). Exercises sharing a movement pattern
// share instructions, since the execution cues are the same regardless of
// which specific dumbbell/barbell/band variation is used.

export const INSTRUCTIONS = {
  benchPress: {
    en: [
      "Lie back on a flat bench with feet flat on the floor.",
      "Hold the weight above your chest with arms extended, wrists stacked over elbows.",
      "Lower the weight slowly to chest level, keeping elbows at roughly a 45° angle from your torso.",
      "Press back up to the starting position, squeezing your chest at the top.",
    ],
    ar: [
      "استلقِ على ظهرك على مقعد مستوٍ وقدماك ثابتتان على الأرض.",
      "أمسك الوزن فوق صدرك مباشرة والذراعان ممدودتان.",
      "أنزل الوزن ببطء حتى مستوى الصدر، مع إبقاء المرفقين بزاوية 45 درجة تقريبًا من الجذع.",
      "ادفع الوزن لأعلى للعودة لوضع البداية مع الضغط على عضلة الصدر في الأعلى.",
    ],
  },
  inclinePress: {
    en: [
      "Set an adjustable bench to a 30–45° incline and sit back against it.",
      "Hold the weight at shoulder level with palms facing forward.",
      "Press the weight upward until arms are extended, without locking the elbows fully.",
      "Lower back down with control to the starting position.",
    ],
    ar: [
      "اضبط المقعد القابل للتعديل على زاوية 30-45 درجة واستند إليه.",
      "أمسك الوزن عند مستوى الكتف وراحة اليد للأمام.",
      "ادفع الوزن لأعلى حتى تمتد الذراعان دون قفل كامل للمرفق.",
      "أنزل الوزن ببطء وتحكم للعودة لوضع البداية.",
    ],
  },
  pullUp: {
    en: [
      "Grip the pull-up bar slightly wider than shoulder-width, palms facing away from you.",
      "Hang with arms fully extended and core engaged.",
      "Pull your body up until your chin clears the bar, driving your elbows down and back.",
      "Lower yourself back down with control to a full hang.",
    ],
    ar: [
      "أمسك بعارضة العقلة بمسافة أوسع قليلاً من الكتفين وراحة اليد بعيدًا عنك.",
      "تعلّق بذراعين ممدودتين تمامًا مع شد عضلات البطن.",
      "اسحب جسمك لأعلى حتى يتجاوز ذقنك العارضة، مع دفع المرفقين للأسفل والخلف.",
      "انزل ببطء وتحكم حتى التعلّق الكامل مرة أخرى.",
    ],
  },
  row: {
    en: [
      "Hinge forward at the hips with a slight bend in the knees, back flat.",
      "Let the weight hang with arms extended toward the floor.",
      "Pull the weight toward your torso, driving your elbow back and squeezing your shoulder blade.",
      "Lower back down with control and repeat.",
    ],
    ar: [
      "انحنِ للأمام من الورك مع ثني بسيط في الركبتين والظهر مستقيم.",
      "اترك الوزن معلقًا والذراع ممدودة نحو الأرض.",
      "اسحب الوزن نحو جذعك مع دفع المرفق للخلف والضغط على لوح الكتف.",
      "أنزل الوزن ببطء وتحكم وكرر الحركة.",
    ],
  },
  squat: {
    en: [
      "Stand with feet shoulder-width apart, holding the weight at chest level or by your sides.",
      "Brace your core and push your hips back as you bend your knees.",
      "Lower until your thighs are at least parallel to the floor, keeping your chest up.",
      "Drive through your heels to stand back up to the starting position.",
    ],
    ar: [
      "قف وقدماك بعرض الكتفين، ممسكًا الوزن عند مستوى الصدر أو على الجانبين.",
      "شدّ عضلات البطن وادفع الوركين للخلف مع ثني الركبتين.",
      "انزل حتى يصبح الفخذان موازيين للأرض على الأقل، مع إبقاء الصدر مرفوعًا.",
      "ادفع بكعبيك للوقوف والعودة لوضع البداية.",
    ],
  },
  lunge: {
    en: [
      "Stand tall holding the weight at your sides or on one shoulder.",
      "Step forward, backward, or to the side (depending on the variation) into a controlled stride.",
      "Lower your back knee toward the floor until both knees form roughly 90° angles.",
      "Push through your front heel to return to standing, then repeat on the other side.",
    ],
    ar: [
      "قف منتصبًا ممسكًا الوزن على الجانبين أو على كتف واحدة.",
      "اخطُ للأمام أو للخلف أو للجانب (حسب نوع التمرين) بخطوة متحكم بها.",
      "أنزل ركبتك الخلفية نحو الأرض حتى تشكل الركبتان زاوية 90 درجة تقريبًا.",
      "ادفع بكعب القدم الأمامية للعودة للوقوف، ثم كرر على الجانب الآخر.",
    ],
  },
  hinge: {
    en: [
      "Stand with feet hip-width apart, holding the weight in front of your thighs.",
      "Keep a slight bend in the knees and push your hips straight back.",
      "Lower the weight along your legs while keeping your back flat until you feel a stretch in your hamstrings.",
      "Drive your hips forward to return to standing, squeezing your glutes at the top.",
    ],
    ar: [
      "قف وقدماك بعرض الورك، ممسكًا الوزن أمام فخذيك.",
      "حافظ على ثني بسيط في الركبتين وادفع الوركين للخلف مباشرة.",
      "أنزل الوزن على طول الساقين مع إبقاء الظهر مستقيمًا حتى تشعر بشد في الفخذ الخلفي.",
      "ادفع الوركين للأمام للعودة للوقوف مع الضغط على الأرداف في الأعلى.",
    ],
  },
  hipThrust: {
    en: [
      "Sit on the floor with your upper back against a bench, knees bent, feet flat.",
      "Rest the weight across your hips.",
      "Drive through your heels to lift your hips up until your body forms a straight line from shoulders to knees.",
      "Squeeze your glutes at the top, then lower back down with control.",
    ],
    ar: [
      "اجلس على الأرض وأعلى ظهرك مستند على مقعد، الركبتان مثنيتان والقدمان ثابتتان.",
      "ضع الوزن فوق الوركين.",
      "ادفع بالكعبين لرفع الوركين حتى يشكل الجسم خطًا مستقيمًا من الكتفين للركبتين.",
      "اضغط على الأرداف في الأعلى، ثم انزل ببطء وتحكم.",
    ],
  },
  overheadPress: {
    en: [
      "Stand or sit tall holding the weight at shoulder level, palms facing forward.",
      "Brace your core so your lower back doesn't arch.",
      "Press the weight straight overhead until your arms are fully extended.",
      "Lower back down to shoulder level with control and repeat.",
    ],
    ar: [
      "قف أو اجلس منتصبًا ممسكًا الوزن عند مستوى الكتف وراحة اليد للأمام.",
      "شدّ عضلات البطن حتى لا يتقوس أسفل الظهر.",
      "ادفع الوزن لأعلى الرأس مباشرة حتى تمتد الذراعان بالكامل.",
      "أنزل الوزن لمستوى الكتف ببطء وتحكم وكرر الحركة.",
    ],
  },
  curl: {
    en: [
      "Stand tall holding the weight with arms extended, elbows close to your torso.",
      "Keeping your upper arms still, curl the weight up toward your shoulders.",
      "Squeeze your biceps at the top of the movement.",
      "Lower the weight back down slowly to full extension.",
    ],
    ar: [
      "قف منتصبًا ممسكًا الوزن والذراعان ممدودتان والمرفقان قريبان من الجذع.",
      "مع إبقاء الجزء العلوي من الذراع ثابتًا، اثنِ الوزن لأعلى نحو الكتفين.",
      "اضغط على عضلة الباي في أعلى الحركة.",
      "أنزل الوزن ببطء للعودة للامتداد الكامل.",
    ],
  },
  dip: {
    en: [
      "Place your hands on the edge of a bench or between parallel bars, arms extended.",
      "Lower your body by bending your elbows until they reach about 90°.",
      "Keep your elbows pointing backward, close to your body.",
      "Push back up through your palms to full arm extension.",
    ],
    ar: [
      "ضع يديك على حافة مقعد أو بين قضيبين متوازيين، والذراعان ممدودتان.",
      "أنزل جسمك بثني المرفقين حتى يصلا لزاوية 90 درجة تقريبًا.",
      "حافظ على اتجاه المرفقين للخلف وقريبين من الجسم.",
      "ادفع بكفّيك للأعلى للعودة للامتداد الكامل للذراعين.",
    ],
  },
  skullCrusher: {
    en: [
      "Lie on a bench holding the weight above your chest with arms extended.",
      "Keeping your upper arms still, bend your elbows to lower the weight toward your forehead.",
      "Stop just before the weight touches your head.",
      "Extend your arms back up by contracting your triceps.",
    ],
    ar: [
      "استلقِ على مقعد ممسكًا الوزن فوق صدرك والذراعان ممدودتان.",
      "مع إبقاء الجزء العلوي من الذراع ثابتًا، اثنِ المرفقين لإنزال الوزن نحو جبهتك.",
      "توقف قبل ملامسة الوزن لرأسك مباشرة.",
      "مدّ الذراعين للأعلى مرة أخرى بانقباض عضلة التراي.",
    ],
  },
  rearFly: {
    en: [
      "Hinge forward at the hips with a flat back, weights hanging below your shoulders.",
      "Keep a slight bend in your elbows throughout the movement.",
      "Raise both arms out to the sides until they're roughly in line with your shoulders.",
      "Squeeze your shoulder blades together at the top, then lower back down with control.",
    ],
    ar: [
      "انحنِ للأمام من الورك مع استقامة الظهر، والأوزان معلقة أسفل الكتفين.",
      "حافظ على ثني بسيط في المرفقين طوال الحركة.",
      "ارفع الذراعين للجانبين حتى تصبحا بمستوى الكتفين تقريبًا.",
      "اضغط لوحي الكتف معًا في الأعلى، ثم انزل ببطء وتحكم.",
    ],
  },
  lateralRaise: {
    en: [
      "Stand tall holding a weight in each hand by your sides.",
      "Keeping a slight bend in your elbows, raise both arms out to the sides.",
      "Lift until your arms are roughly parallel to the floor, leading with your elbows.",
      "Lower back down slowly to the starting position.",
    ],
    ar: [
      "قف منتصبًا ممسكًا وزنًا بكل يد على الجانبين.",
      "مع ثني بسيط في المرفقين، ارفع الذراعين للجانبين.",
      "ارفع حتى تصبح الذراعان موازيتين للأرض تقريبًا، مع تقديم المرفقين في الحركة.",
      "أنزل ببطء للعودة لوضع البداية.",
    ],
  },
  hangingLegRaise: {
    en: [
      "Hang from a pull-up bar with arms fully extended.",
      "Engage your core to prevent swinging.",
      "Raise your legs up in front of you, keeping them as straight as comfortable, until they're at least parallel to the floor.",
      "Lower back down with control without swinging.",
    ],
    ar: [
      "تعلّق من عارضة العقلة والذراعان ممدودتان تمامًا.",
      "شدّ عضلات البطن لمنع التأرجح.",
      "ارفع رجليك أمامك مستقيمتين قدر الإمكان حتى تصبحا موازيتين للأرض على الأقل.",
      "أنزلهما ببطء وتحكم دون تأرجح.",
    ],
  },
  plank: {
    en: [
      "Get into a forearm-plank position with elbows under your shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Engage your core and glutes, avoiding letting your hips sag or rise.",
      "Hold the position for the target time while breathing steadily.",
    ],
    ar: [
      "اتخذ وضعية البلانك على الساعدين مع المرفقين تحت الكتفين مباشرة.",
      "حافظ على جسمك في خط مستقيم من الرأس حتى الكعبين.",
      "شدّ عضلات البطن والأرداف، وتجنّب هبوط أو ارتفاع الوركين.",
      "حافظ على الوضعية للمدة المستهدفة مع التنفس بانتظام.",
    ],
  },
  sitUp: {
    en: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Place your hands across your chest or lightly behind your head.",
      "Curl your torso up toward your knees, exhaling as you rise.",
      "Lower back down with control to the starting position.",
    ],
    ar: [
      "استلقِ على ظهرك والركبتان مثنيتان والقدمان ثابتتان على الأرض.",
      "ضع يديك على صدرك أو خلف رأسك برفق.",
      "ارفع جذعك نحو ركبتيك مع الزفير أثناء الصعود.",
      "انزل ببطء وتحكم للعودة لوضع البداية.",
    ],
  },
  pushUp: {
    en: [
      "Start in a plank position with hands slightly wider than shoulder-width.",
      "Keep your body in a straight line from head to heels.",
      "Lower your chest toward the floor by bending your elbows.",
      "Push back up to the starting position, fully extending your arms.",
    ],
    ar: [
      "ابدأ بوضعية البلانك واليدان أوسع قليلاً من الكتفين.",
      "حافظ على جسمك في خط مستقيم من الرأس حتى الكعبين.",
      "أنزل صدرك نحو الأرض بثني المرفقين.",
      "ادفع للأعلى للعودة لوضع البداية مع مدّ الذراعين بالكامل.",
    ],
  },
  calfRaise: {
    en: [
      "Stand tall with the balls of your feet on the floor (or edge of a step), holding weight if desired.",
      "Rise up onto your toes as high as possible, squeezing your calves.",
      "Hold briefly at the top.",
      "Lower your heels back down slowly, feeling a stretch at the bottom.",
    ],
    ar: [
      "قف منتصبًا وأصابع قدميك على الأرض (أو حافة درجة)، وامسك وزنًا إن رغبت.",
      "ارتفع على أطراف أصابع قدميك لأعلى ما يمكن مع الضغط على عضلة السمانة.",
      "اثبت لحظة في الأعلى.",
      "أنزل كعبيك ببطء للشعور بشد في الأسفل.",
    ],
  },
  shrug: {
    en: [
      "Stand tall holding the weight at your sides, arms fully extended.",
      "Without bending your elbows, raise your shoulders straight up toward your ears.",
      "Squeeze at the top for a brief pause.",
      "Lower your shoulders back down slowly to the starting position.",
    ],
    ar: [
      "قف منتصبًا ممسكًا الوزن على الجانبين والذراعان ممدودتان تمامًا.",
      "دون ثني المرفقين، ارفع كتفيك مباشرة نحو أذنيك.",
      "اضغط لحظة في الأعلى.",
      "أنزل كتفيك ببطء للعودة لوضع البداية.",
    ],
  },
  superman: {
    en: [
      "Lie face down on the floor with arms extended in front of you.",
      "Simultaneously lift your arms, chest, and legs a few inches off the floor.",
      "Hold the raised position, squeezing your lower back and glutes.",
      "Lower back down with control and repeat.",
    ],
    ar: [
      "استلقِ على بطنك على الأرض والذراعان ممدودتان أمامك.",
      "ارفع الذراعين والصدر والرجلين معًا بضع سنتيمترات عن الأرض.",
      "اثبت في الوضعية المرتفعة مع الضغط على أسفل الظهر والأرداف.",
      "انزل ببطء وتحكم وكرر الحركة.",
    ],
  },
  twist: {
    en: [
      "Sit on the floor with your knees bent and lean back slightly, keeping your back straight.",
      "Lift your feet off the floor for added difficulty, or keep them planted for an easier version.",
      "Rotate your torso to one side, then the other, keeping your core engaged throughout.",
      "Move with control rather than momentum.",
    ],
    ar: [
      "اجلس على الأرض والركبتان مثنيتان وانحنِ للخلف قليلاً مع إبقاء الظهر مستقيمًا.",
      "ارفع قدميك عن الأرض لزيادة الصعوبة، أو أبقهما ثابتتين لنسخة أسهل.",
      "لُف جذعك لجانب ثم الآخر مع شدّ عضلات البطن طوال الحركة.",
      "تحرك بتحكم بدلاً من الاندفاع.",
    ],
  },
};

export function getInstructions(patternKey, lang) {
  const entry = INSTRUCTIONS[patternKey];
  if (!entry) return [];
  return entry[lang] || entry.en || [];
}
