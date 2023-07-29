import React,{useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/partials/header";
import Icon from "@/components/ui/Icon";
import BasicArea from "../chart/appex-chart/BasicArea";

// import images
import ProfileImage from "@/assets/images/users/user-1.jpg";
import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import NotaryDetails from "../components/profile/NotaryDetails";
import OrgDetails from "../components/profile/OrgDetails";
import SigneeDetails from "../components/profile/SIgneeDetails";

const profile = () => {
  const { role } = useSelector((state) => state.detailsReducer);
  const [detailformsSteps, setDetailformSteps] = useState(1);
  const location = useLocation();
  const issignee = location.pathname.startsWith("/admin/profile");
  const isNotary = location.pathname.startsWith("/notary/profile");
  const isOrg = location.pathname.startsWith("/organization/profile");
  const navigate = useNavigate()
  const handlePersonalDetails = () => {
    navigate('/profile/notarydetails')
  }



  return (
    <div>
      <Header />
      <div className=" profile-page flex overflow:hidden">
        <div className="profiel-wrap px-[35px] h-screen flex-col w-[25%] pb-10  pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between  relative z-[1]">
          {/* <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div> */}
          <div className="profile-box items-center	flex-none  text-center pb-[3rem]">
            <div className="md:flex flex-col items-center gap-[1rem] md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                    src={ProfileImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Link
                    to="#"
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  Albert Flores
                </div>
                <div className="text-sm font-light text-slate-600 text-center dark:text-slate-400">
                  {role}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start flex-col gap-[1rem] text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <Button text="Personal Details" className="btn-slate " onClick={()=>setDetailformSteps(1)} />
            <Button text="Documents" className="btn-slate " onClick={()=>setDetailformSteps(2)} />

          </div>
        </div>
        <div className="right-column relative flex-[60%] mt-[5rem]">
          <div className=" flex justify-center items-baseline" style={{ maxWidth: '80%', margin: 'auto' }}>

          
              
              {/* <NotaryDetails detailformsSteps={detailformsSteps} /> */}
              {/* <OrgDetails detailformsSteps={detailformsSteps} /> */}
              <SigneeDetails detailformsSteps={detailformsSteps} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default profile;
