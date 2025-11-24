"use client";
import React, { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { Nunito, Poppins } from "next/font/google";
import { useUserProfile } from "@/zustand";
const nunito = Nunito({
    subsets: ["latin"],
    weight: ["400", "500", "700", "1000", "900"],
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });
import { FaArrowLeft } from "react-icons/fa6";
import UserProfileBackgroundImage from "./UserProfileBackgroundImage";

const ChatsProfile = () => {
  return (
    <div>
      
    </div>
  )
}

export default ChatsProfile
