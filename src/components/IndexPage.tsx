import React from 'react';
import { Link } from 'react-router-dom';

export default class IndexPage extends React.Component<any, any> {

    public render() {
        return(
            <div>
                <Link to="/card">Bingo Card</Link>
            </div>
        )
    }
}