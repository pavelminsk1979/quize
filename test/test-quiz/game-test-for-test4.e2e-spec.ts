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

  let answer11;
  let answer12;
  let answer13;
  let answer14;
  let answer15;

  let answer11111;
  let answer11112;
  let answer11113;
  let answer11114;
  let answer11115;

  let answer21;
  let answer22;
  let answer23;
  let answer24;
  let answer25;

  let answer22221;
  let answer22222;
  let answer22223;
  let answer22224;
  let answer22225;

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
    const resultat = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    /* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
     console.log(resultat.body);
     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*/
    gameId = resultat.body.id;

    /////////////////////////////////////////////////////

    const dataSource = await app.resolve(DataSource);
    const res = await dataSource.query(
      `
      select *
     from public."random_question" r
     where r."idGameFK" = $1
    `,
      [gameId],
    );

    /*console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(res);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*/
    const idQuestion = res[0].idQuestionFK;
    const idQuestion2 = res[1].idQuestionFK;
    const idQuestion3 = res[2].idQuestionFK;
    const idQuestion4 = res[3].idQuestionFK;
    const idQuestion5 = res[4].idQuestionFK;

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

    answer12 = result2[0].correctAnswers.slice(0, 1);
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

    answer13 = result3[0].correctAnswers.slice(0, 1);
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

    answer14 = result4[0].correctAnswers.slice(0, 1);
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

    answer15 = result5[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/
  });

  it('start game second player', async () => {
    const resultat = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);

    const dataSource = await app.resolve(DataSource);

    const res = await dataSource.query(
      `
      select *
     from public."random_question" r
     where r."idGameFK" = $1
    `,
      [gameId],
    );

    /* console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
     console.log(res);
     console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*/
    const idQuestion = res[0].idQuestionFK;
    const idQuestion2 = res[1].idQuestionFK;
    const idQuestion3 = res[2].idQuestionFK;
    const idQuestion4 = res[3].idQuestionFK;
    const idQuestion5 = res[4].idQuestionFK;

    const result = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion],
    );

    answer21 = result[0].correctAnswers.slice(0, 1);
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

    answer23 = result3[0].correctAnswers.slice(0, 1);
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

    answer24 = result4[0].correctAnswers.slice(0, 1);
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

    answer25 = result5[0].correctAnswers.slice(0, 1);
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
      .send({ answer: answer12 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer21 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer22 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    const inCorrectAnswer = '33';
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: inCorrectAnswer })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer14 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: answer15 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    const inCorrectAnswer = '12';
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer23 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer24 })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: answer25 })
      .expect(200);
    //console.log(res.body);
  });

  ////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////
  ///////////////////////////////////////////////

  it('start game2 second player', async () => {
    const resultat = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);
    gameId2 = resultat.body.id;

    const dataSource = await app.resolve(DataSource);

    const res = await dataSource.query(
      `
      select *
     from public."random_question" r
     where r."idGameFK" = $1
    `,
      [gameId2],
    );

    /* console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
     console.log(res);
     console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*/
    const idQuestion22221 = res[0].idQuestionFK;
    const idQuestion22222 = res[1].idQuestionFK;
    const idQuestion22223 = res[2].idQuestionFK;
    const idQuestion22224 = res[3].idQuestionFK;
    const idQuestion22225 = res[4].idQuestionFK;

    const result = await dataSource.query(
      `
     select *
     from public."question" q
     where q.id = $1
     `,
      [idQuestion22221],
    );

    answer22221 = result[0].correctAnswers.slice(0, 1);
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
      [idQuestion22222],
    );

    answer22222 = result2[0].correctAnswers.slice(0, 1);
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
      [idQuestion22223],
    );

    answer22223 = result3[0].correctAnswers.slice(0, 1);
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
      [idQuestion22224],
    );

    answer22224 = result4[0].correctAnswers.slice(0, 1);
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
      [idQuestion22225],
    );

    answer22225 = result5[0].correctAnswers.slice(0, 1);
    /* console.log('-------------------------------------');
    console.log(result);
    console.log('-------------------------------------');*/
  });

  /*  it('start game2 first player', async () => {
      const resultat = await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/connection')
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);
      /!* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
       console.log(resultat.body);
       console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*!/
  
      /////////////////////////////////////////////////////
  
      const dataSource = await app.resolve(DataSource);
      const res = await dataSource.query(
        `
        select *
       from public."random_question" r
       where r."idGameFK" = $1
      `,
        [gameId2],
      );
  
      /!*console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(res);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');*!/
      const idQuestion = res[0].idQuestionFK;
      const idQuestion2 = res[1].idQuestionFK;
      const idQuestion3 = res[2].idQuestionFK;
      const idQuestion4 = res[3].idQuestionFK;
      const idQuestion5 = res[4].idQuestionFK;
  
      const result = await dataSource.query(
        `
      select *
      from public."question" q
      where q.id = $1
      `,
        [idQuestion],
      );
  
      answer11111 = result[0].correctAnswers.slice(0, 1);
      /!*console.log('-------------------------------------');
      console.log(result);
      console.log('-------------------------------------');*!/
  
      ////////////////////////////////////////////////
  
      const result2 = await dataSource.query(
        `
      select *
      from public."question" q
      where q.id = $1
      `,
        [idQuestion2],
      );
  
      answer11112 = result2[0].correctAnswers.slice(0, 1);
      /!* console.log('-------------------------------------');
      console.log(result);
      console.log('-------------------------------------');*!/
  
      ////////////////////////////////////////////////
  
      const result3 = await dataSource.query(
        `
      select *
      from public."question" q
      where q.id = $1
      `,
        [idQuestion3],
      );
  
      answer11113 = result3[0].correctAnswers.slice(0, 1);
      /!* console.log('-------------------------------------');
      console.log(result);
      console.log('-------------------------------------');*!/
  
      ////////////////////////////////////////////////
  
      const result4 = await dataSource.query(
        `
      select *
      from public."question" q
      where q.id = $1
      `,
        [idQuestion4],
      );
  
      answer11114 = result4[0].correctAnswers.slice(0, 1);
      /!* console.log('-------------------------------------');
      console.log(result);
      console.log('-------------------------------------');*!/
  
      ////////////////////////////////////////////////
  
      const result5 = await dataSource.query(
        `
      select *
      from public."question" q
      where q.id = $1
      `,
        [idQuestion5],
      );
  
      answer11115 = result5[0].correctAnswers.slice(0, 1);
      /!* console.log('-------------------------------------');
      console.log(result);
      console.log('-------------------------------------');*!/
    });
  
    it('set answer', async () => {
      await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${accessToken1}`)
        .send({ answer: answer11111 })
        .expect(200);
      //console.log(res.body);
    });
  
    it('set answer', async () => {
      const inCorrectAnswer = '12';
      await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ answer: inCorrectAnswer })
        .expect(200);
      //console.log(res.body);
    });
  
    it('set answer', async () => {
      await request(app.getHttpServer())
        .post('/pair-game-quiz/pairs/my-current/answers')
        .set('Authorization', `Bearer ${accessToken2}`)
        .send({ answer: answer22222 })
        .expect(200);
      //console.log(res.body);
    });*/

  /*  it('get Unfinished Game', async () => {
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/my-current`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .expect(200);
      console.log(res.body);
    });*/

  it('get all games', async () => {
    const res = await request(app.getHttpServer())
      .get('/pair-game-quiz/pairs/my?sortBy=status&sortDirection=asc')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    console.log(res.body.items);
    //console.log(res.body);
  });
});
