import React, { useEffect, useMemo } from "react";
import { Frame } from "./ui/Frame";
import { AppStateProvider, useAppState } from "./state";
import { assertQuestionCounts, scenarioQuestions, sliderQuestions, swipeQuestions } from "./questions";
import { decodeRunFromParam } from "./share";
import { Landing } from "./screens/Landing";
import { PhaseSwipe } from "./screens/PhaseSwipe";
import { PhaseScenario } from "./screens/PhaseScenario";
import { PhaseSlider } from "./screens/PhaseSlider";
import { Reveal } from "./screens/Reveal";

function InnerApp() {
  const { state, dispatch } = useAppState();

  useEffect(() => {
    assertQuestionCounts();
    const url = new URL(window.location.href);
    const param = url.searchParams.get("results");
    if (param) {
      const decoded = decodeRunFromParam(param);
      if (decoded) dispatch({ type: "initFromShare", userA: decoded });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const header = useMemo(() => {
    return (
      <div className="w-full text-center">
        <div className="text-sm sm:text-base font-black tracking-tight text-ink">
          Welcome to the <span className="text-pink">Infinite / Finite</span>{" "}
          <span className="text-banana">Match Test</span>
        </div>
      </div>
    );
  }, []);

  // Strict Crescendo UX:
  // landing -> swipe -> scenario -> slider -> reveal
  return (
    <Frame header={header}>
      {state.phase === "landing" ? <Landing /> : null}
      {state.phase === "swipe" ? (
        <PhaseSwipe questions={swipeQuestions as any} onDone={() => dispatch({ type: "nextPhase" })} />
      ) : null}
      {state.phase === "scenario" ? (
        <PhaseScenario questions={scenarioQuestions as any} onDone={() => dispatch({ type: "nextPhase" })} />
      ) : null}
      {state.phase === "slider" ? (
        <PhaseSlider questions={sliderQuestions as any} onDone={() => dispatch({ type: "toReveal" })} />
      ) : null}
      {state.phase === "reveal" ? <Reveal /> : null}
    </Frame>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <InnerApp />
    </AppStateProvider>
  );
}

