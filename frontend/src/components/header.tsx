import { GoHomeFill } from "react-icons/go";
import { ILink } from "../utils/interfaces";
import { BiDollar, BiLogOut } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { useUser } from "../context/user.context";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
// import useUser from "../hooks/use-user";

const NAV_OPTION: ILink[] = [
  {
    name: "Home",
    href: "#",
    icon: <GoHomeFill />,
  },
  {
    name: "Pricing",
    href: "#pricing",
    icon: <BiDollar />,
  },
];

const Header = () => {
  const { isSignedIn, fetchUser, signOut, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [shouldCollapseHeader, setShouldCollapseHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 32) {
        setShouldCollapseHeader(true);
      } else {
        setShouldCollapseHeader(false);
      }
    };

    fetchUser();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await signOut();
      toast.success("Signed out successfully", {
        id: toastId,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
        });
      }
      toast.error("Error signing out", {
        id: toastId,
      });
    }
  };

  return (
    <div
      className={`sticky top-2 w-[95vw] sm:w-[80vw]  m-auto px-2  transition-all duration-300 ${
        shouldCollapseHeader
          ? " py-2 bg-background/20   backdrop-blur-xs z-50"
          : "py-8 bg-background "
      }`}
    >
      <div className="flex w-full justify-between items-center">
        <img
          src="/icons/rect-logo.png"
          alt=""
          className="w-[40%] md:w-[30%] lg:w-[20%]"
        />

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {NAV_OPTION.map((option) => (
            <a
              key={option.name}
              href={option.href}
              className="flex items-center gap-2 text-gray-200 hover:text-primary transition duration-300"
            >
              {option.icon}
              <span className="text-lg font-semibold">{option.name}</span>
            </a>
          ))}

          <a
            href={isSignedIn ? "/console" : "/auth"}
            className="border px-2 py-1 rounded-md border-primary bg-primary hover:bg-transparent shadow-[2px_0_10px] shadow-primary/60 hover:text-primary font-bold active:scale-95 transition duration-300"
          >
            {isSignedIn ? "Console" : "Get Started"}
          </a>
          {isSignedIn && (
            <div className="size-12 bg-red-500 overflow-hidden rounded-full border-2 border-primary">
              <img src={user?.avatar} alt="avatar" className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Mobile Nav */}
        <div
          className="md:hidden flex gap-4 justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <a
            href="#"
            className="border px-2 py-1 rounded-md border-primary bg-primary hover:bg-transparent shadow-[2px_0_10px] shadow-primary/60 hover:text-primary font-bold active:scale-95 transition duration-300"
          >
            Get Started
          </a>
          <BiLogOut />
          {!isOpen && (
            <IoMenu className="text-2xl text-gray-500 hover:text-primary active:scale-75 transition duration-150" />
          )}
          {isOpen && (
            <IoMdClose className="text-2xl text-gray-500 hover:text-primary active:scale-75 transition duration-150" />
          )}
        </div>
      </div>
      <div
        className={`md:hidden flex flex-col gap-4 mt-8 px-4 
           ${isOpen ? "block" : "hidden"}`}
      >
        {NAV_OPTION.map((option) => (
          <a
            key={option.name}
            href={option.href}
            className="flex md:hidden items-center gap-2 text-gray-200 hover:text-primary transition duration-300"
          >
            {option.icon}
            <span className="text-lg font-semibold">{option.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Header;
