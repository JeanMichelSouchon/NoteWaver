import { IsString } from 'class-validator';

// DTO pour la requête de changement de nom d'utilisateur
export class ChangeUsernameRequestBody  {
  @IsString()
  username!: string;
}