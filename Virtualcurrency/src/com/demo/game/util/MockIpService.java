package com.demo.game.util;

public class MockIpService {
    private final String[] ips = {"CN", "US", "SG", "EU"};
    private int currentIndex = 0;
    private int switchCount = 0;

    public String getCurrentIp() {
        return ips[currentIndex];
    }

    public String switchIp() {
        currentIndex = (currentIndex + 1) % ips.length;
        switchCount++;
        return getCurrentIp();
    }

    public int getSwitchCount() {
        return switchCount;
    }
}
