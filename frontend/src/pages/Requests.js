import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch requests from backend
    fetch('http://localhost:5555/api/requests')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          setRequests([]);
        }
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setRequests([]);
      });
  }, []);

  const handleRequest = (userId, action) => {
    // Send POST request to backend to handle request
    fetch('http://localhost:5555/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, action }),
    }).then(response => response.json())
      .then(data => {
        setRequests(requests.filter(request => request._id !== userId));
      });
  };

  return (
    <Container>
      <h2 className="my-4">Wnioski o rejestrację</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.username}</td>
              <td>{request.email}</td>
              <td>
                <Button variant="success" onClick={() => handleRequest(request._id, 'accept')}>Akceptuj</Button>
                <Button variant="danger" onClick={() => handleRequest(request._id, 'reject')}>Odrzuć</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Requests;