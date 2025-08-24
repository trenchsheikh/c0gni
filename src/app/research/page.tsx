'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  Eye,
  Download,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Iridescence from "@/components/Iridescence";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  categories: string[];
  readTime: string;
  viewCount: number;
  downloadCount: number;
  slug: string;
}

const featuredPaper: ResearchPaper = {
  id: "1",
  title: "Autonomous Decision-Making in Multi-Agent Trading Systems",
  authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
  abstract: "This paper presents a novel approach to autonomous decision-making in multi-agent trading systems, utilizing reinforcement learning and game theory to optimize trading strategies in volatile markets. Our framework demonstrates significant improvements in risk-adjusted returns while maintaining robust performance across different market conditions.",
  publishedDate: "2024-01-15",
  categories: ["Machine Learning", "Trading Systems", "Multi-Agent Systems"],
  readTime: "12 min read",
  viewCount: 892,
  downloadCount: 156,
  slug: "autonomous-trading-agents"
};

const recentPapers: ResearchPaper[] = [
  {
    id: "2",
    title: "Collaborative AI Agents for Real-time Market Analysis",
    authors: ["Dr. Alex Thompson", "Dr. Maria Gonzalez"],
    abstract: "We explore the implementation of collaborative AI agents that work together to analyze market data in real-time, sharing insights and coordinating responses to market events.",
    publishedDate: "2024-02-03",
    categories: ["Collaborative AI", "Market Analysis"],
    readTime: "8 min read",
    viewCount: 1247,
    downloadCount: 203,
    slug: "collaborative-market-analysis"
  },
  {
    id: "3",
    title: "Hybrid Agent Architecture for Adaptive Trading Strategies",
    authors: ["Dr. Lisa Wang"],
    abstract: "This research introduces a hybrid agent architecture that combines rule-based systems with machine learning to create adaptive trading strategies.",
    publishedDate: "2024-02-20",
    categories: ["Hybrid Systems", "Trading"],
    readTime: "10 min read",
    viewCount: 234,
    downloadCount: 45,
    slug: "hybrid-agent-architecture"
  },
  {
    id: "4",
    title: "Neural Network Optimization for High-Frequency Trading",
    authors: ["Prof. James Park", "Dr. Emily Chen"],
    abstract: "Exploring advanced neural network architectures optimized specifically for high-frequency trading environments with microsecond-level decision making.",
    publishedDate: "2024-03-01",
    categories: ["Neural Networks", "HFT"],
    readTime: "15 min read",
    viewCount: 567,
    downloadCount: 89,
    slug: "neural-hft-optimization"
  },
  {
    id: "5",
    title: "Risk Assessment in Autonomous Trading Systems",
    authors: ["Dr. Michael Brown", "Sarah Johnson"],
    abstract: "A comprehensive framework for real-time risk assessment and management in autonomous trading systems using advanced statistical methods.",
    publishedDate: "2024-03-10",
    categories: ["Risk Management", "Trading Systems"],
    readTime: "11 min read",
    viewCount: 445,
    downloadCount: 67,
    slug: "risk-assessment-framework"
  }
];

const categories = [
  "All",
  "Machine Learning",
  "Trading Systems",
  "Multi-Agent Systems",
  "Risk Management",
  "Neural Networks",
  "Market Analysis"
];

export default function ResearchPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPapers = recentPapers.filter(paper => {
    const matchesCategory = selectedCategory === "All" || paper.categories.includes(selectedCategory);
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A]">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center h-16 px-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="cursor-pointer pr-4 mr-4 border-r border-white/10"
            >
              <Image src="/c0gni-white.svg" alt="C0gni Labs" width={150} height={50} className="h-12" />
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out">
                <span className="relative z-10">Home</span>
              </button>
            </Link>
            <button className="relative px-3 py-1.5 text-sm font-medium text-white bg-white/10 rounded-full transition-all duration-300 ease-out">
              <span className="relative z-10">Research</span>
            </button>
            <Link href="/docs">
              <button className="relative px-3 py-1.5 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 ease-out">
                <span className="relative z-10">Docs</span>
              </button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Iridescence Background */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Iridescence Background - Only in Hero */}
        <div className="absolute inset-0 opacity-30">
          <Iridescence
            color={[.5, .4, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={0.4}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6">
              AI Agent Research
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Cutting-edge research in autonomous agents, multi-agent systems, and AI-driven trading technologies.
              Explore our latest findings and breakthroughs in artificial intelligence.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search research papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Paper */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">Featured Research</h2>
            <p className="text-white/60 text-lg">Latest breakthrough in AI agent research</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group overflow-hidden"
          >
            {/* Subtle background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="text-center lg:text-left">
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {featuredPaper.categories.map((category) => (
                    <span 
                      key={category}
                      className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-3xl font-light text-white mb-6 leading-tight">
                  {featuredPaper.title}
                </h3>
                
                <p className="text-white/70 mb-8 leading-relaxed text-lg">
                  {featuredPaper.abstract}
                </p>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/60 text-sm mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPaper.authors.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredPaper.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPaper.readTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-6 text-white/60 text-sm mb-8">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{featuredPaper.viewCount} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{featuredPaper.downloadCount} downloads</span>
                  </div>
                </div>
                
                <div className="flex justify-center lg:justify-start">
                  <Link href={`/research/${featuredPaper.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-medium hover:bg-white/90 transition-all"
                    >
                      Read Full Paper
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Papers Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light text-white mb-4">Recent Publications</h2>
            <p className="text-white/60 text-lg">Latest research from our AI labs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPapers.map((paper, index) => (
              <motion.article
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -4,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 group overflow-hidden"
              >
                {/* Subtle background pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.categories.slice(0, 2).map((category) => (
                      <span 
                        key={category}
                        className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-light text-white mb-4 leading-tight">
                    {paper.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-6 leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>
                  
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{paper.authors.slice(0, 2).join(", ")}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-white/60 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{paper.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{paper.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>{paper.downloadCount}</span>
                      </div>
                    </div>
                    
                    <Link href={`/research/${paper.slug}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <Image src="/c0gni-white.svg" alt="C0gni Labs" width={200} height={80} className="mx-auto mb-6" />
            <p className="text-white/60 text-sm">
              © 2024 C0gni Labs. Advancing AI research for autonomous systems.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}