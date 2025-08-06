window.ENV = {
  REACT_APP_API_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://api.orion-gestor.com/api',
}; 