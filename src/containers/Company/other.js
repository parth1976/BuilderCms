import React, { useState } from 'react'
import { Select, Input, Popover, Tooltip, Button, Table, Switch, Badge, Tag, Checkbox } from 'antd';
import { S_CloseIcon, S_DownloadIcon, S_EyeIcon, S_FilterIcon, S_PdfIcon, S_RightArrowIcon, S_SearchIcon, S_ShareIcon, S_TabExcelIcon } from '../../../../Icons';
import SummaryLedger from '../SummaryFilter/SummaryLedger';
import SummaryLedgerGroup from '../SummaryFilter/SummaryLedgerGroup';
import SummaryMonth from '../SummaryFilter/SummaryMonth';
import SummaryStockCategory from '../SummaryFilter/SummaryStockCategory';
import SummaryStockGroup from '../SummaryFilter/SummaryStockGroup';
import SummaryStockItem from '../SummaryFilter/SummaryStockItem';
import SummaryVoucherType from '../SummaryFilter/SummaryVoucherType';
import SummaryCostCenter from '../SummaryFilter/SummaryCostCenter';
import SummaryCostCategory from '../SummaryFilter/SummaryCostCategory';
import ReportsInvoice from '../ReportsInvoice';
import SummaryReports from '../..';

const SummarySales = () => {

    const [selectValue, setSelectValue] = useState("Ledger")
    const [visible, setIsVisible] = useState(false);
    const [searcHide, setSearcHide] = useState(false)
    const Filter = {
        Group: [
            { label: "Ledger", value: 'Ledger', key: "partyName", },
            { label: "Bills", value: 'Bills', key: "Bills" },
            { label: "Ledger Group", value: 'Ledger Group', key: "partyLedgerGroup" },
            { label: "Voucher Type", value: 'Voucher Type', key: "voucherTypeName" },
            { label: "Stock Item", value: 'Stock Item', key: "itemList.name" },
            { label: "Stock Group", value: 'Stock Group', key: "itemList.itemGroup" },
            { label: "Stock Category", value: 'Stock Category', key: "itemList.itemCategory" },
            { label: "Cost Center", value: 'Cost Center', key: "costCentre" },
            { label: "Cost Category", value: 'Cost Category', key: "costCategory" },
            { label: "Month", value: 'Month', key: "Month" },
        ],

        Gross: [
            { label: "Gross", value: 'Gross', key: "Gross", },
            { label: "Net", value: 'Net', key: "Net" },
        ]
    };

    const handleChangeGroup = (e) => {
        setSelectValue(e)
    }

    const showInvoice = () => {
        setIsVisible(true);
    };

    const onClose = () => {
        setIsVisible(false);
    };

    const [popoverOpen, setpopoverOpen] = useState(false);
    const [popoverValue, setPopoverValue] = useState("Ledger")

    const hidePopover = () => {
        setpopoverOpen(false);
    };
    const handleOpenPopoverChange = (newOpen) => {
        setpopoverOpen(newOpen);
    };

    const handlePopoverValue = (e) => {
        setPopoverValue(e)
        hidePopover()
    }

    //   const handleChange = (e) => {
    //     setSearchValue("")
    //     setSeatchText("")
    //     // if (e === SALES_PURCHASE_REPORT.STOCK_CATEGORY || e === SALES_PURCHASE_REPORT.STOCK_GROUP || e === SALES_PURCHASE_REPORT.STOCK_ITEM) {
    //     //     setReportAmount(REPORT_AMOUNT_TYPE.NET)
    //     // }
    //     setSalesReport(e);
    //     let searchKey = Filter.Group.find((m => m.value === e))
    //     return setSearchKey(searchKey.key)
    // }

    const content = (
        <ul>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Ledger") }}>Ledger</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Ledger Group") }}>Ledger Group</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Voucher Type") }}>Voucher Type</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Stock Item") }}>Stock Item</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Stock Group") }}>Stock Group</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Stock Category") }}>Stock Category</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Cost Center") }}>Cost Center</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Cost Category") }}>Cost Category</li>
            <li className="s_flex s_align-center s_mb-0 s_cp" onClick={() => { handlePopoverValue("Month") }}>Month</li>
        </ul>
        //     <ul>
        //     <li className="s_flex s_align-center s_mb-0 s_cp" onClick={ () => {handlePopoverValue("Ledger")}} >Ledger</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Ledger Group</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Voucher Type</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Stock Item</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Stock Group</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Stock Category</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp">Cost Center</li>
        //     <li className="s_flex s_align-center s_mb-0 s_cp"> Month</li>
        // </ul>
    );

    const contentDownload = (
        <ul>
            <li className="s_flex s_align-center s_cp s_icon-hover"><S_PdfIcon width='14px' height='14px' className='s_mr-10' fill='#D1293D' /> PDF</li>
            <li className="s_flex s_align-center s_cp s_icon-hover"><S_TabExcelIcon width='14px' height='14px' className='s_mr-10' /> Excel</li>
        </ul>
    );

    const [finalHeight, setFinalHeight] = useState('')
    React.useEffect(() => {
        let mainLayoutHeader = document.getElementById("s_layout-content-header");
        let firstTabHeight = document.querySelector(".ant-tabs-nav");
        let reportsHeaderHeight = document.querySelector(".s_reports-header");
        let strip = document.querySelector(".s_strip")?.offsetHeight ? document.querySelector(".s_strip")?.offsetHeight : 0;
        let mainHeight = mainLayoutHeader?.offsetHeight + firstTabHeight?.offsetHeight + reportsHeaderHeight?.offsetHeight + strip;
        setFinalHeight(mainHeight)
    }, [window?.location?.pathname]);
    ;

    const [data, setData] = React.useState([
        { id: 1, invoicenumber: '0001', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 2, invoicenumber: '0002', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 3, invoicenumber: '0003', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 4, invoicenumber: '0004', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 5, invoicenumber: '0005', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '3', duedate: '10 Apr 2023' },
        { id: 6, invoicenumber: '0006', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 7, invoicenumber: '0007', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 8, invoicenumber: '0008', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 9, invoicenumber: '0009', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '3', duedate: '10 Apr 2023' },
        { id: 10, invoicenumber: '00010', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 11, invoicenumber: '00011', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 12, invoicenumber: '0007', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 13, invoicenumber: '0008', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 14, invoicenumber: '0005', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 15, invoicenumber: '0001', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 16, invoicenumber: '0001', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 17, invoicenumber: '0002', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 18, invoicenumber: '0003', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '3', duedate: '10 Apr 2023' },
        { id: 19, invoicenumber: '0004', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 20, invoicenumber: '0005', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 21, invoicenumber: '0006', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 22, invoicenumber: '0007', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 23, invoicenumber: '0008', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 24, invoicenumber: '0009', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '3', duedate: '10 Apr 2023' },
        { id: 25, invoicenumber: '00010', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 26, invoicenumber: '00011', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 27, invoicenumber: '0007', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 28, invoicenumber: '0008', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '2', duedate: '10 Apr 2023' },
        { id: 29, invoicenumber: '0005', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '1', duedate: '10 Apr 2023' },
        { id: 30, invoicenumber: '0001', date: '02 Apr 2020', partyname: 'A ONE CORPORATION CORPORATION Jay', amount: '10,000', dueAmount: '1008', status: '3', duedate: '10 Apr 2023' },
    ]);

    const findStatus = (code) => {
        let color, text, classname;
        if (code === "1") {
            color = 'success';
            text = 'Paid';
            classname = ''
        } else if (code === "2") {
            color = 'error';
            text = 'UnPaid';
            classname = ""
        } else if (code === "3") {
            color = 'warning';
            text = 'Partial Paid';
            classname = "warning"
        }
        return <Tag color={color} className={classname} style={{ minWidth: '75px', textAlign: 'center' }}>{text}</Tag>
    }

    const handleFilterPopover = (data) => {
        const content = (
            <ul>
                <li className="s_flex s_align-center s_cp"><Checkbox>Paid</Checkbox></li>
                <li className="s_flex s_align-center s_cp"><Checkbox>Unpaid</Checkbox></li>
                <li className="s_clear-filter s_cp">Clear</li>
            </ul>
        );

        return content;
    }

    const salesPurchase = [
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
            title: 'Invoice No.',
            dataIndex: 'invoicenumber',
            id: 'invoicenumber',
            key: 'invoicenumber',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            id: 'date',
            key: 'date',
        },
        {
            title: 'Party Name',
            id: "partyname",
            key: "partyname",
            dataIndex: 'partyname',
            width: '25%',
        },
        {
            title: <><span>Status</span>
                <Popover placement="bottomRight" overlayClassName="s_common-popover" content={handleFilterPopover()} trigger="click">
                    <span className='s_cp s_ml-5'><S_FilterIcon width='14px' height='14px' /></span>
                </Popover></>,
            id: "status",
            key: "status",
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
            title: 'Dua Date',
            id: "duedate",
            key: "duedate",
            dataIndex: 'duedate',
        },
        {
            title: 'Dua Amount',
            id: "dueAmount",
            key: "dueAmount",
            dataIndex: 'dueAmount',
        },
        {
            title: 'Amount',
            id: "amount",
            key: "amount",
            dataIndex: 'amount',
            className: 's_text-right',
        },
        {
            id: "action",
            key: "action",
            width: "7%",
            title: <span>Action</span>,
            render: (x, props, index) => {
                return (
                    <div className='s_flex s_align-center s_content-center'>
                        <Tooltip placement="bottom" title={'View Invoice'}>
                            <span className="s_cp s_icon-small-hover s_flex s_align-center s_content-center" onClick={showInvoice}><S_EyeIcon width='18px' height='18px' /></span>
                        </Tooltip>
                    </div>
                )
            }
        },
    ]

    const finaldata = data.map((val, index) => ({
        ...val, key: index + 1
    }));

    const setShowsearch = (s) => {
        setSearcHide(true);
    };
    const setHidesearch = (s) => {
        setSearcHide(false);
    };

    return (
        <React.Fragment>
            <div className='s_reports'>
                <SummaryReports />
                <div className='s_tab-bg'>
                    <div className='s_reports-header s_p-10 s_flex s_align-center s_content-between'>
                        <div className='s_flex s_align-center'>
                            <h3 className='s_mb-0'>Sales - Credit Note</h3>
                            <h4 className='s_mb-0 s_ml-10 s_word-break-all s_one-line'>₹ 2,0000</h4>
                        </div>
                        <div className='s_flex s_align-end'>
                            <div className="s_ml-10">
                                <Switch checkedChildren="Gross" unCheckedChildren="Net" defaultChecked size="default" />
                            </div>
                            <p className='s_mb-0 s_fs-12 s_flex s_align-center s_ml-10'><b className='s_mr-3'>Total Sales :</b><span className='s_mb-0 s_ml-5 s_word-break-all s_one-line s_flex-1'>₹ 2,000</span></p>
                            <p className='s_mb-0 s_fs-12 s_flex s_align-center s_ml-10'><b className='s_mr-3'>Return/Credit Note :</b><span className='s_mb-0 s_ml-5 s_word-break-all s_one-line s_flex-1'>₹ 2,000</span></p>
                        </div>
                    </div>
                    <div className='s_flex s_flex-row'>
                        <div className='s_flex s_flex-col s_reports-sidebar'>
                            <div className='s_reports-sidebar-title s_flex s_align-center s_content-between'>
                                <h3 className='s_mb-0'>{popoverValue}</h3>
                                <div className='s_flex s_align-end'>
                                    {searcHide == false &&
                                        <div className='s_filter s_mr-8'>
                                            <Popover content={content} open={popoverOpen} onOpenChange={handleOpenPopoverChange} placement="bottomRight" overlayClassName="s_common-popover" trigger={'click'}>
                                                <Tooltip title="Group By" placement="top">
                                                    <span className={`s_filter-icon s_flex s_align-center s_content-center s_cp ${popoverValue ? 's_filter-active' : ''}`}><S_FilterIcon width="14px" height="14px" /></span>
                                                </Tooltip>
                                            </Popover>
                                        </div>}
                                    {searcHide && <div className="s_w-full s_mr-5 s_ml-10">
                                        <Input.Search className="s_layout-common-search" allowClear placeholder='Search..' />
                                    </div>}
                                    <div className='s_filter'>
                                        <Tooltip title={searcHide == false ? "Search" : "Close Search"} placement="top">
                                            <div className="s_filter-icon s_flex s_align-center s_content-center s_cp">{searcHide == false ? <span onClick={setShowsearch}><S_SearchIcon width="16px" height="16px" /></span> : <span onClick={setHidesearch}><S_CloseIcon width="15px" height="15px" /></span>}</div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className='s_flex s_flex-col s_reports-sidebar-inner s_reports-sidebar-inner-list'>
                                {popoverValue == "Ledger" && <SummaryLedger />}
                                {popoverValue == "Ledger Group" && <SummaryLedgerGroup />}
                                {popoverValue == "Month" && <SummaryMonth />}
                                {popoverValue == "Stock Category" && <SummaryStockCategory />}
                                {popoverValue == "Stock Group" && <SummaryStockGroup />}
                                {popoverValue == "Stock Item" && <SummaryStockItem />}
                                {popoverValue == "Voucher Type" && <SummaryVoucherType />}
                                {popoverValue == "Cost Center" && <SummaryCostCenter />}
                                {popoverValue == "Cost Category" && <SummaryCostCategory />}
                            </div>
                        </div>

                        <div className='s_flex s_flex-col s_flex-row s_reports-right-side s_tab-bg-box'>
                            <div className='s_flex s_align-center s_content-between s_reports-right-side-header s_p-10'>
                                <div className='s_flex s_align-center'>
                                    <div className='s_flex s_align-center'>
                                        <h6 className='s_mb-0'>Bills</h6>
                                        <span class="s_count-cirlce s_ml-5">100</span>
                                        <div className='s_ml-10'>
                                            <Input.Search className="s_layout-common-search" allowClear placeholder='Search..' style={{ maxWidth: "260px", minWidth: "260px" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className='s_flex s_align-end'>
                                    <div className='s_ml-0'>
                                        <Popover content={contentDownload} placement="bottomRight" overlayClassName="s_common-popover" trigger={'click'}>
                                            <Tooltip title="Download Invoice" placement="top">
                                                <span className="s_cp s_icon-small-hover s_flex s_align-center s_content-center"><S_DownloadIcon width="15px" height="15px" /></span>
                                            </Tooltip>
                                        </Popover>
                                    </div>
                                    <div className='s_ml-10'>
                                        <Tag className="s_ml-0 ant-tag-warning s_header-tag">Partial Paid (100)</Tag>
                                        <Tag className="s_ml-5 ant-tag-success s_header-tag">Paid (100)</Tag>
                                        <Tag className="s_ml-5 ant-tag-error s_header-tag">Unpaid (09)</Tag>
                                    </div>
                                </div>
                            </div>

                            <Table columns={salesPurchase}
                                dataSource={finaldata}
                                pagination={false}
                                className='s_listing-antd-table'
                                summary={() => (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell className="s_text-right s_fw-600" index={0} colSpan={7}>Total:</Table.Summary.Cell>
                                            <Table.Summary.Cell className="s_text-right s_fw-600" index={1}><span className='s_color-blue s_ml-5'>₹ 10,000</span></Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}></Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {visible && <ReportsInvoice visible={visible} onClose={onClose} />}
            </div>
        </React.Fragment >
    )
}

export default SummarySales
