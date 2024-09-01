import { Blogtyp } from '../../../blogs/domains/blogtyp.entity';
import { Posttyp } from '../../domains/posttyp.entity';
import { Usertyp } from '../../../users/domains/usertyp.entity';
import { LikeStatus } from '../../../../common/types';

export type CreatePostTypeorm = {
  title: string;
  shortDescription: string;
  content: string;
  createdAt: string;
  blogtyp: Blogtyp;
  blogName: string;
};

export type CreateLikeStatusForPost = {
  posttyp: Posttyp;
  usertyp: Usertyp;
  likeStatus: LikeStatus;
  login: string;
  addedAt: string;
};
