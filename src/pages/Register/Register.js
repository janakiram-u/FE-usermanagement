import React, { useContext, useEffect, useState } from 'react';
import { Card, Button, TextField, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel, Select, MenuItem, CircularProgress, Grid, Box } from '@mui/material';
import Spiner from "../../components/Spiner/Spiner";
import { registerfunc } from "../../services/Apis";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./register.css";
import { addData } from '../../components/context/ContextProvider';

const Register = () => {
  const [inputdata, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  });

  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
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

    if (fname === "") {
      toast.error("First name is Required !");
    } else if (lname === "") {
      toast.error("Last name is Required !");
    } else if (email === "") {
      toast.error("Email is Required !");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !");
    } else if (mobile === "") {
      toast.error("Mobile is Required !");
    } else if (mobile.length > 10) {
      toast.error("Enter Valid Mobile!");
    } else if (gender === "") {
      toast.error("Gender is Required !");
    } else if (status === "") {
      toast.error("Status is Required !");
    } else if (image === "") {
      toast.error("Profile is Required !");
    } else if (location === "") {
      toast.error("Location is Required !");
    } else {
      const data = new FormData();
      data.append("fname", fname);
      data.append("lname", lname);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("gender", gender);
      data.append("status", status);
      data.append("user_profile", image);
      data.append("location", location);

      const config = {
        "Content-Type": "multipart/form-data"
      };

      const response = await registerfunc(data, config);
      
      if (response.status === 200) {
        setInputData({
          ...inputdata,
          fname: "",
          lname: "",
          email: "",
          mobile: "",
          gender: "",
          location: ""
        });
        setStatus("");
        setImage("");
        setUseradd(response.data);
        navigate("/");
      } else {
        toast.error("Error!");
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
        <div className="container">
          <h2 className='text-center mt-1'>Register Your Details</h2>
          <Card className='shadow mt-3 p-3'>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                }}
              >
                <Box
                  component="img"
                  src={preview ? preview : "/man.png"}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            </Box>

            <form onSubmit={submitUserData}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="First name" name='fname' value={inputdata.fname} onChange={setInputValue} placeholder='Enter FirstName' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Last Name" name='lname' value={inputdata.lname} onChange={setInputValue} placeholder='Enter LastName' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Email address" type="email" name='email' value={inputdata.email} onChange={setInputValue} placeholder='Enter Email' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Mobile" name='mobile' value={inputdata.mobile} onChange={setInputValue} placeholder='Enter Mobile' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select Your Gender</FormLabel>
                    <RadioGroup row name="gender" value={inputdata.gender} onChange={setInputValue}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>Select Your Status</FormLabel>
                    <Select value={status} onChange={setStatusValue}>
                      {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Select Your Profile" type="file" name='user_profile' onChange={setProfile} placeholder='Select Your Profile' />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth variant="outlined" label="Enter Your Location" name='location' value={inputdata.location} onChange={setInputValue} placeholder='Enter Your Location' />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit">Submit</Button>
                </Grid>
              </Grid>
            </form>
          </Card>
          <ToastContainer position="top-center" />
        </div>
      )}
    </>
  );
};

export default Register;
