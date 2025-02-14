"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
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

interface AV {
  id: number;
  title: string;
  image: string;
  comment?: string;
}

interface SearchResult {
  id: string;
  title: string;
  image_url: string;
  fanza_url: string;
}

export default function AVSelector() {
  const [selectedAVs, setSelectedAVs] = useState<AV[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [includeTitles, setIncludeTitles] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTargetAV, setCommentTargetAV] = useState<AV | null>(null);
  const [commentText, setCommentText] = useState("");

  const slides: AV[] = Array(10)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: "ここをタップしてAVを検索してください",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
    }));

  const handleAVSelect = (av: AV) => {
    setSelectedAVs((prev) => {
      const isSelected = prev.find((a) => a.id === av.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== av.id);
      } else {
        return [av];
      }
    });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/search?' + new URLSearchParams({
        term: searchTerm,
        type: searchType
      }));
      const data = await response.json();
      setSearchResults(data);
      setShowSearchModal(true);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleShare = () => {
    const baseText = `#名刺代わりのAV10選`;
    const titlesText = includeTitles
      ? "\n\n" +
        selectedAVs.map((av, i) => `${i + 1}. ${av.title}`).join("\n")
      : "";
    const shareText = encodeURIComponent(
      `${baseText}${titlesText}\n\n#名刺代わりのAV10選`
    );
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
  };

  const handleReset = () => {
    setSelectedAVs([]);
    setCurrentSlide(0);
    setSearchTerm("");
  };

  // 1ページあたりの表示数を定義
  const AVS_PER_PAGE = 3;

  // 表示する本の配列を計算
  const visibleSlides = slides.slice(
    currentSlide * AVS_PER_PAGE,
    currentSlide * AVS_PER_PAGE + AVS_PER_PAGE
  );

  // 最大ページ数を計算
  const maxPage = Math.ceil(slides.length / AVS_PER_PAGE) - 1;

  // コメント追加用の関数
  const handleCommentClick = (e: React.MouseEvent, av: AV) => {
    e.stopPropagation(); // カード選択のイベントバブリングを防ぐ
    setCommentTargetAV(av);
    setCommentText(av.comment || "");
    setShowCommentModal(true);
  };

  // コメント保存用の関数
  const handleCommentSave = () => {
    if (commentTargetAV) {
      setSelectedAVs(prev =>
        prev.map(av =>
          av.id === commentTargetAV.id
            ? { ...av, comment: commentText }
            : av
        )
      );
    }
    setShowCommentModal(false);
    setCommentTargetAV(null);
    setCommentText("");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[800px] mx-auto px-4 pb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span>#名刺代わりのAV10選</span>
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
            <span>で探す</span>
          </div>
          <div className="w-full flex items-center gap-2">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "title" ? "タイトルで探す" : "女優名で探す"
                }
                className="pl-8 bg-white border-[#ccc] text-[#666] hover:bg-gray-50 text-base"
                style={{ fontSize: '16px' }}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
            </div>
            <button
              className="px-4 py-2 bg-[#ffa31a] text-white rounded hover:bg-[#5c7eaf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
            >
              検索
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="relative w-full">
            <div className="flex overflow-hidden w-full px-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="flex gap-2 w-full"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{
                    type: "keyframes",
                    stiffness: 3000,
                    damping: 200,
                    mass: 0.8,
                    duration: 0.1,
                  }}
                >
                  {visibleSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="w-[calc((100%-1rem)/3)] flex-shrink-0"
                      onClick={() => handleAVSelect(slide)}
                    >
                      <Card className={`p-2 md:p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full ${
                        selectedAVs.find(b => b.id === slide.id) ? 'border-8 border-[#ffa31a]' : ''
                      }`}>
                        <div className="w-full aspect-[3/4] bg-gray-50 rounded flex items-center justify-center mb-2 md:mb-4">
                          <p className="text-center text-xs md:text-sm px-2 md:px-4">
                            ここをタップして
                            <br />
                            AVを検索してください
                          </p>
                        </div>
                        <button 
                          className="w-full py-1 md:py-2 px-2 bg-[#808080] md:px-4 text-white rounded transition-colors text-xs md:text-sm"
                          onClick={(e) => handleCommentClick(e, slide)}
                        >
                          {slide.comment ? "コメントを編集" : "+ コメント"}
                        </button>
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#ffa31a] rounded-full p-1"
              onClick={() => setCurrentSlide((prev) => prev === 0 ? maxPage : prev - 1)}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#ffa31a] rounded-full p-1"
              onClick={() =>
                setCurrentSlide((prev) =>
                  prev === maxPage ? 0 : prev + 1
                )
              }
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

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Checkbox
              id="include-titles"
              checked={includeTitles}
              onCheckedChange={(checked) =>
                setIncludeTitles(checked as boolean)
              }
              className="border-[#ccc] bg-white"
            />
            <label htmlFor="include-titles" className="text-sm">
              ツイートにAVのタイトルを含める
            </label>
          </div>
          <button
            className="w-full py-3 bg-[#1da1f2] text-white rounded font-medium hover:bg-[#1a91da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedAVs.length !== 10}
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

        {/* <footer className="mt-8 text-center text-sm text-[#666] border-t border-[#eee] pt-8">
          <a href="#" className="hover:text-[#333] transition-colors">
            プライバシーポリシー
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-[#333] transition-colors">
            利用規約
          </a>
        </footer> */}

        {/* 検索モーダル */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">検索結果</h2>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border-8 rounded-lg p-4 cursor-pointer hover:border-[#ffa31a]"
                    onClick={() => {
                      handleAVSelect({
                        id: parseInt(result.id),
                        title: result.title,
                        image: result.image_url,
                      });
                    }}
                  >
                    <img
                      src={result.image_url}
                      alt={result.title}
                      className="w-full aspect-[3/4] object-cover rounded mb-2"
                    />
                    <p className="text-sm">{result.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* コメント入力モーダル */}
        {showCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">コメントを入力</h2>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
                placeholder="コメントを入力してください"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCommentSave}
                  className="px-4 py-2 bg-[#ffa31a] text-white rounded hover:bg-[#ff9900]"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
