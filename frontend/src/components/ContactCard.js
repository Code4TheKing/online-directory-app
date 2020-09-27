/** @format */

import { useAuth0 } from '@auth0/auth0-react';
import { Icon, LinearProgress } from '@material-ui/core';
import equals from 'deep-equal';
import Holder from 'holderjs';
import React, { Fragment, useContext, useRef, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
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
  const { getAccessTokenSilently } = useAuth0();
  const [pictureField, setPictureField] = useState(_getPictureValue(fieldDefinitions, contact, editable));
  const [mainField, setMainField] = useState(_getMainValue(fieldDefinitions, contact));
  const [otherFields, setOtherFields] = useState(_computeOtherFields(fieldDefinitions, contact));
  const [modified, setModified] = useState(false);
  const [saveValidated, setSaveValidated] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmailAddress, setInviteEmailAddress] = useState('');
  const [inviteValidated, setInviteValidated] = useState(false);

  const mainRef = useRef();
  const otherRefs = useRef({});

  const isModified = () => {
    const pictureModified = _getPictureValue(fieldDefinitions, contact, editable).link !== pictureField.link;
    const mainModified = _getMainValue(fieldDefinitions, contact) !== mainField;
    const othersModified = fieldDefinitions.otherFields.some((otherField) => {
      const otherFieldValue = otherFields[otherField.propName];
      const fieldValue = _getFieldValue(contact, otherField.propName);
      if (otherFieldValue) {
        switch (otherField.type) {
          case 'ObjectList':
            return (
              otherFieldValue.length !== fieldValue.length ||
              otherFieldValue.some((item, idx) => !equals(item, fieldValue[idx]))
            );
          case 'StringList':
            return otherFieldValue.some((item, idx) => !equals(item, fieldValue[idx]));
          default:
            return !equals(fieldValue, otherFieldValue);
        }
      }
      return !equals(fieldValue, otherFieldValue);
    });
    return pictureModified || mainModified || othersModified;
  };

  const isPicturePlaceholder = (pictureField) => {
    return pictureField.link.startsWith('holder.js');
  };

  useDeepCompareEffect(() => {
    reset();
    setModified(isModified());
  }, [contact]);

  useDeepCompareEffect(() => {
    if (isPicturePlaceholder(pictureField)) {
      Holder.run({
        images: '#img-' + _getIdValue(fieldDefinitions, contact)
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
  };

  const handleClearPicture = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPictureField(_getPictureValue(fieldDefinitions, {}, editable));
  };

  const getFieldValueForType = (value, type, maxLength) => {
    if (!value) {
      return value;
    }
    switch (type) {
      case 'PhoneNumber':
        const digits = value.replace(/\D/g, '');
        const areaCode = digits.slice(0, 3);
        const next3 = digits.slice(3, 6);
        const last4 = digits.slice(6, 10);

        let fieldValue = '';
        if (digits.length >= 4) {
          fieldValue += `(${areaCode})`;
          if (next3.length > 0) {
            fieldValue += ` ${next3}`;
          }
          if (last4.length > 0) {
            fieldValue += `-${last4}`;
          }
          return fieldValue;
        } else {
          return value;
        }
      default:
        return value.substring(0, maxLength);
    }
  };

  const handleChange = (event, setFunc, type, maxLength) => {
    setFunc(getFieldValueForType(event.target.value, type, maxLength));
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
    getAccessTokenSilently().then((token) =>
      saveFunc(
        fieldDefinitions,
        Object.assign(
          {},
          contact,
          { [fieldDefinitions.mainField.propName]: mainField },
          fieldDefinitions.otherFields.reduce((acc, curr) => {
            if (otherFields[curr.propName] || otherFields[curr.propName] === '')
              acc[curr.propName] = otherFields[curr.propName];
            return acc;
          }, {})
        ),
        pictureFile,
        token
      )
        .then((savedContact) => {
          if (Object.keys(contact).length === 0) reset();
          return savedContact;
        })
        .then((savedContact) => {
          if (savedContact && redirectAfterSave) {
            redirectAfterSave(savedContact);
          }
        })
    );
  };

  const reset = () => {
    setPictureField(_getPictureValue(fieldDefinitions, contact, editable));
    setMainField(_getMainValue(fieldDefinitions, contact));
    setOtherFields(_computeOtherFields(fieldDefinitions, contact));
    setSaveValidated(false);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setInviteEmailAddress('');
    setInviteValidated(false);
  };

  const handleShowInviteModal = () => setShowInviteModal(true);

  const handleInviteEmailAddressChange = (event) => {
    setInviteEmailAddress(event.target.value);
  };

  const handleInviteSubmit = (event) => {
    const inviteForm = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (inviteForm.checkValidity()) {
      getAccessTokenSilently()
        .then((token) => inviteFunc(fieldDefinitions, contact, inviteEmailAddress, token))
        .then(() => {
          setInviteEmailAddress('');
        });
    }
    setInviteValidated(!inviteForm.checkValidity());
  };

  let tabIndex = 1;
  return (
    <Fragment>
      <Card className='h-100 m-auto' style={{ width: width, maxWidth: '25rem' }} bg='info' text='light' border='dark'>
        <Form
          className='d-flex h-100'
          style={{ flexDirection: 'column' }}
          noValidate
          validated={saveValidated}
          onSubmit={saveContact}>
          {/* Image */}
          <Form.Group className='d-flex h-auto position-relative mb-0' style={{ flexDirection: 'column' }}>
            <Form.Label
              className='w-100 mb-0'
              htmlFor={'profile-picture-upload-' + _getIdValue(fieldDefinitions, contact)}>
              <Card.Img
                className={editable ? ' cursor-pointer' : ''}
                id={'img-' + _getIdValue(fieldDefinitions, contact)}
                variant='top'
                src={pictureField.link}
                data-src={pictureField.link}
                data-holder-rendered={isPicturePlaceholder(pictureField) ? 'true' : 'false'}
              />
            </Form.Label>
            <Form.Control
              className='d-none'
              id={'profile-picture-upload-' + _getIdValue(fieldDefinitions, contact)}
              type='file'
              accept='image/png, image/jpeg'
              onChange={handlePictureChange}
              disabled={!editable}
            />
            {editable && !isPicturePlaceholder(pictureField) && (
              <Button
                variant='outline-dark'
                style={{ top: 0, right: 0, backgroundColor: 'white', width: 30, height: 30, fontSize: 30 }}
                className='align-items-center close position-absolute'
                onClick={handleClearPicture}>
                <Icon>clear</Icon>
              </Button>
            )}
          </Form.Group>
          {/* Main field */}
          <Card.Header className='d-flex h-auto font-weight-bold' style={{ flexDirection: 'column' }}>
            <Row>
              <Form.Group as={Col} className='mb-0'>
                <h3 className='text-center mb-0'>
                  {editable ? (
                    <Fragment>
                      <Form.Control
                        style={{ fontSize: 'inherit' }}
                        className='editable cursor-pointer text-center px-2'
                        ref={mainRef}
                        value={mainField}
                        tabIndex={tabIndex}
                        placeholder={fieldDefinitions.mainField.displayName}
                        onChange={(event) =>
                          handleChange(
                            event,
                            setMainField,
                            fieldDefinitions.mainField.type,
                            fieldDefinitions.mainField.validation.maxLength
                          )
                        }
                        isInvalid={
                          mainField ? !new RegExp(fieldDefinitions.mainField.validation.regex).test(mainField) : false
                        }
                        required={!!fieldDefinitions.mainField.validation.required}
                      />
                      <Form.Control.Feedback className='text-center font-weight-bold' type='invalid'>
                        {fieldDefinitions.mainField.validation.errorMessage}
                      </Form.Control.Feedback>
                    </Fragment>
                  ) : (
                    <div>{mainField}</div>
                  )}
                </h3>
              </Form.Group>
            </Row>
          </Card.Header>
          {/* Other fields */}
          <Card.Body className='d-flex flex-grow-1 pt-2 pb-3' style={{ flexDirection: 'column' }}>
            {fieldDefinitions.otherFields.map((otherFieldDef, idx) => {
              const renderField = (otherFieldDef) => {
                const fieldType = otherFieldDef.type;
                if (fieldType === 'ObjectList') {
                  const objectListInnerFields = otherFieldDef.innerFields;
                  const objectList = otherFields[otherFieldDef.propName];
                  return (
                    <Fragment>
                      {objectList.map((objectListItem, objectListIdx) => {
                        return (
                          <Accordion className='w-100' key={`${otherFieldDef.propName}-${tabIndex}`}>
                            <ContextAwareToggle
                              eventKey={tabIndex}
                              deletable={editable}
                              deleteCallback={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                const modifiedObjectList = JSON.parse(JSON.stringify(objectList));
                                modifiedObjectList.splice(objectListIdx, 1);
                                setOtherFields(
                                  Object.assign({}, otherFields, {
                                    [otherFieldDef.propName]: modifiedObjectList
                                  })
                                );
                              }}>
                              <span>
                                {objectListItem[otherFieldDef.mainInnerField]
                                  ? objectListItem[otherFieldDef.mainInnerField]
                                  : '-'}
                              </span>
                            </ContextAwareToggle>
                            <Accordion.Collapse eventKey={tabIndex}>
                              <Row className='mb-3 mx-0 w-100 border border-light' style={{ flexDirection: 'column' }}>
                                {Object.entries(objectListInnerFields).map(([innerFieldKey, innerFieldDef]) => {
                                  const innerFieldType = innerFieldDef.type;
                                  const innerFieldValue = getFieldValueForType(
                                    objectListItem[innerFieldKey],
                                    innerFieldType,
                                    innerFieldDef.validation.maxLength
                                  );
                                  return renderInput(
                                    editable,
                                    true, // renderNonEditable
                                    true, // renderHeader
                                    innerFieldType,
                                    innerFieldKey,
                                    innerFieldValue,
                                    innerFieldDef,
                                    _getListRefFunc(otherRefs, otherFieldDef, objectListIdx),
                                    (value) => {
                                      const modifiedObjectList = JSON.parse(JSON.stringify(objectList));
                                      modifiedObjectList[objectListIdx][innerFieldKey] = value;
                                      setOtherFields(
                                        Object.assign({}, otherFields, {
                                          [otherFieldDef.propName]: modifiedObjectList
                                        })
                                      );
                                    },
                                    otherFieldDef.mainInnerField
                                  );
                                })}
                              </Row>
                            </Accordion.Collapse>
                          </Accordion>
                        );
                      })}
                      {!editable && objectList.length === 0 && (
                        <div className='text-center' style={{ whiteSpace: 'pre-wrap' }}>
                          {'-'}
                        </div>
                      )}
                      {editable && (
                        <Button
                          className='w-100 mt-2'
                          variant='primary'
                          onClick={() => {
                            const modifiedObjectList = JSON.parse(JSON.stringify(objectList));
                            modifiedObjectList.push(_generateEmptyObjectListItem(objectListInnerFields));
                            setOtherFields(
                              Object.assign({}, otherFields, {
                                [otherFieldDef.propName]: modifiedObjectList
                              })
                            );
                          }}>
                          Add
                        </Button>
                      )}
                    </Fragment>
                  );
                } else if (fieldType === 'StringList') {
                  const stringList = otherFields[otherFieldDef.propName];
                  return (
                    <Fragment>
                      {stringList.map((stringListItem, stringListIdx) => {
                        const fieldValue = getFieldValueForType(
                          stringListItem,
                          fieldType,
                          otherFieldDef.validation.maxLength
                        );
                        return renderInput(
                          editable,
                          false, // renderNonEditable
                          false, // renderHeader
                          fieldType,
                          otherFieldDef.propName,
                          fieldValue,
                          otherFieldDef,
                          _getListRefFunc(otherRefs, otherFieldDef, stringListIdx),
                          (value) => {
                            const modifiedStringList = JSON.parse(JSON.stringify(stringList));
                            modifiedStringList[stringListIdx] = value;
                            setOtherFields(
                              Object.assign({}, otherFields, {
                                [otherFieldDef.propName]: modifiedStringList
                              })
                            );
                          }
                        );
                      })}
                      {!editable && stringList.length === 0 && (
                        <div className='text-center' style={{ whiteSpace: 'pre-wrap' }}>
                          {'-'}
                        </div>
                      )}
                      {!editable && stringList.length > 0 && (
                        <div className='text-center' style={{ whiteSpace: 'pre-wrap' }}>
                          {stringList.length === 1 && `${stringList[0]}`}
                          {stringList.length === 2 && `${stringList[0]} and ${stringList[1]}`}
                          {stringList.length > 2 &&
                            stringList.slice(0, -1).join(', ') + ', and ' + stringList.slice(-1)}
                        </div>
                      )}
                      {editable && (
                        <Button
                          className='w-100 mt-2'
                          variant='primary'
                          onClick={() => {
                            const modifiedStringList = JSON.parse(JSON.stringify(stringList));
                            modifiedStringList.push('');
                            setOtherFields(
                              Object.assign({}, otherFields, {
                                [otherFieldDef.propName]: modifiedStringList
                              })
                            );
                          }}>
                          Add
                        </Button>
                      )}
                    </Fragment>
                  );
                } else {
                  const fieldValue = getFieldValueForType(
                    otherFields[otherFieldDef.propName],
                    fieldType,
                    otherFieldDef.validation.maxLength
                  );
                  return renderInput(
                    editable,
                    true, // renderNonEditable
                    false, // renderHeader
                    fieldType,
                    otherFieldDef.propName,
                    fieldValue,
                    otherFieldDef,
                    (element) => (otherRefs.current[otherFieldDef.propName] = element),
                    (value) => setOtherFields(Object.assign({}, otherFields, { [otherFieldDef.propName]: value }))
                  );
                }
              };
              const renderInput = (
                editable,
                renderNonEditable,
                renderHeader,
                fieldType,
                fieldKey,
                fieldValue,
                fieldDef,
                refFunc,
                setFunc,
                skipKey
              ) => {
                const key = ++tabIndex;
                if (editable) {
                  return (
                    <Form.Group className='w-100 mb-0' key={'input-' + key}>
                      {renderHeader && <div className='text-center w-100'>{fieldDef.displayName}</div>}
                      <Form.Control
                        as={fieldType === 'TextArea' ? 'textarea' : 'input'}
                        className='editable cursor-pointer text-center m-auto px-2'
                        style={{ maxWidth: '95%' }}
                        ref={refFunc}
                        value={fieldValue}
                        tabIndex={key}
                        onChange={(event) => handleChange(event, setFunc, fieldType, fieldDef.validation.maxLength)}
                        pattern={fieldDef.validation.regex}
                        isInvalid={
                          fieldType === 'TextArea' && fieldValue
                            ? !new RegExp(fieldDef.validation.regex).test(fieldValue)
                            : false
                        }
                        required={!!fieldDef.validation.required}
                      />
                      <Form.Control.Feedback className='text-center font-weight-bold' type='invalid'>
                        {fieldDef.validation.errorMessage}
                      </Form.Control.Feedback>
                    </Form.Group>
                  );
                } else if (renderNonEditable) {
                  return (
                    <Fragment key={'value-' + key}>
                      {(!skipKey || (skipKey !== fieldKey && fieldValue)) && (
                        <div className='text-center' style={{ whiteSpace: 'pre-wrap' }}>
                          {fieldValue ? fieldValue : '-'}
                        </div>
                      )}
                    </Fragment>
                  );
                }
              };

              return (
                <Container key={'field- ' + (idx + 1)} className='px-0' fluid>
                  <Row>
                    <Form.Group
                      as={Col}
                      className='d-flex align-items-center mb-2 pb-2'
                      style={{ flexDirection: 'column' }}>
                      <Row className='justify-content-center w-100'>
                        <span className='font-weight-bold'>{otherFieldDef.displayName}</span>
                      </Row>
                      <Row
                        className='align-items-center w-100'
                        style={{
                          backgroundColor: editable ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                          flexDirection: 'column'
                        }}>
                        {renderField(otherFieldDef)}
                      </Row>
                    </Form.Group>
                  </Row>
                </Container>
              );
            })}
          </Card.Body>
          {/* Cancel/Save buttons */}
          {editable && (
            <Card.Body className='pt-0'>
              <Row>
                <Col className='col-6'>
                  {modified && !isSaving ? (
                    <Button className='w-100' variant='danger' onClick={reset}>
                      Cancel
                    </Button>
                  ) : (
                    <Button className='w-100' variant='danger' disabled>
                      Cancel
                    </Button>
                  )}
                </Col>
                <Col className='col-6'>
                  {modified && !isSaving ? (
                    <Button className='w-100' type='submit' variant='success'>
                      Save
                    </Button>
                  ) : (
                    <Button className='w-100' variant='success' disabled>
                      Save
                    </Button>
                  )}
                </Col>
              </Row>
              {isSaving && (
                <Row className='mt-3'>
                  <Col>
                    <LinearProgress className='w-100' />
                  </Col>
                </Row>
              )}
            </Card.Body>
          )}
          {/* Invite/Edit icons */}
          {isAdmin && (
            <Card.Body
              className='d-flex justify-content-end align-items-center h-auto px-2 py-0'
              style={{ flexDirection: 'column' }}>
              <Row className='justify-content-between w-100'>
                {!contact.idpSubject && (
                  <div className='cursor-pointer'>
                    <OverlayTrigger placement='top' transition={false} overlay={<Tooltip>Invite contact</Tooltip>}>
                      {({ ref, ...triggerHandler }) => (
                        <Icon ref={ref} onClick={handleShowInviteModal} {...triggerHandler}>
                          person_add
                        </Icon>
                      )}
                    </OverlayTrigger>
                  </div>
                )}
                <div className='flex-grow-1' />
                {!editable && contact[fieldDefinitions.idField.propName] && (
                  <div className='cursor-pointer'>
                    <OverlayTrigger placement='top' transition={false} overlay={<Tooltip>Edit contact</Tooltip>}>
                      {({ ref, ...triggerHandler }) => (
                        <LinkContainer
                          to={`${ADMIN_EDIT_CONTACT_PATH}?id=${contact[fieldDefinitions.idField.propName]}`}>
                          <Icon ref={ref} {...triggerHandler}>
                            edit
                          </Icon>
                        </LinkContainer>
                      )}
                    </OverlayTrigger>
                  </div>
                )}
              </Row>
            </Card.Body>
          )}
        </Form>
      </Card>

      {/* Invite modal */}
      <Modal show={showInviteModal} onHide={handleCloseInviteModal} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className='w-100'>{'Invite ' + mainField}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={inviteValidated} onSubmit={handleInviteSubmit}>
            <Form.Row className='justify-content-center'>
              <Form.Group className='mx-2' style={{ width: '60%' }}>
                <Form.Control
                  type='email'
                  placeholder='Email address'
                  value={inviteEmailAddress}
                  onChange={handleInviteEmailAddressChange}
                  required
                />
                <Form.Control.Feedback className='text-center font-weight-bold' type='invalid'>
                  Please enter a valid email address
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                {!isInviting && inviteEmailAddress.trim().length > 0 ? (
                  <Button type='submit' variant='success'>
                    Invite
                  </Button>
                ) : (
                  <Button type='submit' variant='outline-success' disabled>
                    Invite
                  </Button>
                )}
              </Form.Group>
            </Form.Row>
            {isInviting && (
              <Form.Row className='mt-3'>
                <LinearProgress className='w-100' />
              </Form.Row>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

const _getIdValue = (fieldDefinitions, contact) => {
  return _getFieldValue(contact, fieldDefinitions.idField.propName, 'no-id');
};

const _getPictureValue = (fieldDefinitions, contact, editable) => {
  const text = editable ? 'Select image' : 'No image';
  return _getFieldValue(contact, fieldDefinitions.pictureField.propName, {
    link: `holder.js/200x150?auto=yes&text=${text}`
  });
};

const _getMainValue = (fieldDefinitions, contact) => {
  return _getFieldValue(contact, fieldDefinitions.mainField.propName);
};

const _getFieldValue = (contact, fieldName, defaultValue = '') => {
  return _emptyIfNull(contact, fieldName, defaultValue);
};

const _emptyIfNull = (contact, fieldName, defaultValue) => {
  return contact[fieldName] ? contact[fieldName] : defaultValue;
};

const _computeOtherFields = (fieldDefinitions, contact) => {
  return fieldDefinitions.otherFields.reduce((acc, currField) => {
    const fieldValue = _getFieldValue(contact, currField.propName);
    switch (currField.type) {
      case 'ObjectList':
      case 'StringList':
        acc[currField.propName] = fieldValue ? fieldValue : [];
        break;
      default:
        acc[currField.propName] = fieldValue;
    }
    return acc;
  }, {});
};

const _getListRefFunc = (otherRefs, otherFieldDef, listIdx) => {
  return (element) => {
    if (!otherRefs.current[otherFieldDef.propName]) {
      otherRefs.current[otherFieldDef.propName] = [];
    }
    const listRefs = otherRefs.current[otherFieldDef.propName];
    if (!listRefs[listIdx]) {
      listRefs.push(element);
    } else {
      listRefs[listIdx] = element;
    }
  };
};

const _generateEmptyObjectListItem = (innerFields) => {
  return Object.keys(innerFields).reduce((acc, currKey) => {
    acc[currKey] = '';
    return acc;
  }, {});
};

function ContextAwareToggle({ children, eventKey, deletable, deleteCallback, callback }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card.Header
      className={'d-flex justify-content-center w-100 text-center btn btn-info btn-outline-light'}
      onClick={decoratedOnClick}>
      {children}
      {isCurrentEventKey ? (
        <Icon className='position-absolute' style={{ left: 30 }}>
          keyboard_arrow_up
        </Icon>
      ) : (
        <Icon className='position-absolute' style={{ left: 30 }}>
          keyboard_arrow_down
        </Icon>
      )}
      {deletable && (
        <Icon className='position-absolute' style={{ right: 30 }} onClick={deleteCallback}>
          delete
        </Icon>
      )}
    </Card.Header>
  );
}

export default ContactCard;
