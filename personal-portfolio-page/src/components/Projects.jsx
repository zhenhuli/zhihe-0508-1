import { useState, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useParallax } from '../hooks/useParallax';
import { projects } from '../data/portfolioData';

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [hoveredId, setHoveredId] = useState(null);
  const sectionRef = useRef(null);

  const getParallaxSpeed = (index) => {
    const speeds = [0.05, -0.03, 0.08, -0.05, 0.04, -0.06];
    return speeds[index % speeds.length];
  };

  const ProjectCard = ({ project, index }) => {
    const { ref: cardRef, offset } = useParallax(getParallaxSpeed(index));
    
    return (
      <div
        ref={cardRef}
        className="bg-dark-light rounded-2xl overflow-hidden card-hover group"
        style={{
          transitionDelay: `${index * 100}ms`,
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? offset : 20}px)`,
          transition: 'all 0.6s ease-out',
        }}
        onMouseEnter={() => setHoveredId(project.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="relative overflow-hidden h-48">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent transition-opacity duration-300 ${hoveredId === project.id ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute bottom-4 left-4 right-4 flex gap-4">
              <a
                href={project.github}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <FaGithub />
                <span className="text-sm">代码</span>
              </a>
              <a
                href={project.demo}
                className="flex items-center gap-2 gradient-bg px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
              >
                <FaExternalLinkAlt />
                <span className="text-sm">演示</span>
              </a>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">项目案例</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              精选的代表性项目，展示我在不同领域的开发能力和技术实践
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
