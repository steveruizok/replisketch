import { NextApiHandler } from "next"
import { initDb } from "backend/init"

const InitHandler: NextApiHandler = async (_, res) => {
  await initDb()
  res.send("ok")
}

export default InitHandler
