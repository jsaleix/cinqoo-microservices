import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { CreateNoRestrictDto } from './dto/create-no-restrict.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePwdUserDto } from './dto/updatepwd-user.dto';
import { Role } from './enums/role.enum';
import { FreelancerProfile } from './schema/freelancer-profile.schema';
import { ResetToken } from './schema/reset-token';
import { User } from './schema/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(FreelancerProfile.name)
    private freelancerProfileModel: Model<FreelancerProfile>,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,
    @Inject('STRIPE_SERVICE') private readonly stripeService: ClientProxy,
    @Inject('MAILER_SERVICE') private readonly mailerService: ClientProxy,
    @Inject('PRESTATION_SERVICE')
    private readonly prestationService: ClientProxy,
  ) {}

  async getUsers() {
    return this.userModel
      .find()
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id)).exec();
    if (!user) {
      throw new RpcException({
        message: `User ${id} not found`,
        statusCode: 404,
      });
    }
    return user;
  }

  async authGetUser(email: string) {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .select('+password')
      .exec();
    if (!user) {
      throw new RpcException({
        message: `User with email ${email} not found`,
        statusCode: 404,
      });
    }
    return user;
  }

  async createUser(data: CreateUserDto) {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      const stripeAccountId = await firstValueFrom(
        this.stripeService.send('STRIPE.CREATE_ACCOUNT', {}),
      );
      data['stripeAccountId'] = stripeAccountId.id;
      const res = new this.userModel(data);
      await res.save();
      this.sendWelcomeMail(res._id.toString());

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async sendWelcomeMail(id: string) {
    this.mailerService.emit('MAILER.SEND_INFORMATIVE_MAIL', {
      targetId: id,
      subject: 'Welcome to Cinqoo!',
      text: 'Welcome to Cinqoo! We are glad to have you here.',
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 404,
      });
    }
    const emailTaken = await this.userModel.findOne({
      email: updateUserDto.email,
      _id: { $ne: new Types.ObjectId(id) },
    });
    if (emailTaken) {
      throw new RpcException({
        message: `Email ${updateUserDto.email} already used`,
        statusCode: 400,
      });
    }
    try {
      await this.userModel.updateOne(
        { _id: new Types.ObjectId(id) },
        updateUserDto,
      );
      return {
        message: `User with id ${id} updated`,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async updatePwdUser(id: string, updatePwdUserDto: UpdatePwdUserDto) {
    if (updatePwdUserDto.password && !updatePwdUserDto.oldPassword) {
      throw new RpcException({
        message: `Old password is required`,
        statusCode: 400,
      });
    }
    if (updatePwdUserDto.oldPassword) {
      const user = await this.userModel
        .findById(new Types.ObjectId(id))
        .select('+password');
      if (!user) {
        throw new RpcException({
          message: `User with id ${id} not found`,
          statusCode: 400,
        });
      }
      if (!bcrypt.compareSync(updatePwdUserDto.oldPassword, user.password)) {
        throw new RpcException({
          message: `Old password is incorrect`,
          statusCode: 400,
        });
      }
      delete updatePwdUserDto.oldPassword;
    }
    if (updatePwdUserDto.password) {
      updatePwdUserDto.password = await bcrypt.hash(
        updatePwdUserDto.password,
        10,
      );
    }
    try {
      await this.userModel.updateOne(
        { _id: new Types.ObjectId(id) },
        updatePwdUserDto,
      );
      return {
        message: `Password of User with id ${id} updated`,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async removeUser(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: new Types.ObjectId(id) });
    if (!user) {
      throw new RpcException({
        message: `User not found`,
        statusCode: 404,
      });
    }
    this.prestationService.emit('PRESTATION.SOFT_DELETE_ALL_BY_USER', id);

    await this.userModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        username: `deleted ${user.username} at ${new Date().getTime()}`,
        email: `deleted ${user.email} at ${new Date().getTime()}`,
        password: '',
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    if (user.roles.includes(Role.FREELANCER)) {
      await this.freelancerProfileModel.updateOne(
        { user: new Types.ObjectId(id) },
        {
          description: 'DELETED',
        },
      );
    }
    return;
  }

  async promoteOrDemoteUserWithStripe(
    stripeAccountId: string,
    promote: boolean,
  ) {
    try {
      const user = await this.userModel.findOne({
        stripeAccountId: stripeAccountId,
      });

      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }

      if (promote == false) {
        return { message: 'User demoted' };
        // if (user.roles.includes(Role.FREELANCER)) {
        //   user.roles = user.roles.filter((role) => role !== Role.FREELANCER);
        //   await user.save();
        //   return { message: 'User demoted' };
        // }
      } else {
        if (!user.roles.includes(Role.FREELANCER)) {
          user.roles.push(Role.FREELANCER);
          await user.save();
          let freelancerProfile = await this.freelancerProfileModel.findOne({
            user: new Types.ObjectId(user._id),
          });
          if (!freelancerProfile) {
            freelancerProfile = new this.freelancerProfileModel({
              user: new Types.ObjectId(user._id),
            });
            await freelancerProfile.save();
          }
        }
        this.sendWelcomeFreelancer(user._id.toString());
      }
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async becomeFreelancer(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 400,
      });
    }
    if (user.roles.includes(Role.FREELANCER)) {
      throw new RpcException({
        message: `User with id ${id} is already a freelancer`,
        statusCode: 400,
      });
    }
    const accountLink = await firstValueFrom(
      this.stripeService.send(
        'STRIPE.CREATE_ACCOUNT_LINK',
        user.stripeAccountId,
      ),
    );
    return { url: accountLink.url };
  }

  async getStripeLink(id: string) {
    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) {
      throw new RpcException({
        message: `User with id ${id} not found`,
        statusCode: 400,
      });
    }
    const accountLink = await firstValueFrom(
      this.stripeService.send('STRIPE.GET_ACCOUNT_LINK', user.stripeAccountId),
    );
    return { url: accountLink.url };
  }

  async getFreelancerProfile(id: string) {
    try {
      const profile = await this.freelancerProfileModel.findOne(
        {
          user: new Types.ObjectId(id),
        },
        {
          __v: 0,
          createdAt: 0,
          user: 0,
        },
      );

      if (!profile) {
        throw new RpcException({
          message: `Freelancer profile not found`,
          statusCode: 404,
        });
      }

      const user = await this.userModel.findById(new Types.ObjectId(id), {
        password: 0,
        stripeAccountId: 0,
        address: 0,
        zip: 0,
        __v: 0,
        createdAt: 0,
      });

      return { ...user.toObject(), freelancerProfile: profile.toObject() };
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async updateFreelancerProfile(id: string, data: UpdateFreelancerDto) {
    try {
      const profile = await this.freelancerProfileModel.findOneAndUpdate(
        {
          user: new Types.ObjectId(id),
        },
        data,
        {
          new: true,
        },
      );

      if (!profile) {
        throw new RpcException({
          message: `Freelancer profile not found`,
          statusCode: 404,
        });
      }

      return { message: 'Freelancer profile updated' };
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async createNoRestrict(data: CreateNoRestrictDto) {
    try {
      data.password = await bcrypt.hash(data.password, 10);
      const stripeAccountId = await firstValueFrom(
        this.stripeService.send('STRIPE.CREATE_ACCOUNT', {}),
      );
      data['stripeAccountId'] = stripeAccountId.id;
      const res = new this.userModel(data);
      await res.save();
      this.sendWelcomeMail(res._id.toString());

      return res;
    } catch (error) {
      if (error.name === 'MongoServerError' || error.name === 'MongoError') {
        if (error.code === 11000) {
          throw new RpcException({
            message: `${Object.keys(error.keyPattern)[0]} already used`,
            statusCode: 400,
          });
        }
      }
      throw new RpcException({ code: 500 });
    }
  }

  async promoteAdmin(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }
      if (user.roles.includes(Role.ADMIN)) {
        throw new RpcException({
          message: `User is already an admin`,
          statusCode: 400,
        });
      }
      user.roles.push(Role.ADMIN);
      await user.save();
      return { message: 'User promoted' };
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async demoteAdmin(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }
      if (!user.roles.includes(Role.ADMIN)) {
        throw new RpcException({
          message: `User is not an admin`,
          statusCode: 400,
        });
      }
      user.roles = user.roles.filter((role) => role !== Role.ADMIN);
      await user.save();
      return { message: 'User demoted' };
    } catch (e: any) {
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async createResetPasswordToken(email: string) {
    try {
      const user = await this.authGetUser(email);
      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }
      let token = await this.resetTokenModel.findOne({
        user: user._id.toString(),
      });
      if (token) {
        token.date = new Date();
        token.isActive = true;
        await token.save();
      } else {
        token = new this.resetTokenModel({
          userId: user._id.toString(),
        });
        await token.save();
      }
      this.sendTokenEmail(user._id.toString(), token._id.toString());
      console.log(token._id.toString());
      return { message: 'Reset password token created or updated' };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const resetToken = await this.resetTokenModel.findById(
        new Types.ObjectId(token),
      );
      if (!resetToken) {
        throw new RpcException({
          message: `Reset token not found`,
          statusCode: 404,
        });
      }
      if (!resetToken.isActive) {
        throw new RpcException({
          message: `Reset token is not active`,
          statusCode: 400,
        });
      }
      if (resetToken.date.getTime() + 3600000 < new Date().getTime()) {
        resetToken.isActive = false;
        await resetToken.save();
        throw new RpcException({
          message: `Reset token expired`,
          statusCode: 400,
        });
      }
      const user = await this.userModel.findById(
        new Types.ObjectId(resetToken.userId),
      );
      if (!user) {
        throw new RpcException({
          message: `User not found`,
          statusCode: 404,
        });
      }
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      resetToken.isActive = false;
      await resetToken.save();
      return { message: 'Password reset' };
    } catch (e: any) {
      if (e instanceof RpcException) {
        throw e;
      }
      throw new RpcException({
        message: e.message,
        statusCode: 400,
      });
    }
  }

  //Emails

  sendWelcomeFreelancer(id: string) {
    this.mailerService.emit('MAILER.SEND_INFORMATIVE_MAIL', {
      targetId: id,
      subject: 'You are now a freelancer!',
      text: 'You are now a freelancer! You can now update your freelancer profile, create services and start working!',
    });
  }

  sendTokenEmail(userId: string, token: string) {
    this.mailerService.emit('MAILER.SEND_REDIRECT_MAIL', {
      targetId: userId,
      subject: 'Reset password',
      text: 'You have requested a password reset. Click the button below to reset your password.',
      redirectUrl: `${process.env.FRONT_URL}/reset-password/${token}`,
      label: 'Reset password',
    });
  }
}
