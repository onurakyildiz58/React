import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

export class EditDepartment extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(process.env.REACT_APP_API + 'Departments/update/' + this.props.depid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: event.target.id.value,
                name: event.target.name.value
            })
        })
            .then(res => res.json())
            .then((result) => {

            },
                (error) => {
                    alert('Failed');
                })
    }
    render() {
        return (
            <div className="container">
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-center"
                    centered
                >
                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-center">
                            Edit Department
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="id" className='mb-2'>
                                        <Form.Label>ID</Form.Label>
                                        <Form.Control type="text" name="id" required
                                            disabled
                                            defaultValue={this.props.depid}
                                            placeholder="id" />
                                    </Form.Group>
                                    <Form.Group controlId="name" className='mb-2'>
                                        <Form.Label>Department Name</Form.Label>
                                        <Form.Control type="text" name="name" required
                                            defaultValue={this.props.depname}
                                            placeholder="name" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Update Department
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}