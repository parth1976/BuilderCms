import React, { useEffect, useState } from 'react'
import { Input, Button, Tooltip, Table, Pagination, Modal, Row, Form, Col } from "antd";
import { F_DownloadExcelIcon, F_DownloadPdfIcon, F_EditIcon, F_PlusIcon } from "../../Icons";
import { callAPI } from '../../utils/api';
import { BASE_URL, TOKEN_KEY } from '../../constanats';
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import Search from 'antd/es/transfer/search';
import axios from 'axios';

const Company = () => {
  const [finalHeight, setFinalHeight] = useState("");
  const [visibleModal, setIsVisibleModal] = useState(false);
  const [selctedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState({
    filter: {},

    // Search : ""
  })
  const [form] = Form.useForm();
  useEffect(() => {
    let mainLayoutHeader = document.getElementById("f_layout-content-header");
    let mainContentHeader = document.querySelector(".f_content-main-header");
    let paginationHeight = document.querySelector(".f_content-main-pagination");
    let mainHeight = mainLayoutHeader?.offsetHeight + mainContentHeader?.offsetHeight + paginationHeight?.offsetHeight;
    setFinalHeight(mainHeight);
  }, [window?.location?.pathname]);

  const [data, setData] = React.useState([]);

  const fetchData = () => {
    callAPI("POST", `${BASE_URL}/user/files/paginate`, filter)
      .then((res) => {
        setData(res.data.list);
      })
      .catch((err) => {
        notify("error", "Failed to fetch data", err.message);
      });
  }

  useEffect(() => {
    fetchData();
  }, [filter])

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
      title: 'Company Name',
      dataIndex: 'name',
      id: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Total House',
      dataIndex: 'house',
      id: 'totalHouse',
      key: 'totalHouse',
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
              <span className="f_cp f_icon-small-hover f_flex f_align-center f_content-center" onClick={() => {
                form.setFieldsValue({ name: props.name, house: props.house })
                setSelectedId(props?._id)
                setIsVisibleModal(true)
              }}><F_EditIcon width='14px' height='14px' /></span>
            </Tooltip>
          </div>
        )
      }
    },
  ]

  const finalData = data.map((val, index) => ({
    ...val, key: index + 1
  }));

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
      .post(`${BASE_URL}/user/files/download-xls`, filter , {
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
        link.setAttribute("download", "files");
        document.body.appendChild(link);
        link.click();
      });
  };

  const handleCreateCompany = (values) => {
    const url = selctedId ? `/user/files/${selctedId}` : `/user/files/create-file`
    const method = selctedId ? "PATCH" : "POST";
    callAPI(`${method}`, `${BASE_URL}${url}`, values)
      .then((res) => {
        if (res && res.code == "OK") {
          form.resetFields();
          setIsVisibleModal(false)
          fetchData();
          notify("success", res?.message)
        }
      })
      .catch((err) => {
        notify("error", err?.message)
      });
  }

  return (
    <React.Fragment>
      <div className='f_content-main-header f_flex f_align-center f_content-end'>
        {/* <div>
          <Input.Search
            allowClear
            style={{ width: '220px' }}
            className="f_layout-common-search"
            placeholder={"Search Company Name"}
          />
        </div> */}
        <div className="f_flex f_align-center f_content-end">
          <div className='f_ml-10'>
            <Tooltip title="Download PDF" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon'><F_DownloadPdfIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Tooltip title="Download Excel" placement='bottom'><span className='f_flex f_align-center f_content-center f_cp f_rollover-icon' onClick={() => downloadFile()}><F_DownloadExcelIcon width='14px' height='14px' /></span></Tooltip>
          </div>
          <div className='f_ml-10'>
            <Button type="primary" className="f_flex f_align-center f_content-center" onClick={() => setIsVisibleModal(true)}><F_PlusIcon width='12px' height='12px' fill='#fff' /> Add</Button>
          </div>
        </div>
      </div>

      <div className="f_content-main-inner" style={{ height: `calc(100vh - ${finalHeight}px)` }}>
        <Table columns={companyList}
          dataSource={finalData}
          pagination={false}
          className='f_listing-antd-table'
          // rowSelection={rowSelection}
        />
      </div>

      {/* <div className="f_content-main-pagination">
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
      </div> */}

      {visibleModal && <Modal
        title={selctedId ? "Edit Company" :"Add Company"}
        okText="Save"
        width="700px"
        open={visibleModal}
        cancelText="Cancel"
        onCancel={() => { setIsVisibleModal(false); form.resetFields(); setSelectedId('')}}
        onOk={(e) => {
          form
            .validateFields()
            .then((values) => {
              handleCreateCompany(values);
            })
            .catch((info) => {
              console.log('Validation Failed:', info);
            });
        }}
      >
        <Form layout="vertical" size='large' form={form}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item
                label='Company Name'
                name="name"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Company Name' }]}>
                <Input
                  placeholder='Enter Your Company Name'
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Total House'
                name="house"
                className='f_mb-10'
                rules={[{ required: true, message: 'Please enter Total House' }]}>
                <Input
                  placeholder='Enter Your Total House'
                  autoComplete='off'
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>}
    </React.Fragment>
  )
}

export default Company