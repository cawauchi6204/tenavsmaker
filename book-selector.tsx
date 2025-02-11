"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Book {
  id: number
  title: string
  image: string
  comment?: string
}

export default function BookSelector() {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [includeTitles, setIncludeTitles] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("title")
  const [category, setCategory] = useState("novel")

  const slides: Book[] = [
    {
      id: 1,
      title: "図解入門 TCP/IP 第2版",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
    {
      id: 2,
      title: "ここをクリックして、本を検索してください",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
    {
      id: 3,
      title: "ここをクリックして、本を検索してください",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
  ]

  const handleBookSelect = (book: Book) => {
    if (selectedBooks.length >= 10 && !selectedBooks.find(b => b.id === book.id)) {
      return
    }

    setSelectedBooks(prev => {
      const isSelected = prev.find(b => b.id === book.id)
      if (isSelected) {
        return prev.filter(b => b.id !== book.id)
      } else {
        return [...prev, book]
      }
    })
  }

  const handleSave = () => {
    console.log("Selected books:", selectedBooks)
  }

  const handleShare = () => {
    const baseText = `#名刺代わりの${category}10選`
    const titlesText = includeTitles
      ? "\n\n" + selectedBooks.map((book, i) => `${i + 1}. ${book.title}`).join("\n")
      : ""
    const shareText = encodeURIComponent(`${baseText}${titlesText}\n\n#10BooksMarker`)
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank")
  }

  const handleReset = () => {
    setSelectedBooks([])
    setCurrentSlide(0)
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f3ff] to-white">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <h1 className="text-2xl text-center mb-12 text-[#333]">名刺代わりの10冊メーカー</h1>

        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-[#666]">#名刺代わりの</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[100px] bg-white border-[#ccc] text-[#666] hover:bg-gray-50">
              <SelectValue placeholder="小説" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novel">小説</SelectItem>
              <SelectItem value="manga">漫画</SelectItem>
              <SelectItem value="business">ビジネス</SelectItem>
              <SelectItem value="tech">技術書</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[#666]">10選</span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[100px] bg-white border-[#ccc] text-[#666] hover:bg-gray-50">
              <SelectValue placeholder="タイトル" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">タイトル</SelectItem>
              <SelectItem value="author">著者</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-[#666]">で探す</span>
          <div className="relative flex-1 max-w-[400px]">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="タイトルで探す"
              className="pl-8 bg-white border-[#ccc] text-[#666] hover:bg-gray-50"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
          </div>
        </div>

        <div className="relative mb-8">
          <div className="flex justify-center items-center gap-4">
            <button
              className="text-[#666] hover:text-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="flex gap-4 overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`w-[200px] transition-all ${
                    index === currentSlide ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => handleBookSelect(slide)}
                >
                  <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full aspect-[3/4] object-cover mb-4 rounded"
                    />
                    <button className="w-full py-2 px-4 bg-[#6c8ebf] text-white rounded hover:bg-[#5c7eaf] transition-colors text-sm">
                      + コメント
                    </button>
                  </Card>
                </div>
              ))}
            </div>

            <button
              className="text-[#666] hover:text-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#6c8ebf]" : "bg-[#ccc]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-[#666] text-sm mb-1">楽天、Amazonのアフィリエイトを設定できます👌</p>
          <button className="w-full max-w-[400px] py-2 px-4 bg-white border border-[#ccc] text-[#666] rounded hover:bg-gray-50 transition-colors">
            アフィリエイトIDを設定
          </button>
        </div>

        <div className="text-center text-[#ff4444] mb-6">
          まだ本が10冊選ばれていません。(1/10)
        </div>

        <button
          className="w-full mb-6 py-3 bg-[#ccc] text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#bbb] transition-colors"
          disabled={selectedBooks.length !== 10}
          onClick={handleSave}
        >
          保存
        </button>

        <div className="text-center mb-6">
          <p className="text-[#666] mb-4">保存後に、シェアできるようになります!</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Checkbox
              id="include-titles"
              checked={includeTitles}
              onCheckedChange={(checked) => setIncludeTitles(checked as boolean)}
              className="border-[#ccc] data-[state=checked]:bg-[#6c8ebf] data-[state=checked]:border-[#6c8ebf]"
            />
            <label htmlFor="include-titles" className="text-sm text-[#666]">
              ツイートに本のタイトルを含める
            </label>
          </div>
          <button
            className="w-full py-3 bg-[#1da1f2] text-white rounded font-medium hover:bg-[#1a91da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedBooks.length !== 10}
            onClick={handleShare}
          >
            twitterでシェア
          </button>
        </div>

        <button
          className="w-full py-3 bg-[#e91e63] text-white rounded font-medium hover:bg-[#d81557] transition-colors"
          onClick={handleReset}
        >
          リセット
        </button>

        <footer className="mt-8 text-center text-sm text-[#666] border-t border-[#eee] pt-8">
          <a href="#" className="hover:text-[#333] transition-colors">
            プライバシーポリシー
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-[#333] transition-colors">
            利用規約
          </a>
        </footer>
      </div>
    </div>
  )
}
