export class Program {
    id: number;
    subject: string;
    engSubject: string;
    hours: number = 1;

    constructor(init?: Partial<Program>) {
        Object.assign(this, init);
      }
}
