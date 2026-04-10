package com.demo.game.model;

public class ActionLog {
    private final String actionType;
    private final String currentIp;
    private final float clickX;
    private final float clickY;
    private final long timestamp;

    public ActionLog(String actionType, String currentIp, float clickX, float clickY, long timestamp) {
        this.actionType = actionType;
        this.currentIp = currentIp;
        this.clickX = clickX;
        this.clickY = clickY;
        this.timestamp = timestamp;
    }

    public String getActionType() {
        return actionType;
    }

    public String getCurrentIp() {
        return currentIp;
    }

    public float getClickX() {
        return clickX;
    }

    public float getClickY() {
        return clickY;
    }

    public long getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "ActionLog{" +
                "actionType='" + actionType + '\'' +
                ", currentIp='" + currentIp + '\'' +
                ", clickX=" + clickX +
                ", clickY=" + clickY +
                ", timestamp=" + timestamp +
                '}';
    }
}
