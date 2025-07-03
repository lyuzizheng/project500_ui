import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./HomePage.css";
import logoThin from "./assets/logo/500logo1.png";
import logoThick from "./assets/logo/500logo2.png";
import logoDiff from "./assets/logo/500logo3.png";
import logoEmpty from "./assets/logo/500logo4.png";

function HomePage() {
  const { userId } = useParams<{ userId?: string; apiKey?: string }>();
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);

  // 使用useMemo缓存logos数组，避免重复创建
  const logos = useMemo(() => [logoThin, logoThick, logoDiff, logoEmpty], []);

  // 预加载所有logo图片，确保缓存到浏览器中
  useEffect(() => {
    logos.forEach((logoSrc) => {
      const img = new Image();
      img.src = logoSrc;
    });
  }, [logos]);

  // 清除保存的用户路由，确保从主页进入时显示正确的导航
  useEffect(() => {
    localStorage.removeItem('userRoute');
  }, []);

  // 防止用户修改URL中的userId
  useEffect(() => {
    if (userId && !userId.match(/^L\d{4}$/)) {
      // 如果userId格式不正确，重定向到首页
      window.location.href = "/";
    }
  }, [userId]);

  // logo轮播效果
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setIsLogoVisible(false);
      setTimeout(() => {
        setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
        setIsLogoVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(logoInterval);
  }, []);

  return (
    <div className="home-container">
      {/* 背景图片容器 */}
      <div className="background-container"></div>

      {/* 主界面 - 只有logo，不可滚动 */}
      <div className="home-content">
        <div className="logo-container">
          <img
            src={logos[currentLogoIndex]}
            alt="500剧场"
            className={`main-logo ${
              isLogoVisible ? "logo-visible" : "logo-hidden"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
