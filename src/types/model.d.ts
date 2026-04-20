export {};

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
}
