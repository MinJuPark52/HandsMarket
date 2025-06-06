const Slide = () => {
  const slides: string[] = ["Slide 1", "Slide 2"];

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[1024px] h-[200px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[1024px] flex items-center justify-center"
          >
            <img src="/slide.png" alt="슬라이드 이미지" className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide;
