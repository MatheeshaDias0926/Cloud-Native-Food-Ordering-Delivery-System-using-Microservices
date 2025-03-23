db.auth("admin", "admin123");

db = db.getSiblingDB("food-delivery");

db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [
    {
      role: "readWrite",
      db: "food-delivery",
    },
  ],
});

db.createCollection("users");
db.createCollection("restaurants");
db.createCollection("orders");
db.createCollection("deliveries");
db.createCollection("payments");
db.createCollection("notifications");
