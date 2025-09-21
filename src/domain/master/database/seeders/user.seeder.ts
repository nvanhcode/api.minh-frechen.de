import { User } from '../../models/user.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class UserSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const defaultUsers = [
      {
        id: 1,
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin@123', 10),
        fullname: 'Administrator',
      },
    ];

    for (const userData of defaultUsers) {
      const existingUser = await userRepository.findOne({
        where: { id: userData.id },
      });

      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        console.log(`Created user: ${userData.id}`);
      } else {
        console.log(`User already exists: ${userData.id}`);
      }
    }
  }
}
