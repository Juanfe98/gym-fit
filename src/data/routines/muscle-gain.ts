import type { Routine } from '../../types';

export const muscleGainRoutine: Routine = {
  goal: 'muscle-gain',
  displayName: 'Muscle Gain',
  rationale:
    'Push/Pull/Legs with an upper–lower volume day uses each muscle group 2× per week — the minimum effective frequency for hypertrophy. The split front-loads compound movements for mechanical tension, then finishes with isolation work for metabolic stress. Rest days are placed after the leg day and at the end of the week to allow recovery on the highest-volume sessions.',
  days: [
    {
      label: 'Day 1',
      focus: 'Push — Chest & Triceps',
      exercises: [
        {
          exerciseKey: 'barbell-bench-press',
          name: 'Barbell Bench Press',
          rationale:
            'Primary chest mass builder. Heavy horizontal pressing recruits the most pectoral motor units and allows progressive overload across a wide rep range, making it the cornerstone of any hypertrophy push day.',
          formCues: [
            'Arch your upper back and retract your scapulae before unracking — this shortens the pressing path and protects the shoulder joint.',
            'Grip the bar 1.5–2× shoulder-width; wrist stacked directly over the elbow at the bottom.',
            'Touch the bar to your lower sternum, not your upper chest — elbows at roughly 45–75° from the torso.',
            'Drive your feet into the floor throughout the press; leg drive transfers force through the arch into the bar.',
            'Squeeze the bar as if trying to bend it inward to cue tricep and pec co-activation at lockout.',
          ],
          commonMistakes: [
            'Flaring elbows to 90° places excessive shear on the anterior capsule — tuck them to 45–75° instead.',
            'Bouncing the bar off the chest removes tension from the pec at the most advantageous position in the range of motion.',
            'Losing upper-back tightness mid-set lets the shoulders roll forward, reducing force transfer and increasing impingement risk.',
          ],
        },
        {
          exerciseKey: 'incline-dumbbell-press',
          name: 'Incline Dumbbell Press',
          rationale:
            'Targets the clavicular (upper) pec head that flat pressing underserves. Dumbbells allow a longer range of motion and independent arm movement, addressing left-right strength imbalances common in barbell-dominant trainees.',
          formCues: [
            'Set bench at 30–45°; steeper than 45° shifts load to anterior deltoid, not upper pec.',
            'Lower dumbbells to the sides of your lower chest with elbows at 60–70° flare.',
            'At the top, press and squeeze inward slightly — think "crushing a pencil between your pecs" at lockout.',
            'Keep shoulder blades pinched together; let them protract only in the final 10° of lockout.',
          ],
          commonMistakes: [
            'Using too steep an incline (>50°) turns the exercise into a front-delt press — the upper pec contributes far less.',
            'Rushing the eccentric: the stretch under load drives hypertrophic signalling — take 2–3 s on the way down.',
          ],
        },
        {
          exerciseKey: 'cable-crossover',
          name: 'Cable Crossover',
          rationale:
            'Cables maintain constant tension through the full arc, unlike free weights that unload the pec at peak contraction. Placed after heavy presses, crossovers provide the metabolic stress and pump needed for complete pectoral development.',
          formCues: [
            'Set pulleys to shoulder height or slightly above; step forward so cables pull your arms slightly back at the start.',
            'Slight forward lean keeps the line of pull in line with the pec fibers.',
            'Arc your arms down and across, ending with hands crossing past the midline to achieve full pec contraction.',
            'Hold the contracted position for 1 second; resist the urge to allow momentum on the eccentric.',
          ],
          commonMistakes: [
            'Using a range of motion that stops at center — crossing past midline is where peak pec contraction occurs.',
            'Allowing the torso to swing forward on each rep converts this into a full-body movement rather than pec isolation.',
          ],
        },
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'The overhead press builds anterior and lateral deltoid mass that translates into broader shoulder width — a key aesthetic marker in hypertrophy training. Including it on push day ensures shoulders receive direct volume in addition to their synergistic work during pressing.',
          formCues: [
            'Grip slightly outside shoulder-width; bar rests on the front delts in the start position, not in the hands.',
            'Squeeze your glutes and brace your abs before pressing — prevents lumbar hyperextension under load.',
            'Press the bar in a straight vertical line; your head moves back to clear the path, then forward once the bar passes your forehead.',
            'Shrug your traps into the bar at the top to achieve full shoulder elevation and overhead stability.',
          ],
          commonMistakes: [
            'Excessive lumbar arch to compensate for poor shoulder mobility — address thoracic extension first before loading.',
            'Pressing the bar forward of your center of mass creates a lever arm that dramatically increases the load on the lower back.',
          ],
        },
        {
          exerciseKey: 'cable-triceps-pushdown',
          name: 'Cable Tricep Pushdown',
          rationale:
            'Isolates the triceps with constant cable tension at both the stretched and contracted positions. As a finishing movement after heavy pressing, it accumulates volume in the long and lateral heads to maximize arm size.',
          formCues: [
            'Use a rope or straight bar; elbows pinned to your sides throughout — movement is elbow extension only.',
            'Lean forward 10–15° at the hip to keep the cable angle perpendicular to your forearm at peak contraction.',
            'With a rope, splay the handles outward at the bottom to maximally contract the lateral head.',
            'Control the eccentric fully — 2–3 s up to a full 90–120° elbow angle to stretch the long head.',
          ],
          commonMistakes: [
            'Letting elbows drift forward during the press turns it into a compound pressing motion — the tricep does less isolated work.',
            'Going too heavy and relying on shoulder flexion to initiate the rep — reduce load and keep the upper arm vertical and stationary.',
          ],
        },
      ],
    },
    {
      label: 'Day 2',
      focus: 'Pull — Back & Biceps',
      exercises: [
        {
          exerciseKey: 'barbell-bent-over-row',
          name: 'Barbell Bent-Over Row',
          rationale:
            'The bent-over row is the primary back mass builder, loading the lats, rhomboids, and traps with heavy loads in the horizontal plane. Its ability to be loaded progressively with a barbell makes it the most effective compound pull for building a thick upper back.',
          formCues: [
            'Hinge to approximately 45–60° of forward lean; more horizontal than a deadlift, less than a good morning.',
            'Drive your elbows back past your torso, not flared outward — this engages the lats and mid-back over the rear delts.',
            'Pull the bar to your lower sternum or upper abdomen depending on your elbow path; neither position is wrong if it keeps the lats under tension.',
            'Keep a neutral spine throughout — do not allow the lower back to round under load.',
            'Control the bar on the way down: a slow eccentric on back exercises loads the muscle in the stretched position where hypertrophic stimulus is highest.',
          ],
          commonMistakes: [
            'Using excessive body English (hip drive) to jerk the weight up reduces back muscle involvement — your torso angle should remain constant.',
            'Pulling with a narrow grip and flared elbows turns it into a rear-delt exercise — a wider grip and tucked elbows target the lats more directly.',
          ],
        },
        {
          exerciseKey: 'lat-pulldown',
          name: 'Lat Pulldown',
          rationale:
            'Targets the latissimus dorsi in its full range — from full overhead stretch to peak contraction at the chest. Lat pulldowns build the "V-taper" width that bent-over rows do not fully address, and allow precise isolation work after heavier compound movements.',
          formCues: [
            'Grip the bar 1.5–2× shoulder-width with a full overhand grip; avoid false grip (thumbs over bar).',
            'Initiate the pull by depressing your scapulae and retracting your shoulders — your elbows should travel down and back, not straight down.',
            'Lean slightly back (10–15°) and pull the bar to your upper chest, not behind your neck.',
            'Achieve full elbow extension at the top for a complete lat stretch — do not truncate the range of motion.',
          ],
          commonMistakes: [
            'Letting the torso rock back and forth converts this into a rowing movement — keep torso angle fixed.',
            'Not depressing the scapula at the start: pulling with elevated shoulders shifts load to the upper traps and reduces lat activation.',
          ],
        },
        {
          exerciseKey: 'seated-cable-row',
          name: 'Seated Cable Row',
          rationale:
            'The horizontal pulling pattern thickens the mid-back (rhomboids, mid-traps) in a way vertical pulling cannot. Cables provide continuous tension, and the seated position eliminates the lower-back stress of the bent-over row, allowing higher-quality reps on fatigued back muscles.',
          formCues: [
            'Sit tall with a slight natural lumbar curve; avoid excessive trunk lean as a range-of-motion compensator.',
            'Pull the handle to your lower sternum and drive your elbows back past your torso.',
            'Squeeze the mid-back at full contraction for 1 second to reinforce the motor pattern.',
            'On the return, allow your scapulae to protract forward at the end of the eccentric — this stretches the mid-back under load.',
          ],
          commonMistakes: [
            'Rounding the lower back at the end of the eccentric to reach further forward — the stretch benefit is in the scapulae, not the lumbar spine.',
            'Using a grip that is too wide encourages rear-delt dominance over lat and rhomboid activation.',
          ],
        },
        {
          exerciseKey: 'cable-face-pull',
          name: 'Cable Face Pull',
          rationale:
            'Directly targets the rear delts and external rotators — muscles chronically underdeveloped in pushing-heavy programs. Face pulls counterbalance the internal rotation load of heavy pressing and are a mandatory injury-prevention tool for shoulder longevity in hypertrophy training.',
          formCues: [
            'Set pulley at face height; use rope attachment with a pronated grip (palms facing each other at the start).',
            'Pull the rope to your face, separating the handles toward your ears with elbows at shoulder height.',
            'At full contraction, your upper arms should be parallel to the floor and your forearms vertical — a "double bicep" position.',
            'Externally rotate fully — the goal is maximum posterior capsule and rotator cuff activation, not just pulling the rope.',
          ],
          commonMistakes: [
            'Dropping the elbows below shoulder height reduces rear delt involvement — keep them parallel to the floor.',
            'Going too heavy at the expense of range of motion: the external rotation component is the therapeutic value of this exercise.',
          ],
        },
        {
          exerciseKey: 'barbell-curl',
          name: 'Barbell Curl',
          rationale:
            'The barbell curl allows maximal loading of the biceps brachii in the supinated position where it is strongest. At the end of a pull session, the biceps are pre-fatigued from rowing, making barbell curls an efficient way to accumulate the direct arm volume needed for hypertrophy without heavy loading.',
          formCues: [
            'Use a shoulder-width grip; avoid wide grip (reduces peak contraction) or narrow grip (stresses wrists).',
            'Keep elbows stationary at your sides throughout — only elbow flexion should occur.',
            'Supinate your wrists maximally at the top of the curl to achieve full bicep contraction.',
            'Take 2–3 s on the eccentric — the loaded stretch at the bottom is where much of the hypertrophic work happens.',
          ],
          commonMistakes: [
            'Swinging the torso creates momentum that takes load off the biceps at the most critical portion of the lift — reduce load and eliminate the swing.',
            'Not reaching full elbow extension at the bottom — partial range of motion leaves the long head undertrained.',
          ],
        },
      ],
    },
    {
      label: 'Day 3',
      focus: 'Legs — Quads, Hamstrings & Glutes',
      exercises: [
        {
          exerciseKey: 'barbell-back-squat',
          name: 'Barbell Back Squat',
          rationale:
            'The back squat is the single highest-yield lower body movement for hypertrophy. It loads the quads, glutes, and spinal erectors under heavy load across a deep range of motion, and the systemic hormonal response to heavy squatting elevates anabolic signalling across the entire session.',
          formCues: [
            'Place the bar in a high-bar or low-bar position consistently — choose based on your anatomy and ankle mobility, not preference.',
            'Take a stance that lets you reach depth (hip crease below knee) while keeping your heels flat — stance width varies by hip structure.',
            'Brace as if bracing for a punch: breath into your belly, create circumferential pressure, then descend.',
            'Keep your knees tracking in line with your second toe throughout the descent and ascent.',
            'Drive the floor away from you, not your hips up — the cue "chest up" prevents good morning squats under fatigue.',
          ],
          commonMistakes: [
            'Heels rising off the floor indicates ankle mobility limitation or excessive forward lean — address ankle flexibility before adding load.',
            'Caving knees (valgus collapse) on the ascent is usually a combination of glute weakness and adductor dominance — cue "spread the floor" with your feet.',
          ],
        },
        {
          exerciseKey: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          rationale:
            'The RDL is the premier hamstring hypertrophy exercise, loading the hamstrings in a maximally lengthened position under tension — the stretch stimulus is the primary driver of hamstring growth. Placed after squats, it targets hamstrings and glutes that the quad-dominant squat partially spares.',
          formCues: [
            'Start standing, push your hips back as far as possible before the bar moves down — this is a hip hinge, not a squat.',
            'Maintain a slight knee bend that stays constant throughout — do not let the knees bend more as you descend.',
            'Keep the bar in contact with your legs from thighs to shins — it should "drag" down your legs.',
            'Stop when your lower back begins to round, or when you feel maximal hamstring tension — typically bar at mid-shin.',
            'Drive your hips forward to return to standing; squeeze your glutes at the top.',
          ],
          commonMistakes: [
            'Bending the knees progressively during the descent converts this into a conventional deadlift — maintain the fixed knee angle.',
            'Rounding the lumbar spine at the bottom: lower the weight until you can maintain neutral spine throughout the full range.',
          ],
        },
        {
          exerciseKey: 'leg-press',
          name: 'Leg Press',
          rationale:
            'After heavy squatting, the leg press provides additional quad volume with the lower back removed from the equation. Foot placement can be adjusted to emphasize different quad heads or glutes, allowing targeted stimulus after compound work.',
          formCues: [
            'Place feet shoulder-width at the middle of the platform; lower placement emphasizes quads, higher placement shifts load to glutes and hamstrings.',
            'Descend until your thighs reach 90° or your lower back begins to peel off the pad — do not exceed this range.',
            'Do not lock out your knees at the top — maintain slight bend to keep constant tension on the quads.',
            'Drive evenly through the full foot, not through the heels alone.',
          ],
          commonMistakes: [
            'Allowing the lower back to peel off the pad at the bottom is a lumbar flexion fault — reduce the range of motion until posterior tilt is eliminated.',
            'Locking out the knees fully between reps reduces time under tension and risks hyperextension under load.',
          ],
        },
        {
          exerciseKey: 'lying-leg-curl',
          name: 'Leg Curl (Machine)',
          rationale:
            'The leg curl isolates the hamstrings in the knee-flexion function that compound hip-hinge movements cannot address. Research shows the hamstrings have two primary functions — knee flexion and hip extension — and fully developing them requires direct training of both.',
          formCues: [
            'Position the pad just above your Achilles tendon, not in the middle of your calves.',
            'Curl fully until your heels approach your glutes — do not stop at 90°.',
            'Hold the contracted position for 1 second; the hamstring contraction at this end range is where hypertrophic signalling is highest.',
            'Lower slowly — 2–3 s eccentric — the hamstring is highly responsive to loaded eccentric work.',
          ],
          commonMistakes: [
            'Lifting the hips off the pad to curl more weight — this hip extension reduces hamstring isolation and stresses the lumbar spine.',
            'Using a range of motion that stops at 90° and misses the fully shortened position.',
          ],
        },
        {
          exerciseKey: 'standing-calf-raise',
          name: 'Standing Calf Raise',
          rationale:
            'Calves are trained infrequently and respond to high frequency and volume. The standing calf raise targets the gastrocnemius (the larger, outer head) with the knee extended. Including calf work at the end of leg day accumulates the high-rep volume the muscle needs to grow.',
          formCues: [
            'Stand on an elevated surface (step or plate) to allow full plantar flexion and dorsiflexion range.',
            'Rise all the way onto your toes — do not stop at a partial range.',
            'Lower slowly until you feel a full stretch in the calf before the next rep.',
            'Avoid bouncing at the bottom — the Achilles tendon will absorb the stretch reflex, reducing muscle stimulus.',
          ],
          commonMistakes: [
            'Using partial range of motion at the bottom — the most important stimulus is the full dorsiflexion stretch under load.',
            'Going through the motion too fast: calves respond better to slow, controlled reps with a pause at both ends of the range.',
          ],
        },
      ],
    },
    {
      label: 'Day 4',
      focus: 'Upper — Chest, Back & Shoulders (Volume)',
      exercises: [
        {
          exerciseKey: 'barbell-incline-bench-press',
          name: 'Barbell Incline Bench Press',
          rationale:
            'The second pressing session of the week hits the upper pec with a barbell to allow heavier loading than the incline dumbbell press from Day 1. Frequency is the most robust driver of hypertrophy, and this second exposure ensures the upper chest receives sufficient weekly volume.',
          formCues: [
            'Set the bench at 30–45°; retract scapulae and create an upper-back arch before unracking.',
            'Lower the bar to your upper chest, elbows at 60–70° — not straight out to 90°.',
            'Drive your feet into the floor; leg drive is active even on an incline.',
            'Pause briefly on the chest before pressing to eliminate the stretch reflex and maximize pec tension.',
          ],
          commonMistakes: [
            'Setting the bench too steep (above 45°) turns this into a shoulder press and removes upper-pec involvement.',
            'A narrow grip on the incline shifts load entirely to the triceps — go at least shoulder-width plus one hand.',
          ],
        },
        {
          exerciseKey: 'pull-up',
          name: 'Pull-Up',
          rationale:
            'Pull-ups develop lat width through full scapular range of motion with bodyweight or added load. The closed-chain nature of the pull-up activates stabiliser muscles around the shoulder girdle that machine lat pulldowns cannot replicate, making them a superior back builder for intermediate-to-advanced trainees.',
          formCues: [
            'Use a shoulder-width overhand grip; wider grips reduce range of motion and do not preferentially target outer lats.',
            'Begin each rep with a dead hang — full arm extension and passive shoulder elevation.',
            'Depress your scapulae first, then pull your elbows toward your hips rather than toward the floor.',
            'Pull until your chin clears the bar or your chest approaches it — do not stop when elbows reach 90°.',
            'Lower with control to a full dead hang — the eccentric is where significant lat hypertrophy stimulus occurs.',
          ],
          commonMistakes: [
            'Kipping or using momentum: the pull-up is a strength and hypertrophy tool — use a strict, controlled rep with no leg swing.',
            'Truncating the bottom range to avoid the dead hang — the lat stretch at the bottom is critical for full muscle length training.',
          ],
        },
        {
          exerciseKey: 'dumbbell-shoulder-press',
          name: 'Dumbbell Shoulder Press',
          rationale:
            'A second shoulder pressing movement increases deltoid volume across the week. Dumbbells allow a more natural rotation through the pressing path and greater range of motion than a barbell, targeting the lateral and anterior heads with reduced internal rotation stress.',
          formCues: [
            'Press dumbbells to full arm extension, finishing with a slight internal rotation — the natural arc of the shoulder joint.',
            'Keep your lower back from arching excessively — this is often a signal the weight is too heavy.',
            'Lower dumbbells to ear level with elbows at 90° before pressing — do not shorten the range of motion.',
            'Control the descent to 2–3 s; deltoid hypertrophy responds well to time under tension.',
          ],
          commonMistakes: [
            'Pressing straight up rather than slightly in — the shoulder joint naturally follows an arc; fighting it creates impingement risk.',
            'Partial reps that stop well below ear level — full range of motion is required to fully load the middle and front delt heads.',
          ],
        },
        {
          exerciseKey: 'dumbbell-hammer-curl',
          name: 'Dumbbell Hammer Curl',
          rationale:
            'Hammer curls train the brachialis — the muscle that sits beneath the bicep and pushes it outward — in the neutral-grip position where it is strongest. Including both supinated and neutral-grip curl variations ensures complete arm development across both heads of the biceps and the brachialis.',
          formCues: [
            'Hold dumbbells with a neutral grip (palms facing each other) throughout the entire range of motion — do not supinate at the top.',
            'Keep elbows stationary at your sides; only elbow flexion occurs.',
            'Perform reps alternately or simultaneously — either technique is valid; alternating allows slight torso lean to extend the range.',
            'Lower fully to an extended elbow before the next rep — the stretched position is critical for brachialis hypertrophy.',
          ],
          commonMistakes: [
            'Supinating the wrist at the top converts this into a standard dumbbell curl — the neutral grip must be maintained to target the brachialis.',
            'Swinging the upper arm forward at the top of the rep uses shoulder flexion to get the dumbbell higher — this is a range-of-motion compensation, not a strength advantage.',
          ],
        },
        {
          exerciseKey: 'skull-crusher',
          name: 'Skull Crusher',
          rationale:
            'The skull crusher targets the long head of the triceps in a maximally stretched position — the angle of the arm in overhead extension creates a longer muscle length than any pushdown variation. This makes it the most effective direct tricep exercise for complete arm development.',
          formCues: [
            'Lie flat on a bench; hold the EZ-bar or dumbbells with elbows above your eyes, not above your chest.',
            'Lower the bar toward your forehead (or just above) by hinging only at the elbow.',
            'Keep elbows pointing straight up — do not allow them to flare outward or drift toward your face.',
            'Extend fully at the top but do not lock out the elbows completely — maintain tension on the tricep.',
          ],
          commonMistakes: [
            'Allowing the elbows to drift forward (toward your feet) reduces the stretch on the long head — the elbows should remain perpendicular to the torso.',
            'Using too heavy a load: skull crushers require strict form to avoid elbow stress — go lighter than your ego suggests and use perfect mechanics.',
          ],
        },
      ],
    },
    {
      label: 'Day 5',
      focus: 'Lower — Glutes & Hamstrings (Volume)',
      exercises: [
        {
          exerciseKey: 'hack-squat',
          name: 'Hack Squat',
          rationale:
            'The hack squat allows a more upright torso than the back squat, shifting quad emphasis to the rectus femoris and VMO. At high loads with a controlled eccentric, it produces significant mechanical tension in the quad in a position that the back squat does not fully replicate.',
          formCues: [
            'Place feet shoulder-width or slightly narrower at the mid-platform; closer stance = more quad emphasis.',
            'Keep your lower back pressed firmly against the pad throughout — do not allow it to peel away at the bottom.',
            'Descend until your hips are below your knees, maintaining constant back contact with the pad.',
            'Drive through the full foot on the ascent; do not rise onto your toes.',
          ],
          commonMistakes: [
            'Placing feet too high on the platform shifts the exercise toward a glute-dominant movement and removes much of the intended quad stimulus.',
            'Allowing the lower back to peel off the pad at depth is a lumbar flexion risk — reduce depth until back contact is maintained.',
          ],
        },
        {
          exerciseKey: 'barbell-glute-bridge',
          name: 'Barbell Glute Bridge',
          rationale:
            'The glute bridge is the most effective exercise for glute hypertrophy. Research consistently shows higher glute EMG activation in glute bridges compared to squats and deadlifts, and the movement trains the glutes in their maximally shortened position — a range the squat pattern cannot address.',
          formCues: [
            'Place your upper back across a bench at shoulder-blade level; the bar rests across your hip crease, padded.',
            'Drive through your full foot — especially the mid-foot — to maintain shin verticality throughout the rep.',
            'At the top, squeeze your glutes maximally and hold for 1–2 seconds; hips should be fully extended.',
            'Do not hyperextend the lumbar spine at the top — tuck your pelvis slightly to isolate glute contraction over spinal extension.',
          ],
          commonMistakes: [
            'Driving through the heels causes the shins to angle back, reducing glute activation and placing load on the hamstrings instead.',
            'Letting the lower back arch at peak extension: the movement ends with a posterior pelvic tilt, not a lumbar arch.',
          ],
        },
        {
          exerciseKey: 'leg-extension',
          name: 'Leg Extension',
          rationale:
            'The leg extension isolates the rectus femoris — the quad head that crosses both the hip and knee and is the hardest to stimulate through compound pressing. Recent research shows significant quad hypertrophy from leg extensions even at relatively light loads, making it an efficient finishing movement for quad volume.',
          formCues: [
            'Position the pad so it rests on the lower shin just above the ankle.',
            'Extend fully to a locked-out position — the full contraction at end range is the most important part of the rep.',
            'Hold the top position for 1 second on each rep to ensure full quad contraction.',
            'Lower slowly over 2–3 s; the eccentric loading of the quad at the lengthened position is critical for rectus femoris growth.',
          ],
          commonMistakes: [
            'Stopping short of full extension and missing the peak contraction — the locked-out position is where the rectus femoris is most activated.',
            'Going too heavy and bouncing the weight at the bottom — this substitutes momentum for muscle tension and increases patellar tendon stress.',
          ],
        },
        {
          exerciseKey: 'bulgarian-split-squat',
          name: 'Bulgarian Split Squat',
          rationale:
            'The Bulgarian split squat loads each leg independently, identifying and correcting strength asymmetries that bilateral squats mask. The single-leg nature produces greater glute and quad stretch under load, and the elevated rear foot deepens hip flexor stretch — addressing a mobility deficit common in desk-bound trainees.',
          formCues: [
            'Place your rear foot on a bench 1–2 ft behind your hip; the working foot is far enough forward that your shin is vertical at the bottom.',
            'Descend until your rear knee approaches the floor; the front knee tracks over the second toe.',
            'Keep your torso upright — forward lean shifts load to the glutes; more upright position targets quads.',
            'Drive through the full front foot to return to standing; do not push off the rear foot.',
          ],
          commonMistakes: [
            'Placing the front foot too close to the bench causes the knee to travel excessively forward over the toe — move the front foot further out.',
            'Using too much weight before mastering the balance — this movement requires significant proprioceptive control; build the motor pattern before loading heavily.',
          ],
        },
        {
          exerciseKey: 'barbell-good-morning',
          name: 'Barbell Good Morning',
          rationale:
            'Good mornings build spinal erector and hamstring strength in the hip-hinge pattern under direct loading. They reinforce the same mechanics as the deadlift and RDL while providing targeted posterior chain stimulus that supports both lower body hypertrophy and injury prevention.',
          formCues: [
            'Begin with a light load — this exercise is highly sensitive to technique and the loading on the lumbar spine is significant.',
            'Hinge at the hips with a neutral spine; the bar should travel directly over the ankle as you lean forward.',
            'Maintain a slight knee bend throughout — a locked-out knee places more stretch on the hamstring but less control for most trainees.',
            'Only go as far forward as you can with a perfectly neutral spine; stop well above the point of lumbar rounding.',
          ],
          commonMistakes: [
            'Rounding the lower back under load is the most serious fault — this movement must be abandoned and weight reduced the moment spinal neutrality is lost.',
            'Using a squat-style bar position (high-bar) when a low-bar position is safer — low-bar distributes the load through the torso more stably.',
          ],
        },
      ],
    },
  ],
};
