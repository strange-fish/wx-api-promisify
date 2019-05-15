export namespace Test {
  type SuccessRes = {
    one: string;
    two: string;
  }
  interface Params {
    success (res: SuccessRes): void;
    fail (): void;
    name: string;
  }
  
  interface One {
    method (param: Params): void;
  }
}