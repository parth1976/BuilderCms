import { Select, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import { Line } from '@ant-design/plots';
import ReportChartNoData from '../../components/ReportChartNoData';
import { useSelector } from 'react-redux';
import { callAPI } from '../../utils/api';
import { BASE_URL, TENURE } from '../../constanats';
import { notify } from '../../utils/localServiceUtil';

const DebitvsCredit = () => {
  const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
  const [loader, setLoader] = useState(false);
  const [chartData, setChartData] = useState('')

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

  const transformChartData = (data) => {
    const transformedData = [];

    data.forEach((item) => {
      transformedData.push(
        {
          period: item.period,
          type: 'totalDebit',
          value: item.totalDebit,
        },
        {
          period: item.period,
          type: 'totalCredit',
          value: item.totalCredit,
        }
      );
    });

    return transformedData;
  };


  const fetchData = () => {
    const body = { ...filter };
    callAPI("POST", `${BASE_URL}/user/dashboard/getMonthlyDebitCreditReport`, body)
      .then((res) => {
        const rawData = res?.data?.list || [];
        const transformedData = transformChartData(rawData);
        setChartData(transformedData);
      })
      .catch((err) => {
        notify("error", "Failed to fetch data", err.message);
      });
  };


  useEffect(() => {
    if (selectedCompany && filter?.fileId) {
      fetchData();
    }
  }, [filter])

  const options = [
    { value: TENURE.MONTHLY, label: "Monthly" },
    { value: TENURE.QUARTERLY, label: "Quarterly" },
    { value: TENURE.SEMI_ANNUAL, label: "HalfYearly" },
    { value: TENURE.ANNUAL, label: "Yearly" },
  ];

  const SalesVSPurchaseChart = useMemo(() => {
    const COLOR_PLATE_10 = [
      '#FF829D', // Color for totalCredit
      '#7CA6FA', // Color for totalDebit
    ];
    const config = {
      appendPadding: 10,
      data: chartData,
      xField: 'period',
      yField: 'value',
      seriesField: 'type', // Use 'type' to differentiate the lines
      color: COLOR_PLATE_10,
      tooltip: {
        showTitle: true,
        showMarkers: true,
      },
      xAxis: {
        label: {
          autoHide: true,
          formatter: (text) => {
            const [day, year] = text.split('-');
            return [day, year].join('\n');
          },
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
        formatter: (v) => indianCurrencyFormat(Math.round(v.value)),
        offsetY: -5,
        style: {
          fill: '#383E4E',
          fontSize: 0,
          fontWeight: '400',
          fontFamily: 'Inter, sans-serif',
        },
      },
      legend: {
        flipPage: true,
        position: 'bottom',
        offsetY: 5,
        radius: 10,
        marker: {
          symbol: 'circle',
          radius: 10,
          style: (oldStyle) => ({
            ...oldStyle,
            r: 2,
            lineWidth: 4,
          }),
        },
        itemName: {
          style: {
            fill: '#383E4E',
            fontSize: 13,
            fontWeight: '500',
            fontFamily: 'Inter, sans-serif',
          },
        },
      },
      point: {
        size: 4,
        shape: 'circle',
      },
      smooth: true,
      autoFit: true,
      animation: false,
    };
    return <Line style={{ height: 270 }} {...config} />;
  }, [chartData]);



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
          <h6>Debit vs Credit</h6>
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
                onChange={(e) => {setFilter({...filter , filter : e})}}
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
              {chartData?.length > 0 ? <React.Fragment>{SalesVSPurchaseChart}</React.Fragment> : <div className='f_flex f_align-center f_content-center ' style={{ height: "270px", width: '100%' }}><ReportChartNoData height="200px" width="252px" /></div>}
            </React.Fragment>
          }
        </div>
      </div>
    </React.Fragment>
  )
}

export default DebitvsCredit