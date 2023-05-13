class Node<T> {
  next: Node<T> | undefined;
  constructor(public data: T) {
  }
}

export class Queue<T> {
  head: Node<T> | undefined;
  tail: Node<T> | undefined;
  length :number = 0;

  constructor() {
    this.head = this.tail = undefined;
  }

  enqueue(data: T): void {
    const node = new Node(data);
    if (this.isEmpty()) {
      this.head = this.tail = node;
      return;
    }
    this.tail!.next = node;
    this.tail = node;
    this.length++;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return;
    }
    const data = this.head!.data;
    if (this.tail === this.head) {
      this.head = this.tail = undefined;
    } else {
      this.head = this.head!.next;
    }

    this.length--;
    return data;
  }

  isEmpty() {
    return this.head === undefined;
  }
}
