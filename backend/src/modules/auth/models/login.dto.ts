import { IsEmail, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

// DTO pour la requête de login
export class LoginDto {
  @IsOptional()
  @IsEmail()
  @ValidateIf((o: any) => !o.username) // Valide uniquement si `username` est absent
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((o: any) => !o.email) // Valide uniquement si `email` est absent
  username?: string;

  @IsNotEmpty()
  password!: string;
}