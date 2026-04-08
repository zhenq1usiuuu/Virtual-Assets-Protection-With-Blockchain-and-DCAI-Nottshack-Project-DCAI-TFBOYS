/**
 * 游戏资产安全卫士 - L3 Web3 交互工具包 (l3_toolkit.js)
 * 负责人：成员 A (集成专家)
 * 作用：封装所有与 L3 网络、Blockscout 区块浏览器、DCAI 验证接口的通信逻辑。
 * 队友只需调用此处的导出函数，无需关心底层 RPC 和跨域细节。
 */

// 引入以太坊交互库 (确保你的项目中已通过 npm install ethers 安装)
import { ethers } from "ethers";

// ========================================== //
// 区域 0：全局配置 (仅成员 A 维护)
// ========================================== //
const L3_RPC_URL = "http://139.180.140.143/rpc/basic/ba7daf4169fe874170c29227b5749b2e/"; // 替换为官方分配的 API KEY
const DCAI_API_KEY = "ba7daf4169fe874170c29227b5749b2e"; // DCAI 专属验证密钥
const CONTRACT_ADDRESS = "0x..."; // 成员 D 部署智能合约后填入这里
const REST_API_BASE = "http://139.180.140.143/api"; // 假设的 Blockscout REST API 根路径

let provider;
let signer;
let contract; // 如果有 ABI，可在此初始化

/**
 * [供全局/初始化调用]
 * 初始化连接：唤起 MetaMask 并建立与 L3 的通信管道
 */
export const initConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
        // 连接 L3 节点
        provider = new ethers.BrowserProvider(window.ethereum);
        // 获取当前玩家的钱包授权
        signer = await provider.getSigner();
        console.log("L3 网络与钱包连接成功！", await signer.getAddress());
        return signer.getAddress();
    } else {
        console.error("请安装 MetaMask 钱包！");
        return null;
    }
};


// ========================================== //
// 区域 1：专供【成员 B (游戏开发)】的接口
// ========================================== //

/**
 * [专供 成员 B] 获取玩家游戏初始资金 (tDCAI 余额)
 * @param {string} address - 玩家的钱包地址
 * @returns {string} - 格式化后的余额 (如 "100.5")
 */
export const getDisplayBalance = async (address) => {
    try {
        if (!provider) throw new Error("请先调用 initConnection 初始化");
        const balanceWei = await provider.getBalance(address);
        // 将底层 Wei 单位转换为可视化的 Ether/tDCAI 单位
        const formattedBalance = ethers.formatEther(balanceWei);
        return formattedBalance;
    } catch (error) {
        console.error("获取余额失败:", error);
        return "0.0";
    }
};


// ========================================== //
// 区域 2：专供【成员 C (后端与 AI)】的接口
// ========================================== //

/**
 * [专供 成员 C] DCAI 链上验证网关
 * 作用：接收成员 C 算出的风险分数，发送给官方节点存证，拿回哈希。
 * @param {number} riskScore - 成员 C 计算出的风险分 (如 0.85)
 * @param {object} actionData - 当前操作数据 (IP, 点击频率等)
 * @returns {object} - 包含验证状态和存证哈希
 */
export const verifyBehaviorOnChain = async (riskScore, actionData) => {
    try {
        // 此处为伪代码：向赞助商的 DCAI L3 验证接口发送 HTTP POST 请求
        /*
        const response = await fetch("赞助商DCAI验证URL", {
            method: "POST",
            headers: { "Authorization": `Bearer ${DCAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ score: riskScore, data: actionData })
        });
        const result = await response.json();
        return { success: true, verificationHash: result.txHash };
        */
        
        console.log("正在向 L3 发送 AI 验证数据...", riskScore);
        // 模拟返回链上哈希
        return { 
            success: true, 
            verificationHash: "0x123abc456def789..." // 成员 C 拿到这个后存入数据库
        };
    } catch (error) {
        console.error("DCAI 验证失败:", error);
        return { success: false, error: error.message };
    }
};


// ========================================== //
// 区域 3：专供【成员 D (智能合约与看板)】的接口
// ========================================== //

/**
 * [专供 成员 D] 获取历史交易列表 (对接 Blockscout)
 * 作用：直接抓取格式化好的数据，成员 D 拿到后可直接 `map` 渲染到 Dashboard 上。
 * @param {string} address - 需要查询的钱包地址
 * @returns {Array} - 交易记录数组
 */
export const fetchL3History = async (address) => {
    try {
        // 使用 REST API 获取数据 (无需 ethers.js 解析复杂的十六进制)
        // 对应 Blockscout 文档中的 /transactions 接口
        /*
        const response = await fetch(`${REST_API_BASE}/v2/addresses/${address}/transactions`);
        const data = await response.json();
        return data.items; // 返回给看板的数据列表
        */
       console.log(`正在从 Blockscout 拉取 ${address} 的记录...`);
       return []; 
    } catch (error) {
        console.error("拉取交易历史失败:", error);
        return [];
    }
};


// ========================================== //
// 区域 4：全链路核心枢纽 (防毁号拦截器)
// ========================================== //

/**
 * [核心逻辑：团队整合调用] 安全交易发送器
 * 作用：成员 B 点击“卖出” -> 触发成员 C 算分 -> 调用此函数判定。如果不安全，死死拦住！
 * @param {object} txData - 交易的具体指令 (卖什么装备)
 * @param {number} currentRiskScore - 由成员 C 实时计算返回的当前风险分
 * @returns {object} - 执行结果，用于前端 UI 反馈
 */
export const securedTransaction = async (txData, currentRiskScore) => {
    const RISK_THRESHOLD = 0.8; // 黑客松演示用的写死阈值 (超过 0.8 即拦截)

    // 第一步：无情拦截 (AI 判定不通过，绝对不给链上发请求)
    if (currentRiskScore > RISK_THRESHOLD) {
        console.warn(`🚨 警告：检测到异常操作 (得分: ${currentRiskScore})！交易已被本地网关拦截。`);
        return { 
            status: "Blocked", 
            message: "操作过于异常，疑似非本人，已锁定资产！",
            uiAction: "triggerRedFlash" // 提示成员 B 闪红屏
        };
    }

    // 第二步：放行并上链
    try {
        console.log("✅ 验证通过，正在呼叫 MetaMask 签名...");
        // 演示逻辑：这里实际上会通过 signer.sendTransaction() 发起对 L3 合约的调用
        /*
        const tx = await contract.sellItem(txData.itemId);
        const receipt = await tx.wait(); // 等待出块
        return { status: "Secured", txHash: receipt.hash };
        */
        return { status: "Secured", txHash: "0x987xyz..." };
    } catch (error) {
        // 处理用户点“拒绝签名”或 Gas 不足的情况
        console.error("链上交易失败:", error);
        return { status: "Error", message: error.message };
    }
};