# Travelora

Travelora is a full-stack hotel and travel listing web application built with Node.js, Express, MongoDB, and EJS. It allows users to browse listings, add new accommodation entries, upload hotel images, and leave reviews.

The app follows a classic MVC-style structure and includes authentication, session management, and flash messaging for a complete booking/travel listing experience.

## Features

- Hotel/travel listing browsing
- Create, edit, and delete listings
- User signup, login, and logout
- Passport-based local authentication
- Review system for listings
- Cloudinary-powered image upload
- Session-based user state
- Flash notifications for success/error messages
- Express + MongoDB backend with EJS views

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS templating
- Passport.js + passport-local-mongoose
- Cloudinary
- Multer
- Connect Flash
- Connect Mongo
- Joi validation

## Project Structure

```bash
Travelora/
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── package-lock.json
├── schema.js
├── .gitignore
├── controllers/
│   └── listing.js
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/
├── routes/
│   ├── lisitng.js
│   ├── review.js
│   └── user.js
├── uploads/
├── util/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── error.ejs
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
└── README.md
