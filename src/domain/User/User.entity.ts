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
}

export class UserEntity {
  props: UserProps;
  constructor(props: UserProps) {
    this.props = props;
  }
}
