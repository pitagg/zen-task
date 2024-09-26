import './App.css';
import ApiClient from './utils/ApiClient';
import Header from './components/Header'
import { BrowserRouter as Router } from 'react-router-dom';
import Routing from './components/Routing';

const isAuthenticated = ApiClient.isAuthenticated;

function App() {
  return (
    <Router>
      <div className="App">
        <Routing />
      </div>
    </Router>
  );
}

export default App;
