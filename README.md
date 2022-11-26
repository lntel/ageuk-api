
<p align="center">
  <img src="https://www.ageuk.org.uk/globalassets/age-uk/media/logos/age-uk-logo-no-strap.png">
</p>

# Age UK API
## Description
This is the Age UK RESTful API (Application Programming Interface) built using [NestJS](https://nestjs.com/). This API controls all of the actions of the primary application and all of its entities. 

## Installation
Detailed below are steps required to setup and install this project.

Within a command prompt or powershell within the directory of the project and run the following commands to install the dependencies: `npm install` or `yarn`

## Database Connectivity

The API connects to Postgres directly using NestJS's in-built [Typeorm integration](https://docs.nestjs.com/recipes/sql-typeorm). This database connection is established using database credentials extracted by the [NestJS Configuration Manager](https://docs.nestjs.com/techniques/configuration#configuration) which reads configuration values directly from the `.env` environmental variables. Since the `.env` file is included within the `.gitignore`, all of the database configuration values are kept safe.

### Configuration

Below is the required `.env` configuration values.

```.env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=root
DATABASE_NAME=ageuk
```

The system does however, have default configuration values if the environmental variables do not exist. These default values are within the code above.

## Security
This project uses [JWT (JSON Web Token)](https://en.wikipedia.org/wiki/JSON_Web_Token) to authorise and authenticate staff on the platform. This JWT contains the data listed below.

```json
{
  emailAddress: staff.emailAddress,
  sub: staff.id
}
```

The platform uses both an access token and refresh token so that staff members are frequently authenticated to ensure that the security and integrity of the platform is maintained. Once a staff member logs into the system, they are issued both an access token and refresh token. The access token will expiry **every 15 minutes**. Once an access token expires, the refresh token will be required to gain a new access token to the system. If no refresh token is present, the system will refuse access to the staff member and request that they sign in again. The refresh token has an expiry of **1 week**.

### Configuration