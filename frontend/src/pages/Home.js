import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ContactCardList from '../components/ContactCardList';
import Search from '../components/Search';

const Home = () => (
  <>
    <Container>
      <Row className="justify-content-center">
        <Search />
      </Row>
      <Row className="justify-content-center mt-4">
        <ContactCardList />
      </Row>
    </Container>
  </>
);

export default Home;
