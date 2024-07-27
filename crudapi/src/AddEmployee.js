import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';

export class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = { deps: [] };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
    }

    photofilename = "anonymous.png";
    imagesrc = process.env.REACT_APP_PHOTOAPI + this.photofilename;

    componentDidMount() {
        fetch(process.env.REACT_APP_API + 'Departments/get')
            .then(response => response.json())
            .then(data => {
                this.setState({ deps: data });
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        const depID = event.target.depID.value;
        
        fetch(process.env.REACT_APP_API + 'Employees/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: null,
                fullname: event.target.fullname.value,
                depID: depID,
                created_at: event.target.created_at.value,
                photoPath: this.photofilename
            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
            },
                (error) => {
                    alert('Failed');
                })
    }

    handleFileSelected(event) {
        event.preventDefault();
        this.photofilename = event.target.files[0].name;
        const formData = new FormData();
        formData.append(
            "myFile",
            event.target.files[0],
            event.target.files[0].name
        );

        fetch(process.env.REACT_APP_API + 'Employees/savefile', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then((result) => {
                this.imagesrc = process.env.REACT_APP_PHOTOAPI + result;
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
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Employee
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="fullname">
                                        <Form.Label>Employee Name</Form.Label>
                                        <Form.Control type="text" name="fullname" required
                                            placeholder="Employee Name" />
                                    </Form.Group>

                                    <Form.Group controlId="depID">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control as="select" name="depID">
                                            {this.state.deps.map(dep =>
                                                <option key={dep.id} value={dep.id}>{dep.name}</option>
                                            )}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="created_at">
                                        <Form.Label>Date Of Joining</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="created_at"
                                            required
                                            placeholder="Date Of Joining"
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Add Employee
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" src={this.imagesrc} />
                                <input onChange={this.handleFileSelected} type="file" />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
