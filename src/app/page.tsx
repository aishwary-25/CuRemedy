'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, RefreshCw, 
  ExternalLink, X, ChevronDown, Eye, Terminal, Moon, Sun, FileText, Activity, CreditCard
} from 'lucide-react';

// Premium CSS Engine
const customCSS = `
  @keyframes smoothReveal {
    0% { opacity: 0; transform: translateY(30px); filter: blur(12px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0px, 0px) scale(1); }
    50% { transform: translate(30px, -40px) scale(1.05); }
  }
  .smooth-reveal {
    animation: smoothReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }
  
  .glass-light {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(40px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 8px 30px rgba(0, 0, 0, 0.04);
  }
  
  .glass-dark {
    background: rgba(20, 20, 25, 0.5);
    backdrop-filter: blur(40px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 8px 30px rgba(0, 0, 0, 0.3);
  }

  .glass-modal-light {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(80px) saturate(250%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 24px 80px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,1);
  }

  .glass-modal-dark {
    background: rgba(30, 30, 35, 0.85);
    backdrop-filter: blur(80px) saturate(250%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 24px 80px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
  }
`;

interface AuditItem {
  code: string;
  description: string;
  billedUSD: number;
  fairUSD: number;
  status: 'UPCODED' | 'UNBUNDLED' | 'EXTREME_MARKUP' | 'FAIR';
  citation: string;
}

export default function CuRemedyDashboard() {
  const [isDark, setIsDark] = useState<boolean>(false); 
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<string>('INV2-SANDBOX-98421');
  const [hardshipExecuted, setHardshipExecuted] = useState<boolean>(false);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [activeView, setActiveView] = useState<'SEED' | 'AUDIT' | 'PLAN' | null>(null);
  const [showPayPalModal, setShowPayPalModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const fxRate = 84;

  const formatMoney = (usdAmount: number) => {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(usdAmount * fxRate);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdAmount);
  };

  // Realistic Data (~31% Markup)
  const auditItems: AuditItem[] = [
    { code: '99214', description: 'Outpatient Office Visit', billedUSD: 325, fairUSD: 250, status: 'UPCODED', citation: 'CMS Medicare Table 4.2' },
    { code: '80053', description: 'Comprehensive Metabolic Panel', billedUSD: 165, fairUSD: 120, status: 'EXTREME_MARKUP', citation: 'Fair Health Benchmark v2026' },
    { code: '29881', description: 'Arthroscopic Knee Surgery', billedUSD: 2350, fairUSD: 1800, status: 'UNBUNDLED', citation: 'NCCI PTP Edits' },
    { code: '36415', description: 'Routine Venipuncture', billedUSD: 110, fairUSD: 80, status: 'EXTREME_MARKUP', citation: 'State Hospital Fee Limit' }
  ];

  const totalBilledUSD = auditItems.reduce((acc, item) => acc + item.billedUSD, 0);
  const totalFairUSD = auditItems.reduce((acc, item) => acc + item.fairUSD, 0);
  const totalSavingsUSD = totalBilledUSD - totalFairUSD;
  const installmentAmt = totalFairUSD / 4;

  const markupPercent = ((totalSavingsUSD / totalFairUSD) * 100).toFixed(1);
  const savingsPercent = ((totalSavingsUSD / totalBilledUSD) * 100).toFixed(1);

  const isSeeded = step > 1;
  const isAudited = step > 2;

  const handleSeedInvoice = async () => {
    setLoading(true);
    setTimeout(() => {
      setInvoiceId('INV2-SANDBOX-' + Math.floor(100000 + Math.random() * 900000));
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), action: 'Sample Bill Created', status: 201 }, ...prev]);
      setStep(2);
      setLoading(false);
    }, 1200);
  };

  const handleRunAudit = () => {
    setLoading(true);
    setTimeout(() => {
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), action: 'AI Overcharge Audit Complete', status: 200 }, ...prev]);
      setStep(3);
      setLoading(false);
    }, 1500);
  };

  const handleExecuteHardship = async () => {
    setLoading(true);
    setTimeout(() => {
      setHardshipExecuted(true);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), action: '0% Plan Authorized', status: 201 }, ...prev]);
      setLoading(false);
    }, 1500);
  };

  const handlePayPalSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setLogs(prev => [{ time: new Date().toLocaleTimeString(), action: 'PayPal Plan Subscribed', status: 200 }, ...prev]);
    }, 2000);
  };

  const glassClass = isDark ? 'glass-dark' : 'glass-light';
  const textPrimary = isDark ? 'text-white' : 'text-black';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0A0A0C]' : 'bg-[#F2F2F7]'}`}>
      <style dangerouslySetInnerHTML={{ __html: customCSS }} />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isDark ? 'bg-blue-900/30 opacity-60' : 'bg-blue-300/40 opacity-80'}`} style={{animation: 'orbFloat 15s ease-in-out infinite'}}></div>
        <div className={`absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isDark ? 'bg-purple-900/30 opacity-50' : 'bg-purple-300/40 opacity-70'}`} style={{animation: 'orbFloat 18s ease-in-out infinite reverse'}}></div>
        <div className={`absolute bottom-[-15%] left-[20%] w-[50rem] h-[50rem] rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ${isDark ? 'bg-teal-900/20 opacity-40' : 'bg-teal-200/40 opacity-60'}`} style={{animation: 'orbFloat 20s ease-in-out infinite'}}></div>
      </div>

      <header className={`sticky top-0 z-40 ${glassClass} border-b ${isDark ? 'border-white/10' : 'border-white/60'} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3 smooth-reveal" style={{ animationDelay: '0.1s' }}>
          <div className={`${isDark ? 'bg-white text-black' : 'bg-black text-white'} p-2 rounded-[14px] flex items-center justify-center shadow-lg transition-colors`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${textPrimary}`}>CuRemedy</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Autonomous Billing</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 smooth-reveal" style={{ animationDelay: '0.15s' }}>
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className={`flex items-center p-1 rounded-xl shadow-inner ${isDark ? 'bg-black/30 border border-white/5' : 'bg-black/5 border border-black/5'}`}>
            <button onClick={() => setCurrency('USD')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${currency === 'USD' ? (isDark ? 'bg-white/10 text-white shadow-md' : 'bg-white text-black shadow-md') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}>USD</button>
            <button onClick={() => setCurrency('INR')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${currency === 'INR' ? (isDark ? 'bg-white/10 text-white shadow-md' : 'bg-white text-black shadow-md') : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black')}`}>INR</button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-12 space-y-10 relative z-10">
        
        <div className="text-center space-y-4 smooth-reveal" style={{ animationDelay: '0.2s' }}>
          <h2 className={`text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm ${textPrimary}`}>Medical Bill Intelligence.</h2>
          <p className={`${textMuted} max-w-2xl mx-auto text-[17px] font-medium leading-relaxed`}>Audit overcharges instantly and restructure debt with 0% interest via PayPal Sandbox.</p>
        </div>

        {/* 3-Step Execution Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { s: 1, title: 'Create Sample Bill', desc: 'Simulate hospital invoice.', action: handleSeedInvoice, btnText: 'Run Step 1', viewKey: 'SEED' },
            { s: 2, title: 'AI Audit', desc: 'Detect markup & apply discounts.', action: handleRunAudit, btnText: 'Run Step 2', viewKey: 'AUDIT' },
            { s: 3, title: 'Execute Plan', desc: 'Deploy 0% hardship restructuring.', action: handleExecuteHardship, btnText: 'Run Step 3', viewKey: 'PLAN' }
          ].map((item, i) => {
            const isCompleted = step > item.s || (item.s === 3 && hardshipExecuted);
            const activeCardClass = step === item.s 
              ? (isDark ? 'ring-1 ring-blue-500/50 bg-white/[0.08] scale-[1.02]' : 'ring-2 ring-blue-500/50 bg-white/80 scale-[1.02]') 
              : '';

            return (
              <div key={item.s} className={`${glassClass} p-7 rounded-[32px] transition-all duration-500 flex flex-col justify-between h-[230px] smooth-reveal ${activeCardClass}`} style={{ animationDelay: (0.3 + i * 0.1) + 's' }}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm font-bold ${isDark ? 'text-white/30' : 'text-black/40'}`}>Step 0{item.s}</span>
                    {isCompleted && <CheckCircle2 className={`w-7 h-7 ${textPrimary} drop-shadow-sm`} />}
                  </div>
                  <h4 className={`font-bold text-2xl tracking-tight ${textPrimary}`}>{item.title}</h4>
                  <p className={`text-[15px] mt-2 font-medium ${textMuted}`}>{item.desc}</p>
                </div>
                <div className="mt-4">
                  {!isCompleted ? (
                    <button onClick={item.action} disabled={loading || step !== item.s} className={`w-full py-3.5 font-semibold rounded-2xl text-[15px] transition-all disabled:opacity-30 shadow-lg flex justify-center items-center gap-2 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-900'}`}>
                      {loading && step === item.s ? <RefreshCw className="w-5 h-5 animate-spin"/> : item.btnText}
                    </button>
                  ) : (
                    <button onClick={() => setActiveView(item.viewKey as any)} className={`w-full py-3.5 font-semibold rounded-2xl text-[15px] transition-all flex justify-center items-center gap-2 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>
                      <Eye className="w-5 h-5"/> View Summary
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🎬 DYNAMIC CONTENT */}
        {!isSeeded ? (
          <div className={`mt-10 p-12 text-center rounded-[32px] smooth-reveal flex flex-col items-center justify-center border-2 border-dashed ${isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`} style={{ animationDelay: '0.6s' }}>
            <FileText className={`w-12 h-12 mb-4 opacity-50 ${textMuted}`} />
            <h3 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>No Bill Generated Yet</h3>
            <p className={`mt-2 ${textMuted}`}>Click on "Run Step 1" to generate a realistic sample medical bill.</p>
          </div>
        ) : (
          <div className="space-y-10 smooth-reveal">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${glassClass} p-7 rounded-[32px] hover:scale-[1.02] transition-transform`}>
                <div className={`text-[13px] font-bold mb-2 ${textMuted}`}>Hospital Billed</div>
                <div className={`text-[34px] font-extrabold tracking-tight ${textPrimary}`}>{formatMoney(totalBilledUSD)}</div>
                {isAudited ? (
                  <div className="mt-3 text-[12px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 inline-block px-3 py-1.5 rounded-lg smooth-reveal">+{markupPercent}% Markup Detected</div>
                ) : (
                  <div className="mt-3 text-[12px] font-bold text-gray-500 bg-gray-500/10 border border-gray-500/20 inline-block px-3 py-1.5 rounded-lg animate-pulse">Awaiting Audit...</div>
                )}
              </div>
              
              <div className={`${glassClass} p-7 rounded-[32px] hover:scale-[1.02] transition-transform`}>
                <div className={`text-[13px] font-bold mb-2 ${textMuted}`}>Fair Price (CMS)</div>
                {isAudited ? (
                  <div className={`text-[34px] font-extrabold tracking-tight ${textPrimary} smooth-reveal`}>{formatMoney(totalFairUSD)}</div>
                ) : (
                  <div className="text-[20px] font-bold tracking-tight text-gray-500 py-2 animate-pulse">Calculating...</div>
                )}
              </div>
              
              <div className={`p-7 rounded-[32px] shadow-2xl hover:scale-[1.02] transition-all duration-500 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                <div className={`text-[13px] font-medium mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Savings Applied</div>
                {isAudited ? (
                  <div className="smooth-reveal">
                    <div className="text-[34px] font-extrabold tracking-tight">{formatMoney(totalSavingsUSD)}</div>
                    <div className={`mt-3 text-[12px] font-bold inline-block px-3 py-1.5 rounded-lg backdrop-blur-md ${isDark ? 'bg-black/10 text-black' : 'bg-white/15 text-white'}`}>{savingsPercent}% Discount Applied</div>
                  </div>
                ) : (
                  <div className="text-[20px] font-bold tracking-tight py-2 opacity-50 animate-pulse">Pending Audit...</div>
                )}
              </div>
              
              <div className={`${glassClass} p-7 rounded-[32px] hover:scale-[1.02] transition-transform`}>
                <div className={`text-[13px] font-bold mb-2 ${textMuted}`}>Installment (0% APR)</div>
                {isAudited ? (
                  <div className={`text-[34px] font-extrabold tracking-tight ${textPrimary} smooth-reveal`}>{formatMoney(installmentAmt)}<span className={`text-xl font-medium ${textMuted}`}>/mo</span></div>
                ) : (
                  <div className="text-[20px] font-bold tracking-tight text-gray-500 py-2 animate-pulse">Pending...</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 ${glassClass} rounded-[32px] p-8`}>
                <h3 className={`font-bold text-2xl mb-6 tracking-tight ${textPrimary}`}>Variance & Discount Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-white/10' : 'border-black/10'} text-[13px] font-bold uppercase tracking-wider ${textMuted}`}>
                        <th className="pb-4 pr-4">CPT</th>
                        <th className="pb-4 pr-4">Description</th>
                        <th className="pb-4 px-4 text-right">Billed</th>
                        <th className="pb-4 pl-4 text-right">Fair Value</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-black/5'}`}>
                      {auditItems.map((item, idx) => (
                        <tr key={idx} className={`transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}>
                          <td className={`py-5 pr-4 font-mono font-bold ${textPrimary}`}>{item.code}</td>
                          <td className="py-5 pr-4">
                            <div className={`font-bold text-[15px] flex items-center gap-2 ${textPrimary}`}>
                              {item.description}
                              {isAudited && (
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider smooth-reveal ${
                                  item.status === 'UPCODED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                  item.status === 'UNBUNDLED' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                                  'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                                }`}>
                                  {item.status}
                                </span>
                              )}
                            </div>
                            <div className={`text-[13px] mt-1 font-medium ${textMuted}`}>{item.citation}</div>
                          </td>
                          <td className={`py-5 px-4 text-right font-medium ${isAudited ? 'line-through decoration-red-400 opacity-60' : ''} ${textPrimary}`}>{formatMoney(item.billedUSD)}</td>
                          <td className={`py-5 pl-4 text-right font-extrabold text-[17px] transition-colors ${textPrimary} ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'}`}>
                            {isAudited ? <span className="smooth-reveal">{formatMoney(item.fairUSD)}</span> : <span className={`text-sm italic opacity-50 ${textMuted}`}>Pending</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={`${glassClass} rounded-[32px] p-8 flex flex-col justify-between`}>
                <div>
                  <h3 className={`font-bold text-2xl mb-2 tracking-tight ${textPrimary}`}>Gateway</h3>
                  <p className={`text-[15px] font-medium mb-6 ${textMuted}`}>Restructuring module</p>
                  
                  {hardshipExecuted ? (
                    <div className="space-y-4 smooth-reveal" style={{ animationDelay: '0s' }}>
                      <div className={`border p-5 rounded-2xl flex items-start gap-3 shadow-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-white/80'}`}>
                        <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-[#0070BA]'}`} />
                        <div>
                          <h4 className={`font-bold text-[15px] ${textPrimary}`}>Ready for Approval</h4>
                          <p className={`text-[13px] mt-1 font-medium ${textMuted}`}>Sandbox token generated.</p>
                        </div>
                      </div>
                      <button onClick={() => { setShowPayPalModal(true); setPaymentSuccess(false); }} className={`w-full py-4 text-white font-semibold rounded-2xl text-[15px] transition-all shadow-xl flex justify-center items-center gap-2 ${isDark ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' : 'bg-[#0070BA] hover:bg-[#005ea6] shadow-blue-900/20'}`}>
                        Open PayPal <ExternalLink className="w-4 h-4"/>
                    </button>
                    </div>
                  ) : (
                    <div className={`h-[140px] border-2 border-dashed rounded-3xl flex items-center justify-center text-[15px] font-bold ${isDark ? 'border-white/10 bg-white/5 text-gray-500' : 'border-black/10 bg-black/5 text-gray-400'}`}>
                      Run Step 3 to deploy
                    </div>
                  )}
                </div>
                
                <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                  <div className={`text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center justify-between ${textMuted}`}>
                    System Logs <Terminal className="w-4 h-4"/>
                  </div>
                  <div className="space-y-2 h-24 overflow-y-auto pr-2">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex justify-between items-center text-[12px] font-mono border p-2.5 rounded-xl shadow-sm smooth-reveal ${isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/60 border-white/50 text-black'}`} style={{ animationDelay: '0s' }}>
                        <span className="font-bold">{log.action}</span><span className={textMuted}>{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Footer: Developer Info */}
        <footer className="mt-16 pt-8 pb-4 text-center smooth-reveal" style={{ animationDelay: '1.2s' }}>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Developed by <span className={`font-bold ${textPrimary}`}>Aishwary Swarnkar</span>
          </p>
          <a href="mailto:aishwaryswarnkar1@gmail.com" className={`inline-block mt-2 text-sm font-semibold transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
            Contact: aishwaryswarnkar1@gmail.com
          </a>
        </footer>
      </main>

      {/* 🔍 Human Readable Output View Modal */}
      {activeView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all">
          <div className={`${isDark ? 'glass-modal-dark' : 'glass-modal-light'} w-full max-w-lg rounded-[36px] overflow-hidden smooth-reveal`} style={{ animationDelay: '0s' }}>
            <div className={`px-8 py-6 border-b flex justify-between items-center ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/40'}`}>
              <h3 className={`font-extrabold text-xl tracking-tight flex items-center gap-2 ${textPrimary}`}>
                {activeView === 'SEED' && <><FileText className="w-5 h-5"/> Step 1: Bill Summary</>}
                {activeView === 'AUDIT' && <><Activity className="w-5 h-5"/> Step 2: Audit Results</>}
                {activeView === 'PLAN' && <><CreditCard className="w-5 h-5"/> Step 3: Action Plan</>}
              </h3>
              <button onClick={() => setActiveView(null)} className={`rounded-full p-2 transition-colors ${isDark ? 'text-gray-400 hover:text-white bg-white/10 hover:bg-white/20' : 'text-gray-500 hover:text-black bg-black/5 hover:bg-black/10'}`}><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-8">
              <div className={`p-6 rounded-3xl border shadow-inner ${isDark ? 'bg-black/40 text-gray-300 border-white/10' : 'bg-white/70 text-gray-700 border-white/80'}`}>
                
                {activeView === 'SEED' && (
                  <div className="space-y-4">
                    <p className="text-[15px] font-medium leading-relaxed">A sample hospital bill has been successfully generated in the secure sandbox environment.</p>
                    <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    <ul className="space-y-3 text-[14px]">
                      <li className="flex justify-between"><span className="opacity-70">Invoice ID:</span> <span className={`font-bold ${textPrimary}`}>{invoiceId}</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Medical Procedures:</span> <span className={`font-bold ${textPrimary}`}>4 Items</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Provider Name:</span> <span className={`font-bold ${textPrimary}`}>CuRemedy Medical</span></li>
                      <li className="flex justify-between pt-2"><span className="opacity-70">Total Amount Billed:</span> <span className={`font-extrabold text-[16px] ${textPrimary}`}>{formatMoney(totalBilledUSD)}</span></li>
                    </ul>
                  </div>
                )}
                
                {activeView === 'AUDIT' && (
                  <div className="space-y-4">
                    <p className="text-[15px] font-medium leading-relaxed">Our AI has successfully cross-referenced the bill with CMS guidelines and found discrepancies.</p>
                    <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    <ul className="space-y-3 text-[14px]">
                      <li className="flex justify-between"><span className="opacity-70">Overcharges Detected:</span> <span className="font-bold text-red-500">4 Items Flagged</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Total Markup:</span> <span className="font-bold text-red-500">+{markupPercent}% above fair price</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Original Billed:</span> <span className={`font-bold line-through opacity-70 ${textPrimary}`}>{formatMoney(totalBilledUSD)}</span></li>
                      <li className="flex justify-between pt-2"><span className="opacity-70">Revised Fair Value:</span> <span className={`font-extrabold text-green-500 text-[16px]`}>{formatMoney(totalFairUSD)}</span></li>
                    </ul>
                  </div>
                )}

                {activeView === 'PLAN' && (
                  <div className="space-y-4">
                    <p className="text-[15px] font-medium leading-relaxed">A 0% interest hardship plan has been configured and is currently awaiting your approval.</p>
                    <div className={`h-px w-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
                    <ul className="space-y-3 text-[14px]">
                      <li className="flex justify-between"><span className="opacity-70">Payment Plan:</span> <span className={`font-bold ${textPrimary}`}>4 Monthly Installments</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Interest Rate (APR):</span> <span className={`font-bold text-blue-500`}>0%</span></li>
                      <li className="flex justify-between"><span className="opacity-70">Gateway:</span> <span className={`font-bold ${textPrimary}`}>PayPal Subscriptions</span></li>
                      <li className="flex justify-between pt-2"><span className="opacity-70">Monthly Payment:</span> <span className={`font-extrabold text-[16px] ${textPrimary}`}>{formatMoney(installmentAmt)}</span></li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center">
                 <button onClick={() => setActiveView(null)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>Close Summary</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💳 1:1 PayPal Checkout Modal (CLEAN TEXT LOGO) */}
      {showPayPalModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-16 sm:pt-24 bg-black/50 backdrop-blur-md transition-all overflow-y-auto pb-10">
          <div className="bg-white w-full max-w-[420px] sm:rounded-[24px] shadow-2xl overflow-hidden relative smooth-reveal" style={{ animationDelay: '0s' }}>
            
            <div className="flex justify-center items-center pt-8 pb-4 relative">
              <button onClick={() => setShowPayPalModal(false)} disabled={isProcessing} className="absolute left-6 top-8 text-gray-500 hover:text-gray-800"><X className="w-5 h-5"/></button>
              
              {/* CLEAN, SIMPLE TEXT LOGO */}
              <span className="font-bold text-black text-2xl">PayPal</span>
              
              <span className="absolute top-8 right-6 bg-black/10 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Sandbox</span>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center pb-12 smooth-reveal" style={{ animationDelay: '0s' }}>
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10"/>
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">You're all set</h3>
                <p className="text-[16px] text-gray-600 mb-8">You successfully subscribed to CuRemedy Medical 0% Hardship Plan.</p>
                <button onClick={() => setShowPayPalModal(false)} className="w-full py-4 bg-black text-white font-medium rounded-full text-[16px] hover:bg-gray-800 transition-colors">Return to Merchant</button>
              </div>
            ) : (
              <div className="px-8 pb-10">
                <div className="text-center mt-2 mb-6">
                  <p className="text-[16px] text-gray-600 font-medium">Subscribe to CuRemedy Medical</p>
                  <div className="text-[38px] text-gray-900 font-light mt-1 flex justify-center items-end gap-1">
                    {formatMoney(installmentAmt)} <span className="text-[16px] pb-2 text-gray-500 font-medium uppercase">{currency}</span>
                  </div>
                </div>

                <p className="text-[14px] text-gray-600 text-center mb-8 px-4 leading-relaxed">
                  Starting today, you'll be charged <strong className="text-gray-900">{formatMoney(installmentAmt)} {currency}</strong> each month for 4 months.
                </p>

                <div className="mb-8">
                  <p className="text-[14px] font-semibold text-gray-900 mb-2">Pay with</p>
                  <div className="border border-gray-300 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-black w-12 h-8 rounded-md flex items-center justify-center shadow-sm">
                        <span className="text-white text-[11px] font-bold italic">VISA</span>
                      </div>
                      <div>
                        <p className="text-[16px] text-gray-900 font-medium leading-tight">Visa •••• 1234</p>
                        <p className="text-[13px] text-gray-500">Credit</p>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <p className="text-[12px] text-gray-500 leading-relaxed mb-6 text-center">
                  By continuing, you agree to CuRemedy's terms. You can cancel at any time in your PayPal settings. No hidden fees.
                </p>

                <button onClick={handlePayPalSubmit} disabled={isProcessing} className="w-full h-14 bg-black hover:bg-gray-900 text-white font-medium text-[17px] rounded-full shadow transition-colors flex items-center justify-center relative">
                  {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin"/> : "Agree & Subscribe"}
                </button>
                
                <div className="mt-6 text-center">
                  <button onClick={() => setShowPayPalModal(false)} disabled={isProcessing} className="text-[15px] text-gray-500 font-medium hover:text-black transition-colors">
                    Cancel and return to CuRemedy
                  </button>
                </div>
              </div>
            )}
            
            <div className="bg-[#F8F8F8] py-4 text-center border-t border-gray-200 flex justify-center gap-5 text-[12px] text-gray-500 font-medium">
              <span className="hover:underline cursor-pointer">Policies</span>
              <span className="hover:underline cursor-pointer">Terms</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span>© 1999 - 2026</span>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}