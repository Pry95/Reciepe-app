import { Ingredient } from "./ingredient.model";

export class Recipe {
    constructor(
        public id: number = null,
        public name: string = '',
        public description: string = '',
        public imagePath: string = '',
        public visibility: string = '',
        public ingredients: Ingredient[] = [],
        public hours: number = null,
        public minutes : number = null,
        public numberOfPeople: number = null,
        public copied ?: number ,
        public evaluation ?: number
    ) {}
}
