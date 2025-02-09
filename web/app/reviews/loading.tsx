export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 pt-24 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-forest-200">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-forest-200 rounded w-1/3"></div>
            <div className="h-32 bg-forest-100 rounded"></div>
            <div className="h-10 bg-forest-200 rounded w-full"></div>
            <div className="space-y-3">
              <div className="h-4 bg-forest-100 rounded"></div>
              <div className="h-4 bg-forest-100 rounded"></div>
              <div className="h-4 bg-forest-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
