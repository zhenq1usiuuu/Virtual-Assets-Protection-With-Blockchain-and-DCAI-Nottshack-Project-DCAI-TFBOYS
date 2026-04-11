// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DCAIToken is ERC20, Ownable {
    // 风险分映射（用户地址 => 当前风险值 0~100）
    mapping(address => uint256) public riskScores;
    
    // 风险拦截阈值（超过该值禁止转账）
    uint256 public constant RISK_THRESHOLD = 70;
    
    // 风险更新事件（供后端/Dashboard监听）
    event RiskScoreUpdated(address indexed user, uint256 newScore);
    event TransferBlocked(address indexed from, address indexed to, uint256 amount, uint256 riskScore);

    constructor() ERC20("DCAI Token", "DCAI") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // ----- 核心拦截逻辑：重写 transfer 与 transferFrom -----
    function transfer(address to, uint256 amount) public override returns (bool) {
        _checkRisk(msg.sender);
        _transfer(_msgSender(), to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _checkRisk(from);
        _spendAllowance(from, _msgSender(), amount);
        _transfer(from, to, amount);
        return true;
    }

    // 内部风险校验函数
    function _checkRisk(address user) internal view {
        uint256 score = riskScores[user];
        require(score <= RISK_THRESHOLD, "DCAI: Risk score too high, transfer blocked");
    }

    // ----- 风险分更新（仅 Owner / 后端调用）-----
    function updateRiskScore(address user, uint256 newScore) external onlyOwner {
        require(newScore <= 100, "Score must be 0-100");
        riskScores[user] = newScore;
        emit RiskScoreUpdated(user, newScore);
        
        // 若当前风险超阈值，可额外记录拦截事件（可选）
        if (newScore > RISK_THRESHOLD) {
            emit TransferBlocked(user, address(0), 0, newScore);
        }
    }

    // ----- 批量更新（便于后端同步）-----
    function batchUpdateRiskScores(address[] calldata users, uint256[] calldata scores) external onlyOwner {
        require(users.length == scores.length, "Length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            require(scores[i] <= 100, "Score must be 0-100");
            riskScores[users[i]] = scores[i];
            emit RiskScoreUpdated(users[i], scores[i]);
        }
    }

    // 销毁代币（演示“毁号”效果）
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}