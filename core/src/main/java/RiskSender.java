package com.dcai.client;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Net;
import com.badlogic.gdx.net.HttpRequestBuilder;
import com.badlogic.gdx.net.HttpStatus;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;

public class RiskDataSender {
    // 后端风险计算接口地址（成员 C 服务）
    private static final String BACKEND_URL = "http://localhost:3000/api/risk";

    private final JsonReader jsonReader = new JsonReader();

    public interface RiskCallback {
        void onSuccess(float riskScore);
        void onFailure(String error);
    }

    public void sendRiskData(String ip, float frequency, RiskCallback callback) {
        // 构造 JSON 请求体
        String jsonBody = String.format(
            "{\"ip\":\"%s\", \"frequency\":%.3f}",
            ip, frequency
        );

        HttpRequestBuilder requestBuilder = new HttpRequestBuilder();
        Net.HttpRequest request = requestBuilder.newRequest()
            .method(Net.HttpMethods.POST)
            .url(BACKEND_URL)
            .header("Content-Type", "application/json")
            .content(jsonBody)
            .build();

        Gdx.net.sendHttpRequest(request, new Net.HttpResponseListener() {
            @Override
            public void handleHttpResponse(Net.HttpResponse httpResponse) {
                int statusCode = httpResponse.getStatus().getStatusCode();
                if (statusCode == HttpStatus.SC_OK) {
                    String responseText = httpResponse.getResultAsString();
                    try {
                        JsonValue json = jsonReader.parse(responseText);
                        float riskScore = json.getFloat("riskScore");
                        Gdx.app.log("RiskSender", "风险分响应: " + riskScore);
                        if (callback != null) callback.onSuccess(riskScore);
                    } catch (Exception e) {
                        if (callback != null) callback.onFailure("JSON解析失败: " + e.getMessage());
                    }
                } else {
                    if (callback != null) callback.onFailure("HTTP错误: " + statusCode);
                }
            }

            @Override
            public void failed(Throwable t) {
                if (callback != null) callback.onFailure("网络请求失败: " + t.getMessage());
            }

            @Override
            public void cancelled() {
                if (callback != null) callback.onFailure("请求被取消");
            }
        });
    }

    public void dispose() {
        // 无需特殊清理
    }
}
