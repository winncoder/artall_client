# Stage 1: Build stage 
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và yarn.lock vào thư mục làm việc
COPY package.json yarn.lock ./

# Cài đặt các dependencies cần thiết cho việc build
RUN yarn install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Build ứng dụng ReactJS
RUN yarn build

# Stage 2: Production stage
FROM nginx:alpine

# Thiết lập thư mục cần thiết cho việc phục vụ tệp build của ReactJS
# Chỉnh lại đường dẫn từ /app/build thành /app/dist
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose cổng 80 để phục vụ ứng dụng ReactJS
EXPOSE 80

# Lệnh để chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
