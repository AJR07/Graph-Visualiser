export default class Queue<T> {
  q: T[] = [];

  push(e: T) {
    this.q.push(e);
  }

  pop(): T | undefined {
    return this.q.shift();
  }
}