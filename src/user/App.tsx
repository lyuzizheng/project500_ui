import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoThin from "../assets/logo/500logo1.png";
import logoThick from "../assets/logo/500logo2.png";
import logoDiff from "../assets/logo/500logo3.png";
import logoEmpty from "../assets/logo/500logo4.png";
import "./App.css";
import UserScoreChart from "./UserScoreChart";
import "./UserScoreChart.css";
import DistributionVisualization from "./components/DistributionVisualization";
import { useUserData } from "./hooks/useUserData";
import {
  UserDataService,
  type QuestionsDistribution,
} from "./services/UserDataService";

function App() {
  const { userId, apiKey } = useParams<{ userId?: string; apiKey?: string }>();
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 使用新的hook获取用户数据
  const { userScore, loading, error, refetch } = useUserData(userId, apiKey);

  // 分布数据状态管理
  const [distributionData, setDistributionData] =
    useState<QuestionsDistribution | null>(null);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const [distributionError, setDistributionError] = useState<string | null>(
    null
  );

  // 检测是否为移动端
  const [isMobile, setIsMobile] = useState(false);

  // 获取分布数据的函数
  const fetchDistributionData = async () => {
    if (!isMobile) return; // 只在移动端获取数据

    setDistributionLoading(true);
    setDistributionError(null);
    try {
      const data = await UserDataService.getQuestionsDistribution(
        apiKey,
        userId
      );
      setDistributionData(data);
    } catch (err) {
      setDistributionError(
        err instanceof Error ? err.message : "获取分布数据失败"
      );
    } finally {
      setDistributionLoading(false);
    }
  };

  // 重试获取分布数据
  const refetchDistribution = () => {
    fetchDistributionData();
  };

  // 检测设备类型
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // 获取分布数据
  useEffect(() => {
    if (isMobile && apiKey) {
      fetchDistributionData();
    }
  }, [isMobile, apiKey, userId]);

  // 保存当前用户路由到localStorage
  useEffect(() => {
    if (userId && apiKey) {
      const currentRoute = `/${userId}/${apiKey}`;
      localStorage.setItem("userRoute", currentRoute);
    }
  }, [userId, apiKey]);

  // 防止用户修改URL中的userId
  useEffect(() => {
    if (userId && !userId.match(/^L\d{4}$/)) {
      // 如果userId格式不正确，重定向到首页
      window.location.href = "/";
    }
  }, [userId]);

  // 使用useMemo缓存logos数组，避免重复创建
  const logos = useMemo(() => [logoThin, logoThick, logoDiff, logoEmpty], []);

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

  // 加载Commento评论系统
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://commento.brabalawuka.cc/js/commento.js";
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // 清理脚本
      const existingScript = document.querySelector(
        'script[src="https://commento.brabalawuka.cc/js/commento.js"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
        const parallaxSpeed = scrollTop * 0.03; // 0.1倍的速度
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

      {/* 第二个界面 - 答题结果 */}
      <section id="section-1" className="section second-section">
        <div className="second-content">
          {/* 用户坐标轴图表 */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">正在获取您的重庆人身份数据...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-message">
                <h3>获取数据失败</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={refetch}>
                  重试
                </button>
              </div>
            </div>
          ) : userScore ? (
            <UserScoreChart userScore={userScore} />
          ) : (
            <div className="no-data-container">
              <p>暂无数据</p>
            </div>
          )}
        </div>
      </section>

      {/* 第三个界面 - 看看大家 */}
      <section id="section-2" className="section distribution-section">
        <div className="distribution-content">
          {distributionLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">正在获取大家的答题数据...</p>
            </div>
          ) : distributionError ? (
            <div className="error-container">
              <div className="error-message">
                <h3>获取分布数据失败</h3>
                <p>{distributionError}</p>
                <button className="retry-btn" onClick={refetchDistribution}>
                  重试
                </button>
              </div>
            </div>
          ) : distributionData ? (
            <>
              <DistributionVisualization distributionData={distributionData} />
            </>
          ) : (
            <div className="no-data-container">
              <p>暂无分布数据</p>
            </div>
          )}
          <div className="action-buttons">
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
        </div>
      </section>

      {/* 第四个界面 - 留言板 */}
      <section id="section-3" className="section comment-section">
        <div className="comment-content">
          <div className="comment-section-simple">
            <h2 className="comment-title">匿名留言板</h2>
            <div id="commento"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
