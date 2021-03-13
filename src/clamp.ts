export default function clamp(x: number, from: number, to: number): number {
  if (x < from) return from;
  if (x > to) return to;
  return x;
}