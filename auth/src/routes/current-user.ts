import { currentUser } from '@cnpcbuilder/common'
import express from 'express'
import { User } from '../models/user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  const userInfo = await User.findById(req.currentUser?.id)
  res.send(
    userInfo
      ? {
          currentUser: {
            ...req.currentUser,
            role: userInfo.role,
            verified: userInfo.verified,
            username: userInfo.username,
            firstName: userInfo.firstName,
            middleName: userInfo.middleName,
            lastName: userInfo.lastName,
          },
        }
      : {
          currentUser: null,
        }
  )
})

export { router as currentUserRouter }
