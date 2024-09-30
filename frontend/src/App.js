import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from './components/Routing';
import ApiClient from './utils/ApiClient';
import { useState } from 'react';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'))
  const apiClient = new ApiClient({ isAuth, setIsAuth })

  return (
    <Router>
      <div className="App">
        <Routing apiClient={ apiClient } />
      </div>
    </Router>
  );
}

export default App;
