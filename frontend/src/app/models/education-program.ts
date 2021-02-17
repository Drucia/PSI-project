import { Course } from "./course";
import { Degree } from "./degree.enum";
import { Field } from "./field";
import { Specialization } from "./specialization";
import { SubjectCard } from "./subject-card";
import { Term } from "./term.enum";

export class EducationProgram {
    id: string;
    year: number;
    isWIP: boolean;
    degree: Degree;
    term: Term;
    field: Field;
    specialization?: Specialization;
    courses: Course[];

    constructor(init?: Partial<EducationProgram>) {
        Object.assign(this, init);
    }

    static create() {
       return new EducationProgram({
           isWIP: true,
           courses: [],
       });
    }
}
