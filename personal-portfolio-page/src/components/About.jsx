import { FaBriefcase, FaGraduationCap, FaAward } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { experiences } from '../data/portfolioData';

const About = () => {
  const { ref, isVisible } = useScrollAnimation();

  const stats = [
    { icon: FaBriefcase, value: '50+', label: '完成项目' },
    { icon: FaGraduationCap, value: '5+', label: '年经验' },
    { icon: FaAward, value: '20+', label: '满意客户' },
  ];

  return (
    <section id="about" className="section-padding bg-dark-light/50">
      <div className="container-custom">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">关于我</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              了解更多关于我的背景、工作经历和职业历程
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">个人简介</h3>
              <div className="space-y-4 text-gray-400">
                <p>
                  我是一名充满热情的全栈开发工程师，拥有超过5年的Web开发经验。
                  我热爱探索新技术，并致力于创建优雅、高效且用户友好的数字产品。
                </p>
                <p>
                  我的技术栈涵盖前端的React、Vue.js、TypeScript，以及后端的Node.js、Python等。
                  我相信代码不仅要能工作，更要优雅、可维护。
                </p>
                <p>
                  在工作之余，我喜欢参与开源项目，撰写技术博客，与社区分享我的知识和经验。
                  我相信持续学习是保持竞争力的关键。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.5s ease-out',
                    }}
                  >
                    <stat.icon className="text-3xl text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white">工作经历</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30"></div>
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <div
                      key={exp.company}
                      className="relative pl-12"
                      style={{
                        transitionDelay: `${index * 150}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'all 0.6s ease-out',
                      }}
                    >
                      <div className="absolute left-2 top-1 w-5 h-5 rounded-full gradient-bg border-4 border-dark-light"></div>
                      <div className="bg-dark-light rounded-xl p-6 card-hover">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-white">{exp.position}</h4>
                          <span className="text-sm text-primary">{exp.period}</span>
                        </div>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        <p className="text-gray-400 text-sm">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
