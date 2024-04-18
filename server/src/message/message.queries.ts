import { IsInt, Min } from 'class-validator';

export class GetMessagesQuery {
  @IsInt()
  @Min(1)
  page: number = 1;
  userId: number;
  channelId: number;
}
