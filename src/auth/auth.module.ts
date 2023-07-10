import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupModule } from 'src/signup/signup.module'

@Module({
  imports: [SignupModule],
  providers: [AuthService]
})
export class AuthModule {}
