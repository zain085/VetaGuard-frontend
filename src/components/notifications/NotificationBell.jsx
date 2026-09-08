import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { notificationService } from "../../services/care.service";
import { useAuth } from "../../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = () => {
    if (!user) return;
    notificationService
      .list()
      .then(({ data }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // light polling, not push
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) load();
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  };

  const markOne = async (notification) => {
    if (notification.isRead) return;
    try {
      await notificationService.markRead(notification._id);
      setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-primary"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-surface shadow-lg theme-transition">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-sm font-semibold text-text">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-muted">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => markOne(n)}
                  className={`block w-full border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-bg ${!n.isRead ? "bg-primary/5" : ""}`}
                >
                  <p className="text-sm font-medium text-text">{n.title}</p>
                  {n.message && <p className="mt-0.5 text-xs text-text-muted">{n.message}</p>}
                  <p className="mt-1 text-[10px] text-text-muted">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
