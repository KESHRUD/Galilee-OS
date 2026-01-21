import React from 'react';
import { useMode } from '../contexts/ModeContext';
import { HardDrive, Cloud, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { audioManager } from '../services/audioService';

export const ModeToggle: React.FC = () => {
  const { mode, toggleMode, isOffline } = useMode();
  const { theme } = useTheme();

  const isPWA = mode === 'pwa';
  const isDDAW = mode === 'ddaw';
  const isGalilee = theme === 'galilee';

  const handleToggle = () => {
    toggleMode();
    audioManager.play('click', theme);
  };

  const activeClass = isGalilee 
    ? 'bg-cyan-900/40 text-cyan-400' 
    : 'bg-indigo-100 text-indigo-600';

  const inactiveClass = isGalilee 
    ? 'text-slate-500 hover:text-cyan-300 hover:bg-slate-800/30' 
    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50';

  return (
    <div className={`group relative flex items-center p-1 rounded-lg transition-all duration-300 ${
      isGalilee ? 'bg-slate-900 border border-slate-700 hover:border-cyan-700' : 'bg-slate-100 hover:bg-slate-200'
    }`}>
      {/* Tooltip informatif - avec pointer-events-none pour ne pas bloquer les clics */}
      <div className={`pointer-events-none absolute -bottom-28 left-1/2 -translate-x-1/2 w-64 p-3 rounded-lg border z-[100] transition-all duration-300 ${
        isGalilee 
          ? 'bg-slate-900/98 backdrop-blur-xl border-cyan-700 text-cyan-100 shadow-xl shadow-cyan-900/20' 
          : 'bg-white/98 backdrop-blur-xl border-slate-300 text-slate-700 shadow-xl'
      } opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2`}>
        <div className="text-[11px] space-y-2">
          <div className={`font-bold flex items-center gap-2 ${isGalilee ? 'text-cyan-300' : 'text-indigo-600'}`}>
            {isPWA ? <HardDrive size={12} /> : <Cloud size={12} />}
            Mode {isPWA ? 'PWA' : 'DDAW'}
          </div>
          <div className={`text-[10px] leading-relaxed ${isGalilee ? 'text-cyan-100/80' : 'text-slate-600'}`}>
            {isPWA ? (
              <>
                <div className="font-semibold mb-1.5 text-purple-400"> Programmation Web Avancée</div>
                <div className="space-y-0.5 pl-1">
                  <div>✓ Offline-first avec IndexedDB</div>
                  <div>✓ Service Workers actifs</div>
                  <div>✓ Pas de backend requis</div>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold mb-1.5 text-cyan-400"> Déploiement d'Applications Web</div>
                <div className="space-y-0.5 pl-1">
                  <div>✓ Backend API (Render.com)</div>
                  <div>✓ PostgreSQL + TypeORM</div>
                  <div>✓ JWT Authentication</div>
                  {isOffline && (
                    <div className="mt-1.5 pt-1.5 border-t border-red-500/30 text-red-400">
                      ⚠️ Connexion internet requise
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Flèche pointant vers le toggle */}
        <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
          isGalilee ? 'bg-slate-900 border-l border-t border-cyan-700' : 'bg-white border-l border-t border-slate-300'
        }`} />
      </div>
      
      {/* Bouton PWA */}
      <button 
        onClick={isPWA ? undefined : handleToggle}
        disabled={isPWA}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
          isPWA ? activeClass : inactiveClass
        } ${!isPWA ? 'active:scale-95 cursor-pointer' : 'cursor-default'}`}
        aria-label="Mode PWA - Offline First"
        aria-pressed={isPWA}
      >
        <HardDrive 
          size={14} 
          className={`transition-transform duration-300 ${
            isPWA && isGalilee ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]' : ''
          }`}
        />
        <span className="hidden lg:inline">PWA</span>
        
        {/* Indicateur actif avec animation */}
        {isPWA && (
          <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
            isGalilee ? 'bg-cyan-400 animate-ping' : 'bg-indigo-500'
          }`} />
        )}
      </button>

      {/* Séparateur animé avec éclair qui tourne */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div className={`absolute w-px h-4 transition-colors duration-300 ${
          isGalilee ? 'bg-cyan-700' : 'bg-slate-300'
        }`} />
        <Zap 
          size={10} 
          className={`relative z-10 transition-all duration-500 ease-out ${
            isGalilee ? 'text-cyan-400' : 'text-indigo-500'
          } ${isDDAW ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}`}
        />
      </div>

      {/* Bouton DDAW */}
      <button 
        onClick={isDDAW ? undefined : handleToggle}
        disabled={isDDAW}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
          isDDAW ? activeClass : inactiveClass
        } ${!isDDAW ? 'active:scale-95 cursor-pointer' : 'cursor-default'}`}
        aria-label="Mode DDAW - Backend API + PostgreSQL"
        aria-pressed={isDDAW}
      >
        <Cloud 
          size={14}
          className={`transition-transform duration-300 ${
            isDDAW && isGalilee ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]' : ''
          }`}
        />
        <span className="hidden lg:inline">DDAW</span>
        
        {/* Indicateur actif avec animation */}
        {isDDAW && (
          <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
            isGalilee ? 'bg-cyan-400 animate-ping' : 'bg-indigo-500'
          }`} />
        )}
        
        {/* Badge warning si DDAW mais offline */}
        {isDDAW && isOffline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[6px] text-white font-bold animate-pulse shadow-lg shadow-red-500/50">
            !
          </div>
        )}
      </button>

      {/* Glow effect au hover pour thème Galilée */}
      {isGalilee && (
        <div 
          className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm"
          style={{
            background: isPWA 
              ? 'radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)' 
              : 'radial-gradient(circle at center, rgba(6,182,212,0.15) 0%, transparent 70%)'
          }}
        />
      )}
    </div>
  );
};
