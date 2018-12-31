export interface User {
  email: string;
  password: string;
}

export interface Message {
  message: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}

export interface Position {
  name: string;
  cost: Number;
  category: string;
  user?: string;
  _id?: string;
}

export interface ModalInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export interface Question {
  crux: string;
  positive: string;
  negative: string;
}
