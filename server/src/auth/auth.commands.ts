import { IsInt, IsString, IsStrongPassword } from "class-validator";

export class CreateUserCommand {
  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsStrongPassword({ minLength: 8 })
  password: string;
};

export class UpdateUserCommand {
  @IsInt()
  userId: number;
  name?: string;
  password?: string;
};

export class LoginUserCommand {
  username: string;
  password: string;
}
