import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ routes, isSidebarCollapse }) => {

    return (
        <React.Fragment>
            <ul className={`f_sidebar-menu f_m-0`}>
                {routes.map((route, i) => {
                    return <SubMenuNavLink route={route} index={i} key={i} isSidebarCollapse={isSidebarCollapse} />;
                })}
            </ul>
        </React.Fragment>
    );
};
export default Sidebar;

const SubMenuNavLink = ({ route, isSidebarCollapse }) => {
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    useEffect(() => {
        setSelectedKey(location.pathname);

        if (
            location.pathname.includes('/tax-invoice') ||
            location.pathname.includes('/sales-invoice') ||
            location.pathname.includes('/business-invoice')
        ) {
            setOpenKeys(['/dashboard']);
        }
        else {
            setOpenKeys([]);
        }
    }, [window.location.pathname]);

    return (
        <React.Fragment>
            {!route.subMenu && (
               <Tooltip title={isSidebarCollapse ? route.name : null} placement='right'> <li
                    className={`f_cp f_sidebar-menu-inner ${selectedKey == route.path ? 'f_menu-active' : ''} ${route?.isComingSoon ? 'f_coming-active' : ''
                        }`}
                >
                    <Link
                        to={`${route.path}`}
                    >
                        
                            <span className="f_sidebar-menu-inner-icon">{route?.icon}</span>
                        
                        {!isSidebarCollapse && <span className="f_sidebar-menu-inner-name">{route.name}</span>}
                        {route?.isComingSoon && <label className="f_mb-0 f_coming-soon">Coming Soon</label>}
                    </Link>
                </li>
                </Tooltip>
            )}
        </React.Fragment>
    );
};
