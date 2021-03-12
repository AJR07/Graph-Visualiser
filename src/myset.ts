export interface Hashable {
  hash(): string;
}

export default class MySet<T extends Hashable> {
  s: Set<string> = new Set();

  insert(item: T) {
    this.s.add(item.hash());
  }

  contains(item: T) {
    this.s.has(item.hash());
  }

  erase(item: T) {
    this.s.delete(item.hash());
  }

  clear() {
    this.s = new Set();
  }
}