import React from 'react';
import { Switch, Route } from 'react-router-dom';
import IndexPage from './IndexPage';
import BingoCard from './card/BingoCard';

export default class MainApp extends React.Component<any, any> {

    public render() {
        return(
            <Switch>
                <Route exact path="/" component={IndexPage} />
                <Route exact path="/card" component={BingoCard} />
            </Switch>
        )
    }
}