import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PORTS, SERVICES } from './constants';
import {
  FreelancerProfile,
  FreelancerProfileSchema,
} from './schema/freelancer-profile.schema';
import { ResetToken, ResetTokenSchema } from './schema/reset-token';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FreelancerProfile.name, schema: FreelancerProfileSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    ClientsModule.register([
      {
        name: 'STRIPE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.STRIPE,
        },
      },
      {
        name: 'MAILER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.MAILER,
        },
      },
      {
        name: 'PRESTATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: SERVICES.PRESTATION,
          port: PORTS.PRESTATION,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
