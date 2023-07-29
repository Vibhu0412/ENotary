import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "./common/reg-from";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";
// image import
import LogoWhite from "@/assets/images/logo/logo.png";
import Logo from "@/assets/images/logo/logo.png";
import Illustration from "@/assets/images/auth/Rectangle 1.svg";
import NotaryForm from "./common/NotarySignupForm";

const register = () => {
  const [isDark] = useDarkMode();
  return (
    <>
      <ToastContainer />

      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            <Link to="/" style={{display:'flex'}}>
                <img src={isDark ? LogoWhite : Logo} alt="" />
                <h4 style={{marginTop: '13px',color:'white',fontSize:'31px',fontWeight: '200'}}>
                Eidos
              </h4>
              </Link>
            </div>
            <div className="absolute left-0 bottom-[-130px]  w-full z-[-1]">
              <img
                src={Illustration}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative bg-white dark:bg-slate-800">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link to="/">
                    <img
                      src={isDark ? LogoWhite : Logo}
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-5">
                  <h4 className="font-medium">Notary Sign Up</h4>
                  <div className="max-w-[215px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6  text-sm">
                  Already have an account?
                  <Link
                    to="/"
                    className=" text-blue-500 dark:text-blue-400 font-medium hover:underline"
                  >
                    &nbsp;Log in
                  </Link>
                </div>
                </div>
                <NotaryForm />
                <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className=" absolute inline-block  bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal ">
                    Or continue with
                  </div>
                </div>
                <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div>
               
                <div className="  mx-auto font-normal text-slate-501 dark:text-slate-400 2xl:mt-12 mt-6  text-sm">
                  Are you a notary?
                  <Link
                    to="/register2"
                    className="text-blue-500 dark:text-blue-400 font-medium hover:underline"
                  >
                    &nbsp;Sign up as a notary
                  </Link>
                </div>
              </div>
              <div className="auth-footer text-center">
              &copy;2023, enotary,Inc. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default register;
