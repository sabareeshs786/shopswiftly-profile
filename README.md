# Shopswiftly Profile Management Service
## This is the micro service of an e-commerce website named Shopswiftly that is used to manage the profile and authentication & authorization. It is developed using node.js, express.js, mongodb and more.

### Installation instructions

Follow the below steps to set up the microservice in your local machine:

#### Prerequisites
- Node package manager(npm)
- Node JS
- Git

#### Steps to install the shopswiftly-auth microservice:

1. **Clone the repository**
    ```bash
   git clone https://github.com/sabareeshs786/shopswiftly-profile
   cd shopswiftly-profile

2. **Install the dependencies**
   ```bash
   npm install

3. **Create a .env file**
   
   In this the key to decrypt the access token and refresh token should be added. And also the URI of the mongodb database and the admin email id and password. Follow the upcoming steps to do this.
   
4. **Open terminal and run the following command**
   ```bash
   node
   require('crypto').randomBytes(64).toString('hex')
   ```
   Copy the 64 characters long string that is generated

5. **Add the following lines in the .env file that is created above**
   ```bash
   ACCESS_TOKEN_SECRET=COPIED_64_CHARACTERS_LONG_STRING
   ```
   Create another 64 characters long string with same command specified above and copy it.
   ```bash
   REFRESH_TOKEN_SECRET=COPIED_64_CHARACTERS_LONG_STRING
   ```

6. **Procure a MongoDB Database Cloud Storage from AWS, GCP or Azure for free by following the below link from MongoDB Atlas**
   Link: https://youtu.be/NcN9S0DR1nU?si=pEJW7jQIBoLwZqIc

7. **Copy the database URI by following the instructions in the above link and paste it in the .env file as mentioned below**
   ```bash
   DATABASE_URI=COPIED_MONGODB_DATABASE_URI

8. **Lastly add the following lines in the .env file and specify email id and password of your own**
   ```bash
   ADMIN_EMAIL_ID=ADMIN_EMAIL_ID
   ADMIN_PASSWORD=ADMIN_PASSWORD
   ```

9. **Now run the following command to start a node.js server in development mode**
    ```bash
    npm run dev
    ```
    
10. **Install other microservices as well in the following links by following the instructions specified there**
    
    https://github.com/sabareeshs786/shopswiftly-inventory
    
    https://github.com/sabareeshs786/shopswiftly-image-server
    
    https://github.com/sabareeshs786/shopswiftly-admin-ui
    
    https://github.com/sabareeshs786/shopswiftly-user-ui

### Features and Functionalities provided by this microservice

1. **Authentication and Authorization**
   - Authentication is done using the email id and password
   - Authorization is done using the JSON Web Token(JWT)
   - There are three roles: Admin, Editor and User
   - The roles of a particular user and the userid is stored in the access token which is valid for 2 hours
   - The refresh token is used to login back without specifying the password by acquiring a new access token
   - The validity of the refresh token is 1 day and it will be stored in the database

2. **User Profile**
   - The user information such as name, gender, phone number and addresses are stored
   - These information is used to process the orders that is placed by the user
   - It is also used to recommend the most relevant products to them and also to give some suggestions

3. **Wishlist**
   - This is used to stored the products that the user likes for future purchase

4. **Ratings & Reviews**
   - This is used to store the ratings and reviews of a particular user and is still under development

### Features under development
1. Ratings and Reviews

   
