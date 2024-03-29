import { errorHandler } from "../utils/error.js";
import Post from '../models/post.js';
import User from '../models/user.js'

export const createPost = async (req, res, next) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url: "req.body.url"
            },
            owner: req.user._id
        }

        const newPost = await Post.create(newPostData);

        // Update the user's document to include the new post ID
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { post: newPost._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            newPost
        });
    } catch (err) {
        next(err);
    }
}

export const toggleLike = async (req, res, next) => {
    try{
        // Extract relevant information from the request object
        const postId = req.params.id;
        const userId = req.user._id;

        // Determine whether the user has already liked the post
        const userLiked = await Post.exists({ _id: postId, likes: userId });

        let updateOperation;

        if (userLiked) {
            // If the user has already liked the post, unlike it
            updateOperation = { $pull: { likes: userId } };
        } else {
            // If the user hasn't liked the post, like it
            updateOperation = { $push: { likes: userId } };
        }

        // Update the post document in the database
        await Post.updateOne({ _id: postId }, updateOperation);

        // Respond with a JSON indicating success, a message, and potentially updated information
        res.status(200).json({
            success: true,
            message: userLiked ? 'Post unliked successfully' : 'Post liked successfully',
            // You can send the updated likes count if needed
        });
    } catch (err){
        next(err);
    }
};


export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return next(errorHandler(404, "Post not found"));
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return next(errorHandler(401, "Unauthorized"));
        }

        // Find the post by ID and delete it
        const deletedPost = await Post.findOneAndDelete({
            _id: postId,
            owner: req.user._id,
        });

        // Check if the post exists
        if (!deletedPost) {
            return next(errorHandler(404, "Post not found or unauthorized"));
        }

        // Remove the post ID from the user's posts array using findOneAndUpdate
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $pull: { post: postId } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Post deleted"
        });
    } catch (err) {
        next(err);
    }
};

export const getPostOfFollowing = async(req, res, next) => {
    try{
        const user = await User.findById(req.user._id);
        
        const posts = await Post.find({
            owner: {
                $in: user.following,
            }
        });

        res.status(200).json({
            success: true,
            posts
        })
    } catch(err){
        next(err);
    }
}