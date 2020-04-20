import React from 'react';
import { Link } from 'react-router-dom';

const getYourCard = require('../assets/get-your-card.png');

export default class IndexPage extends React.Component<any, any> {

    public render() {
        return(
            <div className="row justify-content-center" id="index-page">
                <div className="col-10">
                    <div className="index-info">
                        Add to the excitement of the daily TASK FORCE BRIEFING with the BINGO game that is SWEEPING AMERICA!
                    </div>
                    <div className="index-info">
                        Play with Anyone ANYWHERE!!
                    </div>
                    <div className="index-info">
                        Play with your Friends and Family in Lockdown!
                    </div>
                    <div className="index-info">
                        Great for Teaching Kids about Corona Events!
                    </div>
                    <div className="index-info">
                        Turn on the BRIEFING and GET YOUR BINGO CARD!
                    </div>
                </div>
                <div className="col-9 col-md-12" id="get-your-card">
                    <Link to="/card">
                        <img src={getYourCard} alt="get your card" />
                    </Link>
                </div> 
            </div>
        )
    }
}