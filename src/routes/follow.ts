import { Router } from 'express'
import { restrictAccess } from '../auth/access'
import { userIdentity } from '../auth/access'
const router = Router()

import {
  createFollow,
  getOneFolloweeByIdWithAllHisFollowers,
  getOneFollowerByIdWithAllHisFollowees,
  unFollow,
  checkExistingFollow,
} from '../controllers/follow'

// /follow
router.post(
  '/:follower_address/:followee_address',
  restrictAccess('follower_address'),
  createFollow
) // ✔
router.get(
  '/:followee_address/followers',
  userIdentity(),
  getOneFolloweeByIdWithAllHisFollowers
) // ✔
router.get(
  '/:follower_address/followees',
  userIdentity(),
  getOneFollowerByIdWithAllHisFollowees
) // ✔
router.get('/:follower_address/:followee_address', checkExistingFollow)
router.delete(
  '/:follower_address/:followee_address',
  restrictAccess('follower_address'),
  unFollow
) // ✔

export default router
