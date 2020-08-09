import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';

const OnlineDirectoryApp = () => {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/admin" component={Admin} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default OnlineDirectoryApp;
