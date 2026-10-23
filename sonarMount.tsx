import React from "react"
import ReactDOM from "react-dom/client"
import Demo from "@/components/ui/demo"
import "@/styles.css"

const rootEl = document.getElementById("root")
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Demo />
    </React.StrictMode>
  )
}
