export type Language = 'zh' | 'en' | 'ja' | 'ko';

export interface GenreData {
  name: string;
  nameEn: string;
  nameJa: string;
  nameKo: string;
  profitability: number; // 1-100
  competition: number; // 1-100
  developmentCost: number; // 1-100
  viralPotential: number; // 1-100
  description: string;
  descriptionEn: string;
  descriptionJa: string;
  descriptionKo: string;
}

export interface GameRanking {
  rank: number;
  title: string;
  genre: string;
  estimatedSales?: string;
}

export interface Publisher {
  name: string;
  specialties: string[];
  notableGames: string[];
  website: string;
  tier: 'S' | 'A' | 'B';
}

export interface MarketingPlan {
  timeline: {
    phase: string;
    actions: string[];
  }[];
  socialStrategy: string[];
  targetAudience: string;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export interface MarketInsight {
  genre: string;
  trend: 'up' | 'down' | 'stable';
  reason: string;
}

export interface EvaluationResult {
  score: number;
  pros: string[];
  cons: string[];
  suggestions: string[];
}
