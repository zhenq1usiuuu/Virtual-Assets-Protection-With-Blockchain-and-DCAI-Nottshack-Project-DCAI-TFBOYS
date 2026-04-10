package com.demo.game.model;

public class VerificationResult {
    private final boolean success;
    private final String verificationHash;
    private final String error;

    public VerificationResult(boolean success, String verificationHash, String error) {
        this.success = success;
        this.verificationHash = verificationHash;
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getVerificationHash() {
        return verificationHash;
    }

    public String getError() {
        return error;
    }

    @Override
    public String toString() {
        return "VerificationResult{" +
                "success=" + success +
                ", verificationHash='" + verificationHash + '\'' +
                ", error='" + error + '\'' +
                '}';
    }
}
