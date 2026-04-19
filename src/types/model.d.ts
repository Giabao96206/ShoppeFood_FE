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
}
