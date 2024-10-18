import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardGateway } from './leaderboard.gateway';

@Module({
  providers: [LeaderboardService, LeaderboardGateway],
})
export class LeaderboardModule {}
