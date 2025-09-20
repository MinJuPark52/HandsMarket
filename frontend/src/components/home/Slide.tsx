import React, { useState } from "react";

const Slide = () => {
  const slides: string[] = ["/slide1.png", "/slide2.png", "/slide3.png"];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[768px] h-[100px] overflow-hidden">
        <div className="relative flex">
          <div
            className="flex-shrink-0 w-[768px] h-[100px] flex items-center justify-center"
            key={currentSlide}
          >
            <img
              src={slides[currentSlide]}
              alt={`슬라이드 이미지 ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? "bg-gray-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slide;
