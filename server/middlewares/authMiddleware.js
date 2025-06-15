import {clerkClient} from "@clerk/express";


const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;

        // Fetch user metadata
        const response = await clerkClient.users.getUser(userId);
        const role = response.publicMetadata.role;

        // Check if the user is an educator
        if (role !== 'educator') {
            return res.status(403).json({
                success: false,
                message: "Access denied. You must be an educator to perform this action."
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export default protectEducator;