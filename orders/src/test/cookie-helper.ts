import jwt from 'jsonwebtoken'

export function getAuthCookie(id: string, email: string): string[] {
  const payload = {
    id,
    email,
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')

  //* Array because supertest expects cookies as an array
  return [`express:sess=${base64}`]
}
