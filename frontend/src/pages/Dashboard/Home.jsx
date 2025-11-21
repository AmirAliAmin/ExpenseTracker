import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import InfoCard from '../../components/cards/InfoCard';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import {IoMdCard} from 'react-icons/io'
import { addThousandsSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTranscation from '../../components/Dashboard/ExpenseTranscation';
import Last30DaysExpense from '../../components/Dashboard/Last30DaysExpense';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

export default function Home() {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =useState(null);
  const [loading, setLoading] = useState(false);


  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATH.DASHBOARD.GET_DATA}`);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("SomeThing went wrong. Please Try again",error);
    } finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchDashboardData();
  },[])
  return (
    <DashboardLayout activeMenu= "Dashboard">
      <div className='my-5 lg:ml-60 xl:ml-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <InfoCard
          icon={<IoMdCard/>}
          label="Total Balance"
          value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
          color="bg-primary"
          />

          <InfoCard
          icon={<LuWalletMinimal/>}
          label="Total Income"
          value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
          color="bg-orange-500"
          />

          <InfoCard
          icon={<LuHandCoins/>}
          label="Total Expense"
          value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
          color="bg-red-500"
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
             transcation = {dashboardData?.recentTransactions}
             onSeeMore={()=>navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}

          />

          <ExpenseTranscation
           transcation={dashboardData?.last30DaysExpense?.transactions || []}
           onSeeMore={()=>navigate("/expense")}
          />

          <Last30DaysExpense
          data={dashboardData?.last30DaysExpense?.transactions || []}
          />

          <RecentIncomeWithChart
           data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
           totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
          transactions ={dashboardData?.last60DaysIncome?.transactions || []}
          onSeeMore={()=> navigate("/income")}
          />
        </div>


      </div>
    </DashboardLayout>
  )
}
