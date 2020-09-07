import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { SEARCH_BY_KEYWORD_PATH, SEARCH_BY_NAME_PATH } from '../OnlineDirectoryApp';
import '../styles/search.css';
import SearchByKeyword from './sub/SearchByKeyword';
import SearchByName from './sub/SearchByName';

const Search = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Row className="justify-content-center">
        <Nav className="w-25" variant="pills" defaultActiveKey="name" fill>
          <Nav.Item>
            <LinkContainer to={`${path}${SEARCH_BY_NAME_PATH}`}>
              <Nav.Link eventKey="name" active={path === SEARCH_BY_NAME_PATH}>Name</Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to={`${path}${SEARCH_BY_KEYWORD_PATH}`}>
              <Nav.Link eventKey="keyword" active={path === SEARCH_BY_KEYWORD_PATH}>Keyword</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </Row>
      <Row>
        <Container className="border-dark pt-3" style={{ borderTop: '1px solid var(--dark)' }}>
          <Switch>
            <Route path={`${path}${SEARCH_BY_NAME_PATH}`} component={SearchByName} />
            <Route path={`${path}${SEARCH_BY_KEYWORD_PATH}`} component={SearchByKeyword} />
          </Switch>
        </Container>
      </Row>
    </>
  );
}

export default Search;
