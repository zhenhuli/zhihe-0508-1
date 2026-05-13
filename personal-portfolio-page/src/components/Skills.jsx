import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useParallax } from '../hooks/useParallax';
import { skills } from '../data/portfolioData';

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { ref: titleRef, offset: titleOffset } = useParallax(-0.05);

  const categories = [...new Set(skills.map(skill => skill.category))];

  const CategoryCard = ({ category, categoryIndex }) => {
    const { ref: cardRef, offset } = useParallax((categoryIndex - 1) * 0.03);
    
    return (
      <div
        ref={cardRef}
        className="bg-dark-light rounded-2xl p-6 card-hover"
        style={{
          transitionDelay: `${categoryIndex * 100}ms`,
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? offset : 20}px)`,
          transition: 'all 0.6s ease-out',
        }}
      >
        <h3 className="text-xl font-semibold mb-6 gradient-text">{category}</h3>
        <div className="space-y-4">
          {skills
            .filter(skill => skill.category === category)
            .map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{skill.name}</span>
                  <span className="text-primary text-sm">{skill.level}%</span>
                </div>
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${(categoryIndex * 3 + index) * 100}ms`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <section id="skills" className="section-padding bg-dark-light/50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div 
            ref={titleRef}
            className="text-center mb-16"
            style={{ transform: `translateY(${titleOffset}px)` }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">技术技能</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              多年积累的技术栈，涵盖前端、后端、数据库和DevOps等多个领域
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, categoryIndex) => (
              <CategoryCard 
                key={category} 
                category={category} 
                categoryIndex={categoryIndex} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
