import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  BarChart3, 
  BookOpen, 
  CreditCard, 
  Lock,
  Settings,
  HelpCircle
} from 'lucide-react';
import { authService } from '../services/api';
import './Sidebar.css';

interface SidebarProps {
  role: 'Super Admin' | 'Client' | 'TeamMember';
  userName: string;
  userProfileImage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userName }) => {
  const isSuperAdmin = role === 'Super Admin';

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  const closeSidebar = () => {
    const checkbox = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/logo.jpg" alt="Yourstechhub" className="brand-logo-img" />
      </div>

      <div className="sidebar-heading">MAIN MENU</div>
      <nav>
        {isSuperAdmin ? (
          <>
            <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/onboarding" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <UserPlus size={18} />
              New AI Agent
            </NavLink>
            <NavLink to="/clients" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              CRM & Clients
            </NavLink>

            <NavLink to="/billing" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              Analytics & Billing
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            {role !== 'TeamMember' && (
              <>
                <NavLink to="/knowledge-base" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <BookOpen size={18} />
                  Knowledge Base
                </NavLink>
              </>
            )}
            <NavLink to="/leads" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              Leads Center
            </NavLink>

            {role !== 'TeamMember' && (
              <>

                <NavLink to="/billing" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <CreditCard size={18} />
                  Billing & Plan
                </NavLink>
              </>
            )}


          </>
        )}
      </nav>



      <div className="sidebar-heading" style={{ marginTop: '1.5rem' }}>SETTINGS</div>
      <nav>
        {isSuperAdmin ? (
          <NavLink to="/security" onClick={closeSidebar} className="nav-link">
            <Lock size={18} />
            Security
          </NavLink>
        ) : (
          <>
            <NavLink to="/profile" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Lock size={18} />
              Profile & Security
            </NavLink>
            {role !== 'TeamMember' && (
              <>
                <NavLink to="/settings" onClick={closeSidebar} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Settings size={18} />
                  Agent Config
                </NavLink>
                <NavLink to="/support" onClick={closeSidebar} className="nav-link">
                  <HelpCircle size={18} />
                  Support Docs
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>

      <div className="user-profile-widget" style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={handleLogout} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', width: '100%', padding: '0.75rem', gap: '0.75rem', color: '#475569', fontWeight: 500, transition: 'all 0.2s', borderRadius: '12px' }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
            {userName ? userName.charAt(0).toUpperCase() : 'N'}
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
