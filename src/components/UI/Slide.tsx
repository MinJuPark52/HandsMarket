import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Slide = () => {
  const slides: string[] = ["Slide 1", "Slide 2"];
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative max-w-[1020px]">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full h-64 bg-gray-300 flex items-center justify-center"
              >
                <img src="/slide.png" alt="슬라이드 이미지" />
              </div>
            ))}
          </div>
        </div>

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded border text-gray-600"
          onClick={prevSlide}
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded border text-gray-600"
          onClick={nextSlide}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Slide;
