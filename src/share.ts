import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { UserRun } from "./types";

const VERSION = 1;

type SharePayloadV1 = {
  v: 1;
  name: string;
  a: Record<number, unknown>;
  t: number;
};

export function encodeRunToParam(run: UserRun): string {
  const payload: SharePayloadV1 = {
    v: VERSION,
    name: run.name,
    a: run.answersById as Record<number, unknown>,
    t: run.createdAt,
  };
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeRunFromParam(param: string): UserRun | null {
  try {
    const json = decompressFromEncodedURIComponent(param);
    if (!json) return null;
    const parsed = JSON.parse(json) as Partial<SharePayloadV1>;
    if (parsed.v !== 1) return null;
    if (typeof parsed.name !== "string") return null;
    if (!parsed.a || typeof parsed.a !== "object") return null;
    return {
      name: parsed.name,
      answersById: parsed.a as UserRun["answersById"],
      createdAt: typeof parsed.t === "number" ? parsed.t : Date.now(),
    };
  } catch {
    return null;
  }
}

