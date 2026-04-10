package com.demo.game.manager;

public class RiskManager {
    private boolean highRisk = false;

    public void evaluateRisk(int recentActionCount, int ipSwitchCount) {
        highRisk = recentActionCount >= 8 || ipSwitchCount >= 3;
    }

    public boolean isHighRisk() {
        return highRisk;
    }
}
