"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = require("joi");
const mongoose_1 = __importDefault(require("mongoose"));
const posts_model_1 = __importDefault(require("../models/posts.model"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const validation_1 = require("../utils/validation");
const fetchAllPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageno: _pageno, itemsPerPage: _itemsPerPage } = req.query;
        const pageno = parseInt(_pageno) || 1;
        const itemsPerPage = parseInt(_itemsPerPage) || 10;
        const skip = (pageno - 1) * itemsPerPage;
        const totalPosts = yield posts_model_1.default.countDocuments();
        const posts = yield posts_model_1.default.find().skip(skip).limit(itemsPerPage);
        if (posts.length === 0)
            return res.status(404).json({ error: "posts not found!" });
        res.status(200).json({
            posts: posts,
            currentPage: pageno,
            totalPages: Math.ceil(totalPosts / itemsPerPage),
        });
    }
    catch (err) {
        next(err);
    }
});
const fetchPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        (0, joi_1.assert)(postId, (0, joi_1.string)().hex().length(24));
        const { pageno: _pageno, itemsPerPage: _itemsPerPage } = req.query;
        const pageno = parseInt(_pageno) || 1;
        const itemsPerPage = parseInt(_itemsPerPage) || 10;
        const skip = (pageno - 1) * itemsPerPage;
        const post = yield posts_model_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(postId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "postedByUser",
                },
            },
            {
                $unwind: "$postedByUser",
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "commentsOnPost",
                    pipeline: [
                        {
                            $facet: {
                                comments: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "userId",
                                            foreignField: "_id",
                                            as: "commentByUser",
                                        },
                                    },
                                    {
                                        $unwind: "$commentByUser",
                                    },
                                    {
                                        $skip: skip,
                                    },
                                    {
                                        $limit: itemsPerPage,
                                    },
                                    {
                                        $project: {
                                            _id: 0,
                                            body: 1,
                                            commentBy: "$commentByUser.username",
                                        },
                                    },
                                ],
                                meta: [
                                    { $count: "total" },
                                    {
                                        $project: {
                                            totalPages: {
                                                $ceil: { $divide: ["$total", itemsPerPage] },
                                            },
                                            currentPage: pageno.toString(),
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: "$meta",
                        },
                    ],
                },
            },
            {
                $unwind: "$commentsOnPost",
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    body: 1,
                    commentsOnPost: 1,
                    postedBy: "$postedByUser.username",
                },
            },
        ]);
        if (!post[0])
            return res.status(404).json({ error: "post not found!" });
        res.status(200).json(post[0]);
    }
    catch (err) {
        if (err instanceof joi_1.ValidationError)
            return res.status(400).json({ message: "please provide valid id" });
        next(err);
    }
});
const searchPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        (0, joi_1.assert)(keyword, (0, joi_1.string)().required());
        const posts = yield posts_model_1.default.aggregate([
            { $match: { $text: { $search: keyword } } },
            {
                $addFields: {
                    score: { $meta: "textScore" },
                },
            },
            {
                $sort: { score: -1 },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "postedByUser",
                },
            },
            {
                $unwind: "$postedByUser",
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    body: 1,
                    postedBy: "$postedByUser.username",
                    score: 1,
                },
            },
        ]);
        if (posts.length === 0)
            return res.status(404).json({ message: "post not found" });
        res.status(200).json(posts);
    }
    catch (err) {
        if (err instanceof joi_1.ValidationError)
            return res
                .status(400)
                .json({ message: "keyword is required for serch post" });
        next(err);
    }
});
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = req.body;
        newPost.userId = req.user._id;
        (0, joi_1.assert)(Object.assign({}, newPost), validation_1.postValidationSchema);
        const post = yield posts_model_1.default.create(newPost);
        res.status(201).json(post);
    }
    catch (err) {
        if (err instanceof joi_1.ValidationError)
            res.status(400).json({ message: err.message });
        next(err);
    }
});
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        (0, joi_1.assert)(postId, (0, joi_1.string)().hex().length(24));
        const post = yield posts_model_1.default.findOne({
            userId: req.user._id,
            _id: new mongoose_1.default.Types.ObjectId(postId),
        });
        if (!post)
            return res.status(404).json({ error: "post not found!" });
        post.deleteOne();
        res.status(200).json({ success: true });
    }
    catch (err) {
        if (err instanceof joi_1.ValidationError)
            return res.status(400).json({ message: "please provide valid id" });
        next(err);
    }
});
const addCommentToPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        (0, joi_1.assert)(postId, (0, joi_1.string)().hex().length(24));
        const post = yield posts_model_1.default.findById(new mongoose_1.default.Types.ObjectId(postId));
        if (!post) {
            return res.status(404).json({ error: "Post not found!" });
        }
        const newComment = req.body;
        newComment.userId = req.user._id;
        newComment.postId = post._id;
        (0, joi_1.assert)(Object.assign({}, newComment), validation_1.commentValidationSchema);
        const comment = yield comments_model_1.default.create(newComment);
        res.status(200).json(comment);
    }
    catch (err) {
        next(err);
    }
});
exports.default = {
    addPost,
    fetchAllPosts,
    fetchPostById,
    deletePost,
    addCommentToPost,
    searchPost,
};
