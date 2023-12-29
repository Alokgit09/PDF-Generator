import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
  const [registerId, setRegisterId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const loginData = async () => {
    try {
      const result = await axios.post("http://localhost:9090/login", {
        name,
        register_id: registerId,
      });
      let resultData = result.data;
      console.log("resultData>>", resultData);
      if (resultData) {
        navigate("/report")
        localStorage.setItem("User", JSON.stringify(resultData));
        localStorage.setItem("Token", JSON.stringify(resultData.jwtToken));
      } else {
        alert("Invalid Registered Id and Name");
      }
    } catch (err) {
      console.log("login Page Err >>", err);
    }
  };

  return (
    <div>
      <div className="login-sec2">
        <center>
          <div className="page_content1">
            <h2>Enter Register Id & Name</h2>
            <div className="singupInput">
              <input
                type="text"
                placeholder="Register Id"
                value={registerId}
                onChange={(ee) => setRegisterId(ee.target.value)}
              />

              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(ee) => setName(ee.target.value)}
              />
              <button onClick={loginData} type="button">
                Login
              </button>
            </div>
          </div>
        </center>
      </div>
    </div>
  );
};

export default LogIn;
