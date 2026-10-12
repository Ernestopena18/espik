// Las imágenes se comparten entre las versiones inglesa y francesa de cada cuento.
const mimi = ["name", "fur", "house", "map", "park"];
const openingScenes = {
  greetings: "/stories/greetings/first.png",
  salutations: "/stories/greetings/first.png",
  directions: "/stories/directions/first.png",
  "city-day": "/stories/city-day/first.png",
  "journee-ville": "/stories/city-day/first.png",
  cafe: "/stories/cafe/first.png",
};

export function sentenceImage(storyId, page, sentence) {
  if ((storyId === "chat-gris" || storyId === "grey-cat") && page === 0) {
    const file = mimi[sentence];
    return file ? `/stories/mimi/${file}.png` : null;
  }
  if (page === 0 && sentence === 0) return openingScenes[storyId] || null;
  return null;
}
