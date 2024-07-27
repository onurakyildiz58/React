import React, { Component } from 'react';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import { AddEmployee } from './AddEmployee';
import { EditEmployee } from './EditEmployee';

export class Employee extends Component {
    constructor(props) {
        super(props);
        this.state = { emps: [], error: null, addModalShow: false, editModalShow: false };
    }

    async refreshList() {
        const apiUrl = process.env.REACT_APP_API + 'Employees/get';
        console.log('API URL:', apiUrl);

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            this.setState({ emps: data, error: null });
        } catch (error) {
            console.error('Fetch error:', error);
            this.setState({ error: error.message });
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    componentDidUpdate() {
        this.refreshList();
    }

    deleteEmp(empid) {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'Employees/delete/' + empid, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        }
    }

    render() {
        const { emps, error, id, fullname, depID, imagePath, created_at } = this.state;
        let addModalClose = () => this.setState({ addModalShow: false });
        let editModalClose = () => this.setState({ editModalShow: false });
        return (
            <div className="d-flex justify-content-left container">
                {error ? (
                    <div>Error: {error}</div>
                ) : (
                    <Table className="mt-4" striped bordered hover size="sm">
                        <thead>
                            <tr className='text-center'>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Date Of Joining</th>
                                <th>image</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody className='text-center' style={{ verticalAlign: 'middle' }}>
                            {emps.map(emp => (
                                <tr key={emp.id}>
                                    <td className='text-center'>{emp.id}</td>
                                    <td className='text-center'>{emp.fullname}</td>
                                    <td className='text-center'>{emp.depID}</td>
                                    <td className='text-center'>{emp.created_at}</td>
                                    <td className='text-center'>{emp.imagePath}</td>
                                    <td className='text-center'>
                                        <ButtonToolbar className='d-flex justify-content-center'>
                                            <Button className="m-2" variant="info" onClick={() => this.setState({
                                                editModalShow: true,
                                                id: emp.id, fullname: emp.fullname, depID: emp.depID,
                                                imagePath: emp.imagePath, created_at: emp.created_at
                                            })}>
                                                Edit
                                            </Button>

                                            <Button className="m-2" variant="danger"
                                                onClick={() => this.deleteEmp(emp.id)}>
                                                Delete
                                            </Button>

                                            <EditEmployee show={this.state.editModalShow}
                                                onHide={editModalClose}
                                                empid={id}
                                                empname={fullname}
                                                depmt={depID}
                                                photofilename={imagePath}
                                                doj={created_at}
                                            />
                                        </ButtonToolbar>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <ButtonToolbar className='mt-2'>
                            <Button variant='primary'
                                onClick={() => this.setState({ addModalShow: true })}>
                                Add Employee</Button>

                            <AddEmployee show={this.state.addModalShow}
                                onHide={addModalClose} />
                        </ButtonToolbar>
                    </Table>
                )}
            </div>
        );
    }
}
