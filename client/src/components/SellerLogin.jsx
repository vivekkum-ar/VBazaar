import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast";

const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate, axios} = useAppContext();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    useEffect(() => {
        if(isSeller){
            navigate("/seller");
        }
    },[isSeller]);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const {data} = await axios.post("/api/seller/login",{email,password});
            if(data.success){
                setIsSeller(true);
                navigate("/seller")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    } 
  return !isSeller && (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center text-sm text-gray-600 ">
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-96 rounded-lg shadow-xl border border-gray-200">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">Seller</span> Login
            </p>
            <div className="w-full">
                <p className="">Email</p>
                <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} name="" placeholder="Enter your email" id="email" required className="border border-gray-200 rounded w-full p-2 m-1 outline-primary"/>
            </div>
            <div className="w-full">
                <p className="">Password</p>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} name="" id="password" placeholder="Enter your password" required className="border border-gray-200 rounded w-full p-2 m-1 outline-primary"/>
            </div>
            <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">Login</button>
        </div>
    </form>
  )
}

export default SellerLogin