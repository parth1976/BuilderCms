import React, { useEffect, useState } from 'react'
import { Input, Tooltip, Table, Pagination, Checkbox, Tag, Popover, DatePicker, Col, Form, Modal, Select, Row, Radio } from "antd";
import { F_DownloadExcelIcon, F_DownloadPdfIcon, F_EditIcon, F_FilterIcon } from "../../Icons";
import { useSelector } from 'react-redux';
import { callAPI } from '../../utils/api';
import { BASE_URL, PAYMENT_STATUS, TOKEN_KEY } from '../../constanats';
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import moment from 'moment';
import { render } from '@testing-library/react';
import axios from 'axios';

const { RangePicker } = DatePicker;

const Reminder = () => {

  const [visibleModal, setIsVisibleModal] = useState(false);
  const [finalHeight, setFinalHeight] = useState("");
  const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
  const [filter, setFilter] = useState({
    page: 1,
    limit: 20,
  })
  const [pageLimit, setPageLimit] = React.useState(20);
  const [totalPages, settotalPages] = React.useState(0);
  const [searchComp, setSearchComp] = useState([]);
  const [inputTimeout, setInputTimeout] = useState(null);
  const [form2] = Form.useForm();
  const paymentModes = Form.useWatch("paymentMode", form2); // Watch paymentMode value
  const [selectedPaymentId, setSelctedPaymentId] = useState("")
  const [selectedPartyId, setSelctedPartyId] = useState("");
  const [options, setOptions] = useState([]);
  const { Option } = Select;
  const [selectedEmiTypes, setSelectedEmiTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const optionsType = [
    { value: 1, label: "Credit" },
    { value: 2, label: "Debit" },
  ];

  const paymentMode = [
    { value: 1, label: "Cheque" },
    { value: 2, label: "Cash" },
  ];

  const handlePaymentStatusUpdate = (values) => {
    callAPI("PATCH", `${BASE_URL}/user/payment/${selectedPaymentId}`, { ...values, fileId: selectedCompany?._id, partyId: selectedPartyId })
      .then((res) => {
        if (res) {
          notify("success", "Payment status updated successfully");
          fetchData(); // Refresh the EMI list
          setIsVisibleModal(false)
          setSelctedPaymentId('')
          setSelctedPartyId('')
        }
      })
      .catch((err) => {
        notify("error", "Failed to update payment status", err.message);
      });
  }

  const handleDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        filter: {
          ...prevFilter.filter,
          reminderDate: {
            startDate: dates[0].format("YYYY-MM-DD"),
            endDate: dates[1].format("YYYY-MM-DD"),
          },
        },
      }));
    } else {
      // If no dates are selected, remove reminderDate from the filter
      setFilter((prevFilter) => {
        const { reminderDate, ...restFilter } = prevFilter.filter;
        return {
          ...prevFilter,
          filter: restFilter,
        };
      });
    }
  };


  useEffect(() => {
    let mainLayoutHeader = document.getElementById("f_layout-content-header");
    let mainContentHeader = document.querySelector(".f_content-main-header");
    let paginationHeight = document.querySelector(".f_content-main-pagination");
    let mainHeight = mainLayoutHeader?.offsetHeight + mainContentHeader?.offsetHeight + paginationHeight?.offsetHeight;
    setFinalHeight(mainHeight);
  }, [window?.location?.pathname]);


  const [data, setData] = React.useState('');

  useEffect(() => {
    if (selectedCompany?._id) {
      setFilter({
        filter: {
          fileId: selectedCompany?._id
        },
        ...filter
      })
    }
  }, [selectedCompany])

  const fetchData = () => {
    const body = { ...filter }
    body.limit = pageLimit;
    callAPI("POST", `${BASE_URL}/user/payment/paginate`, body)
      .then((res) => {
        setData(res.data.list);
        settotalPages(res?.data?.count)
      })
      .catch((err) => {
        notify("error", "Failed to fetch data", err.message);
      });
  }

  useEffect(() => {
    if (selectedCompany && filter?.filter) {
      fetchData();
    }
  }, [filter])

  const handleFilterPopover = (data) => {
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

  const clearSelection = () => {
    setSelectedEmiTypes([]);
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter.filter };
      delete newFilter.emiType;

      return {
        ...prevFilter,
        filter: newFilter,
      };
    });
  };

  const content = () => (
    <ul>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedEmiTypes.includes(1)}
          onChange={() => handleCheckboxChange(1)}
        >
          Regular
        </Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedEmiTypes.includes(2)}
          onChange={() => handleCheckboxChange(2)}
        >
          Master
        </Checkbox>
      </li>
      <li className="f_clear-filter f_cp" onClick={clearSelection}>
        Clear
      </li>
    </ul>
  );

  const handleCheckboxChangeStatus = (status) => {
    setSelectedStatus((prevSelected) => {
      const newSelected = prevSelected.includes(status)
        ? prevSelected.filter((s) => s !== status)
        : [...prevSelected, status];

      // Update the filter based on selected status
      setFilter((prevFilter) => {
        const newFilter = { ...prevFilter.filter };

        if (newSelected.length > 0) {
          newFilter.status = newSelected;
        } else {
          delete newFilter.status;
        }

        return {
          ...prevFilter,
          filter: newFilter,
        };
      });

      return newSelected;
    });
  };

  const clearSelectionStatus = () => {
    setSelectedStatus([]);
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter.filter };
      delete newFilter.status;

      return {
        ...prevFilter,
        filter: newFilter,
      };
    });
  };

  const ststusContent = () => (
    <ul>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedStatus.includes(PAYMENT_STATUS.ON_TIME)}
          onChange={() => handleCheckboxChangeStatus(PAYMENT_STATUS.ON_TIME)}
        >
          On-Time
        </Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedStatus.includes(PAYMENT_STATUS.ADVANCE)}
          onChange={() => handleCheckboxChangeStatus(PAYMENT_STATUS.ADVANCE)}
        >
          Advanced
        </Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedStatus.includes(PAYMENT_STATUS.OVERDUE)}
          onChange={() => handleCheckboxChangeStatus(PAYMENT_STATUS.OVERDUE)}
        >
          Overdue
        </Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedStatus.includes(PAYMENT_STATUS.PENDING)}
          onChange={() => handleCheckboxChangeStatus(PAYMENT_STATUS.PENDING)}
        >
          Pending
        </Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox
          checked={selectedStatus.includes(PAYMENT_STATUS.LATE_PAYED)}
          onChange={() => handleCheckboxChangeStatus(PAYMENT_STATUS.LATE_PAYED)}
        >
          Late-paid
        </Checkbox>
      </li>
      <li className="f_clear-filter f_cp" onClick={clearSelectionStatus}>
        Clear
      </li>
    </ul>
  );

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
    else if (code === 5) {
      text = 'Late Paid';
      classname = "ant-tag-orange"
    }
    return <Tag color={color} className={classname}>{text}</Tag>
  }


  const companyList = [
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
      title: 'House No.',
      dataIndex: 'partyId',
      id: 'houseNumber',
      key: 'houseNumber',
      render: (x) => x?.houseNumber
    },
    {
      title: 'Reminder Date',
      dataIndex: 'reminderDate',
      id: 'reminderDate',
      key: 'reminderDate',
    },
    {
      title: 'Party Name',
      dataIndex: 'partyId',
      id: 'ownerName',
      key: 'ownerName',
      render: (owner) => owner && owner?.ownerName || "-"
    },
    {
      title: 'Mobile No.',
      dataIndex: 'partyId',
      id: 'mobielNo',
      key: 'mobielNo',
      render: (owner) => owner && owner?.mobileNumber || "-"
    },
    {
      title: 'Total Payment',
      dataIndex: 'partyId',
      id: 'totalPayment',
      key: 'totalPayment',
      render: (owner) => owner && owner?.payment || "-"
    },
    {
      title: 'Down Payment',
      dataIndex: 'partyId',
      id: 'downPayment',
      key: 'downPayment',
      render: (owner) => owner && owner?.downPayment || "-"
    },
    {
      title: 'Collecting Payment',
      dataIndex: 'payment',
      id: 'collectingPayment',
      key: 'collectingPayment',
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>EMI Type</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={content()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' fill={selectedEmiTypes.length > 0 ? '#184ecf' : '#5e6782'}/></span>
        </Popover></div>,
      dataIndex: 'emiType',
      className: 'f_text-center',
      id: 'emiType',
      key: 'emiType',
      render: (emiType) => {
        return emiType == 2 ? "Master" : "Regular";
      }
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>Status</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={ststusContent()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' fill={selectedStatus.length > 0 ? '#184ecf' : '#5e6782'}/></span>
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
              <span className="f_cp f_icon-small-hover f_flex f_align-center f_content-center" onClick={() => { setIsVisibleModal(true); form2.setFieldsValue({ payment: props?.payment }); setSelctedPaymentId(props?._id); setSelctedPartyId(props?.partyId?._id) }}><F_EditIcon width='14px' height='14px' /></span>
            </Tooltip>
          </div>
        )
      }
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const [selectedOption, setSelectedOption] = useState(null);

  const handleDateChangePopover = (option) => {
    let startDate, endDate;

    switch (option) {
      case 'currentMonth':
        startDate = moment().startOf('month').format("YYYY-MM-DD");
        endDate = moment().endOf('month').format("YYYY-MM-DD");
        break;
      case 'next10Days':
        startDate = moment().format("YYYY-MM-DD");
        endDate = moment().add(10, 'days').format("YYYY-MM-DD");
        break;
      case 'nextMonth':
        startDate = moment().add(1, 'month').startOf('month').format("YYYY-MM-DD");
        endDate = moment().add(1, 'month').endOf('month').format("YYYY-MM-DD");
        break;
      default:
        startDate = null;
        endDate = null;
        break;
    }

    setFilter((prevFilter) => ({
      ...prevFilter,
      filter: {
        ...prevFilter.filter,
        reminderDate: startDate && endDate ? { startDate, endDate } : null,
      },
    }));
  };

  const handleCheckboxChange = (type) => {
    setSelectedEmiTypes((prevSelected) => {
      const newSelected = prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type];

      // Update the filter based on selected values
      setFilter((prevFilter) => {
        const newFilter = { ...prevFilter.filter };

        if (newSelected.length > 0) {
          newFilter.emiType = newSelected;
        } else {
          delete newFilter.emiType;
        }

        return {
          ...prevFilter,
          filter: newFilter,
        };
      });

      return newSelected;
    });
  };


  const handleFilterMonthPopover = () => (
    <Radio.Group
      onChange={(e) => {
        const value = e.target.value;
        setSelectedOption(value);
        handleDateChangePopover(value);
      }}
      value={selectedOption}
    >
      <ul>
        <li className="f_flex f_align-center f_cp">
          <Radio value="currentMonth">Current Month</Radio>
        </li>
        <li className="f_flex f_align-center f_cp">
          <Radio value="next10Days">Next 10 Days</Radio>
        </li>
        <li className="f_flex f_align-center f_cp">
          <Radio value="nextMonth">Next Month</Radio>
        </li>
        <li
          className="f_clear-filter f_cp"
          onClick={() => {
            setSelectedOption(null);
            handleDateChangePopover(null);
          }}
        >
          Clear
        </li>
      </ul>
    </Radio.Group>
  );

  const handleSearch = (search) => {
    if (inputTimeout) clearTimeout(inputTimeout);
    setInputTimeout(
      setTimeout(() => {
        // Make API call to get the options
        callAPI("POST", `${BASE_URL}/user/party/paginate`, {
          search: { keyword: search, keys: ["ownerName", "houseNumber"] },
        }).then((response) => {
          // Assuming response contains data in the format [{ _id: value, name: label }]
          if (response && response.data) {
            setOptions(
              response.data.list.map((item) => ({
                value: item._id,
                label: item.ownerName,
              }))
            );
          }
        });
      }, 1000)
    );
  };


  const handleSelectChange = (value) => {
    setSearchComp(value);

    setFilter((prevFilter) => {
      if (value.length === 0) {
        // If value is empty, delete the partyId key from filter
        const { partyId, ...restFilter } = prevFilter.filter;
        return {
          ...prevFilter,
          filter: restFilter,
        };
      }

      return {
        ...prevFilter,
        filter: {
          ...prevFilter.filter,
          partyId: value,
        },
      };
    });
  };

  const downloadFile = async (id, fileName) => {
    axios
      .post(`${BASE_URL}/user/payment/download-xls`, filter, {
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
        link.setAttribute("download", "Reminder");
        document.body.appendChild(link);
        link.click();
      });
  };


  return (
    <React.Fragment>
      <div className='f_content-main-header f_flex f_align-center f_content-between'>
        <div className='f_flex f_align-center'>
          <div>
            <Select
              mode="multiple"
              allowClear
              size='large'
              listHeight={140}
              style={{ maxWidth: "300px", minWidth: "300px" }}
              placeholder={"Search Owner/House No./Mobile No."}
              value={searchComp}
              onSearch={handleSearch}
              // onChange={(value) => setSearchComp(value)}
              onChange={handleSelectChange}
              filterOption={false}
              showSearch
            >
              {options.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="f_ml-10">
            <RangePicker
              placeholder='Select Date'
              size='large'
              style={{ width: '250px' }}
              onChange={handleDateChange}
            />
          </div>
          <div className='f_ml-10'>
            <Popover placement="bottom" overlayClassName="f_common-popover" content={handleFilterMonthPopover()} trigger="click">
              <Tooltip title="Filter" placement='top'><span className='f_cp f_flex f_align-center f_content-center f_rollover-icon'><F_FilterIcon width='14px' height='14px' /></span></Tooltip>
            </Popover>
          </div>
        </div>
        <div className="f_flex f_align-center f_content-center">
          <div className='f_ml-10'>
            <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Tooltip title="Download Excel" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon' onClick={() => downloadFile()}><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
          </div>
        </div>
      </div>

      <div className="f_content-main-inner" style={{ height: `calc(100vh - ${finalHeight}px)` }}>
        <Table columns={companyList}
          dataSource={data}
          pagination={false}
          className='f_listing-antd-table'
          // rowSelection={rowSelection}
          // summary={() => (
          //   <Table.Summary fixed>
          //     <Table.Summary.Row className='f_ant-table-summary-fixed'>
          //       <Table.Summary.Cell className="f_text-right f_fw-600" index={0} colSpan={8}>Total:</Table.Summary.Cell>
          //       <Table.Summary.Cell className="f_text-left f_fw-600" index={1}><span className='f_color-primary-500 f_ml-5'>₹ 10,000</span></Table.Summary.Cell>
          //       <Table.Summary.Cell index={2}></Table.Summary.Cell>
          //       <Table.Summary.Cell index={3}></Table.Summary.Cell>
          //       <Table.Summary.Cell index={4}></Table.Summary.Cell>
          //     </Table.Summary.Row>
          //   </Table.Summary>
          // )}
        />
      </div>

      <div className="f_content-main-pagination">
        <Pagination
          current={filter.page}
          total={totalPages}
          pageSize={pageLimit}
          showSizeChanger={true}
          onChange={(page) => setFilter({ ...filter, page: page })}
          onShowSizeChange={(a, size) => {
            setPageLimit(size)
          }
          }
        />
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

    </React.Fragment >
  )
}

export default Reminder