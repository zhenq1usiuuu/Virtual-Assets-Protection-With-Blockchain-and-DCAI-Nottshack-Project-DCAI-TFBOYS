import React, { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
// 导入成员 A 编写的函数
import { getTransactionHistory } from './web3.js'; 

// 在 useEffect 中替换之前的模拟逻辑
useEffect(() => {
  const loadData = async () => {
    try {
      // 这里的地址可以是当前登录用户的地址
      const history = await getTransactionHistory("0x..."); 
      
      // 将返回的数据映射到你的 txHistory 状态中
      const formatted = history.items.map(tx => ({
        id: tx.hash,
        type: tx.to ? "Contract Call" : "Transfer",
        ip: "192.168.1.*", // IP 通常由后端成员 C 提供，此处可保持模拟
        risk: Math.floor(Math.random() * 30), // 演示逻辑
        status: "Secured✓"
      }));
      setTxHistory(formatted);
    } catch (err) {
      console.error("加载 L3 数据失败:", err);
    }
  };
  
  loadData();
}, []);

const L3Dashboard = () => {
  // 此处通过 ethers.js 读取 L3 链上交易记录
  
  const [heartRateData, setHeartRateData] = useState([]);
  const verificationHash = "0x8f3c...9a2b"; // 示例哈希

  // 模拟 AI 风险得分的实时心电图波动数据
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateData(prev => {
        // 生成具有波动感的随机得分
        const newScore = 50 + Math.random() * 40 - 20; 
        const newData = [...prev, { time: Date.now(), score: newScore }];
        // 保持最新的 30 个数据点以形成动态波形
        return newData.slice(-30); 
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // 模拟滚动交易历史数据
  const txHistory = [
    { id: 1, type: "Transfer", ip: "192.168.1.12", risk: 15, status: "Secured✓" },
    { id: 2, type: "Swap", ip: "10.0.0.45", risk: 92, status: "Blocked×" },
    { id: 3, type: "Approve", ip: "172.16.0.8", risk: 8, status: "Secured✓" },
    { id: 4, type: "Mint", ip: "8.8.8.8", risk: 75, status: "Blocked×" },
    { id: 5, type: "Transfer", ip: "192.168.1.15", risk: 22, status: "Secured✓" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-mono">
      {/* 头部标题区 */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-black text-cyan-400 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] uppercase">
          L3 Decentralized Verification Node
        </h1>
        <p className="text-cyan-600/70 mt-2 tracking-widest text-sm">TRANSPARENT • SECURE • REAL-TIME</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        
        {/* 模块 1: AI Security Insights */}
        <div className="bg-gray-900 border border-cyan-500/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
          <h2 className="text-2xl text-cyan-300 mb-6 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            AI Security Insights
          </h2>

          {/* 验证哈希 (Verification Hash) */}
          <div className="bg-black/60 p-4 rounded-lg mb-8 border border-gray-800 flex justify-between items-center backdrop-blur-sm">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Verification Hash</span>
            <span className="text-green-400 font-bold tracking-widest font-mono text-lg drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
              {verificationHash}
            </span>
          </div>

          {/* 心率图形式的风险得分实时展示 */}
          <div className="relative h-48 w-full bg-gray-950/50 rounded-lg border border-gray-800/50 p-2">
            <div className="absolute top-2 left-2 text-xs text-cyan-700 uppercase">Risk Fluctuation</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <YAxis domain={[0, 100]} hide />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22d3ee" // Cyan-400
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false} // 关闭动画以模拟真实心电图刷新
                  style={{ filter: 'drop-shadow(0px 0px 5px rgba(34,211,238,0.8))' }}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* 扫描线特效 */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(34,211,238,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
          </div>
        </div>

        {/* 模块 2: 滚动交易历史 */}
        <div className="bg-gray-900 border border-purple-500/40 p-6 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-600"></div>
          <h2 className="text-2xl text-purple-300 mb-6 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Live Transaction Log
          </h2>
          
          <div className="overflow-hidden h-[300px] relative">
            {/* 渐变遮罩用于滚动边缘淡出 */}
            <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-gray-900 to-transparent z-10"></div>
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
            
            {/* 假设在实际项目中这里会添加 CSS 动画 (如 animate-marquee) 来实现垂直滚动 */}
            <div className="flex flex-col space-y-4 pt-4">
              {txHistory.map(tx => (
                <div 
                  key={tx.id} 
                  className={`flex justify-between items-center p-4 rounded-lg border border-gray-800 bg-gray-950/80 backdrop-blur transition-all
                  ${tx.status.includes('Secured') ? 'hover:border-green-500/30' : 'hover:border-red-500/30'}`}
                >
                  <div className="flex flex-col w-1/4">
                    <span className="text-xs text-gray-500 uppercase">Type</span>
                    <span className="text-sm text-gray-200">{tx.type}</span>
                  </div>
                  <div className="flex flex-col w-1/4">
                    <span className="text-xs text-gray-500 uppercase">IP Source</span>
                    <span className="text-sm text-gray-400">{tx.ip}</span>
                  </div>
                  <div className="flex flex-col w-1/4 text-center">
                    <span className="text-xs text-gray-500 uppercase">Risk Score</span>
                    <span className={`text-lg font-bold ${tx.risk > 80 ? 'text-red-400' : 'text-cyan-400'}`}>
                      {tx.risk}
                    </span>
                  </div>
                  <div className="w-1/4 text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                      ${tx.status.includes('Secured') 
                        ? 'bg-green-500/10 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                        : 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(248,113,113,0.2)]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default L3Dashboard;