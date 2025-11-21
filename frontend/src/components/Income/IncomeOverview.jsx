import React, { useEffect, useState } from 'react'
import {prepareIncomeBarChartData } from '../../utils/helper';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';


function IncomeOverview({transcations, onAddIncome}) {
    const [chartData, setChartData] = useState([]);

    useEffect(()=>{
        const result = prepareIncomeBarChartData(transcations);
        setChartData(result);
    },[transcations])
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <div>
                <h5 className='text-lg'>Income Overview</h5>
                <p className='text-xs text-gray-400 mt-0.5'>Track your earning over time and analyze your income trend.</p>
            </div>
            <button className='add-btn' onClick={onAddIncome}><LuPlus className='text-lg'/>Add Income </button>
        </div>
        <div className='mt-10'>
            <CustomBarChart
            data={chartData}
            />
        </div>
    </div>
  )
}

export default IncomeOverview