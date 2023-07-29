import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useDarkMode from '@/hooks/useDarkMode';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
// image import
import { useNavigate } from 'react-router-dom';
import LogoWhite from '@/assets/images/logo/logo.png';
import Logo from '@/assets/images/logo/logo.png';
import Illustration from '@/assets/images/auth/Rectangle 1.svg';

const LandingPage = () => {
  const [openModel, setOpenModel] = useState(false);
  const navigate = useNavigate();
  const color = 'red';
  const [isDark] = useDarkMode();
  const [openTab, setOpenTab] = React.useState(1);

  const handleNavigate = () => {
    setOpenModel(true);
  };
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column bg-white">
          <div className="left-column relative z-[1] w-[35%]">
            <div className="max-w-[520px] pt-20  rtl:pr-20 relative top-[73%]">
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
            <div className="absolute left-0 bottom-[-130px]  w-full z-[-1]">
              <img
                src={Illustration}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <div
            className="right-column relative bg-white dark:bg-slate-800 bg-white"
            style={{ marginTop: '130px' }}
          >
            <div
              className="flex flex-wrap"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div className="w-4/5">
                <ul
                  className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                  role="tablist"
                >
                  <li
                    className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    style={{ boxShadow: 'none' }}
                  >
                    <a
                      style={{ boxShadow: 'none' }}
                      className={
                        'text-lg font-bold px-5 py-3 block leading-normal rounded-none' +
                        (openTab === 1
                          ? 'text-white bg-' +
                            color +
                            '-600 border-b-2 border-b-teal-600'
                          : 'text-' + 'black' + '-600 bg-white')
                      }
                      onClick={e => {
                        e.preventDefault();
                        setOpenTab(1);
                      }}
                      data-toggle="tab"
                      href="#link1"
                      role="tablist"
                    >
                      Signee
                    </a>
                  </li>
                  <li
                    className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    style={{ boxShadow: 'none' }}
                  >
                    <a
                      className={
                        'text-lg font-bold px-5 py-3 block leading-normal rounded-none' +
                        (openTab === 2
                          ? 'text-white bg-' +
                            color +
                            '-600 border-b-2 border-b-teal-600'
                          : 'text-' + 'black' + '-600 bg-white')
                      }
                      onClick={e => {
                        e.preventDefault();
                        setOpenTab(2);
                      }}
                      data-toggle="tab"
                      href="#link2"
                      role="tablist"
                    >
                      Notary
                    </a>
                  </li>
                  <li
                    className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    style={{ boxShadow: 'none' }}
                  >
                    <a
                      className={
                        'text-lg font-bold px-5 py-3 block leading-normal rounded-none' +
                        (openTab === 3
                          ? 'text-white bg-' +
                            color +
                            '-600 border-b-2 border-b-teal-600'
                          : 'text-' + 'black' + '-600 bg-white')
                      }
                      onClick={e => {
                        e.preventDefault();
                        setOpenTab(3);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Admin
                    </a>
                  </li>
                  <li
                    className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                    style={{ boxShadow: 'none' }}
                  >
                    <a
                      className={
                        'text-lg font-bold  px-5 py-3 block leading-normal rounded-none' +
                        (openTab === 4
                          ? 'text-white bg-' +
                            color +
                            '-600 border-b-2 border-b-teal-600'
                          : 'text-' + 'black' + '-600 bg-white')
                      }
                      onClick={e => {
                        e.preventDefault();
                        setOpenTab(4);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Organization
                    </a>
                  </li>
                </ul>
                <div
                  style={{ boxShadow: 'none' }}
                  className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 ml-3 shadow-lg rounded"
                >
                  <div
                    className="px-4 py-5 flex-auto"
                    style={{ boxShadow: 'none' }}
                  >
                    <div
                      className="tab-content tab-space"
                      style={{ boxShadow: 'none' }}
                    >
                      <div
                        className={openTab === 1 ? 'block' : 'hidden'}
                        id="link1"
                      >
                        <h2 className="mb-10 mt-4">Join us as Signee</h2>
                        <p className="mb-6 ml-3">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s
                        </p>
                        <Button
                          text="SIGNUP"
                          onClick={() => navigate('/signee-signup')}
                          className="btn-outline-dark mr-[1rem]"
                        />
                        <Button
                          text="LOGIN"
                          onClick={() => navigate('/signee-login')}
                          className="btn-outline-dark"
                        />
                      </div>
                      <div
                        className={openTab === 2 ? 'block' : 'hidden'}
                        style={{ boxShadow: 'none' }}
                        id="link2"
                      >
                        <h2 className="mb-10 mt-4">Join us as Notary</h2>
                        <p className="mb-6 ml-3">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s
                        </p>
                        <Modal
                          title="Notary SignUp"
                          label="SIGNUP"
                          // openModel={openModel}
                          labelClass="btn-outline-dark mr-[1rem]"
                          // className="max-w-md"
                          className=" ml-2 max-w-md"
                          uncontrol
                          onMouseEnter={e =>
                            (e.currentTarget.style.background = '#fff')
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.background = '#fff')
                          }
                          footerContent={
                            <>
                              <Button
                                text="No"
                                style={{ marginRight: '20px' }}
                                className="btn-light shadow-base2 px-[2.5rem]"
                                onClick={() => navigate('/')}
                              />
                              <Button
                                text="Yes"
                                className="btn-dark px-[2.5rem]"
                                onClick={() => navigate('/notary-signup')}
                              />
                            </>
                          }
                        >
                          <h4 class="font-medium text-lg mb-3 text-slate-900">
                            Are you commissioned as a notary in at least one
                            state?
                          </h4>
                        </Modal>

                        {/* <Button text="SIGNUP"  onClick={(handleNavigate)} className="btn-outline-secondary rounded-[999px] ml-2" /> */}
                        <Button
                          text="LOGIN"
                          onClick={() => navigate('/notary-login')}
                          className="btn-outline-dark"
                        />
                      </div>
                      <div
                        className={openTab === 3 ? 'block' : 'hidden'}
                        style={{ boxShadow: 'none' }}
                        id="link3"
                      >
                        <h2 className="mb-10 mt-4">Join us as Admin</h2>
                        <p className="mb-6 ml-3 ml-3">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s
                        </p>
                        {/* <Button text="SIGNUP"  className="btn-outline-dark gap-[1rem] mr-[1rem]" /> */}
                        <Button
                          text="LOGIN"
                          onClick={() => navigate('/admin-login')}
                          className="btn-outline-dark"
                        />
                      </div>
                      <div
                        className={openTab === 4 ? 'block' : 'hidden'}
                        style={{ boxShadow: 'none' }}
                        id="link3"
                      >
                        <h2 className="mb-10 mt-4">Join us as Organization</h2>
                        <p className="mb-6 ml-3">
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry. Lorem Ipsum has been the
                          industry's standard dummy text ever since the 1500s
                        </p>
                        <Button
                          text="SIGNUP"
                          onClick={() => navigate('/organization-signup')}
                          className="btn-outline-dark mr-[1rem]"
                        />
                        <Button
                          text="LOGIN"
                          onClick={() => navigate('/org-login')}
                          className="btn-outline-dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
