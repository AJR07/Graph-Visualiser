import Hashids from "hashids";
import { Hashable } from "./myset";

export default class Pair implements Hashable {
  first: number;
  second: number;

  constructor(first: number, second: number) {
    this.first = first;
    this.second = second;
  }

  hash(): string {
    const hashids = new Hashids();
    return hashids.encode(this.first, this.second);
  }

  toString(): string {
    return `(${this.first}, ${this.second})`;
  }
}
