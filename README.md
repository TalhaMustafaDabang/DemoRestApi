# DemoRestApi

This RESTApi supports CRUD operations for Contacts.
#
Authorization And Authentication is added to Contact Routes.
#
Singup For Users, And Signin are created in User Routes.
#
Error Tracing.

#

Note: One Of The Requirement Was "multi-sessions in one go to logout from all devices".
It was a trick interview question, So my answer is . Statelessness is one of the main constraints of RESTApi, which states that:

"One client can send multiple requests to the server; however, each of them must be independent, that is, every request must contain all the necessary information so that the server can understand it and process it accordingly. In this case, the server must not hold any information about the client state. Any information status must stay on the client – such as sessions."

So Signout from all devices needs to be handled in the front end, using a subscription on the user.
