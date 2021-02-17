import { SubjectCard } from "./subject-card";

export class Course {
    name: string;
    engName: string;
    semester: number = 1;
    sumHoursForLectures: number;
    sumHoursForLaboratories: number;
    sumHoursForProjects: number;
    sumHoursForSeminaries: number;
    sumHoursForExercises: number;
    subjectCard?: SubjectCard;

    constructor(init?: Partial<Course>) {
        Object.assign(this, init);
    }
}
