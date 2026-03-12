# The Infinite Mirror: Vibe-Coding Specs

## 1. Philosophical Operating System
This app is based on James P. Carse's "Finite and Infinite Games" and Hannah Arendt's "Banality of Evil."
- **Finite Player (The Sauce):** Plays for comfort, winning, boundaries, and status.
- **Infinite Player (The Muppet):** Plays for growth, truth, vulnerability, and keeping the game going.

## 2. Technical Stack
- **Framework:** React + Tailwind CSS.
- **Data Persistence:** Lightweight (Use URL Params for Sharing or LocalStorage).
- **User Flow:** User A takes test -> Gets unique Share Link -> User B takes test -> App shows "Comparison Weather Report."

## 3. The Crescendo UX
1. **Intro:** Enter Name (No Login).
2. **Phase 1 (Swipes):** 20 Swipe cards. High animation, fast-paced.
3. **Phase 2 (Scenarios):** 20 cards that flip or expand to show Multiple Choice.
4. **Phase 3 (Sliders):** 20 vertical/horizontal range inputs.
5. **The Reveal:** A visually stunning "Bananometer" and a text-based "Oracle Report."

## 4. Scoring Logic (Hidden)
- **Bucket A: Infinite Score.** (Truth, Curiosity, Muppet Energy).
- **Bucket B: Finite Score.** (Comfort, Hierarchy, Sauce Energy).
- **Bucket C: Red Flag Score.** (Authoritarian, Erasure, DARVO).
Calculate the "Gap" between User A and User B. If the Gap in "Infinite vs Finite" is > 40%, trigger the "Sean Warning."

NOTE: When writing the Result.js component (the screen that shows the match), make sure to not just show a percentage. Use the logic in @logic.md to generate a personalized 'Weather Report' that compares the two sets of data.

## 5. Visual Aesthetic
- **Vibe:** "Electric Muppet Library." 
- **Palette:** Dark Navy (#0a192f) background, Neon Pink (#ff007f) and Banana Yellow (#ffe135) accents. 
- **Tone:** Intellectual, cheeky, kind but scrupulously honest.