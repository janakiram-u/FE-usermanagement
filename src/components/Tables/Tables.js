import React from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch } from '@mui/material';
import { BASE_URL } from '../../services/helper';
import { NavLink } from 'react-router-dom';
import { statuschangefunc } from "../../services/Apis"
import { ToastContainer, toast } from "react-toastify"
import Paginations from '../pagination/Paginations';
import "./table.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Tables = ({ userdata, deleteUser, userGet, handlePrevious, handleNext, page, pageCount, setPage }) => {

  const handleChange = async (id, status) => {
    const filters = {}; // Initialize filters object if it's undefined
    const response = await statuschangefunc(id, status);

    if (response.status === 200) {
      userGet(filters); // Pass filters to userGet
      toast.success("Status Updated")
    } else {
      toast.error("error ")
    }
  }

  return (
    <div className="container">
      <Box>
        <div className="col mt-0">
          <Card className='shadow p-0' style={{ backgroundColor: "aliceblue" }}>
            <TableContainer>
              <Table className='align-items-center' responsive="sm">
                <TableHead className='thead-dark'>
                  <TableRow className='table-dark'>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Profile</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Gender</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    userdata.length > 0 ? userdata.map((element, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1 + (page - 1) * 10}</TableCell>
                          <TableCell className='img_parent'>
                            <img src={`${BASE_URL}/uploads/${element.profile}`} alt="Profile" className="profile-img" style={{ width: '50px', height: '50px' }} />
                          </TableCell>
                          <TableCell>{element.fname + " " + element.lname}</TableCell>
                          <TableCell>{element.email}</TableCell>
                          <TableCell>{element.gender === "Male" ? "M" : "F"}</TableCell>
                          <TableCell>
                            <Switch
                              checked={element.status === "Active"}
                              onChange={() => handleChange(element._id, element.status === "Active" ? "InActive" : "Active")}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="d-flex align-items-center">
                              <button className="btn">
                                <NavLink to={`/userprofile/${element._id}`} className="me-2">
                                  <VisibilityIcon style={{ color: 'grey' }} />
                                </NavLink>
                              </button>
                              <button className="btn">
                                <NavLink to={`/edit/${element._id}`} className="me-2">
                                  <EditIcon style={{ color: 'black' }} />
                                </NavLink>
                              </button>
                              <button onClick={() => deleteUser(element._id)} className="btn">
                                <DeleteIcon style={{ color: 'red' }} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    }) : <TableRow><TableCell colSpan="7" className='no_data text-center'>NO Data Found</TableCell></TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Paginations
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              page={page}
              pageCount={pageCount}
              setPage={setPage}
            />
          </Card>
        </div>
      </Box>
      <ToastContainer />
    </div>
  )
}

export default Tables;
