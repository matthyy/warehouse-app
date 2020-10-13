# Candidate Takehome Exercise
This is a simple backend engineer take-home test to help assess candidate skills and practices.  We appreciate your interest in Voodoo and have created this exercise as a tool to learn more about how you practice your craft in a realistic environment.  This is a test of your coding ability, but more importantly it is also a test of your overall practices.

If you are a seasoned Node.js developer, the coding portion of this exercise should take no more than 1-2 hours to complete.  Depending on your level of familiarity with Node.js, Express, and Sequelize, it may not be possible to finish in 2 hours, but you should not spend more than 2 hours.  

We value your time, and you should too.  If you reach the 2 hour mark, save your progress and we can discuss what you were able to accomplish.  We do not expect you to "go the extra mile" and spend more than 2 hours on this test.  You will not get extra credit if you spend more than 2 hours.

The theory portions of this test are more open-ended.  It is up to you how much time you spend addressing these questions.  We recommend spending less than 1 hour.  For the record, we are not testing to see how much free time you have, so there will be no extra credit for monumental time investments.  We are looking for concise, clear answers that demonstrate domain expertise.

# Project Overview
This project is a simple game database and consists of 2 components.  

The first component is a Vue.js UI that communicates with an API and renders data in a simple browser-based UI.

The second component is an Express-based API server that queries and delivers data from a SQL-lite data source, using the Sequelize ORM.

This code is not necessarily representative of what you would find in a Voodoo production-ready codebase.  However, this type of stack is in regular use at Voodoo.

# Project Setup
You will need to have Node.js, NPM, and git installed locally.  You should not need anything else.

To get started, initialize a local git repo by going into the root of this project and running `git init`.  Then run `git add .` to add all of the relevant files.  Then `git commit` to complete the repo setup.  You will send us this repo as your final product.
  
Next, in a terminal, run `npm install` from the project root to initialize your dependencies.

Finally, to start the application, navigate to the project root in a terminal window and execute `npm start`

You should now be able to navigate to http://localhost:3000 and view the UI.

You should also be able to communicate with the API at http://localhost:3000/api/games

If you get an error like this when trying to build the project: `ERROR: Please install sqlite3 package manually` you should run `npm rebuild` from the project root.

# Practical Assignments
Pretend for a moment that you have been hired to work at Voodoo.  You have grabbed your first tickets to work on an internal game database application. 

#### FEATURE A: Add Search to Game Database
The main users of the Game Database have requested that we add a search feature that will allow them to search by name and/or by platform.  The front end team has already created UI for these features and all that remains is for the API to implement the expected interface.  The new UI can be seen at `/search.html`

The new UI sends 2 parameters via POST to a non-existent path on the API, `/api/games/search`

The parameters that are sent are `name` and `platform` and the expected behavior is to return results that match the platform and match or partially match the name string.  If no search has been specified, then the results should include everything (just like it does now).

Once the new API method is in place, we can move `search.html` to `index.html` and remove `search.html` from the repo.

#### FEATURE B: Populate your database with the top 100 apps
Add a populate button that calls a new route `/api/games/populate`.  This route should populate your database with the top 100 games in the app store and the google play store.  You are free to use any mean necessary to get and store the information.  Please remember that simple solutions are preferred.


# Theory Assignments
You should complete these only after you have completed the practical assignments.

The business goal of the game database is to provide an internal service to get data for all apps from all app stores.  Many other applications at Voodoo will use this API when they need to get app data. 

#### Question 1
For you what is missing in the project to make it production ready?

To me, we could improve the application from different point of view. 

The first improvements would be on the application from business point of view:
- some endpoints are missing to fetch the data according to different filters by date of publication, by kinds of games, whether it is publish or not, by app, by store, by downloads. Therefore, we should try to collect more information on those games
- the search endpoint could be enhanced : users should be able to search on different fields.
- as data is very key, we should prevent any user from getting access to it. An access system with passport js for example should be added to have an access control over data. Roles may be needed to prevent certain users from updating or inserting data.
- to be able for a game to see the number of downloads over time, be able to compare multiple games   
- a system to collect new games published. 

Improvements could be make from the dev experience/technique point of view: 
- we could improve the way of fetching and storing data. Indeed the goal is to get data for all games. Therefore every day a task should be triggered to fetch data from different platforms. Those games should be saved into the database based on whether they already existed or not or update in new information have been added. A lot of tasks will be needed to perform such system. We can image a queue system (like rabbitMQ) to launch the different jobs at different times to minimize CPU usage with a retry system in case it failed.
- modelizing games will be necessary as a lot of information will be fetched and should be organized in different tables.
- to enhance the dev experience, a docker in local could be added with a node image and database image depending on the choice
- coverage of the code should be added with nyc for instance to make sure key modules are tested.
- indexes should be added on the tables of the database for performance reasons.  
- config tooling could be added to handle database, external endpoint easily according to env.
- a logger package could be added. This would be very important in production to collect information when something goes wrong. For instance, if the external api are done, the dev team should be notified. We should anticipate it and have a backup system to fetch data later on.
- a swagger could be added. Other developers or users will know which endpoint exist today and how they can be used.
- as it is an application designed for internal purposes, this issue could be less relevant. One subject could be caching. For instance certain requests may be very demanding and should be cached   
- a watcher should be implemented to relaunch the application when it falls.   
 
Improvements could be added on the infrastructure
- a data back up system should be settled to avoid data lost or we should be able to restore a data base at a given date.  
- in order to test, different instances should be available. For exemple, we could have one dev instance, staging and preprod instances
- a kibana or collector of logs should be setup to be monitored the app in production: response time, status code, number of requests, status code of external api, etc...  
- pipelines or continous integration system should be setup in order to run units tests, integration tests, eslint, genreate swagger, production build if code is compiled. 
- a rollback system of the application when going to production

#### Question 2
To achieve the final business goal what is your Roadmap and Action plan?

To me, certain tasks are very different and can be distributed to different teams : marketing/business teams, dev teams and infrastructure teams.

Regarding the infrastructure teams, the roadmap is to set up different environments for developers, testers, preprod and production
A collector of logs and a monitoring sytem on databases, applications and servers are required to go to production. 
Similarly a rollback system of the application should be implemented and is required to go to production. 
Moreover, a continous integration system or pipelines should be implemented when going to production. 
Some key points must be discussed with the dev, for instance, indexes for data tables, environment configurations, scalability of the application etc.... 
However, those actions can be done in parallel of realizing the application.

Regarding features of the application. First thing is to give a priority to each task driven clients/users needs. What are the most important features for ending users? What information is critical and needed ? Priorities could be set like that:
First of all, a control access system should be designed. Who can fetch data, who can update it and who can save it?
Then, fetch data and save into databases 
Then, the search endpoint should be elaborated: be able to query on different fields, find games before a certain date, find most popular games, etc.. 
Then, one feature could be to compare a game to another or over time with the usage of graph. 

After setting priorities, epics or stories should be written down by project owners.
Then, developers should discuss with project owners to understand clients' needs and discuss the technical constraints.
Developers could also assess the technical difficulty of such stories. Project owner could then make a choice on priorities.

Based on those priorities and new features, developers can now organize themselves in "sprint". They are now able to split stories and epics in tasks.
Developers should also include technical tasks at the very beginning such as :
- adding a logger and thinking what information to log, when it successes, when it fails, etc...
- thinking of the model of database as information will be great
- thinking how to organize tasks to fetch data from external endpoints as they will different platforms, different kind of games, some tasks could be only to fetch new games, some to update game information, etc...  
- thinking how they will be able to test in different environment

Once those questions are addressed and priorities set, developers can start developing features.
Project owner will see how it evolves but it is also important to show every month for example to the end users how it evolves to get their feedback.  


