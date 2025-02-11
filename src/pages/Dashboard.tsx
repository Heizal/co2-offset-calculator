import EmissionCalculator from "../components/EmissionCalculator";

const Dashboard = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg mt-4">Track and reduce your carbon footprint.</p>
        
        <EmissionCalculator/>
      </div>
    );
  };
  
  export default Dashboard;
  