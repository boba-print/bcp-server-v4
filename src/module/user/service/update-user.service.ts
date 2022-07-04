import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prismaService: PrismaService) {}
  async isPhoneNumber(dto: UpdateUserDto) {
    const { phoneNumber } = dto;
    const queryResult = await this.prismaService.users.findFirst({
      where: {
        PhoneNumber: phoneNumber,
      },
    });

    const result = {
      isPhoneNumberOverlap: false,
    };

    if (!queryResult) {
      return result;
    }
    if (queryResult.PhoneNumber === phoneNumber) {
      result.isPhoneNumberOverlap = true;
    }

    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { name, isDeleted } = dto;
    //1. Firebase 에 계정을 추가한다.
    const userRecord = await admin.auth().updateUser(id, {
      disabled: Boolean(isDeleted),
    });

    //2. MySQL 에 추가한다.
    const { uid } = userRecord;
    const user = await this.prismaService.users.update({
      where: {
        UserID: uid,
      },
      data: {
        Name: name,
        IsDeleted: isDeleted,
      },
    });

    return user;
  }
}
