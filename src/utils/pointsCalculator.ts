interface PointsEntry {
  like_points: number;
  repost_points: number;
  comment_points: number;
  timestamp: string;
}

interface PointsSummary {
  last24Hours: {
    communityInteraction: number;
    communityEngagement: number;
    afelPosts: number;
    totalPoints: number;
  };
  allTime: {
    communityInteraction: number;
    communityEngagement: number;
    afelPosts: number;
    totalPoints: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calculatePoints = (data: any): PointsSummary => {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Initialize counters
  const summary = {
    last24Hours: {
      communityInteraction: 0,
      communityEngagement: 0,
      afelPosts: 0,
      totalPoints: 0,
    },
    allTime: {
      communityInteraction: 0,
      communityEngagement: 0,
      afelPosts: 0,
      totalPoints: 0,
    },
  };

  // Process CI points (Community Interaction)
  data.ci_points?.forEach((entry: PointsEntry) => {
    const entryDate = new Date(entry.timestamp);
    const points =
      entry.like_points + entry.repost_points + entry.comment_points;

    summary.allTime.communityInteraction += points;
    if (entryDate >= last24Hours) {
      summary.last24Hours.communityInteraction += points;
    }
  });

  // Process CE points (Community Engagement)
  data.ce_points?.forEach((entry: PointsEntry) => {
    const entryDate = new Date(entry.timestamp);
    const points =
      entry.like_points + entry.repost_points + entry.comment_points;

    summary.allTime.communityEngagement += points;
    if (entryDate >= last24Hours) {
      summary.last24Hours.communityEngagement += points;
    }
  });

  // Process AT points (Afel Posts)
  data.at_points?.forEach((entry: PointsEntry) => {
    const entryDate = new Date(entry.timestamp);
    const points =
      entry.like_points + entry.repost_points + entry.comment_points;

    summary.allTime.afelPosts += points;
    if (entryDate >= last24Hours) {
      summary.last24Hours.afelPosts += points;
    }
  });

  // Calculate totals
  summary.allTime.totalPoints =
    summary.allTime.communityInteraction +
    summary.allTime.communityEngagement +
    summary.allTime.afelPosts;

  summary.last24Hours.totalPoints =
    summary.last24Hours.communityInteraction +
    summary.last24Hours.communityEngagement +
    summary.last24Hours.afelPosts;

  return summary;
};
