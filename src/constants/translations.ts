import { Language } from "../types";

export const TRANSLATIONS: Record<Language, any> = {
  zh: {
    title: "Lets me help you",
    subtitle: "决策辅助工具",
    tabs: {
      market: "市场分析",
      evaluate: "创意评估",
      trends: "趋势洞察",
      rankings: "销量排名",
      calculator: "收益预估",
      publishers: "发行商匹配",
      strategy: "营销策略",
      community: "社区交流"
    },
    hero: {
      profitable: "最挣钱品类",
      potential: "最高潜力",
      longTail: "长尾效应",
      rogueDesc: "高重玩价值，低美术门槛",
      coopDesc: "社交传播力极强，获客成本低",
      simDesc: "核心玩家粘性极高，生命周期长"
    },
    charts: {
      profitVsComp: "品类盈利潜力 vs 竞争程度",
      devRadar: "开发维度分析",
      profitability: "盈利潜力",
      competition: "竞争程度",
      devCost: "开发成本",
      viral: "病毒式传播潜力"
    },
    evaluator: {
      title: "AI 创意评估器",
      desc: "输入你的游戏想法，让 AI 帮你从市场角度进行深度评估。",
      placeholder: "例如：一个结合了卡牌构筑和恐怖生存的Roguelike游戏...",
      button: "开始评估",
      loading: "正在深度分析中...",
      result: "评估结果",
      score: "综合潜力评分",
      pros: "核心优势",
      cons: "潜在风险",
      suggestions: "改进建议"
    },
    trends: {
      title: "2025 独立游戏市场趋势报告",
      refresh: "刷新报告",
      loading: "正在调取全球市场数据并生成分析报告...",
      empty: "点击刷新按钮获取最新趋势分析。"
    },
    rankings: {
      title: "历史销量排名",
      platform: "平台",
      year: "年份",
      fetch: "获取排名",
      loading: "正在查询历史销量数据...",
      rank: "排名",
      game: "游戏名称",
      genre: "品类",
      sales: "预估销量/评价数"
    },
    calculator: {
      title: "收益预估计算器 (Boxleiter 方法)",
      desc: "基于 Steam 评价数预估你的潜在收益。",
      reviews: "评价数 (Reviews)",
      price: "定价 (USD)",
      multiplier: "乘数 (Multiplier)",
      multiplierDesc: "通常在 20x 到 60x 之间",
      estSales: "预估销量",
      grossRev: "总收入",
      netRev: "预估净利润",
      netRevDesc: "扣除平台 30% 分成及预估税费"
    },
    publishers: {
      title: "顶尖独立游戏发行商",
      desc: "找到最适合你游戏品类的合作伙伴。",
      specialties: "擅长品类",
      notable: "代表作",
      website: "访问网站"
    },
    strategy: {
      title: "AI 营销策略生成器",
      desc: "根据你的游戏创意生成定制化的宣发方案。",
      generate: "生成营销方案",
      loading: "正在制定营销策略...",
      target: "目标受众",
      timeline: "宣发时间轴",
      social: "社交媒体策略"
    },
    community: {
      title: "社区交流",
      desc: "在这里留下你的建议或与其他开发者交流。",
      namePlaceholder: "你的名字",
      contentPlaceholder: "想说点什么...",
      submit: "发布留言",
      loading: "正在加载留言...",
      empty: "还没有留言，快来抢沙发吧！",
      contact: "联系作者",
      email: "邮箱"
    }
  },
  en: {
    title: "Lets me help you",
    subtitle: "Decision Support Tool",
    tabs: {
      market: "Market Analysis",
      evaluate: "Idea Evaluation",
      trends: "Trend Insights",
      rankings: "Sales Rankings",
      calculator: "Revenue Estimator",
      publishers: "Publishers",
      strategy: "Marketing Strategy",
      community: "Community"
    },
    hero: {
      profitable: "Most Profitable",
      potential: "Highest Potential",
      longTail: "Long-tail Effect",
      rogueDesc: "High replayability, low art barrier",
      coopDesc: "Strong social viral, low UA cost",
      simDesc: "High retention, long lifecycle"
    },
    charts: {
      profitVsComp: "Profitability vs Competition",
      devRadar: "Development Dimension Analysis",
      profitability: "Profitability",
      competition: "Competition",
      devCost: "Dev Cost",
      viral: "Viral Potential"
    },
    evaluator: {
      title: "AI Idea Evaluator",
      desc: "Enter your game idea and let AI provide a deep market-perspective evaluation.",
      placeholder: "e.g., A Roguelike combining deckbuilding and horror survival...",
      button: "Start Evaluation",
      loading: "Analyzing deeply...",
      result: "Evaluation Result",
      score: "Overall Potential Score",
      pros: "Core Strengths",
      cons: "Potential Risks",
      suggestions: "Actionable Suggestions"
    },
    trends: {
      title: "2025 Indie Game Market Trends",
      refresh: "Refresh Report",
      loading: "Fetching global market data and generating report...",
      empty: "Click refresh to get the latest trend analysis."
    },
    rankings: {
      title: "Historical Sales Rankings",
      platform: "Platform",
      year: "Year",
      fetch: "Fetch Rankings",
      loading: "Querying historical sales data...",
      rank: "Rank",
      game: "Game Title",
      genre: "Genre",
      sales: "Est. Sales/Reviews"
    },
    calculator: {
      title: "Revenue Estimator (Boxleiter Method)",
      desc: "Estimate your potential earnings based on Steam review counts.",
      reviews: "Reviews Count",
      price: "Price (USD)",
      multiplier: "Multiplier",
      multiplierDesc: "Typically between 20x and 60x",
      estSales: "Estimated Sales",
      grossRev: "Gross Revenue",
      netRev: "Est. Net Revenue",
      netRevDesc: "After 30% platform cut and estimated taxes"
    },
    publishers: {
      title: "Top Indie Publishers",
      desc: "Find the best partner for your game genre.",
      specialties: "Specialties",
      notable: "Notable Games",
      website: "Visit Website"
    },
    strategy: {
      title: "AI Marketing Strategy",
      desc: "Generate a customized marketing plan based on your game idea.",
      generate: "Generate Strategy",
      loading: "Crafting marketing plan...",
      target: "Target Audience",
      timeline: "Marketing Timeline",
      social: "Social Media Strategy"
    },
    community: {
      title: "Community",
      desc: "Leave your suggestions or communicate with other developers here.",
      namePlaceholder: "Your Name",
      contentPlaceholder: "Say something...",
      submit: "Post Comment",
      loading: "Loading comments...",
      empty: "No comments yet. Be the first to post!",
      contact: "Contact Author",
      email: "Email"
    }
  },
  ja: {
    title: "Lets me help you",
    subtitle: "意思決定支援ツール",
    tabs: {
      market: "市場分析",
      evaluate: "アイデア評価",
      trends: "トレンド分析",
      rankings: "売上ランキング",
      calculator: "収益予測",
      publishers: "パブリッシャー",
      strategy: "マーケティング",
      community: "コミュニティ"
    },
    hero: {
      profitable: "最も収益性の高いジャンル",
      potential: "最高ポテンシャル",
      longTail: "ロングテール効果",
      rogueDesc: "高い再プレイ性、低いアートの壁",
      coopDesc: "強力なソーシャル拡散、低い獲得コスト",
      simDesc: "高い継続率、長いライフサイクル"
    },
    charts: {
      profitVsComp: "収益性 vs 競争率",
      devRadar: "開発次元分析",
      profitability: "収益性",
      competition: "競争率",
      devCost: "開発コスト",
      viral: "拡散ポテンシャル"
    },
    evaluator: {
      title: "AI アイデア評価器",
      desc: "ゲームのアイデアを入力すると、AIが市場の観点から詳細な評価を提供します。",
      placeholder: "例：デッキ構築とホラーサバイバルを組み合わせたローグライク...",
      button: "評価開始",
      loading: "詳細分析中...",
      result: "評価結果",
      score: "総合ポテンシャルスコア",
      pros: "主な強み",
      cons: "潜在的なリスク",
      suggestions: "具体的な提案"
    },
    trends: {
      title: "2025年インディーゲーム市場トレンド",
      refresh: "レポート更新",
      loading: "グローバル市場データを取得し、レポートを生成中...",
      empty: "更新ボタンをクリックして最新のトレンド分析を取得してください。"
    },
    rankings: {
      title: "歴史的売上ランキング",
      platform: "プラットフォーム",
      year: "年",
      fetch: "ランキング取得",
      loading: "歴史的売上データを照会中...",
      rank: "順位",
      game: "タイトル",
      genre: "ジャンル",
      sales: "推定売上/レビュー数"
    },
    calculator: {
      title: "収益予測シミュレーター",
      desc: "Steamのレビュー数に基づいて潜在的な収益を予測します。",
      reviews: "レビュー数",
      price: "価格 (USD)",
      multiplier: "倍率",
      multiplierDesc: "通常、20倍から60倍の間です",
      estSales: "推定販売数",
      grossRev: "総収益",
      netRev: "推定純利益",
      netRevDesc: "プラットフォーム手数料30%と推定税金控除後"
    },
    publishers: {
      title: "トップインディーパブリッシャー",
      desc: "あなたのゲームジャンルに最適なパートナーを見つけましょう。",
      specialties: "得意ジャンル",
      notable: "代表作",
      website: "ウェブサイト"
    },
    strategy: {
      title: "AI マーケティング戦略",
      desc: "ゲームのアイデアに基づいてカスタマイズされた宣伝プランを生成します。",
      generate: "戦略を生成",
      loading: "マーケティングプランを作成中...",
      target: "ターゲット層",
      timeline: "タイムライン",
      social: "SNS戦略"
    },
    community: {
      title: "コミュニティ",
      desc: "ここに提案を残したり、他の開発者と交流したりしてください。",
      namePlaceholder: "あなたの名前",
      contentPlaceholder: "何か言って...",
      submit: "コメントを投稿",
      loading: "コメントを読み込み中...",
      empty: "まだコメントはありません。最初の投稿者になりましょう！",
      contact: "著者に連絡",
      email: "メール"
    }
  },
  ko: {
    title: "Lets me help you",
    subtitle: "의사결정 지원 도구",
    tabs: {
      market: "시장 분석",
      evaluate: "아이디어 평가",
      trends: "트렌드 분석",
      rankings: "판매 순위",
      calculator: "수익 예측",
      publishers: "퍼블리셔",
      strategy: "마케팅 전략",
      community: "커뮤니티"
    },
    hero: {
      profitable: "가장 수익성 높은 장르",
      potential: "최고의 잠재력",
      longTail: "롱테일 효과",
      rogueDesc: "높은 재플레이성, 낮은 아트 진입장벽",
      coopDesc: "강력한 소셜 바이럴, 낮은 획득 비용",
      simDesc: "높은 유지율, 긴 라이프사이클"
    },
    charts: {
      profitVsComp: "수익성 vs 경쟁률",
      devRadar: "개발 차원 분석",
      profitability: "수익성",
      competition: "경쟁률",
      devCost: "개발 비용",
      viral: "바이럴 잠재력"
    },
    evaluator: {
      title: "AI 아이디어 평가기",
      desc: "게임 아이디어를 입력하면 AI가 시장 관점에서 심층적인 평가를 제공합니다.",
      placeholder: "예: 덱 빌딩과 호러 서바이벌을 결합한 로그라이크...",
      button: "평가 시작",
      loading: "심층 분석 중...",
      result: "평가 결과",
      score: "종합 잠재력 점수",
      pros: "핵심 강점",
      cons: "잠재적 리스크",
      suggestions: "실행 가능한 제안"
    },
    trends: {
      title: "2025년 인디 게임 시장 트렌드",
      refresh: "보고서 갱신",
      loading: "글로벌 시장 데이터를 가져와 보고서를 생성 중...",
      empty: "갱신 버튼을 클릭하여 최신 트렌드 분석을 확인하세요."
    },
    rankings: {
      title: "역대 판매 순위",
      platform: "플랫폼",
      year: "연도",
      fetch: "순위 가져오기",
      loading: "역대 판매 데이터를 조회 중...",
      rank: "순위",
      game: "게임 제목",
      genre: "장르",
      sales: "예상 판매량/리뷰 수"
    },
    calculator: {
      title: "수익 예측 계산기",
      desc: "Steam 리뷰 수를 기반으로 잠재적 수익을 예측합니다.",
      reviews: "리뷰 수",
      price: "가격 (USD)",
      multiplier: "배수",
      multiplierDesc: "보통 20배에서 60배 사이입니다",
      estSales: "예상 판매량",
      grossRev: "총 수익",
      netRev: "예상 순이익",
      netRevDesc: "플랫폼 수수료 30% 및 예상 세금 공제 후"
    },
    publishers: {
      title: "주요 인디 퍼블리셔",
      desc: "귀하의 게임 장르에 가장 적합한 파트너를 찾으십시오.",
      specialties: "전문 분야",
      notable: "대표작",
      website: "웹사이트 방문"
    },
    community: {
      title: "커뮤니티",
      desc: "여기에 제안을 남기거나 다른 개발자와 소통하십시오.",
      namePlaceholder: "당신의 이름",
      contentPlaceholder: "무언가 말해봐...",
      submit: "댓글 게시",
      loading: "댓글 로드 중...",
      empty: "아직 댓글이 없습니다. 첫 번째로 게시하세요!",
      contact: "저자에게 연락",
      email: "이메일"
    }
  }
};
