import React, {useEffect} from 'react';
import { Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // Access the authentication state from the Redux store
  const isAuth = useSelector((state) => state.auth.isAuth);
  console.log("HAHAHAHHAHAHAHAHHAHAHAHAHHAHA---------->",isAuth)

  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not logged in, redirect them to the login page
    if (!isAuth) {
      navigate("/signee-login");
    }else{
    // If the user is logged in, but tries to access the login page, redirect them to the home page (or any other route)
    const redirectTo = '/signee/dashboard'; // Replace '/home' with the route you want to redirect to after successful login
    if (window.location.pathname === '/signee-login') {
      navigate(redirectTo);
    }
    }
  }, [isAuth, navigate]);

  // If the user is logged in and tries to access other private routes, render the child components (Outlet)
  return <Outlet />;
}

export default PrivateRoute;
