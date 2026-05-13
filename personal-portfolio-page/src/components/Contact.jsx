import { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: FaEnvelope, label: '邮箱', value: 'hello@example.com' },
    { icon: FaPhone, label: '电话', value: '+86 123 4567 8900' },
    { icon: FaMapMarkerAlt, label: '地址', value: '中国 · 北京' },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
        <div
          ref={ref}
          className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">联系我</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              有项目合作或工作机会？随时欢迎与我联系！
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-white">联系方式</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-4"
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'all 0.5s ease-out',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{info.label}</h4>
                      <p className="text-gray-400">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-dark-light rounded-2xl">
                <h4 className="text-lg font-semibold text-white mb-4">让我们一起创造精彩</h4>
                <p className="text-gray-400">
                  无论您有什么想法或项目需求，我都很乐意与您交流。
                  让我们一起将您的想法变为现实！
                </p>
              </div>
            </div>

            <div className="bg-dark-light rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-semibold mb-6 text-white">发送消息</h3>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4">
                    <FaPaperPlane className="text-white text-2xl" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">消息已发送！</h4>
                  <p className="text-gray-400">感谢您的联系，我会尽快回复您。</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">姓名</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                        placeholder="您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">邮箱</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                        placeholder="您的邮箱"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">主题</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                      placeholder="消息主题"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">消息内容</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-xl text-white focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="请输入您的消息..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-bg py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        发送中...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        发送消息
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
