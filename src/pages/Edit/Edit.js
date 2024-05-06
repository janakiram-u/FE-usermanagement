import React, { useContext, useEffect, useState } from 'react';
import { Card, Button, TextField, FormControlLabel, RadioGroup, Radio, FormControl, FormLabel, Select, MenuItem, CircularProgress, Box, Stack, InputLabel } from '@mui/material';
import { singleUsergetfunc, editfunc } from '../../services/Apis';
import { useNavigate, useParams } from 'react-router-dom';
import { updateData } from '../../components/context/ContextProvider';
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from '../../services/helper';
import 'react-toastify/dist/ReactToastify.css';
import { DriveFileRenameOutline, Category, LocationOn, MailOutline, Phone, CloudUpload } from '@mui/icons-material'; // Importing icons
import Spiner from '../../components/Spiner/Spiner';

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
                      InputProps={{ startAdornment: <Category /> }} 
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
                      InputProps={{ startAdornment: <MailOutline /> }} 
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
                      InputProps={{ startAdornment: <Phone /> }} 
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
                      InputProps={{ startAdornment: <LocationOn /> }} 
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
}

export default Edit;
