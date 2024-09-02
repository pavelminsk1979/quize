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

  it('create question', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/quiz/questions')
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: '2+2? Ответ словом или числом',
        correctAnswers: ['4', 'four', 'четыре'],
      })
      .expect(201);

    console.log(res.body);

    questionId = res.body.id;
  });

  it('update  question', async () => {
    const res = await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${questionId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'update 2+2? Ответ словом или числом',
        correctAnswers: ['up-4', 'up-four', 'up-четыре'],
      })
      .expect(204);
    //console.log(res.body);
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
