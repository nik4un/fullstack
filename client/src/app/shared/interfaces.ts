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
  cost: number;
  category: string;
  user?: string;
  _id?: string;
  quantity?: number; // будет использоваться только во фронтенде
}

export interface Question {
  crux: string;
  positive: string;
  negative: string;
}

export interface Order {
  date?: Date;
  order?: number;
  list: OrderPosition[];
  user?: string;
  _id?: string;
}

export interface OrderPosition {
  name: string;
  quantity: number;
  cost: number;
  _id?: string;
}

// названия полей мы получаем из бекэнда
export interface Filter {
  start?: Date;
  end?: Date;
  order?: number;

}
