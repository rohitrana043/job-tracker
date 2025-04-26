// src/pages/DashboardPage.jsx
// Dashboard displaying application analytics and insights

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChevronRight,
  ArrowRight,
  FileText,
  Briefcase,
  Clock,
  MessageSquare,
  Check,
  X,
  Bell,
  CalendarDays,
} from 'lucide-react';
import { getCompanies } from '../utils/storage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  Applied: '#3b82f6', // blue
  Interview: '#8b5cf6', // purple
  Offer: '#10b981', // green
  Rejected: '#ef4444', // red
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalApplications: 0,
    statusBreakdown: [],
    weeklyApplications: [],
    responseRate: 0,
    upcomingFollowUps: [],
    recentApplications: [],
    topSkills: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const companies = getCompanies();

    // Calculate all needed stats
    calculateStats(companies);
  };

  const calculateStats = (companies) => {
    if (!companies || !companies.length) {
      return;
    }

    // Get all applications across all companies
    const allApplications = [];
    companies.forEach((company) => {
      if (company.applications && company.applications.length) {
        company.applications.forEach((app) => {
          allApplications.push({
            ...app,
            companyName: company.name,
            companyId: company.id,
          });
        });
      }
    });

    // Total counts
    const totalCompanies = companies.length;
    const totalApplications = allApplications.length;

    // Status breakdown
    const statusCounts = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    allApplications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });

    const statusBreakdown = Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));

    // Weekly applications data
    const weeklyData = calculateWeeklyApplications(allApplications);

    // Response rate (% of applications that moved beyond 'Applied' status)
    const responsesCount =
      statusCounts['Interview'] +
      statusCounts['Offer'] +
      statusCounts['Rejected'];
    const responseRate =
      totalApplications > 0
        ? Math.round((responsesCount / totalApplications) * 100)
        : 0;

    // Upcoming follow-ups
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingFollowUps = allApplications
      .filter((app) => {
        // Only include applications that:
        // 1. Have a follow-up date
        // 2. The follow-up date is today or in the future
        // 3. The application is still in 'Applied' status
        // 4. The application hasn't been followed up on yet
        if (!app.followUpDate) return false;

        const followUpDate = new Date(app.followUpDate);
        followUpDate.setHours(0, 0, 0, 0);

        return (
          followUpDate >= today && app.status === 'Applied' && !app.followedUp
        );
      })
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
      .slice(0, 5); // Get only the 5 most immediate follow-ups

    // Recent applications
    const recentApplications = [...allApplications]
      .sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied))
      .slice(0, 5);

    // Extract and count skills
    const skillsMap = {};
    allApplications.forEach((app) => {
      if (app.skills) {
        const skills = app.skills.split(',').map((s) => s.trim());
        skills.forEach((skill) => {
          if (skill) {
            skillsMap[skill] = (skillsMap[skill] || 0) + 1;
          }
        });
      }
    });

    const topSkills = Object.entries(skillsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Update state with all calculated stats
    setStats({
      totalCompanies,
      totalApplications,
      statusBreakdown,
      weeklyApplications: weeklyData,
      responseRate,
      upcomingFollowUps,
      recentApplications,
      topSkills,
    });
  };

  const calculateWeeklyApplications = (applications) => {
    if (!applications.length) return [];

    // Create a map of week start dates to count of applications
    const weekMap = {};

    applications.forEach((app) => {
      if (!app.dateApplied) return;

      const date = new Date(app.dateApplied);

      // Get the week's start date (Sunday)
      const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      const diff = date.getDate() - day;
      const weekStart = new Date(date.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weekMap[weekKey]) {
        weekMap[weekKey] = 0;
      }

      weekMap[weekKey]++;
    });

    // Convert to array and sort by date
    const weeklyData = Object.entries(weekMap)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week) - new Date(b.week));

    // Format dates for display
    return weeklyData.map((item) => ({
      week: formatDate(item.week),
      count: item.count,
    }));
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const renderStatusTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${data.name}: ${data.value} applications`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Application Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {stats.totalCompanies}
              </h2>
              <p className="text-sm text-gray-500">Total Companies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {stats.totalApplications}
              </h2>
              <p className="text-sm text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {stats.responseRate}%
              </h2>
              <p className="text-sm text-gray-500">Response Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {stats.upcomingFollowUps.length}
              </h2>
              <p className="text-sm text-gray-500">Pending Follow-ups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Application Status
          </h2>

          {stats.statusBreakdown.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {stats.statusBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[entry.name] ||
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={renderStatusTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No application data yet</p>
            </div>
          )}
        </div>

        {/* Weekly Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Applications
          </h2>

          {stats.weeklyApplications.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.weeklyApplications}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Applications"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No application data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Skills */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Top Skills Highlighted
        </h2>

        {stats.topSkills.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topSkills}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" name="Times Used" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No skills data yet</p>
          </div>
        )}
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h2>

            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {stats.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {stats.recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/company/${app.companyId}`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      app.status === 'Applied'
                        ? 'bg-blue-100'
                        : app.status === 'Interview'
                        ? 'bg-purple-100'
                        : app.status === 'Offer'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {app.status === 'Applied' ? (
                      <Clock className="h-4 w-4 text-blue-600" />
                    ) : app.status === 'Interview' ? (
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    ) : app.status === 'Offer' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{app.title}</h3>
                    <p className="text-sm text-gray-600">{app.companyName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      Applied {formatDate(app.dateApplied)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No applications yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Follow-ups
          </h2>

          {stats.upcomingFollowUps.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingFollowUps.map((app) => (
                <Link
                  key={app.id}
                  to={`/company/${app.companyId}`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 bg-yellow-100 rounded-full mr-3">
                    <Bell className="h-4 w-4 text-yellow-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{app.title}</h3>
                    <p className="text-sm text-gray-600">{app.companyName}</p>
                  </div>

                  <div className="text-right flex items-center">
                    <CalendarDays className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {formatDate(app.followUpDate)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No upcoming follow-ups</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
