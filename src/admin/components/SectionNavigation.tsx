import type { SectionInfo } from "../types/Question";
import "./components.css";

interface SectionNavigationProps {
  sections: SectionInfo[];
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
}

function SectionNavigation({
  sections,
  currentSection,
  onSectionChange,
}: SectionNavigationProps) {
  return (
    <div className="section-navigation">
      <h3>问卷部分导航</h3>
      <div className="nav-sections">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`nav-section-btn ${
              currentSection === section.id ? "active" : ""
            } ${section.completed ? "completed" : ""}`}
          >
            <div className="section-title">{section.title}</div>
            <div className="section-info">
              <span className="question-count">{section.questionCount}题</span>
              {section.completed && <span className="completed-icon">✓</span>}
            </div>
            <div className="section-description">{section.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SectionNavigation;
