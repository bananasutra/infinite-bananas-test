export type Trait =
  | "infinite"
  | "finite"
  | "apathy"
  | "authoritarian"
  | "erasure"
  | "strongman"
  | "hierarchy"
  | "dogma"
  | "darvo"
  | "narcissism"
  | "grifter"
  | "gifter"
  | "shield";

export type Suit = "Horizon" | "Shield" | "Gift" | "Mirror";
export type Phase = "swipe" | "scenario" | "slider";

export type SwipeQuestion = {
  id: number;
  phase: "swipe";
  suit: Suit;
  text: string;
  impact: {
    right: Partial<Record<Trait, number>>;
    left: Partial<Record<Trait, number>>;
  };
};

export type ScenarioQuestion = {
  id: number;
  phase: "scenario";
  suit: Suit;
  text: string;
  options: Array<{ text: string; scores: Partial<Record<Trait, number>> }>;
};

export type SliderQuestion = {
  id: number;
  phase: "slider";
  suit: Suit;
  text: string;
  min: string;
  max: string;
};

export type Question = SwipeQuestion | ScenarioQuestion | SliderQuestion;

export type SwipeAnswer = { kind: "swipe"; dir: "left" | "right" };
export type ScenarioAnswer = { kind: "scenario"; optionIndex: number };
export type SliderAnswer = { kind: "slider"; value: number }; // 0..100

export type Answer = SwipeAnswer | ScenarioAnswer | SliderAnswer;

export type ScoreTally = Record<Trait, number>;

export type UserRun = {
  name: string;
  answersById: Record<number, Answer>;
  createdAt: number;
};

