# Internet Banking Frontend

This is the frontend repository of a group project assignment from the course **CSC13114 – Advanced Web Application Development (21KTPM1)** at VNU-HCM, University of Science. The backend repository can be visited [here](https://github.com/21CLC01-WNC-Banking/WNC-Banking-BE).

## Contributors
1. Nguyễn Quỳnh Hương ([qhuongng](https://github.com/qhuongng)) - customer portal
2. Hồ Hữu Tâm ([huutamisme](https://github.com/huutamisme)) - staff (bank clerk and admin) portal

## Technical stack
- Next.js 14 (with TypeScript and App Router)
- Redux for global state management (non-sensitive authentication info and other API-returned data that needs to be accessed by multiple components)
- Mantine for UI components
- Docker for containerization and deployment

## Features
### Common
- User authentication with **Google reCAPTCHA v2**
- Role-based authorization
- Reset password with OTP verification via email
- Proper form validation with **@mantine/form**

### Customer portal
- Internal and external transfers with OTP verification via email
  - Autofill transfer info from a list of saved recipients
  - Save recipients directly from transfer screen, with an option to add a nickname
    
- Create, fulfill, and cancel payment requests
  - Navigate to the transfer page with autofilled info directly from a received request
- View detailed transaction history, ordered by time and filtered by type or scope (internal and external)
  
- Manage saved recipients (add, edit nickname, and delete)
  - Navigate to the transfer page with autofilled info directly from a recipient's entry 
  - Create a payment request with autofilled info directly from a recepient's entry
    
- Manage account settings
  - Change password
  - Close account
    
- Real-time notifications for transfers, received payment requests, and payment request cancellations using **WebSockets**

### Staff portal
#### Bank clerk section
- Create customer accounts
  
- Deposit money into customer accounts
  - The account's initial password is auto-generated and sent to the customer's email address
    
- View detailed transaction history of a specific account, ordered by time and filtered by type

#### Admin section
- Manage bank clerk accounts (add, edit info, and delete)
- View detailed transaction history within specified date range, filtered by bank

## Demo
### Customer portal
- Deployment URL: http://18.141.180.201:3000/customer
  
- Dummy account for simple browsing:
  - Email: nguyenvana@<i></i>gmail.com
  - Password: 12345678910
    
- In case you want to try out features that require a real email address (transfering, as well as changing and resetting the password), create a customer account using the staff portal

### Staff portal
- Deployment URL: http://18.141.180.201:3000/staff
  
- Dummy bank clerk account:
  - Email: staff@<i></i>gmail.com
  - Password: staff12345
    
- Dummy admin account:
  - Email: admin@<i></i>gmail.com
  - Password: 12345678910

### Demo videos
- [Google Drive](https://drive.google.com/drive/folders/12IPHzRQrneHL5svFBMVo3vwGKmHpi4le?usp=drive_link)
  
- Description for each user flow are as follows:
  1. Bank clerk logs in, creates an account for customer 1 (C1), deposits 5 million VND into CA1, and logs out
     
  2. C1 logs in, transfers 100k VND to an internal customer, and saves the recipient
     
  3. C1 transfers 200k VND to the saved recipient from flow 2
     
  4. C1 views list of saved recipients, adds another recipient, transfers 150k VND to this recipient, and views their transaction history
     
  5. This flow is for testing real-time notifications:
     - Customer 2 (C2) logs in using another browser window, creates a payment request of 50k VND from C1
     - C1 clicks on the received notification and fulfills the requests
     - C2 receives a notification of the fulfilled request

  6. C2 views list of payment requests made

  7. C2 performs an external transfer to a random customer and views their transaction history
      
  8. Admin logs in and views transaction history with various filters
  
## Run the project locally
Please visit the [backend repository](https://github.com/21CLC01-WNC-Banking/WNC-Banking-BE) for instructions on how to run **Docker Compose** to set up both the frontend and the backend of the project locally. 




