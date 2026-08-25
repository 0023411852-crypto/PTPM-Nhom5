#!/bin/bash
# Script sao lưu Database SQL Server chạy trên Docker
# Nên đưa vào Cronjob chạy hàng ngày: 0 2 * * * /path/to/backup.sh

# Cấu hình
CONTAINER_NAME="sqlserver-db"
SA_PASSWORD="YourStrong!Passw0rd"
DB_NAME="CloudServiceDB_v2"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${DB_NAME}_${DATE}.bak"

# Tạo thư mục chứa backup nếu chưa có
mkdir -p $BACKUP_DIR

echo "Bắt đầu backup database ${DB_NAME}..."

# Chạy lệnh backup trong container
docker exec $CONTAINER_NAME /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "${SA_PASSWORD}" -C -Q "BACKUP DATABASE [${DB_NAME}] TO DISK = N'/var/opt/mssql/data/${BACKUP_FILE}' WITH NOFORMAT, NOINIT, NAME = '${DB_NAME}-Full Database Backup', SKIP, NOREWIND, NOUNLOAD, STATS = 10"

# Copy file backup từ container ra ngoài Host
docker cp $CONTAINER_NAME:/var/opt/mssql/data/${BACKUP_FILE} ${BACKUP_DIR}/${BACKUP_FILE}

# Xóa file backup tạm trong container để tiết kiệm dung lượng
docker exec $CONTAINER_NAME rm /var/opt/mssql/data/${BACKUP_FILE}

echo "Backup thành công: ${BACKUP_DIR}/${BACKUP_FILE}"

# (Tuỳ chọn) Chỉ giữ lại 7 bản backup gần nhất
find $BACKUP_DIR -name "*.bak" -type f -mtime +7 -exec rm {} \;
echo "Đã dọn dẹp các bản backup cũ hơn 7 ngày."
