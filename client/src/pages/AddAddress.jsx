import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast"; // Ensure toast is imported

/* ------------------------------- Input field ------------------------------ */
// NOTE: The 'address' prop here is actually the full address STATE object.
const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    onChange={handleChange}
    // Reads the value from the full 'address' object using the input's 'name'
    value={address[name]} 
    required
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
  />
);


const AddAddress = () => {
    
    
    const [address, setAddress] = useState({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
    });

    const {axios,user,navigate} = useAppContext();

    // 🎯 FIXED: Function now accepts the event object 'e'
    const handleChange = (e) => { 
        const {name , value} = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        // 🚨 IMPORTANT: You must validate on the client side that the 
        // phone/zipcode fields (numbers) are not empty strings before sending.
        // Mongoose Number type validation is strict.
        if (address.zipcode === "" || address.phone === "") {
            toast.error("Zipcode and Phone are required.");
            return;
        }

        try {
            const {data} = await axios.post("/api/address/add", {address});
            if(data.success){
                 toast.success(data.message);
                 navigate("/cart");
                }else{
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        
        useEffect(() => {
            // Protection: If the user context is not loaded, redirect
            if(user === null){
                // Optionally navigate to login if not logged in at all, 
                // but navigate("/cart") is fine if Cart handles the login redirect.
                navigate("/cart"); 
            }
        }, [user, navigate]);
        

    return (
        <div className='mt-16 pb-16'>
            <p className="text-2xl md:text-3xl text-gray-500">Add Shipping <span className="font-semibold text-primary">Address</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
                        <div className='grid grid-cols-2 gap-4'>
    {/* 🎯 FIXED: Pass the entire 'address' object as prop */}
    <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder="First Name" /> 
    <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder="Last Name" />
</div>

{/* 🎯 FIXED: Pass the entire 'address' object as prop */}
<InputField handleChange={handleChange} address={address} name='email' type="email" placeholder="Email address" />
<InputField handleChange={handleChange} address={address} name='street' type="text" placeholder="Street" />

<div className="grid grid-cols-2 gap-4">
    {/* 🎯 FIXED: Pass the entire 'address' object as prop */}
    <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder="City" /> 
    <InputField handleChange={handleChange} address={address} name='state' type="text" placeholder="State" /> 
</div>
<div className="grid grid-cols-2 gap-4">
    {/* 🎯 FIXED: Pass the entire 'address' object as prop */}
    <InputField handleChange={handleChange} address={address} name='zipcode' type="number" placeholder="Zip Code" /> 
    <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder="Country" /> 
</div>
    {/* 🎯 FIXED: Pass the entire 'address' object as prop */}
    <InputField handleChange={handleChange} address={address} name='phone' type="text" placeholder="Phone" />
    
    {/* REMOVED onChange from button as it's handled by form onSubmit */}
    <button type="submit" className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">Save Address</button> 
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0 scale-25 md:scale-50 absolute top-0 right-0 hidden md:block' src={assets.add_address_iamge} alt="Add Address" />
            </div>
        </div>
    )
}

export default AddAddress