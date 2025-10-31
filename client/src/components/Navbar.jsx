import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from "../assets/assets.js"
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount,axios } = useAppContext();

    const logout = async () => {
        try {
            const {data} = await axios("/api/user/logout");
            if (data.success) {
                setUser(null);
                navigate("/");
                toast.success(data.message);
            }else{
                toast.success(data.message);

            }
        } catch (error) {
            toast.error(error.message);
            
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");

        }
    }, [searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink onClick={() => setOpen(false)} to="/" className='flex flex-row justify-center items-center gap-2' >
                <img src={assets.logo} alt="" className='w-10 scale-150' />
                <h1 className='text-transparent bg-linear-to-r from-gray-800 via-primary to-secondary bg-clip-text font-semibold text-2xl'>Bazaar</h1>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink className="" to={"/"}>Home</NavLink>
                <NavLink className="" to={"/products"}>All Product</NavLink>
                <NavLink className="" to={"/contact"}>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" onChange={(e) => setSearchQuery(e.target.value)} />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4' />
                </div>

                <div onClick={() => { navigate("/cart") }} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-secondary transition text-white rounded-full">
                    Login
                </button>) : (
                    <div className="relative group">
                        <img src={assets.profile_icon} alt="user" className='w-10' />
                        <ul className="hidden group-hover:block top-10 absolute right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
                            <li className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer" onClick={() => { navigate("my-orders") }}>My Orders</li>
                            <li className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer" onClick={logout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 sm:hidden">
                <div onClick={() => { navigate("/cart") }} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" className='' />
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink className="" to={"/"} onClick={() => setOpen(false)}>Home</NavLink>
                <NavLink className="" to={"/products"} onClick={() => setOpen(false)}>All Product</NavLink>
                {
                    user && <NavLink className="" to={"/products"} onClick={() => setOpen(false)}>My Orders</NavLink>
                }
                <NavLink className="" to={"/contact"} onClick={() => setOpen(false)}>Contact</NavLink>

                {!user ? (
                    <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-secondary transition text-white rounded-full text-sm">
                        Login
                    </button>
                ) : (
                    <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-secondary transition text-white rounded-full text-sm">
                        Logout
                    </button>

                )}
            </div>)}

        </nav>
    )
}

export default Navbar