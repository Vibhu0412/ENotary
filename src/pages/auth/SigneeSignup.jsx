import React from 'react';
import { Link } from 'react-router-dom';
import useDarkMode from '@/hooks/useDarkMode';
import RegForm from './common/reg-from';
import Social from './common/social';
import { ToastContainer } from 'react-toastify';
// image import
import LogoWhite from '@/assets/images/logo/logo.png';
import Logo from '@/assets/images/logo/logo.png';
import Illustration from '@/assets/images/auth/Rectangle 1.svg';
import SigneeForm from './common/SigneeSignupForm';
import Card from '../../components/ui/Card';
import SigneeSignupForm from './common/SigneeSignupForm';

const SigneeRegister = () => {
  const [isDark] = useDarkMode();

  return (
    <>
      <ToastContainer />

      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column sticky top-[0] z-[1] w-[35%] h-screen overflow-[hidden]">
            <div className="max-w-[520px] pt-20  rtl:pr-20 relative top-[73%]">
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
              <div
                className="auth-box h-full flex flex-col justify-center"
                style={{
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  maxWidth: '80%',
                }}
              >
                {/* <Card className="p-[2.5rem] shadow-xl"> */}
                {/* <Card className="p-[2.5rem] shadod-md"> */}
                <Card
                  className="p-[2.5rem] pt-0"
                  style={{ border: '10px solid grey !important' }}
                >
                  <div className="text-center 2xl:mb-10 mb-5">
                    <h4 className="font-medium">Register as Signee</h4>
                  </div>
                  <SigneeSignupForm />
                  {/* <div className=" relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                    <div className=" absolute inline-block  bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  text-slate-500  dark:text-slate-400font-normal ">
                      Or continue with
                    </div>
                  </div>
                  <div className="max-w-[242px] mx-auto mt-8 w-full text-center">
                    <Social />
                  </div> */}
                  <div className="auth-footer text-center mt-[1rem]">
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

export default SigneeRegister;
