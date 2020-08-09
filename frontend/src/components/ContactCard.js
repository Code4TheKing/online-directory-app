import 'holderjs';
import Holder from 'holderjs';
import React, { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

const ContactCard = ({ contact }) => {
  useEffect(() => {
    Holder.run({
      images: '#img-' + contact.id
    });
  });

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Img id={"img-" + contact.id} variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title className="font-weight-bolder text-primary">{contact.name}</Card.Title>
          <Card.Text>
            <span className="font-weight-bold font-italic text-secondary">Address: </span>{contact.address}<br />
            <span className="font-weight-bold font-italic text-secondary">Phone Number: </span>{contact.phoneNumber}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default connect()(ContactCard);
