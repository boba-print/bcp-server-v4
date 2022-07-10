import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { Users } from '@prisma/client';
import * as admin from 'firebase-admin';
import { CreateUserDto } from '../dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { email, phoneNumber, password, name } = dto;

    // 1. Firebase 에 계정을 추가한다.
    const userRecord = await admin.auth().createUser({
      email,
      emailVerified: false,
      phoneNumber,
      password,
      disabled: false,
    });

    // 2. MySQL 에 추가한다.
    const { uid } = userRecord;
    const now = new Date();
    const GIGABYTE = 1024 * 1024 * 1024;
    const user: Users = {
      UserID: uid,
      CreatedAt: now,
      ModifiedAt: now,
      IsDeleted: 0,
      Email: email,
      CheckedNoticeAt: new Date(0),
      LastVisitedAt: now,
      IsDisabled: 0,
      Name: name,
      PhoneNumber: phoneNumber,
      Points: 0,
      StorageAllocated: GIGABYTE,
      StorageUsed: 0,
    };
    await this.prismaService.users.create({
      data: user,
    });

    return user;
    // TODO: 3. 둘 중 하나라도 동작하지 않으면 rollback 한다.
  }

  async update(id: string, dto: UpdateUserDto) {
    const { name, phoneNumber } = dto;
    //1. Firebase 에 계정을 추가한다.
    const userRecord = await admin.auth().updateUser(id, {
      phoneNumber: phoneNumber,
      displayName: name,
    });

    //2. MySQL 에 추가한다.
    const { uid } = userRecord;
    const user = await this.prismaService.users.update({
      where: {
        UserID: uid,
      },
      data: {
        Name: name,
        PhoneNumber: phoneNumber,
      },
    });

    return user;
  }

  async isEmailOverlap(email: string) {
    const queryResult = await this.prismaService.users.findFirst({
      where: {
        Email: email,
        IsDeleted: 0,
      },
    });

    if (!queryResult) {
      return false;
    }

    if (queryResult.Email === email) {
      return true;
    }
    return false;
  }

  async isPhoneOverlap(phoneNumber: string) {
    const queryResult = await this.prismaService.users.findFirst({
      where: {
        PhoneNumber: phoneNumber,
        IsDeleted: 0,
      },
    });

    if (!queryResult) {
      return false;
    }

    if (queryResult.PhoneNumber === phoneNumber) {
      return true;
    }

    return false;
  }
}
