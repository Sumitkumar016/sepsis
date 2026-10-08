import React from "react";
import { useDispatch } from "react-redux";
import { postLogout } from "../store/auth";
import { clearUser } from "../store/user"; 
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Logout({ className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await dispatch(postLogout());

    if (postLogout.fulfilled.match(result)) {
      dispatch(clearUser());
      navigate("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#526174] dark:text-[#CBD5E1] hover:text-[#DC2626] dark:hover:text-[#F87171] bg-white hover:bg-[#FEF2F2] dark:bg-[#1E293B] dark:hover:bg-[#2A1517] border border-[#CBD5E1] dark:border-[#273449] hover:border-[#F5B5B5] dark:hover:border-[#4C1D24] px-3 py-2 rounded-xl transition-all cursor-pointer select-none ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  );
}