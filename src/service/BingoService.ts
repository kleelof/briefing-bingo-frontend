import Service from "./Service";
import Card from "../models/card/Card";
import BingoDTO from "../models/card/BingoDTO";

class BingoService extends Service {

    public card!: Card;
    
    public getCard = (): Promise<Card> => {
        return new Promise<Card>((resolve, reject) => {
            this._get<Card>("/api/getCard")
                .then((card: Card) => {
                    this.card = card;
                    resolve(card);
                })
                .catch((err: any) => reject(err))
        })
    }

    public setChecked = (phraseId: number, checked: boolean): void => {
        this._get(`/api/${checked ?  "phraseChecked" : "phraseUnchecked"}/${phraseId}/${this.card.playId}`);
    }

    public setBingo = (checkedPhraseIDs: number[]): void => {
        this._post(`/api/setBingo`, new BingoDTO(this.card.playId, checkedPhraseIDs));
    }
}
 
export default new BingoService();
