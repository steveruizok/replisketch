import * as React from "react"
import dynamic from "next/dynamic"
import type { EditorProps } from "components/Editor"
const Editor = dynamic<EditorProps>(
  () => import("components/Editor").then((t) => t.Editor),
  { ssr: false }
)

export default function Home() {
  return <Editor roomId="home" />
}
