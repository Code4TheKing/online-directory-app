import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ADMIN_ADD_CONTACT_PATH, ADMIN_EDIT_CONTACT_PATH } from '../OnlineDirectoryApp';
import '../styles/search.css';
import AddContact from './sub/AddContact';
import EditContact from './sub/EditContact';

const Admin = () => {
  const { path } = useRouteMatch();

  return (
    <>
      <Row className="justify-content-center">
        <Nav className="w-25" variant="pills" defaultActiveKey="name" fill>
          <Nav.Item>
            <LinkContainer to={`${ADMIN_ADD_CONTACT_PATH}`}>
              <Nav.Link eventKey="name" active={path === ADMIN_ADD_CONTACT_PATH}>Add</Nav.Link>
            </LinkContainer>
          </Nav.Item>
          <Nav.Item>
            <LinkContainer to={`${ADMIN_EDIT_CONTACT_PATH}`}>
              <Nav.Link eventKey="keyword" active={path === ADMIN_EDIT_CONTACT_PATH}>Edit</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        </Nav>
      </Row>
      <Row>
        <Container className="border-dark pt-3" style={{ borderTop: '1px solid var(--dark)' }}>
          <Switch>
            <Route path={`${ADMIN_ADD_CONTACT_PATH}`} component={AddContact} />
            <Route path={`${ADMIN_EDIT_CONTACT_PATH}`} component={EditContact} />
          </Switch>
        </Container>
      </Row>
    </>
  );
}

export default Admin;
