export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar placeholder */}
          <div className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="h-6 bg-white/10 rounded mb-4 animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content placeholder */}
          <div className="flex-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="h-12 bg-white/10 rounded mb-6 max-w-md animate-pulse" />
              
              <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 bg-white/5 rounded animate-pulse max-w-5/6" />
                    <div className="h-4 bg-white/5 rounded animate-pulse max-w-4/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}