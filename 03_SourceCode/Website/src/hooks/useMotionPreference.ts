import { useSyncExternalStore } from "react";
import {
  readSavedMotionPreference,
  resolveMotionPreference,
  urlWithoutMotionOverride,
  writeSavedMotionPreference,
  type MotionMode,
  type MotionPreferenceSource,
} from "../lib/motionPreference";

type MotionPreferenceState = {
  mode: MotionMode;
  source: MotionPreferenceSource;
  systemPrefersReduced: boolean;
  ready: boolean;
};

const INITIAL_STATE: MotionPreferenceState = {
  mode: "full",
  source: "default",
  systemPrefersReduced: false,
  ready: false,
};

let currentState = INITIAL_STATE;
let mediaQuery: MediaQueryList | null = null;
const listeners = new Set<() => void>();

function applyDocumentState(mode: MotionMode, source: MotionPreferenceSource, systemPrefersReduced: boolean) {
  const root = document.documentElement;
  root.dataset.motionMode = mode;
  root.dataset.motionSource = source;
  root.dataset.systemMotion = systemPrefersReduced ? "reduce" : "no-preference";
}

function emit() {
  listeners.forEach((listener) => listener());
}

function initialize() {
  if (mediaQuery || typeof window === "undefined") return;
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let savedPreference: MotionMode | null = null;
  try {
    savedPreference = readSavedMotionPreference(window.localStorage);
  } catch {
    // Accessing the storage property itself can be blocked by the browser.
  }
  const resolved = resolveMotionPreference(
    window.location.search,
    savedPreference,
  );
  currentState = { ...resolved, systemPrefersReduced: mediaQuery.matches, ready: true };
  applyDocumentState(currentState.mode, currentState.source, currentState.systemPrefersReduced);

  mediaQuery.addEventListener("change", onSystemPreferenceChange);
  emit();
}

function onSystemPreferenceChange(event: MediaQueryListEvent) {
  currentState = { ...currentState, systemPrefersReduced: event.matches };
  applyDocumentState(currentState.mode, currentState.source, currentState.systemPrefersReduced);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initialize();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && mediaQuery) {
      mediaQuery.removeEventListener("change", onSystemPreferenceChange);
      mediaQuery = null;
      currentState = INITIAL_STATE;
    }
  };
}

function getSnapshot() {
  return currentState;
}

function getServerSnapshot() {
  return INITIAL_STATE;
}

function toggle() {
  if (typeof window === "undefined") return;
  const mode: MotionMode = currentState.mode === "full" ? "reduce" : "full";
  let saved = false;
  try {
    saved = writeSavedMotionPreference(window.localStorage, mode);
  } catch {
    // Keep the selection in this in-memory session when storage is unavailable.
  }
  const source: MotionPreferenceSource = saved ? "saved" : "session";
  const cleanUrl = urlWithoutMotionOverride(window.location.href);
  window.history.replaceState(window.history.state, "", cleanUrl);
  currentState = { ...currentState, mode, source };
  applyDocumentState(mode, source, currentState.systemPrefersReduced);
  emit();
}

export function useMotionPreference() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...state, toggle };
}
