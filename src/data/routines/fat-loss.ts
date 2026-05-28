import type { Routine } from '../../types';

export const fatLossRoutine: Routine = {
  goal: 'fat-loss',
  displayName: 'Fat Loss',
  rationale:
    'Full-body resistance training 4× per week maximizes weekly muscle-group frequency and total energy expenditure from training. Each session combines a lower-body compound movement, an upper-body compound push, an upper-body compound pull, and an accessory or finisher. This structure preserves muscle mass during a caloric deficit — the critical factor that separates fat loss from weight loss — while keeping each session under 60 minutes. Rest days are interspersed to allow recovery and support caloric expenditure from non-exercise activity.',
  days: [
    {
      label: 'Day 1',
      focus: 'Full Body A — Squat Pattern',
      exercises: [
        {
          exerciseKey: 'barbell-back-squat',
          name: 'Barbell Back Squat',
          rationale:
            'Heavy compound lower body work at the start of a fat-loss session ensures muscle is trained before energy systems are depleted. Squats at moderate-to-heavy loads (75–80% of 1RM) maintain muscle mass and strength during a caloric deficit, which prevents the metabolic slowdown that causes fat-loss plateaus.',
          formCues: [
            'Use 75–80% of your working weight — this is heavier than typical fat-loss training. Muscle preservation requires challenging loads.',
            'Perform 4 sets of 6–8 reps with 90 seconds rest — shorter rest than pure strength training maintains training density and elevates metabolic response.',
            'Full depth on every rep: hip crease below the knee, heels flat, neutral spine.',
            'Do not sacrifice form for speed — controlled descent (2 s down) and powerful ascent.',
          ],
          commonMistakes: [
            'Reducing squat load too aggressively in a fat-loss phase: metabolic stress alone does not preserve muscle — the load must be sufficient to maintain strength.',
            'Using very high reps (20+) instead of moderate heavy reps: research shows moderate load (6–15 reps) with adequate protein preserves more muscle than high-rep metabolic sets.',
          ],
        },
        {
          exerciseKey: 'barbell-bench-press',
          name: 'Barbell Bench Press',
          rationale:
            'Maintaining chest and tricep strength during fat loss requires continued heavy horizontal pressing. Keeping the bench press in a fat-loss program prevents the disproportionate upper-body muscle loss that lighter, circuit-style training produces when paired with a caloric deficit.',
          formCues: [
            'Use 75% of your working weight for 4 sets of 6–8 reps — same load management philosophy as the squat.',
            'Maintain full technique: scapular retraction, arch, leg drive.',
            'Rest 90 seconds between sets — shorter than a strength session, longer than a circuit.',
            'Do not reduce intensity: the bench press at 50% of your 1RM does not stimulate muscle maintenance the way 75–80% does.',
          ],
          commonMistakes: [
            'Switching to machine pressing because it feels safer in a fatigued state — free-weight pressing recruits more stabilizer muscle mass, which matters for both muscle preservation and metabolic effect.',
            'Cutting range of motion to manage fatigue: full-range pressing maintains the joint mobility and muscle length needed for training longevity.',
          ],
        },
        {
          exerciseKey: 'lat-pulldown',
          name: 'Lat Pulldown',
          rationale:
            'Back width and lat strength are maintained through continued vertical pulling. The lat pulldown pairs with the bench press to ensure the antagonist muscle groups receive equal training stimulus — a factor in both physique symmetry and shoulder health during a caloric deficit.',
          formCues: [
            'Use 4 sets of 10–12 reps — slightly higher rep range for the back maintains volume without excessive joint stress.',
            'Full range of motion: complete arm extension at the top, bar to upper chest at the bottom.',
            'Initiate with scapular depression, then drive elbows down and back.',
            'Controlled eccentric (2–3 s) — the lat stretch under load is a primary hypertrophy stimulus worth preserving in a fat-loss phase.',
          ],
          commonMistakes: [
            'Reducing back training volume excessively in a fat-loss phase: the back muscles are critical for posture and metabolic contribution — do not neglect them to prioritize conditioning.',
            'Rushing through reps to maintain a high training density — quality reps with full range are more effective than fast partial reps.',
          ],
        },
        {
          exerciseKey: 'kettlebell-swing',
          name: 'Kettlebell Swing',
          rationale:
            'The kettlebell swing is the ideal fat-loss finisher: it trains hip extension power, conditions the cardiovascular system, and burns significant caloric energy in a short time while maintaining the hip-hinge mechanics used in deadlift and RDL training. 3 sets of 20 swings at the end of a strength session creates a significant metabolic effect without compromising the muscle maintenance work done earlier.',
          formCues: [
            'Perform 3 sets of 15–20 swings with 45–60 seconds rest.',
            'Drive the swing with a powerful hip snap — this is a hip-extension movement, not a squat-and-lift movement.',
            'The bell floats to shoulder height at the peak; you do not lift it — the hip drive does the work.',
            'At the top of the swing, squeeze your glutes hard and brace your core — the body is fully extended, not hyperextended.',
            'The descent is a controlled hip hinge: the bell passes between the legs and back, loading the hamstrings before the next drive.',
          ],
          commonMistakes: [
            'Using the lower back to swing the bell rather than hip extension: this common fault eventually causes lower back pain and removes the glute activation that gives swings their metabolic value.',
            'Going too heavy and losing hip-drive mechanics — use a weight that allows clean, explosive hip snap on every rep, not a grindy lift.',
          ],
        },
        {
          exerciseKey: 'mountain-climbers',
          name: 'Mountain Climbers',
          rationale:
            'Mountain climbers are a metabolic finisher that trains core stability, hip flexor endurance, and cardiovascular conditioning simultaneously. As the final exercise of a full-body session, they drive heart rate up to maximize post-exercise oxygen consumption (EPOC), contributing to elevated caloric expenditure in the hours after training.',
          formCues: [
            'Perform 3 rounds of 30 seconds on, 15 seconds off at the end of the session.',
            'Maintain a rigid plank position: hips level with shoulders, lower back neutral, not sagging or piked.',
            'Drive each knee toward the chest explosively — the speed of the movement determines the metabolic demand.',
            'Keep shoulders stacked directly over wrists; do not shift your hips back as you fatigue.',
          ],
          commonMistakes: [
            'Allowing the hips to rise ("piking") as fatigue sets in: this eliminates the core stability demand and converts the exercise into a low-intensity movement.',
            'Moving too slowly and treating this as a stretching exercise rather than a conditioning drill — the metabolic benefit requires sustained high-tempo execution.',
          ],
        },
      ],
    },
    {
      label: 'Day 2',
      focus: 'Full Body B — Hinge Pattern',
      exercises: [
        {
          exerciseKey: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          rationale:
            'The RDL as the primary lower-body movement on Day 2 ensures the hamstrings and glutes receive adequate training frequency. In a fat-loss phase, posterior chain strength is often undertrained when programs default to quad-dominant movements — the RDL corrects this imbalance while maintaining the hip-hinge strength critical for caloric expenditure and aesthetics.',
          formCues: [
            'Use 4 sets of 8–10 reps at 70–75% working weight.',
            'Full hip-hinge mechanics: push hips back before the bar moves down, bar dragging close to the legs.',
            'Stop at the point of maximum hamstring tension with neutral spine — do not chase more range at the cost of lumbar neutrality.',
            '3-second descent: the eccentric stimulus is what drives hamstring adaptation and preservation in a fat-loss context.',
          ],
          commonMistakes: [
            'Reducing RDL load disproportionately compared to squats — the posterior chain should receive the same load management as the anterior chain.',
            'Treating the RDL as a cardio movement and rushing through reps: it is a heavy compound exercise that must be performed with full technique regardless of rep range.',
          ],
        },
        {
          exerciseKey: 'barbell-overhead-press',
          name: 'Barbell Overhead Press',
          rationale:
            'The overhead press on Day 2 ensures the shoulders and triceps receive a second weekly stimulus independent of the bench press. Shoulder mass is one of the most visible markers of a lean physique and must be trained with sufficient intensity to be maintained during a caloric deficit.',
          formCues: [
            'Use 4 sets of 6–8 reps at 75% working weight.',
            'Strict press — no leg drive — to isolate the pressing muscles and maximize shoulder recruitment.',
            'Full lockout at the top: biceps next to ears.',
            'Control the descent: 2 s down to the starting position.',
          ],
          commonMistakes: [
            'Using a push press because the strict press feels harder under caloric restriction — the performance dip in a deficit is normal and expected; do not change the exercise, lower the weight slightly.',
            'Abandoning the overhead press in favor of lateral raises under the false belief that lower-load exercises are more "fat loss appropriate" — muscle preservation requires heavy compound work.',
          ],
        },
        {
          exerciseKey: 'barbell-bent-over-row',
          name: 'Barbell Bent-Over Row',
          rationale:
            'The bent-over row pairs with the overhead press to train the horizontal pull pattern that presses do not address. Maintaining back thickness during fat loss prevents the aesthetic imbalance that comes when pressing is maintained but rowing is not. It also supports posture during the caloric deficit, when fatigue can encourage forward shoulder rounding.',
          formCues: [
            'Use 4 sets of 8–10 reps at 70% working weight.',
            'Maintain 45° forward lean throughout — consistent torso angle is critical for reproducible technique across sessions.',
            'Drive elbows back past the torso; pause for 1 second at the peak contraction.',
            'Controlled 2-second descent.',
          ],
          commonMistakes: [
            'Reducing row load more aggressively than press load: push-pull muscular balance must be maintained regardless of the training goal.',
            'Using hip swing to generate momentum under fatigue from earlier exercises — reduce the load and maintain strict form.',
          ],
        },
        {
          exerciseKey: 'dips',
          name: 'Dips',
          rationale:
            'Dips are a high-calorie-burning compound movement that trains the triceps and lower chest through a significant range of motion. As a bodyweight or weighted accessory after the primary push movement of the session, dips add volume and metabolic demand without additional equipment.',
          formCues: [
            'Use bodyweight for 3 sets of AMRAP (as many quality reps as possible) — this is a metabolic finisher, not a strength movement.',
            'Full range of motion: complete elbow extension at the top, upper arm parallel to the floor at the bottom.',
            'Rest 60 seconds between sets — the short rest increases metabolic demand.',
            'When bodyweight becomes easy (15+ reps), add load via belt for the muscle-maintenance benefit.',
          ],
          commonMistakes: [
            'Cutting the range of motion at the top or bottom: full-range dips are more demanding and more effective — never shorten the range to achieve more reps.',
            'Flaring elbows excessively outward under fatigue: keep elbows tracking rearward to maintain shoulder safety.',
          ],
        },
        {
          exerciseKey: 'push-up',
          name: 'Push-Up',
          rationale:
            'Push-ups performed to failure at the end of a session serve as a density finisher. In a fat-loss context, high-rep bodyweight pressing generates significant metabolic demand while reinforcing pushing mechanics. They are also a practical movement that requires no equipment, supporting training consistency outside of the gym.',
          formCues: [
            'Perform 2 sets to technical failure — stop when your form degrades, not when you feel burn.',
            'Maintain a rigid plank position throughout: core braced, glutes squeezed, hips in line with shoulders.',
            'Chest to the floor on each rep — do not stop 2 inches above the ground.',
            'To increase difficulty, elevate feet; to decrease difficulty, perform on knees — always choose the variant you can perform with perfect technique.',
          ],
          commonMistakes: [
            'Allowing the hips to sag or pike: a "worm" push-up pattern trains the lower back, not the pushing muscles — break the set rather than continue with broken form.',
            'Performing partial range of motion to achieve more reps: depth is what makes push-ups effective; 10 full push-ups beats 30 half reps.',
          ],
        },
      ],
    },
    {
      label: 'Day 3',
      focus: 'Full Body C — Volume & Metabolic',
      exercises: [
        {
          exerciseKey: 'leg-press',
          name: 'Leg Press',
          rationale:
            'Day 3 uses the leg press as the primary lower body movement to give the spinal erectors a rest after two days of axial loading while still delivering sufficient quad and glute stimulus. The leg press allows higher rep ranges (10–15) with shorter rest that drive metabolic demand without the CNS fatigue of the barbell squat.',
          formCues: [
            'Use 4 sets of 10–12 reps with 60 seconds rest between sets.',
            'Feet at shoulder width at the middle of the platform.',
            'Full depth: thighs to 90° or slightly past.',
            'Do not lock out the knees at the top — maintain constant tension throughout.',
          ],
          commonMistakes: [
            'Using the leg press as a "rest day" version of squatting at very light load — the load must still be challenging within the 10–12 rep range to preserve muscle.',
            'Performing high-rep sets (20+) with very light weight: this trains cardiovascular endurance, not muscle preservation.',
          ],
        },
        {
          exerciseKey: 'incline-dumbbell-press',
          name: 'Incline Dumbbell Press',
          rationale:
            'Dumbbell pressing on Day 3 gives the shoulder joint a slightly different stimulus than the barbell bench and overhead press earlier in the week, reducing the repetitive stress risk that can develop in high-frequency pressing programs under caloric restriction (where connective tissue recovery is slower).',
          formCues: [
            'Use 4 sets of 10–12 reps with 60 seconds rest.',
            '30–40° bench angle; lower the dumbbells to the sides of the upper chest.',
            'Focus on the chest squeeze at the top rather than pure weight — in a fat-loss phase, the quality of the muscle contraction is more important than the absolute load.',
            'Controlled 2-second descent.',
          ],
          commonMistakes: [
            'Using the same weight as on a pure strength day: under fatigue from earlier exercises and a caloric deficit, this often results in shoulder impingement or technique breakdown.',
            'Rushing the eccentric to maintain a circuit-like pace: the eccentric stimulus is what drives muscle adaptation even in a fat-loss context.',
          ],
        },
        {
          exerciseKey: 'pull-up',
          name: 'Pull-Up',
          rationale:
            'Bodyweight pull-ups on Day 3 provide a no-load-adjustment vertical pull that works well as a third session exercise when fatigue is accumulating across the week. The metabolic demand of bodyweight compound movements in a fatigued state is high, contributing to the total energy expenditure of the session.',
          formCues: [
            'Perform 4 sets to near-failure with strict form — stop 1–2 reps short of failure to maintain quality.',
            'Full dead-hang start on every rep.',
            'Chin clearly over the bar at the top — not just approaching it.',
            '60 seconds rest between sets to maintain training density.',
          ],
          commonMistakes: [
            'Substituting lat pulldowns because pull-ups feel hard after two previous sessions: difficulty is the point — the metabolic and neuromuscular stimulus comes from working against resistance that challenges the current fatigue state.',
            'Kipping or using band assistance: a single strict pull-up is more effective than 10 assisted ones in a fat-loss context.',
          ],
        },
        {
          exerciseKey: 'leg-extension',
          name: 'Leg Extension',
          rationale:
            'Leg extensions at the end of a leg-press session isolate the rectus femoris in a fatigued state, maximizing quad time under tension for the session. In fat-loss training, finishing the quad with an isolation exercise ensures the full quad is trained when compound pressing alone would under-stimulate the rectus femoris.',
          formCues: [
            'Perform 3 sets of 15–20 reps with 45 seconds rest — high-rep isolation as a metabolic finisher.',
            'Full extension on every rep — lock out the knee at the top.',
            'Slow return (2 s) to maintain tension on the quad during the eccentric.',
            'Use a weight that is challenging but allows full range of motion to be maintained for all reps.',
          ],
          commonMistakes: [
            'Going heavy on leg extensions after leg press: the knee is already fatigued and the patellar tendon is under significant load — reduce weight and increase reps instead.',
            'Partial range of motion because the legs are tired: reducing range defeats the purpose of an isolation exercise.',
          ],
        },
        {
          exerciseKey: 'burpee',
          name: 'Burpee',
          rationale:
            'Burpees are the single highest-calorie-per-minute exercise that requires no equipment and can be performed anywhere. As a conditioning finisher, 3 sets of burpees at the end of Day 3 maximize the post-exercise EPOC response and train the cardiovascular system in a way that complements the strength training performed earlier in the session.',
          formCues: [
            'Perform 3 sets of 10 burpees with 60 seconds rest — quality over speed.',
            'Full push-up at the bottom: chest to the floor.',
            'Jump and clap overhead at the top — the full extension and jump are what make burpees metabolically demanding.',
            'Maintain a consistent pace across all 3 sets rather than sprinting the first set and collapsing by the third.',
          ],
          commonMistakes: [
            'Performing "half burpees" without the push-up or the jump: these two components are what drive the caloric expenditure and full-body demand of the exercise.',
            'Using explosive burpees as a warm-up before heavy compound lifts: the cardiovascular and muscular fatigue from burpees will directly compromise the strength sets that follow.',
          ],
        },
      ],
    },
    {
      label: 'Day 4',
      focus: 'Full Body D — Pull Pattern & Conditioning',
      exercises: [
        {
          exerciseKey: 'barbell-deadlift',
          name: 'Barbell Deadlift',
          rationale:
            'The conventional deadlift on Day 4 trains the full posterior chain with the highest force output of any exercise in the program. In a fat-loss phase, deadlifts preserve the glute, hamstring, and spinal erector muscle mass that determines the "athletic" look of a lean physique. They also produce a significant acute metabolic response due to the large muscle mass recruited.',
          formCues: [
            'Use 75–80% of working weight for 4 sets of 5–6 reps — this is the heaviest session of the week; technique must be perfect.',
            'Full setup on every rep: bar over mid-foot, hips set, lats engaged, maximum brace before the bar moves.',
            'Avoid touch-and-go reps: reset your position between reps to maintain technique consistency.',
            'Complete lockout on every rep: hips through, glutes squeezed, standing tall.',
          ],
          commonMistakes: [
            'Reducing deadlift weight too aggressively in a caloric deficit and replacing it with high-rep Romanian deadlifts: heavy compound deadlifts are necessary to signal muscle preservation. High-rep RDLs do not substitute.',
            'Treating Day 4 as a "light day" because it is the final training day of the week — the deadlift requires the same quality of preparation regardless of where it falls in the weekly schedule.',
          ],
        },
        {
          exerciseKey: 'seated-cable-row',
          name: 'Seated Cable Row',
          rationale:
            'A second horizontal pull session in the week ensures the mid-back and rhomboids receive equal frequency to the pressing movements. Fat-loss programs often develop anterior chain bias (from preserved bench pressing and overhead pressing), and the seated cable row corrects this imbalance.',
          formCues: [
            'Use 4 sets of 10–12 reps with 60 seconds rest.',
            'Maintain upright torso throughout — this is not a hip extension exercise.',
            'Drive elbows back past the torso; pause at the peak with a 1-second mid-back squeeze.',
            'Allow scapulae to protract at the end of the eccentric for full range of motion.',
          ],
          commonMistakes: [
            'Using excessive back swing to complete heavy reps: in a fat-loss context, the priority is muscle tension and volume, not maximum load — use strict form at a load you can control.',
            'Shortening the eccentric to maintain training pace: the loaded stretch of the mid-back is valuable and should not be rushed.',
          ],
        },
        {
          exerciseKey: 'cable-face-pull',
          name: 'Cable Face Pull',
          rationale:
            'Face pulls on the final day of the training week serve as both a shoulder-health maintenance exercise and a rear-delt training tool. After four sessions of compound pressing, the posterior shoulder and rotator cuff have accumulated significant fatigue — face pulls address the external rotation deficit with a light, high-rep movement that acts as active recovery for the shoulder complex.',
          formCues: [
            'Perform 3 sets of 20–25 reps at a light, controlled weight.',
            'Pull to face height with elbows at shoulder level; externally rotate maximally at the end of each rep.',
            '60-second rest between sets.',
            'This is a therapeutic exercise — do not rush it or load it heavily.',
          ],
          commonMistakes: [
            'Skipping face pulls because they feel unimportant on a fat-loss day: they are the most important shoulder-health maintenance exercise in the program — their absence leads to progressive anterior shoulder tightness.',
            'Performing them at high intensity after a heavy deadlift session: keep the load light and focus entirely on range of motion and external rotation quality.',
          ],
        },
        {
          exerciseKey: 'incline-dumbbell-curl',
          name: 'Incline Dumbbell Curl',
          rationale:
            'The incline curl trains the bicep long head in a pre-stretched position — the most effective position for bicep hypertrophy. As a finisher on the final strength day, it provides the direct arm volume needed to maintain arm muscle mass during a caloric deficit without adding significant metabolic stress to an already demanding session.',
          formCues: [
            'Set the bench at 45–60°; the arm hangs vertically behind the body, pre-stretching the long head.',
            'Perform 3 sets of 12–15 reps — alternating arms or both simultaneously.',
            'Do not swing the arm forward to initiate the curl — the long-head stretch at the start position is the key stimulus.',
            'Supinate the wrist fully at the top; hold peak contraction for 1 second.',
          ],
          commonMistakes: [
            'Using too steep a bench angle: at 70°+ the arm is not sufficiently behind the body to stretch the long head — use 45–60°.',
            'Rushing the eccentric: the incline curl at a slow eccentric pace is one of the most effective hypertrophy stimuli for the bicep long head — do not skip the controlled lowering phase.',
          ],
        },
        {
          exerciseKey: 'box-jump',
          name: 'Box Jump',
          rationale:
            'Box jumps on the final day of the week develop explosive lower-body power and train the fast-twitch motor units that heavy strength training and slow-tempo hypertrophy work do not fully address. For fat-loss trainees, including one power movement maintains athletic movement quality and produces a high-intensity metabolic stimulus with low joint loading (the box absorbs the landing impact).',
          formCues: [
            'Perform 3 sets of 6–8 explosive jumps with 90 seconds rest — quality and explosiveness are the priority.',
            'Start in a quarter-squat position; swing the arms back, then drive them up as you jump.',
            'Land softly on the box with knees bent — do not land with locked-out knees.',
            'Step down from the box after each jump, do not jump down — landing impact is significant and unnecessary here.',
          ],
          commonMistakes: [
            'Performing box jumps when fatigued from the previous exercises without full recovery: each jump should be fully explosive — if the jump quality degrades significantly, end the set.',
            'Jumping down from the box: the landing from a box jump creates significant knee and ankle joint impact that is unnecessary given that stepping down achieves the same training effect.',
          ],
        },
      ],
    },
  ],
};
