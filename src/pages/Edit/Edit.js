import React, { useContext, useEffect, useState } from 'react';
import { Card, Button, TextField, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel, Select, MenuItem, Grid, CircularProgress, Box } from '@mui/material';
import { singleUsergetfunc, editfunc } from '../../services/Apis';
import { useNavigate, useParams } from 'react-router-dom';
import { updateData } from '../../components/context/ContextProvider';
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from '../../services/helper';
import 'react-toastify/dist/ReactToastify.css';
import "./edit.css";

const Edit = () => {
  const [inputdata, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  });

  const [status, setStatus] = useState("Active");
  const [imgdata, setImgdata] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [showspin, setShowSpin] = useState(true);

  const { update, setUpdate } = useContext(updateData);
  const navigate = useNavigate();
  const { id } = useParams();

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

  const userProfileGet = async () => {
    const response = await singleUsergetfunc(id);
    if (response.status === 200) {
      setInputData(response.data);
      setStatus(response.data.status);
      setImgdata(response.data.profile);
    } else {
      console.log("error");
    }
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
    } else if (location === "") {
      toast.error("location is Required !");
    } else {
      const data = new FormData();
      data.append("fname", fname);
      data.append("lname", lname);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("gender", gender);
      data.append("status", status);
      data.append("user_profile", image || imgdata);
      data.append("location", location);
      const config = {
        "Content-Type": "multipart/form-data"
      };
      const response = await editfunc(id, data, config);
      if (response.status === 200) {
        setUpdate(response.data);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    userProfileGet();
  }, [id]);

  useEffect(() => {
    if (image) {
      setImgdata("")
      setPreview(URL.createObjectURL(image))
    }
    setTimeout(() => {
      setShowSpin(false)
    }, 1200)
  }, [image]);

  return (
    <>
      {showspin ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : (
        <div className="container">
          <h2 className='text-center mt-1'>Update Your Details</h2>
          <Card className='shadow mt-3 p-3'>
            <Box display="flex" justifyContent="center" alignItems="center" marginBottom="16px">
              <img src={image ? preview : `${BASE_URL}/uploads/${imgdata}`} alt="img" style={{ maxWidth: '150px', maxHeight: '150px' }} />
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
}

export default Edit;
