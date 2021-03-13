/// Very simple clamp function
/// Should be pretty self explanatory
export default function clamp(x: number, from: number, to: number): number {
  console.assert(from < to);

  if (x < from) return from;
  if (x > to) return to;
  return x;
}