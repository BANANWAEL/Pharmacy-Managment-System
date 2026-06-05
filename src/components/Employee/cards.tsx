"use client";
import { TrendingUp, LucideIcon } from "lucide-react";

// تعريف الـ Props عشان نغير القيم بسهولة
interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface StatsGridProps {
  title?: string;
  subtitle?: string;
  data: StatItem[];
}

export default function StatsGrid({ title, subtitle, data }: StatsGridProps) {
  return (
    <div className="bg-secondary p-5 rounded-4xl shadow-sm border border-secondary/50 min-h-[200px]">
      {/* Header - بيظهر بس لو بعتي عنوان */}
      {(title || subtitle) && (
        <div className="mb-6 px-2">
          {title && <h1 className="text-xl font-bold text-primary-text">{title}</h1>}
          {subtitle && <p className="text-muted-text text-xs mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-background dark:bg-secondary/50 rounded-3xl p-5 border border-secondary shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-text uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <p className="text-xl font-black text-primary-text mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-4 bg-secondary/80 dark:bg-background px-2 py-1 rounded-full w-fit">
                    <span className="text-softgreen text-[10px] font-bold flex items-center gap-0.5">
                      <TrendingUp size={12} />
                      {stat.change}
                    </span>
                    <span className="text-muted-text text-[10px]">Vs Last Day</span>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-2xl`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}