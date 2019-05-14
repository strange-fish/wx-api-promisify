interface Params {
  success (res: any): void;
  fail (): void;
}

interface One {
  method (param: Params): void;
}