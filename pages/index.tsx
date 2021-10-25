import * as React from "react"
import dynamic from "next/dynamic"
const Editor = dynamic(
  () => import("components/Editor").then((t) => t.Editor),
  { ssr: false }
)

export default function Home() {
  return <Editor />
}
