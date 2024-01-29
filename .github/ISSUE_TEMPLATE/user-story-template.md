---
name: user story template
about: Describe this issue template's purpose here.
title: As a [USER] I want to be able to [ ] so I can [ ]
labels: ''
assignees: ''

---

Description:

Customer enters a postcode into the website and it should display the nearest branches in the area. This would be done using the API

Value to user:

Allows users to see the nearest branches to their given postcode saving them time.

MoSCoW : Must

Definition of done:
 Check with the client to ensure it meets their satisfaction and requirements.
Code Quality:
 Code is peer-reviewed and follows the project's coding standards.

 Code is well-documented and commented.

Testing:
 Unit tests are written and pass successfully.

 Integration tests verify functionality and pass successfully.

Deployment:
 The feature is deployed to the staging environment and passes all checks.

 The feature is deployed to the production environment after final approval

Task List:
 Create database with relevant information from ATM JSON file.

 Create website to display Santander ATMs/Branches.

 Include option on website for user to enter and search for a specific location.

 Create API to fetch relevant information from database based on the location entered by the user (integrate with website to allow geolocation functionality).

 Using the fetched information from database combined with geolocation, API should provide the functionality to display the nearest Santander branches within a set radius from the location that the user has inputted.
