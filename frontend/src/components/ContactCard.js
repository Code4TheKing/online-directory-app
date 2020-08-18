import { LinearProgress } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import 'holderjs';
import Holder from 'holderjs';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useDeepCompareEffect from 'use-deep-compare-effect';
import '../styles/contact-card.css';
import ContentEditable from '../utils/ContentEditable';

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
      },
      {
        name: "birthday",
        displayName: "Birthday"
      }
    ]
  },
  contact = {},
  isProcessing = false,
  saveFunc
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

  const [mainField, setMainField] = useState(getMainValue(fieldDefs, contact));
  const [otherFields, setOtherFields] = useState(
    fieldDefs.otherFields
      .reduce((acc, curr) => {
        acc[curr.name] = getFieldValue(contact, curr.name);
        return acc;
      }, {}));
  const [modified, setModified] = useState(false);

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
    saveFunc(
      Object.assign(
        {},
        contact,
        { [fieldDefs.mainField.name]: mainField },
        fieldDefs.otherFields
          .reduce((acc, curr) => {
            acc[curr.name] = otherFields[curr.name];
            return acc;
          }, {})))
      .then(() => { if (Object.keys(contact).length === 0) reset(); });
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

  return (
    <Card className="d-flex" style={{ width: width || '100%', maxWidth: '25rem', maxHeight: '100%' }} bg="dark" text="light">
      <Card.Img id={"img-" + getIdValue(fieldDefs, contact)} variant="top" src="holder.js/100px200/auto" />
      <Card.Header className="font-weight-bold">
        <Row key={0} className="align-items-center">
          <Col className="w-100 pr-0">
            <ContentEditable
              tabIndex="0"
              innerRef={mainRef}
              html={mainField}
              disabled={!editable}
              onChange={(event) => handleChange(event, setMainField)}
              className={(editable ? " editable cursor-pointer" : "")}
              tagName="h2" />
          </Col>
          {editable && <Col className="col-auto pl-1">
            <div className="cursor-pointer" onClick={() => focus(mainRef)}><Icon>edit</Icon></div>
          </Col>}
        </Row>
      </Card.Header>
      <Card.Body>
        {fieldDefs.otherFields.map((field, idx) => {
          return <Row key={idx} className={"align-items-center" + ((idx < fieldDefs.otherFields.length - 1) ? " mb-2" : "")}>
            <Col className="col-auto">
              <span className="font-weight-bold">{field.displayName + ':'}</span>
            </Col>
            <Col className="w-100 pl-0 pr-0">
              <ContentEditable
                tabIndex={idx + 1}
                innerRef={element => otherRefs.current[field.name] = element}
                html={otherFields[field.name]}
                disabled={!editable}
                onChange={(event) => handleChange(event, (value) => setOtherFields(Object.assign({}, otherFields, { [field.name]: value })))}
                className={(editable ? " editable cursor-pointer" : "")} />
            </Col>
            {editable && <Col className="col-auto pl-1">
              <div className="cursor-pointer" onClick={() => focus(otherRefs, field.name)}><Icon>edit</Icon></div>
            </Col>}
          </Row>
        }
        )}
      </Card.Body>
      {editable && <Card.Body className="pt-0">
        <Row>
          <Col className="col-6">
            {modified && !isProcessing ?
              <Button className="w-100" variant="danger" onClick={reset}>Cancel</Button> :
              <Button className="w-100" variant="outline-danger" disabled>Cancel</Button>}
          </Col>
          <Col className="col-6">
            {modified && !isProcessing ?
              <Button className="w-100" variant="success" onClick={save}>Save</Button> :
              <Button className="w-100" variant="outline-success" disabled>Save</Button>}
          </Col>
        </Row>
        {isProcessing && <Row className="mt-3">
          <Col>
            <LinearProgress className="w-100" />
          </Col>
        </Row>}
      </Card.Body>}
    </Card>
  );
}

export default ContactCard;
