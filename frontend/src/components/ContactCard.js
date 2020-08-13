import Icon from '@material-ui/core/Icon';
import 'holderjs';
import Holder from 'holderjs';
import React, { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../styles/contact-card.css';
import ContentEditable from '../utils/ContentEditable';

const ContactCard = ({ contact, width, editable = false, saveFunc }) => {
  const [name, setName] = useState(contact.name);
  const [address, setAddress] = useState(contact.address);
  const [phoneNumber, setPhoneNumber] = useState(contact.phoneNumber);

  const nameRef = useRef();
  const addressRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    Holder.run({
      images: '#img-' + contact.id
    });
  });

  const handleChange = (event) => {
    return getMappedFunctions(
      () => (setName(event.target.value)),
      () => (setAddress(event.target.value)),
      () => (setPhoneNumber(event.target.value))
    );
  };

  const handleBlur = () => {
    saveFunc(Object.assign({}, contact, { name: name, address: address, phoneNumber: phoneNumber }))
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

  const getMappedFunctions = (nameFunc, addressFunc, phoneNumberFunc) => {
    return {
      name: () => (nameFunc()),
      address: () => (addressFunc()),
      phoneNumber: () => (phoneNumberFunc())
    }
  }

  return (
    <>
      <Card style={{ width: width || '100%' }} bg="dark" text="light">
        <Card.Img id={"img-" + contact.id} variant="top" src="holder.js/100px180" />
        <Card.Header className="font-weight-bold">
          <Row>
            <Col className={editable ? "col-10" : "col-12"}>
              <ContentEditable
                tabIndex="0"
                innerRef={nameRef}
                html={name}
                disabled={!editable}
                onChange={(event) => handleChange(event).name()}
                onBlur={() => handleBlur()}
                className={(editable ? " editable cursor-pointer" : "")} />
            </Col>
            {editable && <Col className="col-2">
              <div className="cursor-pointer" onClick={() => focus().name()}><Icon>edit</Icon></div>
            </Col>}
          </Row>
        </Card.Header>
        <Card.Body>
          <Row className="align-items-center">
            <Col className="col-4">
              <span className="font-italic">Address: </span>
            </Col>
            <Col className={(editable ? "col-6" : "col-8")}>
              <ContentEditable
                tabIndex="1"
                innerRef={addressRef}
                html={address}
                disabled={!editable}
                onChange={(event) => handleChange(event).address()}
                onBlur={() => handleBlur()}
                className={(editable ? " editable cursor-pointer" : "")} />
            </Col>
            {editable && <Col className="col-2">
              <div className="cursor-pointer" onClick={() => focus().address()}><Icon>edit</Icon></div>
            </Col>}
          </Row>
          <Row className="align-items-center">
            <Col className="col-4">
              <span className="font-italic">Phone Number: </span>
            </Col>
            <Col className={(editable ? "col-6" : "col-8")}>
              <ContentEditable
                tabIndex="2"
                innerRef={phoneNumberRef}
                html={phoneNumber}
                disabled={!editable}
                onChange={(event) => handleChange(event).phoneNumber()}
                onBlur={() => handleBlur()}
                className={(editable ? " editable cursor-pointer" : "")} />
            </Col>
            {editable && <Col className="col-2">
              <div className="cursor-pointer" onClick={() => focus().phoneNumber()}><Icon>edit</Icon></div>
            </Col>}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default ContactCard;
