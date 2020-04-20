import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './components/MainApp';

class App extends React.Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 content-area" id="content-center">
            <div className="row">
              <div className="col-12 nopadding text-center" id="header">
                <span className="text-center title">
                  <small>TASK FORCE</small>
                  <br/>
                  Briefing BINGO!!
                  </span>
              </div>
            </div>
            <Fragment>
              <Router>
                <MainApp />
              </Router>
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
