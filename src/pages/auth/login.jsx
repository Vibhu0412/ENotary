import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from './common/LoginForm';
import Social from './common/social';
import useDarkMode from '@/hooks/useDarkMode';
import { ToastContainer } from 'react-toastify';

// image import
import LogoWhite from '@/assets/images/logo/logo-white.svg';
import Logo from '@/assets/images/logo/logo.png';
import Card from '../../components/ui/Card';

import Illustration from '@/assets/images/auth/Rectangle 1.svg';

const Login = () => {
  const [isDark] = useDarkMode();
  const location = useLocation();
  const issignee = location.pathname.startsWith('/signee-login');
  const isNotary = location.pathname.startsWith('/notary-login');

  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column sticky top-[0] z-[1] w-[35%] h-screen overflow-[hidden]">
            <div className="max-w-[520px] pt-20  rtl:pr-20 relative top-[76%]">
              <Link
                to="/"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <h4
                  style={{
                    marginTop: '13px',
                    color: 'white',
                    fontSize: '50px',
                    fontWeight: '900',
                  }}
                >
                  eNotary
                </h4>
              </Link>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px]  w-full z-[-1]">
              <img
                src={Illustration}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div
                className="auth-box h-full flex flex-col justify-center"
                style={{ maxWidth: '60%' }}
              >
                <div className="mobile-logo text-center mb-6 lg:hidden block">
                  <Link to="/">
                    <img
                      src={isDark ? LogoWhite : Logo}
                      alt=""
                      className="mx-auto"
                    />
                  </Link>
                </div>
                <Card className="p-[2.5rem] shadow-xl">
                  <div className="text-center 2xl:mb-10 mb-4">
                    <h4 className="font-medium">Welcome Back to eNotary</h4>
                  </div>

                  <LoginForm />
                  {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                    <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                      Or continue with
                    </div>
                  </div>
                  <div
                    className="max-w-[242px] mx-auto mt-8 w-full text-center"
                    style={{ marginRight: '35px' }}
                  >
                    <Social />
                  </div> */}
                  <div className="auth-footer text-center mt-[1rem] ">
                    &copy;2023, enotary,Inc. All rights reserved.
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
