import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PORTS, SERVICES } from 'src/constants';
import { QuizModule } from 'src/quiz/quiz.module';
import { ResultModule } from 'src/results/result.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.AUTH,
          port: PORTS.AUTH,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.USER,
          port: PORTS.USER,
        },
      },
    ]),
    ResultModule,
    QuizModule,
  ],
  providers: [SocketGateway, SocketService],
})
export class GatewayModule {}
