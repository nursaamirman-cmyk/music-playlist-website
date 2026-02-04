Music Playlist API
Project Overview This is a REST API for managing a music collection. Users can register, manage their profile, and create a personal playlist of songs.

Setup & Installation
Clone the repository:
git clone <https://github.com/nursaamirman-cmyk/music-playlist-website.git>
cd music-api

Install dependencies:
npm install

Environment Variables:
PORT=5000
MONGO_URI=mongodb://localhost:27017/music_db
JWT_SECRET=Nursaya@@7

Run the server:
# Development mode
npm run dev

# Production mode
npm start

API Documentation
1. Authentication (Public)
Method,Endpoint,Description
POST,/api/auth/register,Registration of new user
POST,/api/auth/login,Login and getting  JWT token

2. User Profile (Private)
Method,Endpoint,Description,Access
GET,/api/users/profile,Get your profile data,Private (JWT)
PUT,/api/users/profile,Update profile information ,Private (JWT)

3. Songs Management (Private)
Method,Endpoint,Description,Access
POST,/api/resource,Adding new song ,Private (JWT)
GET,/api/resource,Getting user's all song ,Private (JWT)
GET,/api/resource/:id,Getting details of the musi,Private (JWT)
PUT,/api/resource/:id,Update Song Data,Private (JWT)
DELETE,/api/resource/:id,Remove the song from the list ,Private (JWT)

Security & Validation
JWT Authentication: All private endpoints are protected by middleware.
Password Hashing: Passwords are stored in encrypted form using bcrypt.
Error Handling: A global error handler is implemented to return clear messages.
Data Validation: Incoming data is validated before being saved to the database.