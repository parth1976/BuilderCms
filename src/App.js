import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignInPassword from './containers/AuthAccess/SignInPassword';
// import ForgotPassword from './containers/AuthAccess/ForgotPassword';
// import ResetPassword from './containers/AuthAccess/ResetPassword';
import { ConfigProvider } from 'antd';
import { theme } from './components/Themes/Theme';
import Layout from './layouts/Layout';
import { LoadingOutlined } from '@ant-design/icons';

const PrivateRoute = ({ authToken }) => {
    return authToken ? <Outlet /> : <Navigate to={'/'} replace={true} />;
};

function App() {
    let defaultPath = '/dashboard'
    return (
        <React.Fragment>
            <ConfigProvider theme={theme}>
                <div id="loader">
                    <LoadingOutlined style={{ fontSize: '40px' }} />
                </div>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" exact element={<Navigate to={true ? defaultPath : '/signIn'} />} />
                        <Route path="/signIn" exact element={<SignInPassword />} />
                        {/* <Route path="/forgot-password" exact element={<ForgotPassword />} />
                        <Route path="/reset-password" exact element={<ResetPassword />} /> */}
                        <Route exact element={<PrivateRoute authToken={true} />}>
                            <Route path="*" element={<Layout />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </React.Fragment>
    );
}

export default App;
