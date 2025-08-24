export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center">
            {/* Loading placeholders */}
            <div className="flex justify-center gap-3 mb-8">
              <div className="w-20 h-8 bg-white/10 rounded-full animate-pulse" />
              <div className="w-24 h-8 bg-white/10 rounded-full animate-pulse" />
              <div className="w-16 h-8 bg-white/10 rounded-full animate-pulse" />
            </div>
            
            {/* Title placeholder */}
            <div className="space-y-4 mb-8">
              <div className="h-16 bg-white/5 rounded-2xl animate-pulse max-w-4xl mx-auto" />
              <div className="h-12 bg-white/5 rounded-2xl animate-pulse max-w-3xl mx-auto" />
            </div>
            
            {/* Abstract placeholder */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 max-w-4xl mx-auto">
              <div className="h-6 bg-white/10 rounded mb-4 max-w-32 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded animate-pulse" />
                <div className="h-4 bg-white/5 rounded animate-pulse max-w-5/6" />
                <div className="h-4 bg-white/5 rounded animate-pulse max-w-4/5" />
              </div>
            </div>
            
            {/* Meta info placeholder */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}