const DeliveryLayout = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <DeliverySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'dashboard' && <ActiveTasksScreen />}
        {activeTab === 'history' && <DeliveryHistoryScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>
    </div>
  );
};
export default DeliveryLayout;