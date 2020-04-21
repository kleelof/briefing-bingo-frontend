import React from 'react';
import { Link } from 'react-router-dom';

const getYourCard = require('../assets/get-your-card.png');

export default class IndexPage extends React.Component<any, any> {

    public render() {
        return(
            <div className="row justify-content-center" id="index-page">
                <div className="col-12 index-info">
                STEP 1: Tune into a live briefing. No live briefing? <a href="https://www.youtube.com/results?search_query=corona+task+force+briefing" target="_blank" rel="noopener noreferrer">Search on Youtube</a>
                <br/>
                STEP 2: Invite your friends and family or plan a Briefing Bingo HAPPYHOUR!
                <br/>
                STEP 3: GET A BINGO CARD!!
                </div>
                <div className="col-9 col-md-12 text-center" id="get-your-card">
                    <Link to="/card">
                        <img src={getYourCard} alt="get your card" />
                    </Link>
                </div> 
            </div>
        )
    }
}