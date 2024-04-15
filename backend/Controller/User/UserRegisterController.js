const nodemailer = require('nodemailer');

// Defining the UserRegisterController function that takes 'app' and 'db' as parameters
const UserRegisterController = (app, db) => {
  
  // Helper function to run SQL queries using db.query
  const query = async (sql, params) => {
    try {
      const [results, fields] = await db.query(sql, params);
      return results;
    } catch (error) {
      throw error;
    }
  };

  // Handling POST requests to "/register/user" endpoint for user registration
  app.post("/register/user", async (req, res) => {
    try {
      // Extracting user details from the request body
      const {
        userFullName,
        userEmail,
        userUserName,
        userPassword,
        userConfirmPassword,
        userType
      } = req.body;

      // Validate userType
      if (userType !== 'staff' && userType !== 'member') {
        return res.status(400).json({ success: false, message: "Invalid user type. User type must be 'staff' or 'member'" });
      }

      // Check if the user username already exists in the database
      const existingUsername = await query('SELECT * FROM user_login WHERE userUserName = ?', [userUserName]);
      if (existingUsername.length > 0) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }

      // Check if the user email already exists in the database
      const existingEmail = await query('SELECT * FROM user_details WHERE userEmail = ?', [userEmail]);
      if (existingEmail.length > 0) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
          service: 'Gmail', // Use your email service provider here
          auth: {
            user: 'supratikmspradhan@gmail.com', // Your email address
            pass: 'iugz owfb glta dvfe', // Your email password or app password
          },
        });
  
        // Define email options
        const mailOptions = {
          from: 'supratikmspradhan@gmail.com', // Sender address
          to: userEmail, // Recipient address
          subject: 'Welcome to Library Management System', // Subject line
          text: `Dear ${userFullName} !
          
          Thank You !! for Registering in Library Management System!!`, // Plain text body
        };
  
        // Send email
        await transporter.sendMail(mailOptions);
  
        
        console.log("email sent sucessful")
      } catch (error) {
        console.error('Error sending email:', error);
        
      }
      // Start a new database transaction for each registration
      const connection = await db.getConnection();

      try {
        // Begin the transaction
        await connection.beginTransaction();

        // Insert user details into the user_details table
        const [userDetailsResult] = await connection.query(
          'INSERT INTO user_details (userFullName, userEmail, userType, userUserName) VALUES (?, ?, ?, ?)',
          [userFullName, userEmail, userType, userUserName]
        );

        // Retrieve the user ID generated by the database
        const userId = userDetailsResult.insertId;

        // Ensure that userId is a valid non-null value before inserting into user_login
        if (!userId || userId <= 0) {
          console.error('Invalid user ID during registration:', userId);
          throw new Error('Invalid user ID');
        }

        // Insert user login details into the user_login table
        await connection.query(
          'INSERT INTO user_login (user_id, userUserName, userPassword) VALUES (?, ?, ?)',
          [userId, userUserName, userPassword]
        );

        // Commit the transaction
        await connection.commit();

        // Registration successful
        console.log("User Registered Successfully");
        res.status(201).json({ success: true, message: "User Registration Successful!" });
      } catch (err) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        console.error("Error during user registration:", err);
        res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
      } finally {
        // Release the connection
        connection.release();
      }
    } catch (error) {
      // Handle any errors that occur during the registration process
      console.error("Error during user registration:", error);
      res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
    }
  });

};

// Exporting the UserRegisterController function for external use
module.exports = UserRegisterController;
