import React, { useEffect, useState } from 'react'
import { Input, Tooltip, Table, Pagination, Checkbox, Tag, Popover, DatePicker, Col, Form, Modal, Select, Row, Button, Drawer } from "antd";
import { F_DeleteIcon, F_DownloadExcelIcon, F_DownloadPdfIcon, F_EditIcon, F_EyeIcon, F_FilterIcon, F_PlusIcon } from "../../Icons";
import { useSelector } from 'react-redux';
import { callAPI } from '../../utils/api';
import { BASE_URL, PAYMENT_MODE, TRANSACTION_CONSTANTS } from '../../constanats';
import { notify } from '../../utils/localServiceUtil';
import moment from 'moment';

const { RangePicker } = DatePicker;

const LedgerReport = () => {
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
  const [data, setData] = React.useState('');

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
        ...filter,
        filter: {
          fileId: selectedCompany?._id,
        }
      })
    }
  }, [selectedCompany])

  const fetchData = () => {
    const body = { ...filter }
    body.limit = pageLimit;
    callAPI("POST", `${BASE_URL}/user/account/getLedgerReport`, body)
      .then((res) => {
        setData(res.data.list);
        settotalPages(res?.data?.count)
      })
      .catch((err) => {
        notify("error", "Failed to fetch data", err.message);
      });
  }

  useEffect(() => {
    if (filter?.filter) {
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


  const handleFilterPopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Credit</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Debit</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const handleFilterPaymentModePopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Cheque</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>E-Transfer</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const findStatus = (code) => {
    let color, text, classname;
    if (code === "1") {
      text = 'Credit';
      classname = 'ant-tag-success'
    } else if (code === "2") {
      text = 'Debit';
      classname = "ant-tag-error"
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
      title: 'Party Name',
      dataIndex: 'ownerName',
      id: 'partyName',
      key: 'partyName',
    },
    {
      title: 'Mobile  No.',
      dataIndex: 'mobileNumber',
      id: 'mobileNo',
      key: 'mobileNo',
    },
    {
      title: 'Total Debit',
      dataIndex: 'totalDebit',
      id: 'payment',
      key: 'payment',
      render: (x, props) => {
        return (
          <>
            {
              <span className='f_color-error-500 f_fw-600'>{x}</span>
            }
          </>
        )
      },
    },
    {
      title: 'Total Credit',
      dataIndex: 'totalCredit',
      id: 'payment',
      key: 'payment',
      render: (x, props) => {
        return (
          <>
            {
              <span className='f_color-success-500 f_fw-600'>{x}</span>
            }
          </>
        )
      },
    },
    {
      title: 'Balance Payment',
      dataIndex: 'balance',
      id: 'payment',
      key: 'payment',
    },
    {
      id: "action",
      key: "action",
      width: "7%",
      title: <span>Action</span>,
      render: (x, props, index) => {
        return (
          <div className='f_flex f_align-center f_content-center'>
            <Tooltip placement="bottom" title={'View'}>
              <span className="f_cp f_icon-small-hover f_flex f_align-center f_content-center" onClick={() => { setIsVisibleModal(true); setLedgerData(props) }}><F_EyeIcon width='16px' height='16px' /></span>
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


  const [ledgerData, setLedgerData] = React.useState([]);

  const handleFilterPaymentPopover = (data) => {
    const content = (
      <ul>
        <li className="f_flex f_align-center f_cp"><Checkbox>Cash</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Cheque</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>E-Transfer</Checkbox></li>
        <li className="f_flex f_align-center f_cp"><Checkbox>Bank</Checkbox></li>
        <li className="f_clear-filter f_cp">Clear</li>
      </ul>
    );

    return content;
  }

  const handleFilterDatePopover = (data) => {
    const content = (
      <RangePicker
        placeholder='Select Date' size='middle' />
    );

    return content;
  }

  const UserLedger = [
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
      title: <div className='f_flex f_align-center f_content-start'><span>Date</span>
        <Popover placement="bottom" overlayClassName="f_common-popover" content={handleFilterDatePopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      dataIndex: 'date',
      id: 'date',
      key: 'date',
      render: (x) => moment(x).format('DD/MM/YYYY')
    },
    {
      title: 'Total Payment',
      dataIndex: 'payment',
      id: 'payment',
      key: 'payment',
    },
    {
      title: <div className='f_flex f_align-center f_content-start'><span>Payment Mode</span>
        <Popover placement="bottom" overlayClassName="f_common-popover" content={handleFilterPaymentPopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      dataIndex: 'paymentMode',
      id: 'paymentMode',
      key: 'paymentMode',
      render: (x, props) => {
        return (
          <span>
            {x == PAYMENT_MODE.CASH ? "Cash" : x == PAYMENT_MODE.CHAQUE ? "Cheque" : "e-Transfer"}
          </span>
        )
      }
    },
    {
      title: 'Amount',
      dataIndex: 'payment',
      id: 'payment',
      key: 'payment',
      render: (x, props) => {
        return (
          <>
            {
              <span className={`${props?.transactionType == TRANSACTION_CONSTANTS.CREDIT ? "f_color-sucess-500" : "f_color-error-500"} f_fw-500`}>{x}</span>
            }
          </>
        )
      },
    },
    {
      title: <div className='f_flex f_align-center f_content-start'><span>Transaction Type</span>
        <Popover placement="bottom" overlayClassName="f_common-popover" content={handleFilterPopover()} trigger="click">
          <span className='f_cp f_ml-5 f_flex f_align-center f_content-center'><F_FilterIcon width='14px' height='14px' /></span>
        </Popover></div>,
      dataIndex: 'paymentMode',
      dataIndex: 'transactionType',
      id: 'transactionType',
      key: 'transactionType',
      render: (x, props) => {
        return (
          <>
            {<span className='f_fw-500'>{x == TRANSACTION_CONSTANTS.CREDIT ? "Credit" : "Debit"}</span>}
          </>
        )
      },
    },
    // {
    //   title: 'Narration',
    //   dataIndex: 'narration',
    //   id: 'narration',
    //   key: 'narration',
    //   className: 'f_text-left',
    //   render: (x, props) => {
    //     return (
    //       <>
    //         {
    //           <span className='f_two-line'>{x}</span>
    //         }
    //       </>
    //     )
    //   },
    // },
  ]

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
        </div>
        <div className="f_flex f_align-center f_content-center">
          <div className='f_ml-10'>
            <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Tooltip title="Download Excel" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          {/* <div className='f_ml-10'>
            <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleCreateModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Create Account</Button>
          </div>
          <div className='f_ml-10'>
            <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Add</Button>
          </div> */}
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
        //       <Table.Summary.Cell className="f_text-left f_fw-600" index={1}><span className='f_color-error-500 f_ml-5'>₹ 10,000</span></Table.Summary.Cell>
        //       <Table.Summary.Cell className="f_text-left f_fw-600" index={2}><span className='f_color-success-500 f_ml-5'>₹ 10,000</span></Table.Summary.Cell>
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


      {visibleModal && <Drawer
        title={<div className='f_flex f_align-center f_content-between'>
          <h6 className='f_fw-600'>Vijay</h6>
          <div className="f_flex f_align-center f_content-end">
            <div className='f_ml-10'>
              <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
            </div>
            <div className='f_ml-10'>
              <Tooltip title="Download Excel" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
            </div>
          </div></div>}
        okText="Save"
        width="1100px"
        open={visibleModal}
        cancelText="Cancel"
        onClose={() => setIsVisibleModal(false)}
      >
        <div className='f_flex f_align-center f_content-between f_p-10 f_h-50' style={{ borderBottom: '1px solid #ededed' }}>
          <div className='f_flex f_align-center f_color-payment f_fs-14 f_fw-500'>Total Payment: <span className='f_ml-5 f_fs-600 f_color-primary-500'>{ledgerData?.balance}</span></div>

          <div className='f_flex f_align-center f_content-end'>
            <div className='f_flex f_align-center f_color-success-500 f_fs-14 f_fw-500'>Credit: <span className='f_ml-5 f_fs-600'>{ledgerData?.totalCredit}</span></div>
            <div className='f_flex f_align-center f_color-error-500 f_fs-14 f_fw-500 f_ml-10'>Debit: <span className='f_ml-5 f_fs-600'>{ledgerData?.totalDebit}</span></div>
          </div>
        </div>


        <div className='f_overflow-hidden f_overflow-y-auto' style={{ height: 'calc(100vh - 140px)' }}>
          <Table columns={UserLedger}
            dataSource={ledgerData?.accountDetails}
            pagination={false}
            className='f_listing-antd-table'
            rowSelection={rowSelection}
          />
        </div>

      </Drawer>}

    </React.Fragment>
  )
}

export default LedgerReport