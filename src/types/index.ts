export interface Agents {
  projects?: Agent[] | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface Agent {
  agentDetails: AgentDetails;
  creationDate: string;
  twitterDescription: string;
  profileImageUrl: string;
  ticker: string;
  onChainStats: OnChainStats;
  twitterStats: TwitterStats;
  similarProjectsByMarketCap?: string[] | null;
}
export interface AgentDetails {
  id: string;
  name: string;
  slug: string;
  twitterUrls?: string[] | null;
  twitterUsernames?: string[] | null;
  contracts?: ContractsEntity[] | null;
  framework: string;
  behaviorType?: null;
  status: string;
  projectType: string;
  categories?: null;
  excludeTickerFromCalculation: boolean;
  coinGeckoUrl?: null;
  projectCreationDate: string;
  addedAt: string;
  lastModifiedAt: string;
}
export interface ContractsEntity {
  chain: number;
  contractAddress: string;
}
export interface OnChainStats {
  projectName: string;
  contractAddress?: null;
  insertedDate: string;
  dataPoints: OnChainStatsDataPoints;
}
export interface OnChainStatsDataPoints {
  Now: ChainStatsDP;
  _1HourAgo: ChainStatsDP;
  _6HoursAgo: ChainStatsDP;
  _12HoursAgo: ChainStatsDP;
  _24HoursAgo: ChainStatsDP;
  _3DaysAgo: ChainStatsDP;
  _7DaysAgo: ChainStatsDP;
}
export interface ChainStatsDP {
  dataPointId: string;
  contractAddress: string;
  tokenPrice: TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount;
  tokenMarketCap: TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount;
  tokenHoldersCount: TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount;
}
export interface TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount {
  value: number;
  valueForSimilarProjects: number;
}
export interface TwitterStats {
  projectName: string;
  twitterDescription: string;
  dataPoints: TwitterStatsDataPoints;
}
export interface TwitterStatsDataPoints {
  Now: TwitterStatsDP;
  _12HoursAgo: TwitterStatsDP;
  _1HourAgo: TwitterStatsDP;
  _24HoursAgo: TwitterStatsDP;
  _3DaysAgo: TwitterStatsDP;
  _6HoursAgo: TwitterStatsDP;
  _7DaysAgo: TwitterStatsDP;
}
export interface TwitterStatsDP {
  projectName: string;
  
  dataPointId: string;
  profileImageUrl: string;
  symbol: string;
  followersCount: TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount;
  smartFollowersCount: TokenPriceOrTokenMarketCapOrTokenHoldersCountOrFollowersCountOrSmartFollowersCount;
  impressionsPerFollower: ImpressionsPerFollower;
  postsCount: PostsCountOrMindshare;
  impressionsCount: ImpressionsCountOrEngagementsCountOrSmartEngagementPoints;
  engagementsCount: ImpressionsCountOrEngagementsCountOrSmartEngagementPoints;
  smartEngagementPoints: ImpressionsCountOrEngagementsCountOrSmartEngagementPoints;
  mindshare: PostsCountOrMindshare;
  mindshareRank: number;
  bestTweets?: BestTweetsEntity[] | null;
}
export interface ImpressionsPerFollower {
  value: number;
}
export interface PostsCountOrMindshare {
  value: number;
  valueForSimilarProjects: number;
  previousValue: number;
}
export interface ImpressionsCountOrEngagementsCountOrSmartEngagementPoints {
  value: number;
  valueForSimilarProjects: number;
  average: number;
  averageForSimilarProjects: number;
  median: number;
  medianForSimilarProjects: number;
  previousValue: number;
  previousAverage: number;
  previousMedian: number;
}
export interface BestTweetsEntity {
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
  item6: string;
}
