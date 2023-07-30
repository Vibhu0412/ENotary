import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const PrivateRoute = () => {
  // Access the authentication state from the Redux store
  const isAuth = useSelector((state) => state.auth.isAuth);

  // If the user is not logged in, redirect them to the login page
  if (!isAuth) {
    return <Navigate to="/signee-login" />;
  }
  // else{
    // If the user is logged in, but tries to access the login page, redirect them to the home page (or any other route)
    const redirectTo = '/signee/dashboard'; // Replace '/home' with the route you want to redirect to after successful login
    const currentPath = window.location.pathname;
    console.log("VAIBHAV HAHAH --->", currentPath)
    if (currentPath === '/signee-login') {
      return <Navigate to={redirectTo} />;
    }
  // }
  // If the user is logged in and tries to access other private routes, render the child components (Outlet)
  return <Outlet />;
}

export default PrivateRoute;
