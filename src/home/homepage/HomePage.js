import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const HomePage = () => {
  const [account, setAccount] = useState(null);

//   const contactId = "0xeccA881c787E8ef46e2618CE1ef2B1C0CD5eEeb3";


  const connectToMetamask = async () => {
    // Check if MetaMask is available
    if (!window.ethereum) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Please Install MetaMask First",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]); // Set the user's Ethereum account address
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your account has been connected",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-[#010313] text-[#D8E0FC] ">
      <div className="text-center w-[4/5] mx-auto h-full flex justify-center flex-col gap-8 items-center">
        <div>
          <button
            onClick={connectToMetamask}
            className={`py-2 px-8  rounded-lg ${
              account ? "bg-blue-700" : "bg-red-700"
            }`}
          >
            {account ? "Connected to Metamask" : "Connect with Metamask"}
          </button>
        </div>
        <div className="py-2 px-1 w-[120px] rounded-xl bg-blue-700">
          <Link to="/login" ><button>Login</button></Link>
        </div>
        <div className="py-2 px-1  w-[120px] rounded-xl bg-blue-700">
          <Link to="/registration"><button>Registration</button></Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
