import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World!',
    };
  }

  getMail() {
    //   await sendVerificationEmail({
    //     email: "aceinnovations0@gmail.com",
    //     name: "Aisosa",
    //     token: "123",
    //     callback: "something",
    //   });
    return 'sent mail';
  }
}
