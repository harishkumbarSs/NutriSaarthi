export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Today's Summary</h2>
          <p className="text-gray-600">Track your meals and water intake here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Nutrition Goals</h2>
          <p className="text-gray-600">Monitor your daily nutrition targets</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Coach Tips</h2>
          <p className="text-gray-600">Get personalized coaching recommendations</p>
        </div>
      </div>
    </div>
  )
}
