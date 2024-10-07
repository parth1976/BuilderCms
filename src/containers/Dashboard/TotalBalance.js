import { Select, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { Column, Line } from '@ant-design/plots';
import ReportChartNoData from '../../components/ReportChartNoData';
import { useSelector } from 'react-redux';
import { BASE_URL, TENURE } from '../../constanats';
import { callAPI } from '../../utils/api';
import { notify } from '../../utils/localServiceUtil';

const TotalBalance = () => {
    const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
    const [loader, setLoader] = useState(false);
    const [chartData, setChartData] = useState([])
    const [filter, setFilter] = useState({
        filter: 1,
    })
    useEffect(() => {
        if (selectedCompany?._id) {
            setFilter({
                fileId: selectedCompany?._id,
                ...filter
            })
        }
    }, [selectedCompany])

    const fetchData = () => {
        const body = { ...filter }
        callAPI("POST", `${BASE_URL}/user/dashboard/getMonthlyTotalBalanceReport`, body)
            .then((res) => {
                // setData(res.data.list);
                setChartData(res?.data?.list)
            })
            .catch((err) => {
                notify("error", "Failed to fetch data", err.message);
            });
    }

    useEffect(() => {
        if (selectedCompany && filter?.fileId) {
            fetchData();
        }
    }, [filter])

    const PurchaseBarChart = useMemo(() => {
        const config = {
            appendPadding: 10,
            data: chartData,
            xField: 'period',
            yField: 'totalBalance',
            seriesField: 'type',
            columnWidthRatio: 0.12,
            columnStyle: {
                radius: [0, 0, 0, 0],
                cursor: "pointer"
            },
            color: '#FF829D',
            interactions: [{ type: 'brush' }],
            // slider: selectValue == 1 ? { start: 0.91, end: 1 } : selectValue == 2 ? { start: 0.6, end: 1 } : {},
            tooltip: {
                showTitle: true,
                showMarkers: false,
            },
            xAxis: {
                label: {
                    autoHide: true,
                    formatter: (text) => {
                        const [day, year] = text.split('-');
                        return [day, year].join('\n');
                    },
                    // autoRotate: true,
                    style: {
                        fill: '#383E4E',
                        fontSize: 10,
                        lineHeight: 16,
                        fontWeight: '400',
                        fontFamily: 'Inter, sans-serif',
                    },
                },
                grid: {
                    closed: true,
                    line: {
                        style: {
                            stroke: "#fff",
                        },
                    },
                },
            },
            yAxis: {
                label: {
                    autoHide: true,
                    autoRotate: true,
                    formatter: (v) => formatNumber(v),
                    style: {
                        fill: '#383E4E',
                        fontSize: 10,
                        lineHeight: 16,
                        fontWeight: '400',
                        fontFamily: 'Inter, sans-serif',
                    },
                },
                grid: {
                    closed: true,
                    line: {
                        style: {
                            lineWidth: 1,
                            stroke: "#F1F3F4",
                        },
                    },
                },
            },
            label: {
                position: 'top',
                formatter: (v) => indianCurrencyFormat(Math.round(v.count)),
                // formatter: (v) => Number(v.count.toFixed(2)),
                offsetY: 10,
                style: {
                    fill: '#383E4E',
                    fontSize: 0,
                    fontWeight: '400',
                    fontFamily: 'Inter, sans-serif',
                },
                // layout: [
                //     {
                //         type: 'interval-hide-overlap',
                //     },
                //     {
                //         type: 'adjust-color',
                //     },
                // ],
            },
            legend: false,
            // legend: {
            //     position: 'bottom',
            //     offsetY: 0,
            //     radius: 10,
            //     marker: {
            //         symbol: 'circle', // shape of the marker
            //         radius: 10, // radius of the circle
            //     },
            //     itemName: {
            //         style: {
            //             fill: '#383E4E',
            //             fontSize: 13,
            //             fontWeight: '500',
            //             fontFamily: 'Inter, sans-serif',
            //         },
            //     },
            // },
            // onReady: (plot) => {
            //     plot.on('element:click', (...args) => {
            //         chartOnClick(args[0]?.data?.data)
            //     });
            // },
            smooth: true,
            autoFit: true,
            animation: false,
        };
        return <Column style={{ height: 270 }} {...config} />;
    }, [chartData])

    const options = [
        { value: TENURE.MONTHLY, label: "Monthly" },
        { value: TENURE.QUARTERLY, label: "Quarterly" },
        { value: TENURE.SEMI_ANNUAL, label: "HalfYearly" },
        { value: TENURE.ANNUAL, label: "Yearly" },
    ];

    const indianCurrencyFormat = (str) => {
        if (str) {
            str = str?.toString();
            str = str?.split(".");
            return str[0]?.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") + (str[1] ? ("." + str[1]) : "");
        }
    }

    const formatNumber = (number) => {
        if (number >= 1000 && number < 1000000) {
            return (number / 1000) + 'k';
        } else if (number >= 1000000 && number < 1000000000) {
            return (number / 1000000) + 'M';
        } else if (number >= 1000000000 && number < 1000000000000) {
            return (number / 1000000000) + 'B';
        } else if (number >= 1000000000000 && number < 1000000000000000) {
            return (number / 1000000000000) + 'T';
        } else {
            return number;
        }
    }
    return (
        <React.Fragment>
            <div className='f_dashboard-bg'>
                <div className='f_dashboard-header f_flex f_align-center f_content-between'>
                    <h6>Total Balance</h6>
                    <div className='f_flex f_align-center f_content-end'>
                        <div className='f_ml-10'>
                            <Select
                                options={options}
                                defaultValue={1}
                                isSearchable={true}
                                listHeight={140}
                                placeholder="Select"
                                size="middle"
                                style={{ maxWidth: '120px', width: '120px' }}
                                onChange={(e) => { setFilter({ ...filter, filter: e }) }}
                            />
                        </div>
                    </div>
                </div>
                <div className='f_dashboard-chart'>
                    {loader ?
                        <React.Fragment>
                            <div className='f_flex f_align-center f_content-center' style={{ height: "270px", width: '100%' }}>
                                <Spin size="large" />
                            </div>
                        </React.Fragment>
                        : <React.Fragment>
                            {chartData?.length > 0 ? <React.Fragment>{PurchaseBarChart}</React.Fragment> : <div className='f_flex f_align-center f_content-center' style={{ height: "270px", width: '100%' }}><ReportChartNoData height="200px" width="252px" /></div>}

                        </React.Fragment>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default TotalBalance