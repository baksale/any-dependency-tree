export interface Serializer<T> {
  serialize(element: T): string;
}
export class DefaultSerializer<T> implements Serializer<T>{
  public serialize(element: T): string {
    return JSON.stringify(element);
  }
}