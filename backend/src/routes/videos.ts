import express, { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Video from '../models/Video';
import User from '../models/User';

const router = express.Router();

// Get all videos
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find()
      .populate('uploader', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments();

    res.json({
      videos,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploader', 'username profilePicture followers');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload video
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: 'Title and videoUrl are required' });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      uploader: req.userId,
      duration,
    });

    await video.save();
    await video.populate('uploader', 'username profilePicture');

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(video, req.body);
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like video
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.userId },
        $pull: { dislikes: req.userId },
      },
      { new: true }
    );

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike video
router.post('/:id/unlike', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.userId } },
      { new: true }
    );

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search videos
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('uploader', 'username profilePicture')
      .skip(skip)
      .limit(limit);

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
