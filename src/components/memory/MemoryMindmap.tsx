'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ZoomIn, ZoomOut, X, Eye, Brain, Database } from 'lucide-react'
import type { MemoryNode, MemoryConnection, MindmapData } from '@/app/api/memories/public/route'

interface MemoryMindmapProps {
  data: MindmapData
  className?: string
  compact?: boolean // when true, collapse controls by default
}

interface D3Node extends MemoryNode, d3.SimulationNodeDatum {
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  radius?: number
  selected?: boolean
}

// Separate link type for D3 to avoid TS incompatibility with string-only endpoints
interface D3Link {
  source: D3Node | string
  target: D3Node | string
  strength: number
  type: MemoryConnection['type']
}

const categoryColors = {
  trading: 'rgba(255, 255, 255, 0.1)',
  defi: 'rgba(156, 163, 175, 0.1)',
  technical_analysis: 'rgba(209, 213, 219, 0.1)',
  blockchain_knowledge: 'rgba(255, 255, 255, 0.05)',
  market_sentiment: 'rgba(243, 244, 246, 0.1)',
  general: 'rgba(156, 163, 175, 0.05)',
} as const

const typeColors = {
  preference: '#ffffff20',
  fact: '#f3f4f620',
  context: '#d1d5db20',
  skill: '#9ca3af20',
  blockchain_knowledge: '#ffffff15',
  memory: '#e5e7eb20',
  message: '#f9fafb15',
  blockchain_data: '#ffffff10',
  market_analysis: '#d1d5db15',
  crypto_knowledge: '#9ca3af15',
} as const

export default function MemoryMindmap({ data, className = '', compact = false }: MemoryMindmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null)
  
  const [selectedNode, setSelectedNode] = useState<D3Node | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 })
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [controlsOpen, setControlsOpen] = useState(!compact)

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: rect.width,
          height: rect.height
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Filter data based on search and filters
  const filteredData = React.useMemo(() => {
    let filteredNodes = data.nodes.filter(node => {
      if (searchTerm && !node.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !node.key?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (selectedCategory && node.category !== selectedCategory) {
        return false
      }
      if (selectedType && node.type !== selectedType) {
        return false
      }
      return true
    })

    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredConnections = data.connections.filter(conn => 
      nodeIds.has(conn.source as string) && nodeIds.has(conn.target as string)
    )

    return {
      ...data,
      nodes: filteredNodes,
      connections: filteredConnections
    }
  }, [data, searchTerm, selectedCategory, selectedType])

  // Initialize D3 visualization
  useEffect(() => {
    if (!svgRef.current || !filteredData.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        const { x, y, k } = event.transform
        setTransform({ x, y, k })
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Main group for all elements
    const g = svg.append('g')

    // Create nodes and links data
    const nodes: D3Node[] = filteredData.nodes.map(node => ({
      ...node,
      radius: Math.max(8, Math.min(20, node.confidence * 15 + 5)),
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200
    }))

    const links: D3Link[] = filteredData.connections.map(conn => ({
      ...conn,
      source: nodes.find(n => n.id === conn.source)!,
      target: nodes.find(n => n.id === conn.target)!
    })).filter(link => link.source && link.target)

    // Create force simulation
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links)
        .id(d => d.id)
        .distance(d => Math.max(50, 100 - d.strength * 50))
        .strength(d => d.strength * 0.3)
      )
      .force('charge', d3.forceManyBody()
        .strength(-100)
        .distanceMax(200)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<D3Node>()
        .radius(d => (d.radius || 10) + 2)
      )
      .alphaDecay(0.02)

    simulationRef.current = simulation

    // Create link elements
    const linkElements = g.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link mindmap-connection')
      .attr('stroke', d => {
        switch (d.type) {
          case 'protocol': return 'rgba(255, 255, 255, 0.2)'
          case 'chain': return 'rgba(156, 163, 175, 0.15)'
          case 'category': return 'rgba(209, 213, 219, 0.1)'
          default: return 'rgba(255, 255, 255, 0.05)'
        }
      })
      .attr('stroke-width', d => Math.max(0.5, d.strength * 2))
      .attr('stroke-opacity', d => Math.max(0.1, d.strength * 0.4))

    // Create node groups
    const nodeGroups = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    // Add node background circles (glow effect)
    nodeGroups.append('circle')
      .attr('class', 'node-glow mindmap-node-glow')
      .attr('r', d => (d.radius || 10) * 2)
      .attr('fill', d => categoryColors[d.category as keyof typeof categoryColors] || categoryColors.general)
      .attr('opacity', 0.3)
      .style('filter', 'blur(8px)')

    // Add main node circles
    const nodeCircles = nodeGroups.append('circle')
      .attr('class', 'node-main mindmap-node-enter')
      .attr('r', d => d.radius || 10)
      .attr('fill', d => typeColors[d.type as keyof typeof typeColors] || typeColors.memory)
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', d => Math.max(1, d.confidence * 2))

    // Add node labels for high-confidence nodes
    nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('dy', d => (d.radius || 10) + 15)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '10px')
      .style('font-weight', '300')
      .style('pointer-events', 'none')
      .text(d => {
        if (d.confidence > 0.8) {
          return d.key ? d.key.slice(0, 12) + (d.key.length > 12 ? '...' : '') : ''
        }
        return ''
      })

    // Node interactions
    nodeGroups
      .on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })
      .on('mouseenter', function(event, d) {
        d3.select(this).select('.node-main')
          .transition()
          .duration(200)
          .attr('r', (d.radius || 10) * 1.2)
          .attr('stroke-width', Math.max(2, d.confidence * 3))
        
        d3.select(this).select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0.6)
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).select('.node-main')
          .transition()
          .duration(200)
          .attr('r', d.radius || 10)
          .attr('stroke-width', Math.max(1, d.confidence * 2))
        
        d3.select(this).select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0.3)
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => (d.source as D3Node).x || 0)
        .attr('y1', d => (d.source as D3Node).y || 0)
        .attr('x2', d => (d.target as D3Node).x || 0)
        .attr('y2', d => (d.target as D3Node).y || 0)

      nodeGroups
        .attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`)
    })

    // Click outside to deselect
    svg.on('click', () => setSelectedNode(null))

    return () => {
      simulation.stop()
    }
  }, [filteredData, dimensions])

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 1.5)
    }
  }

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 1 / 1.5)
    }
  }

  const handleResetZoom = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(d3.zoom().transform as any, d3.zoomIdentity)
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-[#0A0A0A] overflow-hidden ${className}`}>
      {/* Background animated orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-gray-400/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-t from-gray-300/5 to-white/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Controls (compact-capable) */}
      <div className="absolute top-4 left-4 z-10 space-y-2 mindmap-controls">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setControlsOpen(v => !v)}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200"
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </button>
          {controlsOpen && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mindmap-search pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 transition-all duration-200 w-56 md:w-72"
              />
            </div>
          )}
        </div>

        {controlsOpen && (
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="" className="bg-[#0A0A0A] text-white">All Categories</option>
              {Object.keys(data.categories).map(category => (
                <option key={category} value={category} className="bg-[#0A0A0A] text-white">
                  {category.replace('_', ' ')} ({data.categories[category]})
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="" className="bg-[#0A0A0A] text-white">All Types</option>
              {Object.keys(data.types).map(type => (
                <option key={type} value={type} className="bg-[#0A0A0A] text-white">
                  {type.replace('_', ' ')} ({data.types[type]})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Minimal stats (badge) */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 text-white/60 text-xs">
        <span className="px-2 py-1 bg-white/10 rounded-md border border-white/10 flex items-center gap-1"><Database className="w-3 h-3" /> {filteredData.nodes.length}</span>
        <span className="px-2 py-1 bg-white/10 rounded-md border border-white/10 flex items-center gap-1"><Brain className="w-3 h-3" /> {filteredData.connections.length}</span>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col space-y-2 mindmap-controls">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Main visualization */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-[9999] w-96 max-w-full h-screen bg-black/85 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Memory Details</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Content</h4>
                <p className="text-white leading-relaxed">{selectedNode.content}</p>
              </div>

              {selectedNode.key && (
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Key</h4>
                  <p className="text-white/90 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg">
                    {selectedNode.key}
                  </p>
                </div>
              )}

              {selectedNode.value && (
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Value</h4>
                  <p className="text-white">{selectedNode.value}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Type</h4>
                  <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/90">
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-1">Category</h4>
                  <span className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-white/90">
                    {selectedNode.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Confidence</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-white/60 to-white/80 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedNode.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/70">
                    {Math.round(selectedNode.confidence * 100)}%
                  </span>
                </div>
              </div>

              {selectedNode.protocol && (
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Protocol</h4>
                  <p className="text-white/90 font-mono text-sm">{selectedNode.protocol}</p>
                </div>
              )}

              {selectedNode.chainId && (
                <div>
                  <h4 className="text-sm font-medium text-white/70 mb-2">Chain ID</h4>
                  <p className="text-white/90 font-mono text-sm">{selectedNode.chainId}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Source</h4>
                <p className="text-white/90 text-sm">{selectedNode.source}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Created</h4>
                <p className="text-white/90 text-sm">
                  {new Date(selectedNode.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
