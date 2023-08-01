import React, { useContext } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import Icon from '@/components/ui/Icon';
import { Menu, Transition } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout } from '@/pages/auth/common/store';
import { UserContext } from '../../../../pages/auth/common/context';
import UserAvatar from '@/assets/images/all-img/user.png';

import { useLogoutMutation } from '../../../../services/authService';

const profileLabel = () => {
  const user = useSelector(state => state.auth.user);

  return (
    <div className="flex items-center text-white">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src={UserAvatar}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-white dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap block">
          {user?.name}
          <div className="text-[11px]">{user?.userType}</div>
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, extra] = useLogoutMutation();


  // Function to handle logout and navigate to "/signee-login" page
  const handleLogoutClick = async () => {

    try {
      // Call the logout API using the mutate function from useLogoutMutation hook
      const response = await logout();
      console.log("AHAHHAHAHAHHAHAHAHAH --->", response)

      // Check if the API call was successful 
      if (response?.data?.success) {
        // Handle successful logout
        
        // Pass the callback function to the action
        console.log("Vaibhav BEfore")
        dispatch(handleLogout({ callback: navigateToSigneeLogin }));
        navigate('/signee-login');
        console.log("Vaibhav After")

        console.log('Logout successful!');
      } else {
        dispatch(handleLogout({ callback: navigateToSigneeLogin }));
        // Handle logout failure, you can show a toast or dispatch an error action if needed
        console.log('Logout failed:', response?.data?.message || 'Unknown error');
      }

      // Navigate to "/signee-login" page after successful logout
      // navigate('/signee-login');
    } catch (error) {
      // Handle any error that occurred during the API call
      console.error('Error during logout:', error.message);
    }

    
  };

  // Function to navigate to "/signee-login" page
  const navigateToSigneeLogin = () => {
    console.log("I am called CALLBACK")
    // Import the useNavigate hook here, as hooks can only be used in functional components
    navigate('/signee-login');
  };

  const ProfileMenu = [
    {
      label: 'Profile',
      icon: 'heroicons-outline:user',
      action: () => {
        navigate('/profile');
      },
    },
    {
      label: 'Settings',
      icon: 'heroicons-outline:cog',
      action: () => {
        navigate('/settings');
      },
    },
    {
      label: 'Logout HAHA',
      icon: 'heroicons-outline:login',
      action: () => {
        handleLogoutClick();
      },
    },
  ];

  return (
    <Dropdown
      label={profileLabel()}
      classMenuItems="w-[180px] text-white top-[58px]"
    >
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50'
                  : 'text-slate-600 dark:text-slate-300'
              } block     ${
                item.hasDivider
                  ? 'border-t border-slate-100 dark:border-slate-700'
                  : ''
              }`}
            >
              <div className={`block cursor-pointer  px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
