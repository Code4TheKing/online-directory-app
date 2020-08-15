import { LinearProgress } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import 'holderjs';
import Holder from 'holderjs';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../styles/contact-card.css';
import ContentEditable from '../utils/ContentEditable';

const ContactCard = ({ width, editable = false, contact, isUpdating = false, saveFunc }) => {
  const getId = (contact) => {
    return contact ? contact._id : 'no-id';
  }

  const getName = (contact) => {
    return contact && contact.name ? contact.name : '';
  }

  const getAddress = (contact) => {
    return contact && contact.address ? contact.address : '';
  }

  const getPhoneNumber = (contact) => {
    return contact && contact.phoneNumber ? contact.phoneNumber : '';
  }

  const [name, setName] = useState(getName(contact));
  const [address, setAddress] = useState(getAddress(contact));
  const [phoneNumber, setPhoneNumber] = useState(getPhoneNumber(contact));

  const nameRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    Holder.run({
      images: '#img-' + getId(contact)
    });
    reset();
  }, [contact]);

  const handleChange = (event) => {
    return getMappedFunctions(
      () => (setName(event.target.value)),
      () => (setAddress(event.target.value)),
      () => (setPhoneNumber(event.target.value))
    );
  };

  const save = () => {
    saveFunc(Object.assign({}, contact ? contact : {}, { name: name, address: address, phoneNumber: phoneNumber }))
      .then(() => reset());
  };

  const focus = () => {
    return getMappedFunctions(
      () => {
        nameRef.current.focus();
      },
      () => {
        addressRef.current.focus();
      },
      () => {
        phoneNumberRef.current.focus();
      }
    );
  }

  const reset = () => {
    setName(getName(contact));
    setAddress(getAddress(contact));
    setPhoneNumber(getPhoneNumber(contact));
  }

  const isModified = () => {
    return getName(contact) !== name || getAddress(contact) !== address || getPhoneNumber(contact) !== phoneNumber;
  }

  const getMappedFunctions = (nameFunc, addressFunc, phoneNumberFunc) => {
    return {
      name: () => (nameFunc()),
      address: () => (addressFunc()),
      phoneNumber: () => (phoneNumberFunc())
    }
  }

  return (
    <Card className="d-flex" style={{ width: width || '100%', maxWidth: '25rem', maxHeight: '100%' }} bg="dark" text="light">
      <Card.Img id={"img-" + getId(contact)} variant="top" src="holder.js/100px200/auto" />
      <Card.Header className="font-weight-bold">
        <Row>
          <Col className={editable ? "col-10" : "col-12"}>
            <ContentEditable
              tabIndex="0"
              innerRef={nameRef}
              html={name}
              disabled={!editable}
              onChange={(event) => handleChange(event).name()}
              className={(editable ? " editable cursor-pointer" : "")} />
          </Col>
          {editable && <Col className="col-2">
            <div className="cursor-pointer" onClick={() => focus().name()}><Icon>edit</Icon></div>
          </Col>}
        </Row>
      </Card.Header>
      <Card.Body>
        <Row className="align-items-center">
          <Col className="col-3">
            <span>Address: </span>
          </Col>
          <Col className={(editable ? "col-7" : "col-9")}>
            <ContentEditable
              tabIndex="1"
              innerRef={addressRef}
              html={address}
              disabled={!editable}
              onChange={(event) => handleChange(event).address()}
              className={(editable ? " editable cursor-pointer" : "")} />
          </Col>
          {editable && <Col className="col-2">
            <div className="cursor-pointer" onClick={() => focus().address()}><Icon>edit</Icon></div>
          </Col>}
        </Row>
        <Row className="align-items-center">
          <Col className="col-3">
            <span>Phone Number: </span>
          </Col>
          <Col className={(editable ? "col-7" : "col-9")}>
            <ContentEditable
              tabIndex="2"
              innerRef={phoneNumberRef}
              html={phoneNumber}
              disabled={!editable}
              onChange={(event) => handleChange(event).phoneNumber()}
              className={(editable ? " editable cursor-pointer" : "")} />
          </Col>
          {editable && <Col className="col-2">
            <div className="cursor-pointer" onClick={() => focus().phoneNumber()}><Icon>edit</Icon></div>
          </Col>}
        </Row>
      </Card.Body>
      {editable && <Card.Body>
        <Row>
          <Col className="col-6">
            {isModified() && !isUpdating ?
              <Button className="w-100" variant="danger" onClick={reset}>Cancel</Button> :
              <Button className="w-100" variant="outline-danger" disabled>Cancel</Button>}
          </Col>
          <Col className="col-6">
            {isModified() && !isUpdating ?
              <Button className="w-100" variant="success" onClick={save}>Save</Button> :
              <Button className="w-100" variant="outline-success" disabled>Save</Button>}
          </Col>
        </Row>
        {isUpdating && <Row className="mt-3">
          <Col>
            <LinearProgress className="w-100" />
          </Col>
        </Row>}
      </Card.Body>}
    </Card>
  );
}

export default ContactCard;
