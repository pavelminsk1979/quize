import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { Usertyp } from '../../src/feature/users/domains/usertyp.entity';

describe('tests for andpoint users', () => {
  let app;

  let questionId1;

  const login1 = 'login400';
  const password1 = 'passwor400';
  const email1 = 'avelminsk400@mail.ru';

  let accessToken1;
  let accessToken2;

  const login2 = 'login22';
  const password2 = 'passwor22';
  const email2 = 'avelminsk22@mail.ru';

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  let gameId;
  let gameId2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());

    applyAppSettings(app);

    await app.init();

    //для очистки базы данных
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await app.close();
  });

  it('create user1', async () => {
    await request(app.getHttpServer())
      .post('/sa/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login: login1,
        password: password1,
        email: email1,
      })
      .expect(201);

    //userId = res.body.id;

    //console.log(res.body);
  });

  it('login  user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login1,
        password: password1,
      })
      .expect(200);

    accessToken1 = res.body.accessToken;
    //console.log(accessToken1);
  });

  it('create user2', async () => {
    await request(app.getHttpServer())
      .post('/sa/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login: login2,
        password: password2,
        email: email2,
      })
      .expect(201);

    //userId = res.body.id;

    //console.log(res.body);
  });

  it('login  user2', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login2,
        password: password2,
      })
      .expect(200);

    accessToken2 = res.body.accessToken;
    //console.log(accessToken2);
  });

  it('create question1', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+2? Ответ словом или числом',
        correctAnswers: ['4', 'four', 'четыре'],
      })
      .expect(201);
    /*   console.log('###########################');
       console.log(res.body);
       console.log('###########################');*/

    questionId1 = res.body.id;
  });

  it('start game first player', async () => {
    const res = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    /* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
     console.log(res.body.id);
     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*/
    gameId = res.body.id;
  });

  it('start game second player', async () => {
    const res = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);
    gameId2 = res.body.id;
  });

  it('get game by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${gameId}`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    console.log(res.body);
  });

  it('get game by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${gameId2}`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    console.log(res.body);
  });

  it('get Unfinished Game', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/my-current`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    //console.log(res.body);
  });
  it('get Unfinished Game', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/my-current`)
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);
  });
});
