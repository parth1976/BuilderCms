import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CustomRoute from "./CustomRoute";
import Sidebar from "./Sidebar.jsx";
import { ROUTES } from "../constanats/routes.js";
import { USER_SIDEBAR_MENU } from "../constanats/sidebar.js";
import Header from "./Header.jsx";
import { F_FavIcon, F_SidebarDrawerIcon, F_SidebarLogoIcon } from "../Icons";
import { getFiles } from "../reducers/files.js";
import { useDispatch } from "react-redux";

const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);
  const defaultPath = "/404";

  const isTransaction = useMemo(() => {
    return (
      location.pathname.includes("/party/view") ||
      location.pathname.includes("/party/create")
    );
  }, [location.pathname]);

  useEffect(() => {
    dispatch(getFiles());
  },[])

  return (
    <React.Fragment>
      <div
        className={`f_flex f_flex-row f_layout ${isSidebarCollapse ? "f_sidebarsmall" : ""}`}>
        {!isTransaction && (
          <div className="f_sidebar f_flex f_flex-col">
            <div className="f_sidebar-logo f_flex f_content-center f_align-center">
              <div className="f_flex f_align-center f_content-between">
                {!isSidebarCollapse ? (
                  <div>
                    <F_SidebarLogoIcon />
                  </div>
                ) : (
                  <div>
                    <F_FavIcon width="20px" height="20px" />
                  </div>
                )}
                <span
                  className="f_ml-10 f_cp f_flex f_align-center f_content-center f_sidebar-drawer-icon"
                  onClick={() => setIsSidebarCollapse(!isSidebarCollapse)}
                >
                  <F_SidebarDrawerIcon />
                </span>
              </div>
            </div>
            <Sidebar
              routes={USER_SIDEBAR_MENU}
              isSidebarCollapse={isSidebarCollapse}
            />
          </div>
        )}

        <section className="f_layout-content f_flex f_flex-col f_flex-row">
          {!isTransaction && <Header />}
          <div className="f_content-main">
            <Routes>
              {ROUTES?.map((route) => (
                <Route exact element={<CustomRoute route={route} />}>
                  <Route path={route.path} element={<route.component />} />
                </Route>
              ))}
              <Route path="*" element={<Navigate to={defaultPath} />} />
            </Routes>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
};
export default Layout;
