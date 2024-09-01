import { LikeStatus } from '../../../common/types';
import { Commenttyp } from '../../comments/domaims/commenttyp.entity';

export type LikeStatusForCommentCreateTyp = {
  userId: string;
  commenttyp: Commenttyp;
  likeStatus: LikeStatus;
  addedAt: string;
};
