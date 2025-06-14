import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  IsArray, 
  IsIn,
  ArrayMaxSize 
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description: string;

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean = true;

  @IsOptional()
  @IsBoolean()
  allowShares?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'friends', 'private'])
  privacy?: 'public' | 'followers' | 'friends' | 'private' = 'public';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean;

  @IsOptional()
  @IsBoolean()
  allowShares?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'friends', 'private'])
  privacy?: 'public' | 'followers' | 'friends' | 'private';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];
}

export class CreateCommentDto {
  @IsString()
  @MinLength(1, { message: 'Comment cannot be empty' })
  @MaxLength(280, { message: 'Comment must not exceed 280 characters' })
  content: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string; // For replies
}