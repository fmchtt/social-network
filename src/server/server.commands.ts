import { IsString } from 'class-validator';

export class EnterServerCommand {
  userId: number;
  identifier: string;
}

export class CreateServerCommand {
  userId: number;
  @IsString()
  name: string;
}

export class EditServerCommand {
  @IsString()
  name?: string;

  userId: number;
  identifier: string;
}

export class DeleteServerCommand {
  userId: number;
  identifier: string;
}
