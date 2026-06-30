import React, { useEffect, useState } from 'react';
import { Users, UserPlus, MessageSquare, CreditCard, ArrowUpRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { adminService, leadsService } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const mockChartData = [
  { name: 'Mon', leads: 40 },
  { name: 'Tue', leads: 30 },
  { name: 'Wed', leads: 20 },
  { name: 'Thu', leads: 27 },
  { name: 'Fri', leads: 18 },
  { name: 'Sat', leads: 23 },
  { name: 'Sun', leads: 34 },
];

const mockRecentActivity = [
  { id: 1, type: 'client', message: 'New client "Acme Corp" registered', time: '2 mins ago', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
  { id: 2, type: 'whatsapp', message: 'WhatsApp instance disconnected for "TechSolutions"', time: '1 hour ago', icon: Zap, color: '#ef4444', bg: '#fef2f2' },
  { id: 3, type: 'billing', message: 'Subscription renewed for "GlobalReach"', time: '3 hours ago', icon: CheckCircle2, color: '#10b981', bg: '#ecfdf5' },
  { id: 4, type: 'system', message: 'System automated backup completed successfully', time: '5 hours ago', icon: Activity, color: '#8b5cf6', bg: '#f3e8ff' },
];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, allLeads] = await Promise.all([
          adminService.getDashboardData(),
          leadsService.getAllLeads().catch(() => [])
        ]);
        setData({ ...dashboardData, leads: allLeads });
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  
  if (!data) return (
    <div className="error-container">
      <div className="error-box">
        <h2>Connection Error</h2>
        <p>The frontend cannot connect to the backend API.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-1">Retry Connection</button>
      </div>
    </div>
  );

  const stats = data.stats || { totalClients: 0, activeAgents: 0, totalAgents: 0, estimatedRevenue: 0 };

  return (
    <div className="dashboard-page">
      <div className="stat-cards-grid">
        <div className="stat-card blue">
          <div className="stat-header">
            <h3 className="stat-title">Total Clients</h3>
            <Users size={14} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.totalClients}</p>
          <div className="stat-change positive">
            <ArrowUpRight size={12} />
            12.5% <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-header">
            <h3 className="stat-title">Active Agents</h3>
            <UserPlus size={14} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.activeAgents}</p>
          <div className="stat-change positive">
            <ArrowUpRight size={12} />
            8.2% <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-header">
            <h3 className="stat-title">Total Agents</h3>
            <MessageSquare size={14} className="stat-icon" />
          </div>
          <p className="stat-value">{stats.totalAgents}</p>
          <div className="stat-change positive">
            <ArrowUpRight size={12} />
            24.1% <span>vs last month</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-header">
            <h3 className="stat-title">Revenue</h3>
            <CreditCard size={14} className="stat-icon" />
          </div>
          <p className="stat-value">Rs {stats.estimatedRevenue.toLocaleString()}</p>
          <div className="stat-change positive">
            <ArrowUpRight size={12} />
            15.2% <span>vs last month</span>
          </div>
        </div>
      </div>

      <div className="main-wrapper">
        <div className="white-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="box-title" style={{ margin: 0, color: '#0a1142' }}>Lead Generation Overview</h3>
              <p className="box-subtitle" style={{ margin: 0 }}>Number of leads captured via WhatsApp AI across all clients.</p>
            </div>
            <select style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', borderRadius: '8px', padding: '0.5rem', outline: 'none' }}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d51381" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d51381" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0a1142', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#d51381" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="white-box" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="box-title" style={{ margin: 0, color: '#0a1142' }}>Recent Activity</h3>
          <p className="box-subtitle" style={{ marginBottom: '1.5rem' }}>Latest events across your tenant network.</p>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {mockRecentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', position: 'relative' }}>
                  {index !== mockRecentActivity.length - 1 && (
                    <div style={{ position: 'absolute', top: '2.5rem', left: '1.1rem', width: '2px', height: '2.5rem', background: '#f1f5f9', zIndex: 0 }}></div>
                  )}
                  
                  <div style={{ padding: '0.65rem', borderRadius: '50%', flexShrink: 0, background: activity.bg, color: activity.color, zIndex: 10 }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#1e293b', lineHeight: 1.2 }}>{activity.message}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.65rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'transparent', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
