const express = require('express');
const UserData = require('./models/Userdata');
require('./db/connect');


const port =  9090;
const app = express();
app.use(express.json());


////////// Create Data PDF //////////////

app.post('/createdata', async (req, res) => {
 try{
  let userinfo = new UserData(req.body);
  let result = await userinfo.save();
  res.status(201).json(result);
 }catch(err){
 console.log('create Data err>>', err);
 res.json({message: "create Data err>>", err});
 }
});


////////// Create Data PDF //////////////

app.post('/login-user', async (req, res) => {
  try{
    const registered_id = req.body.register_id;
    const name = req.body.name;
   if(registered_id){
    const matchData = await UserData.findOne({ register_id: registered_id });
    const Token = await matchData.generateAuthtoken(); 
    const tokenData = { name: matchData.name, registerID: matchData.register_id, Token: Token}
    if(matchData){
     res.status(201).json(tokenData);
    }else{
      res.send({ message: "Ivalid Ragistered Id" });
    }
   }else{
    res.send({ message: "Please Fill All Fields" });
   }
  }catch(err){
    console.log('loginuser Data err>>', err);
    res.json({message: "loginuser Data err>>", err});
  }
});

////////// Get User Data PDF //////////////

app.get('/getuserdata/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const trackId = await UserData.findOne({ register_id: id });
    res.status(201).json(trackId);
    console.log('userinfo>>>', trackId)
  }catch(err){ 
    console.log('getuserdata Data err>>', err);
    res.json({message: "getuserdata Data err>>", err});
  }
});


app.listen(port, () => {
    console.log(`connetion is setup at ${port}`);
  });