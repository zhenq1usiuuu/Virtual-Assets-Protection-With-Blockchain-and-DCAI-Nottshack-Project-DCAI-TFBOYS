package com.demo.game.model;

public class SecuredTxResult {
    private final String status;
    private final String message;
    private final String txHash;
    private final String uiAction;

    public SecuredTxResult(String status, String message, String txHash, String uiAction) {
        this.status = status;
        this.message = message;
        this.txHash = txHash;
        this.uiAction = uiAction;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public String getTxHash() {
        return txHash;
    }

    public String getUiAction() {
        return uiAction;
    }

    @Override
    public String toString() {
        return "SecuredTxResult{" +
                "status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", txHash='" + txHash + '\'' +
                ", uiAction='" + uiAction + '\'' +
                '}';
    }
}
