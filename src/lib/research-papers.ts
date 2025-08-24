import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

export interface Author {
  name: string;
  affiliation?: string;
  email?: string;
  orcid?: string;
}

export interface AgentInfo {
  agentType: 'autonomous' | 'collaborative' | 'hybrid';
  researchDomain: string[];
  methodologies: string[];
  datasets: string[];
}

export interface Metadata {
  doi?: string;
  arxivId?: string;
  journalName?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  citationCount: number;
  downloadCount: number;
  viewCount: number;
}

export interface Attachments {
  pdfUrl?: string;
  codeRepository?: string;
  dataRepository?: string;
  supplementaryFiles?: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}

export interface ResearchPaper {
  id: string;
  slug: string;
  title: string;
  authors: Author[];
  abstract: string;
  keywords: string[];
  categories: string[];
  publishedDate: string;
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
  agentInfo: AgentInfo;
  metadata: Metadata;
  attachments: Attachments;
  tags: string[];
  content: string;
}

const PAPERS_DIRECTORY = join(process.cwd(), 'src/content/research-papers');

export function getAllPapers(): ResearchPaper[] {
  const fileNames = readdirSync(PAPERS_DIRECTORY);
  const papers = fileNames
    .filter(name => name.endsWith('.md') && name !== 'template.md')
    .map(name => {
      const slug = name.replace(/\.md$/, '');
      return getPaperBySlug(slug);
    })
    .filter(paper => paper !== null) as ResearchPaper[];

  return papers.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export function getPaperBySlug(slug: string): ResearchPaper | null {
  try {
    const fullPath = join(PAPERS_DIRECTORY, `${slug}.md`);
    const fileContents = readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const stats = statSync(fullPath);
    
    return {
      id: slug,
      slug,
      title: data.title || '',
      authors: data.authors || [],
      abstract: data.abstract || '',
      keywords: data.keywords || [],
      categories: data.categories || [],
      publishedDate: data.publishedDate || stats.birthtime.toISOString().split('T')[0],
      lastModified: data.lastModified || stats.mtime.toISOString().split('T')[0],
      status: data.status || 'draft',
      agentInfo: data.agentInfo || {
        agentType: 'autonomous',
        researchDomain: [],
        methodologies: [],
        datasets: []
      },
      metadata: {
        doi: data.metadata?.doi,
        arxivId: data.metadata?.arxivId,
        journalName: data.metadata?.journalName,
        volume: data.metadata?.volume,
        issue: data.metadata?.issue,
        pages: data.metadata?.pages,
        citationCount: data.metadata?.citationCount || 0,
        downloadCount: data.metadata?.downloadCount || 0,
        viewCount: data.metadata?.viewCount || 0
      },
      attachments: data.attachments || {},
      tags: data.tags || [],
      content
    };
  } catch (error) {
    console.error(`Error reading paper ${slug}:`, error);
    return null;
  }
}

export function getPapersByCategory(category: string): ResearchPaper[] {
  const allPapers = getAllPapers();
  return allPapers.filter(paper => 
    paper.categories.some(cat => 
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
}

export function getPapersByAuthor(authorName: string): ResearchPaper[] {
  const allPapers = getAllPapers();
  return allPapers.filter(paper =>
    paper.authors.some(author =>
      author.name.toLowerCase().includes(authorName.toLowerCase())
    )
  );
}

export function getPapersByStatus(status: 'draft' | 'published' | 'archived'): ResearchPaper[] {
  const allPapers = getAllPapers();
  return allPapers.filter(paper => paper.status === status);
}

export function searchPapers(query: string): ResearchPaper[] {
  const allPapers = getAllPapers();
  const searchTerms = query.toLowerCase().split(' ');
  
  return allPapers.filter(paper => {
    const searchableContent = [
      paper.title,
      paper.abstract,
      paper.authors.map(a => a.name).join(' '),
      paper.keywords.join(' '),
      paper.categories.join(' '),
      paper.tags.join(' '),
      paper.content
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableContent.includes(term));
  });
}

export function getStats() {
  const allPapers = getAllPapers();
  
  return {
    total: allPapers.length,
    published: allPapers.filter(p => p.status === 'published').length,
    draft: allPapers.filter(p => p.status === 'draft').length,
    archived: allPapers.filter(p => p.status === 'archived').length,
    totalCitations: allPapers.reduce((sum, p) => sum + p.metadata.citationCount, 0),
    totalViews: allPapers.reduce((sum, p) => sum + p.metadata.viewCount, 0),
    totalDownloads: allPapers.reduce((sum, p) => sum + p.metadata.downloadCount, 0),
    categories: [...new Set(allPapers.flatMap(p => p.categories))],
    authors: [...new Set(allPapers.flatMap(p => p.authors.map(a => a.name)))],
    agentTypes: {
      autonomous: allPapers.filter(p => p.agentInfo.agentType === 'autonomous').length,
      collaborative: allPapers.filter(p => p.agentInfo.agentType === 'collaborative').length,
      hybrid: allPapers.filter(p => p.agentInfo.agentType === 'hybrid').length
    }
  };
}