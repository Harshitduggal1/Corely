"use client"

import React, { useState } from 'react';
import { Home, Terminal, Settings, Brain, Code, Database, Shield, Sparkle, Network } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ModernSidebar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: '/dashboard', icon: Home, label: 'Home' },
    { id: '/dashboard/generate', icon: Terminal, label: 'Generate' },
    { id: '/dashboard/create', icon: Brain, label: 'AI' },
    { id: '/dashboard/appointment', icon: Code, label: 'Appointments' },
    { id: '/dashboard/email-marketing', icon: Database, label: 'Email Marketing' },
    { id: '/dashboard/dashboard', icon: Shield, label: 'Dashboard' },
    { id: '/dashboard/conversation', icon: Sparkle, label: 'Conversations' },
    { id: '/dashboard/integration', icon: Network, label: 'Integrations' },
    { id: '/dashboard/course', icon: Network, label: 'Courses' },
    { id: '/dashboard/blogs', icon: Network, label: 'Blogs' },
    { id: '/dashboard/plan', icon: Network, label: 'Plans' },
    { id: '/dashboard/analytics', icon: Network, label: 'Analytics' },
    { id: '/dashboard/api-key', icon: Settings, label: 'API Keys' },
    { id: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 z-50 h-full w-64 bg-blue-950/20 border-r border-blue-800 text-white overflow-y-auto"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        boxShadow: '0 4px 60px 0 rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <motion.div 
        className="space-y-2 mt-4 p-4 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence>
          {menuItems.map(({ id, icon: Icon, label }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Link href={id}>
                <motion.div
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer
                    ${pathname === id
                      ? 'bg-gradient-to-r from-blue-600 via-pink-600 to-purple-600 text-white'
                      : 'text-gray-200 hover:bg-gradient-to-r hover:from-blue-600/70 hover:via-pink-600/70 hover:to-purple-600/70 hover:text-white'}
                  `}
                  onHoverStart={() => setHoveredItem(id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(0, 0, 255, 0.7)',
                    transition: { duration: 0.2, ease: 'easeInOut' }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: hoveredItem === id ? 360 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Icon className="w-6 min-w-[24px] h-6" />
                  </motion.div>
                  <motion.span
                    className="ml-3 font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {label}
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
};

export default ModernSidebar;
