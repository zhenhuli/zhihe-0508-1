import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaArrowDown, FaCode, FaLaptopCode, FaDatabase } from 'react-icons/fa';
import { useParallax, useParallaxMouse } from '../hooks/useParallax';

const Hero = () => {
  const { ref: parallaxRef, position: mousePos } = useParallaxMouse(15);
  const { ref: blob1Ref, offset: blob1Offset } = useParallax(0.15);
  const { ref: blob2Ref, offset: blob2Offset } = useParallax(-0.1);
  const { ref: icon1Ref, offset: icon1Offset } = useParallax(0.2);
  const { ref: icon2Ref, offset: icon2Offset } = useParallax(-0.15);
  const { ref: icon3Ref, offset: icon3Offset } = useParallax(0.25);

  return (
    <section 
      id="home" 
      ref={parallaxRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden section-padding"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          ref={blob1Ref}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"
          style={{ 
            transform: `translateY(${blob1Offset}px) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        <div 
          ref={blob2Ref}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"
          style={{ 
            transform: `translateY(${blob2Offset}px) translate(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        ></div>
        
        <div 
          ref={icon1Ref}
          className="absolute top-1/4 left-1/4 text-primary/10 text-6xl"
          style={{ 
            transform: `translateY(${icon1Offset}px) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <FaCode />
        </div>
        <div 
          ref={icon2Ref}
          className="absolute bottom-1/3 right-1/4 text-secondary/10 text-7xl"
          style={{ 
            transform: `translateY(${icon2Offset}px) translate(${-mousePos.x * 0.4}px, ${-mousePos.y * 0.4}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <FaLaptopCode />
        </div>
        <div 
          ref={icon3Ref}
          className="absolute top-1/3 right-1/3 text-primary/10 text-5xl"
          style={{ 
            transform: `translateY(${icon3Offset}px) translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <FaDatabase />
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
            style={{
              transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-primary font-medium mb-4 text-lg"
            >
              👋 你好，我是
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="gradient-text">张开发</span>
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-2xl md:text-3xl text-gray-300 mb-6"
            >
              全栈开发工程师
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-gray-400 text-lg mb-8 max-w-xl"
            >
              热爱编程，专注于创建优雅、高性能的Web应用。
              拥有5年以上的开发经验，擅长React、Node.js等现代技术栈。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <a
                href="#projects"
                className="gradient-bg px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition-all hover:scale-105 text-center"
              >
                查看项目
              </a>
              <a
                href="#contact"
                className="border-2 border-primary px-8 py-3 rounded-full text-primary font-medium hover:bg-primary hover:text-white transition-all text-center"
              >
                联系我
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">
                <FaGithub />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">
                <FaLinkedin />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl transition-colors">
                <FaTwitter />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:w-1/2 flex justify-center"
            style={{
              transform: `translate(${-mousePos.x * 0.15}px, ${-mousePos.y * 0.15}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary shadow-2xl shadow-primary/30">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20developer%20portrait%20asian%20male%20tech%20background&image_size=square"
                  alt="Developer Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 gradient-bg rounded-2xl flex flex-col items-center justify-center text-white shadow-lg"
                style={{
                  transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <span className="text-2xl font-bold">5+</span>
                <span className="text-xs">年经验</span>
              </div>
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-dark-light rounded-xl flex items-center justify-center border border-primary/30 shadow-lg"
                style={{
                  transform: `translate(${-mousePos.x * 0.4}px, ${-mousePos.y * 0.4}px)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                <FaCode className="text-primary text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <a href="#skills" className="text-gray-400 hover:text-white animate-bounce-slow inline-block">
            <FaArrowDown size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
