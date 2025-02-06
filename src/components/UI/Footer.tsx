import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="max-w-[1020px] flex flex-col pl-4 bg-[#f5f5f5]  dark:bg-gray-800 text-gray-600 dark:text-white w-full">
          <div className="flex mt-2 w-full">
            <div>
              <h1 className="mt-2 text-2xl font-bold text-black dark:text-white mb-4">
                EShop
              </h1>
              <p className="text-sm">(주) EShop | 대표: 박민주</p>
              <p className="mt-4 text-sm">About Us</p>
              <p className="mt-2 text-sm">
                최신 트렌드와 다양한 스타일 중심인 커머스 플랫폼
              </p>
              <ul className="mt-6 flex">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="hover:text-gray-800 text-[24px]" />
                </a>
              </ul>
            </div>
          </div>

          <div className="mt-4 mb-2 border-t border-gray-700 text-center text-sm">
            <p className="mt-2">&copy;2024 Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
