"use client";
import { useState, useEffect } from "react";
import { User,Clock, Coffee, LogOut, Pause, Play } from "lucide-react";
import Image from "next/image";
const ShiftStatus = () => {
  const userData = {
    name: "Banan Wael", 
    image: "", // تأكدي إن الصورة موجودة في فولدر public
  };
  // حالة الـ Pause (Front-end Logic حالياً)
  const [isPaused, setIsPaused] = useState(false);

  // البيانات الأساسية للكروت
  // ملحوظة: الـ Shift Start و Break و End هيتربطوا بالباكيند لعرض الوقت الحقيقي
  const shiftInfo = [
    { label: "Shift Start Time", time: "9:00AM", icon: Clock, color: "text-primary-text" },
    { label: "Break Time", time: "13:00PM", icon: Coffee, color: "text-primary-text" },
    { label: "Shift End Time", time: "17:00PM", icon: LogOut, color: "text-primary-text" },
  ];
const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setCurrentDate(date);
  }, []);
  return (
    <div className="px-8 py-2 bg-white dark:bg-secondary shadow-sm rounded-3xl">
    <div className="  flex flex-col items-center justify-center">
      {/* 1. User Photo */}
      <div className="relative w-20 h-20 group">
        <div className="absolute inset-0 bg-mintgreen/20 rounded-full animate-pulse group-hover:hidden"></div>
        {/* <Image
          src={userData.image}
          alt="User Profile"
          fill
          className="rounded-full object-cover border-4 border-white dark:border-background shadow-md"
        />
         <User size={16} className="text-mintgreen" /> */}
      </div>

      {/* 2. User Name */}
      <h1 className="text-2xl font-black font-mono text-primary-text">
        {userData.name}
      </h1>

      {/* 3. Current Date */}
      <p className="text-sm font-bold text-muted-text mb-2">
       {currentDate}
      </p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
    
      {/* 1. كروت الأوقات الثابتة */}
      {shiftInfo.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index} 
            className="bg-white dark:bg-secondary px-3 rounded-xl shadow-sm flex flex-col items-center justify-center text-center  transition-all hover:shadow-md"
          >
            <div className="bg-background dark:bg-background/30  rounded-xl">
              <Icon size={14} className={item.color} />
            </div>
            <p className="text-xs font-black text-primary-text">{item.time}</p>
            <p className="text-[10px] text-muted-text font-bold uppercase tracking-wider ">
              {item.label}
            </p>
          </div>
        );
      })}

      {/* 2. زرار الـ Pause التفاعلي */}
      <button 
        onClick={() => setIsPaused(!isPaused)}
        className={`p-2 rounded-xl shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 ${
          isPaused 
            ? "bg-darkred border-darkred shadow-lg shadow-darkred/20" 
            : "bg-white dark:bg-secondary border-gray-50 dark:border-gray-800 hover:shadow-md"
        }`}
      >
        <div className={` rounded-xl ${isPaused ? "bg-white/20" : "bg-background dark:bg-background/30"}`}>
          {isPaused ? (
            <Play size={18} className="text-white fill-white" />
          ) : (
            <Pause size={18} className="text-darkred fill-darkred" />
          )}
        </div>
        
        <p className={`text-sm font-black transition-colors ${isPaused ? "text-white" : "text-primary-text"}`}>
          {isPaused ? "RESUME" : "PAUSE"}
        </p>
        
        <p className={`text-[10px] font-bold uppercase tracking-wider  ${isPaused ? "text-white/80" : "text-muted-text"}`}>
          Pause Shift
        </p>
      </button>
    </div>
    </div>
  );
};

export default ShiftStatus;