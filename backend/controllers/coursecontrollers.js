import { Course } from "../Schema/courseSchema.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../Schema/purchase.js";

export async function createCourse(req, res) {
    const { adminId } = req;
    const { title, description, price } = req.body;

    try {
        // Check if files exist before accessing them
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const { image } = req.files;
        const allowedFormatFile = ["image/png", "image/jpg", "image/jpeg"];

        if (!allowedFormatFile.includes(image.mimetype)) {
            return res.status(400).json({ msg: "Invalid file format" });
        }

        // Upload image to Cloudinary
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
        if (!cloud_response || cloud_response.error) {
            return res.status(400).json({ msg: "Error uploading file to Cloudinary" });
        }

        // Check if all required fields are present
        if (!(title && description && price)) {
            return res.status(400).json({ msg: "Something wrong with input" });
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url
            },
            creatorId: adminId
        };

        // Create course
        await Course.create(courseData);

        return res.json({
            msg: "Course created successfully",
            course: courseData
        });

    } catch (e) {
        console.error("Error in createCourse:", e);
        return res.status(500).json({ error: e.message });
    }
}


export async function updateCourse(req,res){
    const {adminId} = req;
    const {courseId} = req.params;
    const {title,description,price,image} = req.body;
    console.log(courseId);

    try{
        const existingcourse = await Course.findById(courseId);
        if(!existingcourse){
            return res.status(400).json({
                msg : "Course to be updated not found"
            })
        }

        const course = await Course.updateOne(
            {
                _id : courseId,
                creatorId : adminId
            },
            {
                title : title || existingcourse.title,
                description : description || existingcourse.description,
                price : price || existingcourse.price,
                image :{
                public_id : image?.public_id || existingcourse.image.public_id,   // What Happens Without ?.As image is an object & If image is undefined, accessing image.public_id will cause an error:
                url : image?.url || existingcourse.image.url
            }}
        )
        res.json({
            msg : "course updated successfully"
        })

    }catch(e){
        res.status(400).json({
            error : e
        })
    }

}

export async function deleteCourse(req,res){
    const {adminId} = req;
    const {courseId} = req.params;
    if(!courseId){
        return res.status(400).json({
            msg : "course to be deleted is not found"
        })
    }

    try{
        const existingcourse = await Course.findById(courseId);
        if(existingcourse.creatorId != adminId){
            return res.status(400).json({
                msg : "you can only delete your courses and someone elseß"
            })
        }
        if(!existingcourse){
            return res.status(400).json({
                msg : "Course to be deleted not found"
            })
        }

        await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId
        });
        return res.status(200).json({
            msg : "Course deleted successfully"
        })
    }catch(e){
        return res.status(400).json({
            error : e
        })
    }
}

export async function getCourses(req,res){
    const filter = req.query.filter || "";
    
    try{
        const courses = await Course.find({
            $or: [
                { title: { $regex: filter, $options: "i" } } // ✅ Case-insensitive
            ]
        });
        return res.json({
            courses : courses
        })
    }catch(e){
        res.status(400).json({
            error : e
        })
    }
}

export async function courseDetail(req,res){
    const {courseId} = req.params;
    console.log(courseId);
    if(!courseId){
        return res.status(400).json({
            msg : "invalid Course Id"
        })
    }
    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.json({
                msg : "Course not found"
            })
        }
        return res.json({
            Course : course
        })
    } catch (e) {
        return res.status(400).json({
            error : e
        })
    }
} 

export async function buyCourse(req,res){
    const {userId} = req;
    const {courseId} = req.params;

    try {
        const course = await Course.findById(courseId);
        console.log("I am from backend the value of courseId bought is : ",course)
        if(!course){
            return res.status(400).json({
                msg : "Course not found"
            })
        }

        const alreadypurchase = await Purchase.findOne({userId,courseId})
        if(alreadypurchase){
            return res.status(400).json(
                "Course already purchased"
            )
        }

        const newpurchase = new Purchase({userId,courseId});
        await newpurchase.save()
        res.json({
            msg : `course buying successfull`,
            newpurchase
        })


    } catch (e) {
        res.status(400).json({
            error : e
        })
    }

}