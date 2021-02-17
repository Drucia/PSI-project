import { EffectCategory } from "./effect-category";

export class LearningEffect {
    id: string;
    code: string;
    description: string;
    descriptionEng: string;
    category: EffectCategory;

    constructor(init?: Partial<LearningEffect>) {
        Object.assign(this, init);
      }
}
