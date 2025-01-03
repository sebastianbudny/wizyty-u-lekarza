// filepath: frontend/src/pages/Mailbox.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Mailbox = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Fetch emails from backend
    fetch('http://localhost:5555/api/emails')
      .then(response => response.json())
      .then(data => setEmails(data));
  }, []);

  return (
    <Container>
      <h2 className="my-4">Skrzynka pocztowa</h2>
      <Row>
        {emails.map((email, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{email.subject}</Card.Title>
                <Card.Text>
                  <strong>Od:</strong> {email.from}<br />
                  <strong>Do:</strong> {email.to}<br />
                  <strong>Treść:</strong> {email.body}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Mailbox;