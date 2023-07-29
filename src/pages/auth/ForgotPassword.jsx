import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useDarkMode from '@/hooks/useDarkMode';
import { ToastContainer } from 'react-toastify';

// image import
import LogoWhite from '@/assets/images/logo/logo-white.svg';
import Logo from '@/assets/images/logo/logo.png';
import Illustration from '@/assets/images/auth/Rectangle 1.svg';
import ForgotPasswordForm from './common/ForgotPasswordForm';
import Card from '../../components/ui/Card';
import Icon from '@/components/ui/Icon';

const ForgotPassword = () => {
  const [isDark] = useDarkMode();
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

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
                {/* <img src={isDark ? LogoWhite : Logo} alt="" /> */}
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
            <div className="absolute left-0 2xl:bottom-[-160px] lg:bottom-[-70px] bottom-[-130px]  w-full z-[-1]">
              <img
                src={Illustration}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center max-w-60">
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
                  <div className="text-center mb-4 flex justify-center items-center">
                    <Link onClick={navigateBack}>
                      <Icon
                        icon="heroicons-solid:arrow-left"
                        className="mr-2 mb-2 h-6 w-6 "
                      />
                    </Link>
                    <h4 className="font-medium">Reset Password</h4>
                  </div>

                  <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400  text-center  text-sm 2xl:mb-10 mb-4 ">
                    Enter your email address, and an email with instructions
                    will be sent to you
                  </div>

                  <ForgotPasswordForm />
                  <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6"></div>
                  <div
                    className="max-w-[242px] mx-auto mt-8 w-full text-center"
                    style={{ marginRight: '42px' }}
                  ></div>
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

export default ForgotPassword;
