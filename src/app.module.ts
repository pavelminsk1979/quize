import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './feature/users/api/user-controller';
import { UsersService } from './feature/users/services/user-service';
import { BlogController } from './feature/blogs/api/blog-controller';
import { PostService } from './feature/posts/services/post-service';
import { PostsController } from './feature/posts/api/post-controller';
import { CommentController } from './feature/comments/api/comment-controller';
import { TestController } from './feature/test/test-controller';
import dotenv from 'dotenv';
import { HashPasswordService } from './common/service/hash-password-service';
import { AuthController } from './feature/auth/api/auth-controller';
import { AuthService } from './feature/auth/services/auth-service';
import { TokenJwtService } from './common/service/token-jwt-service';
import { EmailSendService } from './common/service/email-send-service';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigurationType } from './settings/env-configuration';
import { CommentService } from './feature/comments/services/comment-service';
import { AuthTokenGuard } from './common/guard/auth-token-guard';
import { DataUserExtractorFromTokenGuard } from './common/guard/data-user-extractor-from-token-guard';
import { RefreshTokenGuard } from './common/guard/refresh-token-guard';
import { SecurityDeviceController } from './feature/security-device/api/security-device-controller';
import { SecurityDeviceService } from './feature/security-device/services/security-device-service';
import { VisitLimitGuard } from './common/guard/visit-limit-guard';
import {
  LimitVisit,
  LimitVisitSchema,
} from './feature/visit-limit/domains/domain-limit-visit';
import { LimitVisitService } from './feature/visit-limit/services/limit-visit-service';
import { LimitVisitRepository } from './feature/visit-limit/repositories/limit-visit-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuerySqlRepository } from './feature/users/repositories/user-query-sql-repository';
import { SaBlogController } from './feature/blogs/api/sa-blog-controller';
import { Usertyp } from './feature/users/domains/usertyp.entity';
import { Securitydevicetyp } from './feature/security-device/domains/securitydevicetype.entity';
import { UserSqlTypeormRepository } from './feature/users/repositories/user-sql-typeorm-repository';
import { SecurityDeviceSqlTypeormRepository } from './feature/security-device/repositories/security-device-sql-typeorm-repository';
import { Blogtyp } from './feature/blogs/domains/blogtyp.entity';
import { BlogSqlTypeormRepository } from './feature/blogs/repositories/blog-sql-typeorm-repository';
import { BlogQuerySqlTypeormRepository } from './feature/blogs/repositories/blog-query-sql-typeorm-repository';
import { Posttyp } from './feature/posts/domains/posttyp.entity';
import { PostSqlTypeormRepository } from './feature/posts/repositories/post-sql-typeorm-repository';
import { PostQuerySqlTypeormRepository } from './feature/posts/repositories/post-query-sql-typeorm-repository';
import { LikeStatusForPostTyp } from './feature/like-status-for-post/domain/typ-like-status-for-post.entity';
import { LikeStatusForPostSqlTypeormRepository } from './feature/like-status-for-post/repositories/like-status-for-post-sql-typeorm-repository';
import { Commenttyp } from './feature/comments/domaims/commenttyp.entity';
import { CommentSqlTypeormRepository } from './feature/comments/reposetories/comment-sql-typeorm-repository';
import { CommentQuerySqlTypeormRepository } from './feature/comments/reposetories/comment-query-sql-typeorm-repository';
import { LikeStatusForCommentTyp } from './feature/like-status-for-comment/domain/typ-like-status-for-comment.entity';
import { TypLikeStatusForCommentSqlRepository } from './feature/like-status-for-comment/repositories/typ-like-status-for-comment-sql-repository';
import { BlogService } from './feature/blogs/services/blog-service';
import { Question } from './feature/u-questions/domains/question.entity';
import { QuestionController } from './feature/u-questions/api/question-controller';
import { QuestionService } from './feature/u-questions/services/question-service';
import { QuestionRepository } from './feature/u-questions/repositories/question-repository';
import { QuestionQueryRepository } from './feature/u-questions/repositories/question-query-repository';
import { Game } from './feature/u-games/domains/game.entity';
import { ConnectionTabl } from './feature/u-games/domains/connection.entity';
import { RandomQuestion } from './feature/u-games/domains/random-question.entity';
import { GameController } from './feature/u-games/api/game-controller';
import { GameService } from './feature/u-games/services/game-service';
import { ConnectionRepository } from './feature/u-games/repositories/connection-repository';

dotenv.config();

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,

      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pavel',
      database: 'typeOrmDatabase',
      autoLoadEntities: true,
      synchronize: true,
      //logging: ['query'],
    }),
    TypeOrmModule.forFeature([
      Usertyp,
      Securitydevicetyp,
      Blogtyp,
      Posttyp,
      LikeStatusForPostTyp,
      Commenttyp,
      LikeStatusForCommentTyp,
      Question,
      Game,
      ConnectionTabl,
      RandomQuestion,
    ]),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const environmentSettings = configService.get(
          'environmentSettings',

          { infer: true },
        );

        const databaseSettings = configService.get('databaseSettings', {
          infer: true,
        });

        const uri = environmentSettings.isTesting
          ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
          : databaseSettings.MONGO_CONNECTION_URI;

        return {
          uri: uri,
        };
      },

      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: LimitVisit.name, schema: LimitVisitSchema },
    ]),
  ],
  /*все контроллеры приложения должны тут добавлены */
  controllers: [
    UsersController,
    BlogController,
    PostsController,
    CommentController,
    TestController,
    AuthController,
    SecurityDeviceController,
    SaBlogController,
    QuestionController,
    GameController,
  ],
  /* все сервисы приложения должны тут добавлены */
  providers: [
    UsersService,
    PostService,
    HashPasswordService,
    AuthService,
    TokenJwtService,
    EmailSendService,
    CommentService,
    AuthTokenGuard,
    DataUserExtractorFromTokenGuard,
    RefreshTokenGuard,
    SecurityDeviceService,
    VisitLimitGuard,
    LimitVisitService,
    LimitVisitRepository,
    UserQuerySqlRepository,
    UserSqlTypeormRepository,
    SecurityDeviceSqlTypeormRepository,
    BlogSqlTypeormRepository,
    BlogQuerySqlTypeormRepository,
    PostSqlTypeormRepository,
    PostQuerySqlTypeormRepository,
    LikeStatusForPostSqlTypeormRepository,
    CommentSqlTypeormRepository,
    CommentQuerySqlTypeormRepository,
    TypLikeStatusForCommentSqlRepository,
    BlogService,
    QuestionService,
    QuestionRepository,
    QuestionQueryRepository,
    GameService,
    ConnectionRepository,
  ],
})
export class AppModule {}
