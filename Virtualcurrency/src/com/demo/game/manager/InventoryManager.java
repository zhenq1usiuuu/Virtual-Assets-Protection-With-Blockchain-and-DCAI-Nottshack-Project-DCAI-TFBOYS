package com.demo.game.manager;

import com.demo.game.model.Item;

public class InventoryManager {
    private final Item[] items;
    private int balance = 1000;

    public InventoryManager() {
        items = new Item[] {
                new Item("Sword", 120),
                new Item("Shield", 150),
                new Item("Potion", 50)
        };
    }

    public Item[] getItems() {
        return items;
    }

    public int getBalance() {
        return balance;
    }

    public boolean buyItem(Item item) {
        if (balance >= item.getPrice()) {
            balance -= item.getPrice();
            return true;
        }
        return false;
    }

    public void sellItem(Item item) {
        balance += item.getPrice() / 2;
    }
}
