export class Specialization {
    name: string;
    engName: string;
    shortName: string;

    constructor(init?: Partial<Specialization>) {
        Object.assign(this, init);
      }
}
