import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Stethoscope,
  HeartPulse,
  Activity,
  TrendingUp,
  History,
  BrainCircuit,
  FlaskConical,
  Info,
  Server,
  Database,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';

export default function Sidebar() {
  const { apiConnected, modelLoaded, metadata, modelInfo } = usePrediction();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Check Health', path: '/check-health', icon: Stethoscope },
    { name: 'Blood Pressure', path: '/blood-pressure', icon: HeartPulse },
    { name: 'Kidney Health', path: '/kidney-health', icon: Activity },
    { name: 'Health Trends', path: '/health-trends', icon: TrendingUp },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'AI Explanation', path: '/explain', icon: BrainCircuit },
    { name: 'Research', path: '/research', icon: FlaskConical },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <img src="/logo-icon.svg" alt="CKD Predict Logo" className="w-9 h-9 object-contain shrink-0" />
        <div>
          <h1 className="font-extrabold text-base text-[#0F172A] tracking-tight leading-none">
            CKD <span className="text-[#FF6B00]">Predict</span>
          </h1>
          <p className="text-[9px] font-semibold tracking-tight text-gray-500 mt-1">
            Smarter Screening. Healthier Tomorrow.
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-50 text-[#FF6B00] border-l-4 border-[#FF6B00] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Telemetry Status Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/70 space-y-1.5 text-xs">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          System Telemetry
        </div>

        {/* API Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Server className="w-3.5 h-3.5 text-gray-400" />
            API Backend
          </span>
          {apiConnected ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
              <XCircle className="w-3 h-3 text-rose-500" /> Disconnected
            </span>
          )}
        </div>

        {/* Model Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <BrainCircuit className="w-3.5 h-3.5 text-gray-400" />
            Best Model
          </span>
          {modelLoaded ? (
            <span className="font-semibold text-gray-800 bg-orange-100 text-[#FF6B00] px-1.5 py-0.5 rounded text-[11px]">
              {modelInfo?.best_model_name || 'Loaded'}
            </span>
          ) : (
            <span className="font-semibold text-rose-600">Unavailable</span>
          )}
        </div>

        {/* Dataset Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-gray-600">
            <Database className="w-3.5 h-3.5 text-gray-400" />
            UCI Dataset
          </span>
          <span className="font-semibold text-gray-700">
            {metadata ? `${metadata.total_records} Records` : '400 Records'}
          </span>
        </div>
      </div>
    </aside>
  );
}
