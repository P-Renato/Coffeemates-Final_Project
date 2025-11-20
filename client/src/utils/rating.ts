export function star(rating: number) {
  if (rating >= 4.5) return "⭐⭐⭐⭐⭐";
  if (rating >= 3.5) return "⭐⭐⭐⭐";
  if (rating >= 2.5) return "⭐⭐⭐";
  if (rating >= 1.5) return "⭐⭐";
  if (rating >= 0.5) return "⭐";
  return "No rating";
}
