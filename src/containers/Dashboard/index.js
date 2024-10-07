import React, { useEffect, useState } from 'react'
import { F_CreditIcon, F_DebitIcon, F_TotalBalanceIcon } from "../../Icons";
import UtilLocalService, { notify } from '../../utils/localServiceUtil';
import Next10Days from './Next10Days';
import DebitvsCredit from './DebitvsCredit';
import TotalBalance from './TotalBalance';
import { BASE_URL } from '../../constanats';
import { callAPI } from '../../utils/api';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [finalHeight, setFinalHeight] = useState("");
  const selectedCompany = useSelector((state) => state.files.selectedCompanyData)
  const [filter, setFilter] = useState({
  })
  const [data, setData] = useState('')

  useEffect(() => {
    let mainLayoutHeader = document.getElementById("f_layout-content-header");
    let mainHeight = mainLayoutHeader?.offsetHeight;
    setFinalHeight(mainHeight);
  }, [window?.location?.pathname]);

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
    callAPI("POST", `${BASE_URL}/user/dashboard/getTotalSums`, body)
      .then((res) => {
        setData(res.data);
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

  return (
    <React.Fragment>
      <div className="f_content-main-inner" style={{ height: `calc(100vh - ${finalHeight}px)` }}>
        <div className='f_dashboard'>
          <div className='f_row f_m-0'>
            <div className='f_w-60'>
              <div className='f_row f_m-0'>
                <div className='f_mb-20 f_w-33 f_pl-10 f_pr-10'>
                  <div className='f_dashboard-overview'>
                    <div className='f_dashboard-overview-icon'>
                      <F_DebitIcon width='20px' height='20px' fill='#D1293D' />
                    </div>
                    <div className='f_dashboard-overview-content'>
                      <h6>{data?.totalDebit || 0}</h6>
                      <p>Debit</p>
                    </div>
                  </div>
                </div>
                <div className='f_w-33 f_pl-10 f_pr-10 f_mb-20'>
                  <div className='f_dashboard-overview'>
                    <div className='f_dashboard-overview-icon' style={{ background: '#E1F0E8' }}>
                      <F_CreditIcon fill='#359766' width='20px' height='20px' />
                    </div>
                    <div className='f_dashboard-overview-content'>
                    <h6>{data?.totalCredit || 0}</h6>
                    <p>Credit</p>
                    </div>
                  </div>
                </div>
                <div className='f_w-33 f_pl-10 f_pr-10 f_mb-20'>
                  <div className='f_dashboard-overview'>
                    <div className='f_dashboard-overview-icon' style={{ background: '#EEEDFD' }}>
                      <F_TotalBalanceIcon stroke='#8F85F3' width='20px' height='20px' />
                    </div>
                    <div className='f_dashboard-overview-content'>
                    <h6>{data?.totalBalance || 0}</h6>
                    <p>Total Balance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='f_row f_m-0'>
                <div className='f_w-100 f_pl-10 f_pr-10 f_mb-20'>
                  <DebitvsCredit />
                </div>
                <div className='f_w-100 f_pl-10 f_pr-10 f_mb-20'>
                  <TotalBalance />
                </div>
              </div>
            </div>
            <div className='f_w-40'>
              <div className='f_row f_m-0'>
                <div className='f_w-100 f_pl-10 f_pr-10 f_mb-20'>
                  <Next10Days />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}

export default Dashboard