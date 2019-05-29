import { UserState } from '../../shared/components/auth/state/user.reducer';
import { User } from '../base-model/user.model';

export interface State {
  user: UserState;
  users: User[];
}
