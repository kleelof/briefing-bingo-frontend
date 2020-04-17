import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './components/MainApp';

class App extends React.Component {

  render() {
    return (
      <div className="container-fluid">
        <Fragment>
          <Router>
            <MainApp />
          </Router>
        </Fragment>
      </div>
    );
  }
}

export default App;
