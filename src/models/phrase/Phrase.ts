export default class Phrase {

    public id!: number;
    public phrase!: string;
    public isFree: boolean = false;
    public gridPosition!: {y: number, x:  number};

    constructor(phrase: string, isFree: boolean) {
        this.phrase = phrase;
        this.isFree = isFree;
    }
}