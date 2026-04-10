package com.demo.game.service;

import com.demo.game.model.ActionLog;
import com.demo.game.model.Item;
import com.demo.game.model.SecuredTxResult;
import com.demo.game.model.TransactionRecord;
import com.demo.game.model.VerificationResult;

public interface L3ToolkitService {
    String initConnection();

    String getDisplayBalance(String address);

    VerificationResult verifyBehaviorOnChain(double riskScore, ActionLog actionLog);

    TransactionRecord[] fetchL3History(String address);

    SecuredTxResult securedTransaction(Item item, double currentRiskScore);
}