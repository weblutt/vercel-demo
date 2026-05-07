'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  age: number;
  major: string;
  created_at: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    major: ''
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database?action=select');
      const data = await response.json();
      setStudents(data.data || []);
    } catch (error) {
      setMessage('获取数据失败，请先创建表');
    }
    setLoading(false);
  };

  const createTable = async () => {
    try {
      const response = await fetch('/api/database?action=create-table');
      const data = await response.json();
      setMessage(data.message);
      setTimeout(fetchStudents, 500);
    } catch (error) {
      setMessage('创建表失败');
    }
  };

  const insertStudent = async () => {
    if (!formData.name) {
      setMessage('请输入姓名');
      return;
    }
    try {
      const response = await fetch(
        `/api/database?action=insert&name=${encodeURIComponent(formData.name)}&age=${formData.age || 18}&major=${encodeURIComponent(formData.major || '未选择专业')}`
      );
      const data = await response.json();
      setMessage(data.message);
      setFormData({ name: '', age: '', major: '' });
      setTimeout(fetchStudents, 500);
    } catch (error) {
      setMessage('插入数据失败');
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const response = await fetch(`/api/database?action=delete&id=${id}`);
      const data = await response.json();
      setMessage(data.message);
      setTimeout(fetchStudents, 500);
    } catch (error) {
      setMessage('删除失败');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎓 学生信息管理系统
          </h1>
          <p className="text-gray-600">
            使用 Next.js 14 + Vercel Postgres 构建的全栈应用
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={createTable}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            📝 创建数据表
          </button>
          
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3 text-gray-700">添加新学生</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="年龄"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="专业"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={insertStudent}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">学生列表</h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">加载中...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p>暂无数据，请先创建数据表并添加学生</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年龄</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">专业</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.major}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.created_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>部署提示：将此项目推送到 GitHub，然后在 Vercel 中连接你的数据库</p>
        </div>
      </div>
    </div>
  );
}
