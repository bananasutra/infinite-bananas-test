import type { Question } from "./types";
import raw from "../questions.json";

export const questions = raw as Question[];

export const byId: Record<number, Question> = Object.fromEntries(questions.map((q) => [q.id, q]));

export const swipeQuestions = questions.filter((q) => q.phase === "swipe");
export const scenarioQuestions = questions.filter((q) => q.phase === "scenario");
export const sliderQuestions = questions.filter((q) => q.phase === "slider");

export function assertQuestionCounts() {
  if (questions.length !== 60) throw new Error(`Expected 60 questions, got ${questions.length}`);
  if (swipeQuestions.length !== 20) throw new Error(`Expected 20 swipe, got ${swipeQuestions.length}`);
  if (scenarioQuestions.length !== 20)
    throw new Error(`Expected 20 scenario, got ${scenarioQuestions.length}`);
  if (sliderQuestions.length !== 20) throw new Error(`Expected 20 slider, got ${sliderQuestions.length}`);
}

