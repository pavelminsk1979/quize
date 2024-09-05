import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import request from 'supertest';
import cookieParser from 'cookie-parser';

describe('tests for andpoint users', () => {
  let app;

  let questionId;

  let questionId2;
  let questionId3;
  let questionId4;
  let questionId5;
  let questionId6;
  let questionId7;
  let questionId8;

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
        body: '2+1? Ответ словом или числом',
        correctAnswers: ['3', 'three', 'три'],
      })
      .expect(201);

    //console.log(res.body);

    questionId = res.body.id;
  });

  it('update  question1', async () => {
    const inCorrectId = '602afe92-7d97-4395-b1b9-6cf98b351bbe';
    await request(app.getHttpServer())
      .put(`/sa/quiz/questions/${inCorrectId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)
      .send({
        body: 'update 2+2? Ответ словом или числом',
        correctAnswers: ['up-4, up-four, up-четыре'],
      })
      .expect(404);
  });

  it('delete  question1 by id', async () => {
    const inCorrectId = '602afe92-7d97-4395-b1b9-6cf98b351bbe';
    await request(app.getHttpServer())
      .delete(`/sa/quiz/questions/${inCorrectId}`)
      .set('Authorization', `Basic ${loginPasswordBasic64}`)

      .expect(404);
  });

  /*  it('create question2', async () => {
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
  
    it('update  Status Publish For Question2', async () => {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId2}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
      console.log('put');
      console.log(res.body);
      console.log('put');
    });
  
    it('get questions + pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
  
        .expect(200);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(res.body);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    });*/

  /*  it('create question3', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+4? Ответ словом или числом',
          correctAnswers: ['6', 'six', 'шесть'],
        })
        .expect(201);
  
      questionId3 = res.body.id;
    });*/

  /*  it('create question4', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+5? Ответ словом или числом',
          correctAnswers: ['7', 'seven', 'семь'],
        })
        .expect(201);
  
      questionId4 = res.body.id;
    });*/

  /*  it('create question5', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+6? Ответ словом или числом',
          correctAnswers: ['8', 'eight', 'восемь'],
        })
        .expect(201);
      questionId5 = res.body.id;
    });*/

  /*  it('create question6', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+7? Ответ словом или числом',
          correctAnswers: ['9', 'nine', 'девять'],
        })
        .expect(201);
      questionId6 = res.body.id;
    });*/

  /*  it('create question7', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+8? Ответ словом или числом',
          correctAnswers: ['10', 'ten', 'десять'],
        })
        .expect(201);
      questionId7 = res.body.id;
    });*/

  /*  it('create question8', async () => {
      const res = await request(app.getHttpServer())
        .post('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          body: '2+9? Ответ словом или числом',
          correctAnswers: ['11', 'eleven', 'одинадцать'],
        })
        .expect(201);
      questionId8 = res.body.id;
    });*/

  /*  it('get questions + pagination', async () => {
      const res = await request(app.getHttpServer())
        .get('/sa/quiz/questions')
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
  
        .expect(200);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
      console.log(res.body.items[2]);
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
    });
  
    it('update  Status Publish For Question2', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId2}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/

  /*  it('update  Status Publish For Question3', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId3}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/
  /*  it('update  Status Publish For Question4', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId4}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/

  /*  it('update  Status Publish For Question5', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId5}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/

  /*  it('update  Status Publish For Question6', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId6}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/

  /*  it('update  Status Publish For Question7', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId7}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/

  /*  it('update  Status Publish For Question8', async () => {
      await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId8}/publish`)
        .set('Authorization', `Basic ${loginPasswordBasic64}`)
        .send({
          published: true,
        })
        .expect(204);
    });*/
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
