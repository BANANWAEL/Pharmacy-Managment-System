"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface DynamicHeaderProps {
  title: string;
  subtitle: string;
  tabs: Tab[];
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({
  title,
  subtitle,
  tabs,
}) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold text-primary-text  tracking-tight">
          {title}
        </h1>
        <p className="text-muted-text text-base">{subtitle}</p>
      </div>

      {/* Pill-shaped Tabs Container */}
      <div className="flex items-center ">
        {/* استخدمت bg-background عشان ده اللون الرمادي الفاتح اللي في الـ :root عندك */}
        <div className="inline-flex bg-manager-gray p-0.5 rounded-xl  border border-darkgray/10 ">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  px-12 py-1  text-sm    transition-all duration-300
                  ${
                    isActive
                      ? "rounded-xl hover:text-primary-text bg-secondary"
                      : " text-primary-text " // bg-secondary هيقلب أبيض في الـ Light وأسود خفيف في الـ Dark
                  }
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DynamicHeader;
