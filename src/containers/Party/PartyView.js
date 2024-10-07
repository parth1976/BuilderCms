import React, { useEffect, useState } from 'react'
import { Tooltip, Table, Button, Row, Form, Input, Col, DatePicker, Pagination, Modal, Select, Checkbox, Popover, Tag } from "antd";
import { F_BackArrowIcon, F_DeleteIcon, F_DownloadExcelIcon, F_DownloadPdfIcon, F_EditIcon, F_EyeIcon, F_FilterIcon, F_PlusIcon } from "../../Icons";
import { useNavigate } from 'react-router-dom';
import { BASE_URL, PAYMENT_MODE, TENURE, TOKEN_KEY } from '../../constanats';
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import { calculateEmi } from './caculateEmi';
import { callAPI } from '../../utils/api';
import { useSelector } from 'react-redux';
import { render } from '@testing-library/react';
import axios from 'axios';

const PartyView = () => {
  const [finalHeight, setFinalHeight] = useState("");
  const [visibleModal, setIsVisibleModal] = useState(false);
  const navigate = useNavigate();
  const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
  const partyId = window.location.pathname.split("/")[3]
  const [form2] = Form.useForm();
  const [form] = Form.useForm();
  const houseNumber = Form.useWatch("houseNumber", form); // Watch paymentMode value
  const remainPayment = Form.useWatch("remainingAmount", form); // Watch paymentMode value
  const totalPayment = Form.useWatch("payment", form); // Watch paymentMode value
  const paymentModes = Form.useWatch("paymentMode", form2); // Watch paymentMode value
  const [selectedPaymentId, setSelctedPaymentId] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const optionsType = [
    { value: 1, label: "Credit" },
    { value: 2, label: "Debit" },
  ];

  const paymentMode = [
    { value: 1, label: "Cheque" },
    { value: 2, label: "Cash" },
  ];

  useEffect(() => {
    let mainContentHeader = document.querySelector(".f_content-main-header");
    let mainHeight = mainContentHeader?.offsetHeight;
    setFinalHeight(mainHeight);
  }, [window?.location?.pathname]);

  const handleFilterPopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Debit</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Credit</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const handleFilterPaymentPopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Cash</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Cheque</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const handleFilterEmiTypePopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Master</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Regular</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const handleFilterStatusPopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>On-Time</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Advanced</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Overdue</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Pending</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const options = [
    { value: TENURE.MONTHLY, label: "Monthly" },
    { value: TENURE.QUARTERLY, label: "Quarterly" },
    { value: TENURE.SEMI_ANNUAL, label: "HalfYearly" },
    { value: TENURE.ANNUAL, label: "Yearly" },
  ];

  const dateOptions = Array.from({ length: 28 }, (_, index) => {
    const value = (index + 1).toString().padStart(2, '0'); // Format to '01', '02', etc.
    return { value, label: value };
  });

  const fetchPartyDetails = () => {
    callAPI("GET", `${BASE_URL}/user/party/${partyId}`)
      .then((res) => {
        form.setFieldsValue(res?.data);
      })
      .catch((err) => {
        notify("error", "Failed to fetch party details", err.message);
      });
  }

  const fetchPartyEmis = () => {
    callAPI("POST", `${BASE_URL}/user/payment/paginate`, { filter: { partyId } })
      .then((res) => {
        if (res && res.code == "OK") {
          setData(res?.data?.list)
        }
      })
  }

  useEffect(() => {
    if (partyId) {
      fetchPartyDetails();
      fetchPartyEmis();
    }
  }, [])

  const findStatus = (code) => {
    let color, text, classname;
    if (code === 2) {
      text = 'On-Time';
      classname = 'ant-tag-success'
    } else if (code === 4) {
      text = 'Overdue';
      classname = "ant-tag-error"
    } else if (code === 1) {
      text = 'Pending';
      classname = "ant-tag-warning"
    } else if (code === 3) {
      text = 'Advanced';
      classname = "processing_tag"
    }
    return <Tag color={color} className={classname}>{text}</Tag>
  }

  const [data, setData] = React.useState([]);


  const partyViewList = [
    {
      title: 'Sr. No.',
      id: "row",
      key: "row",
      dataIndex: 'key',
      width: "5%",
      render: (x, props, index) => (
        <span>{index + 1}</span>
      )
    },
    {
      title: 'Reminder Date',
      dataIndex: 'reminderDate',
      id: 'reminderDate',
      key: 'reminderDate',
    },
    {
      title: <div className='f_flex f_align-center'><span>EMI Type</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={handleFilterEmiTypePopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      id: "emiType",
      key: "emiType",
      dataIndex: 'emiType',
      render: (emiType) => {
        return emiType == 2 ? "Master" : "Regular";
      }
    },
    {
      title: 'EMI Payment',
      dataIndex: 'payment',
      id: 'payment',
      key: 'payment',
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>Transaction Type</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={handleFilterPopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      dataIndex: 'transactionType',
      id: 'transactionType',
      key: 'transactionType',
      className: 'f_text-center',
      render: (transactionType) => {
        return transactionType == 1 ? "Credit" : transactionType == 2 ? "Debit" : "-";
      }
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>Payment Mode</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={handleFilterPaymentPopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      dataIndex: 'paymentMode',
      id: 'paymentMode',
      key: 'paymentMode',
      className: 'f_text-center',
      render: (paymentMode) => {
        return paymentMode == PAYMENT_MODE.CASH ? "Cash" : paymentMode == PAYMENT_MODE.CHAQUE ? "Cheque" : paymentMode == PAYMENT_MODE.ETRANSAFER ? "E-Transfer" : "-";
      }
    },
    {
      title: 'Collecting Date',
      dataIndex: 'reminderDate',
      id: 'reminderDate',
      key: 'reminderDate',
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>Status</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={handleFilterStatusPopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      id: "status",
      key: "status",
      className: 'f_text-center',
      dataIndex: 'status',
      render: (x, props) => {
        return (
          <>
            {
              findStatus(x)
            }
          </>
        )
      },
    },
    {
      id: "action",
      key: "action",
      width: "7%",
      title: <span>Action</span>,
      render: (x, props, index) => {
        return (
          <div className='f_flex f_align-center f_content-center'>
            <Tooltip placement="bottom" title={'Edit'}>
              <span className="f_cp f_icon-small-hover f_flex f_align-center f_content-center f_mr-5" onClick={() => { setIsVisibleModal(true); form2.setFieldsValue({ payment: props?.payment }); setSelctedPaymentId(props?._id); }}><F_EditIcon width='14px' height='14px' /></span>
            </Tooltip>
            <Tooltip placement="bottom" title={'Delete'}>
              <span className="f_cp f_icon-small-hover f_icon-small-hover-delete f_flex f_align-center f_content-center f_mr-5" onClick={() => { setDeleteConfirm(true); setSelctedPaymentId(props?._id); }}><F_DeleteIcon width='14px' height='14px' /></span>
            </Tooltip>
          </div>
        )
      }
    },
  ]

  const finalData = data.map((val, index) => ({
    ...val, key: index + 1
  }));

  const handleChange = () => {
    const formValues = form.getFieldsValue();
    const data = calculateEmi(formValues);
    if (data) {
      form.setFieldsValue({ remainingAmount: data })
    }
  }

  const handlePartyCreation = (values) => {
    const method = partyId ? "PATCH" : "POST";
    const url = partyId ? `${BASE_URL}/user/party/${partyId}` : `${BASE_URL}/user/party/create-party`;
    if (partyId) {
      delete values?.houseNumber
    }
    callAPI(method, url, { ...values, fileId: selectedCompany?._id })
      .then((res) => {
        if (res && res.code == "OK") {
          window.location.replace(`/party/view/${res?.data?.party?._id}`);
          notify("sucess", res.message)
          setData(res?.data?.payments)
          setIsVisibleModal(false);
          form.resetFields();
        }
      })
      .catch((err) => {
        notify("error", err.message)
      })
  }

  const handlePaymentStatusUpdate = (values) => {
    callAPI("PATCH", `${BASE_URL}/user/payment/${selectedPaymentId}`, { ...values, partyId, fileId: selectedCompany?._id })
      .then((res) => {
        if (res && res.code === "OK") {
          notify("success", "Payment status updated successfully");
          fetchPartyEmis(); // Refresh the EMI list
          setIsVisibleModal(false)
        }
      })
      .catch((err) => {
        notify("error", "Failed to update payment status", err.message);
      });
  }

  const downloadFile = async (id, fileName) => {
    axios
      .post(`${BASE_URL}/user/payment/download-xls`, { filter: { partyId } }, {
        responseType: "arraybuffer",
        headers: {
          Authorization: "Bearer " + UtilLocalService.getLocalStorage(TOKEN_KEY),
        },
      })
      .then((response) => {
        var blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", houseNumber);
        document.body.appendChild(link);
        link.click();
      });
  };

  const handlePaymentIdDelete = () => {
    const body = {
      partyId: partyId,
      paymentIdArray: [selectedPaymentId]
    }
    callAPI("POST", `${BASE_URL}/user/payment/delete`, body, {})
      .then((res) => {
        //TODO: check  for if user first removed staff or client from particular role or not
        res?.code === "OK" && res?.status ? notify("success", res?.message) : notify("error", res?.message);
        res?.code === "E_NOT_FOUND" && notify("error", res?.message)
        fetchPartyEmis();
        fetchPartyDetails();
        setDeleteConfirm(false);
        setSelctedPaymentId('')
      })
      .catch((err) => {
        notify("error", err?.message);
      });
  };

  return (
    <React.Fragment>
      <div className='f_content-main-header f_flex f_align-center f_content-between'>
        <div className='f_flex f_align-center'>
          <span className="f_cp f_back-button" onClick={() => navigate(-1)}>
            <F_BackArrowIcon fill="#7F72FF" width="12px" height="12px" />
          </span>
          <h6 className='f_ml-10'>Party Details</h6>
        </div>
        <div className='f_flex f_align-center f_content-end'>
          <div className='f_ml-10'>
            <h6>Remaining Payment: <span className='f_ml-5 f_color-primary-500'>{remainPayment || 0}</span></h6>
          </div>
          <div className='f_ml-10'>
            <h6>Total Payment: <span className='f_ml-5 f_color-primary-500'>{totalPayment || 0}</span></h6>
          </div>
        </div>
      </div>

      <div className="f_content-main-inner f_pt-10 f_pl-10 f_pr-10 f_viewparty" style={{ height: `calc(100vh - ${finalHeight}px)` }}>

        <div className='f_viewparty-bg'>
          <div className='f_viewparty-header f_flex f_align-center f_content-between'>
            <h6 className='f_flex f_align-center'>
              House No: <span>{houseNumber}</span>
            </h6>
            <div className='f_flex f_align-center f_content-end'>
              <div className='f_ml-10'>
                <Button type='primary' onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      handlePartyCreation(values);
                    })
                    .catch((info) => {
                      console.log('Validation Failed:', info);
                    });
                }}>Save</Button>
              </div>
            </div>
          </div>

          <div className='f_viewparty-content f_p-10'>
            <Form layout="vertical" size='large' form={form} onChange={(e) => handleChange(e)} initialValues={{ regularTenure: 1, masterTenure: 2, reminderDateRegular: "1", reminderDateMaster: "1" }}>
              <Row gutter={10}>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='House no.'
                    name="houseNumber"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter House no.' }]}>
                    <Input
                      placeholder='Enter Your House no.'
                      autoComplete='off'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Party Name'
                    name="ownerName"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Party Name' }]}>
                    <Input
                      placeholder='Enter Your Party Name'
                      autoComplete='off'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <div className='f_flex f_align-center'>
                    <Form.Item
                      label='Mobile No.'
                      name="mobileNumber"
                      className='f_mb-10 f_w-100'
                      normalize={(value, prevValue) => {
                        value = value?.trim();
                        prevValue = prevValue?.trim();
                        if (RegExp(/^[0-9]+$/).test(value)) {
                          return value;
                        }
                        if (prevValue !== undefined && value !== '' && RegExp(/^[0-9]+$/).test(prevValue)) {
                          return prevValue;
                        }
                        return null;
                      }}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter mobile number.'
                        },
                        {
                          len: 10,
                          message: 'Mobile number should be of 10 digits.',
                        }
                      ]}
                    >
                      <Input
                        placeholder='Enter Your Mobile no.'
                        autoComplete='off'
                        maxLength={10}
                      />
                    </Form.Item>
                    <Tooltip title="Add Mobile" placement='bottom'><Button type='default' className='f_flex f_align-center f_content-center f_cp f_ml-10 f_mt-20'><F_PlusIcon width='14px' height='14px' fill='#7F72FF' /></Button></Tooltip>
                  </div>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Broker Name'
                    name="brokerName"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Broker Name' }]}>
                    <Input
                      placeholder='Enter Your Broker Name'
                      autoComplete='off'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Broker Mobile No.'
                    name="brokerMobileNumber"
                    className='f_mb-10'
                    normalize={(value, prevValue) => {
                      value = value?.trim();
                      prevValue = prevValue?.trim();
                      if (RegExp(/^[0-9]+$/).test(value)) {
                        return value;
                      }
                      if (prevValue !== undefined && value !== '' && RegExp(/^[0-9]+$/).test(prevValue)) {
                        return prevValue;
                      }
                      return null;
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter mobile number.'
                      },
                      {
                        len: 10,
                        message: 'Mobile number should be of 10 digits.',
                      }
                    ]}
                  >
                    <Input
                      placeholder='Enter Your Broker Mobile No.'
                      autoComplete='off'
                      maxLength={10}
                    />
                  </Form.Item>
                </Col>
                {!partyId && <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Booking Date'
                    name="bookingDate"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Booking Date' }]}>
                    <DatePicker
                      placeholder='Select Booking Date'
                      className='f_w-100'
                    />
                  </Form.Item>
                </Col>}
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Payment'
                    name="payment"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Payment' }]}
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                  >
                    <Input
                      placeholder='Enter Your Payment'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Down Payment'
                    name="downPayment"
                    className='f_mb-10'
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                    rules={[{ required: true, message: 'Please enter Down Payment' }]}>
                    <Input
                      placeholder='Enter Your Down Payment'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Month'
                    name="month"
                    className='f_mb-10'
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                    rules={[{ required: true, message: 'Please enter Month' }]}>
                    <Input
                      placeholder='Enter Your Month'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Regular EMI'
                    name="regularEMI"
                    className='f_mb-10'
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                    rules={[{ required: true, message: 'Please enter Regular EMI' }]}>
                    <Input
                      placeholder='Enter Your Regular EMI'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Regular Tenure'
                    name="regularTenure"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Regular Tenure' }]}>
                    <Select
                      options={options}
                      defaultValue={1}
                      isSearchable={true}
                      listHeight={140}
                      placeholder="Select Regular Tenure"
                      size="large"
                      onChange={(e) => { form.setFieldsValue({ regularTenure: e }); handleChange(); }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Regular Reminder Date'
                    name="reminderDateRegular"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Reminder Date' }]}>
                    <Select
                      options={dateOptions}
                      defaultValue={1}
                      isSearchable={true}
                      listHeight={140}
                      placeholder="Select Regular Tenure"
                      size="large"
                      onChange={(e) => { form.setFieldsValue({ regularReminderDate: e }); }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Master EMI'
                    name="masterEMI"
                    className='f_mb-10'
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                    rules={[{ required: true, message: 'Please enter Master EMI' }]}>
                    <Input
                      placeholder='Enter Your Master EMI'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Master Tenure'
                    name="masterTenure"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Master Tenure' }]}>
                    <Select
                      defaultValue={3}
                      options={options}
                      isSearchable={true}
                      listHeight={140}
                      placeholder="Select Master Tenure"
                      size="large"
                      onChange={(e) => { form.setFieldsValue({ masterTenure: e }); handleChange(); }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Master Reminder Date'
                    name="reminderDateMaster"
                    className='f_mb-10'
                    rules={[{ required: true, message: 'Please enter Reminder Date' }]}>
                    <Select
                      options={dateOptions}
                      defaultValue={1}
                      isSearchable={true}
                      listHeight={140}
                      placeholder="Select date"
                      size="large"
                      onChange={(e) => { form.setFieldsValue({ masterReminderDate: e }); }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={6} xl={6} xxl={4}>
                  <Form.Item
                    label='Remaining Payment'
                    name="remainingAmount"
                    className='f_mb-10'
                    getValueFromEvent={(event) => parseFloat(event.target.value)}
                    rules={[{ required: true, message: 'Please enter Remaining Payment' }]}>
                    <Input
                      placeholder='Enter Your Remaining Payment'
                      autoComplete='off'
                      type='number'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={12} xl={12} xxl={12}>
                  <Form.Item
                    label='Narration'
                    name="narration"
                    className='f_mb-0'
                    rules={[{ required: false, message: 'Please enter Narration' }]}>
                    <Input.TextArea
                      placeholder='Enter Your Narration'
                      autoComplete='off' allowClear
                      style={{
                        height: 100,
                        resize: 'none',
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} sm={12} md={12} xl={12} xxl={12}>
                  <Form.Item
                    label='Condition'
                    name="condition"
                    className='f_mb-0'
                    rules={[{ required: false, message: 'Please enter Condition' }]}>
                    <Input.TextArea
                      placeholder='Enter Your Condition'
                      autoComplete='off' allowClear
                      style={{
                        height: 100,
                        resize: 'none',
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>

        {partyId && <div className='f_viewparty-bg f_mt-10'>
          <div className='f_viewparty-header f_flex f_align-center f_content-between'>
            <h6 className='f_flex f_align-center'>
              Payment Details
            </h6>
            <div className='f_flex f_align-center f_content-end'>
              <div className='f_ml-10'>
                <h6 className='f_flex f_align-center'>
                  Complete Payment: <span>{form.getFieldValue('totalPaidAmount')}</span>
                </h6>
              </div>
              <div className='f_ml-10'>
                <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Add</Button>
              </div>
              <div className='f_ml-10'>
                <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
              </div>
              <div className='f_ml-10'>
                <Tooltip title="Download Excel" placement='bottom' oncl><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon' onClick={() => downloadFile()}><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
              </div>
            </div>
          </div>

          <div className='f_viewparty-content'>
            <Table columns={partyViewList}
              dataSource={finalData}
              pagination={false}
              className='f_listing-antd-table'
            // summary={() => (
            //   <Table.Summary fixed>
            //     <Table.Summary.Row className='f_ant-table-summary-fixed'>
            //       <Table.Summary.Cell className="f_text-right f_fw-600" index={0} colSpan={3}>Total:</Table.Summary.Cell>
            //       <Table.Summary.Cell className="f_text-left f_fw-600" index={1}><span className='f_color-primary-500 '>₹ 10,000</span></Table.Summary.Cell>
            //       <Table.Summary.Cell index={3}></Table.Summary.Cell>
            //       <Table.Summary.Cell index={4}></Table.Summary.Cell>
            //       <Table.Summary.Cell index={5}></Table.Summary.Cell>
            //       <Table.Summary.Cell index={6}></Table.Summary.Cell>
            //       <Table.Summary.Cell index={7}></Table.Summary.Cell>
            //     </Table.Summary.Row>
            //   </Table.Summary>
            // )}
            />
          </div>
        </div>}
      </div>

      {visibleModal && <Modal
        title="Edit Add Payment Details"
        okText="Save"
        width="700px"
        open={visibleModal}
        cancelText="Cancel"
        onCancel={() => { setIsVisibleModal(false); form2.resetFields(); }}
        onOk={() => {
          form2
            .validateFields()
            .then((values) => {
              handlePaymentStatusUpdate(values);
            })
            .catch((info) => {
              console.log('Validation Failed:', info);
            })
        }
        }
      >
        <Form layout="vertical" size='large' form={form2} initialValues={{ transactionType: 1, paymentMode: 2 }}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label='Transaction Type'
                name="transactionType"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Transaction Type' }]}>
                <Select
                  options={optionsType}
                  isSearchable={true}
                  listHeight={140}
                  placeholder="Select Transaction Type"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Payment Mode'
                name="paymentMode"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Payment Mode' }]}>
                <Select
                  options={paymentMode}
                  isSearchable={true}
                  listHeight={140}
                  placeholder="Select Payment Mode"
                  size="large"
                  onChange={(e) => form2.setFieldsValue({ paymentMode: e })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Payment'
                name="payment"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Payment' }]}>
                <Input
                  placeholder='Enter Your Payment'
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
            {paymentModes == 1 && (<><Col span={8}>
              <Form.Item
                label='Cheque no.'
                name="cheque_number"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Cheque no.' }]}>
                <Input
                  placeholder='Enter Your Cheque no.'
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
              <Col span={8}>
                <Form.Item
                  label='Bank Name'
                  name="bank_name"
                  className='f_mb-10'
                  rules={[{ required: true, message: 'Please enter Bank Name' }]}>
                  <Input
                    placeholder='Enter Your Bank Name'
                    autoComplete='off'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='Account No.'
                  name="account_number"
                  className='f_mb-10'
                  rules={[{ required: true, message: 'Please enter Account No.' }]}>
                  <Input
                    placeholder='Enter Your Account No.'
                    autoComplete='off'
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label='Cheque Date'
                  name="cheque_date"
                  className='f_mb-10'
                  rules={[{ required: true, message: 'Please enter Cheque Date' }]}>
                  <DatePicker
                    placeholder='Select Cheque Date'
                    className='f_w-100'
                  />
                </Form.Item>
              </Col></>)}
            <Col span={8}>
              <Form.Item
                label='Collecting Date'
                name="collectingDate"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Collecting Date' }]}>
                <DatePicker
                  placeholder='Select Collecting Date'
                  className='f_w-100'
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='Narration'
                name="narration"
                className='f_mb-10'
                rules={[{ required: false, message: 'Please enter Narration' }]}>
                <Input.TextArea
                  placeholder='Enter Your Narration'
                  autoComplete='off' allowClear
                  style={{
                    height: 100,
                    resize: 'none',
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="isPaid" // This binds the form field to the checkbox
                valuePropName="checked" // Ensure 'checked' is used for the checkbox value
                className='f_flex f_align-center'
              >
                <Checkbox className='f_flex f_align-center' value={form2.getFieldsValue("isPaid")} onChange={(e) => form2.setFieldsValue({ isPaid: e.target.checked })}><span className='f_fs-16 f_fw-600'>Done</span></Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>}

      <Modal
        open={deleteConfirm}
        title="Delete"
        className='s_delete-confirm'
        onCancel={() => setDeleteConfirm(false)}
        okText="Delete"
        cancelText="Cancel"
        onOk={() => handlePaymentIdDelete()}
      >
        <p className="s_text-left s_fs-14 s_mb-10"> Are you sure you want to delete this record ?</p>
        {/* <div className='s_flex s_align-center s_content-end'> <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button> <Button className='s_ml-10' onClick={() => handleRoleDelete(actionData?._id)} danger type="primary">Delete</Button></div> */}
      </Modal>

    </React.Fragment >
  )
}

export default PartyView