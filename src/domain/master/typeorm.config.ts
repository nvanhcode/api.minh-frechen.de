import { initConfigTypeOrm } from '../../shared/config/typeorm.config';
import { ConstDomain } from './const.domain';

export default initConfigTypeOrm(ConstDomain.APP_NAME);
