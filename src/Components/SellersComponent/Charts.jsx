
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Bell, ShoppingCart, UserPlus, AlertCircle, AlertTriangle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardCharts = ({ darkMode, revenueData, userGrowthData, categoryData }) => {
  // Prepare Bar Chart (Monthly Revenue)
  const barData = {
    labels: revenueData.map((item, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map((item) => item.revenue),
        backgroundColor: '#8E6BF0',
        borderRadius: 6,
        barThickness: 32,
        hoverBackgroundColor: '#7e5de1',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [3, 3] } },
    },
  };

  // Prepare Line Chart (User Growth)
  const lineData = {
    labels: userGrowthData.map((_, index) => `Week ${index + 1}`),
    datasets: [
      {
        label: 'User Growth',
        data: userGrowthData.map((item) => item.users),
        fill: true,
        backgroundColor: 'rgba(130, 202, 157, 0.2)',
        borderColor: '#82ca9d',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [3, 3] } },
    },
  };

  // Prepare Pie Chart (Category Stats)
  const pieData = {
    labels: categoryData.map((item) => item._id),
    datasets: [
      {
        label: 'Product Category',
        data: categoryData.map((item) => item.count),
        backgroundColor: ['#6347EB', '#8F63E9', '#B37DE8', '#8989F5', '#FFA07A', '#FFD700'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: { position: 'right' },
      tooltip: { mode: 'index', intersect: false },
    },
  };

  const activities = [
    {
      type: 'order',
      title: 'New Order Update',
      description: 'Order #4312 from John',
      time: '5 mins ago',
      badge: 'New',
    },
    {
      type: 'user',
      title: 'New User Registration',
      description: 'User: Sarah',
      time: '10 mins ago',
      badge: 'New',
    },
    {
      type: 'warning',
      title: 'Low Stock Warning',
      description: 'Product: iPhone 14 Pro',
      time: '30 mins ago',
      badge: 'Warning',
    },
    {
      type: 'alert',
      title: 'Payment Gateway Issue',
      description: 'Payment failed for order #4321',
      time: '45 mins ago',
      badge: 'Alert',
    },
  ];

  const iconMap = {
    order: { icon: ShoppingCart, bg: '', color: 'text-blue-600' },
    user: { icon: UserPlus, bg: '', color: 'text-green-600' },
    warning: { icon: AlertTriangle, bg: '', color: 'text-yellow-600' },
    alert: { icon: AlertCircle, bg: '', color: 'text-red-600' },
  };

  const badgeStyle = {
    New: 'bg-blue-100 text-blue-700',
    Warning: 'bg-yellow-100 text-yellow-700',
    Alert: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 space-y-8">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Revenue - Bar Chart */}
        <div className={`shadow-lg p-4 rounded-xl ${darkMode ? 'bg-[#2C2C36] text-white' : 'bg-white text-gray-800'}`}>
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <Bar data={barData} options={barOptions} />
        </div>

        {/* User Growth - Line Chart */}
        <div className={`shadow-lg p-4 rounded-xl ${darkMode ? 'bg-[#2C2C36] text-white' : 'bg-white text-gray-800'}`}>
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Category - Pie Chart */}
        <div className={`shadow-lg p-4 rounded-xl ${darkMode ? 'bg-[#2C2C36] text-white' : 'bg-white text-gray-800'}`}>
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <Pie data={pieData} options={pieOptions} />
        </div>

        {/* Recent Activity */}
        <div
          className={`w-full shadow-md rounded-2xl p-6 transition-all ${
            darkMode ? 'bg-[#1F2937] text-white' : 'bg-white text-gray-800'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <button className="text-sm text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 px-4 py-1.5 rounded-md transition">
              View All
            </button>
          </div>

          <ul className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = iconMap[activity.type].icon;
              const color = iconMap[activity.type].color;
              const badge = badgeStyle[activity.badge];

              return (
                <li
                  key={index}
                  className={`flex items-start gap-4 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } p-4 rounded-xl transition-all`}
                >
                  <div className="p-3 rounded-xl">
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs mt-1 text-gray-400">{activity.time}</p>
                  </div>
                  <span
                    className={`${badge} px-3 py-1 text-xs font-semibold rounded-full shadow-sm whitespace-nowrap`}
                  >
                    {activity.badge}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
