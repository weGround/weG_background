import { Module } from '@nestjs/common';
import { Signup, SignupSchema } from './signup.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SignupMongoRepository } from './signup.repository';
import { SignupService } from './signup.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Signup.name, schema: SignupSchema}])],
    providers: [SignupService, SignupMongoRepository ]

})
export class SignupModule {}
