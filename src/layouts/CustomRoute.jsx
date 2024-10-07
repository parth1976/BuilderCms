import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const CustomRoute = ({ route }) => {
    const authUser = useSelector((state) => state.auth.authUser);
    // const userPermission = useSelector((state) => state.auth.userPermission);

    // const pathUrl = route.path.split('/');
    // let hasPermission;
    let defaultPath = 'signIn';
    //     defaultPath 

    // if (!authUser) {
    //     hasPermission = !pathUrl.includes('admin');
    // } else {
    //     defaultPath = '/404';
    //     var UAC = [];
    //     userPermission.map((e) => {
    //         UAC[e.module] = e;
    //     });
    //     hasPermission = UAC[route.module]?.permissions?.view;
    // }


    return authUser ? (
        <Outlet />
    ) : (
        <Navigate to={defaultPath} replace={true} />
    );
};

export default CustomRoute;
