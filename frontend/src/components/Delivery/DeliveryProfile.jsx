const DeliveryProfile = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 mb-4">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center border-4 border-black">
             <span className="text-4xl font-bold text-white">{user.name[0]}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white">{user.name}</h3>
        <p className="text-emerald-400 text-sm font-medium tracking-widest uppercase">Verified Partner</p>
      </div>

      <div className="space-y-4">
        {/* Account Info */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <h5 className="text-gray-400 text-xs uppercase mb-4 tracking-wider">Contact Info</h5>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="text-white">{user.phone || '+91 XXXXX XXXXX'}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <h5 className="text-gray-400 text-xs uppercase mb-4 tracking-wider">Vehicle Details</h5>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Vehicle Number</span>
            <input 
              type="text" 
              placeholder="KL-XX-XXXX" 
              className="bg-transparent text-right text-white focus:outline-none border-b border-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeliveryProfile;