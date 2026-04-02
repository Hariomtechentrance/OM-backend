#!/bin/bash

echo "🗄️  BLACK LOCUST DATABASE VIEWER"
echo "=================================="
echo ""

echo "📊 DATABASE COLLECTIONS:"
mongosh blacklocust --eval "db.getCollectionNames()" --quiet
echo ""

echo "👥 USERS COLLECTION:"
echo "===================="
mongosh blacklocust --eval "
db.users.find().forEach(function(user) {
  print('ID: ' + user._id);
  print('Name: ' + user.name);
  print('Email: ' + user.email);
  print('Role: ' + user.role);
  print('Phone: ' + (user.phone || 'Not provided'));
  print('Active: ' + user.isActive);
  print('Created: ' + user.createdAt);
  print('-------------------');
});
" --quiet
echo ""

echo "📦 PRODUCTS COLLECTION:"
echo "======================="
mongosh blacklocust --eval "
db.products.find().forEach(function(product) {
  print('ID: ' + product._id);
  print('Name: ' + product.name);
  print('Category: ' + product.category);
  print('Price: $' + product.price);
  print('Stock: ' + product.stock);
  print('Featured: ' + product.featured);
  print('Rating: ' + product.rating + '/5');
  print('Brand: ' + product.brand);
  print('Sizes: ' + product.sizes.join(', '));
  print('Colors: ' + product.colors.join(', '));
  print('Created: ' + product.createdAt);
  print('-------------------');
});
" --quiet
echo ""

echo "🛒 ORDERS COLLECTION:"
echo "====================="
mongosh blacklocust --eval "
var orderCount = db.orders.countDocuments();
print('Total Orders: ' + orderCount);
if (orderCount > 0) {
  db.orders.find().forEach(function(order) {
    print('Order ID: ' + order._id);
    print('User: ' + (order.user ? order.user.name : 'Unknown'));
    print('Total: $' + (order.totalPrice || 0));
    print('Status: ' + (order.status || 'Pending'));
    print('Created: ' + order.createdAt);
    print('-------------------');
  });
} else {
  print('No orders found');
}
" --quiet
echo ""

echo "📧 NEWSLETTER COLLECTION:"
echo "========================"
mongosh blacklocust --eval "
var subCount = db.newsletters.countDocuments();
print('Total Subscribers: ' + subCount);
if (subCount > 0) {
  db.newsletters.find().forEach(function(sub) {
    print('Email: ' + sub.email);
    print('Subscribed: ' + sub.createdAt);
    print('Active: ' + (sub.isActive || true));
    print('-------------------');
  });
} else {
  print('No newsletter subscribers found');
}
" --quiet
echo ""

echo "📈 DATABASE STATISTICS:"
echo "======================"
mongosh blacklocust --eval "
print('Total Users: ' + db.users.countDocuments());
print('Total Products: ' + db.products.countDocuments());
print('Total Orders: ' + db.orders.countDocuments());
print('Total Newsletter Subscribers: ' + db.newsletters.countDocuments());
print('Database Size: ' + (db.stats().dataSize / 1024 / 1024).toFixed(2) + ' MB');
" --quiet
echo ""

echo "🔑 LOGIN CREDENTIALS SUMMARY:"
echo "============================"
echo "Admin Email: admin@blacklocust.com"
echo "Admin Password: admin123"
echo "Admin Role: admin"
echo ""
echo "Test Users:"
mongosh blacklocust --eval "
db.users.find({role: 'user'}).forEach(function(user) {
  print('Email: ' + user.email + ' | Name: ' + user.name + ' | Role: ' + user.role);
});
" --quiet
echo ""

echo "📊 PRODUCT CATEGORIES:"
echo "====================="
mongosh blacklocust --eval "
db.products.distinct('category').forEach(function(cat) {
  var count = db.products.countDocuments({category: cat});
  print(cat + ': ' + count + ' products');
});
" --quiet
echo ""

echo "✅ Database view complete!"
echo "🌐 Access your admin dashboard at: http://localhost:3019/admin"
