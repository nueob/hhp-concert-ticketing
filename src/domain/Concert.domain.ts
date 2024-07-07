import { Performance } from "./Performance.domain";

export class Concert {
  private readonly _id: number;
  private readonly _name: string;
  private readonly _performance: Performance;

  constructor(id?: number, name?: string, performance?: Performance) {
    this._id = id;
    this._name = name;
    this._performance = performance;
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get performance(): Performance {
    return this._performance;
  }
}
