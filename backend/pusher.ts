import Pusher from "pusher"

export const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
  useTLS: true,
})
