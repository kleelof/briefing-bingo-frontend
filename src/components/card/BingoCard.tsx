import React, { Fragment } from 'react';
import UIfx from 'uifx';

import Phrase from '../../models/phrase/Phrase';
import service from '../../service/BingoService';
import CardDTO from '../../models/card/Card';

const bellAudio = require("../../assets/correctBell.mp3");

interface IState {
    phrases: Phrase[],
    loaded: boolean,
    viewPhrase: Phrase | null,
    markedPhrases: Phrase[],
    hasBingo: boolean
}

type point = {y: number, x: number};

export default class BingoCard extends React.Component<any, IState> {

    private bell: UIfx = new UIfx(bellAudio);

    constructor(props: any) {
        super(props);

        this.state = {
            phrases: [],
            loaded: false,
            viewPhrase: null,
            markedPhrases: [],
            hasBingo: false
        }
    }

    public componentDidMount = (): void => {
        service.getCard()
            .then((cardDTO: CardDTO) => {
                let phrases: Phrase[] = cardDTO.phrases;
                phrases.splice(12, 0, new Phrase("Free", true));
                phrases.forEach((phrase: Phrase, index: number) => {
                    let y: number = Math.floor(index / 5);
                    phrase.gridPosition = {y, x: index - y * 5}
                })
                this.setState({phrases: cardDTO.phrases, loaded: true});
                this.resetGrid();
            })
    }

    private onMarkSquare = (): void => {
        let markedPhrases: Phrase[] = this.state.markedPhrases;

        if (this.state.viewPhrase) {
            if (this.state.markedPhrases.indexOf(this.state.viewPhrase) === -1) {
                markedPhrases.push(this.state.viewPhrase);
                service.setChecked(this.state.viewPhrase.id, true);
            } else {
                markedPhrases = markedPhrases.filter((phrase: Phrase) => phrase.id !== this.state.viewPhrase?.id);
                service.setChecked(this.state.viewPhrase.id, false);
            }
        }
        this.setState({markedPhrases, viewPhrase: null}, this.checkForBingo);
    }

    private checkForBingo = (): void => {
        let hasBingo: boolean = false;
        let grid: boolean[][] = [
                                    [false, false, false, false, false],
                                    [false, false, false, false, false],
                                    [false, false, false, false, false],
                                    [false, false, false, false, false],
                                    [false, false, false, false, false]
                                ]

        this.state.markedPhrases.forEach((phrase: Phrase) => {
            grid[phrase.gridPosition.y][phrase.gridPosition.x] = true;
        });

        let xRefs: boolean[];
        let l2rRefs: boolean[] = [];
        let r2lRefs: boolean[] = [];

        for (let x = 0; x < 5; x ++) {
            xRefs = [];
            for (let y = 0; y < 5; y ++) {
                if (grid[y].indexOf(false) === - 1)  hasBingo = true; //row test
                xRefs.push(grid[y][x]);
                if (x === y) {
                    l2rRefs.push(grid[y][x]);
                    r2lRefs.push(grid[y][4-x])
                }
            }

            if (xRefs.indexOf(false) === -1) {hasBingo = true; console.log("x")} // column test

            if (hasBingo) break;
        }
        
        if (!hasBingo && (l2rRefs.indexOf(false) === -1 || r2lRefs.indexOf(false) === -1)) hasBingo = true; // diag tests
        
        if (hasBingo) {
            this.bell.play();
            this.setState({hasBingo});
            service.setBingo();
        }
    }

    private resetGrid = (): void => {
        this.setState({
            viewPhrase: null,
            hasBingo: false,
            markedPhrases: [this.state.phrases[12]]
        }); 
    } 

    public render() {
        if (!this.state.loaded) {
            return (
                <div>Loading...</div>
            )
        }

        return(
            <Fragment>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-7 grid">
                        {!this.state.viewPhrase &&
                            this.state.phrases.map((phrase: Phrase, index: number) => {
                                let isMarked: boolean = this.state.markedPhrases.indexOf(phrase) !== -1;
                                return (
                                    <Fragment key={`square_${index}`}>
                                        <div 
                                            className={`square`}
                                            onClick={() => !phrase.isFree && !this.state.hasBingo ? this.setState({viewPhrase: phrase}) : null}
                                            >
                                            <div className={`inner 
                                                                ${isMarked ? "marked-square" : ""} 
                                                                ${!phrase.isFree && !this.state.hasBingo ? "active-square" : ""}
                                                            `}>
                                                {phrase.phrase}
                                            </div>
                                        </div>
                                        {(index + 1) % 5 === 0 &&
                                            <div className="clear"></div>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                        {this.state.viewPhrase &&
                            <div className="row viewPhrase justify-content-center">
                                <div className="col-10 col-md-8 inner">
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <h2>
                                                {this.state.viewPhrase.phrase}
                                            </h2>
                                        </div>
                                        <div className="col-12 text-center">
                                            <button className="btn btn-success" onClick={this.onMarkSquare}>
                                                {
                                                     this.state.markedPhrases.indexOf(this.state.viewPhrase) !== -1 ? "Unmark" : "Mark"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}