export type StoryScrollBounds = {
  start: number;
  end: number;
};

export function clampStoryProgress(progress: number) {
  return Math.min(1, Math.max(0, progress));
}

export function storyScrollYForProgress(bounds: StoryScrollBounds, progress: number) {
  const range = Math.max(0, bounds.end - bounds.start);
  return bounds.start + range * clampStoryProgress(progress);
}

export function storyProgressForScrollY(bounds: StoryScrollBounds, scrollY: number) {
  const range = bounds.end - bounds.start;
  if (range <= 0) return 0;
  return clampStoryProgress((scrollY - bounds.start) / range);
}
