import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Collapse } from 'react-collapse';
import Icon from '@/components/ui/Icon';
import { toggleActiveChat } from '@/pages/app/chat/store';
import { useDispatch } from 'react-redux';
import useMobileMenu from '@/hooks/useMobileMenu';
import Submenu from './Submenu';

const Navmenu = ({ menus }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = i => {
    if (activeSubmenu === i) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(i);
    }
  };

  const location = useLocation();
  const locationName = location.pathname
    .replace('/', '')
    .replace('/organization', '')
    .replace('/signee', '');
  // const locationName = location.pathname.replace("/", "").replace("/organization", "").replace("/notary", "").replace("/signee", "");
  const isOrganizationPage = location.pathname.startsWith('/organization');
  const isNotaryPage = location.pathname.startsWith('/notary');
  const isSigneePage = location.pathname.startsWith('/signee');
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const dispatch = useDispatch();

  useEffect(() => {
    let submenuIndex = null;
    menus.map((item, i) => {
      if (!item.child) return;
      if (item.link === locationName) {
        submenuIndex = null;
      } else {
        const ciIndex = item.child.findIndex(
          ci => ci.childlink === locationName
        );
        if (ciIndex !== -1) {
          submenuIndex = i;
        }
      }
    });
    document.title = `eNotary  | ${locationName}`;

    setActiveSubmenu(submenuIndex);
    dispatch(toggleActiveChat(false));
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [location]);

  let filteredMenus = [];
  if (isOrganizationPage) {
    filteredMenus = menus.filter(item => item.isOrgAdmin);
  } else if (isNotaryPage) {
    filteredMenus = menus.filter(item => item.isNotary);
  } else if (isSigneePage) {
    filteredMenus = menus.filter(item => item.isUser);
  } else {
    filteredMenus = menus.filter(item => item.isNeedAdmin);
  }

  return (
    <>
      <ul>
        {filteredMenus.map((item, i) => (
          <li
            key={i}
            className={` single-sidebar-menu 
              ${item.child ? 'item-has-children' : ''}
              ${activeSubmenu === i ? 'open' : ''}
              ${locationName.includes(item.link) ? 'menu-item-active' : ''}`}
          >
            {/* single menu with no children*/}
            {!item.child && !item.isHeadr && (
              <NavLink className="menu-link" to={item.link}>
                <span className="menu-icon flex-grow-0">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box flex-grow">{item.title}</div>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </NavLink>
            )}
            {/* only for menulabel */}
            {item.isHeadr && !item.child && (
              <div className="menulabel">{item.title}</div>
            )}
            {/* !!sub menu parent */}
            {item.child && (
              <div
                className={`menu-link ${
                  activeSubmenu === i
                    ? 'parent_active not-collapsed'
                    : 'collapsed'
                }`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div
                    className={`menu-arrow transform transition-all duration-300 ${
                      activeSubmenu === i ? ' rotate-90' : ''
                    }`}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}

            <Submenu activeSubmenu={activeSubmenu} item={item} i={i} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Navmenu;
