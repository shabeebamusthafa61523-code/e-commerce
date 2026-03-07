import React from "react";
import { Outlet } from "react-router-dom";
import DeliverySidebar from "./DeliverySidebar";

const DeliveryLayout = () => {
  return (
    // 1. Parent: Change bg to white or slate-50 to eliminate the "black bleed"
    <div className="flex min-h-screen bg-white">

      {/* Sidebar - Ensure this component has a fixed width like w-72 */}
      <DeliverySidebar />

      {/* Main Content */}
      {/* 2. Removed ml-72 and used flex-1 to let it naturally fill the space */}
      {/* 3. Changed bg to slate-50 to match your Dashboard and History styles */}
      <main className="flex-1 min-h-screen bg-slate-50 relative overflow-y-auto">

        {/* 4. Optional: Subtle Light Theme Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

        {/* 5. Max-width container for content consistency */}
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default DeliveryLayout;