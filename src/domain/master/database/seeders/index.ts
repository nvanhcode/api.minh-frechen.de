import { initConfigTypeOrm } from '../../../../shared/config/typeorm.config';
import { ConstDomain } from '../../const.domain';
import { UserSeeder } from './user.seeder';

const typeormConfig = initConfigTypeOrm(ConstDomain.APP_NAME);

async function runSeeders() {
  try {
    console.log('Initializing database connection...');

    if (!typeormConfig.isInitialized) {
      await typeormConfig.initialize();
    }

    console.log('Running seeder users ...');
    const userSeeder = new UserSeeder();
    await userSeeder.run(typeormConfig);
    console.log('✅ User seeder completed');

    console.log('🎉 All seeders completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  } finally {
    if (typeormConfig.isInitialized) {
      await typeormConfig.destroy();
    }
    process.exit(0);
  }
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders };
