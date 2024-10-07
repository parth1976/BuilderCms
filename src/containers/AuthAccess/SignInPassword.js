import React from 'react';
import { Form, Input, Button } from 'antd';
import { F_FavIcon } from '../../Icons';
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import { callAPI } from '../../utils/api';
import { BASE_URL, TOKEN_KEY } from '../../constanats';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../reducers/auth';
import { useNavigate } from 'react-router-dom';

const SignInPassword = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            callAPI("POST" , `${BASE_URL}/auth/login` , values)
            .then((res) => {
                if(res && res.code == "OK"){
                    const user = res?.data && res?.data.user;
                    const token = res?.data?.tokens?.access?.token;
                    notify("sucess" , res?.data?.message)
                    if (user) {
                        UtilLocalService.setLocalStorage('user', user);
                        dispatch(setAuthUser({ ...user }));
                    }
                    if (token) {
                        UtilLocalService.setLocalStorage(TOKEN_KEY, token);
                        if (user?.email) {
                            navigate("/dashboard");
                        }
                    }
                }
            })
        } catch (err) {
            console.log('🙄', err?.message);
        }
    };


    return (
        <React.Fragment>
            <div className="f_login">
                <div className="f_login-box">
                    <div className="f_login-header f_flex f_flex-col f_content-center f_align-center">
                        <F_FavIcon />
                        <h1>Login</h1>
                    </div>
                    <div className="f_login-content">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onSubmit}
                            className="authFormItems"
                            size="large"
                            autoComplete="off"
                        >
                            <Form.Item
                                className="label"
                                label="Email"
                                name="username"
                                normalize={(value) => value.trim()}
                                rules={[
                                    {
                                        required: true,
                                        validator(_, value) {
                                            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[0-9]{10}$/.test(value)) {
                                                return Promise.resolve();
                                            } else if (value) {
                                                return Promise.reject(new Error('Please input valid Email'));
                                            } else {
                                                return Promise.reject(new Error('Please input Email'));
                                            }
                                        },
                                    },
                                ]}
                            >
                                <Input placeholder="Enter Email" autoFocus />
                            </Form.Item>
                            <Form.Item
                                className="label f_mb-20"
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password.',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>
                            <Form.Item className='f_mb-0'>
                                <Button block type="primary" htmlType="submit">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SignInPassword;
