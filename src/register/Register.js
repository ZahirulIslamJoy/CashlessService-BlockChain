import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Web3 from "web3";
import {
  CashLessContract,
  contactId,
  initializeWeb3,
} from "../hooks/Web3Initialize";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  const CashLessContract =[
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "uint256",
  // 				"name": "_amount",
  // 				"type": "uint256"
  // 			}
  // 		],
  // 		"name": "addMoney",
  // 		"outputs": [],
  // 		"stateMutability": "nonpayable",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "string",
  // 				"name": "_name",
  // 				"type": "string"
  // 			},
  // 			{
  // 				"internalType": "string",
  // 				"name": "_class",
  // 				"type": "string"
  // 			}
  // 		],
  // 		"name": "createAccount",
  // 		"outputs": [],
  // 		"stateMutability": "nonpayable",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "address",
  // 				"name": "_seller",
  // 				"type": "address"
  // 			},
  // 			{
  // 				"internalType": "uint256",
  // 				"name": "_amount",
  // 				"type": "uint256"
  // 			}
  // 		],
  // 		"name": "makePayment",
  // 		"outputs": [],
  // 		"stateMutability": "nonpayable",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "address",
  // 				"name": "_address",
  // 				"type": "address"
  // 			},
  // 			{
  // 				"internalType": "uint256",
  // 				"name": "_amount",
  // 				"type": "uint256"
  // 			}
  // 		],
  // 		"name": "setBalance",
  // 		"outputs": [],
  // 		"stateMutability": "nonpayable",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "string",
  // 				"name": "_name",
  // 				"type": "string"
  // 			}
  // 		],
  // 		"stateMutability": "nonpayable",
  // 		"type": "constructor"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "uint256",
  // 				"name": "_amount",
  // 				"type": "uint256"
  // 			}
  // 		],
  // 		"name": "withDraw",
  // 		"outputs": [],
  // 		"stateMutability": "nonpayable",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [],
  // 		"name": "authorityDetails",
  // 		"outputs": [
  // 			{
  // 				"internalType": "string",
  // 				"name": "",
  // 				"type": "string"
  // 			},
  // 			{
  // 				"internalType": "string",
  // 				"name": "",
  // 				"type": "string"
  // 			},
  // 			{
  // 				"internalType": "address",
  // 				"name": "",
  // 				"type": "address"
  // 			}
  // 		],
  // 		"stateMutability": "view",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "address",
  // 				"name": "_address",
  // 				"type": "address"
  // 			}
  // 		],
  // 		"name": "Details",
  // 		"outputs": [
  // 			{
  // 				"internalType": "string",
  // 				"name": "",
  // 				"type": "string"
  // 			},
  // 			{
  // 				"internalType": "string",
  // 				"name": "",
  // 				"type": "string"
  // 			}
  // 		],
  // 		"stateMutability": "view",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [],
  // 		"name": "getBalance",
  // 		"outputs": [
  // 			{
  // 				"internalType": "uint256",
  // 				"name": "",
  // 				"type": "uint256"
  // 			}
  // 		],
  // 		"stateMutability": "view",
  // 		"type": "function"
  // 	},
  // 	{
  // 		"inputs": [
  // 			{
  // 				"internalType": "address",
  // 				"name": "addr",
  // 				"type": "address"
  // 			}
  // 		],
  // 		"name": "loginCheck",
  // 		"outputs": [
  // 			{
  // 				"internalType": "string",
  // 				"name": "",
  // 				"type": "string"
  // 			}
  // 		],
  // 		"stateMutability": "view",
  // 		"type": "function"
  // 	}
  // ]

  const contact = CashLessContract;
  const id = contactId;
  console.log(id);

  useEffect(() => {
    const initialization = initializeWeb3();
    initialization
      .then((result) => {
        console.log("Promise fulfilled:", result);
        setAccount(result.account);
        setWeb3(result.web3Instance);
        setContract(result.contractInstance);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const userBalance = await contract?.methods
      .getBalance()
      .call({ from: account });
    console.log(userBalance);
    if (contract && account) {
      try {
        console.log(data);
        const web3Instance = new Web3(window.ethereum);
        const contractInstance = new web3Instance.eth.Contract(
          CashLessContract,
          contactId // Use the provided contract address here
        );

        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        await contractInstance.methods
          .createAccount(data.name, data.type)
          .send({ from: account });
        setLoading(false);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Account Create Successfully",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
        });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${error}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div className="h-screen bg-[#010313] text-[#D8E0FC] ">
      <h1>{account ? account : "o"}</h1>
      {loading ? (
        <div>
          <Loader></Loader>
        </div>
      ) : (
        <div>
          <div className="text-3xl text-center pt-12">Please Register Here</div>
          <div className="w-1/2  pt-12 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="">
                <label className="block mb-4 text-sm font-medium text-white dark:text-white">
                  Name*
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your Name"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-600" role="alert">
                    Name is required
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-4 text-sm font-medium text-white dark:text-white">
                  Select An Type
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("type")}
                >
                  <option value="student">Student</option>
                  <option value="seller">Seller</option>
                  <option value="teacher">Teacher</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="text-white mt-5 bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none "
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
