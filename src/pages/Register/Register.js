import React, { useContext, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Spiner from '../../components/Spiner/Spiner';
import { registerfunc } from '../../services/Apis';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { addData } from '../../components/context/ContextProvider';
import {
  PersonOutline,
  MailOutline,
  Phone,
  LocationOn,
  Category,
  DriveFileRenameOutline,
  CloudUpload,
} from '@mui/icons-material'; // Import Material-UI icons
import { Stack, InputLabel } from '@mui/material'; // Import Stack and InputLabel from Material-UI

const Register = () => {
  const [inputdata, setInputData] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    gender: '',
    location: '',
  });

  const [status, setStatus] = useState('Active');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [showspin, setShowSpin] = useState(true);

  const navigate = useNavigate();
  const { useradd, setUseradd } = useContext(addData);

  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];

  const setInputValue = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value });
  };

  const setStatusValue = (e) => {
    setStatus(e.target.value);
  };

  const setProfile = (e) => {
    setImage(e.target.files[0]);
  };

  const submitUserData = async (e) => {
    e.preventDefault();
    const { fname, lname, email, mobile, gender, location } = inputdata;

    if (fname === '') {
      toast.error('First name is Required !');
    } else if (lname === '') {
      toast.error('Last name is Required !');
    } else if (email === '') {
      toast.error('Email is Required !');
    } else if (!email.includes('@')) {
      toast.error('Enter Valid Email !');
    } else if (mobile === '') {
      toast.error('Mobile is Required !');
    } else if (mobile.length > 10) {
      toast.error('Enter Valid Mobile!');
    } else if (gender === '') {
      toast.error('Gender is Required !');
    } else if (status === '') {
      toast.error('Status is Required !');
    } else if (image === '') {
      toast.error('Profile is Required !');
    } else if (location === '') {
      toast.error('Location is Required !');
    } else {
      const data = new FormData();
      data.append('fname', fname);
      data.append('lname', lname);
      data.append('email', email);
      data.append('mobile', mobile);
      data.append('gender', gender);
      data.append('status', status);
      data.append('user_profile', image);
      data.append('location', location);

      const config = {
        'Content-Type': 'multipart/form-data',
      };

      const response = await registerfunc(data, config);

      if (response.status === 200) {
        setInputData({
          ...inputdata,
          fname: '',
          lname: '',
          email: '',
          mobile: '',
          gender: '',
          location: '',
        });
        setStatus('');
        setImage('');
        setUseradd(response.data);
        navigate('/');
      } else {
        toast.error('Error!');
      }
    }
  };

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    }

    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [image]);

  return (
    <>
      {showspin ? (
        <Spiner />
      ) : (
        <div className="containss">
          <h3 className="text-center">
            Register your Restaurant here...
          </h3>
          <div>
            <Card className="shadow mt-3 p-3 color-card">
              <div className="text-center">
                {preview && (
                  <img className="img-fluid" src={preview} alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '250px' }} />
                )}
                {!preview && (
                  <img className="img-fluid" src="/man.png" alt="add Image" style={{ maxWidth: '100%', maxHeight: '250px' }} />
                )}
              </div>
              <form onSubmit={submitUserData}>
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    {/* Wrap each field and its label in Stack with appropriate spacing */}
                    <InputLabel className="input-container">First Name</InputLabel>
                    <TextField
                      fullWidth
                      type="text"
                      name="fname"
                      value={inputdata.fname}
                      onChange={setInputValue}
                      placeholder="Enter Name"
                      InputProps={{ startAdornment: <DriveFileRenameOutline /> }} // Icon for Name field
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <InputLabel>Lastname</InputLabel>
                    <TextField
                      fullWidth
                      type="text"
                      name="lname"
                      value={inputdata.lname}
                      onChange={setInputValue}
                      placeholder="Enter Category"
                      InputProps={{ startAdornment: <Category /> }} // Icon for Category field
                    />
                  </Stack>
                 
                  <Stack spacing={1}>
                    <InputLabel>Email address</InputLabel>
                    <TextField
                      fullWidth
                      type="email"
                      name="email"
                      value={inputdata.email}
                      onChange={setInputValue}
                      placeholder="Enter Email"
                      InputProps={{ startAdornment: <MailOutline /> }} // Icon for Email field
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <InputLabel>Mobile</InputLabel>
                    <TextField
                      fullWidth
                      type="text"
                      name="mobile"
                      value={inputdata.mobile}
                      onChange={setInputValue}
                      placeholder="Enter Mobile"
                      InputProps={{ startAdornment: <Phone /> }} // Icon for Mobile field
                    />
                  </Stack>
                  <Stack spacing={1}>
                    <InputLabel>Select gender</InputLabel>
                    <Select
                      fullWidth
                      value={inputdata.gender}
                      label="gender"
                      name="gender"
                      onChange={setInputValue}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      
                    </Select>
                  </Stack>
                  <Stack spacing={1}>
                    <InputLabel>Select Status</InputLabel>
                    {/* Wrap the Select component and its label in Stack with appropriate spacing */}
                    <Select
                      fullWidth
                      value={status}
                      label="Status"
                      name="status"
                      onChange={setStatusValue}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="InActive">InActive</MenuItem>
                    </Select>
                  </Stack>
                  <label htmlFor="profile-upload" className="btn btn-primary">
                    <CloudUpload />
                    &nbsp; Add Image
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      name="user_profile"
                      onChange={setProfile}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <Stack spacing={1}>
                    <InputLabel>Location</InputLabel>
                    <TextField
                      fullWidth
                      type="text"
                      name="location"
                      value={inputdata.location}
                      onChange={setInputValue}
                      placeholder="Enter Your Location"
                      InputProps={{ startAdornment: <LocationOn /> }} // Icon for Location field
                    />
                  </Stack>
                  <Button variant="contained" type="submit">
                    Submit
                  </Button>
                </Stack>
              </form>
            </Card>
          </div>
          <ToastContainer position="top-center" />
        </div>
      )}
    </>
  );
};

export default Register;

