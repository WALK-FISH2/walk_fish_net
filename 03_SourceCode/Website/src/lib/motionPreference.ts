export const MOTION_STORAGE_KEY = "pixel-walk:motion-preference";

export type MotionMode = "full" | "reduce";
export type MotionPreferenceSource = "url" | "saved" | "default" | "session";

export type ResolvedMotionPreference = {
  mode: MotionMode;
  source: Exclude<MotionPreferenceSource, "session">;
};

export function isMotionMode(value: string | null): value is MotionMode {
  return value === "full" || value === "reduce";
}

export function resolveMotionPreference(search: string, savedValue: string | null): ResolvedMotionPreference {
  const queryMode = new URLSearchParams(search).get("motion");
  if (isMotionMode(queryMode)) return { mode: queryMode, source: "url" };
  if (isMotionMode(savedValue)) return { mode: savedValue, source: "saved" };
  return { mode: "full", source: "default" };
}

export function readSavedMotionPreference(storage: Pick<Storage, "getItem">): MotionMode | null {
  try {
    const value = storage.getItem(MOTION_STORAGE_KEY);
    return isMotionMode(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeSavedMotionPreference(storage: Pick<Storage, "setItem">, mode: MotionMode): boolean {
  try {
    storage.setItem(MOTION_STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}

export function urlWithoutMotionOverride(href: string): string {
  const url = new URL(href);
  url.searchParams.delete("motion");
  return `${url.pathname}${url.search}${url.hash}`;
}
