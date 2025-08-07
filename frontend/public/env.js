window.ENV = {
  REACT_APP_API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://orion-backend.onrender.com/api',
}; 