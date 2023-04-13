import { Test, TestingModule } from '@nestjs/testing';

import { AuthModule } from '../auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controller/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

describe('AuthController testing', () => {
  let controller: AuthController;
  let module: TestingModule;
  let authService: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.local' }),
        AuthModule,
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be login successfully', async () => {
    const body: LoginDto = {
      username: 'admin',
      password: 'admin123',
    };
    expect(await controller.login(body)).toMatchObject({
      token: expect.any(String),
      user: expect.any(Object),
    });
  }, 15000);

  it('should be register successfully', async () => {
    function makeid(length) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
        counter += 1;
      }
      return result;
    }

    const body: RegisterDto = {
      email: `${makeid(10)}@gmail.com`,
      password: 'test123123',
      username: `${makeid(10)}`,
    };

    expect(await controller.register(body)).toMatchObject({
      token: expect.any(String),
    });

    await authService.physicalDeleteUser(body.username);
  }, 15000);
});
