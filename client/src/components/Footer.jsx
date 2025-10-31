import { NavLink } from "react-router-dom";
import { assets, footerLinks } from "../assets/assets.js";

const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                     <NavLink onClick={() => setOpen(false)} to="/" className='flex flex-row justify-left items-center gap-2' >
                <img src={assets.logo} alt="" className='w-10 scale-150' />
                <h1 className='text-transparent bg-linear-to-r from-gray-800 via-primary to-secondary bg-clip-text font-semibold text-2xl'>Bazaar</h1>
            </NavLink>
                    <p className="max-w-[410px] mt-6">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum unde quaerat eveniet cumque accusamus atque qui error quo enim fugiat?</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © <a href="https://prebuiltui.com">VyapaarBazaar</a> All Right Reserved.
            </p>
        </div>
    );
};

export default Footer