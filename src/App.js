import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom'
import Homepage from './Components/Homepage';
import CasesInfo from './Components/CasesInfo';
import CorMap from './Components/CorMap'
import BackBtn from './Components/BackBtn'


function App() {
  return (
    <div className='background'>
      <Switch>
        <Route exact path="/" component={Homepage}/>
        <Route path="/map">
          <BackBtn/>
          <CorMap/>
        </Route>
        <Route path="/case-info">
          <BackBtn/>
          <CasesInfo/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
