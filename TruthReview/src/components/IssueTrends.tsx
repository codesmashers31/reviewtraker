import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Line } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface IssueTrendsProps {
  data?: {
    food: number;
    water: number;
    safety: number;
    deposit: number;
    maintenance: number;
  };
}

export default function IssueTrends({ data }: IssueTrendsProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  // Fallback default trend values over 6 months
  const monthlyData = [
    { month: 'Jan', food: 12, water: 8, safety: 3, deposit: 5, maintenance: 15 },
    { month: 'Feb', food: 15, water: 7, safety: 2, deposit: 6, maintenance: 12 },
    { month: 'Mar', food: 18, water: 10, safety: 4, deposit: 8, maintenance: 11 },
    { month: 'Apr', food: 14, water: 9, safety: 2, deposit: 12, maintenance: 9 },
    { month: 'May', food: 10, water: 6, safety: 1, deposit: 15, maintenance: 8 },
    { month: 'Jun', food: data?.food || 8, water: data?.water || 5, safety: data?.safety || 1, deposit: data?.deposit || 7, maintenance: data?.maintenance || 6 },
  ];

  // Calculate overall total complaints monthly
  const totals = monthlyData.map(m => m.food + m.water + m.safety + m.deposit + m.maintenance);
  const maxTotal = Math.max(...totals, 10);

  // SVG dimensions
  const chartHeight = 150;
  const chartWidth = screenWidth - 64; // accounts for paddings
  const padding = 20;

  // Generate path points
  const points = monthlyData.map((d, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (monthlyData.length - 1);
    const y = chartHeight - padding - ((totals[index] / maxTotal) * (chartHeight - 2 * padding));
    return { x, y, value: totals[index], label: d.month };
  });

  // Build SVG path
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth curve calculation
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Build fill path (area chart)
  const areaD = pathD ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` : '';

  const currentStats = [
    { name: 'Food', count: data?.food || 0, color: 'bg-amber-500', textCol: 'text-amber-300', bgCol: 'bg-amber-950/25 border border-amber-500/20' },
    { name: 'Water', count: data?.water || 0, color: 'bg-blue-500', textCol: 'text-blue-300', bgCol: 'bg-blue-950/25 border border-blue-500/20' },
    { name: 'Safety', count: data?.safety || 0, color: 'bg-rose-500', textCol: 'text-rose-300', bgCol: 'bg-rose-950/25 border border-rose-500/20' },
    { name: 'Deposit', count: data?.deposit || 0, color: 'bg-orange-500', textCol: 'text-orange-300', bgCol: 'bg-orange-950/25 border border-orange-500/20' },
    { name: 'Maintenance', count: data?.maintenance || 0, color: 'bg-purple-500', textCol: 'text-purple-300', bgCol: 'bg-purple-950/25 border border-purple-500/20' },
  ];

  return (
    <View className="bg-card border border-borderSubtle rounded-4xl p-5 shadow-premium mb-4">
      <View className="mb-4">
        <Text className="text-base font-extrabold text-text">Verified Complaint Trends</Text>
        <Text className="text-xs font-semibold text-textMuted mt-0.5">Overall platform tracking for the last 6 months</Text>
      </View>

      {/* SVG Chart */}
      <View className="relative items-center mb-6">
        <Svg height={chartHeight} width={chartWidth}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
<<<<<<< HEAD
              <Stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
              <Stop offset="100%" stopColor="#2563EB" stopOpacity={0.0} />
=======
              <Stop offset="0%" stopColor="#14B8A6" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#14B8A6" stopOpacity={0.0} />
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
            </LinearGradient>
          </Defs>

          {/* Grid Lines */}
          <Line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <Line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
          <Line x1={padding} y1={(chartHeight - padding) / 2} x2={chartWidth - padding} y2={(chartHeight - padding) / 2} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />

          {/* Area Fill */}
          {areaD ? <Path d={areaD} fill="url(#chartGrad)" /> : null}

          {/* Line Path */}
<<<<<<< HEAD
          {pathD ? <Path d={pathD} fill="none" stroke="#2563EB" strokeWidth={3} /> : null}
=======
          {pathD ? <Path d={pathD} fill="none" stroke="#14B8A6" strokeWidth={3} /> : null}
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf

          {/* Data Nodes */}
          {points.map((pt, idx) => (
            <Circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={selectedPoint === idx ? 6 : 4}
<<<<<<< HEAD
              fill={selectedPoint === idx ? '#D4A5A5' : '#23283B'}
              stroke="#D4A5A5"
=======
              fill={selectedPoint === idx ? '#0d9488' : '#ffffff'}
              stroke="#14B8A6"
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
              strokeWidth={selectedPoint === idx ? 3 : 2}
              onPress={() => setSelectedPoint(selectedPoint === idx ? null : idx)}
            />
          ))}
        </Svg>

        {/* Labels under the points */}
        <View className="flex-row justify-between w-full px-4 mt-1">
          {monthlyData.map((d, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedPoint(index)}>
              <Text className={`text-[10px] font-bold ${selectedPoint === index ? 'text-accent-500' : 'text-textMuted'}`}>
                {d.month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info tooltips on click */}
        {selectedPoint !== null && (
          <View className="absolute top-1 bg-surface px-3 py-1 rounded-xl shadow-lg border border-borderSubtle">
            <Text className="text-[10px] text-text font-extrabold text-center">
              {monthlyData[selectedPoint].month}: {totals[selectedPoint]} complaints
            </Text>
          </View>
        )}
      </View>

      {/* Category complaints distribution */}
      <View className="space-y-2.5 gap-2">
        <Text className="text-xs font-bold text-textMuted uppercase tracking-widest mb-1">Current Issue Distribution</Text>
        {currentStats.map((item) => (
          <View key={item.name} className="flex-row items-center justify-between">
            <View className="flex-row items-center w-28">
              <View className={`h-2.5 w-2.5 rounded-full ${item.color} mr-2`} />
              <Text className="text-xs text-textBody font-bold">{item.name}</Text>
            </View>

            {/* Percentage Bar */}
<<<<<<< HEAD
            <View className="flex-1 h-2 bg-surface rounded-full mx-2 overflow-hidden border border-borderSubtle">
              <View 
=======
            <View className="flex-1 h-2 bg-slate-100 rounded-full mx-2 overflow-hidden">
              <View
>>>>>>> 101f518c270c77ed69e9979751ccb43938f2c0cf
                className={`h-full ${item.color} rounded-full`}
                style={{ width: `${Math.min((item.count / (maxTotal || 1)) * 100, 100)}%` }}
              />
            </View>

            <View className={`px-2 py-0.5 rounded-md ${item.bgCol}`}>
              <Text className={`text-[10px] font-black ${item.textCol}`}>
                {item.count} {item.count === 1 ? 'issue' : 'issues'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
