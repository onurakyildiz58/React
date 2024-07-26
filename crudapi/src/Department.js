import React, { Component } from 'react';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import { AddDepartment } from './AddDepartment';
import { EditDepartment } from './EditDepartment';

export class Department extends Component {
  constructor(props) {
    super(props);
    this.state = { deps: [], error: null, addModalShow:false, editModalShow:false };
  }

  async refreshList() {
    const apiUrl = process.env.REACT_APP_API + 'Departments/get';
    console.log('API URL:', apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      this.setState({ deps: data, error: null });
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

  deleteDep(depid) {
    if (window.confirm('Are you sure?')) {
      fetch(process.env.REACT_APP_API + 'Departments/delete/' + depid, {
        method: 'DELETE',
        header: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
    }
  }
  render() {
    const { deps, error, depid, depname } = this.state;
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
                <th>Options</th>
              </tr>
            </thead>
            <tbody className='text-center' style={{ verticalAlign: 'middle' }}>
              {deps.map(dep => (
                <tr key={dep.id}>
                  <td >{dep.id}</td>
                  <td className='text-center'>{dep.name}</td>
                  <td>
                    <ButtonToolbar className='d-flex justify-content-center'>
                      <Button className="m-2" variant="info"
                        onClick={() => this.setState({
                          editModalShow: true,
                          depid: dep.id, depname: dep.name
                        })}>
                        Edit
                      </Button>

                      <Button className="m-2" variant="danger"
                        onClick={() => this.deleteDep(dep.id)}>
                        Delete
                      </Button>

                      <EditDepartment show={this.state.editModalShow}
                        onHide={editModalClose}
                        depid={depid}
                        depname={depname} />
                    </ButtonToolbar>
                  </td>
                </tr>
              ))}
            </tbody>
            <ButtonToolbar className='mt-2'>
              <Button variant='primary'
                onClick={() => this.setState({ addModalShow: true })}>
                Add Department</Button>

              <AddDepartment show={this.state.addModalShow}
                onHide={addModalClose} />
            </ButtonToolbar>
          </Table>
        )}

      </div>
    );
  }
}
