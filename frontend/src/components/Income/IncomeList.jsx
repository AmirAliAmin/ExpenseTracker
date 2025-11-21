import React from "react";
import { LuArrowRight, LuDownload } from "react-icons/lu";
import TranscationInfoCard from "../cards/TranscationInfoCard";
import moment from "moment";

function IncomeList({ transcations, onDelete, onDownload }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg ">Income Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" />
          Download
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {transcations.map((income) => (
          <TranscationInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format("Do MMM YYYY")}
            amount={income.amount}
            type="income"
            onDelete={()=>onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default IncomeList;
