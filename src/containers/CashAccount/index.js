import React, { useEffect, useState } from 'react'
import { Input, Tooltip, Table, Pagination, Checkbox, Tag, Popover, DatePicker, Col, Form, Modal, Select, Row, Button } from "antd";
import { F_DeleteIcon, F_DownloadExcelIcon, F_DownloadPdfIcon, F_EditIcon, F_FilterIcon, F_PlusIcon } from "../../Icons";
import { useSelector } from 'react-redux';
import { callAPI } from '../../utils/api';
import { BASE_URL, TOKEN_KEY, TRANSACTION_CONSTANTS, TYPE_CONSTANTS } from '../../constanats';
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import moment from 'moment';
import axios from 'axios';

const { RangePicker } = DatePicker;

const CashAccount = () => {
  const [visibleModal, setIsVisibleModal] = useState(false);
  const [visibleCreateModal, setIsVisibleCreateModal] = useState(false);
  const [finalHeight, setFinalHeight] = useState("");
  const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
  const [filter, setFilter] = useState({
    page: 1,
    limit: 20,
  })
  const [options, setOptions] = useState([]);
  const { Option } = Select;
  const [pageLimit, setPageLimit] = React.useState(20);
  const [totalPages, settotalPages] = React.useState(0);
  const [searchComp, setSearchComp] = useState([]);
  const [inputTimeout, setInputTimeout] = useState(null);
  const [selectValue, setSelectValue] = useState("");
  const [data, setData] = React.useState('');
  const [partyData, setPartyData] = useState([])
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [selectedTransType, setSelectedTransType] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState('')

  const transOptions = [
    { value: 2, label: "Credit" },
    { value: 1, label: "Debit" },
  ];

  const handleCheckboxChange = (type) => {
    setSelectedTransType((prevSelected) => {
      const newSelected = prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type];

      // Update the filter based on selected values
      setFilter((prevFilter) => {
        const newFilter = { ...prevFilter.filter };

        if (newSelected.length > 0) {
          newFilter.transactionType = newSelected;
        } else {
          delete newFilter.transactionType;
        }

        return {
          ...prevFilter,
          filter: newFilter,
        };
      });

      return newSelected;
    });
  };


  const clearSelection = () => {
    setSelectedTransType([]);
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter.filter };
      delete newFilter.transactionType;

      return {
        ...prevFilter,
        filter: newFilter,
      };
    });
  };

  const content = () => (
    <ul>
      <li className="f_flex f_align-center f_cp">
        <Checkbox onChange={(e) => handleCheckboxChange(TRANSACTION_CONSTANTS.CREDIT)} checked={selectedTransType.includes(TRANSACTION_CONSTANTS.CREDIT)}>Credit</Checkbox>
      </li>
      <li className="f_flex f_align-center f_cp">
        <Checkbox onChange={(e) => handleCheckboxChange(TRANSACTION_CONSTANTS.DEBIT)} checked={selectedTransType.includes(TRANSACTION_CONSTANTS.DEBIT)}>Debit</Checkbox>
      </li>
      <li className="f_clear-filter f_cp" onClick={() => clearSelection()}>Clear</li>
    </ul>
  );

  useEffect(() => {
    let mainLayoutHeader = document.getElementById("f_layout-content-header");
    let mainContentHeader = document.querySelector(".f_content-main-header");
    let paginationHeight = document.querySelector(".f_content-main-pagination");
    let mainHeight = mainLayoutHeader?.offsetHeight + mainContentHeader?.offsetHeight + paginationHeight?.offsetHeight;
    setFinalHeight(mainHeight);
  }, [window?.location?.pathname]);

  useEffect(() => {
    if (selectedCompany?._id) {
      setFilter({
        filter: {
          fileId: selectedCompany?._id,
          type: TYPE_CONSTANTS.CASH
        },
        ...filter
      })
      fetchPartyData();
    }
  }, [selectedCompany])

  const fetchData = () => {
    const body = { ...filter }
    body.limit = pageLimit;
    callAPI("POST", `${BASE_URL}/user/account/paginate`, body)
      .then((res) => {
        setData(res.data.list);
        settotalPages(res?.data?.count)
      })
      .catch((err) => {
        notify("error", "Failed to fetch data", err.message);
      });
  }

  const fetchPartyData = () => {
    callAPI("POST", `${BASE_URL}/user/party/paginate`, { filter: { fileId: selectedCompany?._id, isStaff: [true, false] } })
      .then((res) => {
        const transformedData = res.data.list.map((item) => ({
          label: item.ownerName, // assuming `name` is the correct key for the label
          value: item._id   // assuming `_id` is the key for the value
        }));
        setPartyData(transformedData);
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

  const handleDateChange = (dates) => {
    if (dates && dates.length > 0) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        filter: {
          ...prevFilter.filter,
          reminderDate: {
            startDate: dates[0].format("YYYY-MM-DDTHH:mm:ss"),
            endDate: dates[1].format("YYYY-MM-DDTHH:mm:ss"),
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

  const handleCreateStaff = (values) => {
    const url = `/user/party/add-staff`
    const method = "POST";
    const body = {
      ...values,
      fileId: selectedCompany?._id
    }
    callAPI(`${method}`, `${BASE_URL}${url}`, body)
      .then((res) => {
        if (res && res.code == "OK") {
          form.resetFields();
          setIsVisibleCreateModal(false)
          notify("success", res?.message)
          fetchPartyData();
        }
      })
      .catch((err) => {
        notify("error", err?.message)
      });
  }

  const handleCreatePayment = (values) => {
    callAPI("POST", `${BASE_URL}/user/account/create-account`, {
      ...values,
      fileId: selectedCompany?._id,
      type: TYPE_CONSTANTS.CASH
    })
      .then((res) => {
        if (res && res.code === "OK") {
          form2.resetFields();
          setIsVisibleModal(false);
          notify("success", res?.message);
          fetchData();
        }
      })
      .catch((err) => {
        notify("error", err?.message);
      });
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
      title: 'Date',
      dataIndex: 'date',
      id: 'date',
      key: 'date',
      render: (x) => (
        <span>{moment(x).format("DD/MM/YYYY")}</span>
      )
    },
    {
      title: 'Party Name',
      dataIndex: 'partyId',
      id: 'partyName',
      key: 'partyName',
      render: (owner) => owner && owner?.ownerName || "-"
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      id: 'payment',
      key: 'payment',
    },
    {
      title: <div className='f_flex f_align-center f_content-center'><span>Transaction Type</span>
        <Popover placement="bottomRight" overlayClassName="f_common-popover" content={content()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' fill={selectedTransType.length > 0 ? '#184ecf' : '#5e6782'} /></span>
        </Popover></div>,
      id: "status",
      key: "status",
      className: 'f_text-center',
      dataIndex: 'transactionType',
      render: (x, props) => {
        return (
          <>
            {x == TRANSACTION_CONSTANTS.CREDIT ? "Credit" : "Debit"}
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
            <Tooltip placement="bottom" title={'Delete'}>
              <span className="f_cp f_icon-small-hover f_icon-small-hover-delete f_flex f_align-center f_content-center f_ml-5" onClick={() => { setSelectedPartyId(props?._id); setDeleteConfirm(true) }}><F_DeleteIcon width='14px' height='14px' /></span>
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

  const downloadFile = async (id, fileName) => {
    axios
      .post(`${BASE_URL}/user/account/cash/download-xls`, filter, {
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
        link.setAttribute("download", "Cash_account");
        document.body.appendChild(link);
        link.click();
      });
  };

  const handleCashAccountDelete = () => {
    const body = {
      accountIdArray: [selectedPartyId]
    }
    callAPI("POST", `${BASE_URL}/user/account/delete`, body, {})
      .then((res) => {
        //TODO: check  for if user first removed staff or client from particular role or not
        res?.code === "OK" && res?.status ? notify("success", res?.message) : notify("error", res?.message);
        res?.code === "E_NOT_FOUND" && notify("error", res?.message)
        fetchData();
        setDeleteConfirm(false);
      })
      .catch((err) => {
        notify("error", err?.message);
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
              onChange={handleDateChange}
              style={{ width: '250px' }}
            />
          </div>
        </div>
        <div className="f_flex f_align-center f_content-center">
          <div className='f_ml-10'>
            <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Tooltip title="Download Excel" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon' onClick={() => downloadFile()}><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleCreateModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Create Staff</Button>
          </div>
          <div className='f_ml-10'>
            <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Add</Button>
          </div>
        </div>
      </div>

      <div className="f_content-main-inner" style={{ height: `calc(100vh - ${finalHeight}px)` }}>
        <Table columns={companyList}
          dataSource={data}
          pagination={false}
          className='f_listing-antd-table'
          rowSelection={rowSelection}
        // summary={() => (
        //   <Table.Summary fixed>
        //     <Table.Summary.Row className='f_ant-table-summary-fixed'>
        //       <Table.Summary.Cell className="f_text-right f_fw-600" index={0} colSpan={4}>Total:</Table.Summary.Cell>
        //       <Table.Summary.Cell className="f_text-left f_fw-600" index={1}><span className='f_color-primary-500 f_ml-5'>₹ 10,000</span></Table.Summary.Cell>
        //       <Table.Summary.Cell index={2}></Table.Summary.Cell>
        //       <Table.Summary.Cell index={3}></Table.Summary.Cell>
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
        title="Add OR Edit Details"
        okText="Save"
        width="700px"
        open={visibleModal}
        cancelText="Cancel"
        onCancel={() => setIsVisibleModal(false)}
        onOk={() => {
          form2
            .validateFields()
            .then((values) => {
              handleCreatePayment(values);
            })
            .catch((info) => {
              console.log('Validation Failed:', info);
            });
        }}
      >
        <Form layout="vertical" size='large' form={form2}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                label='Date'
                name="date"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Date' }]}>
                <DatePicker
                  placeholder='Select Date'
                  className='f_w-100'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Account Name (To)'
                name="partyId"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Account Name (To)' }]}>
                <Select
                  options={partyData}
                  onChange={(e) => { form.setFieldsValue({ partyId: e }); }}
                  isSearchable={true}
                  listHeight={140}
                  placeholder="Select Account Name (To)"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label='Transaction Type'
                name="transactionType"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Transaction Type' }]}>
                <Select
                  options={transOptions}
                  onChange={(e) => { form.setFieldsValue({ transactionType: e }); }}
                  isSearchable={true}
                  listHeight={140}
                  placeholder="Select Transaction Type"
                  size="large"
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
          </Row>
        </Form>
      </Modal>}

      {visibleCreateModal && <Modal
        title="Create Staff"
        okText="Add"
        width="700px"
        open={visibleCreateModal}
        cancelText="Cancel"
        onCancel={() => { setIsVisibleCreateModal(false); form.resetFields(); }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleCreateStaff(values);
            })
            .catch((info) => {
              console.log('Validation Failed:', info);
            });
        }}
      >
        <Form layout="vertical" size='large' form={form}>
          <Row gutter={10}>
            <Col span={8}>
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
            <Col span={8}>
              <Form.Item
                label='Mobile No.'
                name="mobileNumber"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Mobile No.' }]}>
                <Input
                  placeholder='Enter Your Mobile No.'
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
            {/* <Col span={8}>
              <Form.Item
                label='Category'
                name="Category"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Category' }]}>
                <Input
                  placeholder='Enter Your Category'
                  autoComplete='off'
                />
              </Form.Item>
            </Col> */}
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
        onOk={() => handleCashAccountDelete()}
      >
        <p className="s_text-left s_fs-14 s_mb-10"> Are you sure you want to delete this record?</p>
        {/* <div className='s_flex s_align-center s_content-end'> <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button> <Button className='s_ml-10' onClick={() => handleRoleDelete(actionData?._id)} danger type="primary">Delete</Button></div> */}
      </Modal>

    </React.Fragment>
  )
}

export default CashAccount