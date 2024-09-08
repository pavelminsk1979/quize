import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';

describe('tests for andpoint users', () => {
  let app;

  let questionId1;
  let questionId2;
  let questionId3;
  let questionId4;
  let questionId5;
  let questionId6;
  let questionId7;
  let questionId8;

  const login1 = 'login400';
  const password1 = 'passwor400';
  const email1 = 'avelminsk400@mail.ru';

  let accessToken1;
  let accessToken2;

  const login2 = 'login22';
  const password2 = 'passwor22';
  const email2 = 'avelminsk22@mail.ru';

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

  let answer1;
  let answer2;
  let answer3;
  let answer4;
  let answer5;

  let answer11;
  let answer22;
  let answer33;
  let answer44;
  let answer55;

  let gameId;

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

  it('create question2', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+3? Ответ словом или числом',
        correctAnswers: ['5', 'five', 'пять'],
      })
      .expect(201);

    questionId2 = res.body.id;

    //console.log(res.body);
  });

  it('create question3', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+4? Ответ словом или числом',
        correctAnswers: ['6', 'six', 'шесть'],
      })
      .expect(201);

    questionId3 = res.body.id;
  });

  it('create question4', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+5? Ответ словом или числом',
        correctAnswers: ['7', 'seven', 'семь'],
      })
      .expect(201);

    questionId4 = res.body.id;
  });

  it('create question5', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+6? Ответ словом или числом',
        correctAnswers: ['8', 'eight', 'восемь'],
      })
      .expect(201);
    questionId5 = res.body.id;
  });

  it('create question6', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+7? Ответ словом или числом',
        correctAnswers: ['9', 'nine', 'девять'],
      })
      .expect(201);
    questionId6 = res.body.id;
  });

  it('create question7', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '1+1? Ответ словом или числом',
        correctAnswers: ['2', 'two', 'два'],
      })
      .expect(201);
    questionId7 = res.body.id;
  });

  it('create question8', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '1+2? Ответ словом или числом',
        correctAnswers: ['3', 'three', 'три'],
      })
      .expect(201);
    questionId8 = res.body.id;
  });

  it('get questions + pagination', async () => {
    await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(200);
    /*   console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
       console.log(res.body.items[0].correctAnswers[0]);
       console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
       answer1 = res.body.items[0].correctAnswers[0].slice(0, 2);
       console.log('-------------------------------------');
       console.log(answer1);
       console.log('-------------------------------------');*/
  });

  it('update  Status Publish For Question1', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId1}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question2', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId2}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question3', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId3}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });
  it('update  Status Publish For Question4', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId4}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question5', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId5}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question6', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId6}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question7', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId7}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
  });

  it('update  Status Publish For Question8', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId8}/publish`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        published: true,
      })
      .expect(204);
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

    /////////////////////////////////////////////////////

    /*  console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
   console.log(res.body);
   console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*/
    const idQuestion = res.body.questions[0].id;
    const idQuestion2 = res.body.questions[1].id;
    const idQuestion3 = res.body.questions[2].id;
    const idQuestion4 = res.body.questions[3].id;
    const idQuestion5 = res.body.questions[4].id;

    const dataSource = await app.resolve(DataSource);
    const result = await dataSource.query(
      `
    select *
    from public."question" q
    where q.id = $1
    `,
      [idQuestion],
    );

    answer11 = result[0].correctAnswers.slice(0, 1);
    /*console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result2 = await dataSource.query(
      `
    select *
    from public."question" q
    where q.id = $1
    `,
      [idQuestion2],
    );

    answer22 = result2[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result3 = await dataSource.query(
      `
    select *
    from public."question" q
    where q.id = $1
    `,
      [idQuestion3],
    );

    answer33 = result3[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result4 = await dataSource.query(
      `
    select *
    from public."question" q
    where q.id = $1
    `,
      [idQuestion4],
    );

    answer44 = result4[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result5 = await dataSource.query(
      `
    select *
    from public."question" q
    where q.id = $1
    `,
      [idQuestion5],
    );

    answer55 = result5[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/
  });

  it('start game second player', async () => {
    const res = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);

    /*  console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(res.body);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*/
    const idQuestion = res.body.questions[0].id;
    const idQuestion2 = res.body.questions[1].id;
    const idQuestion3 = res.body.questions[2].id;
    const idQuestion4 = res.body.questions[3].id;
    const idQuestion5 = res.body.questions[4].id;

    const dataSource = await app.resolve(DataSource);
    const result = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion],
    );

    answer1 = result[0].correctAnswers.slice(0, 1);
    /*console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result2 = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion2],
    );

    answer2 = result2[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result3 = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion3],
    );

    answer3 = result3[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result4 = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion4],
    );

    answer4 = result4[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/

    ////////////////////////////////////////////////

    const result5 = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion5],
    );

    answer5 = result5[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/
  });

  /////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //'my-current/answers'
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer11 })
      .expect(200);
    //console.log(res.body);
  });
  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer22 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer33 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer44 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer55 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer1 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer2 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer3 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer4 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer5 })
      .expect(200);
    //console.log(res.body);
  });

  it('get game by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/${gameId}`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    console.log(res.body);
  });

  it('get Unfinished Game', async () => {
    const res = await request(app.getHttpServer())
      .get(`/pair-game-quiz/pairs/my-current`)
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(404);
    console.log(res.body);
  });

  /*  it('get game by id', async () => {
      const inCorrectGameId = '602afe92-7d97-4395-b1b9-6cf98b351bbe';
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${inCorrectGameId}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(400);
  
      await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${12345}`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(404);
      console.log(res.body);
    });*/
});
