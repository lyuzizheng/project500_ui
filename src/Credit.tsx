import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Credit.css";

function Credit() {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const creditContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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

  // Logo轮播效果
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setIsLogoVisible(false);
      setTimeout(() => {
        setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
        setIsLogoVisible(true);
      }, 500);
    }, 4000); // 稍微慢一点的轮播

    return () => clearInterval(logoInterval);
  }, []);

  // 视差滚动效果
  useEffect(() => {
    const container = creditContainerRef.current;
    const handleScroll = () => {
      const backgroundContainer = document.querySelector(
        ".credit-background-container"
      );

      if (backgroundContainer && container) {
        const scrollTop = container.scrollTop;
        const parallaxSpeed = scrollTop * 0.05; // 更慢的视差效果
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

  const scrollToTop = () => {
    const container = creditContainerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToNextSection = (currentIndex: number) => {
    const container = creditContainerRef.current;
    const nextIndex = currentIndex + 1;

    if (container && sectionRefs.current[nextIndex]) {
      const nextSection = sectionRefs.current[nextIndex];
      const containerRect = container.getBoundingClientRect();
      const sectionRect = nextSection!.getBoundingClientRect();
      const scrollTop =
        container.scrollTop + sectionRect.top - containerRect.top;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="credit-container" ref={creditContainerRef}>
      {/* 背景图片容器 */}
      <div className="credit-background-container"></div>

      {/* 主标题区域 */}
      <section
        className="credit-section credit-header-section"
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(0)}>
          <div className="credit-logo-container">
            <img
              src={logos[currentLogoIndex]}
              alt="500剧场"
              className={`credit-logo ${
                isLogoVisible ? "logo-visible" : "logo-hidden"
              }`}
            />
          </div>
          <h1 className="credit-main-title">伍零零剧场</h1>
          <h2 className="credit-subtitle">制作团队</h2>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 核心团队 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(1)}>
          <div className="credit-group">
            <h3 className="credit-group-title">核心创作团队</h3>
            <div className="credit-text-block">
              <p className="credit-line">
                Eelly 发起，「伍零零」创作小组共创项目
              </p>
              <br />
              <p className="credit-line">
                <span className="credit-role">制作人</span> 冯小楼 Eelly
              </p>
              <p className="credit-line">
                <span className="credit-role">导演</span> Eelly
              </p>
              <p className="credit-line">
                <span className="credit-role">文本共创</span> 廖茁雅（鸭鸭）
                桉琦 桂菘 Eelly
              </p>
              <p className="credit-line">
                <span className="credit-role">戏剧构作</span> 廖茁雅（鸭鸭）
                桉琦 桂菘
              </p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 演员团队 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(2)}>
          <div className="credit-group">
            <h3 className="credit-group-title">演员阵容</h3>
            <div className="credit-text-block">
              <p className="credit-line">刘桂菘 周语桐 张佳玮 崔哲灵 蔡佳圻</p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 制作团队 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(3)}>
          <div className="credit-group">
            <h3 className="credit-group-title">制作团队</h3>
            <div className="credit-text-block">
              <p className="credit-line">
                <span className="credit-role">制作舞台监督</span> 桂菘
              </p>
              <p className="credit-line">
                <span className="credit-role">执行舞台监督</span> 小白
              </p>
              <p className="credit-line">
                <span className="credit-role">宣传</span> 桉琦 廖茁雅（鸭鸭）
                Konni
              </p>
              <p className="credit-line">
                <span className="credit-role">前期工作坊带领</span> 桉琦
              </p>
              <br />
              <p className="credit-line">
                <span className="credit-role">技术开发</span> 子正 Asuka
              </p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 视觉设计 & 音乐制作 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(4)}>
          <div className="credit-group">
            <h3 className="credit-group-title">视觉设计 & 音乐制作</h3>
            <div className="credit-text-block">
              <p className="credit-line">
                <span className="credit-role">视觉总监</span> Konni
              </p>
              <p className="credit-line">
                <span className="credit-role">logo & VI</span> Konni
              </p>
              <p className="credit-line">
                <span className="credit-role">舞美 & 道具</span> Konni
              </p>
              <br />
              <p className="credit-line">
                <span className="credit-role">音乐总监</span> Miyo
              </p>
              <p className="credit-line">
                <span className="credit-role">声音剧本设计</span> Miyo
              </p>
              <p className="credit-line">
                <span className="credit-role">录音</span> Miyo
              </p>
              <p className="credit-line">
                <span className="credit-role">后期制作</span> Miyo
              </p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 其他制作 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(5)}>
          <div className="credit-group">
            <h3 className="credit-group-title">其他制作</h3>
            <div className="credit-text-block">
              <p className="credit-line">
                <span className="credit-role">影像制作</span> 廖茁雅（鸭鸭）
                Eelly
              </p>
              <p className="credit-line">
                <span className="credit-role">现场执行</span> 宁晓葳
              </p>
              <br />
              <p className="credit-line">
                <span className="credit-role">出品</span> actoria
              </p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 支持机构 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[6] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(6)}>
          <div className="credit-group">
            <h3 className="credit-group-title">演出场地支持</h3>
            <div className="credit-text-block">
              <p className="credit-line">在场空间</p>
            </div>
          </div>

          <div className="credit-group">
            <h3 className="credit-group-title">宣发支持</h3>
            <div className="credit-text-block">
              <p className="credit-line">云马·学艺堂</p>
              <p className="credit-line">翔级社</p>
              <p className="credit-line">有空客厅</p>
              <p className="credit-line">即刻艺术工作室</p>
              <p className="credit-line">戏行者戏剧工坊</p>
              <p className="credit-line">怪兽部落</p>
            </div>
          </div>

          <div className="credit-group">
            <h3 className="credit-group-title">前期工作坊场地提供方</h3>
            <div className="credit-text-block">
              <p className="credit-line">致心有光共益客厅</p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 公共讨论参与者 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[7] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(7)}>
          <div className="credit-group">
            <h3 className="credit-group-title">公共讨论参与者</h3>
            <p className="credit-subtitle-small">
              访谈对象、工作坊参与者、前期问卷调研参与者
            </p>
            <p className="credit-subtitle-small">（以下排序完全随机）</p>
            <div className="credit-participants">
              <p className="credit-participant-line">
                金玉 yipei 马静 yanyan 王绮 向彤 张舒涵 二马 井 苦抹 朴生 石头
                宇文树学 兔兔 鸡 小金 Miyo 小白 senmu 春儿 炸鱼 小楼 邓立可
                大非哥 某姐或某老师 老师 M 某先生 老师 Jane 桃哥 艾登 刘老师
                西瓜 j 栀 周可安 Konni 李要爽 杜光源 h 李 刁先生 ayiii 烨烨 黄总
                成奕竹 任思涵 太祖虾 yang 某女士 小白 寅子 栗子 orange juice
                老陈 zc 羊老师 Diana 付 桉琦 海儿 赵开放 一个好人 Frau Haribo
                GXR 莉莉 Uga 小王 ry 波 B 速速 rainbow 侠客 Gerry 暗黑库洛洛
                lulu 袁先芬 廖传高 yitrans 小崴 知知 鸡毛 kiwi 过儿 Joey
                玫瑰小狗 Kai 老周 zy 轶琨 王 小陆 晓宇 阳女士 Brabalawuka 国王👸
                铁牛 Raven 橘子 SEAN 派派 33 思佳 yue 搞笑男 李丹 aduan 阿毛
                逐夏 鲜花饼 二娃 510 娃娃鱼 HJj 你老汉 e 凡人 豆包 CQUer 雪粉华
                Pat 张先生 Mads 霜儿 小巫 徐徐 光英 阿杰
              </p>
            </div>
            <p className="credit-thanks">谢谢你们对公共讨论的热情！</p>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 特别鸣谢 */}
      <section
        className="credit-section"
        ref={(el) => {
          sectionRefs.current[8] = el;
        }}
      >
        <div className="credit-content" onClick={() => scrollToNextSection(8)}>
          <div className="credit-group">
            <h3 className="credit-group-title">特别鸣谢</h3>
            <div className="credit-text-block">
              <p className="credit-line">李英男</p>
              <p className="credit-line">王子滔</p>
              <p className="credit-line">白老师</p>
              <br />
              <p className="credit-line">谢谢文本中的原型人物</p>
              <p className="credit-line">鸭鸭他们同学</p>
              <p className="credit-line">鸭鸭表妹</p>
              <p className="credit-line">山东青岛朋友</p>
            </div>
          </div>
          <div className="credit-next-arrow"></div>
        </div>
      </section>

      {/* 结尾致谢 */}
      <section
        className="credit-section credit-final-section"
        ref={(el) => {
          sectionRefs.current[9] = el;
        }}
      >
        <div className="credit-content">
          <div className="credit-final-thanks">
            <h2 className="credit-final-title">
              以及所有关心和支持我们的亲朋好友们！
            </h2>
            <div className="credit-logo-container">
              <img
                src={logos[currentLogoIndex]}
                alt="500剧场"
                className={`credit-logo-small ${
                  isLogoVisible ? "logo-visible" : "logo-hidden"
                }`}
              />
            </div>
            <div className="credit-button-group">
              <button className="credit-back-to-top-btn" onClick={scrollToTop}>
                返回顶部
              </button>
              <button className="credit-home-btn" onClick={() => navigate("/")}>
                返回主页
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Credit;
