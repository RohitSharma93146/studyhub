import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";   


export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }           
        })

        res.json({
            success: true,
            message: "User role updated to educator"
        });
    }
    catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
};

// Add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if(!imageFile) {
            return res.json({
                success: false,
                message: "Image file is required"
            });
        }

        const parsedCourseData = await JSON.parse(courseData);
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData);
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save();

        res.json({ success: true, message: "Course added successfully"});
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// Get Educator's courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });

        if(courses.length === 0) {
            return res.json({
                success: false,
                message: "No courses found for this educator"
            });
        }

        res.json({
            success: true,
            courses
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Educator Dashboard Data (Total Earnings, Enrolled Students, No. of Courses)

export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Get total earnings
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
         });

        const totalEarnings = purchases.reduce((sum, purchase) => {
            return sum + purchase.amount;
        }, 0);

        // Get enrolled students
        const enrolledStudentsData = ([]);

        for(const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');
            
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({success: true, dashboardData:{
            totalEarnings, enrolledStudentsData, totalCourses
        }})
        
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
};

// Get Enrolled Students Data with purchase Data

export const getEnrolledStudentsData = async (req, res) => {
    try{
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));

        res.json({
            success: true,
            enrolledStudents
        });
    }
    catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
};