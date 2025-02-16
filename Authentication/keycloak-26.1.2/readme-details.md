keyclock

- Keycloak is an open-source Identity and Access Management (IAM) solution that provides authentication and authorization services. It supports Single Sign-On (SSO), OAuth2, OpenID Connect (OIDC), and SAML, making it a great choice for securing applications.


1. Realm
A realm in Keycloak is a space where users, roles, clients, and identity providers are managed.

It acts as an isolated environment for authentication and authorization.
Each realm has its own users, roles, groups, and settings.
You can have multiple realms on a single Keycloak instance (e.g., one for development and another for production).
The default realm is called master, but you can create custom realms.
💡 Example:
If you are building a multi-tenant application, you can create a separate realm for each tenant (company1, company2, etc.).

2. Client
A client in Keycloak represents an application that wants to use Keycloak for authentication.

A client can be a web app, mobile app, backend service, or even an API.
Clients use different authentication methods like OAuth 2.0, OpenID Connect, or SAML.
Clients can define roles and protocol mappers to customize user authentication.

- Example:
If you have a React frontend and a FastAPI backend, both can be registered as separate clients in Keycloak.

How Realms and Clients Work Together
A user logs into Keycloak within a specific realm.
The user is authenticated and receives a token.
The user accesses an application (client) with the token.
The application verifies the token with Keycloak before granting access.

`keyclock`

- Option 1: Use Keycloak's Built-in Login Page (No Custom Frontend)
Keycloak provides a ready-to-use authentication page.
Your users will be redirected to the Keycloak login page when they try to sign in.
After successful login, Keycloak redirects them back to your app with an authentication token.

- Option 2: Build a Custom React Frontend
You create a login page in React using the Keycloak JS adapter (keycloak-js).
The React app communicates with Keycloak directly via OAuth 2.0 / OpenID Connect.
The user logs in without being redirected to Keycloak’s UI.


AdmiURL -  http://localhost:8080/admin
realmURL - http://localhost:8080/realms/myrealm/account ( user login )