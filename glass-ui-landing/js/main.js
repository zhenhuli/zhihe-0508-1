document.addEventListener('DOMContentLoaded', function() {
    const translations = {
        zh: {
            'page.title': 'GlassUI - 现代化企业解决方案',
            'nav.home': '首页',
            'nav.features': '功能',
            'nav.about': '关于我们',
            'nav.contact': '联系我们',
            'hero.title.part1': '开启未来',
            'hero.title.highlight': '企业数字化',
            'hero.title.part2': '新时代',
            'hero.description': 'GlassUI 为您提供最先进的毛玻璃风格企业解决方案，帮助您的业务在数字时代脱颖而出，实现卓越增长。',
            'hero.cta.primary': '立即开始',
            'hero.cta.secondary': '了解更多',
            'features.title': '核心功能',
            'features.subtitle': '强大而优雅的解决方案，助力企业腾飞',
            'features.speed.title': '极速性能',
            'features.speed.description': '采用最新技术栈，确保您的应用始终保持最佳性能状态，为用户提供流畅的使用体验。',
            'features.security.title': '安全可靠',
            'features.security.description': '多层安全防护机制，保护您的企业数据和用户隐私，让您无后顾之忧。',
            'features.design.title': '精美设计',
            'features.design.description': '毛玻璃风格美学与现代设计理念完美融合，打造令人惊艳的用户界面。',
            'features.responsive.title': '全端适配',
            'features.responsive.description': '完美支持桌面端、平板和移动设备，随时随地提供一致的用户体验。',
            'features.customization.title': '灵活定制',
            'features.customization.description': '高度可定制化的组件系统，满足您企业的个性化需求。',
            'features.support.title': '专业支持',
            'features.support.description': '24/7 全天候专业技术支持团队，随时为您解答问题和提供帮助。',
            'about.title': '关于我们',
            'about.subtitle': '创新驱动，品质为先',
            'about.paragraph1': 'GlassUI 是一家专注于企业数字化转型的科技公司。我们相信，优秀的设计能够改变世界，而毛玻璃风格正是我们追求的美学巅峰。',
            'about.paragraph2': '自成立以来，我们已经服务了超过 500 家企业客户，帮助他们构建了现代化的数字化产品和服务。我们的团队由来自全球顶级科技公司的工程师和设计师组成，致力于为客户提供最优质的解决方案。',
            'about.stats.clients': '企业客户',
            'about.stats.satisfaction': '客户满意度',
            'about.stats.support': '全天候支持',
            'about.team': '我们的专业团队随时为您服务',
            'footer.description': '为企业提供最先进的毛玻璃风格数字化解决方案，助力您的业务在数字时代腾飞。',
            'footer.product': '产品',
            'footer.product.features': '功能特性',
            'footer.product.pricing': '价格方案',
            'footer.product.cases': '客户案例',
            'footer.product.changelog': '更新日志',
            'footer.company': '公司',
            'footer.company.about': '关于我们',
            'footer.company.team': '团队成员',
            'footer.company.careers': '职业机会',
            'footer.company.news': '新闻动态',
            'footer.support': '支持',
            'footer.support.help': '帮助中心',
            'footer.support.docs': '开发文档',
            'footer.support.community': '社区论坛',
            'footer.support.contact': '联系我们'
        },
        en: {
            'page.title': 'GlassUI - Modern Enterprise Solutions',
            'nav.home': 'Home',
            'nav.features': 'Features',
            'nav.about': 'About Us',
            'nav.contact': 'Contact',
            'hero.title.part1': 'Embrace the Future of',
            'hero.title.highlight': 'Enterprise',
            'hero.title.part2': 'Digitalization',
            'hero.description': 'GlassUI provides you with the most advanced glassmorphism-style enterprise solutions, helping your business stand out in the digital age and achieve exceptional growth.',
            'hero.cta.primary': 'Get Started',
            'hero.cta.secondary': 'Learn More',
            'features.title': 'Core Features',
            'features.subtitle': 'Powerful and elegant solutions to empower your business',
            'features.speed.title': 'Blazing Fast',
            'features.speed.description': 'Using the latest technology stack to ensure your applications always maintain optimal performance, providing users with a seamless experience.',
            'features.security.title': 'Secure & Reliable',
            'features.security.description': 'Multi-layer security protection mechanism to safeguard your enterprise data and user privacy, giving you complete peace of mind.',
            'features.design.title': 'Beautiful Design',
            'features.design.description': 'Glassmorphism aesthetics perfectly blended with modern design concepts to create stunning user interfaces.',
            'features.responsive.title': 'Cross-Platform',
            'features.responsive.description': 'Perfect support for desktop, tablet, and mobile devices, providing a consistent user experience anytime, anywhere.',
            'features.customization.title': 'Flexible Customization',
            'features.customization.description': 'Highly customizable component system to meet your enterprise\'s personalized needs.',
            'features.support.title': 'Professional Support',
            'features.support.description': '24/7 dedicated professional technical support team, ready to answer your questions and provide assistance.',
            'about.title': 'About Us',
            'about.subtitle': 'Innovation-driven, Quality-first',
            'about.paragraph1': 'GlassUI is a technology company focused on enterprise digital transformation. We believe that great design can change the world, and glassmorphism is the pinnacle of aesthetics we pursue.',
            'about.paragraph2': 'Since our founding, we have served over 500 enterprise clients, helping them build modern digital products and services. Our team consists of engineers and designers from top global tech companies, dedicated to providing the highest quality solutions for our clients.',
            'about.stats.clients': 'Enterprise Clients',
            'about.stats.satisfaction': 'Client Satisfaction',
            'about.stats.support': '24/7 Support',
            'about.team': 'Our professional team is always ready to serve you',
            'footer.description': 'Providing enterprises with the most advanced glassmorphism-style digital solutions to help your business soar in the digital age.',
            'footer.product': 'Product',
            'footer.product.features': 'Features',
            'footer.product.pricing': 'Pricing',
            'footer.product.cases': 'Case Studies',
            'footer.product.changelog': 'Changelog',
            'footer.company': 'Company',
            'footer.company.about': 'About Us',
            'footer.company.team': 'Team',
            'footer.company.careers': 'Careers',
            'footer.company.news': 'News',
            'footer.support': 'Support',
            'footer.support.help': 'Help Center',
            'footer.support.docs': 'Documentation',
            'footer.support.community': 'Community',
            'footer.support.contact': 'Contact Us'
        }
    };

    let currentLang = localStorage.getItem('glassui-lang') || 'zh';

    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in, .fade-in-down');
    const languageSwitcher = document.getElementById('languageSwitcher');
    const langBtns = document.querySelectorAll('.lang-btn');
    const html = document.documentElement;

    function setLanguage(lang) {
        if (!translations[lang]) return;

        currentLang = lang;
        localStorage.setItem('glassui-lang', lang);

        html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        const pageTitle = document.querySelector('title');
        if (pageTitle && translations[lang]['page.title']) {
            pageTitle.textContent = translations[lang]['page.title'];
        }

        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('lang-btn-active');
            } else {
                btn.classList.remove('lang-btn-active');
            }
        });
    }

    function handleLanguageSwitch(e) {
        const langBtn = e.target.closest('.lang-btn');
        if (langBtn) {
            const lang = langBtn.getAttribute('data-lang');
            if (lang && lang !== currentLang) {
                setLanguage(lang);
            }
        }
    }

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function handleNavbarToggle() {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');

        document.body.style.overflow = navbarMenu.classList.contains('active')
            ? 'hidden'
            : 'auto';
    }

    function closeNavbarMenu() {
        if (navbarMenu.classList.contains('active')) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    function handleNavLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');

        if (href && href.startsWith('#')) {
            e.preventDefault();
            closeNavbarMenu();

            const targetElement = document.querySelector(href);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function handleScrollAnimations() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const triggerPosition = windowHeight * 0.85;

            if (elementTop < triggerPosition) {
                element.classList.add('visible');
            }
        });
    }

    function initAnimationsOnLoad() {
        setTimeout(() => {
            handleScrollAnimations();
        }, 100);
    }

    function handleSmoothScroll(e) {
        const target = e.target;
        if (target.tagName === 'A' && target.getAttribute('href').startsWith('#')) {
            const href = target.getAttribute('href');
            const targetElement = document.querySelector(href);

            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    function handleButtonClick(e) {
        const button = e.target.closest('.btn');
        if (button) {
            button.style.transform = 'scale(0.98)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    }

    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        updateActiveNavLink();
        handleScrollAnimations();
    });

    navbarToggle.addEventListener('click', handleNavbarToggle);

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });

    languageSwitcher.addEventListener('click', handleLanguageSwitch);

    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navbarMenu.classList.contains('active')) {
            closeNavbarMenu();
        }
    });

    document.addEventListener('click', handleSmoothScroll);
    document.addEventListener('click', handleButtonClick);

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNavbarMenu();
        }
    });

    setLanguage(currentLang);
    handleNavbarScroll();
    updateActiveNavLink();
    initAnimationsOnLoad();
});
