// filepath: frontend/src/pages/Mailbox.js
import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';

const Mailbox = () => {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState({ to: '', from: '', subject: '', body: '' });

  useEffect(() => {
    // Fetch emails from backend
    fetch('http://localhost:5555/api/emails')
      .then(response => response.json())
      .then(data => setEmails(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmail({ ...newEmail, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send POST request to backend to create email
    fetch('http://localhost:5555/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmail),
    })
      .then(response => response.json())
      .then(data => {
        setEmails([...emails, data]);
        setNewEmail({ to: '', from: '', subject: '', body: '' });
      });
  };

  return (
    <Container>
      <h2 className="my-4">Skrzynka pocztowa</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTo">
          <Form.Label>Do</Form.Label>
          <Form.Control
            type="email"
            name="to"
            value={newEmail.to}
            onChange={handleChange}
            placeholder="Wprowadź adres e-mail odbiorcy"
          />
        </Form.Group>
        <Form.Group controlId="formFrom">
          <Form.Label>Od</Form.Label>
          <Form.Control
            type="email"
            name="from"
            value={newEmail.from}
            onChange={handleChange}
            placeholder="Wprowadź adres e-mail nadawcy"
          />
        </Form.Group>
        <Form.Group controlId="formSubject">
          <Form.Label>Temat</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={newEmail.subject}
            onChange={handleChange}
            placeholder="Wprowadź temat"
          />
        </Form.Group>
        <Form.Group controlId="formBody">
          <Form.Label>Treść</Form.Label>
          <Form.Control
            as="textarea"
            name="body"
            value={newEmail.body}
            onChange={handleChange}
            placeholder="Wprowadź treść e-maila"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Wyślij
        </Button>
      </Form>
      <Row className="mt-4">
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