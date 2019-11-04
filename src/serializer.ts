export interface Serializer<T> {
  serialize(element: T): string;
}
export class DefaultSerializer<T> implements Serializer<T>{
  serialize(element: T): string {
    return JSON.stringify(element);
  }
}