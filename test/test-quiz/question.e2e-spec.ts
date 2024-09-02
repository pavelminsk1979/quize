import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('tests for andpoint users', () => {
  let app;

  let questionId;

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

  it('create question1', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+2? Ответ словом или числом',
        correctAnswers: ['4', 'four', 'четыре'],
      })
      .expect(201);

    //console.log(res.body);

    questionId = res.body.id;
  });

  it('update  question1', async () => {
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'update 2+2? Ответ словом или числом',
        correctAnswers: ['up-4', 'up-four', 'up-четыре'],
      })
      .expect(204);
  });

  it('delete  question1 by id', async () => {
    await request(app.getHttpServer())
      .delete(`/sa/quiz/questions/${questionId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(204);
  });

  it('create question2', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+3? Ответ словом или числом',
        correctAnswers: ['5', 'five', 'пять'],
      })
      .expect(201);

    //console.log(res.body);
  });

  it('create question3', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+4? Ответ словом или числом',
        correctAnswers: ['6', 'six', 'шесть'],
      })
      .expect(201);
  });

  it('create question4', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+5? Ответ словом или числом',
        correctAnswers: ['7', 'seven', 'семь'],
      })
      .expect(201);
  });

  it('create question5', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+6? Ответ словом или числом',
        correctAnswers: ['8', 'eight', 'восемь'],
      })
      .expect(201);
  });

  it('create question6', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+7? Ответ словом или числом',
        correctAnswers: ['9', 'nine', 'девять'],
      })
      .expect(201);
  });

  it('create question7', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+8? Ответ словом или числом',
        correctAnswers: ['10', 'ten', 'десять'],
      })
      .expect(201);
  });

  it('create question8', async () => {
    await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+9? Ответ словом или числом',
        correctAnswers: ['11', 'eleven', 'одинадцать'],
      })
      .expect(201);
  });

  it('get questions + pagination', async () => {
    const res = await request(app.getHttpServer())
      .get('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(200);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(res.body);
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
  });

  /* it('create user', async () => {
     const res = await request(app.getHttpServer())
       .post('/sa/users')
       .set('Authorization', `Basic ${loginPasswordBasic64}`)
       .send({
         login: login2,
         password: password2,
         email: email2,
       })
       .expect(201);
 
     //userId = res.body.id;
   });*/

  /*  it('delete  user by id', async () => {
      await request(app.getHttpServer())
        .delete(`/sa/users/${userId}`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
  
        .expect(204);
    });*/

  /*  it('get users', async () => {
      const res = await request(app.getHttpServer())
        .get('/sa/users')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
  
        .expect(200);
      console.log(res.body);
    });*/

  /*  it('delete  user by id', async () => {
      const id = '602afe92-7d97-4395-b1b9-6cf98b351bbe';
      await request(app.getHttpServer())
        .delete(`/sa/users/${id}`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
  
        .expect(404);
    });*/
});
