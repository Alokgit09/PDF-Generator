import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// const navigate = useNavigate();


const Home = () => {

  const [candinetList, setCandinetList] = useState([]);



  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

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
    try {
      const response = await axios.get('http://localhost:9090/allcandidates');
      // const CandinetData = JSON.stringify(response.data);
      const CandinetData = response.data;
      setCandinetList(CandinetData);
      console.log("CandinetData>>", CandinetData);
    } catch (err) {
      console.log("handleCandinetList Error>>", err);
    }

  };

  const handleGetId = async (id) => {
    try {
      const response = await axios.post(`http://localhost:9090/clickgetpdf/${id}`);
      let resultData = response.data;
      console.log("resultData>>", resultData);
      if (resultData) {
        localStorage.setItem("UserBtn", JSON.stringify(resultData));
        // navigate("../components/Report");
      } else {
        alert("Invalid Registered Id and Name");
      }
    } catch (err) {
      console.log("login Page Err >>", err);
    }
  }


  return (
    <>
      <div className='candinets_box'>
        <div className='siteBar_sec'>
          <h3>Dashboard</h3>
          <div className='sidesec-sec1'>
            <div className='side_link'><Link to="/">Home</Link></div>
            <div className='side_link'><Link to="/report">Report</Link></div>
            <div className='side_link'> <Link to="/login">LogIn</Link></div>
          </div>
        </div>
        <div className='top_bar'>
          <div className='banner_top'>INDIAN_ARMY_VETERANS_HALF_MARATHON__REGISTRATION_DATA</div>
          <div className='heading_runer'>
            <p className='list_name'>CANDINETS LIST</p>
          </div>
          <div className='list_content'>
            <table className='table_list'>
              <thead>
                <tr>
                  <th>Registration Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>City</th>
                  <th>Contact Number</th>
                  <th>Date of Birth</th>
                  <th>Status</th>
                  <th>Generate PDF</th>
                </tr>
              </thead>
              <tbody>

                {

                  currentItems.map((listitem, index) => {
                    // const numbers = ;
                    return (
                      <tr key={index}>
                        <td>{listitem.register_id}</td>
                        <td>{listitem.name}</td>
                        <td>{listitem.email}</td>
                        <td>{listitem.gender}</td>
                        <td>{listitem.city}</td>
                        <td>{listitem.contact_number}</td>
                        <td>{listitem.date_of_birth}</td>
                        <td>{listitem.status}</td>
                        <td><button onClick={() => handleGetId(listitem.register_id)}>btn</button></td>
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
