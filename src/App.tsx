import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './components/MainApp';

import banner from './assets/banner.png';

class App extends React.Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 content-area" id="content-center">
            <div className="row">
              <div className="col-12 nopadding text-center" id="header">
                <img src={banner} alt="banner" />
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
