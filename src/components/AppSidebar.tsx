import { 
  LayoutDashboard, 
  Building2, 
  User, 
  Users, 
  TrendingUp,
  Receipt,
  PiggyBank,
  Menu,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Visão geral"
  },
  { 
    title: "Empresa", 
    url: "/empresa", 
    icon: Building2,
    description: "Finanças MEI"
  },
  { 
    title: "Pessoal", 
    url: "/pessoal", 
    icon: User,
    description: "Despesas pessoais"
  },
  { 
    title: "Clientes", 
    url: "/clientes", 
    icon: Users,
    description: "Fontes de receita"
  },
  { 
    title: "Recebimentos", 
    url: "/recebimentos", 
    icon: TrendingUp,
    description: "Entradas"
  },
  { 
    title: "Investimentos", 
    url: "/investimentos", 
    icon: PiggyBank,
    description: "Na empresa"
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col",
          collapsed ? "w-0 lg:w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-sidebar-border",
          collapsed && "lg:justify-center"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Receipt className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-sm">Meu Financeiro</h1>
                <p className="text-xs text-sidebar-muted">Gestão MEI</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="hidden lg:flex w-8 h-8 rounded-lg bg-sidebar-primary items-center justify-center">
              <Receipt className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 py-4 overflow-hidden", collapsed && "lg:overflow-visible")}>
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <li key={item.url}>
                  <NavLink
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                      collapsed && "lg:justify-center lg:px-2"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) setCollapsed(true);
                    }}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                    )} />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-sidebar-muted truncate">{item.description}</p>
                      </div>
                    )}
                    {isActive && !collapsed && (
                      <div className="w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-sidebar-border",
          collapsed && "lg:p-2"
        )}>
          {!collapsed && (
            <div className="bg-sidebar-accent/50 rounded-lg p-3">
              <p className="text-xs text-sidebar-muted">
                Sistema de gestão financeira pessoal para MEI
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle button - always visible */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed z-50 top-4 p-2 rounded-lg bg-card shadow-lg border border-border hover:bg-accent transition-all duration-300",
          collapsed ? "left-4" : "left-[17rem]",
          "lg:left-auto",
          collapsed ? "lg:left-[4.5rem]" : "lg:left-[17rem]"
        )}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>
    </>
  );
}
