package com.demo.game.model;

public class TransactionRecord {
    private final String txHash;
    private final String type;
    private final String status;
    private final long timestamp;

    public TransactionRecord(String txHash, String type, String status, long timestamp) {
        this.txHash = txHash;
        this.type = type;
        this.status = status;
        this.timestamp = timestamp;
    }

    public String getTxHash() {
        return txHash;
    }

    public String getType() {
        return type;
    }

    public String getStatus() {
        return status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return "TransactionRecord{" +
                "txHash='" + txHash + '\'' +
                ", type='" + type + '\'' +
                ", status='" + status + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
