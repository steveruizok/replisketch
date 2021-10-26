import { supabase } from "backend/db"
import type { EditorProps } from "components/Editor"
import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
const Editor = dynamic<EditorProps>(
  () => import("components/Editor").then((t) => t.Editor),
  { ssr: false }
)

interface RoomProps extends EditorProps {}

export default function Room({ roomId }: RoomProps) {
  return <Editor roomId={roomId} />
}

export const getServerSideProps: GetServerSideProps<RoomProps> = async (
  ctx
) => {
  const { roomId } = ctx.query

  const t = await supabase.from("room").select().eq("id", roomId)

  if (t.body.length === 0) {
    // Create the room
    await supabase.from("room").insert({
      id: roomId,
      name: "New Room",
      url: `/room/${roomId}`,
    })
  }

  return {
    props: {
      roomId: roomId.toString(),
    },
  }
}
