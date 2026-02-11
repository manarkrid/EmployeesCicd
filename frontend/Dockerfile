# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
# Angular 17+ with application builder outputs to dist/project-name/browser
COPY --from=build /app/dist/employee-management-frontend/browser /usr/share/nginx/html

# Copy custom nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
