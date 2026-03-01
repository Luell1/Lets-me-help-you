import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  ShieldAlert, 
  Lightbulb, 
  Cpu, 
  Users, 
  Gamepad2,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Languages,
  Trophy,
  Calendar,
  Layout,
  Ghost,
  Search,
  DollarSign,
  Building2,
  Megaphone,
  Globe,
  MessageSquare,
  Mail,
  Send,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { evaluateGameIdea, getMarketTrends, getHistoricalRankings, generateMarketingPlan } from './services/gemini';
import { GenreData, EvaluationResult, Language, GameRanking, Publisher, MarketingPlan, Comment } from './types';
import { TRANSLATIONS } from './constants/translations';

const PUBLISHERS: Publisher[] = [
  { name: 'Devolver Digital', specialties: ['Action', 'Roguelike', 'Pixel Art'], notableGames: ['Hotline Miami', 'Cult of the Lamb'], website: 'https://www.devolverdigital.com', tier: 'S' },
  { name: 'Team17', specialties: ['Simulation', 'Strategy', 'Co-op'], notableGames: ['Overcooked', 'The Escapists'], website: 'https://www.team17.com', tier: 'S' },
  { name: 'Annapurna Interactive', specialties: ['Narrative', 'Artistic', 'Indie'], notableGames: ['Stray', 'Outer Wilds'], website: 'https://annapurnainteractive.com', tier: 'S' },
  { name: 'Raw Fury', specialties: ['Strategy', 'RPG', 'Atmospheric'], notableGames: ['Kingdom', 'Sable'], website: 'https://rawfury.com', tier: 'A' },
  { name: 'TinyBuild', specialties: ['Horror', 'Action', 'Multiplayer'], notableGames: ['Hello Neighbor', 'SpeedRunners'], website: 'https://www.tinybuild.com', tier: 'A' },
];

const GENRE_DATA: GenreData[] = [
  { 
    name: 'Roguelike/Survivors', nameEn: 'Roguelike/Survivors', nameJa: 'ローグライク', nameKo: '로그라이크',
    profitability: 90, competition: 85, developmentCost: 40, viralPotential: 75, 
    description: '高重玩价值，低美术门槛，但非常拥挤。', 
    descriptionEn: 'High replayability, low asset cost, but very crowded.',
    descriptionJa: '高い再プレイ性、低いアセットコスト、しかし非常に混雑しています。',
    descriptionKo: '높은 재플레이성, 낮은 에셋 비용, 하지만 매우 혼잡합니다.'
  },
  { 
    name: '模拟经营', nameEn: 'Simulation/Management', nameJa: 'シミュレーション', nameKo: '시뮬레이션',
    profitability: 85, competition: 60, developmentCost: 70, viralPotential: 50, 
    description: '长尾销售，高玩家留存，复杂逻辑。', 
    descriptionEn: 'Long-tail sales, high player retention, complex logic.',
    descriptionJa: 'ロングテール販売、高いプレイヤー維持率、複雑なロジック。',
    descriptionKo: '롱테일 판매, 높은 플레이어 유지율, 복잡한 로직.'
  },
  { 
    name: '恐怖游戏', nameEn: 'Horror', nameJa: 'ホラー', nameKo: '호러',
    profitability: 75, competition: 50, developmentCost: 55, viralPotential: 95, 
    description: '主播最爱，低准入门槛，高病毒潜力。', 
    descriptionEn: 'Streamer favorite, low entry barrier, high viral potential.',
    descriptionJa: 'ストリーマーのお気に入り、低い参入障壁、高い拡散ポテンシャル。',
    descriptionKo: '스트리머가 선호하는 장르, 낮은 진입 장벽, 높은 바이럴 잠재력.'
  },
  { 
    name: '多人合作', nameEn: 'Co-op/Multiplayer', nameJa: 'マルチプレイヤー', nameKo: '멀티플레이어',
    profitability: 95, competition: 70, developmentCost: 90, viralPotential: 85, 
    description: '开发难度大（网络），但增长潜力巨大。', 
    descriptionEn: 'Hard to build (networking), but massive growth potential.',
    descriptionJa: '構築が難しい（ネットワーク）、しかし巨大な成長ポテンシャル。',
    descriptionKo: '구축하기 어렵지만(네트워킹), 거대한 성장 잠재력이 있습니다.'
  },
  { 
    name: '卡牌/策略', nameEn: 'Deckbuilder/Strategy', nameJa: 'カード/戦略', nameKo: '카드/전략',
    profitability: 80, competition: 65, developmentCost: 50, viralPotential: 60, 
    description: '侧重机制而非美术，忠诚的小众受众。', 
    descriptionEn: 'Focus on mechanics over art, loyal niche audience.',
    descriptionJa: 'アートよりもメカニズムに焦点を当て、忠実なニッチな聴衆。',
    descriptionKo: '아트보다 메커니즘에 집중, 충성도 높은 틈새 고객.'
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [activeTab, setActiveTab] = useState<'market' | 'evaluate' | 'trends' | 'rankings' | 'calculator' | 'publishers' | 'strategy' | 'community'>('market');
  const [idea, setIdea] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [trends, setTrends] = useState<string>('');
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);

  // Rankings state
  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [isFetchingRankings, setIsFetchingRankings] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'Steam' | 'Epic' | 'Itch'>('Steam');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Calculator state
  const [reviews, setReviews] = useState<number>(100);
  const [price, setPrice] = useState<number>(14.99);
  const [multiplier, setMultiplier] = useState<number>(30);

  // Strategy state
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  // Community state
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (activeTab === 'trends' && !trends) {
      fetchTrends();
    }
    if (activeTab === 'community') {
      fetchComments();
    }
  }, [activeTab, lang]);

  const fetchComments = async () => {
    setIsFetchingComments(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentAuthor.trim() || !commentContent.trim()) return;
    setIsPostingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, content: commentContent }),
      });
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    try {
      const res = await getMarketTrends(lang);
      setTrends(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleEvaluate = async () => {
    if (!idea.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateGameIdea(idea, lang);
      setEvaluation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const fetchRankings = async () => {
    setIsFetchingRankings(true);
    try {
      const res = await getHistoricalRankings(selectedPlatform, selectedYear, lang);
      setRankings(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingRankings(false);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!idea.trim()) return;
    setIsGeneratingStrategy(true);
    try {
      const res = await generateMarketingPlan(idea, lang);
      setMarketingPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const getGenreName = (item: GenreData) => {
    if (lang === 'en') return item.nameEn;
    if (lang === 'ja') return item.nameJa;
    if (lang === 'ko') return item.nameKo;
    return item.name;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1C1917] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg leading-tight">{t.title}</h1>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">{t.subtitle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex gap-1 overflow-x-auto max-w-[600px] no-scrollbar">
              {(['market', 'evaluate', 'trends', 'rankings', 'calculator', 'publishers', 'strategy', 'community'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-stone-900 text-white shadow-md' 
                      : 'text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  {t.tabs[tab]}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
              {(['zh', 'en', 'ja', 'ko'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    lang === l ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">{t.hero.profitable}</span>
                    <TrendingUp className="text-emerald-500 w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black">Roguelike / Survivors</div>
                  <p className="text-stone-400 text-sm mt-2">{t.hero.rogueDesc}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">{t.hero.potential}</span>
                    <Zap className="text-amber-500 w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black">Co-op / Multiplayer</div>
                  <p className="text-stone-400 text-sm mt-2">{t.hero.coopDesc}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">{t.hero.longTail}</span>
                    <Users className="text-blue-500 w-5 h-5" />
                  </div>
                  <div className="text-2xl font-black">Simulation / Mgmt</div>
                  <p className="text-stone-400 text-sm mt-2">{t.hero.simDesc}</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-stone-400" />
                    {t.charts.profitVsComp}
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={GENRE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                        <XAxis dataKey={lang === 'zh' ? 'name' : lang === 'en' ? 'nameEn' : lang === 'ja' ? 'nameJa' : 'nameKo'} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="profitability" name={t.charts.profitability} fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="competition" name={t.charts.competition} fill="#F43F5E" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-stone-400" />
                    {t.charts.devRadar}
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={GENRE_DATA}>
                        <PolarGrid stroke="#E7E5E4" />
                        <PolarAngleAxis dataKey={lang === 'zh' ? 'name' : lang === 'en' ? 'nameEn' : lang === 'ja' ? 'nameJa' : 'nameKo'} tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name={t.charts.devCost} dataKey="developmentCost" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                        <Radar name={t.charts.viral} dataKey="viralPotential" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'evaluate' && (
            <motion.div
              key="evaluate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl">
                <h2 className="text-2xl font-bold mb-2">{t.evaluator.title}</h2>
                <p className="text-stone-500 mb-8">{t.evaluator.desc}</p>
                
                <div className="space-y-4">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={t.evaluator.placeholder}
                    className="w-full h-40 p-6 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !idea.trim()}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.evaluator.loading}
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        {t.evaluator.button}
                      </>
                    )}
                  </button>
                </div>

                {evaluation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 space-y-8 border-t border-stone-100 pt-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{t.evaluator.result}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-stone-500">{t.evaluator.score}:</span>
                        <span className={`text-3xl font-black ${evaluation.score > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {evaluation.score}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> {t.evaluator.pros}
                        </h4>
                        <ul className="space-y-2">
                          {evaluation.pros.map((pro, i) => (
                            <li key={i} className="text-emerald-800 text-sm flex gap-2">
                              <span className="text-emerald-400">•</span> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-rose-50 p-6 rounded-2xl">
                        <h4 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> {t.evaluator.cons}
                        </h4>
                        <ul className="space-y-2">
                          {evaluation.cons.map((con, i) => (
                            <li key={i} className="text-rose-800 text-sm flex gap-2">
                              <span className="text-rose-400">•</span> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-stone-900 text-white p-8 rounded-2xl">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" /> {t.evaluator.suggestions}
                      </h4>
                      <div className="grid grid-cols-1 gap-4">
                        {evaluation.suggestions.map((sug, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-lg">
                            <ArrowRight className="w-4 h-4 mt-1 text-stone-500 shrink-0" />
                            <p className="text-stone-300 text-sm">{sug}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">{t.trends.title}</h2>
                  <button 
                    onClick={fetchTrends}
                    className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    {t.trends.refresh}
                  </button>
                </div>

                {isLoadingTrends ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                    <p className="text-stone-400 animate-pulse">{t.trends.loading}</p>
                  </div>
                ) : (
                  <div className="prose prose-stone max-w-none">
                    <ReactMarkdown components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 border-b border-stone-100 pb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-stone-800" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-stone-700" {...props} />,
                      p: ({node, ...props}) => <p className="text-stone-600 leading-relaxed mb-4" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-stone-600" {...props} />,
                    }}>
                      {trends || t.trends.empty}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    {t.rankings.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                      {(['Steam', 'Epic', 'Itch'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPlatform(p)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedPlatform === p ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                      {[2024, 2023, 2022, 2021, 2020].map((y) => (
                        <button
                          key={y}
                          onClick={() => setSelectedYear(y)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedYear === y ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={fetchRankings}
                      disabled={isFetchingRankings}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isFetchingRankings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {t.rankings.fetch}
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-stone-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100">
                        <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider w-20">{t.rankings.rank}</th>
                        <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">{t.rankings.game}</th>
                        <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">{t.rankings.genre}</th>
                        <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">{t.rankings.sales}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {isFetchingRankings ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                              <p className="text-stone-400 text-sm">{t.rankings.loading}</p>
                            </div>
                          </td>
                        </tr>
                      ) : rankings.length > 0 ? (
                        rankings.map((game, idx) => (
                          <motion.tr 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="hover:bg-stone-50/50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                                game.rank === 1 ? 'bg-amber-100 text-amber-700 shadow-sm' : 
                                game.rank === 2 ? 'bg-stone-200 text-stone-700' :
                                game.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                'text-stone-400'
                              }`}>
                                {game.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-stone-800 group-hover:text-emerald-600 transition-colors">{game.title}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded text-[10px] font-bold uppercase tracking-wider">
                                {game.genre}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="text-sm font-medium text-stone-600">{game.estimatedSales}</div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-stone-400 italic">
                            {t.rankings.loading.replace('...', '')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Platform Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
                      <Layout className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold">Steam</h4>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {lang === 'zh' ? '全球最大的PC游戏平台，竞争最激烈但天花板最高。' : 
                     lang === 'en' ? 'Largest PC platform, most competitive but with the highest ceiling.' :
                     lang === 'ja' ? '世界最大のPCプラットフォーム。競争は激しいが、天井は最も高い。' :
                     '세계 최대 PC 플랫폼, 경쟁이 가장 치열하지만 한계치가 가장 높음.'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold">Epic Games</h4>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {lang === 'zh' ? '分成比例更有优势，适合寻求独占协议的中型独立团队。' : 
                     lang === 'en' ? 'Better revenue split, ideal for mid-sized teams seeking exclusivity deals.' :
                     lang === 'ja' ? '収益分配率が有利。独占契約を求める中規模チームに最適。' :
                     '수익 배분율이 유리함, 독점 계약을 원하는 중형 인디 팀에 적합.'}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center">
                      <Ghost className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold">Itch.io</h4>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {lang === 'zh' ? '实验性游戏的乐园，适合原型测试和极小众品类。' : 
                     lang === 'en' ? 'Paradise for experimental games, great for prototypes and niche genres.' :
                     lang === 'ja' ? '実験的なゲームの楽園。プロトタイプやニッチなジャンルに最適。' :
                     '실험적인 게임의 낙원, 프로토타입 테스트와 니치 장르에 적합.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                  {t.calculator.title}
                </h2>
                <p className="text-stone-500 mb-8">{t.calculator.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t.calculator.reviews}</label>
                    <input 
                      type="number" 
                      value={reviews} 
                      onChange={(e) => setReviews(Number(e.target.value))}
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">{t.calculator.price}</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      {t.calculator.multiplier}
                      <span className="ml-2 text-[10px] font-normal normal-case text-stone-400">({t.calculator.multiplierDesc})</span>
                    </label>
                    <input 
                      type="number" 
                      value={multiplier} 
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <div className="text-stone-400 text-xs font-bold uppercase mb-1">{t.calculator.estSales}</div>
                    <div className="text-3xl font-black text-stone-800">{(reviews * multiplier).toLocaleString()}</div>
                  </div>
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                    <div className="text-stone-400 text-xs font-bold uppercase mb-1">{t.calculator.grossRev}</div>
                    <div className="text-3xl font-black text-stone-800">${(reviews * multiplier * price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                  <div className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-100">
                    <div className="text-emerald-100 text-xs font-bold uppercase mb-1">{t.calculator.netRev}</div>
                    <div className="text-3xl font-black text-white">${(reviews * multiplier * price * 0.55).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div className="text-emerald-200 text-[10px] mt-2">{t.calculator.netRevDesc}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'publishers' && (
            <motion.div
              key="publishers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-stone-900" />
                  {t.publishers.title}
                </h2>
                <p className="text-stone-500 mb-8">{t.publishers.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {PUBLISHERS.map((pub, idx) => (
                    <div key={idx} className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-200 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">{pub.name}</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-black ${
                          pub.tier === 'S' ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-700'
                        }`}>TIER {pub.tier}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">{t.publishers.specialties}</div>
                          <div className="flex flex-wrap gap-2">
                            {pub.specialties.map((s, i) => (
                              <span key={i} className="px-2 py-1 bg-white border border-stone-200 rounded text-xs text-stone-600">{s}</span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">{t.publishers.notable}</div>
                          <div className="text-sm text-stone-600 italic">{pub.notableGames.join(', ')}</div>
                        </div>

                        <a 
                          href={pub.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold hover:underline mt-2"
                        >
                          <Globe className="w-4 h-4" />
                          {t.publishers.website}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'strategy' && (
            <motion.div
              key="strategy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-rose-600" />
                  {t.strategy.title}
                </h2>
                <p className="text-stone-500 mb-8">{t.strategy.desc}</p>

                <div className="space-y-6">
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={t.evaluator.placeholder}
                    className="w-full h-32 p-6 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                  />
                  <button
                    onClick={handleGenerateStrategy}
                    disabled={isGeneratingStrategy || !idea.trim()}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-rose-100"
                  >
                    {isGeneratingStrategy ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.strategy.loading}
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        {t.strategy.generate}
                      </>
                    )}
                  </button>
                </div>

                {marketingPlan && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 space-y-10"
                  >
                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                      <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-rose-500" /> {t.strategy.target}
                      </h4>
                      <p className="text-stone-600 text-sm leading-relaxed">{marketingPlan.targetAudience}</p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="font-bold text-stone-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-500" /> {t.strategy.timeline}
                      </h4>
                      <div className="relative border-l-2 border-stone-100 ml-3 pl-8 space-y-12">
                        {marketingPlan.timeline.map((item, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 bg-white border-4 border-rose-500 rounded-full" />
                            <h5 className="font-black text-rose-600 uppercase text-xs tracking-widest mb-4">{item.phase}</h5>
                            <ul className="space-y-3">
                              {item.actions.map((action, j) => (
                                <li key={j} className="text-stone-600 text-sm flex gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-stone-900 text-white p-8 rounded-3xl">
                      <h4 className="font-bold mb-6 flex items-center gap-2 text-rose-400">
                        <Globe className="w-4 h-4" /> {t.strategy.social}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {marketingPlan.socialStrategy.map((tip, i) => (
                          <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 text-stone-300 text-sm">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  {t.community.title}
                </h2>
                <p className="text-stone-500 mb-8">{t.community.desc}</p>

                <div className="space-y-4 mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="text"
                        value={commentAuthor}
                        onChange={(e) => setCommentAuthor(e.target.value)}
                        placeholder={t.community.namePlaceholder}
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                  <textarea 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder={t.community.contentPlaceholder}
                    className="w-full h-32 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={isPostingComment || !commentAuthor.trim() || !commentContent.trim()}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isPostingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {t.community.submit}
                  </button>
                </div>

                <div className="space-y-6">
                  {isFetchingComments ? (
                    <div className="flex flex-col items-center py-12 gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                      <p className="text-stone-400 text-sm">{t.community.loading}</p>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-stone-800 flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            {comment.author}
                          </div>
                          <span className="text-[10px] text-stone-400 uppercase font-medium">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-stone-400 italic">
                      {t.community.empty}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-emerald-600 text-white p-8 rounded-3xl shadow-xl shadow-emerald-100">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.community.contact}
                </h3>
                <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                  {lang === 'zh' ? '如果你有任何特殊的诉求、合作意向或反馈，欢迎直接通过邮件联系我。' : 
                   lang === 'en' ? 'If you have any special requests, collaboration interests, or feedback, feel free to contact me directly via email.' :
                   lang === 'ja' ? '特別なリクエスト、コラボレーションの関心、またはフィードバックがある場合は、メールで直接お問い合わせください。' :
                   '특별한 요청, 협업 관심사 또는 피드백이 있는 경우 이메일을 통해 직접 문의해 주십시오.'}
                </p>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                  <span className="text-emerald-200 text-xs font-bold uppercase">{t.community.email}:</span>
                  <a href="mailto:Dive2025920@outlook.com" className="font-mono text-sm hover:underline">Dive2025920@outlook.com</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-stone-200 py-12 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-stone-400 text-sm">© 2026 Indie Game Insight. Powered by Gemini AI.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="text-stone-400 hover:text-stone-900 transition-colors">Steam Data</a>
            <a href="#" className="text-stone-400 hover:text-stone-900 transition-colors">Market Reports</a>
            <a href="#" className="text-stone-400 hover:text-stone-900 transition-colors">Developer Guide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
