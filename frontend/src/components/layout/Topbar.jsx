import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

export default function Topbar() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');

  const loadNotifications = () => {
    notificationService.getAll(false) // load all notifications
      .then((res) => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.isRead).length);
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  };

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 30 seconds to keep count fresh
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      loadNotifications();
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    notificationService.markAllRead()
      .then(() => loadNotifications())
      .catch((err) => console.error('Error marking all as read:', err));
  };

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    notificationService.markRead(id)
      .then(() => loadNotifications())
      .catch((err) => console.error('Error marking notification as read:', err));
  };

  const handleLangChange = (e) => {
    const val = e.target.value;
    localStorage.setItem('cwtms_lang', val);
    setLang(val);
    window.dispatchEvent(new Event('cwtms_lang_change'));
  };

  return (
    <div className="cwtms-topbar">
      <div className="fw-semibold">Campus Workforce Task Management System</div>
      <div className="d-flex align-items-center gap-3">
        {user?.role === 'WORKER' && (
          <div className="d-flex align-items-center gap-1 me-1">
            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Language:</span>
            <select 
              className="form-select form-select-sm" 
              value={lang} 
              onChange={handleLangChange}
              style={{ width: '110px', fontSize: '0.75rem', padding: '0.2rem 0.4rem', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="ml">Malayalam (മലയാളം)</option>
            </select>
          </div>
        )}
        <div className="position-relative">
          <button 
            className="btn p-0 border-0 position-relative text-dark" 
            onClick={toggleDropdown} 
            style={{ background: 'transparent', outline: 'none' }}
          >
            <FaBell size={20} />
            {unreadCount > 0 && (
              <span className="badge bg-danger rounded-pill position-absolute"
                    style={{ top: -6, right: -8, fontSize: '0.65rem', padding: '0.25em 0.45em' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="dropdown-menu show dropdown-menu-end p-2 shadow-sm border" 
                 style={{ 
                   position: 'absolute', 
                   right: 0, 
                   top: '100%', 
                   width: '320px', 
                   maxHeight: '350px', 
                   overflowY: 'auto',
                   zIndex: 1000,
                   display: 'block',
                   marginTop: '10px'
                 }}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <span className="fw-semibold small">Notifications</span>
                {unreadCount > 0 && (
                  <button className="btn btn-sm btn-link p-0 text-decoration-none small text-primary fw-semibold" 
                          style={{ fontSize: '0.75rem' }}
                          onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center text-muted py-3 small">No notifications.</div>
              ) : (
                <div className="list-group list-group-flush" style={{ maxHeight: '270px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div key={n.id} 
                         className={`list-group-item list-group-item-action p-2 border-0 rounded mb-1 small d-flex justify-content-between align-items-center gap-2 ${!n.isRead ? 'bg-light fw-medium' : 'text-muted'}`}
                         style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                         onClick={(e) => handleMarkRead(n.id, e)}>
                      <div className="text-wrap">{n.message}</div>
                      {!n.isRead && (
                        <span className="badge bg-primary rounded-circle p-1" style={{ width: 6, height: 6, flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="fw-semibold text-end" style={{ lineHeight: '1.2' }}>{user?.fullName}</div>
          <div className="text-muted small text-end" style={{ fontSize: '0.75rem' }}>{user?.role}</div>
        </div>
      </div>
    </div>
  );
}
