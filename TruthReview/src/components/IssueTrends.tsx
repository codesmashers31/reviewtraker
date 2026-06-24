import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Line } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface IssueTrendsProps {
  data?: {
    food: number;
    water: number;
    security: number;
    staff: number;
    valueForMoney: number;
  };
}

export default function IssueTrends({ data }: IssueTrendsProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  // Fallback default trend values over 6 months
  const monthlyData = [
    { month: 'Jan', food: 12, water: 8, security: 3, staff: 5, valueForMoney: 15 },
    { month: 'Feb', food: 15, water: 7, security: 2, staff: 6, valueForMoney: 12 },
    { month: 'Mar', food: 18, water: 10, security: 4, staff: 8, valueForMoney: 11 },
    { month: 'Apr', food: 14, water: 9, security: 2, staff: 12, valueForMoney: 9 },
    { month: 'May', food: 10, water: 6, security: 1, staff: 15, valueForMoney: 8 },
    { month: 'Jun', food: data?.food || 8, water: data?.water || 5, security: data?.security || 1, staff: data?.staff || 7, valueForMoney: data?.valueForMoney || 6 },
  ];

  // Calculate overall total complaints monthly
  const totals = monthlyData.map(m => m.food + m.water + m.security + m.staff + m.valueForMoney);
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
    { name: 'Food', count: data?.food || 0, color: 'bg-amber-500', textCol: 'text-amber-700', bgCol: 'bg-amber-50' },
    { name: 'Water', count: data?.water || 0, color: 'bg-blue-500', textCol: 'text-blue-700', bgCol: 'bg-blue-50' },
    { name: 'Security', count: data?.security || 0, color: 'bg-rose-500', textCol: 'text-rose-700', bgCol: 'bg-rose-50' },
    { name: 'Staff', count: data?.staff || 0, color: 'bg-orange-500', textCol: 'text-orange-700', bgCol: 'bg-orange-50' },
    { name: 'Value', count: data?.valueForMoney || 0, color: 'bg-purple-500', textCol: 'text-purple-700', bgCol: 'bg-purple-50' },
  ];

  return (
    <View className="bg-slate-50 border border-slate-100 rounded-3xl p-5 shadow-sm">
      <View className="mb-4">
        <Text className="text-base font-extrabold text-slate-800">Verified Complaint Trends</Text>
        <Text className="text-xs font-semibold text-slate-400 mt-0.5">Overall platform tracking for the last 6 months</Text>
      </View>

      {/* SVG Chart */}
      <View className="relative items-center mb-6">
        <Svg height={chartHeight} width={chartWidth}>
          <Defs>
            <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#14B8A6" stopOpacity={0.25} />
              <Stop offset="100%" stopColor="#14B8A6" stopOpacity={0.0} />
            </LinearGradient>
          </Defs>

          {/* Grid Lines */}
          <Line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" strokeWidth={1} />
          <Line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth={1} />
          <Line x1={padding} y1={(chartHeight - padding) / 2} x2={chartWidth - padding} y2={(chartHeight - padding) / 2} stroke="#f8fafc" strokeWidth={1} />

          {/* Area Fill */}
          {areaD ? <Path d={areaD} fill="url(#chartGrad)" /> : null}

          {/* Line Path */}
          {pathD ? <Path d={pathD} fill="none" stroke="#14B8A6" strokeWidth={3} /> : null}

          {/* Data Nodes */}
          {points.map((pt, idx) => (
            <Circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={selectedPoint === idx ? 6 : 4}
              fill={selectedPoint === idx ? '#0d9488' : '#ffffff'}
              stroke="#14B8A6"
              strokeWidth={selectedPoint === idx ? 3 : 2}
              onPress={() => setSelectedPoint(selectedPoint === idx ? null : idx)}
            />
          ))}
        </Svg>

        {/* Labels under the points */}
        <View className="flex-row justify-between w-full px-4 mt-1">
          {monthlyData.map((d, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedPoint(index)}>
              <Text className={`text-[10px] font-bold ${selectedPoint === index ? 'text-primary-600' : 'text-slate-400'}`}>
                {d.month}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info tooltips on click */}
        {selectedPoint !== null && (
          <View className="absolute top-1 bg-slate-800 px-3 py-1 rounded-xl shadow-lg border border-slate-700">
            <Text className="text-[10px] text-white font-extrabold text-center">
              {monthlyData[selectedPoint].month}: {totals[selectedPoint]} complaints
            </Text>
          </View>
        )}
      </View>

      {/* Category complaints distribution */}
      <View className="space-y-2.5 gap-2">
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Issue Distribution</Text>
        {currentStats.map((item) => (
          <View key={item.name} className="flex-row items-center justify-between">
            <View className="flex-row items-center w-28">
              <View className={`h-2.5 w-2.5 rounded-full ${item.color} mr-2`} />
              <Text className="text-xs text-slate-600 font-bold">{item.name}</Text>
            </View>

            {/* Percentage Bar */}
            <View className="flex-1 h-2 bg-slate-100 rounded-full mx-2 overflow-hidden">
              <View
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
