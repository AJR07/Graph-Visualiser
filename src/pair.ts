/// Basically like C++ pair
export default class Pair<First, Second> {
  first: First;
  second: Second;

  constructor(first: First, second: Second) {
    this.first = first;
    this.second = second;
  }

  toString(): string {
    return `(${this.first}, ${this.second})`;
  }
}
