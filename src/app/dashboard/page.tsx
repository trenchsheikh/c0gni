import React, { Suspense } from "react";
import { TrendingUp, Users, Brain, Zap, LucideIcon } from "lucide-react";
import { AnimatedContainer } from "@/components/dashboard/client/AnimatedContainer";
import { StatCard } from "@/components/dashboard/client/StatCard";
import { AnimatedButton } from "@/components/dashboard/client/AnimatedButton";

interface StatType {
  title: string;
  value: string;
  change: string;
  iconName: 'Brain' | 'Users' | 'Zap' | 'TrendingUp';
  trend: string;
}

const stats: StatType[] = [
  { title: "Active Projects", value: "24", change: "+12%", iconName: 'Brain', trend: "up" },
  { title: "Team Members", value: "18", change: "+3", iconName: 'Users', trend: "up" },
  { title: "AI Models Deployed", value: "42", change: "+8", iconName: 'Zap', trend: "up" },
  { title: "Performance Score", value: "98.2%", change: "+2.1%", iconName: 'TrendingUp', trend: "up" }
];

const recentActivity = [
  { action: "New AI model deployed", project: "Vision Recognition", time: "2 hours ago" },
  { action: "Team member added", project: "Natural Language Processing", time: "4 hours ago" },
  { action: "Analytics report generated", project: "Predictive Analytics", time: "6 hours ago" },
  { action: "System optimization completed", project: "Infrastructure", time: "1 day ago" }
];

// StatCard component moved to client components

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedContainer className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60">Monitor your AI projects and team performance</p>
      </AnimatedContainer>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2">
          <AnimatedContainer 
            delay={0.2}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <h3 className="text-xl font-medium text-white mb-6">Performance Analytics</h3>
            <div className="h-80 bg-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Interactive charts will be displayed here</p>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Recent Activity */}
        <AnimatedContainer 
          delay={0.3}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
        >
          <h3 className="text-xl font-medium text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <AnimatedContainer
                key={index}
                delay={0.4 + index * 0.1}
                direction="right"
                className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <p className="text-white text-sm font-medium mb-1">{activity.action}</p>
                <p className="text-white/60 text-sm mb-2">{activity.project}</p>
                <p className="text-white/40 text-xs">{activity.time}</p>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>
      </div>

      {/* Quick Actions */}
      <AnimatedContainer 
        delay={0.4}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <h3 className="text-xl font-medium text-white mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {["Deploy New Model", "Create Project", "Generate Report"].map((action) => (
            <AnimatedButton
              key={action}
              className="p-6 bg-white/10 rounded-2xl text-white hover:bg-white/15 transition-all duration-300 text-center"
            >
              <div className="text-lg font-medium">{action}</div>
            </AnimatedButton>
          ))}
        </div>
      </AnimatedContainer>
    </div>
  );
}