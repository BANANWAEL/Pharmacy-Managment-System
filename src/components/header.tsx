"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Bell, Menu, User, X, Package, ShoppingCart, AlertTriangle, PackageX } from "lucide-react";
import { getMyProfile } from "@/services/authService";
import api from "@/lib/api";

interface HeaderProps {
  title?:       string;
  onMenuClick?: () => void;
}

interface Notification {
  id:      string;
  type:    "order" | "low" | "out";
  title:   string;
  message: string;
  time:    string;
  read:    boolean;
}

interface SearchResult {
  type:    "medicine" | "order" | "client";
  title:   string;
  subtitle: string;
  route:   string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router   = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted]             = useState(false);
  const [date, setDate]                   = useState("");
  const [userName, setUserName]           = useState("Loading...");

  // notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notiLoading, setNotiLoading]     = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // search
  const [searchTerm, setSearchTerm]       = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [allData, setAllData]             = useState<{
    medicines: any[];
    orders:    any[];
    clients:   any[];
  }>({ medicines: [], orders: [], clients: [] });
  const [showResults, setShowResults]     = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ===== CLOSE ON OUTSIDE CLICK =====
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMounted(true);
    setDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }));

    const init = async () => {
      try {
        // profile
        const profile = await getMyProfile();
        setUserName(profile.employee_Name ?? "User");

        // prefetch all data for search
        const [medRes, orderRes, clientRes] = await Promise.all([
          api.get("/Medicines"),
          api.get("/Orders"),
          api.get("/Clients"),
        ]);
        setAllData({
          medicines: medRes.data    ?? [],
          orders:    orderRes.data  ?? [],
          clients:   clientRes.data ?? [],
        });
      } catch (err) {
        console.error("Header init error:", err);
      }
    };
    init();
  }, []);

  // ===== FETCH NOTIFICATIONS =====
  const fetchNotifications = async () => {
    setNotiLoading(true);
    try {
      const [alertRes, orderRes] = await Promise.all([
        api.get("/InventoryAlerts/status"),
        api.get("/Orders"),
      ]);

      const alerts = alertRes.data;
      const orders = orderRes.data;
      const notifs: Notification[] = [];

      // last 3 orders
      orders.slice(-3).reverse().forEach((o: any) => {
        notifs.push({
          id:      `order-${o.orderId}`,
          type:    "order",
          title:   "New Order",
          message: `Order #${o.orderId} from ${o.clientName ?? "Unknown"}`,
          time:    o.orderDate
            ? new Date(o.orderDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
            : "Recent",
          read: false,
        });
      });

      // out of stock
      (alerts.outOfStock ?? []).forEach((m: any) => {
        notifs.push({
          id:      `out-${m.medicine_ID}`,
          type:    "out",
          title:   "Out of Stock",
          message: `${m.medicine_Name} is out of stock`,
          time:    "Now",
          read:    false,
        });
      });

      // low stock
      (alerts.lowStock ?? []).slice(0, 3).forEach((m: any) => {
        notifs.push({
          id:      `low-${m.medicine_ID}`,
          type:    "low",
          title:   "Low Stock",
          message: `${m.medicine_Name} — only ${m.quantity_In_Stock} left`,
          time:    "Now",
          read:    false,
        });
      });

      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotiLoading(false);
    }
  };

  const handleBellClick = () => {
    if (!showNotifications) fetchNotifications();
    setShowNotifications((prev) => !prev);
    setShowResults(false);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ===== SEARCH =====
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];

    // medicines
    allData.medicines
      .filter((m: any) => m.medicine_Name?.toLowerCase().includes(term))
      .slice(0, 3)
      .forEach((m: any) => {
        results.push({
          type:     "medicine",
          title:    m.medicine_Name,
          subtitle: `Stock: ${m.quantity_In_Stock} | EGP ${m.selling_Price}`,
          route:    "/Dashboard/Manager/PharmacyManagement",
        });
      });

    // orders
    allData.orders
      .filter((o: any) =>
        o.clientName?.toLowerCase().includes(term) ||
        `ord-${o.orderId}`.includes(term)
      )
      .slice(0, 3)
      .forEach((o: any) => {
        results.push({
          type:     "order",
          title:    `Order #${o.orderId}`,
          subtitle: `${o.clientName} — EGP ${o.totalAmount}`,
          route:    "/Dashboard/Manager/OrdersReports",
        });
      });

    // clients
    allData.clients
      .filter((c: any) => c.client_Name?.toLowerCase().includes(term))
      .slice(0, 3)
      .forEach((c: any) => {
        results.push({
          type:     "client",
          title:    c.client_Name,
          subtitle: c.client_Phone ?? c.client_Address ?? "Client",
          route:    "/Dashboard/Manager/OrdersReports",
        });
      });

    setSearchResults(results);
    setShowResults(results.length > 0);
  }, [searchTerm, allData]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingCart size={16} className="text-darkblue" />;
      case "out":   return <PackageX     size={16} className="text-darkred"  />;
      case "low":   return <AlertTriangle size={16} className="text-darkyellow" />;
      default:      return <Bell         size={16} className="text-muted-text" />;
    }
  };

  const getNotifBg = (type: string) => {
    switch (type) {
      case "order": return "bg-softblue/20";
      case "out":   return "bg-softred/20";
      case "low":   return "bg-softyellow/20";
      default:      return "bg-secondary";
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "medicine": return <Package      size={14} className="text-mintgreen"    />;
      case "order":    return <ShoppingCart size={14} className="text-darkblue"     />;
      case "client":   return <User         size={14} className="text-purple-500"   />;
      default:         return <Search       size={14} className="text-muted-text"   />;
    }
  };

  const currentPath   = pathname.split("/").pop() || "Overview";
  const formattedPath = currentPath
    .replace(/-/g, " ")
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

  if (!mounted) {
    return <header className="h-16 bg-background border-b border-gray-100 dark:border-gray-800" />;
  }

  return (
    <header className="bg-background">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4">

          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div className="hidden md:flex items-center text-sm font-medium min-w-0">
              <span className="text-gray-400 dark:text-gray-500">
                {pathname.includes("dashboard") ? "Dashboard" : "App"} /
              </span>
              <span className="text-blue-500 dark:text-blue-400 ml-2 truncate">
                {formattedPath}
              </span>
            </div>
            <h1 className="md:hidden text-base font-semibold text-primary-text truncate">
              {formattedPath}
            </h1>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines, orders, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-primary-text placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(""); setShowResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={14} className="text-muted-text" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-full bg-background dark:bg-secondary rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-muted-text text-center py-4">No results found</p>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            router.push(result.route);
                            setSearchTerm("");
                            setShowResults(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary dark:hover:bg-background/50 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-secondary dark:bg-background flex items-center justify-center shrink-0">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-primary-text truncate">{result.title}</p>
                            <p className="text-xs text-muted-text truncate">{result.subtitle}</p>
                          </div>
                          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary dark:bg-background text-muted-text capitalize shrink-0">
                            {result.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3">

            {/* Theme Toggle Desktop */}
            <div className="hidden sm:flex items-center bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  theme === "light" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  theme === "dark" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                }`}
              >
                Dark
              </button>
            </div>

            {/* Theme Toggle Mobile */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="sm:hidden p-2 bg-secondary rounded-lg"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleBellClick}
                className="hidden sm:block relative p-2 bg-secondary rounded-lg"
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-darkred text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background dark:bg-secondary rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-primary-text">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-darkred text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-mintgreen hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notiLoading ? (
                      <div className="space-y-2 p-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <Bell size={24} className="text-muted-text mx-auto mb-2 opacity-40" />
                        <p className="text-sm text-muted-text">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors ${
                            !n.read ? "bg-mintgreen/5" : ""
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${getNotifBg(n.type)}`}>
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary-text">{n.title}</p>
                            <p className="text-xs text-muted-text mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-muted-text mt-1">{n.time}</p>
                          </div>
                          {!n.read && (
                            <div className="w-2 h-2 bg-mintgreen rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-mintgreen/10 flex items-center justify-center">
                  <User size={16} className="text-mintgreen" />
                </div>
                <span className="hidden md:block text-sm font-semibold text-primary-text whitespace-nowrap">
                  {userName}
                </span>
              </div>
              <div className="hidden sm:block px-3 py-2 text-xs font-medium text-muted-text">
                {date}
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}