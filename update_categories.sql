DELETE FROM ServiceFeatures;

UPDATE ServiceCategories SET 
Name = N'Cloud VPS', 
Icon = 'dns', 
Slug = 'cloud-vps', 
DetailTitle = N'Hiệu năng cao với ổ cứng NVMe',
Description = N'Hiệu năng cao với ổ cứng NVMe và khả năng mở rộng linh hoạt. Lựa chọn hoàn hảo cho dự án lớn.',
FeaturesJson = N'["vCPU & RAM linh hoạt", "NVMe siêu tốc", "Root Access toàn quyền", "99.9% Uptime Guarantee"]'
WHERE Slug = 'cloud-vps';

UPDATE ServiceCategories SET 
Name = N'Web Hosting', 
Icon = 'web', 
Slug = 'web-hosting', 
DetailTitle = N'Giải pháp lưu trữ website',
Description = N'Giải pháp lưu trữ website ổn định, dễ dàng quản lý với cPanel/DirectAdmin.',
FeaturesJson = N'["SSD/NVMe Storage", "Free SSL Certificate", "Auto Backup daily", "Integrated Email"]'
WHERE Slug = 'web-hosting';

UPDATE ServiceCategories SET 
Name = N'Domain', 
Icon = 'public', 
Slug = 'domain', 
DetailTitle = N'Đăng ký tên miền quốc tế và Việt Nam',
Description = N'Đăng ký tên miền quốc tế và Việt Nam với công cụ quản lý DNS mạnh mẽ.',
FeaturesJson = N'["International domains", "Advanced DNS Management", "Free WHOIS Protection", "Auto Renewal options"]'
WHERE Slug = 'domain';

UPDATE ServiceCategories SET 
Name = N'Business Email', 
Icon = 'mail', 
Slug = 'business-email', 
DetailTitle = N'Email doanh nghiệp theo tên miền riêng',
Description = N'Email doanh nghiệp theo tên miền riêng, chuyên nghiệp và bảo mật cao.',
FeaturesJson = N'["Custom domains", "Advanced Spam Protection", "Large storage quotas", "Modern Webmail UI"]'
WHERE Slug = 'business-email';

UPDATE ServiceCategories SET 
Name = N'SSL Certificate', 
Icon = 'lock', 
Slug = 'ssl', 
DetailTitle = N'Bảo vệ dữ liệu truyền tải',
Description = N'Bảo vệ dữ liệu truyền tải và tăng độ tin cậy cho website của bạn với HTTPS.',
FeaturesJson = N'["Secure HTTPS", "256-bit Encryption", "Domain Validation (DV)", "High Browser Trust"]'
WHERE Slug = 'ssl';

UPDATE ServiceCategories SET 
Name = N'DDoS Firewall', 
Icon = 'shield', 
Slug = 'ddos-firewall', 
DetailTitle = N'Hệ thống tường lửa bảo vệ ứng dụng',
Description = N'Hệ thống tường lửa bảo vệ ứng dụng khỏi các cuộc tấn công mạng quy mô lớn.',
FeaturesJson = N'["Intelligent Traffic Filtering", "L3/4/7 Protection", "Real-time Monitoring", "Custom Rulesets"]'
WHERE Slug = 'ddos-fire';
