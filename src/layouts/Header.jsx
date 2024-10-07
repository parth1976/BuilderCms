import React, { useState, useMemo, useEffect } from "react";
import {
  Badge,
  Dropdown as AntDropdown,
  Input,
  Select,
  Row,
  Form,
  Modal,
  Col,
} from "antd";
import {
  F_BankCashIcon,
  F_BankingIcon,
  F_ChangePasswordIcon,
  F_CompanyIcon,
  F_DashboardIcon,
  F_DownArrowIcon,
  F_LogoutIcon,
  F_MultiUserIcon,
  F_NotificationIcon,
  F_ReportLedgerIcon,
  F_UserIcon,
} from "../Icons";
import { useDispatch, useSelector } from "react-redux";
import { callAPI } from "../utils/api";
import { BASE_URL } from "../constanats";
import { setSelectedCompanyData } from "../reducers/files";
import { setAuthUser } from "../reducers/auth";
import UtilLocalService from "../utils/localServiceUtil";

const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [visibleChangesPwdModal, setIsVisibleChangesPwdModal] = useState(false);
  const filesList = useSelector((state) => state.files.allComponies)
  const authUser = useSelector((state) => state.auth.authUser);
  const [companyOptions, setCompanyOptions] = useState([])
  const dispatch = useDispatch();
  const options = [
    { value: "Parth", label: "Parth" },
    { value: "Vijay", label: "Vijay" },
    { value: "Jenil", label: "Jenil" },
    { value: "Jenu Darling", label: "JenuDarling" },
    { value: "Parth Darling", label: "ParthDarling" },
  ];

  const [selectValue, setSelectValue] = useState(authUser?.selectedCompany);

  useEffect(() => {
    if (filesList && filesList.length > 0) {
      const options = filesList.map((x) => ({
        value: x?._id,
        label: x?.name
      }));
      setCompanyOptions(options); // Set the mapped options
    }
  }, [filesList]);

  const Menu = (
    <ul>
      <li
        className="f_flex f_align-center f_cp f_icon-hover"
        onClick={() => setIsVisibleChangesPwdModal(true)}
      >
        <F_ChangePasswordIcon width="14px" height="14px" className="f_mr-5" />
        Change Password
      </li>
      <li className="f_flex f_align-center f_cp f_clear-filter">
        <F_LogoutIcon
          fill="#d1293d"
          width="14px"
          height="14px"
          className="f_mr-5"
        />
        Logout
      </li>
    </ul>
  );

  const containsUrl = (url, checkUrl) => {
    if (url.includes(checkUrl)) {
      return url;
    }
  };

  const getTitle = useMemo(() => {
    const currentUrl = window.location.pathname;
    switch (currentUrl) {
      // Routes
      case containsUrl(currentUrl, "/dashboard"):
        return (
          <div className="f_flex f_align-center">
            <F_DashboardIcon width="18px" height="18px" />
            <h6>Dashboard</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/company"):
        return (
          <div className="f_flex f_align-center">
            <F_CompanyIcon width="18px" height="18px" />
            <h6>Company</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/party"):
        return (
          <div className="f_flex f_align-center">
            <F_MultiUserIcon width="18px" height="18px" />
            <h6>Party</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/reminder"):
        return (
          <div className="f_flex f_align-center">
            <F_NotificationIcon width="18px" height="18px" />
            <h6>Reminder</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/cash-account"):
        return (
          <div className="f_flex f_align-center">
            <F_BankCashIcon width="18px" height="18px" />
            <h6>Cash Account</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/bank-account"):
        return (
          <div className="f_flex f_align-center">
            <F_BankingIcon width="18px" height="18px" />
            <h6>Bank Account</h6>
            <Badge count={0} />
          </div>
        );
      case containsUrl(currentUrl, "/ledger-report"):
        return (
          <div className="f_flex f_align-center">
            <F_ReportLedgerIcon width="18px" height="18px" />
            <h6>Ledger Report</h6>
            <Badge count={0} />
          </div>
        );
      default:
        return <div> &nbsp;</div>;
    }
  }, [window.location?.pathname]);

  const getLogo = () => {
    const img_style = { height: "36px", width: "36px", borderRadius: "50%" };
    const authUser = {
      firstName: "parth",
      lastName: "vadhel",
    };
    try {
      if (authUser?.logoUrl) {
        const path = authUser?.logoUrl;
        return <img src={path} alt={""} style={img_style} />;
      } else {
        return (
          authUser?.firstName
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase() +
          authUser?.lastName
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        );
      }
    } catch (error) { }
  };

  const handleChange = (value) => {
    callAPI("POST", `${BASE_URL}/user/files/changeSelectedFile`, { fileId: value })
      .then((res) => {
        if (res && res.code == "OK") {
          setSelectValue(value)
          UtilLocalService.setLocalStorage('user', res?.data?.user);
          dispatch(setAuthUser(res?.data?.user));
          dispatch(setSelectedCompanyData(res?.data?.fileDetail))
        }
      })
  };

  return (
    <React.Fragment>
      <div
        className="f_flex f_content-between f_align-center f_layout-content-header f_content-between"
        id="f_layout-content-header"
      >
        <div className="f_layout-content-header-breadcrumb">{getTitle}</div>
        {/* {true && (
        <div className="f_layout-content-header-search">
          <Input.Search
            allowClear
            className="f_layout-common-search"
            placeholder={
              !window.location.pathname.includes("/my-companies")
                ? "Search by Name"
                : "Search by Company Name/ID"
            }
          />
        </div>
      )} */}

        <div className="f_flex f_content-end f_align-center">
          <div className="f_ml-10">
            <Select
              options={companyOptions}
              value={selectValue}
              onChange={(e) => handleChange(e)}
              isSearchable={true}
              listHeight={140}
              style={{ maxWidth: "120px", minWidth: "120px" }}
              placeholder="Select Company"
              size="large"
            />
          </div>

          <div className="f_ml-10">
            <AntDropdown
              overlay={visibleChangesPwdModal ? "" : Menu}
              trigger={["click"]}
              overlayClassName="f_common-dropdown"
              className="f_cp f_header-user"
              placement="bottomRight"
            >
              <div
                className="f_flex f_align-center f_cp"
                onClick={() => setCollapsed(!collapsed)}
              >
                <div className="f_flex f_align-center f_content-center">
                  <span className="f_header-user-icon">{getLogo()}</span>
                  <F_DownArrowIcon width="12px" height="12px" />
                </div>
              </div>
            </AntDropdown>
          </div>
        </div>
      </div>

      {visibleChangesPwdModal && (
        <Modal
          title="Changes Password"
          okText="Change Password"
          width="500px"
          open={visibleChangesPwdModal}
          cancelText="Cancel"
          onCancel={() => setIsVisibleChangesPwdModal(false)}
        >
          <Form layout="vertical" size="large" autoComplete="off">
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item
                  className="label f_mb-10"
                  label="Current Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Current password.",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter Current password" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  className="label f_mb-10"
                  label="New Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter New password.",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter New password" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  className="label f_mb-0"
                  label="Confirm Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Confirm password.",
                    },
                  ]}
                >
                  <Input.Password placeholder="Enter Confirm password" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </React.Fragment>
  );
};
export default Header;
