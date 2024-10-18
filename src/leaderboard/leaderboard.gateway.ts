import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LeaderboardService } from './leaderboard.service';

@WebSocketGateway({ cors: true })
export class LeaderboardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly leaderboardService: LeaderboardService) {}

  @SubscribeMessage('updateScore')
  async handleScoreUpdate(
    @MessageBody() { playerId, score }: { playerId: string; score: number },
  ) {
    await this.leaderboardService.updateScore(playerId, score);
    const topPlayers = await this.leaderboardService.getTopPlayers();
    this.server.emit('leaderboardUpdate', topPlayers);
  }

  @SubscribeMessage('getTopPlayers')
  async handleGetTopPlayers() {
    const topPlayers = await this.leaderboardService.getTopPlayers();
    this.server.emit('leaderboardUpdate', topPlayers);
  }
}
