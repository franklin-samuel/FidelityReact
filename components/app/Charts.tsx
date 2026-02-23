import React from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    BarChart as RechartsBarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { formatCurrency } from '@/utils/formatter';

// Custom Tooltip Component
interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    formatValue?: (value: number) => string;
}

export function CustomTooltip({ active, payload, label, formatValue }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-sm">
            <p className="text-zinc-500 mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {formatValue ? formatValue(p.value) : p.value}
                </p>
            ))}
        </div>
    );
}

// Line Chart Component
interface LineChartProps {
    data: any[];
    dataKey: string;
    xAxisKey: string;
    name: string;
    color?: string;
    height?: number;
    formatYAxis?: (value: number) => string;
    formatTooltip?: (value: number) => string;
}

export function LineChart({
                              data,
                              dataKey,
                              xAxisKey,
                              name,
                              color = '#f59e0b',
                              height = 240,
                              formatYAxis,
                              formatTooltip,
                          }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 11 }}
                    width={64}
                />
                <Tooltip content={<CustomTooltip formatValue={formatTooltip} />} />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    name={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                />
            </RechartsLineChart>
        </ResponsiveContainer>
    );
}

// Bar Chart Component
interface BarChartProps {
    data: any[];
    dataKey: string;
    xAxisKey: string;
    name: string;
    color?: string | string[];
    height?: number;
    formatYAxis?: (value: number) => string;
    formatTooltip?: (value: number) => string;
    layout?: 'horizontal' | 'vertical';
}

export function BarChart({
                             data,
                             dataKey,
                             xAxisKey,
                             name,
                             color = '#f59e0b',
                             height = 200,
                             formatYAxis,
                             formatTooltip,
                             layout = 'horizontal',
                         }: BarChartProps) {
    const isVertical = layout === 'vertical';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
                data={data}
                layout={layout}
                margin={{ top: 4, right: 8, left: isVertical ? 16 : 0, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    horizontal={!isVertical}
                />
                {isVertical ? (
                    <>
                        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={formatYAxis} />
                        <YAxis type="category" dataKey={xAxisKey} tick={{ fontSize: 11 }} width={80} />
                    </>
                ) : (
                    <>
                        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11 }} width={64} />
                    </>
                )}
                <Tooltip content={<CustomTooltip formatValue={formatTooltip} />} />
                <Bar
                    dataKey={dataKey}
                    name={name}
                    radius={isVertical ? [0, 4, 4, 0] : [6, 6, 0, 0]}
                >
                    {Array.isArray(color) && data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={color[index % color.length]} />
                    ))}
                    {!Array.isArray(color) && <Cell fill={color} />}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
}

// Pie Chart Component
interface PieChartProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    colors: string[];
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    showLegend?: boolean;
    formatTooltip?: (value: number) => string;
}

export function PieChart({
                             data,
                             dataKey,
                             nameKey,
                             colors,
                             height = 200,
                             innerRadius = 0,
                             outerRadius = 70,
                             showLegend = true,
                             formatTooltip,
                         }: PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    dataKey={dataKey}
                    nameKey={nameKey}
                    paddingAngle={innerRadius > 0 ? 3 : 2}
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatTooltip ? formatTooltip(v) : v} />
                {showLegend && <Legend iconType="circle" iconSize={10} />}
            </RechartsPieChart>
        </ResponsiveContainer>
    );
}