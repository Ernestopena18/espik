// Las primeras cinco escenas de Mimi son compartidas por el cuento en ambos idiomas.
const mimi = ["name", "fur", "house", "map", "park"];

export function sentenceImage(storyId, page, sentence) {
  if ((storyId === "chat-gris" || storyId === "grey-cat") && page === 0) {
    const file = mimi[sentence];
    return file ? `/stories/mimi/${file}.png` : null;
  }
  return null;
}
