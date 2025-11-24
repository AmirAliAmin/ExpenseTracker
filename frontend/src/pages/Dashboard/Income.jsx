import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import Model from '../../components/Model';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

export default function Income() {

  useUserAuth();
  const [openAddIncomeModel, setOpenAddIncomeModal] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show:false,
    data:null
  });

  //Get All Income Details
  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATH.INCOME.GET_ALL_INCOME}`);

      if (response.data) {
        setIncomeData(response.data)
      }
    } catch (error) {
      console.error("Something went wrong. Please try again", error);
    }finally{
      setLoading(false)
    }
  }

  //handle Add Income
  const handleAddIncome = async (income) => {
    const {source, amount, date, icon} = income;

    //validation Checks
    if (!source.trim()) {
      toast.error("Source is Required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <=0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }

    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATH.INCOME.ADD_INCOME,{
        source,
        amount,
        date,
        icon
      });

      setOpenAddIncomeModal(false);
      toast.success("Income Added Successfully")
      fetchIncomeDetails();
    } catch (error) {
      console.error("Something went wrong. Try again", error.response?.data?.message || error.message);
    }
  }

  //Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id))
      setOpenDeleteAlert({show:false, data:null});
      toast.success("Income detail deleted Successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.error("Something went wrong. Try again", error.response?.data?.message || error.message);
    }
  }

  //handle download Income details
  const handleDownloadIncomeDetails = async () => {
      try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME,{
        responseType: "blob"
      });

      //Create a Url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense detail. Please try again.")
      
    }
  } 

  useEffect(()=>{
    fetchIncomeDetails();
  },[])
  return (
    <DashboardLayout activeMenu={"Income"}>
      <div className='my-5 lg:ml-60 xl:ml-auto'>
         <div className='grid grid-cols-1 gap-6'>
          <div>
            <IncomeOverview
          transcations={incomeData}
          onAddIncome={()=>setOpenAddIncomeModal(true)}
          />
          </div>
          <IncomeList
          transcations={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true, data:id})
          }}
          onDownload={handleDownloadIncomeDetails}
          />
         </div>

         <Model
         isOpen={openAddIncomeModel}
         onClose={()=>setOpenAddIncomeModal(false)}
         title="Add Income"
         >
          <AddIncomeForm
          onAddIncome={handleAddIncome}
          />
         </Model>
         <Model
         isOpen={openDeleteAlert.show}
         onClose={()=>setOpenDeleteAlert({show:false, data:null})}
         title="Delete Income"
         >
          <DeleteAlert
          content="Are you sure!! You want to delete this income details?"
          onDelete={()=>deleteIncome(openDeleteAlert.data)}
          />
         </Model>
      </div>
    </DashboardLayout>
  )
}
