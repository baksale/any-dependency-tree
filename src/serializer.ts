export interface Serializer<T>{
    serialize(element: T): string;
}