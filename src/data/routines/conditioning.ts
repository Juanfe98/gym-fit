import type { Routine } from '../../types';

export const conditioningRoutine: Routine = {
  goal: 'conditioning',
  displayName: 'Conditioning',
  rationale:
    'Athletic conditioning requires simultaneous development of strength, power, and work capacity. This 5-day program pairs a dedicated power day with two strength-focused days (upper and lower) and two conditioning-specific sessions that develop energy system capacity. The structure ensures that explosive power work is never performed on fatigued legs — a critical periodization principle for developing true athletic performance rather than general fitness.',
  days: [
    {
      label: 'Day 1',
      focus: 'Power — Explosive Lower Body',
      exercises: [
        {
          exerciseKey: 'box-jump',
          name: 'Box Jump',
          rationale:
            'Box jumps are the foundational lower-body power development exercise. Performed first in the session when the nervous system is fully fresh, they train the stretch-shortening cycle and fast-twitch fiber recruitment that translates to sprinting speed, jumping ability, and first-step quickness in any athletic context.',
          formCues: [
            'Perform 5 sets of 5 explosive jumps with full recovery (2–3 minutes between sets) — power training demands full nervous system recovery between sets.',
            'Load the jump with a deep counter-movement: swing the arms back, dip into a quarter squat, then explode.',
            'The goal is maximum height and explosiveness on every jump — if a rep is not fully explosive, end the set and rest.',
            'Land softly with hips and knees bent, absorbing the landing over 2–3 seconds.',
            'Step down from the box — never jump down after a power jump.',
          ],
          commonMistakes: [
            'Using insufficient rest between sets and accumulating fatigue: power training performed in a fatigued state trains endurance, not power — the adaptation profile is entirely different.',
            'Landing with locked-out knees or landing without a squat absorption: poor landing mechanics cause patellofemoral stress that accumulates into chronic knee pain.',
          ],
        },
        {
          exerciseKey: 'kettlebell-swing',
          name: 'Kettlebell Swing',
          rationale:
            'The kettlebell swing develops hip-extension power — the foundational athletic movement underpinning running, jumping, and change of direction. Unlike the box jump, swings train the ballistic hip hinge under resistance, building the explosive posterior chain strength that the barbell deadlift builds slowly.',
          formCues: [
            'Perform 4 sets of 10 explosive swings with 90 seconds rest.',
            'Every rep must be maximally explosive — the bell should float to shoulder height from pure hip power.',
            'At the top of each swing: glutes maximally contracted, core braced, body in a standing plank position.',
            'The down phase is a controlled hip hinge — let the bell travel between the legs and load the hamstrings before the next explosive drive.',
            'Do not squat the swing: the movement is almost entirely in the hips, with minimal knee bend.',
          ],
          commonMistakes: [
            'Using a kettlebell that is too light for explosive intent: a weight that swings easily encourages arm swinging instead of hip driving — use a weight that challenges hip power.',
            'Squatting the swing: if your knees bend deeply on every swing, the movement has drifted into a goblet squat pattern — reset and focus on the hip hinge.',
          ],
        },
        {
          exerciseKey: 'barbell-back-squat',
          name: 'Barbell Back Squat',
          rationale:
            'Strength development is the long-term foundation of power — you cannot express force explosively if you cannot produce the force at all. After the power work, heavy squat sets build the maximal strength base that makes power training sustainable and progressive over months of athletic development.',
          formCues: [
            'Use 80–85% of 1RM for 4 sets of 4–5 reps — heavy but below a true maximal effort.',
            'Explosive concentric intent on every rep: lower with control (2 s), then drive up with maximum intent.',
            'Full depth is required: power athletes who squat partial ranges develop strength that does not transfer to full athletic movement patterns.',
            '3 minutes rest between sets — power and strength require complete recovery.',
          ],
          commonMistakes: [
            'Performing strength squats at a slow concentric tempo: the central adaptation for power athletes is fast force production. Even heavy squats should be performed with explosive intent.',
            'Reducing squatting frequency in conditioning programs because running and jumping "trains the legs": those activities do not develop maximal strength — only loaded squatting does.',
          ],
        },
        {
          exerciseKey: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          rationale:
            'Posterior chain strength — particularly hamstring eccentric strength — is the primary injury prevention factor for athletic lower body development. RDLs on power day build the hamstring eccentric capacity that absorbs landing forces from jumping and decelerates hip extension in sprinting, preventing hamstring strains.',
          formCues: [
            'Use 3 sets of 6–8 reps at 70% of working weight after the squats.',
            'Slow, deliberate eccentric (3–4 s) — eccentric hamstring strength is the specific quality being trained here.',
            'Full hip-hinge mechanics: bar dragging down the legs, neutral spine, knees slightly bent and fixed.',
            'Pause 2 seconds at the bottom of the stretch position to develop strength at the most vulnerable hamstring length.',
          ],
          commonMistakes: [
            'Skipping RDLs because the session already feels complete after squats: hamstring eccentric strength cannot be developed by any other movement in this program — the RDL is irreplaceable.',
            'Treating the RDL as an accessory and reducing range of motion under fatigue: the loaded stretch position is the entire point of the exercise.',
          ],
        },
        {
          exerciseKey: 'leg-extension',
          name: 'Leg Extension',
          rationale:
            'Knee extension strength — particularly of the rectus femoris — is a key factor in jumping performance and deceleration mechanics. Leg extensions on power day build the quad end-range strength that supports landing mechanics and quad dominance in the jump.',
          formCues: [
            'Use 3 sets of 12–15 reps with a 2-second hold at peak contraction.',
            'This is accessory work after the main strength sets — use a weight that allows full range and full extension.',
            'Full lock-out on every rep: the contracted position of the rectus femoris is critical for knee stability in athletic movements.',
            'Slow return (2 s) — quad eccentric strength supports deceleration during landing.',
          ],
          commonMistakes: [
            'Using leg extensions as a warm-up before heavy squats in an athletic context: the fatigue and patellar stress from pre-exhausting the quads compromises squat performance and safety.',
            'Partial extension: full range of motion through lock-out is what builds the end-range quad strength that translates to jump and landing mechanics.',
          ],
        },
      ],
    },
    {
      label: 'Day 2',
      focus: 'Upper Strength — Pressing & Pulling',
      exercises: [
        {
          exerciseKey: 'barbell-bench-press',
          name: 'Barbell Bench Press',
          rationale:
            'Upper body pressing strength is the foundation of throwing, pushing, and contact performance in athletic contexts. Heavy bench pressing builds the pec, tricep, and anterior delt strength that directly transfers to overhead throwing velocity, contact sports pushing mechanics, and general upper body structural resilience.',
          formCues: [
            'Use 4 sets of 4–6 reps at 80–85% of 1RM — strength-focused, not hypertrophy.',
            'Full bracing protocol: arch, lat engagement, leg drive on every rep.',
            'Explosive concentric intent: even though the bar may not move fast, the neural intention to press explosively recruits maximum motor units.',
            '3 minutes rest between sets.',
          ],
          commonMistakes: [
            'Using the bench press at bodybuilding rep ranges (8–12) in an athletic conditioning program: the neural adaptation that transfers to athletic performance comes from heavier, lower-rep pressing.',
            'Neglecting leg drive on the bench press for athletes: leg drive trains the full-body tension and force transfer that is the foundation of athletic pressing mechanics.',
          ],
        },
        {
          exerciseKey: 'barbell-bent-over-row',
          name: 'Barbell Bent-Over Row',
          rationale:
            'Horizontal pulling strength balances the pressing development and builds the rear-delt, rhomboid, and lat thickness that supports shoulder joint integrity under athletic loads. For throwing athletes, back pulling strength is directly correlated with shoulder health and throwing velocity.',
          formCues: [
            'Use 4 sets of 5–6 reps at 75–80% working weight.',
            'Maintain the forward lean throughout — the back muscles work hardest when the torso is consistently angled.',
            'Explosive pull: initiate the row forcefully and drive the elbows past the torso.',
            'Hold the peak contraction for 1 second to develop the end-range pulling strength that translates to athletic pulling movements.',
          ],
          commonMistakes: [
            'Reducing row intensity relative to bench press: for athletes, pulling strength should approximately equal pressing strength — a pressing-dominant imbalance is a shoulder injury waiting to happen.',
            'Using body English to complete heavy reps: strict rows develop the specific back strength needed for athletic performance; momentum-assisted rows do not.',
          ],
        },
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'The overhead press trains the shoulder and tricep in the exact pressing plane of throwing, overhead reaching, and block-and-tackle mechanics. For athletes, overhead pressing strength directly correlates with overhead sport performance and is an underserved movement in most athletic programs.',
          formCues: [
            'Strict press, 4 sets of 5–6 reps at 75% of 1RM.',
            'Full range of motion: bar from upper chest to biceps-beside-ears.',
            'Maintain full body rigidity: glutes, abs, and lats engaged throughout.',
            'Control the descent — overhead pressing has a significant eccentric component that develops shoulder stability.',
          ],
          commonMistakes: [
            'Using a push press for all overhead pressing work: the leg drive in a push press shifts load away from the shoulder at the most demanding portion of the lift — reserve push pressing for power-focused sessions.',
            'Going too narrow a grip, which places excessive tricep demand on what is intended to be a shoulder-dominant movement.',
          ],
        },
        {
          exerciseKey: 'pull-up',
          name: 'Pull-Up',
          rationale:
            'Pull-ups develop the lat and scapular strength that underpins overhead stability in throwing, swimming, climbing, and grappling sports. Weighted pull-ups are one of the few upper body exercises that have high transfer to nearly all athletic disciplines.',
          formCues: [
            'Add weight when 8+ clean bodyweight reps are achievable. Use 4 sets of 5–6 weighted reps.',
            'Dead-hang start, chin-over-bar finish — full range on every rep.',
            'Initiate with scapular depression before any elbow flexion occurs.',
            'Lower with control over 2 s — the eccentric lat strength developed here directly transfers to throwing deceleration.',
          ],
          commonMistakes: [
            'Kipping in an athletic strength context: kipping pull-ups train hip flexor and shoulder drive but do not develop the lat strength that is the goal of pull-ups in this program.',
            'Truncating the bottom position: the full dead-hang bottom range trains the lats in the lengthened position — critical for overhead athletes where the shoulder operates at full elevation.',
          ],
        },
        {
          exerciseKey: 'cable-face-pull',
          name: 'Cable Face Pull',
          rationale:
            'Rotator cuff and external rotator strength is the primary limiting factor for long-term overhead athlete shoulder health. Face pulls directly target the external rotators and posterior capsule — muscles that no primary pressing or pulling movement adequately trains. For any athlete using overhead mechanics, this is a non-negotiable injury prevention movement.',
          formCues: [
            'Perform 4 sets of 20 reps at a light, controlled weight — this is a therapeutic and preventive exercise.',
            'Full external rotation at the end of each rep: the elbows at shoulder height, forearms vertical, shoulders externally rotated.',
            '60 seconds rest between sets.',
            'This should never feel like a maximum effort — the purpose is full-range rotator cuff training, not strength.',
          ],
          commonMistakes: [
            'Performing face pulls with elbows below shoulder height: the external rotation component (and its rotator cuff benefit) only occurs with elbows at shoulder level.',
            'Loading face pulls progressively like a strength exercise: the value is in quality of movement and range of motion, not in the amount of weight pulled.',
          ],
        },
      ],
    },
    {
      label: 'Day 3',
      focus: 'Lower Strength — Glutes & Posterior Chain',
      exercises: [
        {
          exerciseKey: 'barbell-deadlift',
          name: 'Barbell Deadlift',
          rationale:
            'The deadlift builds full posterior chain strength that transfers to sprinting (hip extension power), jumping (glute strength), and contact sports (full-body force production). For conditioning athletes, deadlift strength correlates more strongly with sprint times and jump performance than almost any other gym exercise.',
          formCues: [
            'Use 4 sets of 4–5 reps at 82–87% of 1RM — heavy strength work with full technique.',
            'Full reset between reps: this is not a touch-and-go session. Every rep is a maximum-quality pull.',
            'Bar stays over the mid-foot throughout — any forward drift lengthens the moment arm and increases lower back load.',
            'Explosive lockout: drive the hips through forcefully and stand tall.',
          ],
          commonMistakes: [
            'Using touch-and-go reps on a strength-focused deadlift day: the reset allows maximum-quality technique on every rep and trains starting strength from a static position — a more valuable athletic quality than elastic touch-and-go.',
            'Treating the deadlift as a conditioning exercise and performing high reps: heavy deadlift strength development requires low reps with full recovery.',
          ],
        },
        {
          exerciseKey: 'barbell-glute-bridge',
          name: 'Barbell Glute Bridge',
          rationale:
            'Glute strength is the single most predictive factor in sprint speed. The glute bridge directly loads the glutes in hip extension — the movement pattern of sprinting — with a level of specificity that squats and deadlifts cannot match. For conditioning athletes, strong glutes from glute bridges translate directly to faster sprint acceleration.',
          formCues: [
            'Use 4 sets of 8 reps at moderate load — this is not a max-effort exercise but should be challenging within the rep range.',
            'Drive from the full foot and achieve complete hip extension on every rep.',
            'Hold the top position for 2 seconds with maximal glute contraction.',
            'Keep the chin tucked throughout — athletes often hyperextend the neck, which leads to lumbar hyperextension.',
          ],
          commonMistakes: [
            'Allowing the lower back to arch at the top instead of the glutes contracting: posterior pelvic tilt at the top position is the athletic position — not lumbar extension.',
            'Driving through the heels: heel-centric glute bridges reduce glute activation and increase hamstring compensation, which is not the training stimulus needed for sprinting.',
          ],
        },
        {
          exerciseKey: 'bulgarian-split-squat',
          name: 'Bulgarian Split Squat',
          rationale:
            'Single-leg strength is a primary predictor of sprint performance and injury prevention. The Bulgarian split squat loads each leg independently at heavy loads, identifying and correcting bilateral strength deficits that translate to asymmetrical running mechanics. For athletes, achieving single-leg strength parity is more important than maximum bilateral squat strength.',
          formCues: [
            'Use 3 sets of 6–8 reps per leg with dumbbells or a barbell — build single-leg strength progressively before loading heavily.',
            'The working shin should be approximately vertical at the bottom — step the front foot far enough forward.',
            'Keep the torso upright to maximize quad stimulus; lean forward to shift load to the glute.',
            'Drive through the full front foot on every rep — no push-off from the rear foot.',
          ],
          commonMistakes: [
            'Using too much weight before the movement pattern is mastered: the Bulgarian split squat requires significant balance and hip stability — add load only when the movement is grooved.',
            'Asymmetric loading between legs: if one side is significantly weaker, start that side first and match the volume, not the load.',
          ],
        },
        {
          exerciseKey: 'barbell-good-morning',
          name: 'Barbell Good Morning',
          rationale:
            'Spinal erector and hamstring strength in the hip-hinge position is the primary limiter for athletes who develop lower back pain during sprint training. Good mornings reinforce the posterior chain strength and mechanics needed to maintain neutral spine under the high hip-flexion loads of sprinting and change of direction.',
          formCues: [
            'Use 3 sets of 8–10 reps at light-to-moderate load.',
            'Keep the arch consistent from start to bottom position — this is a movement quality exercise, not a strength expression.',
            'Stop at approximately parallel — going below parallel requires mobility and technique that must be developed progressively.',
            'Pause 1 second at the bottom to develop strength in the lengthened hip-hinge position.',
          ],
          commonMistakes: [
            'Loading good mornings too aggressively: this exercise is unforgiving when technique degrades under fatigue — the compressive and shear forces on the lumbar spine under a barbell at a forward lean are significant.',
            'Using good mornings as a squat accessory rather than a hinge accessory: it reinforces hip-hinge mechanics, not squat mechanics, and should follow deadlift-pattern work in the session.',
          ],
        },
        {
          exerciseKey: 'standing-calf-raise',
          name: 'Standing Calf Raise',
          rationale:
            'Achilles tendon stiffness and calf strength are primary determinants of sprint speed and jumping economy. Athletes who neglect direct calf training develop reactive ground contact inefficiencies that reduce sprint acceleration. Loaded calf raises build the plantar flexion strength that generates the "spring" in athletic locomotion.',
          formCues: [
            'Perform on an elevated surface for full range of motion.',
            'Use 3 sets of 20–25 reps — calves require high volume; low-rep strength training does not produce meaningful adaptation.',
            'Pause 2 seconds at the fully stretched bottom position on every rep.',
            'Rise fully onto the toes at the top — partial-range calf raises do not develop the full gastrocnemius.',
          ],
          commonMistakes: [
            'Bouncing at the bottom: the Achilles tendon will absorb the stretch reflex, reducing calf muscle stimulus — pause deliberately in the stretched position instead.',
            'Neglecting calf training because "you run and jump regularly" — sport-specific loading does not fully develop maximal calf strength; direct loaded calf work is necessary.',
          ],
        },
      ],
    },
    {
      label: 'Day 4',
      focus: 'Conditioning — Metabolic & Energy Systems',
      exercises: [
        {
          exerciseKey: 'burpee',
          name: 'Burpee',
          rationale:
            'Burpees on the dedicated conditioning day train the aerobic and anaerobic energy systems simultaneously through a full-body movement that requires no equipment. For athletes, the burpee develops the ability to produce force under fatigue — the defining requirement of team sport performance.',
          formCues: [
            'Perform 5 sets of 10 burpees with 60 seconds rest — this is intensity-focused work, not just volume.',
            'Full push-up and full jump on every rep — never half-rep.',
            'Maintain a consistent pace across all sets: the 5th set should look like the 1st.',
            'If quality degrades significantly, rest longer rather than reducing the range of motion.',
          ],
          commonMistakes: [
            'Treating burpees as a pure cardio exercise and reducing range of motion to maintain pace: the push-up and jump are the force-production components — eliminating them removes the athletic value.',
            'Maximal sprint effort on the first set and then collapsing: pacing across multiple sets is an athletic skill that should be deliberately trained.',
          ],
        },
        {
          exerciseKey: 'kettlebell-swing',
          name: 'Kettlebell Swing',
          rationale:
            'Kettlebell swings in the conditioning session are performed at higher volume than the power day, shifting the adaptation from explosive power to power endurance — the ability to maintain explosive hip extension output over extended periods. This is critical for sports where repeated accelerations occur over a full match duration.',
          formCues: [
            'Perform 5 sets of 20 swings with 60 seconds rest.',
            'Every swing must still be explosive — do not allow the pace to degrade into a slow controlled swing.',
            'Maintain the hip-hinge mechanics even when fatigued: back flat, knees soft, all power from the hips.',
            'Focus on breathing: exhale sharply at the top of each swing — this supports intra-abdominal pressure and prevents breath-holding fatigue.',
          ],
          commonMistakes: [
            'Reducing hip drive to maintain volume when fatigued: a slow hip-hinge swing is a significantly different exercise from an explosive one — reduce the volume before reducing the intensity.',
            'Neglecting the rest periods and pushing through with insufficient recovery: power endurance training requires brief but complete recovery periods to maintain the training quality.',
          ],
        },
        {
          exerciseKey: 'box-jump',
          name: 'Box Jump',
          rationale:
            'Box jumps in the conditioning session are performed for volume (reactive jump endurance) rather than maximal power as on Day 1. The goal is to maintain jumping mechanics under accumulated fatigue — training the nervous system to preserve explosive output as the session progresses, which directly transfers to late-game athletic performance.',
          formCues: [
            'Perform 4 sets of 8–10 jumps with 90 seconds rest — slightly shorter rest than on Day 1 to increase the conditioning demand.',
            'Maintain full explosive effort on every jump — the quality standard is non-negotiable.',
            'Step down between every jump and fully reset before the next — no bouncing from a landing into the next jump.',
            'Monitor jump height: if height drops more than 20% from the first rep, rest longer or end the set.',
          ],
          commonMistakes: [
            'Jumping from the box (bounce jumping) in a conditioning context: reactive jumps accumulate significant knee and ankle impact — always step down to protect the joints.',
            'Using a box height that is too high for conditioning volume: reduce box height from the power day to prioritize mechanics over maximum height.',
          ],
        },
        {
          exerciseKey: 'push-up',
          name: 'Push-Up',
          rationale:
            'High-volume push-ups in the conditioning session develop upper body muscular endurance — the capacity to repeatedly produce horizontal pushing force over time. For athletes in contact sports, throwing sports, or any activity requiring sustained upper body output, push-up endurance correlates with in-game pushing performance.',
          formCues: [
            'Perform 3 sets to technical failure with 60 seconds rest — stop when form breaks, not when it burns.',
            'Perfect plank position maintained for every rep: no hip sagging, no butt piking.',
            'Full chest-to-floor range of motion — never reduce depth to achieve more reps.',
            'Track your rep count across sessions: improving push-up endurance is a direct measure of upper body conditioning progress.',
          ],
          commonMistakes: [
            'Continuing reps with degraded form to hit a rep target: partial reps and broken form do not train the same muscles or movement mechanics as full-range strict push-ups.',
            'Treating push-up failure as weakness rather than capacity: to-failure sets are a legitimate training method — the last rep of a set to technical failure is the most valuable.',
          ],
        },
        {
          exerciseKey: 'mountain-climbers',
          name: 'Mountain Climbers',
          rationale:
            'Mountain climbers are used as the conditioning session finisher to train the core stability and hip flexor speed that directly transfers to sprinting mechanics. Athletes with poor hip flexor endurance develop stride length reduction in the second half of sprint efforts — mountain climbers address this directly.',
          formCues: [
            'Perform 4 rounds of 30 seconds on, 15 seconds off.',
            'Rigid plank position throughout: hips level, not raised or sagging.',
            'Drive each knee toward the chest as fast as possible — speed is the training variable here.',
            'Breathe continuously: do not hold your breath; establish an in-through-the-nose, out-through-the-mouth rhythm.',
          ],
          commonMistakes: [
            'Allowing the hips to rise progressively as fatigue accumulates: this is the cardinal fault of mountain climbers and eliminates both the core stability and hip flexor training demands.',
            'Moving too slowly: mountain climbers as a conditioning tool require sustained high tempo — slow climbers are a stretching exercise, not a conditioning movement.',
          ],
        },
      ],
    },
    {
      label: 'Day 5',
      focus: 'Full Body Athletic — Integration',
      exercises: [
        {
          exerciseKey: 'barbell-deadlift',
          name: 'Barbell Deadlift',
          rationale:
            'A lighter full-body integration deadlift session on Day 5 trains the neuromuscular patterns of the deadlift with reduced fatigue load. For athletes, practicing the movement pattern at moderate intensity more frequently than once per week accelerates the technical development needed to make deadlift strength transfer to athletic performance.',
          formCues: [
            'Use 65–70% of 1RM for 4 sets of 5 reps with a focus on bar speed and technical quality.',
            'Every rep should feel explosive — the sub-maximal load allows you to move the bar faster, training the rate of force development.',
            'Reset fully between reps: full position and brace re-establishment.',
            'The goal today is quality, not intensity — if any rep does not look identical to the first, end the set.',
          ],
          commonMistakes: [
            'Using the "easy" feeling of the lighter load as permission to reduce technical focus: technique work at light-to-moderate loads is how motor patterns are ingrained.',
            'Increasing the load to turn this into a heavy session: Day 5 is designed as moderate intensity for a reason — athletes need a complete heavy-intensity session at least 48 hours before the next power day.',
          ],
        },
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'A second overhead press session at lower intensity reinforces the pressing mechanics and builds the shoulder endurance needed for repeated overhead athletic actions. Technique at moderate loads is where lasting motor pattern improvements occur — Day 5 is that session.',
          formCues: [
            'Use 65% of 1RM for 4 sets of 6–8 reps.',
            'Strict press with maximal technical focus: every cue from the Day 2 heavy session applies.',
            'Focus specifically on the bar path — overhead press technique often drifts when fatigue is low and loads feel easy.',
            'Control the descent: 2 s eccentric to develop shoulder eccentric stability.',
          ],
          commonMistakes: [
            'Treating this as a warmup-level session and not applying genuine technique focus: moderate loads are when technical habits are built, not just expressed.',
            'Going heavier than prescribed because 65% "feels easy": the value of Day 5 is in movement quality practice, not intensity accumulation.',
          ],
        },
        {
          exerciseKey: 'lat-pulldown',
          name: 'Lat Pulldown',
          rationale:
            'Lat pulldowns on the integration day serve as a moderate-load vertical pulling session that develops the scapular control and lat activation that heavy pull-ups cannot address with the same precision. The ability to control load and range of motion makes this an ideal technique-refinement tool for athletic pulling mechanics.',
          formCues: [
            'Use 4 sets of 10–12 reps at a weight that allows perfect technique on every rep.',
            'Focus on scapular depression before elbow flexion — this is the key technique cue that transfers to all overhead pulling movements.',
            'Pull to the upper chest; do not pull behind the neck.',
            'Full range: complete arm extension at the top for maximum lat stretch.',
          ],
          commonMistakes: [
            'Using a weight that compromises range of motion: Day 5 technique focus means reducing load before reducing range.',
            'Allowing the torso to rock to extend range: stable torso mechanics on the lat pulldown are what makes it a vertical pulling skill developer rather than a back swing exercise.',
          ],
        },
        {
          exerciseKey: 'goblet-squat',
          name: 'Goblet Squat',
          rationale:
            'The goblet squat on integration day reinforces squat mechanics and hip mobility at a load and position that supports high-quality movement without compressive stress. For athletes, lower-body mobility and movement quality maintenance is as important as strength development.',
          formCues: [
            'Hold a moderate dumbbell at the chest; perform 3 sets of 10 reps with a 3-second pause at the bottom.',
            'Use the bottom pause to actively open the hips: gently push the knees out with your elbows while maintaining a flat lower back.',
            'Keep the chest up throughout — the goblet squat is an upright-torso squat; any forward lean indicates hip mobility limitation.',
            'Full foot contact with the floor: no heel rise, no forward weight shift.',
          ],
          commonMistakes: [
            'Going heavy with goblet squats: the value here is movement quality, not strength — keep the load at a level that allows a perfect 3-second pause without form compromise.',
            'Omitting the bottom pause: the pause is the whole point of this session — without it, the goblet squat becomes just another squat repetition.',
          ],
        },
        {
          exerciseKey: 'cable-face-pull',
          name: 'Cable Face Pull',
          rationale:
            'Ending every training week with face pulls maintains the external rotation health of the shoulder complex after five days of heavy pressing, pulling, and overhead work. For athletes training at this frequency, consistent external rotation maintenance prevents the cumulative anterior capsule tightness that leads to impingement and rotator cuff tears.',
          formCues: [
            'Perform 3 sets of 25 reps at a light weight — this is the final movement of the week and should feel therapeutic.',
            'Full external rotation at the end of each rep: the "double bicep" position with elbows at shoulder height.',
            'Take 90 seconds between sets and use them as active recovery.',
            'Focus on the range of motion quality: this is the most important set of face pulls of the week because the shoulders are at their most fatigued.',
          ],
          commonMistakes: [
            'Skipping face pulls at the end of Day 5 because you are tired: fatigue is exactly when the shoulder is most in need of this movement — it is performing the active recovery function that prevents the shoulder from "locking up" over the rest days.',
            'Loading face pulls more heavily as a session finisher: the face pull is not a finisher for strength — it is a finisher for shoulder health.',
          ],
        },
      ],
    },
  ],
};
