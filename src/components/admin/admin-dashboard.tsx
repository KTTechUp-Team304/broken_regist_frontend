'use client';

import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react';
import styles from './admin-dashboard.module.css';

const enrollmentData = [
  { month: '1월', count: 45 },
  { month: '2월', count: 52 },
  { month: '3월', count: 78 },
  { month: '4월', count: 95 },
  { month: '5월', count: 68 },
];

const courseData = [
  { name: '컴퓨터공학', value: 35 },
  { name: '보안', value: 25 },
  { name: '인공지능', value: 20 },
  { name: '데이터분석', value: 15 },
  { name: '기타', value: 5 },
];

const dailyActiveUsers = [
  { day: '월', users: 120 },
  { day: '화', users: 145 },
  { day: '수', users: 132 },
  { day: '목', users: 158 },
  { day: '금', users: 142 },
  { day: '토', users: 85 },
  { day: '일', users: 65 },
];

const COLORS = ['#c62917', '#e74c3c', '#f39c12', '#3498db', '#95a5a6'];

export function AdminDashboard() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>관리자 대시보드</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>전체 사용자</span>
            <span className={styles.statValue}>1,234</span>
            <span className={styles.statChange}>+12% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>개설 강의</span>
            <span className={styles.statValue}>87</span>
            <span className={styles.statChange}>+5 new courses</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>총 수강신청</span>
            <span className={styles.statValue}>3,456</span>
            <span className={styles.statChange}>+8% this week</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Activity size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>활성 사용자</span>
            <span className={styles.statValue}>892</span>
            <span className={styles.statChange}>Last 7 days</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <Link href="/admin/courses" className={styles.actionCard}>
          <BookOpen size={32} />
          <h3>강의 관리</h3>
          <p>강의 생성, 수정 및 삭제</p>
        </Link>
        <Link href="/admin/users" className={styles.actionCard}>
          <Users size={32} />
          <h3>사용자 관리</h3>
          <p>사용자 권한 및 상태 관리</p>
        </Link>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>월별 수강신청 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '3px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#c62917" strokeWidth={2} name="수강신청 수" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>분야별 강의 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {courseData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '3px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>주간 활성 사용자</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActiveUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '3px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="users" fill="#c62917" name="활성 사용자" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
