import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';


const OnlineDirectoryApp = () => {
  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Jumbotron className="mt-5" style={{ height: '90vh' }}>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/admin" component={Admin} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </Jumbotron>
      </BrowserRouter>
    </>
  );
}

export default OnlineDirectoryApp;
