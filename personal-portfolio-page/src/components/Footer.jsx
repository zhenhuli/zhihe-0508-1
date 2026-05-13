import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-light py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <a href="#home" className="text-2xl font-bold gradient-text">
              Portfolio
            </a>
            <p className="text-gray-400 mt-2 text-sm">
              用代码创造美好体验
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors hover:scale-110 transform">
              <FaGithub />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors hover:scale-110 transform">
              <FaLinkedin />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl transition-colors hover:scale-110 transform">
              <FaTwitter />
            </a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm flex items-center gap-2 justify-center md:justify-end">
              © {currentYear} Made with <FaHeart className="text-red-500" /> by 张开发
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
