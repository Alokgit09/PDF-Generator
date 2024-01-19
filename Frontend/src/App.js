import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Report from './components/Report';
import Home from './components/Home';
import Login from './components/LogIn';

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          {/* <Nav /> */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/report' element={<Report />} />
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
