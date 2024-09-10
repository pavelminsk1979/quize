import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usertyp } from '../users/domains/usertyp.entity';
import { Securitydevicetyp } from '../security-device/domains/securitydevicetype.entity';
import { Blogtyp } from '../blogs/domains/blogtyp.entity';
import { Posttyp } from '../posts/domains/posttyp.entity';
import { LikeStatusForPostTyp } from '../like-status-for-post/domain/typ-like-status-for-post.entity';
import { Commenttyp } from '../comments/domaims/commenttyp.entity';
import { LikeStatusForCommentTyp } from '../like-status-for-comment/domain/typ-like-status-for-comment.entity';
import { Question } from '../u-questions/domains/question.entity';
import { ConnectionTabl } from '../u-games/domains/connection.entity';
import { RandomQuestion } from '../u-games/domains/random-question.entity';
import { Game } from '../u-games/domains/game.entity';
import { Answers } from '../u-games/domains/answers.entity';

@Controller('testing')
export class TestController {
  constructor(
    @InjectRepository(Usertyp)
    private readonly usertypRepository: Repository<Usertyp>,
    @InjectRepository(Securitydevicetyp)
    private readonly securitydeviceRepository: Repository<Securitydevicetyp>,
    @InjectRepository(Blogtyp)
    private readonly blogtypRepository: Repository<Blogtyp>,
    @InjectRepository(Posttyp)
    private readonly posttypRepository: Repository<Posttyp>,
    @InjectRepository(LikeStatusForPostTyp)
    private readonly likeForPostTypRepository: Repository<LikeStatusForPostTyp>,
    @InjectRepository(Commenttyp)
    private readonly commenttypRepository: Repository<Commenttyp>,
    @InjectRepository(LikeStatusForCommentTyp)
    private readonly likeForCommentTypRepository: Repository<LikeStatusForCommentTyp>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(ConnectionTabl)
    private readonly connectionRepository: Repository<ConnectionTabl>,
    @InjectRepository(RandomQuestion)
    private readonly randomQuestionRepository: Repository<RandomQuestion>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('all-data')
  async deleteAllData() {
    await this.answersRepository.delete({});
    await this.randomQuestionRepository.delete({});
    await this.questionRepository.delete({});
    await this.connectionRepository.delete({});
    await this.gameRepository.delete({});
    await this.likeForCommentTypRepository.delete({});
    await this.commenttypRepository.delete({});
    await this.likeForPostTypRepository.delete({});
    await this.securitydeviceRepository.delete({});
    await this.usertypRepository.delete({});
    await this.posttypRepository.delete({});
    await this.blogtypRepository.delete({});
  }

  return;
}
