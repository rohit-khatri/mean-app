const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + '/images/' + req.file.filename,
    createdBy: req.userData.userId
  });

  post.save().then(responseData => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...responseData,
        id: responseData._id
      }
    });
  })
  .catch(error => {
	res.status(500).json({
	  message: "Creating a post failed!"
	});
  });
}

exports.updatePost = (req, res, next) => {

  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath
  });

  Post.updateOne({_id: req.params.id, createdBy: req.userData.userId}, post)
  .then(result => {
    if(result.nModified > 0) {
      res.status(200).json({
        message: 'Post updated successfully',
        imagePath: result.imagePath
      });
    } else {
      res.status(401).json({
        message: 'Not authorized to updated this post'
      });
    }

  })
  .catch(error => {
        res.status(500).json({
          message: "Couldn't udpate post!"
        });
      });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
  .then((post) => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(4045).json({
        message: "Posts not found",
      });
    }
  })
   .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
}

exports.getAllPost = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }


  postQuery.then((documents) => {
    fetchedPosts = documents;
    return Post.countDocuments();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, createdBy: req.userData.userId})
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({'message': 'Post deleted.'});
    } else {
      res.status(401).json({'message': 'Not authorized to delete this post'});
    }

  })
  .catch(error => {
      res.status(500).json({
        message: "Deleting posts failed!"
      });
    });
}
