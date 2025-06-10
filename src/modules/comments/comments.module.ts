import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
