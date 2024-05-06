import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FilterIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { MenuItem, Select } from '@mui/material';
import Alert from '@mui/material/Alert';
import Tables from '../../components/Tables/Tables';
import Spiner from "../../components/Spiner/Spiner";
import { useNavigate } from "react-router-dom";
import { addData, dltdata, updateData } from '../../components/context/ContextProvider';
import { usergetfunc, deletfunc, exporttocsvfunc } from "../../services/Apis";
import { toast } from 'react-toastify';
import "./home.css";

const Home = () => {
  const [userdata, setUserData] = useState([]);
  const [showspin, setShowSpin] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [prevFilters, setPrevFilters] = useState({ search, gender, status, sort });
  const [pendingFilters, setPendingFilters] = useState({});

  const { useradd, setUseradd } = useContext(addData);
  const { update, setUpdate } = useContext(updateData);
  const { deletedata, setDLtdata } = useContext(dltdata);

  const navigate = useNavigate();

  const adduser = () => {
    navigate("/register");
  }

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Apply Filters
  const applyFilters = () => {
    userGet(pendingFilters);
    setPrevFilters(pendingFilters);
    handleFilterClose();
  };

  // Remove Filters
  const removeFilters = () => {
    setSearch("");
    setGender("All");
    setStatus("All");
    setSort("new");
    setPage(1);
    setPendingFilters({ search: "", gender: "All", status: "All", sort: "new" });
    handleFilterClose();
  };

  // get user
  const userGet = async (filters) => {
    const response = await usergetfunc(filters.search || search, filters.gender || gender, filters.status || status, filters.sort || sort, page);
    if (response.status === 200) {
      setUserData(response.data.usersdata);
      setPageCount(response.data.Pagination.pageCount);
    } else {
      console.log("error for get user data");
    }
  }

  

  // user delete
const deleteUser = async (id) => {
  const response = await deletfunc(id);
  if (response.status === 200) {
    // Pass the previous filters to userGet
    userGet(prevFilters);
    setDLtdata(response.data);
  } else {
    toast.error("error");
  }
}


  // export user
  const exportuser = async () => {
    const response = await exporttocsvfunc();
    if (response.status === 200) {
      window.open(response.data.downloadUrl, "blank");
    } else {
      toast.error("error !");
    }
  }

  // pagination
  // handle prev btn
  const handlePrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  // handle next btn
  const handleNext = () => {
    setPage((prevPage) => Math.min(prevPage + 1, pageCount));
  }

  useEffect(() => {
    userGet(prevFilters);
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, gender, status, sort, page])

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {
        useradd ? <Alert variant="success" onClose={() => setUseradd("")} dismissible>{useradd.fname.toUpperCase()} Succesfully Added</Alert> : ""
      }

      {
        update ? <Alert variant="primary" onClose={() => setUpdate("")} dismissible>{update.fname.toUpperCase()} Succesfully Update</Alert> : ""
      }

      {
        deletedata ? <Alert variant="danger" onClose={() => setDLtdata("")} dismissible>{deletedata.fname.toUpperCase()} Succesfully Delete</Alert> : ""
      }

      <div className="container">
        <div className="main_div">
          {/* search add btn */}
          <div className="search_add mt-4 d-flex justify-content-between">
            <div className="search col-lg-4 d-flex align-items-center justify-content-end">
              <input
                type="search"
                placeholder="Search"
                className="me-2 sea"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <IconButton onClick={() => console.log('search')}><SearchIcon /></IconButton>
            </div>
            <div className="add_btn">
              <IconButton onClick={adduser} style={{ padding: '14px' }}> 
                <PersonAddIcon style={{  fontSize: '28px' }} />
              </IconButton>
            </div>
            <div className="filter_icon">
              <IconButton
                aria-label="filter"
                onClick={handleFilterClick}
              >
                <FilterIcon style={{ fontSize: '28px' }} />Filter
              </IconButton>
              <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box p={2} width={300}>
                  <Box display="flex" justifyContent="flex-end">
                    <IconButton onClick={handleFilterClose}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <h3>Filters</h3>
                  <form>
                    <Box fontWeight="bold" mb={1}>Gender</Box>
                    <Select
                      value={pendingFilters.gender || gender}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, gender: e.target.value })}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                    <Box fontWeight="bold" mt={2} mb={1}>Status</Box>
                    <Select
                      value={pendingFilters.status || status}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, status: e.target.value })}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="InActive">InActive</MenuItem>
                    </Select>
                    <Box fontWeight="bold" mt={2} mb={1}>Sort</Box>
                    <Select
                      value={pendingFilters.sort || sort}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, sort: e.target.value })}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="old">Old</MenuItem>
                    </Select>
                  </form>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={applyFilters}>Apply </Button>
                    <Button variant="contained" color="secondary" onClick={removeFilters}>Remove</Button>
                  </Box>
                </Box>
              </Popover>
            </div>
          </div>
        
          <div style={{ marginTop: '20px' }}>
            {
              showspin ? <Spiner /> : <Tables
                userdata={userdata}
                deleteUser={deleteUser}
                userGet={userGet}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                page={page}
                pageCount={pageCount}
                setPage={setPage}
              />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
