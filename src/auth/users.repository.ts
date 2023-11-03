import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-cedentials.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersRepository extends Repository<User> {

    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDto:AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
       
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);

        const user = this.create({ username, password:hashedPass });

        try {
            await this.save(user);
        } catch (e) {
            if(+e.code === 23505) {
                throw new ConflictException('User already exists!')
            }

            throw new InternalServerErrorException();
        } 
    }

}