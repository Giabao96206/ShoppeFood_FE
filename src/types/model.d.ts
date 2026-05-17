export { };

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string | string[];
    status: number | string;
    data?: T;
  }

  interface IRegister {
    _id: string;
    status?: string;
  }

  interface UserLogin {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
      phone?: string;
      role?: string;
    };
    access_token: string;
  }

  interface UserEdit {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
      phone?: string;
      role?: string;
    };
  }

  interface IRestaurant {
    _id: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    rating: number;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: Date;
  }

  interface IMenu {
    _id: string;
    title: string;
    restaurant: string;
    menuItems: IMenuItems[];
  }
  interface IMenuRestaurant {
    _id: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    rating: number;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    menus: IMenu[];
  }

  interface IMenuItems {
    _id: string;
    menu: string;
    title: string;
    description: string;
    basePrice: number;
    image: string;
    options: {
      title: string;
      description: string;
      additionalPrice: number;
    }[];
    updatedAt: Date;
    createdAt: Date;
  }

  interface ICart {
    [key: string]: {
      sum: number;
      quantity: number;
      items: {
        [key: string]: {
          quantity: number;
          data: IMenuItems;
          extra?: {
            [key: string]: number;
          };
        };
      };
    };
  }

  interface IOrderHistory {
    _id: string;
    restaurant: IRestaurant;
    restaurantName: string;
    user: string;
    status: string;
    totalPrice: number;
    quantity: number;
    delete: boolean;
    orderTime: Date;
    details: {
      image: string;
      title: string;
      option: string;
      price: number;
      quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }

  interface ILastMessage {
    message_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    createdAt: string;
  }

  interface IOtherUser {
    _id: string;
    name: string;
    avatar: string;
    last_seen: Date;
    is_online?: boolean;
  }

  interface IUser {
    _id: string;
    otherUser: IOtherUser;
    lastMessage: ILastMessage;
  }

  interface IMessgages {
    _id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    status: "sent" | "read";
    createdAt: string;
  }
}
