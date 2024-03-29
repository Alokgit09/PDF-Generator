import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [candinetList, setCandinetList] = useState([]);
  const [inicial, setinicial] = useState([]);

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = candinetList.slice(indexOfFirstItem, indexOfLastItem);


  useEffect(() => {
    handleCandinetList();
  }, []);

  // console.log("numbers>>", candinetList.length);
  const totalPages = Math.ceil(candinetList.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCandinetList = async () => {

    const token = localStorage.getItem("token");
    console.log("token>>", token);
    if (!token) {
      console.error("Token is missing");
      navigate('/login');
    } else {
      try {
        const response = await axios.get('http://localhost:9090/allcandidates', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log("res>>>", response.data);
        const CandinetData = response.data;
        setCandinetList(CandinetData);
        setinicial(CandinetData);
        // console.log("CandinetData>>", CandinetData);
      } catch (err) {
        console.log("handleCandinetList Error>>", err.message);
      }
    }
  };

  const handleGetId = async (id) => {
    try {
      const response = await axios.post(`http://localhost:9090/clickgetpdf/${id}`);
      let resultData = response.data;
      // console.log("resultData>>", resultData);
      if (resultData) {
        localStorage.setItem("UserBtn", JSON.stringify(resultData));
        navigate("/report");

      } else {
        alert("Invalid Registered Id and Name");
      }
    } catch (err) {
      console.log("login Page Err >>", err);

    }
  }

  const handleChange = (e) => {
    const query = e.target.value;
    console.log('Query:', query);

    setSearchQuery(query);

    if (!query) {
      console.log('Setting candinetList to currentItems');
      setCandinetList(inicial);
    } else {
      const searchedData = inicial.filter(item => item.name.toLowerCase().match(query.toLowerCase()));
      console.log('Filtered Data:', searchedData);
      setCandinetList(searchedData);
    }
  };

  return (
    <>
      <div className='candinets_box'>
        <div className='siteBar_sec'>
          <h3>Dashboard</h3>
          <div className='sidesec-sec1'>
            <div className='side_link'><Link to="/home">Home</Link></div>
            <div className='side_link'><Link to="/">SignUp</Link></div>
            <div className='side_link'> <Link to="/login">LogIn</Link></div>
          </div>
        </div>
        <div className='top_bar'>
          <div className='banner_top'>INDIAN_ARMY_VETERANS_HALF_MARATHON__REGISTRATION_DATA</div>
          <div className='heading_runer'>
            <p className='list_name'>CANDINETS LIST</p>
            <p className='search_input' ><span>Search Name</span>
              <input type="search" className='search_bar' placeholder='Name' value={searchQuery} onChange={handleChange} /></p>
          </div>
          <div className='list_content'>
            <table className='table_list'>
              <thead>
                <tr>
                  <th>Generate PDF</th>
                  <th>Registration Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Contact Number</th>
                  <th>Blood Group</th>
                  <th>Date of Birth</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>

                {

                  currentItems.map((listitem, index) => {
                    // const numbers = ;
                    return (
                      <tr key={index}>
                        <td><button className='generat_pdfbtn' onClick={() => handleGetId(listitem.register_id)}>Generate PDF</button></td>
                        <td>{listitem.register_id}</td>
                        <td>{listitem.name}</td>
                        <td>{listitem.email}</td>
                        <td>{listitem.gender}</td>
                        <td>{listitem.city}</td>
                        <td>{listitem.state}</td>
                        <td>{listitem.contact_number}</td>
                        <td>{listitem.blood_group}</td>
                        <td>{listitem.date_of_birth}</td>
                        <td>{listitem.status}</td>
                      </tr>
                    )
                  })

                }

              </tbody>
            </table>

          </div>
          <div className='button_content'>
            <div className='prenext_btn'>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              <span>{currentPage} of {totalPages}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Home
