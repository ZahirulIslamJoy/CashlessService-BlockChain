import React, { useEffect, useState } from "react";
import { initializeWeb3 } from "../hooks/Web3Initialize";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import Loader from "../Loader";

const Login = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  let [isOpen, setIsOpen] = useState(false);
  let [isOpen1, setIsOpen1] = useState(false);
  let [isOpen2, setIsOpen2] = useState(false);
  let [isOpen3, setIsOpen3] = useState(false);
  let [isOpen4, setIsOpen4] = useState(false);
  const [loading,setLoading]=useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true)
    const initialization = initializeWeb3();
    initialization
      .then((result) => {
        setAccount(result.account);
        setWeb3(result.web3Instance);
        setContract(result.contractInstance);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false)
      });
    async function checkLogin() {
      try {
        console.log(account);
        const result = await contract?.methods.loginCheck(account).call();
        if (result == "notUser") {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Please Create Account First",
            showConfirmButton: false,
            timer: 1500,
          });
          setLoading(false)
          navigate("/registration");
        }
        setUserType(result);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false)
      }
    }
    if (account) {
      checkLogin();
    }
  }, [account]);

  useEffect(() => {
    async function getDetails() {
      setLoading(true)
      if (contract && account) {
        try {
          const details = await contract.methods.Details(account).call();
          const userBalance = await contract.methods
            .getBalance()
            .call({ from: account });
          setName(details[0]);
          setBalance(userBalance);
          setLoading(false)
        } catch (error) {
          console.error("Error fetching details:", error);
          setLoading(false)
        }
      }
    }
    getDetails();
  }, [contract, account]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal1() {
    setIsOpen1(false);
  }

  function openModal1() {
    setIsOpen1(true);
  }

  function closeModal2() {
    setIsOpen2(false);
  }

  function openModal2() {
    setIsOpen2(true);
  }

  function closeModal3() {
    setIsOpen3(false);
  }

  function openModal3() {
    setIsOpen3(true);
  }

  function closeModal4() {
    setIsOpen4(false);
  }

  function openModal4() {
    setIsOpen4(true);
  }

  const handlePayment = async (paymentInfo) => {
    console.log(paymentInfo.address)
    try {
      setLoading(true)
      const senderBalance = parseFloat(balance);
      if (senderBalance < parseFloat(paymentInfo.amount)) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Not Enough Money",
          showConfirmButton: false,
          timer: 1500,
        });
        setErrorMessage("You don't have sufficient balance to make the payment.");
        setLoading(false)
        return;
      }
      await contract.methods.makePayment(paymentInfo.address, paymentInfo.amount).send({ from: account });
      const userBalance = await contract.methods
        .getBalance()
        .call({ from: account });
      setBalance(userBalance);
      setLoading(false)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Payment Successfull",
        showConfirmButton: false,
        timer: 1500,
      });
      setSuccessMessage('Payment successful!');
    }
    catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "An error occurred while processing the payment.",
        showConfirmButton: false,
        timer: 1500,
      });
      setErrorMessage('An error occurred while processing the payment.');
      setLoading(false);
      console.error(error);
    }
    //   const details = await contract.methods.Details(paymentInfo.address).call();
    //   console.log(details[0])  
  };

  const handleWithdraw = async (withdrawInfo) => {
    setLoading(true)
    const withdrawBalance = parseFloat(withdrawInfo.withdrawAmount);
    const totalBalance = parseFloat(balance);
    try {
      if (totalBalance < withdrawBalance) {
        setLoading(false)
        return  Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Not Sufficient Money",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      await contract.methods.withDraw(withdrawBalance).send({ from: account });
      setLoading(false)
       Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Withdraw Successful",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    catch (error) {
      setLoading(false)
      Swal.fire({
        position: "top-end",
        icon: "error",
        title:`${error}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  const autorityAddBalance=async(info)=>{
    setLoading(true)
    const addBalanceAmount=parseFloat(info.addedBalance);
    try{
      await contract.methods.addMoney(addBalanceAmount).send({ from: account });
      const Balance = await contract.methods
          .getBalance()
          .call({ from: account });
        setBalance(Balance);
        setLoading(false)
      console.log(addBalanceAmount)
    }
    catch{
      setLoading(false)
    }
  }

  const handleSendBalance=async(info)=>{
    setLoading(true)
      const sendingAmount=parseFloat(info.sendBalance);
      const sendingAddress=info.userAccount;
      if(sendingAmount> balance){
        return Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Insufficient Balance",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      try{
        await contract.methods.setBalance(sendingAddress, sendingAmount).send({ from:account});
        const Balance = await contract.methods
        .getBalance()
        .call({ from: account });
      setBalance(Balance);
      setLoading(false)
      }
      catch{
          alert("Some Error")
          setLoading(false)
      }
  }

  const handleMakePayment= async(info)=>{
    setLoading(true)
      const payAmount=parseFloat(info.makePaymentAmount);
      const payAddress=info.userAccountforMakePayment;

      if(payAmount> balance){
        return Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Insufficient Balance",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      try{
        await contract.methods.makePayment(payAddress, payAmount).send({ from: account });
        const Balance = await contract.methods
        .getBalance()
        .call({ from: account });
      setBalance(Balance);
      setLoading(false)
      }
      catch{
          alert("some error")
          setLoading(false)
      }
  }

  return (
    <div className="h-screen bg-[#010313] text-[#D8E0FC] ">
      {
        loading ? <div><Loader></Loader> </div> : <div>
        {userType == "user" && (
          <div className="pt-20 flex flex-col items-center justify-center ">
            <h1>
              <span className="mb-2">Name:</span> {name}
            </h1>
            <h1 className="">Balance: {balance}</h1>
            <button
              onClick={openModal}
              type="submit"
              className="text-white mt-3 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 focus:outline-none "
            >
              Payment
            </button>
            <button
              onClick={openModal1}
              type="submit"
              className="text-white mt-3 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 focus:outline-none "
            >
              Withdraw
            </button>
          </div>
        )}
        {
          userType == "athority" && (
            <div className="pt-20 flex flex-col items-center justify-center ">
              <h1 className="">Total Balance: {balance}</h1>
              <button
               onClick={openModal2}
               type="submit"
              className="text-white mt-3 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 focus:outline-none "
            >
              Add Balance
            </button>
            <button
               onClick={openModal3}
               type="submit"
              className="text-white mt-3 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 focus:outline-none "
            >
              Send Balance
            </button>
            <button
               onClick={openModal4}
               type="submit"
              className="text-white mt-3 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-3 py-2 mr-2 mb-2 focus:outline-none "
            >
              Make Payment
            </button>

            </div>
          )
        }
      </div>
      }
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium mb-2 leading-6 text-gray-900"
                  >
                    Make Payment
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(handlePayment)}>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Amount
                      </label>
                      <input
                        {...register("amount")}
                        type="number"
                        min={1}
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Amount To Pay"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Address
                      </label>
                      <input
                        {...register("address")}
                        type="text"
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Receiver Address"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal}
                    >
                      Pay
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Withdraw Transition */}
      <Transition appear show={isOpen1} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal1}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium mb-2 leading-6 text-gray-900"
                  >
                    Withdraw Amount
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(handleWithdraw)}>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Amount
                      </label>
                      <input
                        {...register("withdrawAmount")}
                        type="number"
                        min={1}
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Amount To Pay"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal1}
                    >
                      Withdraw
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Authority Add Balance Transition */}
      <Transition appear show={isOpen2} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal2}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium mb-2 leading-6 text-gray-900"
                  >
                    Add Amount
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(autorityAddBalance)}>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Amount
                      </label>
                      <input
                        {...register("addedBalance")}
                        type="number"
                        min={1}
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Amount Want To Add"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal2}
                    >
                      Add Balance
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Send Balance Modal */}
      <Transition appear show={isOpen3} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal3}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium mb-2 leading-6 text-gray-900"
                  >
                    Send Balance
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(handleSendBalance)}>
                  <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Account No
                      </label>
                      <input
                        {...register("userAccount")}
                        type="text"
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter User Account No"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Amount
                      </label>
                      <input
                        {...register("sendBalance")}
                        type="number"
                        min={1}
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Amount Want To Send"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal3}
                    >
                      Send Balance
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
        {/* Make Payment Modal */}
        <Transition appear show={isOpen4} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal4}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium mb-2 leading-6 text-gray-900"
                  >
                    Make Payment
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(handleMakePayment)}>
                  <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Account No
                      </label>
                      <input
                        {...register("userAccountforMakePayment")}
                        type="text"
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter User Account No"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-black">
                        Amount
                      </label>
                      <input
                        {...register("makePaymentAmount")}
                        type="number"
                        min={1}
                        className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        placeholder="Enter Amount Want To Send"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                      onClick={closeModal4}
                    >
                      Pay
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </div>
  );
};

export default Login;
