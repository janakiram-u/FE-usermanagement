import React, { useState, useEffect } from 'react';
import { Card, Grid, Typography, Avatar, CircularProgress, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import Spiner from "../../components/Spiner/Spiner";
import { singleUsergetfunc } from "../../services/Apis";
import { BASE_URL } from '../../services/helper';
import moment from "moment";
import "./profile.css";

const Profile = () => {
  const [userprofile, setUserProfile] = useState({});
  const [showspin, setShowSpin] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);
  const { id } = useParams();

  const userProfileGet = async () => {
    const response = await singleUsergetfunc(id);
    if (response.status === 200) {
      setUserProfile(response.data);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    userProfileGet();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [id]);

  const handlePreviewOpen = () => {
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  return (
    <>
      {showspin ? (
        <Spiner />
      ) : (
        <Grid container justifyContent="center" alignItems="flex-start" className="profile-container">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card className="card-profile">
              <Box textAlign="center" mb={2}>
                <Avatar
                  alt="User Profile"
                  src={`${BASE_URL}/uploads/${userprofile.profile}`}
                  sx={{ width: 120, height: 120, margin: 'auto', cursor: 'pointer' }}
                  onClick={handlePreviewOpen}
                />
                <Dialog
                  open={openPreview}
                  onClose={handlePreviewClose}
                >
                  <DialogTitle>User Profile Preview</DialogTitle>
                  <DialogContent>
                    <Box textAlign="center">
                      <Avatar
                        alt="User Profile"
                        src={`${BASE_URL}/uploads/${userprofile.profile}`}
                        sx={{ width: 200, height: 200 }}
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handlePreviewClose} color="primary" autoFocus>
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
              <div className='profile-details' style={{ marginLeft: '20px' }}>
                <Typography variant="h4" gutterBottom>
                  {userprofile.fname} {userprofile.lname}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-envelope email"></i>&nbsp;:- {userprofile.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-mobile"></i>&nbsp;:- {userprofile.mobile}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-person"></i>&nbsp;:- {userprofile.gender}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-location-pin location"></i>&nbsp;:- {userprofile.location}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Status&nbsp;:- {userprofile.status}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Created&nbsp;:- {moment(userprofile.datecreated).format("DD-MM-YYYY")}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <i className="fa-solid fa-calendar-days calendar"></i>&nbsp;Date Updated&nbsp;:- {userprofile.dateUpdated}
                </Typography>
              </div>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Profile;
