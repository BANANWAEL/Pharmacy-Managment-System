import CareerAccordion from "@/components/Employee/career/CareerAccordion";
const CareerPage = () => {
  const jobs = [
    {
      role: "Pharmacist",
      description: "We are looking for a licensed pharmacist to manage prescriptions and provide clinical advice.",
      requirements: "Bachelor of Pharmacy, 2+ years of experience in retail pharmacy."
    },
    {
      role: "Pharmacy Assistant",
      description: "Assist the pharmacist in labeling, stocking, and basic customer service.",
      requirements: "Technical diploma, good communication skills, basic computer knowledge."
    },
    {
      role: "Cashier",
      description: "Handle financial transactions and ensure customer satisfaction at the point of sale.",
      requirements: "High school diploma, experience with POS systems is a plus."
    },
    {
      role: "Inventory Keeper",
      description: "Manage stock levels, handle deliveries, and ensure proper storage of medications.",
      requirements: "Experience in warehouse management, attention to detail."
    }
  ];

  return (
    <div>
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-primary-text mb-2">Career Opportunities</h1>
        <p className="text-muted-text">Join the Appothecary team and help us build the future of pharmacy.</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <CareerAccordion key={index} {...job} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default CareerPage;