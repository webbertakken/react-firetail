export class EventBuffer<T> {
  queue: T[] = [];

  length = 0;

  isEmpty() {
    return this.queue.length === 0;
  }

  put(message) {
    this.queue.push(message);
    this.length = this.queue.length;
  }

  take() {
    const message = this.queue.shift();
    this.length = this.queue.length;
    return message;
  }

  flush() {
    const messages = this.queue;
    this.queue = [];
    this.length = 0;
    return messages;
  }
}
