import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="mt-2 w-full flex justify-center">
        <div className="max-w-[1024px] flex flex-col pl-4 bg-[#f5f5f5]  dark:bg-gray-700 text-gray-600 dark:text-white w-full">
          <div>
            <h2 className="mt-2 text-xl font-bold text-black dark:text-white mb-2">
              HandsMarket
            </h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm">(주) HandsMarket | 박민주</p>
              <span>
                <a
                  href="https://github.com/MinJuPark52/EShop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="hover:text-gray-800 text-[24px]" />
                </a>
              </span>
            </div>
          </div>

          <div className="mt-4 mb-2 border-t border-gray-700 text-center text-sm">
            <p className="mt-2">&copy;2025 Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
