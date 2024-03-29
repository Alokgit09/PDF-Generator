import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  return (
    <>
      <div className='navbar-sec1'>
        <ul>
          <li>
            <Link to="/">Registration</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/report">Report</Link>
          </li>
          <li>
            <Link to="/signup">SignUp</Link>
          </li>
          <li>
            <Link to="/login">LogIn</Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Nav
