// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// 此处配置 L3 合约部署参数

contract AssetSecurity {
    
    // 用户安全配置结构体
    struct SecurityConfig {
        uint8 riskThreshold; // 允许的最大风险分 (0-100)
        bool isConfigured;
    }

    // 使用 mapping 存储用户安全配置
    mapping(address => SecurityConfig) public userConfigs;

    // 记录验证结果的事件
    event TransactionValidated(address indexed user, uint8 aiRiskScore, string status);

    // 用户设置自己的风险阈值
    function setSecurityConfig(uint8 _threshold) external {
        require(_threshold <= 100, "Risk score must be between 0 and 100");
        userConfigs[msg.sender] = SecurityConfig({
            riskThreshold: _threshold,
            isConfigured: true
        });
    }

    // 根据传入的 AI 风险分执行放行或拦截逻辑
    function validateTransaction(uint8 aiRiskScore) external returns (bool) {
        SecurityConfig memory config = userConfigs[msg.sender];
        require(config.isConfigured, "User security config not found");

        if (aiRiskScore <= config.riskThreshold) {
            // 放行逻辑：风险分在允许范围内
            emit TransactionValidated(msg.sender, aiRiskScore, "Secured");
            // TODO: 执行资产转移等具体操作
            return true;
        } else {
            // 拦截逻辑：风险分超出阈值
            emit TransactionValidated(msg.sender, aiRiskScore, "Blocked");
            // 触发回滚或记录异常
            return false;
        }
    }
}