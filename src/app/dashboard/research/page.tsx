'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  Download,
  Eye,
  Star,
  Clock,
  FileText,
  ExternalLink
} from "lucide-react";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  citationCount: number;
  downloadCount: number;
  viewCount: number;
  agentType: 'autonomous' | 'collaborative' | 'hybrid';
  tags: string[];
}

const mockPapers: ResearchPaper[] = [
  {
    id: "1",
    title: "Autonomous Decision-Making in Multi-Agent Trading Systems",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    abstract: "This paper presents a novel approach to autonomous decision-making in multi-agent trading systems, utilizing reinforcement learning and game theory to optimize trading strategies in volatile markets.",
    publishedDate: "2024-01-15",
    categories: ["Machine Learning", "Trading Systems", "Multi-Agent Systems"],
    status: "published",
    citationCount: 23,
    downloadCount: 156,
    viewCount: 892,
    agentType: "autonomous",
    tags: ["reinforcement learning", "game theory", "trading", "optimization"]
  },
  {
    id: "2",
    title: "Collaborative AI Agents for Real-time Market Analysis",
    authors: ["Dr. Alex Thompson", "Dr. Maria Gonzalez", "James Park"],
    abstract: "We explore the implementation of collaborative AI agents that work together to analyze market data in real-time, sharing insights and coordinating responses to market events.",
    publishedDate: "2024-02-03",
    categories: ["Collaborative AI", "Market Analysis", "Real-time Systems"],
    status: "published",
    citationCount: 18,
    downloadCount: 203,
    viewCount: 1247,
    agentType: "collaborative",
    tags: ["collaboration", "real-time", "market analysis", "coordination"]
  },
  {
    id: "3",
    title: "Hybrid Agent Architecture for Adaptive Trading Strategies",
    authors: ["Dr. Lisa Wang"],
    abstract: "This research introduces a hybrid agent architecture that combines rule-based systems with machine learning to create adaptive trading strategies that can evolve with changing market conditions.",
    publishedDate: "2024-02-20",
    categories: ["Hybrid Systems", "Adaptive Algorithms", "Trading"],
    status: "draft",
    citationCount: 0,
    downloadCount: 45,
    viewCount: 234,
    agentType: "hybrid",
    tags: ["hybrid architecture", "adaptive systems", "rule-based", "machine learning"]
  }
];

const PaperCard = ({ paper, index }: { paper: ResearchPaper, index: number }) => {
  const statusColors = {
    published: "bg-green-400/10 text-green-400",
    draft: "bg-yellow-400/10 text-yellow-400",
    archived: "bg-gray-400/10 text-gray-400"
  };

  const agentTypeColors = {
    autonomous: "bg-blue-400/10 text-blue-400",
    collaborative: "bg-purple-400/10 text-purple-400",
    hybrid: "bg-orange-400/10 text-orange-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group cursor-pointer"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-white mb-2 group-hover:text-white/90 transition-colors">
              {paper.title}
            </h3>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <User className="w-4 h-4" />
              <span>{paper.authors.join(", ")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[paper.status]}`}>
              {paper.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${agentTypeColors[paper.agentType]}`}>
              {paper.agentType}
            </span>
          </div>
        </div>

        {/* Abstract */}
        <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
          {paper.abstract}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {paper.categories.map((category) => (
            <span 
              key={category}
              className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{paper.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{paper.downloadCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{paper.citationCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ResearchPapersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/10 rounded-2xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-light text-white mb-2">Research Papers</h1>
            <p className="text-white/60">AI Agent research publications and documentation</p>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search papers by title, author, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
            >
              <option value="date">Sort by Date</option>
              <option value="views">Sort by Views</option>
              <option value="citations">Sort by Citations</option>
              <option value="downloads">Sort by Downloads</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/15 hover:border-white/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Paper
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-4 gap-6"
      >
        {[
          { label: "Total Papers", value: "23", icon: FileText, color: "blue" },
          { label: "Published", value: "18", icon: BookOpen, color: "green" },
          { label: "In Review", value: "3", icon: Clock, color: "yellow" },
          { label: "Total Citations", value: "156", icon: Star, color: "purple" }
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "text-blue-400",
            green: "text-green-400", 
            yellow: "text-yellow-400",
            purple: "text-purple-400"
          };
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center"
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
              <div className="text-2xl font-light text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Papers Grid */}
      <div className="space-y-6">
        {mockPapers.map((paper, index) => (
          <PaperCard key={paper.id} paper={paper} index={index} />
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/15 hover:border-white/30 transition-all"
        >
          Load More Papers
        </motion.button>
      </motion.div>
    </div>
  );
}