import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
export const AppContext = createContext();
import { toast } from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const fetchProducts = async () => {
    try {
      const {data} = await axios.get("/api/product/list")
      if(data.success){
        setProducts(data.products);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchSeller = async (req,res) => {
    try {
        const {data} = await axios.get("/api/seller/is-auth");
        if(data.success){
            setIsSeller(true);
        }else{
            setIsSeller(false);
        }
    } catch (error) {
        setIsSeller(false);
    }
  }

  const fetchUser = async (req,res) => {
    try {
        const {data} = await axios.get("/api/user/is-auth");
        if(data.success){
            setUser(data.user);
            setCartItems(data.user.cartItems);
        }else{
            setUser(null);
          }
        } catch (error) {
          console.log(error.message)
      setUser(null);
    }
  }
  /* --------------------------- Add Product to cart -------------------------- */
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId]++;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };

  /* ------------------------ Update cart item quantity ----------------------- */
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart Updated");
  };

  /* ------------------------ Remove product from cart ------------------------ */
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]>1) {
      cartData[itemId]--;

    }else if(cartData[itemId]) {
      delete cartData[itemId];
    }
    toast.success("Removed from Cart");
    setCartItems(cartData);
  };

  /* ---------------------------- Total cart Items ---------------------------- */
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  /* ---------------------------- Total cart amount --------------------------- */
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      let itemInfo = products.find((product) => product._id === item);
      if (cartItems[item] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[item];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProducts();
    fetchUser();
    fetchSeller();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const {data}= await axios.post("/api/cart/update",{cartItems});
        if(!data.success){
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    if(user){
      updateCart();
    }
    console.log("updated",user)
  }, [cartItems])
  

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    updateCartItem,
    removeFromCart,
    cartItems,
    addToCart,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
