import { LearningEffect } from "./learning-effect";
import { Program } from "./program";

export class SubjectCard {
    id: number;
    isDone: boolean = false;
    lectures: Program[] = [];
    laboratories: Program[] = [];
    projects: Program[] = [];
    seminaries: Program[] = [];
    exercises: Program[] = [];
    prerequisites: string;
    prerequisitesEng: string;
    bibliography: string;
    bibliographyEng: string;
    tools: string;
    toolsEng: string;
    aims: string;
    aimsEng: string;
    professors: string[] = [];
    learningEffects: LearningEffect[];

    constructor(init?: Partial<SubjectCard>) {
        Object.assign(this, init);
    }

    static create()
    {
        return new SubjectCard({
            isDone: false,
            lectures: [],
            laboratories: [],
            projects: [],
            seminaries: [],
            exercises: [],
            professors: [],
            learningEffects: []
        });
    }

    static hasUniqueTitleError(card: SubjectCard)
    {
        return (!card.isDone && !(
            new Set(card.laboratories.map(p => p.subject)).size == card.laboratories.length &&
            new Set(card.lectures.map(p => p.subject)).size == card.lectures.length &&
            new Set(card.exercises.map(p => p.subject)).size == card.exercises.length &&
            new Set(card.projects.map(p => p.subject)).size == card.projects.length &&
            new Set(card.seminaries.map(p => p.subject)).size == card.seminaries.length));
    }
}
