import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import * as admin from 'firebase-admin';

import { PrismaService } from 'src/service/prisma.service';
import { CreateUserDto } from '../dto/CreateUser.dto';

@Injectable()
export class CreateUserService {
  constructor(private readonly prismaService: PrismaService) {}
  async checkUserOverlap(dto: CreateUserDto) {
    const { phoneNumber, email } = dto;
    const queryResult = await this.prismaService.users.findFirst({
      where: {
        OR: [
          {
            PhoneNumber: phoneNumber,
          },
          {
            Email: email,
          },
        ],
      },
    });

    // return 할 쿼리 결과
    const result = {
      isEmailOverlap: false,
      isPhoneNumberOverlap: false,
    };

    // 중복된 유저가 없다면
    if (!queryResult) {
      return result;
    }

    if (queryResult.Email === email) {
      result.isEmailOverlap = true;
    }

    if (queryResult.PhoneNumber === phoneNumber) {
      result.isPhoneNumberOverlap = true;
    }

    return result;
  }

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
      StorageAllocated: BigInt(GIGABYTE),
      StorageUsed: BigInt(0),
    };
    await this.prismaService.users.create({
      data: user,
    });

    return user;
    // TODO: 3. 둘 중 하나라도 동작하지 않으면 rollback 한다.
  }
}