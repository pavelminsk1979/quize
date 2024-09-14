import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('tests for andpoint users', () => {
  let app;

  let questionId1;
  let questionId2;
  let questionId3;
  let questionId4;
  let questionId5;

  const login1 = 'login400';
  const password1 = 'passwor400';
  const email1 = 'avelminsk400@mail.ru';

  let accessToken1;
  let accessToken2;
  let accessToken3;

  const login2 = 'logi333';
  const password2 = 'passwor333';
  const email2 = 'avelminsk333@mail.ru';

  const login3 = 'login22';
  const password3 = 'passwor22';
  const email3 = 'avelminsk22@mail.ru';

  const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5';

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
    const res = await request(app.getHttpServer())
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

  it('create user3', async () => {
    await request(app.getHttpServer())
      .post('/sa/users')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        login: login3,
        password: password3,
        email: email3,
      })
      .expect(201);

    //userId = res.body.id;

    //console.log(res.body);
  });

  it('login  user3', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: login3,
        password: password3,
      })
      .expect(200);

    accessToken3 = res.body.accessToken;
    //console.log(accessToken1);
  });

  it('create question1', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'correctanswer',
        correctAnswers: ['correctanswer', 'правильноверно'],
      })
      .expect(201);
    /*   console.log('###########################');
       console.log(res.body);
       console.log('###########################');*/

    questionId1 = res.body.id;

    /*   console.log(questionId1);
       console.log(res.body);*/
  });

  it('create question2', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'correctanswer',
        correctAnswers: ['correctanswer', 'правильноверно'],
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
        body: 'correctanswer',
        correctAnswers: ['correctanswer', 'правильноверно'],
      })
      .expect(201);

    questionId3 = res.body.id;
  });

  it('create question4', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'correctanswer',
        correctAnswers: ['correctanswer', 'правильноверно'],
      })
      .expect(201);

    questionId4 = res.body.id;
  });

  it('create question5', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'correctanswer',
        correctAnswers: ['correctanswer', 'правильноверно'],
      })
      .expect(201);
    questionId5 = res.body.id;
    //console.log(questionId5);
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

  /* it('start game1 first player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken1}`)
       .expect(200);
     /!* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      console.log(resultat.body);
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*!/
   });
 
   it('start game1 second player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken2}`)
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'incorrectanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: 'correctanswer' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: 'incorrectanswer' })
       .expect(200);
     //console.log(res.body);
   });
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: 'incorrectanswer' })
       .expect(200);
     //console.log(res.body);
   });
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: 'incorrectanswer' })
       .expect(200);
     //console.log(res.body);
   });
 */
  ////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  /////////////////////////////////////////////////
  ///////////////////////////////////////////////

  it('start game2  player first', async () => {
    const resultat = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken2}`)
      .expect(200);
    //console.log(res.body);
  });

  it('start game2  player second', async () => {
    const resultat = await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/connection')
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);
    /* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
     console.log(resultat.body);
     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*/
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: 'correctanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });
  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });
  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: 'correctanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: 'correctanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });

  it('set answer', async () => {
    await request(app.getHttpServer())
      .post('/pair-game-quiz/pairs/my-current/answers')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ answer: 'incorrectanswer' })
      .expect(200);
    //console.log(res.body);
  });

  /////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //'my-current/answers'
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  /* it('start game3 first player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken3}`)
       .expect(200);
     /!* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      console.log(resultat.body);
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*!/
   });
 
   it('start game3 second player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken2}`)
       .expect(200);
     //console.log(res.body);
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
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: answer33331 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: answer33332 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: answer33333 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: answer33334 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken2}`)
       .send({ answer: answer33335 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer31 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: '777' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: '8888' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer34 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer35 })
       .expect(200);
     //console.log(res.body);
   });
 */
  /////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //'my-current/answers'
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  /* it('start game4 first player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken1}`)
       .expect(200);
     /!* console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');
      console.log(resultat.body);
      console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&');*!/
   });
 
   it('start game4 second player', async () => {
     const resultat = await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/connection')
       .set('Authorization', `Bearer ${accessToken3}`)
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer44441 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: answer41 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer44442 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: answer42 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: answer44443 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: answer43 })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: 'ytyt' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'ythghg' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken3}`)
       .send({ answer: 'hgjhg' })
       .expect(200);
     //console.log(res.body);
   });
 
   it('set answer', async () => {
     await request(app.getHttpServer())
       .post('/pair-game-quiz/pairs/my-current/answers')
       .set('Authorization', `Bearer ${accessToken1}`)
       .send({ answer: 'jhfyf' })
       .expect(200);
     //console.log(res.body);
   });*/
  /////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  //'my-current/answers'
  ///////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////

  it('get statistic my  games', async () => {
    const res = await request(app.getHttpServer())
      .get('/pair-game-quiz/users/my-statistic')
      .set('Authorization', `Bearer ${accessToken1}`)
      .expect(200);

    console.log(res.body);
  });
});
