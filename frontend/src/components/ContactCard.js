import { useAuth0 } from '@auth0/auth0-react';
import { Icon, LinearProgress } from '@material-ui/core';
import Holder from 'holderjs';
import React, { Fragment, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { LinkContainer } from 'react-router-bootstrap';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { ADMIN_EDIT_CONTACT_PATH } from '../OnlineDirectoryApp';
import '../styles/contact-card.css';

const ContactCard = ({
  width,
  editable = false,
  fieldDefinitions,
  contact = {},
  isSaving = false,
  isInviting = false,
  isAdmin = false,
  saveFunc,
  inviteFunc,
  redirectAfterSave
}) => {
  const getIdValue = (fieldDefinitions, contact) => {
    return getFieldValue(contact, fieldDefinitions.idField.propName, 'no-id');
  }

  const getPictureValue = (fieldDefinitions, contact) => {
    return getFieldValue(
      contact,
      fieldDefinitions.pictureField.propName,
      { link: 'holder.js/200x200?auto=yes&text=No Image' });
  }

  const getMainValue = (fieldDefinitions, contact) => {
    return getFieldValue(contact, fieldDefinitions.mainField.propName);
  }

  const getFieldValue = (contact, fieldName, defaultValue = '') => {
    return emptyIfNull(contact, fieldName, defaultValue);
  }

  const emptyIfNull = (contact, fieldName, defaultValue) => {
    return contact[fieldName] ? contact[fieldName] : defaultValue;
  }

  const { getAccessTokenSilently } = useAuth0();
  const [pictureField, setPictureField] = useState(getPictureValue(fieldDefinitions, contact));
  const [mainField, setMainField] = useState(getMainValue(fieldDefinitions, contact));
  const [otherFields, setOtherFields] = useState(
    fieldDefinitions.otherFields
      .reduce((acc, curr) => {
        acc[curr.propName] = getFieldValue(contact, curr.propName);
        return acc;
      }, {}));
  const [modified, setModified] = useState(false);
  const [saveValidated, setSaveValidated] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmailAddress, setInviteEmailAddress] = useState('');
  const [inviteValidated, setInviteValidated] = useState(false);

  const mainRef = useRef();
  const otherRefs = useRef({});

  const isModified = () => {
    return getPictureValue(fieldDefinitions, contact).link !== pictureField.link
      || getMainValue(fieldDefinitions, contact) !== mainField
      || fieldDefinitions.otherFields.some(field => getFieldValue(contact, field.propName) !== otherFields[field.propName]);
  }

  const isPicturePlaceholder = (pictureField) => {
    return pictureField.link.startsWith('holder.js');
  }

  useDeepCompareEffect(() => {
    reset();
  }, [contact]);

  useDeepCompareEffect(() => {
    if (isPicturePlaceholder(pictureField)) {
      Holder.run({
        images: '#img-' + getIdValue(fieldDefinitions, contact)
      });
    }
    setModified(isModified());
  }, [pictureField]);

  useDeepCompareEffect(() => {
    setModified(isModified());
  }, [pictureField, mainField, otherFields]);

  const handlePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPictureField({ link: URL.createObjectURL(event.target.files[0]) });
    }
  }

  const handleClearPicture = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPictureField(getPictureValue(fieldDefinitions, {}));
  }

  const handleChange = (event, setFunc, maxLength) => {
    setFunc(event.target.value?.substring(0, maxLength));
  };

  const saveContact = (event) => {
    const saveForm = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (saveForm.checkValidity()) {
      const localPictureFormField = saveForm.elements[0];
      if (localPictureFormField.files && localPictureFormField.files[0]) {
        saveWithPicture(localPictureFormField.files[0]);
      } else {
        saveWithPicture(isPicturePlaceholder(pictureField) ? null : undefined);
      }
    }
    setSaveValidated(!saveForm.checkValidity());
  };

  const saveWithPicture = (pictureFile) => {
    getAccessTokenSilently()
      .then(token => saveFunc(
        fieldDefinitions,
        Object.assign(
          {},
          contact,
          { [fieldDefinitions.mainField.propName]: mainField },
          fieldDefinitions.otherFields
            .reduce((acc, curr) => {
              if (otherFields[curr.propName]
                || otherFields[curr.propName] === '') acc[curr.propName] = otherFields[curr.propName];
              return acc;
            }, {})),
        pictureFile,
        token)
        .then((savedContact) => {
          if (Object.keys(contact).length === 0) reset();
          return savedContact;
        })
        .then((savedContact) => {
          if (redirectAfterSave) {
            redirectAfterSave(savedContact);
          }
        }));
  }

  const focus = (ref, fieldName) => {
    fieldName ? ref.current[fieldName].focus() : ref.current.focus();
  }

  const reset = () => {
    setPictureField(getPictureValue(fieldDefinitions, contact));
    setMainField(getMainValue(fieldDefinitions, contact));
    setOtherFields(
      fieldDefinitions.otherFields
        .reduce((acc, curr) => {
          acc[curr.propName] = getFieldValue(contact, curr.propName);
          return acc;
        }, {}));
    setSaveValidated(false);
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
    const inviteForm = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (inviteForm.checkValidity()) {
      getAccessTokenSilently()
        .then(token => inviteFunc(fieldDefinitions, contact, inviteEmailAddress, token))
        .then(() => {
          setInviteEmailAddress('');
        });
    }
    setInviteValidated(!inviteForm.checkValidity());
  };

  return (
    <Fragment>
      <Card className="m-auto" style={{ width: width, maxWidth: '25rem' }} bg="dark" text="light">
        <Form noValidate validated={saveValidated} onSubmit={saveContact}>
          <Form.Group className="position-relative mb-0">
            <Form.Label className="w-100 mb-0" htmlFor={"profile-picture-upload-" + getIdValue(fieldDefinitions, contact)}>
              <Card.Img
                className={(isPicturePlaceholder(pictureField) ? "" : "h-auto") + (editable ? " cursor-pointer" : "")}
                id={"img-" + getIdValue(fieldDefinitions, contact)}
                variant="top"
                src={pictureField.link}
                data-src={pictureField.link}
                data-holder-rendered={isPicturePlaceholder(pictureField) ? "true" : "false"} />
            </Form.Label>
            <Form.Control
              className="d-none"
              id={"profile-picture-upload-" + getIdValue(fieldDefinitions, contact)}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handlePictureChange}
              disabled={!editable} />
            {editable && !isPicturePlaceholder(pictureField) &&
              <Button
                variant="outline-dark"
                style={{ top: 0, right: 0, backgroundColor: 'white', width: 30, height: 30, fontSize: 30 }}
                className="align-items-center close position-absolute"
                onClick={handleClearPicture}>
                <Icon>clear</Icon>
              </Button>}
          </Form.Group>
          <Card.Header className="font-weight-bold">
            <Row>
              <Form.Group as={Col} className="mb-0">
                <h3 className="mb-0 text-center">
                  {editable ?
                    <Fragment>
                      <Form.Control
                        style={{ fontSize: 'inherit' }}
                        className="editable cursor-pointer text-center"
                        ref={mainRef}
                        value={mainField}
                        tabIndex="1"
                        placeholder={fieldDefinitions.mainField.displayName}
                        onChange={(event) => handleChange(event, setMainField, fieldDefinitions.mainField.validation.maxLength)}
                        isInvalid={mainField ? !new RegExp(fieldDefinitions.mainField.validation.regex).test(mainField) : false}
                        required />
                      <Form.Control.Feedback className="text-center" type="invalid">
                        {fieldDefinitions.mainField.validation.errorMessage}
                      </Form.Control.Feedback>
                    </Fragment> :
                    <div>{mainField}</div>}
                </h3>
              </Form.Group>
              {editable && <Col className="align-self-center col-auto pl-0">
                <div className="cursor-pointer" onClick={() => focus(mainRef)}>
                  <Icon>edit</Icon>
                </div>
              </Col>}
            </Row>
          </Card.Header>
          <Card.Body className="pt-2 pb-3">
            {
              fieldDefinitions.otherFields.map((field, idx) => {
                const regex = field.validation.regex;
                const value = otherFields[field.propName]?.substring(0, field.validation.maxLength);
                return (
                  <Container key={"field- " + (idx + 1)} className="px-0" fluid>
                    <Row>
                      <Form.Group
                        as={Col}
                        className="d-flex align-items-center mb-2 pb-2"
                        style={{ flexDirection: 'column' }}>
                        <Row className="justify-content-center w-100">
                          <span className="font-weight-bold">{field.displayName}</span>
                        </Row>
                        <Row className="justify-content-center w-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                          {editable ?
                            <Form.Control
                              as={field.type === "Address" ? "textarea" : "input"}
                              className="editable cursor-pointer text-center"
                              ref={element => otherRefs.current[field.propName] = element}
                              value={otherFields[field.propName]?.substring(0, field.validation.maxLength)}
                              tabIndex={idx + 2}
                              onChange={(event) =>
                                handleChange(
                                  event,
                                  (value) => setOtherFields(Object.assign({}, otherFields, { [field.propName]: value })),
                                  field.validation.maxLength)}
                              isInvalid={value ? !new RegExp(regex).test(value) : false} /> :
                            <div className="text-center" style={{ whiteSpace: 'pre-wrap' }}>
                              {value ? value : '-'}</div>}
                          <Form.Control.Feedback className="text-center" type="invalid">
                            {field.validation.errorMessage}
                          </Form.Control.Feedback>
                        </Row>
                      </Form.Group>
                      {editable && <Col className="d-flex align-self-stretch col-auto mb-2 pl-0">
                        <div className="align-self-center cursor-pointer" onClick={() => focus(otherRefs, field.propName)}>
                          <Icon>edit</Icon>
                        </div>
                      </Col>}
                    </Row>
                  </Container>
                );
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
                  <Button className="w-100" type="submit" variant="success">Save</Button> :
                  <Button className="w-100" variant="outline-success" disabled>Save</Button>}
              </Col>
            </Row>
            {isSaving && <Row className="mt-3">
              <Col>
                <LinearProgress className="w-100" />
              </Col>
            </Row>}
          </Card.Body>}
          {isAdmin && <Card.Body className="pt-0 pb-1">
            <Row>
              {!contact.idpSubject && <div className="cursor-pointer d-flex align-items-center">
                <OverlayTrigger placement="top" transition={false} overlay={<Tooltip>Invite contact</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <Icon ref={ref} onClick={handleShowInviteModal} {...triggerHandler}>person_add</Icon>
                  )}
                </OverlayTrigger>
              </div>}
              <div className="d-flex flex-grow-1" />
              {!editable && contact[fieldDefinitions.idField.propName] && <div className="cursor-pointer d-flex align-items-center">
                <OverlayTrigger placement="top" transition={false} overlay={<Tooltip>Edit contact</Tooltip>}>
                  {({ ref, ...triggerHandler }) => (
                    <LinkContainer to={`${ADMIN_EDIT_CONTACT_PATH}?id=${contact[fieldDefinitions.idField.propName]}`}>
                      <Icon ref={ref} {...triggerHandler}>edit</Icon>
                    </LinkContainer>
                  )}
                </OverlayTrigger>
              </div>}
            </Row>
          </Card.Body>}
        </Form>
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
    </Fragment>
  );
}

export default ContactCard;
