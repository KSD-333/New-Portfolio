// /app/loading.tsx
export default function Loading() {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white font-mono">
          <p className="text-orange-500 text-xl mb-2">Ubuntu 24.04 LTS</p>
          <p className="text-sm">Loading desktop environment...</p>
        </div>
      </div>
    </div>
  )
}
