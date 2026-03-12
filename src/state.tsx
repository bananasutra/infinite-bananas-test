import React, { createContext, useContext, useMemo, useReducer } from "react";
import type { Answer, Phase, UserRun } from "./types";

type Mode = "solo" | "compare";

type AppState = {
  mode: Mode;
  userA: UserRun | null;
  userB: UserRun | null;
  currentUser: "A" | "B";
  phase: Phase | "landing" | "reveal";
};

type Action =
  | { type: "initFromShare"; userA: UserRun }
  | { type: "start"; name: string }
  | { type: "answer"; id: number; answer: Answer }
  | { type: "nextPhase" }
  | { type: "toReveal" }
  | { type: "restart" };

const initialState: AppState = {
  mode: "solo",
  userA: null,
  userB: null,
  currentUser: "A",
  phase: "landing",
};

function ensureRun(prev: UserRun | null, nameFallback: string): UserRun {
  return (
    prev ?? {
      name: nameFallback,
      answersById: {},
      createdAt: Date.now(),
    }
  );
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "initFromShare":
      return {
        ...state,
        mode: "compare",
        userA: action.userA,
        userB: null,
        currentUser: "B",
        phase: "landing",
      };
    case "start": {
      if (state.currentUser === "A") {
        return {
          ...state,
          userA: {
            name: action.name,
            answersById: {},
            createdAt: Date.now(),
          },
          phase: "swipe",
        };
      }
      return {
        ...state,
        userB: {
          name: action.name,
          answersById: {},
          createdAt: Date.now(),
        },
        phase: "swipe",
      };
    }
    case "answer": {
      const target = state.currentUser === "A" ? state.userA : state.userB;
      const run = ensureRun(target, "Anonymous Muppet");
      const updated: UserRun = {
        ...run,
        answersById: { ...run.answersById, [action.id]: action.answer },
      };
      return state.currentUser === "A" ? { ...state, userA: updated } : { ...state, userB: updated };
    }
    case "nextPhase": {
      if (state.phase === "swipe") return { ...state, phase: "scenario" };
      if (state.phase === "scenario") return { ...state, phase: "slider" };
      return state;
    }
    case "toReveal":
      return { ...state, phase: "reveal" };
    case "restart":
      return initialState;
    default:
      return state;
  }
}

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAppState must be used within AppStateProvider");
  return v;
}

