import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(1, { message: 'Username, email, or phone is required' })
  identifier: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}