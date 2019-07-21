import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Internal imports
import './App.scss';
import { PrivateRoute } from './components/PrivateRoute';
import { WrappedLoginForm } from './pages/Login';
import { HomePage } from './pages/Home';
import { WrappedRegisterForm } from './pages/Register';
import { LandingPage } from './pages/Landing';

function App() {
  return (
    <Router>
      <Route path="/login" component={WrappedLoginForm} />
      <Route path="/register" component={WrappedRegisterForm} />
      <PrivateRoute exact path="/panel" component={HomePage} />
      <Route exact path="/" component={LandingPage} />
    </Router>
  );
}

export default App;
