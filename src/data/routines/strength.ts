import type { Routine } from '../../types';

export const strengthRoutine: Routine = {
  goal: 'strength',
  displayName: 'Strength',
  rationale:
    'A conjugate-influenced powerlifting split dedicates individual days to the squat, bench, and deadlift patterns and uses accessory work to strengthen the specific weaknesses that limit each lift. Training each primary movement once per week at high intensity allows full nervous system recovery — the primary constraint in maximum-strength development. Accessory days address lagging muscle groups and reinforce the skill components of the big three.',
  days: [
    {
      label: 'Day 1',
      focus: 'Squat — Primary + Accessory',
      exercises: [
        {
          exerciseKey: 'barbell-back-squat',
          name: 'Barbell Back Squat',
          rationale:
            'Main squat day is built around the back squat as the primary strength expression. Working up to a heavy single, triple, or set across at 80–90% of 1RM trains the neuromuscular patterns specific to maximal force production — distinct from the 8–12 rep hypertrophy work used in other programs.',
          formCues: [
            'Approach the squat with a detailed warm-up protocol: empty bar, then incremental loading sets before working weight.',
            'Brace to maximal intra-abdominal pressure before each rep — this is not a passive brace but a deliberate maximal breath-hold under a Valsalva maneuver.',
            'Initiate the descent by breaking at the hips and knees simultaneously — not hips-first or knees-first.',
            'Maintain tightness through the entire range; do not relax at the bottom position.',
            'The ascent begins with maximum force application — cue "explode" to recruit high-threshold motor units.',
          ],
          commonMistakes: [
            'Relaxing tension in the bottom position ("butt wink" or rounding) is the most common squat injury mechanism — maintain full-body tension through the entire range.',
            'Insufficient warm-up before heavy sets increases both injury risk and performance variability — never rush to working weight.',
          ],
        },
        {
          exerciseKey: 'hack-squat',
          name: 'Hack Squat',
          rationale:
            'After maximal effort squatting, the hack squat extends quad volume without loading the axial skeleton or central nervous system as heavily. It reinforces quad dominance in the squat pattern and builds the quad mass that directly transfers to the back squat lockout.',
          formCues: [
            'Use 60–70% of your working hack squat weight after heavy back squats — this is accessory work, not a second max effort.',
            'Place feet low on the platform to maximize quad emphasis.',
            'Full range of motion: hip crease below knee, back flat against pad.',
            'Controlled eccentric (3 s down) to accumulate time under tension without additional CNS stress.',
          ],
          commonMistakes: [
            'Treating this as a second heavy squat session will accumulate too much CNS fatigue for the rest of the training week.',
            'Cutting depth short after heavy squats — the accessory work is most valuable when performed through full range.',
          ],
        },
        {
          exerciseKey: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          rationale:
            'Hamstring strength is a primary squat limiter — weak hamstrings fail to support the knee joint under maximal squat loads. RDLs on squat day build the posterior chain that directly transfers to squat stability and lockout strength without the acute fatigue of a full deadlift.',
          formCues: [
            'Perform with 50–60% of conventional deadlift weight — this is a strength accessory, not a max-effort hinge.',
            'Maintain hip hinge mechanics: hips back, knees slightly bent and fixed, bar dragging down the legs.',
            'Go to the point of maximal hamstring tension without lumbar rounding.',
            'Hold the stretched position for 1 second at the bottom to develop strength in the lengthened position.',
          ],
          commonMistakes: [
            'Turning RDLs into a conventional deadlift by bending the knees progressively — this removes the eccentric hamstring loading that makes the exercise valuable for squatters.',
            'Rounding the lower back at the bottom: this is an indicator of either excessive range of motion or too much weight.',
          ],
        },
        {
          exerciseKey: 'lying-leg-curl',
          name: 'Leg Curl (Machine)',
          rationale:
            'Direct hamstring knee-flexion work supplements the hip-extension training of the RDL. For powerlifters, well-developed hamstrings prevent knee instability at the bottom of the squat and contribute to drive out of the hole.',
          formCues: [
            'Perform 3–4 sets of 10–15 reps as a higher-rep accessory — strength work is done, this is targeted hypertrophy.',
            'Full range of motion: complete knee extension at the start, heels to glutes at the peak contraction.',
            'Keep hips pinned to the pad — no hip lifting to extend the curl range.',
            'Slow eccentric: 2–3 s return to the starting position.',
          ],
          commonMistakes: [
            'Rushing through these reps after heavy squats — the value here is in quality muscle stimulus, not simply completing the set.',
            'Using the same intensity as you would on a standalone leg day — volume and load should be reduced to avoid compromising recovery.',
          ],
        },
        {
          exerciseKey: 'leg-extension',
          name: 'Leg Extension',
          rationale:
            'The rectus femoris — the quad head crossing both hip and knee — is critical for squat lockout strength. Leg extensions train it in isolation, allowing direct strength work in the knee-extension function that compound squatting exercises do not fully address.',
          formCues: [
            'Use 3 sets of 12–15 reps with controlled tempo — this is the final accessory movement of the squat day.',
            'Lock out fully at the top on each rep — the contracted position is critical for developing quad end-range strength.',
            'Hold the peak contraction for 2 seconds to develop strength in the shortened position.',
            'Maintain upright posture; do not lean forward to facilitate the extension.',
          ],
          commonMistakes: [
            'Going too heavy after squats: the knees are already under significant load from the primary work — use moderate weight with perfect form.',
            'Partial reps that stop before full extension miss the motor unit recruitment at end range where the rectus femoris is most active.',
          ],
        },
      ],
    },
    {
      label: 'Day 2',
      focus: 'Bench — Primary + Accessory',
      exercises: [
        {
          exerciseKey: 'barbell-bench-press',
          name: 'Barbell Bench Press',
          rationale:
            'The bench press is the primary upper body strength expression in powerlifting. Training it with heavy singles, doubles, or triples at 85–95% of 1RM develops maximal pressing force through neural efficiency — not just muscle mass — which is the defining characteristic of strength training.',
          formCues: [
            'Use a competition-legal setup: upper back arch, shoulder blades retracted, feet flat on floor or on toes if permitted.',
            'Touch-and-go or paused reps both build strength; pause reps develop more starting strength off the chest.',
            'Grip at a width that places your forearms vertical when the bar touches your chest — this maximizes force transfer.',
            'Drive your feet through the floor and push your back into the bench on every rep — leg drive generates 10–20% of the force output.',
            'Bar path is not straight up but slightly back toward the rack — the shoulder joint naturally follows this arc.',
          ],
          commonMistakes: [
            'Bouncing the bar off the chest to use elastic energy — in strength training this masks true maximal pressing ability and increases rib cage injury risk.',
            'Excessive bar path forward (away from the rack) creates a longer moment arm that dramatically increases the load the shoulder must manage.',
          ],
        },
        {
          exerciseKey: 'close-grip-bench-press',
          name: 'Close-Grip Bench Press',
          rationale:
            'Tricep lockout strength is the most common bench press weakness. The close-grip bench press trains the triceps through the same horizontal pressing pattern, making it the most specific accessory for the final 30° of the bench press where the triceps are the primary mover.',
          formCues: [
            'Grip 6–8 inches narrower than your competition grip — do not go so narrow that wrist stress develops.',
            'Perform at 60–70% of your regular bench press weight for 3–4 sets of 5–8 reps.',
            'Keep the same upper-back arch and lat engagement as the main bench — this is a technique-specific accessory.',
            'Touch the same position on the chest as the main bench; do not change bar path dramatically.',
          ],
          commonMistakes: [
            'Using an extremely narrow grip (index fingers touching) puts excessive stress on the wrists and elbows without additional tricep benefit over a moderately close grip.',
            'Arching less than on the main bench press — this changes the mechanics and makes the accessory work less specific.',
          ],
        },
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'The overhead press develops anterior deltoid and tricep strength that directly transfers to bench press performance. It also builds shoulder stability through a different pressing plane, addressing the muscular balance that horizontal pressing alone neglects.',
          formCues: [
            'Use a strict press — no leg drive — to isolate the pressing muscles.',
            'Press from a rack, not from the floor: set the bar at upper chest height and unrack before pressing.',
            'Keep your body rigid: glutes squeezed, abs braced, lats tight against your ribcage.',
            'Press in a straight vertical line; move your head back as the bar passes your face and forward once it clears.',
            'Finish with your biceps next to your ears — do not stop short of full elbow extension.',
          ],
          commonMistakes: [
            'Using excessive lumbar extension (leaning back) to press more weight — this converts the strict press into a push press and reduces shoulder training specificity.',
            'Pressing forward of the scapular plane rather than directly over the center of mass — increases shoulder impingement risk under heavy loads.',
          ],
        },
        {
          exerciseKey: 'dips',
          name: 'Dips',
          rationale:
            'Dips build tricep and lower pec strength through a deep range of motion and full body-weight loading. For strength athletes, weighted dips develop the tricep mass and strength that translates directly to the lockout portion of the bench press.',
          formCues: [
            'Begin with bodyweight dips before adding load; add weight via belt or dumbbell between legs only when bodyweight dips are easy for 15+ reps.',
            'Lean forward 30–45° to include more chest in the movement; more upright targets the triceps predominantly.',
            'Descend until the upper arm is parallel to the floor or until you feel a stretch in the anterior shoulder — do not force range of motion.',
            'Keep elbows slightly tucked — flaring them to 90° increases shoulder impingement risk.',
          ],
          commonMistakes: [
            'Flaring elbows fully out to the sides creates a large horizontal moment arm that places anterior capsule and pec minor under excessive stress.',
            'Cutting depth at 90° elbow flexion: the full range from full extension to the stretch position is where dips produce their greatest strength adaptation.',
          ],
        },
        {
          exerciseKey: 'skull-crusher',
          name: 'Skull Crusher',
          rationale:
            'The skull crusher trains the tricep long head in a loaded stretch position — the range of motion most neglected by pressing movements. For bench press performance, long-head tricep strength supports elbow stability throughout the full press arc.',
          formCues: [
            'Use an EZ-bar to reduce wrist strain; a straight barbell places maximum stress on the wrist joint.',
            'Perform 3–4 sets of 8–10 reps with a 3 s eccentric — this is hypertrophy-style work for the triceps, not strength-style.',
            'Lower the bar toward your forehead; elbows point straight up and remain stationary throughout.',
            'Stop 10° short of full elbow lockout at the top to maintain tension on the tricep.',
          ],
          commonMistakes: [
            'Allowing the elbows to drift back (past the forehead toward the top of your head) reduces the tricep stimulus and increases shoulder stress.',
            'Using too heavy a weight and shortening the range of motion — skull crushers require full range to develop the long-head stretch that makes them valuable.',
          ],
        },
      ],
    },
    {
      label: 'Day 3',
      focus: 'Deadlift — Primary + Accessory',
      exercises: [
        {
          exerciseKey: 'barbell-deadlift',
          name: 'Barbell Deadlift',
          rationale:
            'The deadlift is the highest-force-output movement in powerlifting and the primary test of full posterior chain strength. Training it to near-maximal loads develops the spinal erector, glute, and hamstring strength that no other exercise can replicate at this intensity.',
          formCues: [
            'Set your position before every rep: bar over mid-foot, shins vertical, hips set (not squatted, not hip-hinged to extreme).',
            'Brace maximally before breaking the floor — the deadlift begins with the brace, not the pull.',
            'Initiate by pushing the floor away, not by pulling the bar up — this cue maintains hip height and lat engagement.',
            'Keep the bar in contact with your body from the floor to lockout — any bar drift forward increases the moment arm dramatically.',
            'Lock out by driving the hips through and squeezing the glutes — do not hyperextend the lumbar spine to complete the rep.',
          ],
          commonMistakes: [
            'Losing lumbar extension (lower back rounding) as the bar leaves the floor is the most common and dangerous fault — reduce weight until neutral spine can be maintained through the full pull.',
            'Jerking the bar from the floor using a "slack pull" approach: take the slack out of the bar smoothly before applying maximum force — this protects the lumbar discs.',
          ],
        },
        {
          exerciseKey: 'barbell-good-morning',
          name: 'Barbell Good Morning',
          rationale:
            'Good mornings strengthen the spinal erectors and hamstrings in the exact hip-hinge position that is most vulnerable during a heavy deadlift. They are the primary accessory for developing the lower back strength needed to maintain a neutral spine at maximal deadlift loads.',
          formCues: [
            'Use 30–40% of your back squat weight — this exercise should never be loaded to near-maximal effort.',
            'Keep a fixed arch in your lower back from start to finish; the movement is a controlled hip hinge under bar load.',
            'Stop when your torso is approximately parallel to the floor — do not go deeper than you can control with a neutral spine.',
            'Pause briefly at the bottom and squeeze the glutes and hamstrings to return to standing.',
          ],
          commonMistakes: [
            'Rounding the lower back at the bottom: lumbar rounding under the compressive load of a barbell is a high-injury risk position — reduce load or range of motion immediately.',
            'Loading this movement aggressively: it is a movement quality and muscle development exercise, not a maximal strength test.',
          ],
        },
        {
          exerciseKey: 'barbell-bent-over-row',
          name: 'Barbell Bent-Over Row',
          rationale:
            'Upper back strength is a key deadlift performance factor — the lats and upper back create the rigid torso position that transfers force from the legs to the bar. Heavy rows on deadlift day reinforce the upper back tension patterns directly used in the deadlift.',
          formCues: [
            'Use a pronated grip at 65–70% of your deadlift weight — upper back accessory, not a max-effort movement.',
            'Maintain the same hip-hinge position as the deadlift start: 45° torso lean, neutral spine, shoulders above the hips.',
            'Drive elbows back past the torso; the bar should touch your lower sternum or upper abdomen.',
            'Hold the peak contraction for 1 second on each rep to develop upper back static strength — exactly what the deadlift demands.',
          ],
          commonMistakes: [
            'Using body swing to row more weight: hip drive invalidates the upper back training stimulus that makes rows valuable for deadlift performance.',
            'Using a more upright torso than the deadlift start position — the row should be practiced at a position that mimics the deadlift setup.',
          ],
        },
        {
          exerciseKey: 'pull-up',
          name: 'Pull-Up',
          rationale:
            'The lats are the primary "shelf" that the bar rests against during the deadlift and the primary force-transfer muscle connecting the upper body to the bar path. Weighted or bodyweight pull-ups develop lat thickness and strength that directly supports deadlift performance.',
          formCues: [
            'Perform strict pull-ups — dead hang start, chin over bar finish.',
            'Add weight only when 10+ clean bodyweight reps are achievable — this is hypertrophy-phase work for deadlift accessories.',
            'Perform 3–4 sets to near failure, not absolute failure — CNS fatigue from heavy deadlifts means volume is the priority, not max effort.',
            'Full dead-hang bottom position ensures the lat is trained through its full length — critical for lat strength at the deadlift starting position.',
          ],
          commonMistakes: [
            'Kipping or using momentum after heavy deadlifts: the CNS is already taxed — high-quality reps with full range of motion are more valuable than high-rep momentum-assisted sets.',
            'Shortening the bottom position to avoid dead-hang: the lat stretch at the bottom is the most important position for developing pull-up lat strength.',
          ],
        },
        {
          exerciseKey: 'seated-cable-row',
          name: 'Seated Cable Row',
          rationale:
            'The seated cable row builds rhomboid and mid-trap strength that supports scapular retraction during the deadlift lockout. A strong mid-back holds the thoracic spine in extension under heavy deadlift loads, preventing the thoracic rounding that transfers stress to the lumbar spine.',
          formCues: [
            'Use a close-grip handle or V-bar; pull to the lower sternum with elbows tucked close to the torso.',
            'Keep the torso stationary throughout — the row is an arm movement, not a trunk movement.',
            'At peak contraction, squeeze the shoulder blades together and hold for 2 seconds.',
            'Control the return: allow scapular protraction at the end of the eccentric to stretch the mid-back under load.',
          ],
          commonMistakes: [
            'Leaning back excessively on the pull to generate more range of motion — this is hip-extension-assisted rowing and reduces mid-back isolation.',
            'Rounding the lower back at the end of the eccentric: lower back neutral must be maintained even as the scapulae protract forward.',
          ],
        },
      ],
    },
    {
      label: 'Day 4',
      focus: 'Upper Accessory — Shoulders & Arms',
      exercises: [
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'A dedicated overhead press day builds the shoulder and tricep mass that supports pressing strength. Strength athletes who neglect overhead pressing often develop anterior-posterior deltoid imbalances that limit bench press progress — this session corrects that asymmetry.',
          formCues: [
            'Work up to a 3–5 rep set at 75–80% of 1RM — this is a strength-focused accessory, not a max-effort day.',
            'Same technique as the bench press day: full brace, vertical bar path, biceps next to ears at lockout.',
            'Use back-off sets at 65% for 3 sets of 6–8 to accumulate volume.',
            'Control the descent — the eccentric strength built here transfers to bench press stability.',
          ],
          commonMistakes: [
            'Using a push press (leg drive) on what is intended to be a strict press day — this reduces the pressing specificity that makes it valuable as a bench press accessory.',
            'Not hitting full lockout: strength in the fully extended position is exactly what the bench press lockout demands.',
          ],
        },
        {
          exerciseKey: 'barbell-incline-bench-press',
          name: 'Barbell Incline Bench Press',
          rationale:
            'The incline press builds upper pec and anterior delt strength in a slightly different plane than the competition bench. For powerlifters, a strong upper pec improves the bar path control and helps prevent the "sinking" of the bar to the lower chest that many lifters experience under maximal loads.',
          formCues: [
            'Set the bench at 30° — this is not a shoulder press; the pec must remain the primary mover.',
            'Use 60–70% of your flat bench weight for 4 sets of 5–6 reps.',
            'Maintain the same lat tension and foot-drive technique as the competition bench.',
            'Touch the upper chest — not the neck — with each rep.',
          ],
          commonMistakes: [
            'Setting the incline too high (above 45°) on a strength-focused day: the angle shifts too much load to the anterior delt and reduces specificity to the bench press.',
            'Treating this as a volume hypertrophy set rather than a technical pressing accessory: keep reps moderate and intensity controlled.',
          ],
        },
        {
          exerciseKey: 'dumbbell-lateral-raise',
          name: 'Dumbbell Lateral Raise',
          rationale:
            'Lateral delt development widens the shoulder silhouette and prevents the shoulder imbalances that lead to rotator cuff dysfunction in heavy pressing athletes. Lateral raises are the primary isolation tool for the lateral deltoid head, which bench pressing and overhead pressing both underserve.',
          formCues: [
            'Raise dumbbells to shoulder height with a slight forward lean (15°) to place the lateral head in a mechanically advantageous position.',
            'Lead with the elbows, not the hands — the elbows should reach shoulder height before the wrists.',
            'Use a weight you can control throughout the full range — this is a 15–20 rep isolation exercise, not a strength movement.',
            'Slow eccentric (3 s down) maximizes time under tension for the lateral head.',
          ],
          commonMistakes: [
            'Shrugging the traps at the top to extend the range of motion — this is a trap exercise, not a delt exercise, if the traps are doing the work.',
            'Using too heavy a weight and relying on body swing to get the dumbbells up: the swinging motion removes lateral delt from the movement entirely at the most loaded position.',
          ],
        },
        {
          exerciseKey: 'barbell-curl',
          name: 'Barbell Curl',
          rationale:
            'Bicep strength contributes to bench press stability and is a critical factor in powerlifting row strength. Direct bicep work on the upper accessory day ensures arms are not a limiting factor in the bench and deadlift accessories.',
          formCues: [
            'Use 3–4 sets of 8–10 reps at a moderate weight — this is hypertrophy-style work, not strength-style.',
            'Strict form: elbows pinned at the sides, full range of motion from locked-out to fully contracted.',
            'Do not use the same weight as you would on a dedicated bicep day — compound work earlier in the session has pre-fatigued the elbow flexors.',
            'Supinate the wrist maximally at the top of each rep to achieve full bicep contraction.',
          ],
          commonMistakes: [
            'Performing curls with full fatigue after heavy pressing will produce poor form and little stimulus — if quality degrades, end the set.',
            'Using momentum (hip swing) on a day that is already demanding on the CNS — strict, controlled reps are the only effective approach here.',
          ],
        },
        {
          exerciseKey: 'cable-face-pull',
          name: 'Cable Face Pull',
          rationale:
            'Face pulls are the primary shoulder health insurance for powerlifters. They develop the external rotators and posterior capsule that heavy internal-rotation-dominant pressing (bench, overhead press, dips) overloads. This is a mandatory maintenance movement for long-term shoulder health in any strength program.',
          formCues: [
            'Perform 4 sets of 20–25 reps at a light weight — this is a high-rep restorative exercise, not a strength movement.',
            'Pull to face level with elbows at shoulder height; fully externally rotate at the end of each rep.',
            'Hold the contracted position for 2 seconds per rep to develop end-range rotator cuff strength.',
            'Never load this exercise heavily — the value is in quality of movement and external rotation range of motion.',
          ],
          commonMistakes: [
            'Loading face pulls too heavily forces the use of momentum and shoulder shrug to complete reps — the exercise then trains trap elevation, not external rotation.',
            'Dropping the elbows below shoulder height: face pulls performed with low elbows become rear-delt exercises and lose their rotator cuff specificity.',
          ],
        },
      ],
    },
    {
      label: 'Day 5',
      focus: 'Lower Accessory — Posterior Chain',
      exercises: [
        {
          exerciseKey: 'goblet-squat',
          name: 'Goblet Squat',
          rationale:
            'The goblet squat is used on the accessory lower day to reinforce squat mechanics at sub-maximal loads and to train the quads without axial loading. For powerlifters, it serves as an active recovery and technique-reinforcement session that accumulates quad volume without stressing the nervous system.',
          formCues: [
            'Hold a single dumbbell at your chest; this automatically reinforces an upright torso.',
            'Use this as a technique-building session: pause for 3 seconds at the bottom of each rep in a full squat position.',
            'Feet at shoulder width or slightly wider; toes turned out 30–45° to allow maximum depth.',
            'Focus on keeping weight on the full foot and knees tracking out over the toes — reinforcing the motor patterns needed for the main squat.',
          ],
          commonMistakes: [
            'Going too heavy: the goblet squat is a movement quality tool, not a strength movement — keep it light enough to maintain a 3-second pause.',
            'Using a partial range of motion: the entire value of goblet squats for powerlifters is in the deep position mobility and motor learning.',
          ],
        },
        {
          exerciseKey: 'barbell-glute-bridge',
          name: 'Barbell Glute Bridge',
          rationale:
            'The glute bridge develops glute strength in the hip-extended position — the position powerlifters need for squat lockout and deadlift lockout. Strong glutes at the top of both movements are the difference between a complete and incomplete rep under maximal loads.',
          formCues: [
            'Use moderate load: 50–60% of your conventional deadlift weight for 3–4 sets of 10–12 reps.',
            'Drive the hips to full extension on every rep; do not stop short of the lockout position.',
            'Posterior pelvic tilt at the top to engage the glutes maximally — do not hyperextend the lumbar spine.',
            'Hold the peak contraction for 2 seconds per rep to develop glute strength at the top of the range.',
          ],
          commonMistakes: [
            'Using too much weight after a deadlift session: the glute bridge is an accessory here, not a maximal effort — the glutes are already partially fatigued.',
            'Not achieving full hip extension: stopping at parallel hips misses the most critical position for squat and deadlift lockout strength.',
          ],
        },
        {
          exerciseKey: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          rationale:
            'A second RDL session in the week — on the accessory day at lower intensity — builds the hamstring volume and length-tension strength that transfers directly to deadlift off-the-floor strength. Hamstring weakness is one of the most common causes of the "stiff-leg" deadlift pattern where the bar drifts forward as it leaves the ground.',
          formCues: [
            'Use lighter weight than the primary RDL on deadlift day — this is a hypertrophy-focused set, not a heavy strength set.',
            'Perform 3 sets of 12–15 reps with a 3-second eccentric — the slow descent maximizes hamstring time under tension.',
            'Full hip hinge mechanics: maintain shoulder external rotation, neutral spine, and bar contact with the legs throughout.',
            'Pause 1 second at the bottom of each rep in the maximum hamstring stretch position.',
          ],
          commonMistakes: [
            'Treating this as a recovery day and going too light to achieve a training effect — even on accessory days, the hamstring stimulus must be sufficient to drive adaptation.',
            'Rushing through reps after the session feels tiring: the slow eccentric is the primary training stimulus here — do not cut it short.',
          ],
        },
        {
          exerciseKey: 'lying-leg-curl',
          name: 'Leg Curl (Machine)',
          rationale:
            'The second leg curl session of the week accumulates hamstring knee-flexion volume with minimal spinal loading. This is the highest-volume leg curl session of the week — performed when the lower back is fresh relative to deadlift day.',
          formCues: [
            'Perform 4 sets of 12–15 reps with a 2-second pause at peak contraction on each rep.',
            'Use the prone (lying) leg curl if available — it achieves greater hamstring length at the start position than seated variants.',
            'Full range: complete knee extension at the start, maximum knee flexion at the end.',
            'Slow return (3 s) — the hamstring eccentric on leg curls is an effective driver of muscle hypertrophy and tendon adaptation.',
          ],
          commonMistakes: [
            'Performing leg curls with hips rising off the pad — fix the hips before increasing load or reducing the range of motion.',
            'Going too heavy and shortening the range: full range of motion is more important than load for leg curls in this accessory context.',
          ],
        },
        {
          exerciseKey: 'standing-calf-raise',
          name: 'Standing Calf Raise',
          rationale:
            'Calf strength and Achilles tendon stiffness contribute to squat depth control and the "spring" out of the bottom of the squat. Regular calf training maintains the ankle mobility and plantar flexion strength that keep the squat mechanics intact under heavy barbell loading.',
          formCues: [
            'Perform on an elevated surface for full dorsiflexion range at the bottom.',
            'Rise all the way to tiptoe at the top — do not stop at a partial range.',
            'Slow down the eccentric to 3 seconds and pause 1 second in the fully stretched position.',
            'Perform 4 sets of 20–25 reps — calves respond to high volume and high frequency.',
          ],
          commonMistakes: [
            'Bouncing at the bottom transfers load to the Achilles tendon and reduces the calf muscle stimulus — pause in the stretched position instead.',
            'Performing too few sets and reps: calves are a high-endurance muscle and require significantly higher volume than most other muscle groups to adapt.',
          ],
        },
      ],
    },
  ],
};
