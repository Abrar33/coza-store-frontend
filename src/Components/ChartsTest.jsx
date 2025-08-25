import {
  BarChart, Bar, LineChart, Line, Area, AreaChart,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const barData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4780 },
  { month: 'May', revenue: 5890 },
  { month: 'Jun', revenue: 6390 },
];

const lineData = [
  { week: 'Week 1', users: 200 },
  { week: 'Week 2', users: 400 },
  { week: 'Week 3', users: 350 },
  { week: 'Week 4', users: 600 },
];

const pieData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Others', value: 200 },
];

const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function DashboardCharts() {
  return (
    <div className="p-6 space-y-8">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Revenue - Bar Chart */}
        <div className=" dark:bg-[#2C2C36] shadow-xl p-6 rounded-xl transition-all">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
  <BarChart data={barData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar
      dataKey="revenue"
      fill="#8884d8"
       // << This line disables hover bar
    />
  </BarChart>
</ResponsiveContainer>
        </div>

        {/* User Growth - Line + Area Chart */}
        <div className="bg-white dark:bg-[#2C2C36] shadow-xl p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">User Growth</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={lineData}>
              <XAxis dataKey="week" stroke="#82ca9d" />
              <YAxis stroke="#82ca9d" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8 }} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#82ca9d"
                fill="#82ca9d"
                strokeWidth={3}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Category - Pie Chart */}
        <div className="bg-white dark:bg-[#2C2C36] shadow-xl p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Product Categories</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#2C2C36] shadow-xl p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h2>
          <ul className="space-y-3">
            {[
              { week: 'Week 1', change: '+10%', color: 'text-green-500' },
              { week: 'Week 2', change: '+15%', color: 'text-green-500' },
              { week: 'Week 3', change: '+5%', color: 'text-yellow-500' },
              { week: 'Week 4', change: '-2%', color: 'text-red-500' },
            ].map((item, i) => (
              <li key={i} className="flex justify-between text-sm border-b pb-2 dark:text-white">
                <span>{item.week}</span>
                <span className={`font-semibold ${item.color}`}>{item.change}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
