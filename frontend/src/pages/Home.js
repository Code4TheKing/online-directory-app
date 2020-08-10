import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ContactCardList from '../components/ContactCardList';
import Search from '../components/Search';

const Home = () => (
  <>
    <Jumbotron>
      <Search />
      <ContactCardList />
    </Jumbotron>
  </>
);

export default Home;
