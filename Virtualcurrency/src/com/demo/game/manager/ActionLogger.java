package com.demo.game.manager;
import com.demo.game.model.ActionLog;

import java.util.ArrayList;
import java.util.List;

public class ActionLogger {
    private final List<ActionLog> logs = new ArrayList<>();

    public void log(String actionType, String currentIp, float x, float y) {
        ActionLog log = new ActionLog(
                actionType,
                currentIp,
                x,
                y,
                System.currentTimeMillis()
        );
        logs.add(log);
        System.out.println("记录行为: " + log);
    }

    public int getRecentActionCount(long withinMillis) {
        long now = System.currentTimeMillis();
        int count = 0;

        for (ActionLog log : logs) {
            if (now - log.getTimestamp() <= withinMillis) {
                count++;
            }
        }
        return count;
    }

    public ActionLog getLastLog() {
        if (logs.isEmpty()) {
            return null;
        }
        return logs.get(logs.size() - 1);
    }

    public List<ActionLog> getLogs() {
        return logs;
    }
}
