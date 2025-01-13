import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// DTO pour la requête de signup
export class SignupDto {
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}