const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Validation function for request body
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

// Route for user authentication
router.post("/", async (req, res) => {
    try {
        // Validate request body
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Compare passwords
        const validPassword = await bcrypt.compare(req.body.password,'Srikanth@1801');
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        // Generate and send authentication token
        const token = user.generateAuthToken();
        res.status(200).send({ token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error in user authentication:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
