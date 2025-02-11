"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function BookSelector() {
  // const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "図解入門 TCP/IP 第2版",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
    {
      id: 2,
      title: "Book 2",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
    {
      id: 3,
      title: "Book 3",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl text-center mb-8">名刺代わりの10冊メーカー</h1>

      <div className="flex items-center gap-2 mb-6">
        <span className="text-gray-600">#名刺代わりの</span>
        <Select defaultValue="novel">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="novel">小説</SelectItem>
            <SelectItem value="manga">漫画</SelectItem>
            <SelectItem value="business">ビジネス</SelectItem>
          </SelectContent>
        </Select>
        <span>10選</span>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <Select defaultValue="title">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="検索" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">タイトル</SelectItem>
            <SelectItem value="author">著者</SelectItem>
          </SelectContent>
        </Select>
        <span>で探す</span>
        <div className="relative flex-1">
          <Input placeholder="タイトルで探す" className="pl-8" />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="flex gap-4">
            {slides.map((slide, index) => (
              <Card
                key={slide.id}
                className={`w-64 h-80 flex flex-col items-center justify-center p-4 ${
                  index === currentSlide ? "border-blue-500" : ""
                }`}
              >
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-48 h-64 object-cover mb-4"
                />
                <Button variant="secondary" size="sm">
                  ＋ コメント
                </Button>
              </Card>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-blue-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-4">
        <Button variant="outline" className="w-full max-w-md">
          アフィリエイトIDを設定
        </Button>
      </div>

      <div className="text-center text-red-500 mb-4">まだ本が10冊選ばれていません。(1/10)</div>

      <Button className="w-full mb-4" disabled>
        保存
      </Button>

      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">保存後に、シェアできるようになります！</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Checkbox id="include-titles" />
          <label htmlFor="include-titles" className="text-sm">
            ツイートに本のタイトルを含める
          </label>
        </div>
        <Button variant="outline" className="w-full" disabled>
          twitterでシェア
        </Button>
      </div>

      <Button variant="destructive" className="w-full">
        リセット
      </Button>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <a href="#" className="hover:underline">
          プライバシーポリシー
        </a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">
          利用規約
        </a>
      </footer>
    </div>
  )
}

