import { useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from '@material-ui/core';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import PrivateRoute from './components/PrivateRoute';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';

const OnlineDirectoryApp = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center">
        <CircularProgress className="w-25 h-25" />
      </Container>
    );
  }

  return (
    <>
      <NavigationBar />
      <Jumbotron>
        <Switch>
          <Route path="/" component={Home} exact />
          <PrivateRoute path="/search" component={Search} />
          <PrivateRoute path="/admin" component={Admin} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </Jumbotron>
    </>
  );
}

export default OnlineDirectoryApp;
