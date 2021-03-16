export default class Queue<T> {
  q: T[] = [];

  push(e: T): void {
    this.q.push(e);
  }

  pop(): T | undefined {
    return this.q.shift();
  }
}
