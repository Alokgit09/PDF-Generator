import React, { useEffect, useState } from 'react'
import axios from "axios";

const Report = () => {
  const [user, setUser] = useState('');

  useEffect(() => {
   getUserData();
  }, []);

  const getUserData = async () => {
  let id = JSON.parse(localStorage.getItem("User")).registerID;
  // let result = await fetch(`http://localhost:9090/getuserdata/${id}`);
  // let res = await result.json()

  let result = await axios.get(`http://localhost:9090/getuserdata/${id}`);
  let res = result.data;
  setUser(res); 
}



  const hendlePdfDownload = async () => {
    
    try{
      const result = await axios.get("http://localhost:9090/report");
      const Dataend =  result.data;
      console.log("Dataend>>", Dataend);
    }catch(err){
       console.log("Error.. PDF>>>", err)
    }

  }

  return (
    <div>
      <h2>Report Page</h2>
   <div className='userData'>
  <h3>ID: {user.register_id}</h3>
  <h3>Name: {user.name}</h3>
 </div>
   <button onClick={ hendlePdfDownload} type="button" id='btnPDFgenerator'>
                Download PDF
              </button>
    </div>
  )
}

export default Report
