import { ethers } from "ethers";

// ============================================================================
// --- 成员 A: L3 基础设施与公共配置区 ---
// ============================================================================

// 统一管理 API Key 的获取逻辑 (建议项目实战中使用 .env)
const getApiKey = () => process.env.NEXT_PUBLIC_API_KEY || "ba7daf4169fe874170c29227b5749b2e";

// 赞助商 L3 节点基础地址
const BASE_RPC_URL = "http://139.180.140.143/rpc/basic";

// 初始化 JsonRpcProvider (严格遵守分工文档的 API 设置)
const rpcUrl = `${BASE_RPC_URL}/${getApiKey()}/`;
const provider = new ethers.JsonRpcProvider(rpcUrl);


// ============================================================================
// --- 成员 A: 核心功能导出区 ---
// ============================================================================

/**
 * 1. 查询账户余额 (eth_getBalance)
 * @param {string} address - 用户的钱包地址
 */
export async function getBalance(address) {
  try {
    const balanceWei = await provider.getBalance(address);
    return ethers.formatEther(balanceWei);
  } catch (error) {
    console.error("查询余额失败:", error);
    throw error;
  }
}

/**
 * 2. 调用合约只读状态 (eth_call)
 * @param {string} contractAddress - 智能合约地址
 * @param {Array} abi - 合约的 ABI
 * @param {string} methodName - 调用的只读方法名
 * @param {Array} [args=[]] - 方法参数列表
 */
export async function contractCall(contractAddress, abi, methodName, args = []) {
  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return await contract[methodName](...args); // 内部会自动封装 eth_call
  } catch (error) {
    console.error(`查询合约 ${methodName} 失败:`, error);
    throw error;
  }
}

/**
 * 3. 广播已签名的原始交易 (eth_sendRawTransaction)
 * @param {string} signedTx - 经由 Signer 签名的交易十六进制字符串
 */
export async function sendRawTransaction(signedTx) {
  try {
    return await provider.broadcastTransaction(signedTx);
  } catch (error) {
    console.error("广播原始交易失败:", error);
    throw error;
  }
}

/**
 * 4. 获取交易历史 (Blockscout REST API)
 * @param {string} address - 需要查询的地址
 */
export async function getTransactionHistory(address) {
  try {
    const url = `${BASE_RPC_URL}/${getApiKey()}/addresses/${address}/transactions`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("获取交易历史失败:", error);
    throw error;
  }
}

/**
 * 5. 获取代币转移记录 (Blockscout REST API)
 * @param {string} address - 需要查询的地址
 */
export async function getTokenTransfers(address) {
  try {
    const url = `${BASE_RPC_URL}/${getApiKey()}/addresses/${address}/token-transfers`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("获取代币转移记录失败:", error);
    throw error;
  }
}

/**
 * 6. 钱包桥接逻辑：连接 MetaMask 并返回 Signer (确保交易授权)
 * 此方法不仅返回地址，还返回 ethers 的 signer 对象，用于后续的交易签名
 * @returns {Promise<{address: string, signer: ethers.Signer}>}
 */
export async function connectMetaMaskAndGetSigner() {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    throw new Error("请在浏览器中安装 MetaMask 插件");
  }

  try {
    // 使用 ethers V6 推荐的 BrowserProvider 包装 window.ethereum
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    
    // 触发 MetaMask 弹窗授权
    await browserProvider.send("eth_requestAccounts", []);
    
    // 获取具备签名能力的 Signer 对象
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    return { address, signer };
  } catch (error) {
    console.error("MetaMask 连接/授权失败:", error);
    throw error;
  }
}