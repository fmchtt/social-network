export type MessageResponse = {
  message: string;
};

export type EventSubscribed<T> = {
  type: 'created' | 'edited' | 'deleted';
  data: T;
};
