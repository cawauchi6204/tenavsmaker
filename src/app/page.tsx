import dynamic from "next/dynamic"

const BookSelector = dynamic(() => import("../../book-selector"), {
  ssr: false
})

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookSelector />
    </div>
  )
}
