import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 使用useMemo缓存logos数组，避免重复创建
  const logos = useMemo(
    () => [
      "/logo/500logo_thin.png",
      "/logo/500logo_thick.png",
      "/logo/500logo_diff.png",
      "/logo/500logo_empty.png",
    ],
    []
  );

  // 预加载所有logo图片，确保缓存到浏览器中
  useEffect(() => {
    logos.forEach((logoSrc) => {
      const img = new Image();
      img.src = logoSrc;
    });
  }, [logos]);

  const scrollToNext = () => {
    // 直接滚动到目标section
    const targetSection = document.getElementById("section-1");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 移除logos.length依赖，避免不必要的重新渲染和图片重新请求
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setIsLogoVisible(false);
      setTimeout(() => {
        setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
        setIsLogoVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(logoInterval);
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const scrollToTop = () => {
    const container = appContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // 添加滚动监听器来同步状态和视差效果
  useEffect(() => {
    const container = appContainerRef.current;
    const handleScroll = () => {
      const backgroundContainer = document.querySelector(
        ".background-container"
      );

      // 视差滚动效果：背景滚动速度为前景的0.3倍
      if (backgroundContainer && container) {
        const scrollTop = container.scrollTop;
        const parallaxSpeed = scrollTop * 0.1; // 0.1倍的速度
        (
          backgroundContainer as HTMLElement
        ).style.backgroundPositionY = `-${parallaxSpeed}px`;
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div className="app-container" ref={appContainerRef}>
      {/* 背景图片容器 */}
      <div className="background-container"></div>

      {/* 主界面 */}
      <section id="section-0" className="section main-section">
        <div className="main-content">
          <div className="logo-container">
            <img
              src={logos[currentLogoIndex]}
              alt="500剧场"
              className={`main-logo ${
                isLogoVisible ? "logo-visible" : "logo-hidden"
              }`}
            />
          </div>

          <div className="welcome-text">
            <h1 className="welcome-title">感谢您体验伍零零剧场</h1>
            <p className="welcome-subtitle">准备好迎接您的重庆人身份了吗？</p>
          </div>

          <div className="scroll-indicator" onClick={scrollToNext}>
            <div className="arrow-container">
              <div className="arrow arrow-1">▼</div>
              <div className="arrow arrow-2">▼</div>
              <div className="arrow arrow-3">▼</div>
            </div>
            <p className="scroll-text">点击向下滚动</p>
          </div>
        </div>
      </section>

      {/* 第二个界面 */}
      <section id="section-1" className="section second-section">
        <div className="second-content">
          <h2 className="text-white text-2xl">评分界面</h2>
          <p className="text-gray-300">内容待定...</p>
          <button className="back-to-top-btn" onClick={scrollToTop}>
            返回顶部
          </button>
          <button
            className="credit-nav-btn"
            onClick={() => navigate("/credit")}
          >
            制作团队
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
