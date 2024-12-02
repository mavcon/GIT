import React, { useState } from 'react';
import { formatTrainingDuration } from '../utils/dateUtils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SkillLevelProgress from '../components/stats/SkillLevelProgress';
import AchievementGrid from '../components/stats/AchievementGrid';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  lastUpdated?: string;
  startDate?: string;
  timeData?: Array<{ time: string; value: number }>;
  valueLabel?: string;
  chartType?: 'area' | 'bar' | 'progress' | 'achievements';
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  lastUpdated, 
  startDate,
  timeData,
  valueLabel,
  chartType = 'area',
  color = '#38bdf8'
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const formatXAxis = (value: string) => {
    const date = new Date(value);
    switch (timeRange) {
      case 'daily':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'weekly':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'monthly':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      default:
        return value;
    }
  };

  const renderChart = () => {
    if (!timeData && chartType !== 'progress' && chartType !== 'achievements') return null;

    const commonProps = {
      margin: { top: 20, right: 20, left: 20, bottom: 20 },
      className: "mt-4"
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200} {...commonProps}>
            <AreaChart data={timeData}>
              <defs>
                <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-base-content/20" />
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxis}
                className="text-base-content/70"
                tick={{ fontSize: 10 }}
                label={{ value: 'Time', position: 'bottom', offset: 0 }}
              />
              <YAxis
                className="text-base-content/70"
                tick={{ fontSize: 10 }}
                label={{ 
                  value: valueLabel, 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 10,
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--b1))',
                  border: '1px solid hsl(var(--bc) / 0.2)',
                  borderRadius: '0.5rem',
                  padding: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--bc))', marginBottom: '4px' }}
                itemStyle={{ color: 'hsl(var(--bc))', padding: '2px 0' }}
                formatter={(value: number) => [`${value} ${valueLabel}`, '']}
                labelFormatter={(label: string) => formatXAxis(label)}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fillOpacity={1}
                fill={`url(#color${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200} {...commonProps}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-base-content/20" />
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxis}
                className="text-base-content/70"
                tick={{ fontSize: 10 }}
                label={{ value: 'Time', position: 'bottom', offset: 0 }}
              />
              <YAxis
                className="text-base-content/70"
                tick={{ fontSize: 10 }}
                label={{ 
                  value: valueLabel, 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 10,
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--b1))',
                  border: '1px solid hsl(var(--bc) / 0.2)',
                  borderRadius: '0.5rem',
                  padding: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--bc))', marginBottom: '4px' }}
                itemStyle={{ color: 'hsl(var(--bc))', padding: '2px 0' }}
                formatter={(value: number) => [`${value} ${valueLabel}`, '']}
                labelFormatter={(label: string) => formatXAxis(label)}
              />
              <Bar 
                dataKey="value" 
                fill={color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'progress':
        const level = parseInt(value.split(' ')[1]);
        return (
          <div className="mt-8">
            <SkillLevelProgress level={level} maxLevel={10} color={color} />
          </div>
        );
      case 'achievements':
        return (
          <div className="mt-4">
            <AchievementGrid count={parseInt(value)} color={color} />
          </div>
        );
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-primary">{icon}</div>
          {trend && (
            <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium text-base-content">{title}</h3>
        <p className="text-2xl font-bold text-base-content mb-2">{value}</p>
        
        {timeData && chartType !== 'progress' && chartType !== 'achievements' && (
          <div className="flex gap-2 mb-4">
            <button
              className={`btn btn-xs ${timeRange === 'daily' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTimeRange('daily')}
            >
              Day
            </button>
            <button
              className={`btn btn-xs ${timeRange === 'weekly' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTimeRange('weekly')}
            >
              Week
            </button>
            <button
              className={`btn btn-xs ${timeRange === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setTimeRange('monthly')}
            >
              Month
            </button>
          </div>
        )}

        {renderChart()}

        <div className="text-sm text-base-content/70 mt-4">
          {startDate && (
            <div className="mb-1">
              Training since: {new Date(startDate).toLocaleDateString()}
              <br />
              Duration: {formatTrainingDuration(startDate)}
            </div>
          )}
          {lastUpdated && (
            <div>
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatsProps {
  currentUserId: string;
}

const Stats: React.FC<StatsProps> = ({ currentUserId }) => {
  const today = new Date().toISOString();
  const trainingStartDate = "2023-01-15T00:00:00Z";

  // Generate sample time data
  const generateTimeData = (baseValue: number, variance: number, days: number) => {
    const data = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        time: date.toISOString(),
        value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
      });
    }
    return data;
  };

  const statsData = [
    {
      title: "Calories Burned",
      value: "12,450",
      trend: { value: 12, isPositive: true },
      lastUpdated: today,
      timeData: generateTimeData(500, 200, 30),
      valueLabel: "calories",
      chartType: 'area' as const,
      color: '#38bdf8',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Training Sessions",
      value: "48",
      trend: { value: 8, isPositive: true },
      startDate: trainingStartDate,
      lastUpdated: today,
      timeData: generateTimeData(2, 2, 30),
      valueLabel: "sessions",
      chartType: 'bar' as const,
      color: '#10b981',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Total Hours Trained",
      value: "86",
      trend: { value: 15, isPositive: true },
      startDate: trainingStartDate,
      lastUpdated: today,
      timeData: generateTimeData(3, 2, 30),
      valueLabel: "hours",
      chartType: 'area' as const,
      color: '#8b5cf6',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Average Session Length",
      value: "1.8 hrs",
      trend: { value: 5, isPositive: true },
      lastUpdated: today,
      timeData: generateTimeData(1.8, 0.5, 30),
      valueLabel: "hours",
      chartType: 'bar' as const,
      color: '#f59e0b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Personal Records",
      value: "15",
      trend: { value: 20, isPositive: true },
      lastUpdated: today,
      chartType: 'achievements' as const,
      color: '#ec4899',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Skill Level Progress",
      value: "Level 4",
      trend: { value: 1, isPositive: true },
      startDate: trainingStartDate,
      lastUpdated: today,
      chartType: 'progress' as const,
      color: '#6366f1',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold mb-4">Training Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
          />
        ))}
      </div>
    </div>
  );
};

export default Stats;
