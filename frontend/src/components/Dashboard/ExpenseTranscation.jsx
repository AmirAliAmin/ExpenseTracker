import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TranscationInfoCard from '../cards/TranscationInfoCard'
import moment from 'moment'

export default function ExpenseTranscation({transcation,onSeeMore}) {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5> Expenses</h5>
       <button className='card-btn' onClick={onSeeMore}>See All<LuArrowRight className='text-base'/></button>
      </div>
      <div className='mt-6 '>
                  {
                      transcation?.slice(0,5)?.map((expense)=>(
                          <TranscationInfoCard
                          key={expense._id} 
                          title={expense.category} 
                          icon={expense.icon} 
                          date={moment(expense.date).format("Do MMM YYYY")} 
                          amount={expense.amount}
                          type="expense"
                          hideDeleteBtn
                          />
                      ))
                  }
              </div>
    </div>
  )
}
