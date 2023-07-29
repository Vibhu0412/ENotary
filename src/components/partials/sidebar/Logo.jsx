import React from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";

// import images
import MobileLogo from "@/assets/images/logo/logo.png";
import MobileLogoWhite from "@/assets/images/logo/logo.png";

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  let title = ''
  let  paddingClassName = ''
  const location = useLocation();
  const isOrganizationPage = location.pathname.startsWith("/organization");
  if (isOrganizationPage) { title = "Organization";  paddingClassName = "pl-[4px]" }
  else { title = "Need44" }


  return (
    <div
      className={` logo-segment flex justify-between items-center bg-slate-50 dark:bg-slate-800 z-[9] py-6  px-4 ${paddingClassName}
      ${menuHover ? "logo-hovered" : ""}
      ${skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
        }
      
      `}
    >
            {/* bg-warning-100 bg-success-100 */}

      <Link to="/dashboard">
        <div className="flex items-center space-x-4">
          <div className="logo-icon">
            {!isDark && !isSemiDark ? (
              <img src={MobileLogo} alt="" />
            ) : (
              <img src={MobileLogoWhite} alt="" />
            )}
          </div>

          {(!collapsed || menuHover) && (
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h1>
            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150
          ${collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-slate-900 dark:bg-slate-400 dark:ring-offset-slate-700"
            }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
