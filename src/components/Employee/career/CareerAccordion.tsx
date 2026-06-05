"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase } from "lucide-react";

interface CareerItem {
  role: string;
  description: string;
  requirements: string;
}

const CareerAccordion = ({ role, description, requirements }: CareerItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-secondary shadow-sm transition-all">
      {/* Header - الجزء اللي بيتداس عليه */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-background/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="bg-mintgreen/10 p-3 rounded-2xl">
            <Briefcase className="text-mintgreen" size={24} />
          </div>
          <h3 className="text-xl font-black text-primary-text tracking-tight">
            {role} <span className="text-muted-text font-medium">— Required</span>
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp className="text-muted-text" size={24} />
        ) : (
          <ChevronDown className="text-muted-text" size={24} />
        )}
      </button>

      {/* Content - الجزء اللي بيفتح ويقفل */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-height-auto p-8 pt-0" : "max-height-0"
        }`}
        style={{ maxHeight: isOpen ? "500px" : "0" }}
      >
        <div className="space-y-4 border-t border-gray-50 dark:border-gray-800 pt-6">
          <div>
            <h4 className="text-sm font-bold text-mintgreen uppercase mb-2">Description</h4>
            <p className="text-muted-text leading-relaxed">{description}</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-mintgreen uppercase mb-2">Requirements</h4>
            <p className="text-muted-text leading-relaxed">{requirements}</p>
          </div>
          <button className="mt-4 bg-primary-text text-muted-text px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerAccordion;