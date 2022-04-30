# Getting Started with *PARTNER HERO SPOITIFY INTEGRATION* Node App (Backend Deployment)


Runs the app in the development mode.\
Open [https://lit-dawn-26115.herokuapp.com/](https://lit-dawn-26115.herokuapp.com/) to view it in your browser.

This is the backend development developed using Node. This controls the spotify login authentication process.

## NOTE ⚠️
*Please note that the config.env file has been removed from the git repository as instructed. It will be forwarded to the assessment supervisor as an email.
Also, Spotify requires a limit of 25 users to be able to access the application, for testing it will be expected to use my details for testing which will also 
be forwarded to the assessment supervisor, or preferably a test user can forward their spotify fullname and email to the email address: johndele94@gmail.com
and I will add it. 👌*


## Database
The database used fo this was MongoDB NoSQL.

## Deployment
Using Heroku, Deployment was made possible using the Heroku Node.js buildpack

## Implementations
* Login Screen through Spotify’s authentication method.
* Logout methods.
* Display all song descriptions within the “New Releases” and “My Library” in the form of thumbnail previews with their respective album art, title and action button
* Display all song descriptions within the result section on the home screen in the form of rows alongside their action button.
* Save only the necessary user and songs information within Firebase *(mongoDB was used instead)*
* Ability to see and remove any of the songs saved to “My Library” from anywhere they may be accessible from (as for example, the results within the Home Page and the New Releases section).
* Ability to see and add any of the songs from New Releases and Search Results.
* Ability to be able to scale the application by changing the window’s dimension without ruining the proposed design (Mobile friendly).
* Display proper error messages when the HTTP request cannot be completed.
* Unit testing for the functionality.

## Limitations
The following were not acheivable due to limited time
* Export “My Library” to my Spotify account as a new playlist.
* Save “My Library” data into the redux store while it is being used in the app.
* Typescript as a template for your React project.
* Persisting favorited data on a NoSQL Database (Firebase, Mongo, etc.).

## Addtions that could have been added if available time was not limited
* Feedback response when a song is added or removed from My Library
* A sort for "New Release" to get songs that are and/ or not in my Library
