// 引入 Express (因为启用了 ES Module，这里改为 import)
import express from 'express';
// 【修改点 1】：引入成员 A 提供的工具函数
import { verifyBehaviorOnChain } from './l3_toolkit.js';

const app = express();
app.use(express.json());

// ... (calculateIPAnomaly 和 calculateOperationAnomaly 函数保持不变) ...
function calculateIPAnomaly(ip) { return Math.random(); }
function calculateOperationAnomaly(clickFrequency, path) {
    let score = 0;
    if (clickFrequency > 50) score += 0.5;
    if (clickFrequency > 100) score += 0.3;
    const sensitivePaths = ['/api/payment', '/api/reward', '/api/bypass'];
    if (sensitivePaths.includes(path)) score += 0.2;
    return Math.min(score, 1.0);
}

app.post('/audit/analyze', async (req, res) => {
    try {
        const { ip, clickFrequency, path } = req.body;
        if (!ip || clickFrequency === undefined || !path) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        const ipAnomalyScore = calculateIPAnomaly(ip);
        const opAnomalyScore = calculateOperationAnomaly(clickFrequency, path);
        const riskScore = (ipAnomalyScore * 0.4) + (opAnomalyScore * 0.6);

        const THRESHOLD = 0.7;
        const processStatus = riskScore >= THRESHOLD ? '拦截' : '通过';

        const behaviorSummary = {
            client_ip: ip,
            event_path: path,
            calculated_risk: riskScore.toFixed(4),
            timestamp: Date.now()
        };

        // 【修改点 2】：调用成员 A 的 L3 验证接口，取代原先的模拟变量
        let validationHash = null;
        try {
            console.log("正在请求 L3 节点进行 DCAI 验证...");
            // 传入计算好的分数和行为数据
            const l3Response = await verifyBehaviorOnChain(riskScore, behaviorSummary);
            
            if (l3Response.success) {
                // 成功拿到 A 接口返回的 txHash
                validationHash = l3Response.verificationHash; 
            } else {
                console.warn("L3 验证未成功返回哈希:", l3Response.error);
                validationHash = "FAILED";
            }
        } catch (err) {
            console.error("调用 l3_toolkit 发生异常:", err);
            validationHash = "ERROR";
        }

        const auditLog = {
            ip: ip,
            score: riskScore.toFixed(4),
            status: processStatus,
            l3_hash: validationHash, // 此时这里将变成真实的链上哈希 (或报错状态)
            createdAt: new Date().toISOString()
        };

        // 此处可以继续保留 console.log，或者后续写入你自己的 MySQL/MongoDB
        console.log('[Audit Log Record]:', auditLog);

        return res.status(200).json({
            success: true,
            data: {
                risk_score: riskScore.toFixed(4),
                action: processStatus,
                verify_hash: validationHash
            }
        });

    } catch (error) {
        console.error('Audit Service Error:', error);
        return res.status(500).json({ error: '审计服务内部错误' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`安全审计服务已启动，监听端口: ${PORT}`);
});