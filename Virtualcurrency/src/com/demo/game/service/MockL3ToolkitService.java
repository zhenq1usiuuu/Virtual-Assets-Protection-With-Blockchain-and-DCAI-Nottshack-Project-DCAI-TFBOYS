package com.demo.game.service;

import com.demo.game.model.ActionLog;
import com.demo.game.model.Item;
import com.demo.game.model.SecuredTxResult;
import com.demo.game.model.TransactionRecord;
import com.demo.game.model.VerificationResult;

public class MockL3ToolkitService implements L3ToolkitService {

    private static final String L3_RPC_URL = "http://139.180.140.143/rpc/basic/ba7daf4169fe874170c29227b5749b2e/";
    private static final String DCAI_API_KEY = "ba7daf4169fe874170c29227b5749b2e";
    private static final String CONTRACT_ADDRESS = "0x...";
    private static final String REST_API_BASE = "http://139.180.140.143/api";

    private String currentWalletAddress;

    @Override
    public String initConnection() {
        currentWalletAddress = "0xDemoPlayer123456789";
        System.out.println("L3 The network and wallet are connected successfully.: " + currentWalletAddress);
        return currentWalletAddress;
    }

    @Override
    public String getDisplayBalance(String address) {
        try {
            if (address == null || address.isEmpty()) {
                throw new IllegalArgumentException("The address cannot be empty.");
            }
            return "100.50";
        } catch (Exception e) {
            System.err.println("Failed to get the balance: " + e.getMessage());
            return "0.0";
        }
    }

    @Override
    public VerificationResult verifyBehaviorOnChain(double riskScore, ActionLog actionLog) {
        try {
            System.out.println("AI verification data is being sent to L3...");
            System.out.println("riskScore = " + riskScore);
            System.out.println("actionLog = " + actionLog);

            return new VerificationResult(
                    true,
                    "0x123abc456def789",
                    null
            );
        } catch (Exception e) {
            System.err.println("DCAI Verification failed: " + e.getMessage());
            return new VerificationResult(
                    false,
                    null,
                    e.getMessage()
            );
        }
    }

    @Override
    public TransactionRecord[] fetchL3History(String address) {
        try {
            System.out.println("Pulling the record of " + address + " from Blockscout...");
            return new TransactionRecord[]{
                    new TransactionRecord("0xaaa111", "BUY", "SUCCESS", System.currentTimeMillis() - 100000),
                    new TransactionRecord("0xbbb222", "SELL", "SUCCESS", System.currentTimeMillis() - 50000)
            };
        } catch (Exception e) {
            System.err.println("Failed to pull the transaction history: " + e.getMessage());
            return new TransactionRecord[0];
        }
    }

    @Override
    public SecuredTxResult securedTransaction(Item item, double currentRiskScore) {
        final double RISK_THRESHOLD = 0.8;

        if (currentRiskScore > RISK_THRESHOLD) {
            System.out.println("🚨 Warning: Abnormal operation has been detected, and the transaction has been blocked by the local gateway  ");
            return new SecuredTxResult(
                    "Blocked",
                    "The operation is too abnormal, it is suspected that it is not me, and the assets have been locked!",
                    null,
                    "triggerRedFlash"
            );
        }

        try {
            System.out.println("✅ The verification is passed and the transaction is allowed to be executed : " + item.getName());
            return new SecuredTxResult(
                    "Secured",
                    "The transaction is in progress.",
                    "0x987xyz",
                    null
            );
        } catch (Exception e) {
            System.err.println("On-chain transaction failed: " + e.getMessage());
            return new SecuredTxResult(
                    "Error",
                    e.getMessage(),
                    null,
                    null
            );
        }
    }
}