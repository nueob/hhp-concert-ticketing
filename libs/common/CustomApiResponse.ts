import { Exclude, Expose } from "class-transformer";

export class CustomApiResponse<T> {
  @Exclude() private readonly _result: T;

  constructor(result: T) {
    this._result = result;
  }

  @Expose()
  get result(): T {
    return this._result;
  }
}
