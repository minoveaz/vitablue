import { ImageProject } from '../types/imageStudio';

export function appendImageProjectHistory(
  history: ImageProject[],
  index: number,
  nextProject: ImageProject,
  limit = 50,
): { history: ImageProject[]; index: number } {
  const clone = JSON.parse(JSON.stringify(nextProject)) as ImageProject;
  const current = history.slice(0, index + 1);
  const last = current[current.length - 1];
  if (
    last &&
    JSON.stringify(last.layers) === JSON.stringify(clone.layers) &&
    last.preset.id === clone.preset.id &&
    JSON.stringify(last.background) === JSON.stringify(clone.background) &&
    last.title === clone.title
  ) {
    return { history, index };
  }
  const updated = [...current, clone];
  const capped = updated.length > limit ? updated.slice(updated.length - limit) : updated;
  return { history: capped, index: capped.length - 1 };
}
