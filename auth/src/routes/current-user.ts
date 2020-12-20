import express from 'express'

const router = express.Router()

router.get('/api/users/currentuser', (req, res) => {
  const { email, password } = req.body
})

export { router as currentUserRouter }
