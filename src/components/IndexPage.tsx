import React from 'react';
import { Link } from 'react-router-dom';

const getYourCard = require('../assets/get-your-card.png');

export default class IndexPage extends React.Component<any, any> {

    public render() {
        return(
            <div className="row justify-content-center" id="index-page">
                <div className="col-9">
                    <div className="index-info">
                        Play with Anyone ANYWHERE!!
                    </div>
                    <div className="index-info">
                        Play with your Friends and Family in Lockdown!
                    </div>
                    <div className="index-info">
                        Great for Teaching Kids about Corona Events!
                    </div>
                </div>
                <div className="col-7" id="get-your-card">
                    <Link to="/card">
                        <img src={getYourCard} alt="get your card" />
                    </Link>
                </div> 
            </div>
        )
    }
}