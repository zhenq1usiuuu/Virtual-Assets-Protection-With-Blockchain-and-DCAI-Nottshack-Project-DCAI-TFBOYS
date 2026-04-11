package com.dcai.client;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.ChangeListener;
import com.badlogic.gdx.utils.viewport.ScreenViewport;

public class DCAIGameScreen extends ScreenAdapter {

    private Stage stage;
    private Skin skin;

    // UI 组件
    private SelectBox<String> ipSelectBox;
    private Slider frequencySlider;
    private Label riskScoreLabel;
    private TextButton sendTxButton;
    private List<String> inventoryList;

    // 当前选中的数据
    private String currentIP = "本地 (127.0.0.1)";
    private float currentFrequency = 0.0f;

    // HTTP 发送器
    private RiskDataSender dataSender;

    @Override
    public void show() {
        // 1. 初始化舞台和皮肤
        stage = new Stage(new ScreenViewport());
        Gdx.input.setInputProcessor(stage);  // 让舞台能接收输入事件

        // 加载皮肤文件（放在 assets/ui/ 下）
        skin = new Skin(Gdx.files.internal("ui/uiskin.json"));

        // 2. 初始化网络发送器
        dataSender = new RiskDataSender();

        // 3. 构建 UI 布局
        Table rootTable = new Table();
        rootTable.setFillParent(true);       // 填满整个窗口
        rootTable.defaults().pad(10);        // 默认间距

        // ----- 标题 -----
        Label title = new Label("DCAI 背包与交易模拟", skin);
        rootTable.add(title).colspan(2).padBottom(20);
        rootTable.row();

        // ----- IP 模拟选择器 -----
        Label ipLabel = new Label("模拟 IP 地址：", skin);
        rootTable.add(ipLabel).left();
        ipSelectBox = new SelectBox<>(skin);
        ipSelectBox.setItems(
            "本地 (127.0.0.1)",
            "美国 (45.33.22.11)",
            "日本 (133.18.201.5)",
            "俄罗斯 (185.87.111.23)"
        );
        ipSelectBox.addListener(new ChangeListener() {
            @Override
            public void changed(ChangeEvent event, Actor actor) {
                currentIP = ipSelectBox.getSelected();
                Gdx.app.log("IP", "切换到: " + currentIP);
                // IP 变化时立刻上报
                sendRiskDataToBackend();
            }
        });
        rootTable.add(ipSelectBox).width(250);
        rootTable.row();

        // ----- 操作频率滑块 -----
        Label freqLabel = new Label("操作异常频率：", skin);
        rootTable.add(freqLabel).left();
        frequencySlider = new Slider(0f, 1f, 0.01f, false, skin);
        frequencySlider.addListener(new ChangeListener() {
            @Override
            public void changed(ChangeEvent event, Actor actor) {
                currentFrequency = frequencySlider.getValue();
                Gdx.app.log("Freq", "频率值: " + currentFrequency);
                // 你可以选择拖动时实时上报，或等用户点击按钮再上报
                // 这里为了演示效果，采用实时上报
                sendRiskDataToBackend();
            }
        });
        rootTable.add(frequencySlider).width(250);
        rootTable.row();

        // ----- 风险分数显示 -----
        riskScoreLabel = new Label("当前风险分: --", skin);
        rootTable.add(riskScoreLabel).colspan(2).padTop(20);
        rootTable.row();

        // ----- 背包列表 -----
        Label invLabel = new Label("我的背包 (DCAI 余额)：", skin);
        rootTable.add(invLabel).colspan(2).left();
        rootTable.row();

        inventoryList = new List<>(skin);
        String[] items = {
            "DCAI 代币: 5000.0",
            "密钥碎片 x3",
            "交易许可证 x1"
        };
        inventoryList.setItems(items);
        ScrollPane scrollPane = new ScrollPane(inventoryList, skin);
        rootTable.add(scrollPane).colspan(2).width(400).height(150);
        rootTable.row();

        // ----- 发送交易按钮 -----
        sendTxButton = new TextButton("发送测试交易 (需签名)", skin);
        sendTxButton.addListener(new ChangeListener() {
            @Override
            public void changed(ChangeEvent event, Actor actor) {
                // 点击时先上报最新数据，再触发交易签名
                sendRiskDataToBackend();
                requestTransactionSignature();
            }
        });
        rootTable.add(sendTxButton).colspan(2).padTop(30).width(200);

        // 将根表格添加到舞台
        stage.addActor(rootTable);
    }

    /**
     * 将当前 IP 和频率发送给后端，并更新风险分显示
     */
    private void sendRiskDataToBackend() {
        dataSender.sendRiskData(currentIP, currentFrequency, new RiskDataSender.RiskCallback() {
            @Override
            public void onSuccess(float riskScore) {
                // 注意：网络回调在非渲染线程，需要切回主线程更新 UI
                Gdx.app.postRunnable(() -> {
                    riskScoreLabel.setText("当前风险分: " + riskScore + " / 100");
                });
            }

            @Override
            public void onFailure(String error) {
                Gdx.app.error("RiskSender", "上报失败: " + error);
                Gdx.app.postRunnable(() -> {
                    riskScoreLabel.setText("当前风险分: 获取失败");
                });
            }
        });
    }

    /**
     * 请求成员 A 的交易签名发送逻辑（占位，需与成员 A 对接）
     */
    private void requestTransactionSignature() {
        Gdx.app.log("Transaction", "请求 MetaMask 签名并发送 eth_sendRawTransaction...");
        // TODO: 调用成员 A 提供的接口
        // 例如: MemberAHandler.sendTransaction(toAddress, amount);
    }

    @Override
    public void render(float delta) {
        // 清屏（深色背景）
        Gdx.gl.glClearColor(0.1f, 0.1f, 0.15f, 1);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

        // 更新并绘制舞台
        stage.act(delta);
        stage.draw();
    }

    @Override
    public void resize(int width, int height) {
        stage.getViewport().update(width, height, true);
    }

    @Override
    public void dispose() {
        stage.dispose();
        skin.dispose();
        dataSender.dispose();
    }
}
