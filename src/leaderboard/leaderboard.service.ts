import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class LeaderboardService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(); // connects to the Redis server
  }

  // Add or update player's score
  async updateScore(playerId: string, score: number): Promise<void> {
    await this.redis.zadd('leaderboard', score, playerId);
  }

  // Get the top 100 players
  async getTopPlayers(): Promise<{ playerId: string; score: number }[]> {
    const topPlayers = await this.redis.zrevrange(
      'leaderboard',
      0,
      99,
      'WITHSCORES',
    );
    const result = [];
    for (let i = 0; i < topPlayers.length; i += 2) {
      result.push({
        playerId: topPlayers[i],
        score: parseFloat(topPlayers[i + 1]),
      });
    }
    return result;
  }

  // Get player's rank
  async getPlayerRank(playerId: string): Promise<number | null> {
    const rank = await this.redis.zrevrank('leaderboard', playerId);
    return rank !== null ? rank + 1 : null;
  }
}
