import { Cards } from '@prisma/client';

export interface UserProps {
  UserID: string;
  CreatedAt: Date;
  ModifiedAt: Date;
  IsDeleted: number;
  Email: string;
  CheckedNoticeAt: Date | null;
  LastVisitedAt: Date | null;
  IsDisabled: number;
  Name: string;
  PhoneNumber: string;
  Points: number;
  StorageAllocated: bigint;
  StorageUsed: bigint;
  Cards?: Cards[];
}

export class UserEntity {
  props: UserProps;
  constructor(props: UserProps) {
    this.props = props;
  }

  selectCard() {
    const { Cards } = this.props;

    if (!Cards || Cards.length === 0) {
      throw new Error('Card is not available');
    }

    const sorted = Cards.sort((a, b) => a.Priority - b.Priority);
    return sorted[0];
  }
}
