import { AuthWithoutTokenDto } from '@/domain/master/swaggers/auth.dto';

export { AuthWithoutTokenDto };

export interface CommonRequestCustom extends Request {
  authData?: AuthWithoutTokenDto;
}
