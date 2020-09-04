import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import Container from 'react-bootstrap/Container';

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Container>
      <div className="text-center">
        <h1>Welcome to the Online Directory App</h1>
        {isAuthenticated ?
          <h2>Hope you enjoy your stay!</h2> :
          <h2>Please login by clicking the button in the top right</h2>}
      </div>
    </Container>
  );
}

export default Home;
