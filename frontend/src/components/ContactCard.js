import { useAuth0 } from "@auth0/auth0-react";
import { Icon, LinearProgress } from '@material-ui/core';
import 'holderjs';
import Holder from 'holderjs';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import useDeepCompareEffect from 'use-deep-compare-effect';
import '../styles/contact-card.css';

const ContactCard = ({
  width,
  editable = false,
  fieldDefs = {
    idField: {
      name: "_id"
    },
    mainField: {
      name: "name"
    },
    otherFields: [
      {
        name: "address",
        displayName: "Address"
      },
      {
        name: "phoneNumber",
        displayName: "Phone Number"
      }
    ]
  },
  contact = {},
  isSaving = false,
  isInviting = false,
  isAdmin = false,
  saveFunc,
  inviteFunc
}) => {
  const getIdValue = (fieldDefs, contact) => {
    return getFieldValue(contact, fieldDefs.idField.name);
  }

  const getMainValue = (fieldDefs, contact) => {
    return getFieldValue(contact, fieldDefs.mainField.name);
  }

  const getFieldValue = (contact, fieldName) => {
    return emptyIfNull(contact, fieldName);
  }

  const emptyIfNull = (contact, fieldName) => {
    return contact[fieldName] ?
      contact[fieldName] :
      (fieldName === fieldDefs.idField.name ? 'no-id' : '');
  }

  const { getAccessTokenSilently } = useAuth0();
  const [mainField, setMainField] = useState(getMainValue(fieldDefs, contact));
  const [otherFields, setOtherFields] = useState(
    fieldDefs.otherFields
      .reduce((acc, curr) => {
        acc[curr.name] = getFieldValue(contact, curr.name);
        return acc;
      }, {}));
  const [modified, setModified] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmailAddress, setInviteEmailAddress] = useState('');
  const [inviteValidated, setInviteValidated] = useState(false);

  const mainRef = useRef();
  const otherRefs = useRef({});

  const isModified = () => {
    return getMainValue(fieldDefs, contact) !== mainField || fieldDefs.otherFields.some(field => getFieldValue(contact, field.name) !== otherFields[field.name]);
  }

  useDeepCompareEffect(() => {
    Holder.run({
      images: '#img-' + getIdValue(fieldDefs, contact)
    });
    setModified(isModified());
  }, [contact]);

  useDeepCompareEffect(() => {
    setModified(isModified());
  }, [mainField, otherFields]);

  const handleChange = (event, setFunc) => {
    setFunc(event.target.value);
  };

  const save = () => {
    getAccessTokenSilently()
      .then(token => saveFunc(
        Object.assign(
          {},
          contact,
          { [fieldDefs.mainField.name]: mainField },
          fieldDefs.otherFields
            .reduce((acc, curr) => {
              if (otherFields[curr.name] || otherFields[curr.name] === '') acc[curr.name] = otherFields[curr.name];
              return acc;
            }, {})),
        token)
        .then(() => { if (Object.keys(contact).length === 0) reset(); }));
  };

  const focus = (ref, fieldName) => {
    fieldName ? ref.current[fieldName].focus() : ref.current.focus();
  }

  const reset = () => {
    setMainField(getMainValue(fieldDefs, contact));
    setOtherFields(
      fieldDefs.otherFields
        .reduce((acc, curr) => {
          acc[curr.name] = getFieldValue(contact, curr.name);
          return acc;
        }, {}));
  }

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmailAddress('');
    setInviteValidated(false);
  }

  const handleShowInviteModal = () => setShowInviteModal(true);

  const handleInviteEmailAddressChange = (event) => {
    setInviteEmailAddress(event.target.value);
  }

  const handleInviteSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      getAccessTokenSilently()
        .then(token => inviteFunc(contact._id, inviteEmailAddress, token))
        .then(() => {
          setInviteEmailAddress('');
        });
    }
    setInviteValidated(!form.checkValidity());
  };

  return (
    <>
      <Card className="mb-3" style={{ width: width || '100%', maxWidth: '25rem' }} bg="dark" text="light">
        <Card.Img id={"img-" + getIdValue(fieldDefs, contact)} variant="top" src="holder.js/100px200/auto" />
        <Card.Header className="font-weight-bold">
          <Row key={0} className="align-items-center">
            <Col className="flex-grow-1 pr-0">
              {
                editable ?
                  <h3><input
                    style={{ fontSize: 'inherit' }}
                    className="form-control editable cursor-pointer"
                    ref={mainRef}
                    value={mainField}
                    tabIndex="1"
                    onChange={(event) => handleChange(event, setMainField)} /></h3> :
                  <div>{mainField}</div>
              }
            </Col>
            {editable && <Col className="col-auto pl-1">
              <div className="cursor-pointer" onClick={() => focus(mainRef)}>
                <Icon>edit</Icon>
              </div>
            </Col>}
          </Row>
        </Card.Header>
        <Card.Body>
          {
            fieldDefs.otherFields.map((field, idx) => {
              return <Row key={idx} className={"align-items-center" + ((idx < fieldDefs.otherFields.length - 1) ? " mb-2" : "")}>
                <Col className="col-auto">
                  <span className="font-weight-bold">{field.displayName + ':'}</span>
                </Col>
                <Col className="flex-grow-1 pl-0 pr-0">
                  {
                    editable ?
                      <input
                        className="form-control editable cursor-pointer"
                        ref={element => otherRefs.current[field.name] = element}
                        value={otherFields[field.name]}
                        tabIndex={idx + 2}
                        onChange={(event) => handleChange(event, (value) => setOtherFields(Object.assign({}, otherFields, { [field.name]: value })))} /> :
                      <div>{otherFields[field.name]}</div>}
                </Col>
                {editable && <Col className="col-auto pl-1">
                  <div className="cursor-pointer" onClick={() => focus(otherRefs, field.name)}>
                    <Icon>edit</Icon>
                  </div>
                </Col>}
              </Row>
            })
          }
        </Card.Body>
        {editable && <Card.Body className="pt-0">
          <Row>
            <Col className="col-6">
              {modified && !isSaving ?
                <Button className="w-100" variant="danger" onClick={reset}>Cancel</Button> :
                <Button className="w-100" variant="outline-danger" disabled>Cancel</Button>}
            </Col>
            <Col className="col-6">
              {modified && !isSaving ?
                <Button className="w-100" variant="success" onClick={save}>Save</Button> :
                <Button className="w-100" variant="outline-success" disabled>Save</Button>}
            </Col>
          </Row>
          {isSaving && <Row className="mt-3">
            <Col>
              <LinearProgress className="w-100" />
            </Col>
          </Row>}
        </Card.Body>}
        {!contact.idpSubject && isAdmin && <Card.Body className="pt-0 pb-1">
          <Row className="justify-content-end">
            <div className="cursor-pointer d-flex align-items-center">
              <OverlayTrigger placement="top" transition={false} overlay={<Tooltip>Invite user</Tooltip>}>
                {({ ref, ...triggerHandler }) => (
                  <Icon ref={ref} onClick={handleShowInviteModal} {...triggerHandler}>person_add</Icon>
                )}
              </OverlayTrigger>
            </div>
          </Row>
        </Card.Body>}
      </Card>

      <Modal show={showInviteModal} onHide={handleCloseInviteModal} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">{'Invite ' + mainField}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={inviteValidated} onSubmit={handleInviteSubmit}>
            <Form.Row className="justify-content-center">
              <Form.Group className="mx-2" style={{ width: '60%' }}>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={inviteEmailAddress}
                  onChange={handleInviteEmailAddressChange}
                  required />
                <Form.Control.Feedback className="text-center" type="invalid">
                  Please enter a valid email address
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                {!isInviting && inviteEmailAddress.trim().length > 0 ?
                  <Button type="submit" variant="success">Invite</Button> :
                  <Button type="submit" variant="outline-success" disabled>Invite</Button>}
              </Form.Group>
            </Form.Row>
            {isInviting && <Form.Row className="mt-3">
              <LinearProgress className="w-100" />
            </Form.Row>}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ContactCard;
