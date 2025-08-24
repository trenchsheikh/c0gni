export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="flex">
        {/* Sidebar placeholder */}
        <div className="w-64 bg-[#111111] p-6 min-h-screen">
          <div className="h-8 bg-white/10 rounded mb-8 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Main content placeholder */}
        <div className="flex-1 p-8">
          <div className="h-12 bg-white/10 rounded mb-8 max-w-md animate-pulse" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="h-6 bg-white/10 rounded mb-4 max-w-32 animate-pulse" />
                <div className="h-16 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="h-8 bg-white/10 rounded mb-6 max-w-48 animate-pulse" />
            <div className="h-64 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}