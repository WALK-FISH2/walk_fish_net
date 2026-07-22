import type { MotionMode, MotionPreferenceSource } from "../lib/motionPreference";

type Props = {
  mode: MotionMode;
  source: MotionPreferenceSource;
  systemPrefersReduced: boolean;
  onToggle: () => void;
};

export function MotionModeControl({ mode, source, systemPrefersReduced, onToggle }: Props) {
  const reduced = mode === "reduce";
  const showSystemSuggestion = systemPrefersReduced && !reduced;

  return (
    <div className="motion-mode-control" data-motion-source={source}>
      {showSystemSuggestion ? <small role="status">系统建议简化动画</small> : null}
      <button
        type="button"
        aria-pressed={reduced}
        aria-label={reduced ? "当前为简化动画，切换为完整动画" : "当前为完整动画，切换为简化动画"}
        onClick={onToggle}
      >
        <span aria-hidden="true">{reduced ? "▣" : "✦"}</span>
        动画：{reduced ? "简化" : "完整"}
      </button>
    </div>
  );
}
