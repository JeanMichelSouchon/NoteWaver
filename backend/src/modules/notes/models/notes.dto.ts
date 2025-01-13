import { Expose } from 'class-transformer';

export class NoteDTO {
  @Expose()
  id!: number;

  @Expose()
  userId!: number;

  @Expose()
  content!: string;

  @Expose()
  createdAt!: Date;
}
