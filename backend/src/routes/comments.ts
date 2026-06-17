import express, { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Comment from '../models/Comment';
import Video from '../models/Video';

const router = express.Router();

// Get comments for video
router.get('/video/:videoId', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { content, videoId } = req.body;

    if (!content || !videoId) {
      return res.status(400).json({ message: 'Content and videoId are required' });
    }

    const comment = new Comment({
      content,
      author: req.userId,
      video: videoId,
    });

    await comment.save();
    await comment.populate('author', 'username profilePicture');

    // Add comment to video
    await Video.findByIdAndUpdate(
      videoId,
      { $push: { comments: comment._id } }
    );

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    await Video.findByIdAndUpdate(
      comment.video,
      { $pull: { comments: req.params.id } }
    );

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like comment
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.userId } },
      { new: true }
    ).populate('author', 'username profilePicture');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
