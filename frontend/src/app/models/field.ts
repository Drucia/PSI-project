import { Specialization } from "./specialization";

export class Field {
    name: string;
    engName: string;
    shortName: string;
    specializations: Specialization[];

    constructor(init?: Partial<Field>) {
        Object.assign(this, init);
    }

    static getSimpleListOfFileds(): Field[] {
        return [new Field({name: "Informatyka", engName: "IT", specializations: [new Specialization({name: "Inżynieria Oprogramowania"}),
        new Specialization({name: "Danologia"}), new Specialization({name: "Zarządzanie"})]}), new Field({name: "Zarządzanie", engName: "Management", specializations: []})];
    }
}
