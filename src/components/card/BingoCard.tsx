import React, { Fragment } from 'react';
import UIfx from 'uifx';

import Phrase from '../../models/phrase/Phrase';
import service from '../../service/BingoService';
import CardDTO from '../../models/card/Card';

const bellAudio = require("../../assets/correctBell.mp3");
const clickAudio = require("../../assets/click.mp3");
const loadingIcon = require('../../assets/loading-icon.gif');
const flag = require('../../assets/flag.gif');
const facebook = require('../../assets/Facebook-share-button.png');

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
    private click: UIfx = new UIfx(clickAudio);

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

                window.setTimeout(() => {
                    this.setState({phrases: cardDTO.phrases, loaded: true});
                    this.resetGrid();
                }, 3000)
            })
    }

    private onMarkSquare = (phrase: Phrase): void => {
        this.click.play();
        let markedPhrases: Phrase[] = this.state.markedPhrases;

        if (phrase) {
            if (this.state.markedPhrases.indexOf(phrase) === -1) {
                console.log("add");
                markedPhrases.push(phrase);
                service.setChecked(phrase.id, true);
            } else {
                console.log("update")
                markedPhrases = markedPhrases.filter((cPhrase: Phrase) => cPhrase.id !== phrase.id);
                service.setChecked(phrase.id, false);
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
            console.log(this.state.markedPhrases);
            service.setBingo(this.state.markedPhrases.filter((phrase: Phrase) => !phrase.isFree).map((phrase: Phrase) => phrase.id));
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
                <div className="row justify-content-center">
                    <div className="col-9 col-2" id="loading-panel">
                            <div className="inner text-center">
                                <span className="text">BUILDING YOUR CARD!</span>
                                <img src={loadingIcon} alt="loading icon"/>
                            </div>
                    </div>
                </div>
            )
        }

        return(
            <Fragment>
                <div className="row justify-content-center" id="bingo-card">
                    <div className="col-12 index-info">
                            MARK THE WORDS OR PHRASES YOU HEAR DURING THE BRIEFING!
                            <br/>
                            <small>Click on a square to mark and unmark it.</small>
                            <br/>
                            <small>It's just a game. Close enough COUNTS!</small>
                    </div>
                    <div className="grid">
                        <div className={`overlay ${this.state.viewPhrase !== null ? 'viewPhrase' : ''}`}>
                            <div className="inner">
                                <h2>
                                    {this.state.viewPhrase?.phrase}
                                </h2> 
                                <button className="btn btn-success" onClick={() => {}}>
                                    {
                                            //this.state.markedPhrases.indexOf(this.state.viewPhrase) !== -1 ? "Unmark" : "Mark"
                                    }
                                </button>
                            </div>
                        </div>
                        <div className="overlay" style={{display: this.state.hasBingo ? 'block' : 'none'}}>
                            <div id="bingo-panel">
                                    <h1>BINGO!</h1>
                                    <div>
                                        <img 
                                            src={facebook} 
                                            alt="Share on Facebook"
                                            onClick={() => window.open(`https://www.facebook.com/dialog/feed?app_id=220488182712718&display=iframe&redirect_uri=https://www.briefingbingo.com/close/${service.card.playId}&link=https://www.briefingbingo.com/bingo/${service.card.playId}`, "myWindow", "width=600, height = 600")}
                                            />
                                        <div className="popup-msg">Will open in Popup!</div>
                                    </div>
                            </div>
                        </div>
                        {
                            this.state.phrases.map((phrase: Phrase, index: number) => {
                                let isMarked: boolean = this.state.markedPhrases.indexOf(phrase) !== -1;
                                return (
                                    <Fragment key={`square_${index}`}>
                                        <div 
                                            className={`square`}
                                            onClick={() => !phrase.isFree && !this.state.hasBingo ? this.onMarkSquare(phrase) : null}
                                            >
                                                {phrase.isFree &&
                                                    <div className="inner">
                                                        <img src={flag} alt="flag" />
                                                        <span id="freedom-square">Freedom Square</span>
                                                    </div>
                                                }
                                                {!phrase.isFree &&
                                                    <div className={`inner 
                                                                        ${isMarked ? "marked-square" : ""} 
                                                                        ${!phrase.isFree && !this.state.hasBingo ? "active-square" : ""}
                                                                    `}>
                                                        {phrase.phrase}
                                                    </div>
                                                }

                                                <div className="marker" style={{display: isMarked && !phrase.isFree ? 'block' : 'none'}}>
                                                    X
                                                </div>
                                                
                                                
                                        </div>
                                        {(index + 1) % 5 === 0 &&
                                            <div className="clear"></div>
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}