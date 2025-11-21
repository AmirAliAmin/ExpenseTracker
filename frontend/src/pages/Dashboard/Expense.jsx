import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Model from '../../components/Model';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

function Expense() {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show:false,
    data:null
  });

  const [openAddExpenseModel, setOpenAddExpenseModal] = useState(false);
    //Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_PATH.EXPENSE.GET_ALL_EXPENSE}`);

      if (response.data) {
        setExpenseData(response.data)
      }
    } catch (error) {
      console.error("Something went wrong. Please try again", error);
    }finally{
      setLoading(false)
    }
  }

    //handle Add Expense
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon} = expense;

    //validation Checks
    if (!category.trim()) {
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
      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE ,{
        category,
        amount,
        date,
        icon
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense Added Successfully")
      fetchExpenseDetails();
    } catch (error) {
      console.error("Something went wrong. Try again", error.response?.data?.message || error.message);
    }
  }

     //Delete Income
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({show:false, data:null});
      toast.success("Expense detail deleted Successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error("Something went wrong. Try again", error.response?.data?.message || error.message);
    }
  }

  //handle download Expense details
  const handleDownloadExpenseDetails = async () => {
    
  } 

  useEffect(()=>{
    fetchExpenseDetails();
  },[])
  
  return (
     <DashboardLayout activeMenu={"Expense"}>
      <div className='my-5 lg:ml-60 xl:ml-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
            transcations={expenseData}
            onExpenseIncome={()=> setOpenAddExpenseModal(true)}
            />
            <ExpenseList
          transcations={expenseData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true, data:id})
          }}
          onDownload={handleDownloadExpenseDetails}
          />
          </div>
        </div>
        <Model 
        isOpen={openAddExpenseModel}
        onClose={()=> setOpenAddExpenseModal(false)}
        title={"Add Expense"}
        >
          <AddExpenseForm onAddExpense={handleAddExpense}/>
        </Model>
        <Model
         isOpen={openDeleteAlert.show}
         onClose={()=>setOpenDeleteAlert({show:false, data:null})}
         title="Delete Expense"
         >
          <DeleteAlert
          content="Are you sure!! You want to delete this Expense details?"
          onDelete={()=>deleteExpense(openDeleteAlert.data)}
          />
         </Model>
      </div>
    </DashboardLayout>
  )
}

export default Expense