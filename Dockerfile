FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Expose port 6060
EXPOSE 6060

CMD ["npm", "run", "start:dev"]
