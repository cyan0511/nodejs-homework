# What enviorment are we creating
FROM node:18

# Where is all the code going to lie in this enviroment
WORKDIR /app

# What is needed for this enviroment to run properly and where are we storing it in our folder
COPY package*.json ./

# What command is needed to run for this app to work
RUN npm install

# What code am I copying, and where is it going (first . is copy everything, second . is put it in the root of the directory)
COPY . .

# Send over any .env variables to the environment
ENV PORT=${PORT}
ENV DB_HOST=${DB_HOST}
ENV SECRET_KEY=${SECRET_KEY}
ENV GMAIL_PASSWORD=${GMAIL_PASSWORD}
ENV GMAIL_EMAIL=${GMAIL_EMAIL}

# What Port is our environment listening for
EXPOSE 3000

# How do we start the app
CMD ["npm", "run", "start:dev" ]