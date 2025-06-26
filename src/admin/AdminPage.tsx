import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AdminPage.css';

interface FormData {
  name: string;
}

function AdminPage() {
  const { userId } = useParams<{ userId: string }>();
  const [formData, setFormData] = useState<FormData>({
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 模拟API调用
      // 实际使用时替换为真实的API端点
      const response = await fetch(`/api/admin/submit/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData
        }),
      });

      if (response.status === 200) {
        setSubmitStatus('success');
        // 清空表单
        setFormData({ name: '' });
      } else {
        setSubmitStatus('error');
        alert('提交失败，请重试');
      }
    } catch (error) {
      console.error('提交出错:', error);
      setSubmitStatus('error');
      alert('提交出错，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>管理员后台</h1>
        <p>用户ID: {userId}</p>
      </div>

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="请输入姓名"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '提交'}
          </button>

          {submitStatus === 'success' && (
            <div className="success-message">提交成功！</div>
          )}
          {submitStatus === 'error' && (
            <div className="error-message">提交失败，请重试！</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminPage;