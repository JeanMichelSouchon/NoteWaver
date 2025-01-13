import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// DTO pour la création d'un utilisateur (si nécessaire)
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
