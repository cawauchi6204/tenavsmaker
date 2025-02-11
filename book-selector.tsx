"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: number;
  title: string;
  image: string;
  comment?: string;
}

export default function BookSelector() {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [includeTitles, setIncludeTitles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  const slides: Book[] = Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: "ここをタップしてAVを検索してください",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    }));

  const handleBookSelect = (book: Book) => {
    if (
      selectedBooks.length >= 10 &&
      !selectedBooks.find((b) => b.id === book.id)
    ) {
      return;
    }

    setSelectedBooks((prev) => {
      const isSelected = prev.find((b) => b.id === book.id);
      if (isSelected) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const handleSave = () => {
    console.log("Selected books:", selectedBooks);
  };

  const handleShare = () => {
    const baseText = `#名刺代わりのAV10選`;
    const titlesText = includeTitles
      ? "\n\n" +
        selectedBooks.map((book, i) => `${i + 1}. ${book.title}`).join("\n")
      : "";
    const shareText = encodeURIComponent(
      `${baseText}${titlesText}\n\n#10BooksMarker`
    );
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
  };

  const handleReset = () => {
    setSelectedBooks([]);
    setCurrentSlide(0);
    setSearchTerm("");
  };

  // 1ページあたりの表示数を定義
  const BOOKS_PER_PAGE = 3;

  // 表示する本の配列を計算
  const visibleSlides = slides.slice(
    currentSlide * BOOKS_PER_PAGE,
    currentSlide * BOOKS_PER_PAGE + BOOKS_PER_PAGE
  );

  // 最大ページ数を計算
  const maxPage = Math.ceil(slides.length / BOOKS_PER_PAGE) - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f3ff] to-white">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <h1 className="text-2xl text-center mb-12 text-[#333]">
          名刺代わりのAV10選メーカー
        </h1>

        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-[#666]">#名刺代わりの</span>
          AV
          <span className="text-[#666]">10選</span>
        </div>

        <div className="flex items-start justify-center flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[100px] bg-white border-[#ccc] text-[#666] hover:bg-gray-50">
                <SelectValue placeholder="タイトル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">タイトル</SelectItem>
                <SelectItem value="actress">女優名</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-[#666]">で探す</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "title" ? "タイトルで探す" : "女優名で探す"
                }
                className="pl-8 bg-white border-[#ccc] text-[#666] hover:bg-gray-50"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
            </div>
            <button
              className="px-4 py-2 bg-[#6c8ebf] text-white rounded hover:bg-[#5c7eaf] transition-colors"
              onClick={() => console.log("Search:", searchTerm)}
            >
              検索
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="relative w-full">
            <div className="flex gap-4 overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="flex gap-2 md:gap-4 w-full"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    mass: 0.8,
                    duration: 0.5,
                  }}
                >
                  {visibleSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="w-full flex-1"
                      onClick={() => handleBookSelect(slide)}
                    >
                      <Card className="p-2 md:p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-full aspect-[3/4] bg-gray-50 rounded flex items-center justify-center mb-2 md:mb-4">
                          <p className="text-gray-400 text-center text-xs md:text-sm px-2 md:px-4">
                            ここをタップして
                            <br />
                            AVを検索してください
                          </p>
                        </div>
                        <button className="w-full py-1 md:py-2 px-2 md:px-4 bg-[#6c8ebf] text-white rounded hover:bg-[#5c7eaf] transition-colors text-xs md:text-sm">
                          + コメント
                        </button>
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 rounded-full p-1"
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 rounded-full p-1"
              onClick={() => setCurrentSlide((prev) => Math.min(maxPage, prev + 1))}
              disabled={currentSlide === maxPage}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: maxPage + 1 }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#6c8ebf]" : "bg-[#ccc]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-[#ff4444] mb-6">
          まだAVが全て選ばれていません。(1/10)
        </div>

        <button
          className="w-full mb-6 py-3 bg-[#ccc] text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#bbb] transition-colors"
          disabled={selectedBooks.length !== 10}
          onClick={handleSave}
        >
          保存
        </button>

        <div className="text-center mb-6">
          <p className="text-[#666] mb-4">
            保存後に、シェアできるようになります!
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Checkbox
              id="include-titles"
              checked={includeTitles}
              onCheckedChange={(checked) =>
                setIncludeTitles(checked as boolean)
              }
              className="border-[#ccc] data-[state=checked]:bg-[#6c8ebf] data-[state=checked]:border-[#6c8ebf]"
            />
            <label htmlFor="include-titles" className="text-sm text-[#666]">
              ツイートにAVのタイトルを含める
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
  );
}
