
import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import DashboardCharts from '../../Components/SellersComponent/Charts';
import { getDashboardStats } from '../../services/OrdersServices';

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
      console.log('Dashboard stats:', data.categoryStats,data.monthlyRevenue, data.userGrowth);
      console.log('Dashboard stats monty:', data.monthlyRevenue, );
      console.log('Dashboard stats:usergrowth',  data.userGrowth);

    };

    fetchStats();
  }, []);

  if (!stats) return <div className="text-center mt-10">Loading dashboard...</div>;

  const cardData = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales || 0}`,
      change: '+12.5% from last month', // You can update this dynamically if needed
      icon: <DollarSign size={30} className="text-white" />,
      bg: 'bg-[#8E6BF0]',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      change: '+3.2% this week',
      icon: <Users size={30} className="text-white" />,
      bg: 'bg-[#4A90E2]',
    },
    {
      title: 'Orders Today',
      value: stats.ordersToday || 0,
      change: '+9.8% from yesterday',
      icon: <ShoppingCart size={30} className="text-white" />,
      bg: 'bg-[#50C878]',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate || 0}%`,
      change: '+1.1% this week',
      icon: <TrendingUp size={30} className="text-white" />,
      bg: 'bg-[#F5A623]',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl flex justify-between items-center transition-shadow duration-300 group ${
              darkMode
                ? 'bg-[#2C2C36] text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]'
                : 'bg-white text-gray-800 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]'
            }`}
          >
            <div className="space-y-3">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h4>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-green-500">{card.change}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} shadow-inner`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts
        darkMode={darkMode}
        revenueData={stats.monthlyRevenue || []}
        userGrowthData={stats.userGrowth || []}
        categoryData={stats.categoryStats || []}
      />
    </div>
  );
};

export default Dashboard;
